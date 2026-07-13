<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    use LogsActivity;
    public function index()
    {
        $invoices = Invoice::with('items')->latest()->get();
        return Inertia::render('invoices/index', [
            'invoices' => $invoices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'due_date' => 'required|date',
            'use_tax' => 'required|boolean',
            'tax_rate' => 'nullable|required_if:use_tax,true|numeric|min:0|max:100',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Generate invoice number e.g. CTECH/2026/06/001
        $year = date('Y');
        $month = date('m');
        $count = Invoice::whereYear('created_at', $year)
                        ->whereMonth('created_at', $month)
                        ->count() + 1;
        $invoiceNumber = 'CTECH/' . $year . '/' . $month . '/' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['quantity'] * $item['price'];
        }
        $taxRate = $validated['use_tax'] ? (float) $validated['tax_rate'] : 0;
        $tax = $subtotal * ($taxRate / 100);
        $total = $subtotal + $tax;

        $invoice = Invoice::create([
            'invoice_number' => $invoiceNumber,
            'client_name' => $validated['client_name'],
            'due_date' => $validated['due_date'],
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
            'status' => 'Draft',
        ]);

        foreach ($validated['items'] as $item) {
            $invoice->items()->create([
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'total' => $item['quantity'] * $item['price'],
            ]);
        }

        $this->logActivity('created', 'Invoice', $invoice->id, "Membuat invoice baru: {$invoice->invoice_number}");

        return redirect()->back()->with('success', 'Invoice created successfully.');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load('items');
        return Inertia::render('invoices/show', [
            'invoice' => $invoice
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'due_date' => 'required|date',
            'use_tax' => 'required|boolean',
            'tax_rate' => 'nullable|required_if:use_tax,true|numeric|min:0|max:100',
            'items' => 'required|array|min:1',
            'items.*.id' => 'nullable',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['quantity'] * $item['price'];
        }
        $taxRate = $validated['use_tax'] ? (float) $validated['tax_rate'] : 0;
        $tax = $subtotal * ($taxRate / 100);
        $total = $subtotal + $tax;

        $invoice->update([
            'client_name' => $validated['client_name'],
            'due_date' => $validated['due_date'],
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $total,
        ]);

        $itemIds = collect($validated['items'])->pluck('id')->filter()->toArray();
        $invoice->items()->whereNotIn('id', $itemIds)->delete();

        foreach ($validated['items'] as $item) {
            if (isset($item['id']) && $item['id']) {
                $invoice->items()->where('id', $item['id'])->update([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['quantity'] * $item['price'],
                ]);
            } else {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['quantity'] * $item['price'],
                ]);
            }
        }

        $this->logActivity('updated', 'Invoice', $invoice->id, "Mengupdate invoice: {$invoice->invoice_number}");

        return redirect()->back()->with('success', 'Invoice updated successfully.');
    }

    public function updateStatus(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'required|in:Draft,Sent,Paid,Overdue',
        ]);

        $invoice->update(['status' => $validated['status']]);

        $this->logActivity('updated', 'Invoice', $invoice->id, "Mengupdate status invoice {$invoice->invoice_number} menjadi {$validated['status']}");

        return redirect()->back()->with('success', 'Invoice status updated.');
    }

    public function destroy(Invoice $invoice)
    {
        $this->logActivity('deleted', 'Invoice', $invoice->id, "Menghapus invoice: {$invoice->invoice_number}");
        $invoice->delete();
        return redirect()->back()->with('success', 'Invoice deleted.');
    }

    public function downloadPdf(Invoice $invoice)
    {
        $invoice->load('items');

        $settings = \App\Models\CompanySetting::first();

        // Dompdf butuh ekstensi GD untuk merender PNG; tanpa guard ini server tanpa GD akan 500
        $logo = null;
        $logoPath = public_path('letter/main-logo.png');
        if (is_file($logoPath) && extension_loaded('gd')) {
            $logo = 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath));
        }

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'settings' => $settings,
            'logo' => $logo,
        ])->setPaper('a4');

        return $pdf->stream(str_replace('/', '-', $invoice->invoice_number) . '.pdf');
    }
}
