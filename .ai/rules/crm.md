---
paths:
  - 'app/Http/Controllers/Crm/**'
---

# Crm

## CRM module reuses existing modules; master data in Support\Crm
CRM (menu group "CRM": crm-dashboard, crm-prospects, crm-pipeline, crm-activities, crm-quotations in MenuRegistry) is native to the app, not standalone.
- New tables only: crm_prospects, crm_prospect_stage_histories, crm_activities. Models: Prospect, ProspectStageHistory, CrmActivity.
- Penawaran REUSES the existing Quotation module (quotations.prospect_id FK links back; no new quotation table/numbering). Conversion REUSES Client (Prospect->convertToClient dedupes by name/email, never duplicates).
- Pipeline stages, sources, priorities, statuses, activity types, industries, need-field keys all live in App\Support\Crm (single source of truth for validation, Excel template, and Referensi sheet). Never hardcode these elsewhere.
- Access via existing menu:<key> middleware + role_menu_permissions (Sales = marketing role; direktur_utama sees all). No new roles.
- Excel via maatwebsite/excel v4: Exports need the Export marker (WithMultipleSheets does NOT extend it); reading uses Import+WithHeadingRow with Excel::toArray. Import flow is upload->preview(validate+dedupe)->confirm (ProspectImportService), never direct insert.
- ProspectService.moveStage records stage history + sets terminal status; ActivityController.refreshProspectSchedule keeps next_follow_up_at/last_activity_at in sync.
- Tests use DatabaseTransactions + User::first() defensive skip; run against MySQL (DB_CONNECTION=mysql DB_DATABASE=ctech_management php artisan test) since repo role migrations use MySQL-only ENUM and fail on the phpunit sqlite :memory:.
