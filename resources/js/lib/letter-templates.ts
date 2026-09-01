// Template isi surat (bagian badan saja).
// PENTING: Jangan menambahkan kop, "Kepada Yth.", tempat/tanggal, maupun blok tanda
// tangan di sini — semuanya sudah dirender otomatis oleh template PDF agar tidak dobel.
export const LETTER_TEMPLATES: Record<string, { subject: string; content: string }> = {
    'Surat Keputusan': {
        subject: 'Keputusan tentang [isi perihal]',
        content: `<p><strong>Menimbang:</strong></p><ol><li>Bahwa dalam rangka [alasan/tujuan/project], dipandang perlu untuk menetapkan keputusan manajemen;</li><li>Bahwa berdasarkan pertimbangan sebagaimana dimaksud pada angka 1, perlu ditetapkan Surat Keputusan ini.</li></ol><p><strong>MEMUTUSKAN</strong></p><p><strong>Menetapkan:</strong></p><ol><li>[Keputusan utama yang diambil];</li><li>[Ketentuan operasional tambahan];</li><li>Keputusan ini mulai berlaku sejak tanggal ditetapkan, dengan ketentuan apabila di kemudian hari terdapat kekeliruan akan diadakan perbaikan sebagaimana mestinya.</li></ol>`,
    },
    'Surat Tugas': {
        subject: 'Penugasan [nama kegiatan/project]',
        content: `<p>Dengan hormat,</p><p>Yang bertanda tangan di bawah ini, manajemen perusahaan, dengan ini memberikan tugas kepada:</p><p>Nama : [Nama Anggota Tim]<br>Jabatan : [Posisi/Role]</p><p>Untuk melaksanakan pekerjaan dengan ruang lingkup (scope of work) sebagai berikut:</p><ol><li>[Uraian tugas / deliverable 1];</li><li>[Uraian tugas / deliverable 2].</li></ol><p>Pelaksanaan tugas dilakukan pada:</p><p>Waktu : [Tanggal Mulai] s.d. [Tanggal Selesai]<br>Lokasi : [Studio/On-site/Remote]</p><p>Segala biaya yang timbul akibat pelaksanaan tugas ini dibebankan kepada [Sumber Anggaran].</p><p>Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab.</p>`,
    },
    'Surat Keterangan': {
        subject: 'Keterangan tentang [isi perihal]',
        content: `<p>Yang bertanda tangan di bawah ini, manajemen perusahaan, dengan ini menerangkan bahwa:</p><p>Nama : [Nama Pihak]<br>[Identitas lain] : [Data]</p><p>Adalah benar [uraian keterangan/status, misalnya: merupakan bagian dari tim kami untuk project X].</p><p>Surat keterangan ini diterbitkan untuk dipergunakan sebagai [tujuan penggunaan, misalnya: kelengkapan administrasi/perizinan].</p><p>Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>`,
    },
    'Surat Penawaran': {
        subject: 'Penawaran Kerja Sama [Nama Project/Layanan]',
        content: `<p>Dengan hormat,</p><p>Bersama surat ini kami sampaikan penawaran kerja sama untuk kebutuhan [Nama Project/Campaign], dengan rincian sebagai berikut:</p><ol><li><strong>Ruang Lingkup Pekerjaan (Scope of Work):</strong><ol><li>[Deliverable 1];</li><li>[Deliverable 2].</li></ol></li><li><strong>Jadwal Pelaksanaan:</strong> [estimasi timeline pengerjaan];</li><li><strong>Estimasi Biaya:</strong> [rincian harga / paket penawaran];</li><li><strong>Ketentuan Pembayaran:</strong> [termin pembayaran, misal: DP 50% dan pelunasan setelah serah terima].</li></ol><p>Penawaran ini berlaku hingga [tanggal berlaku]. Apabila diperlukan penyesuaian ruang lingkup maupun anggaran, kami terbuka untuk mendiskusikannya lebih lanjut.</p><p>Demikian penawaran ini kami sampaikan. Atas perhatian dan kepercayaan Bapak/Ibu, kami ucapkan terima kasih.</p>`,
    },
    'Surat Peringatan': {
        subject: 'Surat Peringatan [I/II/III] — [Nama Penerima]',
        content: `<p>Dengan hormat,</p><p>Berdasarkan hasil evaluasi kinerja dan operasional, kami menemukan hal yang tidak sesuai dengan standar serta ketentuan perusahaan, yaitu:</p><ol><li>[Uraian ketidaksesuaian/pelanggaran, misal: keterlambatan deliverable project X];</li><li>[Uraian lain apabila ada].</li></ol><p>Sehubungan dengan hal tersebut, surat ini diterbitkan sebagai <strong>Surat Peringatan [Pertama/Kedua/Ketiga]</strong>. Kami mengharapkan adanya perbaikan yang nyata dalam waktu [jumlah hari] hari sejak surat ini diterbitkan.</p><p>Apabila dalam jangka waktu tersebut tidak terdapat perbaikan, manajemen akan mengambil tindakan lebih lanjut sesuai dengan kebijakan perusahaan yang berlaku.</p><p>Demikian surat peringatan ini disampaikan untuk menjadi perhatian.</p>`,
    },
    'Surat Undangan': {
        subject: 'Undangan [Nama Acara/Meeting]',
        content: `<p>Dengan hormat,</p><p>Sehubungan dengan [latar belakang kegiatan], kami mengundang Bapak/Ibu untuk hadir pada:</p><p>Hari/Tanggal : [Hari, Tanggal]<br>Waktu : [Jam]<br>Tempat : [Lokasi / Zoom / Google Meet]</p><p>Adapun agenda yang akan dibahas adalah sebagai berikut:</p><ol><li>[Agenda 1];</li><li>[Agenda 2].</li></ol><p>Mengingat pentingnya acara tersebut, besar harapan kami Bapak/Ibu dapat hadir tepat waktu. Mohon konfirmasi kehadiran sebelum [tanggal konfirmasi].</p><p>Demikian undangan ini kami sampaikan. Atas perhatian dan kehadirannya, kami ucapkan terima kasih.</p>`,
    },
    'Surat Izin': {
        subject: 'Permohonan Izin [Keperluan] — [Nama Karyawan]',
        content: `<p>Dengan hormat,</p><p>Yang bertanda tangan di bawah ini:</p><p>Nama : [Nama Karyawan]<br>Jabatan : [Posisi/Role]<br>Divisi : [Nama Divisi]</p><p>Dengan ini mengajukan permohonan izin/cuti untuk keperluan [alasan izin] pada:</p><p>Mulai : [Tanggal Mulai]<br>Selesai : [Tanggal Selesai]<br>Total : [Jumlah Hari] hari kerja</p><p>Selama masa izin, pekerjaan/project yang sedang berjalan telah dikoordinasikan dengan [Nama Rekan] sebagai penanggung jawab sementara.</p><p>Demikian permohonan ini saya sampaikan. Atas perhatian dan persetujuannya, saya ucapkan terima kasih.</p>`,
    },
    'Surat Keterangan Kerja': {
        subject: 'Surat Keterangan Kerja — [Nama Karyawan]',
        content: `<p>Yang bertanda tangan di bawah ini, mewakili manajemen perusahaan, dengan ini menerangkan bahwa:</p><p>Nama : [Nama Karyawan]<br>Jabatan : [Posisi Terakhir]<br>Periode : [Tanggal Masuk] s.d. [Tanggal Keluar/Saat Ini]</p><p>Adalah benar karyawan/mitra kerja pada perusahaan kami. Selama masa kerjanya, yang bersangkutan telah menunjukkan kinerja, dedikasi, dan integritas yang baik dalam menangani berbagai project perusahaan.</p><p>Surat keterangan ini diterbitkan atas permintaan yang bersangkutan untuk dipergunakan sebagaimana mestinya.</p><p>Demikian surat keterangan ini dibuat dengan sebenar-benarnya.</p>`,
    },
    'Surat Pengantar': {
        subject: 'Pengantar [Perihal/Dokumen]',
        content: `<p>Dengan hormat,</p><p>Bersama surat ini kami sampaikan dokumen/berkas terkait [Nama Project/Keperluan] dengan rincian sebagai berikut:</p><ol><li>[Nama Dokumen 1] — [jumlah] berkas;</li><li>[Nama Dokumen 2] — [jumlah] berkas.</li></ol><p>Mohon kiranya dokumen tersebut dapat diperiksa dan diproses lebih lanjut. Apabila terdapat kekurangan, silakan menghubungi kami melalui kontak yang tertera.</p><p>Demikian surat pengantar ini kami sampaikan. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>`,
    },
    'Surat Pemberitahuan': {
        subject: 'Pemberitahuan [Topik]',
        content: `<p>Dengan hormat,</p><p>Bersama surat ini manajemen menyampaikan pemberitahuan mengenai [topik pemberitahuan, misal: libur operasional/perubahan jam kerja], dengan rincian sebagai berikut:</p><ol><li>[Detail informasi 1];</li><li>[Detail informasi 2].</li></ol><p>Ketentuan ini berlaku efektif sejak tanggal [Tanggal Efektif]. Apabila terdapat pertanyaan lebih lanjut, silakan menghubungi [PIC/kontak yang ditunjuk].</p><p>Demikian pemberitahuan ini kami sampaikan untuk menjadi perhatian. Atas pengertian dan kerja samanya, kami ucapkan terima kasih.</p>`,
    },
    'Surat Rekomendasi': {
        subject: 'Rekomendasi — [Nama]',
        content: `<p>Dengan hormat,</p><p>Yang bertanda tangan di bawah ini, mewakili manajemen perusahaan, dengan ini memberikan rekomendasi kepada:</p><p>Nama : [Nama Karyawan/Mitra]<br>Jabatan : [Posisi/Role selama bekerja sama]</p><p>Selama bekerja sama dengan kami, yang bersangkutan menunjukkan kompetensi dan etos kerja yang sangat baik, di antaranya:</p><ul><li>[Keunggulan 1, misal: kemampuan art direction yang kuat];</li><li>[Keunggulan 2, misal: disiplin terhadap tenggat waktu].</li></ul><p>Berdasarkan hal tersebut, kami merekomendasikan yang bersangkutan untuk [tujuan rekomendasi, misal: menempati posisi baru/melanjutkan studi].</p><p>Demikian surat rekomendasi ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>`,
    },
    'Surat Permohonan': {
        subject: 'Permohonan [Tujuan Permohonan]',
        content: `<p>Dengan hormat,</p><p>Bersama surat ini kami bermaksud mengajukan permohonan [tujuan permohonan, misal: izin penggunaan lokasi] untuk keperluan [nama kegiatan/project], dengan rincian sebagai berikut:</p><p>Hari/Tanggal : [Tanggal]<br>Waktu : [Jam]<br>Kebutuhan : [Detail kebutuhan/aktivitas]<br>Jumlah Tim : [Jumlah orang]</p><p>Kami berkomitmen untuk menjaga ketertiban serta mematuhi seluruh ketentuan yang berlaku selama kegiatan berlangsung.</p><p>Demikian permohonan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.</p>`,
    },
    'Surat Kontrak': {
        subject: 'Perjanjian Kerja Sama — [Nama Project]',
        content: `<p>Pada hari ini, [Hari, Tanggal], pihak-pihak yang bertanda tangan di bawah ini:</p><ol><li><strong>Pihak Pertama</strong>: [Nama Perusahaan/Perwakilan], selanjutnya disebut sebagai penyedia jasa;</li><li><strong>Pihak Kedua</strong>: [Nama Klien/Vendor], selanjutnya disebut sebagai pengguna jasa.</li></ol><p>Kedua belah pihak sepakat mengikatkan diri dalam perjanjian kerja sama dengan ketentuan sebagai berikut:</p><ol><li><strong>Ruang Lingkup Pekerjaan:</strong> [detail pekerjaan/deliverables yang disepakati];</li><li><strong>Nilai Kontrak dan Pembayaran:</strong> [nominal total beserta termin, misal: DP 50%, pelunasan 50% setelah serah terima];</li><li><strong>Jangka Waktu Pelaksanaan:</strong> [jadwal mulai hingga selesai];</li><li><strong>Revisi:</strong> [batas revisi, misal: maksimal 2 kali revisi minor];</li><li><strong>Hak Kekayaan Intelektual:</strong> [kepemilikan aset akhir setelah pelunasan].</li></ol><p>Demikian perjanjian ini dibuat dalam keadaan sadar, tanpa paksaan dari pihak mana pun, dan mengikat kedua belah pihak.</p>`,
    },
    'Surat Pernyataan': {
        subject: 'Surat Pernyataan',
        content: `<p>Yang bertanda tangan di bawah ini:</p><p>Nama : [Nama Lengkap]<br>NIK / No. Identitas : [Nomor KTP/Identitas]<br>Jabatan : [Posisi/Role]<br>Alamat : [Alamat Lengkap]</p><p>Dengan ini menyatakan dengan sebenar-benarnya bahwa:</p><ol><li>[Isi pernyataan 1];</li><li>[Isi pernyataan 2].</li></ol><p>Demikian surat pernyataan ini dibuat dalam keadaan sadar dan tanpa ada paksaan dari pihak mana pun, untuk dipergunakan sebagaimana mestinya.</p>`,
    },
    'Berita Acara': {
        subject: 'Berita Acara Serah Terima [Pekerjaan/Barang]',
        content: `<p>Pada hari ini, [Hari, Tanggal], bertempat di [Lokasi/Tempat], telah dilakukan serah terima [pekerjaan/barang/jasa] oleh dan antara:</p><ol><li><strong>PIHAK PERTAMA (Yang Menyerahkan):</strong><br>Nama : [Nama Perwakilan]<br>Jabatan : [Posisi/Role]<br>Instansi : [Nama Perusahaan/Vendor]</li><li><strong>PIHAK KEDUA (Yang Menerima):</strong><br>Nama : [Nama Perwakilan Klien]<br>Jabatan : [Posisi/Role]<br>Instansi : [Nama Klien/Instansi]</li></ol><p>Kedua belah pihak telah menyepakati hal-hal sebagai berikut:</p><ol><li>PIHAK PERTAMA menyerahkan kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima dari PIHAK PERTAMA berupa [jelaskan secara detail apa yang diserahkan].</li><li>Bahwa [pekerjaan/barang/jasa] yang diserahkan telah diperiksa dan dinyatakan [dalam keadaan baik/sesuai dengan spesifikasi dan kontrak/berfungsi sebagaimana mestinya].</li></ol><p>Demikian Berita Acara Serah Terima ini dibuat dalam rangkap 2 (dua) yang memiliki kekuatan hukum yang sama, untuk dapat dipergunakan sebagaimana mestinya.</p>`,
    },
};
