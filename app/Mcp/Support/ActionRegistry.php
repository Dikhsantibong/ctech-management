<?php

namespace App\Mcp\Support;

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Api\V1\DailyReportController;
use App\Http\Controllers\Api\V1\ProjectActivityController;
use App\Http\Controllers\Api\V1\ProjectDocumentController;
use App\Http\Controllers\Api\V1\ProjectMeetingController;
use App\Http\Controllers\Api\V1\ProjectMilestoneController;
use App\Http\Controllers\AppSubscriptionController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\CompanySettingController;
use App\Http\Controllers\ContentPlanController;
use App\Http\Controllers\Crm\ActivityController as CrmActivityController;
use App\Http\Controllers\Crm\CrmQuotationController;
use App\Http\Controllers\Crm\DashboardController as CrmDashboardController;
use App\Http\Controllers\Crm\PipelineController;
use App\Http\Controllers\Crm\ProspectController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\IncomingLetterController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\LetterController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectCanvasController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\RolePermissionController;
use App\Http\Controllers\SocialAccountController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WorkController;
use App\Models\Announcement;
use App\Models\AppCategory;
use App\Models\AppSubscription;
use App\Models\Client;
use App\Models\CompanySetting;
use App\Models\ContentPlan;
use App\Models\CrmActivity;
use App\Models\Document;
use App\Models\File;
use App\Models\IncomingLetter;
use App\Models\Invoice;
use App\Models\Letter;
use App\Models\Meeting;
use App\Models\News;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\Prospect;
use App\Models\Quotation;
use App\Models\SubscriptionPayment;
use App\Models\Task;
use App\Models\User;
use App\Models\Work;
use App\Support\MenuRegistry;
use Illuminate\Support\Facades\Route;

/**
 * Peta seluruh fitur aplikasi yang dibuka untuk Claude lewat MCP.
 *
 * Setiap aksi dijaga oleh kunci menu yang sama dengan middleware `menu:<key>`
 * di routes/web.php, sehingga hak akses MCP selalu sama dengan aplikasi web.
 * Fitur unggah file (lampiran, gambar, dokumen) tidak tersedia lewat MCP.
 */
class ActionRegistry
{
    /** @var array<string, McpAction>|null */
    private static ?array $actions = null;

    /**
     * @return array<string, string> kunci modul => nama modul
     */
    public static function modules(): array
    {
        return [
            'dashboard' => 'Dashboard',
            'announcements' => 'Pengumuman',
            'projects' => 'Projects',
            'milestones' => 'Milestone Project',
            'meetings' => 'Rapat Project',
            'project-documents' => 'Dokumen Project',
            'tasks' => 'Tasks',
            'works' => 'Work',
            'daily-reports' => 'Daily Reports',
            'calendar' => 'Calendar',
            'clients' => 'Clients',
            'crm' => 'CRM',
            'quotations' => 'Penawaran / RAB',
            'invoices' => 'Invoices',
            'app-subscriptions' => 'Langganan Aplikasi',
            'content-plans' => 'Content Planning',
            'news' => 'Berita',
            'portfolios' => 'Portfolio',
            'social-accounts' => 'Akun Media Sosial',
            'letters' => 'Surat Keluar',
            'incoming-letters' => 'Surat Masuk',
            'documents' => 'Documents',
            'files' => 'Files',
            'kpi' => 'Monitoring KPI',
            'activity-logs' => 'Activity Logs',
            'users' => 'Team',
            'role-permissions' => 'Hak Akses Menu',
            'company-settings' => 'Pengaturan Perusahaan',
        ];
    }

    /**
     * @return array<string, McpAction>
     */
    public static function all(): array
    {
        if (self::$actions !== null) {
            return self::$actions;
        }

        $actions = [];

        foreach (self::definitions() as $module => $moduleActions) {
            foreach ($moduleActions as $name => $action) {
                $key = "{$module}.{$name}";
                $actions[$key] = $action->withKey($module, $key);
            }
        }

        return self::$actions = $actions;
    }

    public static function find(string $key): ?McpAction
    {
        return self::all()[$key] ?? null;
    }

