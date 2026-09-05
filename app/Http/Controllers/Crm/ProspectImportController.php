<?php

namespace App\Http\Controllers\Crm;

use App\Exports\ProspectTemplateExport;
use App\Http\Controllers\Controller;
use App\Services\ProspectImportService;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ProspectImportController extends Controller
{
    use LogsActivity;

    public function create()
    {
        return Inertia::render('crm/prospects/import', [
            'preview' => null,
        ]);
    }

    public function template()
    {
        return Excel::download(new ProspectTemplateExport, 'template-import-prospek.xlsx');
    }

    public function preview(Request $request, ProspectImportService $service)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:5120'],
        ]);

        $preview = $service->preview($request->file('file'));

        return Inertia::render('crm/prospects/import', [
            'preview' => $preview,
        ]);
    }

    public function store(Request $request, ProspectImportService $service)
    {
        $validated = $request->validate([
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.payload' => ['required', 'array'],
            'rows.*.action' => ['required', 'in:create,update,skip'],
            'rows.*.existing_prospect_id' => ['nullable', 'integer'],
            'rows.*.existing_client_id' => ['nullable', 'integer'],
        ]);

        $imported = $service->applyRows($validated['rows'], Auth::id());

        $this->logActivity('imported', 'Prospect', null, "Import {$imported} prospek dari Excel");

        return redirect()->route('crm.prospek.index')->with('success', "{$imported} prospek berhasil diimport.");
    }
}
