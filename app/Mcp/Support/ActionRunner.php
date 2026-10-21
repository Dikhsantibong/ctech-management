<?php

namespace App\Mcp\Support;

use App\Models\User;
use App\Services\MenuAccess;
use BackedEnum;
use Closure;
use DateTimeInterface;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Support\Responsable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Facade;
use Illuminate\Support\ViewErrorBag;
use Illuminate\Validation\ValidationException;
use Inertia\Support\SessionKey;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Menjalankan aksi MCP dengan memanggil method controller yang sama dengan halaman web.
 *
 * Controller menerima Request internal berisi data dari Claude dan pengguna yang
 * menyetujui koneksi OAuth, sehingga validasi, log aktivitas, perhitungan total,
 * notifikasi, dan publikasi berjalan persis seperti saat dipakai lewat browser.
 * Penulisan dibungkus transaksi: bila gagal, tidak ada data yang setengah tersimpan.
 */
class ActionRunner
{
    /** Batas kasar ukuran hasil agar tidak membanjiri percakapan Claude. */
    private const MAX_OUTPUT_BYTES = 120_000;

    /** Atribut yang tidak boleh ikut dijadikan nilai awal update. */
    private const NEVER_PREFILL = ['password', 'remember_token', 'two_factor_secret', 'two_factor_recovery_codes', 'credentials'];

    public function __construct(private MenuAccess $menus) {}

    /**
     * Alasan penolakan, atau null bila pengguna boleh menjalankan aksi.
     */
    public function denialReason(?User $user, McpAction $action): ?string
    {
        if (! $user) {
            return 'Koneksi belum terautentikasi.';
        }

        if ($action->role !== null && $user->role !== $action->role) {
            return "Aksi {$action->key} khusus untuk role {$action->role}.";
        }

        if (! $this->menus->allows($user->role, $action->menu)) {
            return "Role Anda tidak memiliki akses ke menu \"{$action->menu}\". Minta direktur utama membukanya di Hak Akses Menu.";
        }

        return null;
    }

    /**
     * Aksi yang boleh dijalankan pengguna, dikelompokkan per modul.
     *
     * @return array<string, array<int, McpAction>>
     */
    public function availableFor(User $user, ?string $module = null): array
    {
        return collect(ActionRegistry::all())
            ->filter(fn (McpAction $action): bool => ($module === null || $action->module === $module) && $this->denialReason($user, $action) === null)
            ->groupBy(fn (McpAction $action): string => $action->module)
            ->map(fn ($actions) => $actions->values()->all())
            ->all();
    }

    /**
     * Aturan validasi asli controller untuk sebuah aksi tulis.
     *
     * @param  array<string, mixed>  $ids
     * @return array<string, string>|null null bila controller tidak memakai $request->validate()
     */
    public function rules(User $user, McpAction $action, array $ids = []): ?array
    {
        if (! is_array($action->handler)) {
            return null;
        }

        DB::beginTransaction();

        try {
            $request = $this->makeRequest(RuleCapturingRequest::class, $user, 'POST', []);
            $this->invoke($action, $request, $this->resolveBindings($action, $ids, lenient: true));
        } catch (CapturedRules $captured) {
            return $captured->readable();
        } catch (Throwable) {
            return null;
        } finally {
            DB::rollBack();
            $this->pullFlash();
        }

        return null;
    }

