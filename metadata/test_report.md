# Laporan Hasil Pengujian Otomatis (E2E Testing)

**Proyek:** SQA Trial UC
**Framework:** Playwright (TypeScript)
**Waktu Eksekusi Laporan:** Juni 2026

---

## 1. Ringkasan Pengerjaan

Pengujian otomatis *End-to-End* (E2E) telah berhasil diimplementasikan sepenuhnya berdasarkan dokumen panduan `test_cases.md` dan struktur `ai_test_spec.json`. Selama proses *development*, aturan *strict* pada `development_rules.md` (seperti tidak menggunakan komentar dalam kode) ditaati dengan ketat.

### Lingkup Implementasi:
1. **Sistem Autentikasi (Global Setup):**
   - Menggunakan pendekatan *storage state* (`playwright/.auth/user.json`) sehingga seluruh tes dapat berjalan dalam sesi yang sudah terautentikasi (login) tanpa perlu melakukan *login* berulang-ulang di setiap tes.
   - Kredensial *login* aman dan diimpor menggunakan file `.env`.
2. **Penyesuaian Arsitektur UI Aplikasi:**
   - Karena navigasi `Library` tidak berbentuk tautan langsung melainkan terletak di dalam *Sidebar Menu* berbentuk *dialog/offcanvas*, sebuah fungsi khusus `navigateToLibraryMenu()` dibuat untuk mensimulasikan interaksi klik *hamburger menu*, akordion `My Activity`, lalu ke menu utama `Library`.
   - Mengatasi interupsi *pointer events* akibat implementasi **Select2 dropdown** (seperti *overlay mask* `<div id="select2-drop-mask">`) yang secara asinkron memblokir interaksi dengan tombol *Search* atau *Add Filter*.
3. **Penyusunan 16 Test Cases Utama:**
   - **UT1:** Menguji aksesibilitas dasar modul *Library*.
   - **UT2:** Menguji fitur pencarian katalog, filter, penambahan koleksi ke keranjang (*basket*), hingga interaksi popup ke pustakawan.
   - **UT3:** Pengujian pengaksesan keranjang reservasi (*Reservation Basket*) dan riwayat *Online Booking*.
   - **UT4:** Pengujian proses pengajuan koleksi baru (*Request Collection*) dan fitur pencarian riwayat data yang diajukan.

---

## 2. Hasil Eksekusi Pengujian Terakhir

Total terdapat **17 *Test Steps*** (16 skenario uji + 1 setup autentikasi).

* **Total Passed:** 16
* **Total Failed:** 1

Mayoritas skenario tes berjalan dengan mulus dan mengonfirmasi bahwa alur UI bekerja seperti yang diharapkan. Namun, terdapat 1 tes yang gagal (berupa **critical bug** dari aplikasi web).

### Daftar Pengujian yang Berhasil (PASSED):
1. ✅ **Setup:** Autentikasi dan penyimpanan *Storage State*
2. ✅ **UT1-1:** Mengakses Halaman Library
3. ✅ **UT2-1:** Mengakses Online Catalog
4. ✅ **UT2-2:** Melakukan Pencarian Buku Menggunakan Filter
5. ✅ **UT2-3:** Melihat detail buku dan Memilih yang akan dipinjam
6. ✅ **UT2-4:** Menghubungi PIC Library (Asking Librarian)
7. ✅ **UT2-5:** Menambahkan Buku ke Reservation Basket
8. ✅ **UT2-6:** Menghapus Data Basket Sebelumnya
9. ✅ **UT3-1:** Mengakses My Reservation Basket
10. ✅ **UT3-2:** Melihat Daftar Basket Loan
11. ✅ **UT3-3:** Menghapus Salah Satu Basket Loan List
12. ✅ **UT3-4:** Melakukan Online Booking
13. ✅ **UT3-5:** Melihat Riwayat Online Booking
14. ✅ **UT4-1:** Mengakses Form Request Collection
15. ✅ **UT4-3:** Mengakses dan Melihat Data Request Collection
16. ✅ **UT4-4:** Mencari Data Form yang Telah Diisi

---

## 3. Detail Analisis Kegagalan Tes (Issues & Bugs)

Berikut adalah hasil identifikasi untuk setiap pengujian yang gagal:

### A. Critical Bug Aplikasi Target (Real Failure)
* **Status:** 🔴 FAILED (Bug dari Server Web UC)
* **Skenario:** `UT4-2: Mengisi dan Mengirim Form Request Collection`
* **Deskripsi Error:** Saat tes mengisi lengkap formulir "Library New Collection" (Hardcover, Fisika, dsb) lalu menekan tombol `Submit data`, server merespons dengan layar *error* (kode 500) alih-alih sukses tersimpan.
* **Tangkapan Sistem:** 
  > *"Sorry, something went wrong. Error Date: 2026-06-02. Error Id: ##-9e87f5-c1e0-71f9-8373-f88ae93e97bf. Please screenshot this error page and give it to your developer..."*
* **Saran:** Developer web perlu mengecek error log di *backend* untuk penanganan submit "Request Collection".

## 4. Kesimpulan

Proyek pengujian SQA otomatis untuk situs percoban Perpustakaan Universitas Ciputra sudah terbangun dalam ekosistem **Playwright**.
Sebagian besar fitur *front-end* bekerja dengan baik, namun terdapat **Satu (1) Bug Fungsional Backend pada fitur pengajuan Koleksi Baru** yang harus diteruskan ke tim pengembang. Kecepatan navigasi dan reaktivitas komponen *Select2* yang digunakan web tersebut memerlukan sinkronisasi ekstra dalam otomasi *Testing*, namun *test suite* yang dibuat dapat dipelihara dan menjadi fondasi pengujian masa mendatang.