    /**
     * @return array<string, array<string, McpAction>>
     */
    private static function definitions(): array
    {
        $director = MenuRegistry::SUPER_ROLE;

        return [
            'dashboard' => [
                'view' => McpAction::read('dashboard', 'Ringkasan dashboard sesuai role: statistik, KPI, tenggat terdekat, aktivitas terbaru', fn () => self::runNamedRoute('dashboard')),
            ],

            'announcements' => [
                'list' => McpAction::read('announcements', 'Daftar pengumuman', [AnnouncementController::class, 'index']),
                'show' => McpAction::read('announcements', 'Detail pengumuman', [AnnouncementController::class, 'show'], ['announcement' => Announcement::class]),
                'create' => McpAction::write('announcements', 'Buat pengumuman', [AnnouncementController::class, 'store'], role: $director),
                'update' => McpAction::write('announcements', 'Ubah pengumuman', [AnnouncementController::class, 'update'], ['announcement' => Announcement::class], 'announcement', role: $director),
                'delete' => McpAction::delete('announcements', 'Hapus pengumuman', [AnnouncementController::class, 'destroy'], ['announcement' => Announcement::class], role: $director),
            ],

            'projects' => [
                'list' => McpAction::read('projects', 'Daftar project (15 per halaman)', [ProjectController::class, 'index'], query: ['search' => 'kata kunci nama project/klien', 'page' => 'nomor halaman']),
                'show' => McpAction::read('projects', 'Detail project: anggota, tugas, milestone, revisi, feedback, rapat, dokumen', [ProjectController::class, 'show'], ['project' => Project::class]),
                'create' => McpAction::write('projects', 'Buat project baru', [ProjectController::class, 'store']),
                'update' => McpAction::write('projects', 'Ubah project (field yang tidak dikirim tetap seperti semula)', [ProjectController::class, 'update'], ['project' => Project::class], 'project', fn (array $models): array => [
                    'members' => $models['project']->members()->pluck('users.id')->all(),
                ]),
                'delete' => McpAction::delete('projects', 'Hapus project', [ProjectController::class, 'destroy'], ['project' => Project::class]),
                'update-metadata' => McpAction::write('projects', 'Ubah info teknis project: tech stack, repo, domain, desain, catatan struktur', [ProjectController::class, 'updateMetadata'], ['project' => Project::class]),
                'add-revision' => McpAction::write('projects', 'Tambah permintaan revisi project', [ProjectController::class, 'storeRevision'], ['project' => Project::class]),
                'revision-status' => McpAction::write('projects', 'Ubah status revisi project', [ProjectController::class, 'updateRevisionStatus'], ['project' => Project::class, 'revisionId' => null]),
                'add-feedback' => McpAction::write('projects', 'Catat feedback klien untuk project', [ProjectController::class, 'storeFeedback'], ['project' => Project::class]),
                'feedback-status' => McpAction::write('projects', 'Ubah status feedback klien', [ProjectController::class, 'updateFeedbackStatus'], ['project' => Project::class, 'feedbackId' => null]),
                'feedback-to-task' => McpAction::write('projects', 'Jadikan feedback klien sebagai tugas', [ProjectController::class, 'convertFeedbackToTask'], ['project' => Project::class, 'feedbackId' => null]),
                'activities' => McpAction::read('projects', 'Riwayat aktivitas project', [ProjectActivityController::class, 'index'], ['project' => Project::class]),
                'canvas' => McpAction::read('projects', 'Canvas dokumentasi visual project', [ProjectCanvasController::class, 'show'], ['project' => Project::class]),
            ],

            'milestones' => [
                'list' => McpAction::read('projects', 'Daftar milestone sebuah project', [ProjectMilestoneController::class, 'index'], ['projectId' => null]),
                'create' => McpAction::write('projects', 'Tambah milestone ke project', [ProjectMilestoneController::class, 'store'], ['projectId' => null]),
                'update' => McpAction::write('projects', 'Ubah milestone (cukup kirim field yang berubah)', [ProjectMilestoneController::class, 'update'], ['id' => null]),
                'progress' => McpAction::write('projects', 'Set progres milestone (0-100)', [ProjectMilestoneController::class, 'updateProgress'], ['id' => null]),
                'calculate-progress' => McpAction::write('projects', 'Hitung ulang progres milestone dari checklist & tugas', [ProjectMilestoneController::class, 'calculateProgress'], ['id' => null]),
                'delete' => McpAction::delete('projects', 'Hapus milestone', [ProjectMilestoneController::class, 'destroy'], ['id' => null]),
            ],

            'meetings' => [
                'list' => McpAction::read('projects', 'Daftar rapat project', [ProjectMeetingController::class, 'index'], ['project' => Project::class]),
                'create' => McpAction::write('projects', 'Jadwalkan rapat project', [ProjectMeetingController::class, 'store'], ['project' => Project::class]),
                'minutes' => McpAction::write('projects', 'Isi notulen rapat', [ProjectMeetingController::class, 'updateMinutes'], ['meeting' => Meeting::class]),
                'add-action-item' => McpAction::write('projects', 'Tambah action item hasil rapat', [ProjectMeetingController::class, 'storeActionItem'], ['meeting' => Meeting::class]),
            ],

            'project-documents' => [
                'list' => McpAction::read('projects', 'Daftar folder & dokumen project', [ProjectDocumentController::class, 'index'], ['project' => Project::class]),
                'create-folder' => McpAction::write('projects', 'Buat folder dokumen project', [ProjectDocumentController::class, 'storeFolder'], ['project' => Project::class]),
                'download' => McpAction::link('projects', 'Tautan unduh dokumen project', fn (array $ids): string => url("/api/v1/documents/{$ids['document']}/download"), ['document' => ProjectDocument::class]),
                'delete' => McpAction::delete('projects', 'Hapus dokumen project', [ProjectDocumentController::class, 'destroy'], ['document' => ProjectDocument::class]),
            ],

            'tasks' => [
                'list' => McpAction::read('tasks', 'Daftar tugas beserta proyek, milestone, dan penanggung jawab', [TaskController::class, 'index'], query: ['project_id' => 'filter id project']),
                'create' => McpAction::write('tasks', 'Buat tugas baru', [TaskController::class, 'store']),
                'update' => McpAction::write('tasks', 'Ubah tugas (field yang tidak dikirim tetap seperti semula)', [TaskController::class, 'update'], ['task' => Task::class], 'task'),
                'delete' => McpAction::delete('tasks', 'Hapus tugas', [TaskController::class, 'destroy'], ['task' => Task::class]),
            ],

            'works' => [
                'list' => McpAction::read('works', 'Daftar pekerjaan (Work)', [WorkController::class, 'index'], query: ['category' => 'filter kategori', 'search' => 'kata kunci judul/klien']),
                'report' => McpAction::read('works', 'Laporan & metrik pekerjaan', [WorkController::class, 'report']),
                'create' => McpAction::write('works', 'Buat pekerjaan baru', [WorkController::class, 'store']),
                'update' => McpAction::write('works', 'Ubah pekerjaan (field yang tidak dikirim tetap seperti semula)', [WorkController::class, 'update'], ['work' => Work::class], 'work', fn (array $models): array => [
                    'collaborators' => $models['work']->collaborators()->pluck('users.id')->all(),
                ]),
                'delete' => McpAction::delete('works', 'Hapus pekerjaan', [WorkController::class, 'destroy'], ['work' => Work::class]),
            ],

            'daily-reports' => [
                'list' => McpAction::read('daily-reports', 'Daftar laporan harian', [DailyReportController::class, 'index'], query: ['user_id' => 'filter id user', 'date' => 'filter tanggal (Y-m-d)']),
                'create' => McpAction::write('daily-reports', 'Kirim laporan harian untuk akun yang terhubung', [DailyReportController::class, 'store']),
            ],

            'calendar' => [
                'view' => McpAction::read('calendar', 'Kalender gabungan: deadline project & tugas, milestone, rapat, konten', [CalendarController::class, 'index']),
            ],

            'clients' => [
                'list' => McpAction::read('clients', 'Daftar klien', [ClientController::class, 'index'], query: ['search' => 'kata kunci nama klien']),
                'show' => McpAction::read('clients', 'Detail klien beserta project & invoice', [ClientController::class, 'show'], ['client' => Client::class]),
                'create' => McpAction::write('clients', 'Tambah klien', [ClientController::class, 'store']),
                'update' => McpAction::write('clients', 'Ubah data klien', [ClientController::class, 'update'], ['client' => Client::class], 'client'),
                'delete' => McpAction::delete('clients', 'Hapus klien', [ClientController::class, 'destroy'], ['client' => Client::class]),
            ],

            'crm' => [
                'dashboard' => McpAction::read('crm-dashboard', 'Dashboard CRM: funnel, nilai pipeline, aktivitas', [CrmDashboardController::class, 'index']),
                'pipeline' => McpAction::read('crm-pipeline', 'Pipeline prospek per tahap', [PipelineController::class, 'index']),
                'prospects' => McpAction::read('crm-prospects', 'Daftar prospek', [ProspectController::class, 'index'], query: ['search' => 'kata kunci', 'stage' => 'filter tahap', 'priority' => 'filter prioritas', 'industry' => 'filter industri', 'source' => 'filter sumber', 'sales_id' => 'filter id sales', 'page' => 'nomor halaman']),
                'prospect-show' => McpAction::read('crm-prospects', 'Detail prospek beserta aktivitas & riwayat tahap', [ProspectController::class, 'show'], ['prospect' => Prospect::class]),
                'prospect-create' => McpAction::write('crm-prospects', 'Tambah prospek', [ProspectController::class, 'store']),
                'prospect-update' => McpAction::write('crm-prospects', 'Ubah data prospek (field yang tidak dikirim tetap seperti semula)', [ProspectController::class, 'update'], ['prospect' => Prospect::class], 'prospect'),
                'prospect-stage' => McpAction::write('crm-prospects', 'Pindahkan tahap prospek di pipeline', [ProspectController::class, 'updateStage'], ['prospect' => Prospect::class]),
                'prospect-convert' => McpAction::write('crm-prospects', 'Konversi prospek menjadi klien', [ProspectController::class, 'convert'], ['prospect' => Prospect::class]),
                'prospect-delete' => McpAction::delete('crm-prospects', 'Hapus prospek', [ProspectController::class, 'destroy'], ['prospect' => Prospect::class]),
                'activity-create' => McpAction::write('crm-prospects', 'Catat aktivitas sales untuk prospek (telepon, meeting, dll.)', [CrmActivityController::class, 'store'], ['prospect' => Prospect::class]),
                'activities' => McpAction::read('crm-activities', 'Daftar aktivitas sales', [CrmActivityController::class, 'index']),
                'activity-complete' => McpAction::write('crm-activities', 'Tandai aktivitas sales selesai', [CrmActivityController::class, 'complete'], ['activity' => CrmActivity::class]),
                'activity-delete' => McpAction::delete('crm-activities', 'Hapus aktivitas sales', [CrmActivityController::class, 'destroy'], ['activity' => CrmActivity::class]),
                'quotations' => McpAction::read('crm-quotations', 'Penawaran yang terkait prospek CRM', [CrmQuotationController::class, 'index']),
            ],

            'quotations' => [
                'list' => McpAction::read('quotations', 'Daftar penawaran / RAB', [QuotationController::class, 'index']),
                'show' => McpAction::read('quotations', 'Detail penawaran beserta item', [QuotationController::class, 'show'], ['quotation' => Quotation::class]),
                'create' => McpAction::write('quotations', 'Buat penawaran / RAB (nomor dibuat otomatis)', [QuotationController::class, 'store']),
                'update' => McpAction::write('quotations', 'Ubah penawaran (item yang tidak dikirim tetap seperti semula)', [QuotationController::class, 'update'], ['quotation' => Quotation::class], 'quotation', fn (array $models): array => [
                    'items' => $models['quotation']->items->map(fn ($item): array => $item->only(['id', 'category', 'description', 'unit', 'quantity', 'price']))->all(),
                ]),
                'status' => McpAction::write('quotations', 'Ubah status penawaran', [QuotationController::class, 'updateStatus'], ['quotation' => Quotation::class]),
                'verify' => McpAction::write('quotations', 'Verifikasi dokumen penawaran', [QuotationController::class, 'verifyDocument'], ['quotation' => Quotation::class]),
                'unverify' => McpAction::write('quotations', 'Batalkan verifikasi penawaran', [QuotationController::class, 'unverifyDocument'], ['quotation' => Quotation::class]),
                'delete' => McpAction::delete('quotations', 'Hapus penawaran', [QuotationController::class, 'destroy'], ['quotation' => Quotation::class]),
                'pdf' => McpAction::link('quotations', 'Tautan unduh PDF penawaran', fn (array $ids): string => route('quotations.pdf', $ids['quotation']), ['quotation' => Quotation::class]),
            ],

            'invoices' => [
                'list' => McpAction::read('invoices', 'Daftar invoice', [InvoiceController::class, 'index']),
                'show' => McpAction::read('invoices', 'Detail invoice beserta item', [InvoiceController::class, 'show'], ['invoice' => Invoice::class]),
                'create' => McpAction::write('invoices', 'Buat invoice (nomor & total dihitung otomatis)', [InvoiceController::class, 'store']),
                'update' => McpAction::write('invoices', 'Ubah invoice (item yang tidak dikirim tetap seperti semula)', [InvoiceController::class, 'update'], ['invoice' => Invoice::class], 'invoice', fn (array $models): array => self::invoicePrefill($models['invoice'])),
                'status' => McpAction::write('invoices', 'Ubah status invoice (Draft, Sent, Paid, Overdue)', [InvoiceController::class, 'updateStatus'], ['invoice' => Invoice::class]),
                'delete' => McpAction::delete('invoices', 'Hapus invoice', [InvoiceController::class, 'destroy'], ['invoice' => Invoice::class]),
                'pdf' => McpAction::link('invoices', 'Tautan unduh PDF invoice', fn (array $ids): string => route('invoices.pdf', $ids['invoice']), ['invoice' => Invoice::class]),
                'kwitansi' => McpAction::link('invoices', 'Tautan unduh PDF kwitansi', fn (array $ids): string => route('invoices.kwitansi', $ids['invoice']), ['invoice' => Invoice::class]),
            ],

            'app-subscriptions' => [
                'list' => McpAction::read('app-subscriptions', 'Daftar langganan aplikasi: lama berlangganan, total dibayar, tunggakan, jatuh tempo', [AppSubscriptionController::class, 'index']),
                'create' => McpAction::write('app-subscriptions', 'Tambah langganan aplikasi', [AppSubscriptionController::class, 'store']),
                'update' => McpAction::write('app-subscriptions', 'Ubah langganan (field yang tidak dikirim tetap seperti semula)', [AppSubscriptionController::class, 'update'], ['app_subscription' => AppSubscription::class], 'app_subscription'),
                'record-payment' => McpAction::write('app-subscriptions', 'Catat pembayaran langganan dan majukan masa aktif', [AppSubscriptionController::class, 'recordPayment'], ['app_subscription' => AppSubscription::class]),
                'delete-payment' => McpAction::delete('app-subscriptions', 'Hapus catatan pembayaran langganan', [AppSubscriptionController::class, 'destroyPayment'], ['app_subscription' => AppSubscription::class, 'payment' => SubscriptionPayment::class]),
                'delete' => McpAction::delete('app-subscriptions', 'Hapus langganan', [AppSubscriptionController::class, 'destroy'], ['app_subscription' => AppSubscription::class]),
                'category-create' => McpAction::write('app-subscriptions', 'Tambah kategori aplikasi', [AppSubscriptionController::class, 'storeCategory']),
                'category-update' => McpAction::write('app-subscriptions', 'Ubah kategori aplikasi', [AppSubscriptionController::class, 'updateCategory'], ['category' => AppCategory::class], 'category'),
                'category-delete' => McpAction::delete('app-subscriptions', 'Hapus kategori aplikasi', [AppSubscriptionController::class, 'destroyCategory'], ['category' => AppCategory::class]),
            ],

            'content-plans' => [
                'list' => McpAction::read('content-plans', 'Daftar rencana konten', [ContentPlanController::class, 'index']),
                'report' => McpAction::read('content-plans', 'Laporan performa content planning', [ContentPlanController::class, 'report']),
                'create' => McpAction::write('content-plans', 'Buat rencana konten (tanpa unggah media)', [ContentPlanController::class, 'store']),
                'update' => McpAction::write('content-plans', 'Ubah rencana konten (field yang tidak dikirim tetap seperti semula)', [ContentPlanController::class, 'update'], ['contentPlan' => ContentPlan::class], 'contentPlan'),
                'status' => McpAction::write('content-plans', 'Ubah status konten (Draft, Scheduled, Published, Cancelled)', [ContentPlanController::class, 'updateStatus'], ['contentPlan' => ContentPlan::class]),
                'publish' => McpAction::write('content-plans', 'Publikasikan konten sekarang ke media sosial yang terhubung', [ContentPlanController::class, 'publishNow'], ['contentPlan' => ContentPlan::class]),
                'delete' => McpAction::delete('content-plans', 'Hapus rencana konten', [ContentPlanController::class, 'destroy'], ['contentPlan' => ContentPlan::class]),
            ],

            'news' => [
                'list' => McpAction::read('news', 'Daftar berita', [NewsController::class, 'index'], query: ['search' => 'kata kunci']),
                'create' => McpAction::write('news', 'Tulis berita (tanpa gambar)', [NewsController::class, 'store']),
                'update' => McpAction::write('news', 'Ubah berita (gambar tetap)', [NewsController::class, 'update'], ['news' => News::class], 'news'),
                'delete' => McpAction::delete('news', 'Hapus berita', [NewsController::class, 'destroy'], ['news' => News::class]),
            ],

            'portfolios' => [
                'list' => McpAction::read('portfolios', 'Daftar portfolio', [PortfolioController::class, 'index']),
                'create' => McpAction::write('portfolios', 'Tambah portfolio (tanpa gambar)', [PortfolioController::class, 'store']),
                'update' => McpAction::write('portfolios', 'Ubah portfolio (gambar tetap)', [PortfolioController::class, 'update'], ['portfolio' => Portfolio::class], 'portfolio'),
                'delete' => McpAction::delete('portfolios', 'Hapus portfolio', [PortfolioController::class, 'destroy'], ['portfolio' => Portfolio::class]),
            ],

            'social-accounts' => [
                'list' => McpAction::read('social-accounts', 'Status koneksi akun media sosial & riwayat posting (kredensial tidak pernah ditampilkan)', [SocialAccountController::class, 'index']),
                'update' => McpAction::write('social-accounts', 'Aktifkan/nonaktifkan atau isi kredensial akun media sosial', [SocialAccountController::class, 'update'], ['platform' => null]),
                'disconnect' => McpAction::delete('social-accounts', 'Putuskan akun media sosial (kredensial dihapus)', [SocialAccountController::class, 'disconnect'], ['platform' => null]),
            ],

            'letters' => [
                'list' => McpAction::read('letters', 'Daftar surat keluar', [LetterController::class, 'index'], query: ['search' => 'kata kunci']),
                'show' => McpAction::read('letters', 'Detail surat keluar', [LetterController::class, 'show'], ['letter' => Letter::class]),
                'create' => McpAction::write('letters', 'Buat surat keluar; kosongkan content untuk hanya mengambil nomor surat', [LetterController::class, 'store']),
                'update' => McpAction::write('letters', 'Ubah surat keluar (field yang tidak dikirim tetap seperti semula)', [LetterController::class, 'update'], ['letter' => Letter::class], 'letter'),
                'verify' => McpAction::write('letters', 'Verifikasi surat keluar', [LetterController::class, 'verifyDocument'], ['letter' => Letter::class]),
                'unverify' => McpAction::write('letters', 'Batalkan verifikasi surat keluar', [LetterController::class, 'unverifyDocument'], ['letter' => Letter::class]),
                'delete' => McpAction::delete('letters', 'Hapus surat keluar', [LetterController::class, 'destroy'], ['letter' => Letter::class]),
                'pdf' => McpAction::link('letters', 'Tautan unduh PDF surat', fn (array $ids): string => route('letters.pdf', $ids['letter']), ['letter' => Letter::class]),
            ],

            'incoming-letters' => [
                'list' => McpAction::read('incoming-letters', 'Daftar surat masuk', [IncomingLetterController::class, 'index'], query: ['search' => 'kata kunci', 'status' => 'filter status']),
                'show' => McpAction::read('incoming-letters', 'Detail surat masuk', [IncomingLetterController::class, 'show'], ['incoming_letter' => IncomingLetter::class]),
                'create' => McpAction::write('incoming-letters', 'Catat surat masuk (tanpa lampiran)', [IncomingLetterController::class, 'store']),
                'update' => McpAction::write('incoming-letters', 'Ubah surat masuk / disposisi / status', [IncomingLetterController::class, 'update'], ['incoming_letter' => IncomingLetter::class], 'incoming_letter'),
                'delete' => McpAction::delete('incoming-letters', 'Hapus surat masuk', [IncomingLetterController::class, 'destroy'], ['incoming_letter' => IncomingLetter::class]),
                'attachment' => McpAction::link('incoming-letters', 'Tautan unduh lampiran surat masuk', fn (array $ids): string => route('incoming-letters.download', $ids['incoming_letter']), ['incoming_letter' => IncomingLetter::class]),
            ],

            'documents' => [
                'list' => McpAction::read('documents', 'Daftar dokumen internal', [DocumentController::class, 'index'], query: ['search' => 'kata kunci']),
                'show' => McpAction::read('documents', 'Isi dokumen internal', [DocumentController::class, 'show'], ['document' => Document::class]),
                'create' => McpAction::write('documents', 'Buat dokumen internal', [DocumentController::class, 'store']),
                'update' => McpAction::write('documents', 'Ubah dokumen internal', [DocumentController::class, 'update'], ['document' => Document::class], 'document'),
                'delete' => McpAction::delete('documents', 'Hapus dokumen internal', [DocumentController::class, 'destroy'], ['document' => Document::class]),
            ],

            'files' => [
                'list' => McpAction::read('files', 'Daftar file per klien/folder', [FileController::class, 'index']),
                'download' => McpAction::link('files', 'Tautan unduh file', fn (array $ids): string => route('files.download', $ids['file']), ['file' => File::class]),
                'delete' => McpAction::delete('files', 'Hapus file', [FileController::class, 'destroy'], ['file' => File::class]),
            ],

            'kpi' => [
                'view' => McpAction::read('kpi', 'Monitoring KPI seluruh role', [KpiController::class, 'index'], query: ['period' => 'periode Y-m']),
                'set-target' => McpAction::write('kpi', 'Atur target KPI satu metrik', [KpiController::class, 'updateTarget']),
                'reset-target' => McpAction::delete('kpi', 'Kembalikan target KPI ke bawaan', [KpiController::class, 'resetTarget']),
            ],

            'activity-logs' => [
                'list' => McpAction::read('activity-logs', 'Log aktivitas pengguna', [ActivityLogController::class, 'index']),
            ],

            'users' => [
                'list' => McpAction::read('users', 'Daftar anggota tim', [UserController::class, 'index']),
                'create' => McpAction::write('users', 'Tambah anggota tim', [UserController::class, 'store']),
                'update' => McpAction::write('users', 'Ubah anggota tim (password opsional)', [UserController::class, 'update'], ['user' => User::class], 'user'),
                'delete' => McpAction::delete('users', 'Hapus anggota tim', [UserController::class, 'destroy'], ['user' => User::class]),
            ],

            'role-permissions' => [
                'view' => McpAction::read('role-permissions', 'Hak akses menu setiap role', [RolePermissionController::class, 'index'], role: $director),
                'update' => McpAction::write('role-permissions', 'Atur menu yang boleh diakses satu role', [RolePermissionController::class, 'update'], role: $director),
            ],

            'company-settings' => [
                'view' => McpAction::read('dashboard', 'Pengaturan perusahaan & rekening bank', [CompanySettingController::class, 'edit'], role: $director),
                'update' => McpAction::write('dashboard', 'Ubah pengaturan perusahaan / rekening (field yang tidak dikirim tetap)', [CompanySettingController::class, 'update'], prefillExtra: fn (): array => self::settingsPrefill(), role: $director),
            ],
        ];
    }

    /**
     * Menjalankan route berbasis closure (mis. dashboard) tanpa melewati middleware-nya.
     * Hak akses sudah diperiksa ActionRunner sebelum sampai di sini.
     */
    private static function runNamedRoute(string $name): mixed
    {
        $route = Route::getRoutes()->getByName($name);

        abort_if($route === null, 404, "Route {$name} tidak ditemukan.");

        $route->setContainer(app());
        $route->bind(request());

        return $route->run();
    }

    /**
     * @return array<string, mixed>
     */
    private static function invoicePrefill(Invoice $invoice): array
    {
        $subtotal = (float) $invoice->subtotal;

        return [
            'use_tax' => (float) $invoice->tax > 0,
            'tax_rate' => $subtotal > 0 ? round(((float) $invoice->tax / $subtotal) * 100, 2) : null,
            'items' => $invoice->items->map(fn ($item): array => $item->only(['id', 'description', 'quantity', 'price']))->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private static function settingsPrefill(): array
    {
        $settings = CompanySetting::first();

        if (! $settings) {
            return [];
        }

        return array_merge(
            $settings->only(['company_name', 'leader_name', 'address', 'phone', 'email', 'website']),
            ['bank_accounts' => $settings->bank_accounts ?? []],
        );
    }
}
