<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\AppSubscription;
use App\Models\Invoice;
use Carbon\Carbon;

class GenerateSubscriptionInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:generate-subscriptions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate invoices for app subscriptions 3 days before deadline';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Mencari langganan yang mendekati deadline (H-3)...');

        $targetDate = Carbon::now()->addDays(3)->toDateString();

        $subscriptions = AppSubscription::where('status', AppSubscription::STATUS_ACTIVE)
            ->where('is_invoiced', false)
            ->whereDate('deadline', '<=', $targetDate)
            ->get();

        if ($subscriptions->isEmpty()) {
            $this->info('Tidak ada langganan yang perlu dibuatkan invoice.');
            return;
        }

        $year = date('Y');
        $month = date('m');

        foreach ($subscriptions as $sub) {
            // Generate invoice number
            $prefix = "CTECH/{$year}/{$month}/";
            
            $latestInvoice = Invoice::where('invoice_number', 'like', "{$prefix}%")
                                    ->orderBy('invoice_number', 'desc')
                                    ->first();
                                    
            if ($latestInvoice) {
                $lastSequence = (int) substr($latestInvoice->invoice_number, -3);
                $nextId = $lastSequence + 1;
            } else {
                $nextId = 1;
            }
            
            $invoiceNumber = $prefix . str_pad($nextId, 3, '0', STR_PAD_LEFT);

            // Nominal sekali tagih = harga per bulan x siklus tagihan
            $amount = $sub->cycle_amount;
            $periodEnd = Carbon::parse($sub->deadline)->addMonths($sub->billing_cycle_months);

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'client_name' => $sub->client_name,
                'due_date' => $sub->deadline,
                'subtotal' => $amount,
                'tax' => 0, // Langganan otomatis diterbitkan tanpa pajak
                'total' => $amount,
                'status' => 'Draft',
            ]);

            $invoice->items()->create([
                'description' => "Langganan {$sub->app_name} — periode "
                    . Carbon::parse($sub->deadline)->format('d M Y') . ' s/d ' . $periodEnd->format('d M Y')
                    . " ({$sub->billing_cycle_months} bulan)",
                'quantity' => 1,
                'price' => $amount,
                'total' => $amount,
            ]);

            // Mark subscription as invoiced
            $sub->update(['is_invoiced' => true]);

            $this->info("Invoice {$invoiceNumber} dibuat untuk {$sub->client_name} ({$sub->app_name}).");
        }

        $this->info('Selesai membuat invoice otomatis.');
    }
}
