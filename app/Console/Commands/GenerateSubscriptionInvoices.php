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

        $subscriptions = AppSubscription::where('is_active', true)
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
            $count = Invoice::whereYear('created_at', $year)
                            ->whereMonth('created_at', $month)
                            ->count() + 1;
            $invoiceNumber = 'CTECH/' . $year . '/' . $month . '/' . str_pad($count, 3, '0', STR_PAD_LEFT);

            // Create the invoice
            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'client_name' => $sub->client_name,
                'due_date' => $sub->deadline,
                'subtotal' => $sub->billing_amount,
                'tax' => 0, // Assume no tax by default for automated subscription
                'total' => $sub->billing_amount,
                'status' => 'Draft',
            ]);

            // Create the invoice item
            $invoice->items()->create([
                'description' => "Tagihan Langganan: {$sub->app_name} (S/d " . Carbon::parse($sub->deadline)->format('d M Y') . ")",
                'quantity' => 1,
                'price' => $sub->billing_amount,
                'total' => $sub->billing_amount,
            ]);

            // Mark subscription as invoiced
            $sub->update(['is_invoiced' => true]);

            $this->info("Invoice {$invoiceNumber} dibuat untuk {$sub->client_name} ({$sub->app_name}).");
        }

        $this->info('Selesai membuat invoice otomatis.');
    }
}
