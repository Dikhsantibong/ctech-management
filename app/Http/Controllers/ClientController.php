<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $clients = Client::with(['projects', 'invoices'])->latest()->get();
        return Inertia::render('clients/index', [
            'clients' => $clients
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pic' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $client = Client::create($validated);

        $this->logActivity('created', 'Client', $client->id, "Membuat client baru: {$client->name}");

        return redirect()->back()->with('success', 'Client created successfully.');
    }

    public function show(Client $client)
    {
        $client->load(['projects', 'invoices']);
        return Inertia::render('clients/show', [
            'client' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'pic' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ]);

        $client->update($validated);

        $this->logActivity('updated', 'Client', $client->id, "Mengupdate client: {$client->name}");

        return redirect()->back()->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $this->logActivity('deleted', 'Client', $client->id, "Menghapus client: {$client->name}");
        $client->delete();
        return redirect()->back()->with('success', 'Client deleted successfully.');
    }
}