    /**
     * @param  array<string, mixed>  $ids
     * @param  array<string, mixed>  $input
     * @param  array<int, string>  $only
     * @return array{ok: bool, message?: string, errors?: array<string, mixed>, data?: mixed, catatan?: string}
     */
    public function run(User $user, McpAction $action, array $ids = [], array $input = [], array $only = [], int $limit = 50): array
    {
        if ($reason = $this->denialReason($user, $action)) {
            return ['ok' => false, 'message' => $reason];
        }

        try {
            $bindings = $this->resolveBindings($action, $ids);
        } catch (ModelNotFoundException $e) {
            return ['ok' => false, 'message' => 'Data '.class_basename($e->getModel()).' dengan id '.implode(', ', Arr::wrap($e->getIds())).' tidak ditemukan.'];
        } catch (MissingIdException $e) {
            return ['ok' => false, 'message' => $e->getMessage()];
        }

        if ($action->kind === McpAction::LINK) {
            return [
                'ok' => true,
                'data' => ['tautan' => ($action->url)($ids)],
                'catatan' => 'Buka tautan di browser yang sudah login ke aplikasi untuk mengunduh berkasnya.',
            ];
        }

        $writes = $action->kind !== McpAction::READ;

        if ($writes) {
            $input = array_replace($this->prefill($user, $action, $ids, $bindings), $input);
        }

        $request = $this->makeRequest(Request::class, $user, $writes ? 'POST' : 'GET', $input);

        if ($writes) {
            DB::beginTransaction();
        }

        try {
            $result = $this->interpret($this->invoke($action, $request, $bindings), $request, $only, $limit);
        } catch (ValidationException $e) {
            $result = ['ok' => false, 'message' => 'Data tidak valid. Perbaiki field berikut lalu coba lagi.', 'errors' => $e->errors()];
        } catch (ModelNotFoundException $e) {
            $result = ['ok' => false, 'message' => 'Data '.class_basename($e->getModel()).' tidak ditemukan.'];
        } catch (AuthorizationException $e) {
            $result = ['ok' => false, 'message' => $e->getMessage() ?: 'Anda tidak berhak menjalankan aksi ini.'];
        } catch (HttpExceptionInterface $e) {
            $result = ['ok' => false, 'message' => $e->getMessage() ?: "Ditolak aplikasi (HTTP {$e->getStatusCode()})."];
        } catch (Throwable $e) {
            report($e);
            $result = ['ok' => false, 'message' => 'Terjadi kesalahan di aplikasi: '.$e->getMessage()];
        } finally {
            $flash = $this->pullFlash();
        }

        if (($result['ok'] ?? false) && ! empty($flash['errors'])) {
            $result = ['ok' => false, 'message' => 'Aplikasi menolak permintaan ini.', 'errors' => $flash['errors']];
        }

        if (($result['ok'] ?? false) && ! isset($result['message']) && isset($flash['message'])) {
            $result['message'] = $flash['message'];
        }

        if ($writes) {
            ($result['ok'] ?? false) ? DB::commit() : DB::rollBack();
        }

        return $result;
    }

    /**
     * @template T of Request
     *
     * @param  class-string<T>  $class
     * @param  array<string, mixed>  $input
     * @return T
     */
    private function makeRequest(string $class, User $user, string $method, array $input): Request
    {
        $request = $class::create('/mcp/internal', $method, $input, server: [
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_X_INERTIA' => 'true',
        ]);

        $request->setUserResolver(fn (): User => $user);
        $request->setLaravelSession(app('session')->driver());

        return $request;
    }

    /**
     * @param  array<string, mixed>  $bindings
     */
    private function invoke(McpAction $action, Request $request, array $bindings): mixed
    {
        $original = app('request');

        app()->instance('request', $request);
        Facade::clearResolvedInstance('request');

        try {
            if ($action->handler instanceof Closure) {
                return app()->call($action->handler, $bindings);
            }

            [$controller, $method] = $action->handler;

            return app()->call([app($controller), $method], $bindings + ['request' => $request]);
        } finally {
            app()->instance('request', $original);
            Facade::clearResolvedInstance('request');
        }
    }

    /**
     * @param  array<string, mixed>  $ids
     * @return array<string, mixed>
     *
     * @throws MissingIdException
     * @throws ModelNotFoundException
     */
    private function resolveBindings(McpAction $action, array $ids, bool $lenient = false): array
    {
        $resolved = [];

        foreach ($action->bindings as $name => $modelClass) {
            $value = $ids[$name] ?? null;

            if ($value === null || $value === '') {
                if (! $lenient) {
                    throw new MissingIdException("Sertakan ids.{$name} untuk aksi {$action->key}.");
                }

                $resolved[$name] = $modelClass ? new $modelClass : 0;

                continue;
            }

            $resolved[$name] = $modelClass ? $modelClass::findOrFail($value) : $value;
        }

        return $resolved;
    }

    /**
     * Nilai lama yang dipakai sebagai dasar update, supaya Claude cukup mengirim
     * field yang berubah. Controller update di aplikasi ini mewajibkan semua field
     * dan beberapa di antaranya mengosongkan relasi bila field tidak dikirim.
     *
     * @param  array<string, mixed>  $ids
     * @param  array<string, mixed>  $bindings
     * @return array<string, mixed>
     */
    private function prefill(User $user, McpAction $action, array $ids, array $bindings): array
    {
        $values = [];

        if ($action->prefill !== null && ($model = $bindings[$action->prefill] ?? null) instanceof Model) {
            $fields = collect(array_keys($this->rules($user, $action, $ids) ?? []))
                ->reject(fn (string $field): bool => str_contains($field, '.'));

            foreach ($fields as $field) {
                if (in_array($field, self::NEVER_PREFILL, true) || ! array_key_exists($field, $model->getAttributes())) {
                    continue;
                }

                $values[$field] = $this->plainValue($model->getAttribute($field));
            }
        }

        if ($action->prefillExtra !== null) {
            $values = array_replace($values, ($action->prefillExtra)($bindings));
        }

        return $values;
    }

