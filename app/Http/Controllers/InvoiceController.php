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
        $invoices = Invoice::latest()->get();
        return Inertia::render('invoices/index', [
            'invoices' => $invoices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'due_date' => 'required|date',
            'tax_rate' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        // Generate invoice number e.g. INV-2026-001
        $count = Invoice::whereYear('created_at', date('Y'))->count() + 1;
        $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        $subtotal = 0;
        foreach ($validated['items'] as $item) {
            $subtotal += $item['quantity'] * $item['price'];
        }
        $tax = $subtotal * ($validated['tax_rate'] / 100);
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
        
        $pdf = Pdf::loadView('pdf.invoice', ['invoice' => $invoice]);
        
        return $pdf->stream($invoice->invoice_number . '.pdf');
    }
}
