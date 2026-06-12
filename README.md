# Aplikasi Pelaporan Masalah Kerusakan Jalan

Aplikasi ini dibuat untuk membantu masyarakat mengirim laporan kerusakan jalan secara realtime dengan lokasi GPS dan bukti foto. Laporan akan diterima oleh pihak admin dan dapat ditindaklanjuti, termasuk komentar dari pihak pengelola.

## Fitur

- Form laporan dengan lokasi GPS otomatis.
- Unggah foto bukti kondisi jalan rusak.
- Admin dapat melihat semua laporan.
- Admin dapat mengubah status laporan dan menambahkan komentar.
- Foto hanya menerima format gambar yang valid.

## Teknologi

- Python
- Flask
- Flask-SQLAlchemy
- SQLite

## Cara Menjalankan

1. Buat virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install dependensi:

```bash
pip install -r requirements.txt
```

3. Jalankan aplikasi:

```bash
python app.py
```

4. Buka browser dan akses:

- Pelapor: `http://127.0.0.1:5000/`
- Admin: `http://127.0.0.1:5000/admin/login`

## Login Admin

Password default: `admin123`

> Untuk keamanan, ganti password admin dengan variabel lingkungan `ADMIN_PASSWORD` atau ubah di file `app.py`.
