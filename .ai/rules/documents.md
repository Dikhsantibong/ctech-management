---
paths:
  - 'app/Services/Documents/**'
---

# Documents

## Tanda tangan elektronik dokumen: DocumentSigner + PDF beku
Surat (Letter), Penawaran/RAB (Quotation), Kwitansi (Invoice) mengimplementasikan App\Services\Documents\SignableDocument + trait HasDocumentSignatures; tabel document_signatures (morph). Tanda tangan/cabut/cetak TTD basah hanya lewat DocumentSignatureController (route signatures/{letter|quotation|kwitansi}/{id}/…), khusus role direktur_utama + konfirmasi password — jangan buka lewat MCP.
- Saat ditandatangani, PDF final dibekukan di disk privat "local" dan sidik SHA-256 dicatat; unduhan dokumen bertanda tangan WAJIB lewat DocumentSigner::signedPdfResponse (byte identik), jangan dirender ulang.
- Dokumen bertanda tangan terkunci (update/edit/destroy → 423) sampai dicabut. Gambar TTD/cap ada di company_settings (disk privat, hidden dari JSON).
- Dokumen baru yang butuh TTD: implement SignableDocument, tambah builder PDF dengan partial pdf/partials/signature-mark & signature-qr, daftarkan di DocumentSigner::renderer dan DocumentSignatureController::DOCUMENTS.
- Verifikasi publik: /verifikasi-dokumen/{token} (token acak, bukan kode dokumen).
