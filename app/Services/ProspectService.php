<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Prospect;
use App\Models\ProspectStageHistory;
use App\Support\Crm;
use Illuminate\Support\Facades\DB;

/**
 * Logika inti pipeline prospek: perpindahan tahap (dengan history) dan
 * konversi menjadi Customer existing tanpa membuat duplikat.
 */
class ProspectService
{
    /**
     * Pindahkan prospek ke tahap baru dan catat riwayatnya. Tahap terminal
     * (Berhasil/Tidak Berhasil) sekaligus menutup status opportunity.
     */
    public function moveStage(Prospect $prospect, string $toStage, ?string $note = null, ?int $userId = null): Prospect
    {
        $from = $prospect->stage;

        if ($from === $toStage) {
            return $prospect;
        }

        return DB::transaction(function () use ($prospect, $from, $toStage, $note, $userId) {
            $prospect->stage = $toStage;

            if ($toStage === Crm::stageWon() && ! $prospect->isConverted()) {
                $prospect->status = 'Berhasil';
            } elseif ($toStage === Crm::stageLost()) {
                $prospect->status = 'Tidak Berhasil';
            } elseif (! $prospect->isConverted()) {
                $prospect->status = 'Aktif';
            }

            $prospect->save();

            ProspectStageHistory::create([
                'prospect_id' => $prospect->id,
                'from_stage' => $from,
                'to_stage' => $toStage,
                'note' => $note,
                'changed_by' => $userId,
            ]);

            return $prospect;
        });
    }

    /**
     * Konversi prospek yang berhasil menjadi Customer. Bila Customer dengan
     * nama sama sudah ada, gunakan record tersebut (hindari duplikat).
     */
    public function convertToClient(Prospect $prospect): Client
    {
        if ($prospect->client_id !== null) {
            return $prospect->client;
        }

        return DB::transaction(function () use ($prospect) {
            $client = $this->findMatchingClient($prospect)
                ?? Client::create([
                    'name' => $prospect->company_name,
                    'pic' => $prospect->pic_name,
                    'contact' => $prospect->pic_phone ?: $prospect->company_phone,
                    'email' => $prospect->pic_email ?: $prospect->company_email,
                ]);

            $prospect->update([
                'client_id' => $client->id,
                'converted_at' => now(),
                'status' => 'Dikonversi',
            ]);

            return $client;
        });
    }

    /** Cari Customer existing yang cocok dengan prospek (nama atau email). */
    public function findMatchingClient(Prospect $prospect): ?Client
    {
        return Client::query()
            ->where('name', $prospect->company_name)
            ->when($prospect->company_email, function ($query) use ($prospect) {
                $query->orWhere('email', $prospect->company_email);
            })
            ->when($prospect->pic_email, function ($query) use ($prospect) {
                $query->orWhere('email', $prospect->pic_email);
            })
            ->first();
    }
}
