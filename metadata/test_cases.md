| No | ID | Description | Test Data | Expected Results |
|----|----|-------------|------------|------------------|
| 1 | UT1-1 | Mengakses Halaman Library | Username: Email Universitas Ciputra<br>Password: Password Email Universitas Ciputra | User diarahkan ke halaman Library |
| 2 | UT2-1 | Mengakses Online Catalog | - | User dapat melihat daftar buku yang tersedia di Library Universitas Ciputra Surabaya |
| 3 | UT2-2 | Melakukan Pencarian Buku Menggunakan Filter (Empty Title) | Location: Universitas Ciputra Surabaya<br>Judul: "" | Muncul semua list buku yang dipunyai library |
| 4 | UT2-3 | Melakukan Pencarian Buku Menggunakan Filter (Publisher Filter) | Location: Universitas Ciputra Surabaya<br>Judul: contain - Masakan<br>Publisher ≠ PT Gramedia Pustaka Utama | User dapat melakukan pencarian buku menggunakan filter yang tersedia |
| 5 | UT2-4 | Melakukan Pencarian Buku Menggunakan Filter (Specific Title) | Location: Universitas Ciputra Surabaya<br>Judul: Masakan 123 | Muncul list buku sesuai judul yang telah di-search |
| 6 | UT2-5 | Melihat Detail Buku dan Memilih yang Akan Dipinjam | Memilih 3 buku teratas setelah klik Search | User dapat memilih buku yang akan dipinjam |
| 7 | UT2-6 | Menghubungi PIC Library | - | User diarahkan ke aplikasi WhatsApp atau WhatsApp Web |
| 8 | UT2-7 | Menambahkan Buku ke Reservation Basket | Location: Universitas Ciputra Surabaya<br>Judul: contain - Olahraga | Buku berhasil ditambahkan ke Reservation Basket |
| 9 | UT2-8 | Menghapus Data Basket Sebelumnya | Location: Universitas Ciputra Surabaya<br>Judul: contain - Olahraga | Data basket sebelumnya berhasil terhapus dan digantikan dengan buku yang baru dipilih |
| 10 | UT3-1 | Mengakses My Reservation Basket | - | User berhasil masuk ke halaman My Reservation Basket |
| 11 | UT3-2 | Melihat Daftar Basket Loan | - | Data loan book pada bagian Basket Loan List berhasil ditampilkan |
| 12 | UT3-3 | Menghapus Salah Satu Basket Loan List | - | User dapat menghapus buku yang terdapat pada Reservation Basket |
| 13 | UT3-4 | Melakukan Online Booking | Alamat Pengiriman: Universitas Ciputra Surabaya | User dapat melakukan online booking menggunakan fitur yang tersedia |
| 14 | UT3-5 | Melihat Riwayat Online Booking | - | User dapat melihat riwayat online booking |
| 15 | UT4-1 | Mengakses Form Request Collection | - | User diarahkan ke halaman Form Request Collection |
| 16 | UT4-2 | Mengisi dan Mengirim Form Request Collection (Valid) | Jenis Koleksi: Hardcover<br>Judul: Fisika<br>Pengarang: Salvador Samuel Molina Burgos<br>Penerbit: Giltza<br>ISBN: 8483783959<br>Edisi: 1<br>Tahun: 2016 | Form request berhasil dikirim dan tersimpan pada Data Request Collection |
| 17 | UT4-3 | Mengisi dan Mengirim Form Request Collection (Invalid) | Semua field dikosongkan | Loading tidak bisa disubmit |
| 18 | UT4-4 | Mengakses dan Melihat Data Request Collection | - | User diarahkan ke halaman Data Request Collection |
| 19 | UT4-5 | Mencari Data Form yang Telah Diisi | Search: fisika | User dapat menemukan data form yang telah dicari |