    private function plainValue(mixed $value): mixed
    {
        return match (true) {
            $value instanceof DateTimeInterface => $value->format('H:i:s') === '00:00:00' ? $value->format('Y-m-d') : $value->format('Y-m-d H:i:s'),
            $value instanceof BackedEnum => $value->value,
            default => $value,
        };
    }

    /**
     * @param  array<int, string>  $only
     * @return array{ok: bool, message?: string, errors?: array<string, mixed>, data?: mixed, catatan?: string}
     */
    private function interpret(mixed $response, Request $request, array $only, int $limit): array
    {
        if ($response instanceof Responsable) {
            $response = $response->toResponse($request);
        }

        if ($response instanceof RedirectResponse) {
            return ['ok' => true];
        }

        if ($response instanceof JsonResponse) {
            $data = $response->getData(true);

            if ($response->getStatusCode() >= 400) {
                return ['ok' => false, 'message' => $data['message'] ?? "Ditolak aplikasi (HTTP {$response->getStatusCode()}).", 'errors' => $data['errors'] ?? []];
            }

            // Halaman Inertia: yang berguna hanya props-nya
            if (is_array($data) && isset($data['component'], $data['props'])) {
                $data = $data['props'];
            }

            return ['ok' => true] + $this->compact($data, $only, $limit);
        }

        if ($response instanceof SymfonyResponse) {
            return $response->getStatusCode() >= 400
                ? ['ok' => false, 'message' => "Ditolak aplikasi (HTTP {$response->getStatusCode()})."]
                : ['ok' => true];
        }

        if (is_array($response) || $response instanceof Model) {
            return ['ok' => true] + $this->compact($response instanceof Model ? $response->toArray() : $response, $only, $limit);
        }

        return ['ok' => true];
    }

    /**
     * Ambil pesan flash & error yang ditulis controller, lalu bersihkan.
     *
     * @return array{message?: string, errors?: array<string, mixed>}
     */
    private function pullFlash(): array
    {
        $session = app('session')->driver();
        $result = [];

        $toast = $session->get(SessionKey::FLASH_DATA.'.toast');
        $message = $session->get('success') ?? $session->get('message') ?? (is_array($toast) ? ($toast['message'] ?? null) : null);

        if (is_string($message) && $message !== '') {
            $result['message'] = $message;
        }

        $errors = $session->get('errors');
        $error = $session->get('error') ?? (is_array($toast) && ($toast['type'] ?? null) === 'error' ? ($toast['message'] ?? null) : null);

        if ($errors instanceof ViewErrorBag && $errors->any()) {
            $result['errors'] = $errors->getBag('default')->toArray();
        } elseif (is_string($error) && $error !== '') {
            $result['errors'] = ['umum' => [$error]];
        }

        $session->flush();

        return $result;
    }

    /**
     * Ringkas hasil halaman: pilih props, potong daftar panjang, dan jaga ukuran.
     *
     * @param  array<int, string>  $only
     * @return array{data: mixed, catatan?: string}
     */
    private function compact(mixed $data, array $only, int $limit): array
    {
        if (is_array($data) && $only !== []) {
            $data = array_intersect_key($data, array_flip($only));
        }

        $truncated = false;

        do {
            $trimmed = $this->trimLists($data, $limit, $truncated);
            $size = strlen((string) json_encode($trimmed));
            $limit = intdiv($limit, 2);
        } while ($size > self::MAX_OUTPUT_BYTES && $limit >= 5);

        $result = ['data' => $trimmed];

        if ($truncated) {
            $result['catatan'] = 'Sebagian daftar dipotong (lihat field _total). Persempit dengan parameter "only", "query" (search/filter/page), atau "limit".';
        }

        return $result;
    }

    private function trimLists(mixed $value, int $limit, bool &$truncated, int $depth = 0): mixed
    {
        if (! is_array($value) || $depth > 6) {
            return $value;
        }

        // Hasil paginate(): cukup data dan info halaman
        if (isset($value['data'], $value['current_page']) && is_array($value['data'])) {
            return [
                'data' => $this->trimLists($value['data'], $limit, $truncated, $depth + 1),
                'halaman' => $value['current_page'],
                'halaman_terakhir' => $value['last_page'] ?? null,
                'total' => $value['total'] ?? null,
            ];
        }

        if (array_is_list($value) && count($value) > $limit) {
            $truncated = true;

            return [
                '_total' => count($value),
                '_ditampilkan' => $limit,
                'items' => array_map(fn (mixed $item): mixed => $this->trimLists($item, $limit, $truncated, $depth + 1), array_slice($value, 0, $limit)),
            ];
        }

        return array_map(fn (mixed $item): mixed => $this->trimLists($item, $limit, $truncated, $depth + 1), $value);
    }
}
