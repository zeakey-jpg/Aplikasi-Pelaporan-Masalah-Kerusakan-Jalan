import os

from datetime import datetime
from os import path
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "ubah-dengan-rahasia")
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(BASE_DIR, "reports.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["ADMIN_PASSWORD"] = os.environ.get("ADMIN_PASSWORD", "admin123")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy(app)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(120), nullable=False)
    telepon = db.Column(db.String(32), nullable=False)
    deskripsi = db.Column(db.Text, nullable=False)
    latitude = db.Column(db.String(64), nullable=False)
    longitude = db.Column(db.String(64), nullable=False)
    nama_file = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(64), nullable=False, default="Diterima")
    komentar_admin = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Report {self.id} {self.status}>"

with app.app_context():
    db.create_all()


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def is_valid_image(path):
   ext = path.rsplit('.', 1)[1].lower()
   return ext in ALLOWED_EXTENSIONS

def admin_required():
    return session.get("admin", False)


@app.route("/", methods=["GET", "POST"])
def report():
    if request.method == "POST":
        nama = request.form.get("nama", "").strip()
        telepon = request.form.get("telepon", "").strip()
        deskripsi = request.form.get("deskripsi", "").strip()
        latitude = request.form.get("latitude", "").strip()
        longitude = request.form.get("longitude", "").strip()
        photo = request.files.get("photo")

        if not nama or not telepon or not deskripsi or not latitude or not longitude:
            flash("Semua kolom wajib diisi, termasuk lokasi GPS.", "danger")
            return redirect(url_for("report"))

        if not photo or photo.filename == "":
            flash("Unggah foto yang sesuai dengan kondisi jalan rusak.", "danger")
            return redirect(url_for("report"))

        if not allowed_file(photo.filename):
            flash("Jenis file tidak didukung. Gunakan PNG, JPG, JPEG, atau GIF.", "danger")
            return redirect(url_for("report"))

        filename = secure_filename(photo.filename)
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
        saved_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], saved_filename)
        photo.save(filepath)

        if not is_valid_image(filepath):
            os.remove(filepath)
            flash("Gagal memproses foto. Pastikan file gambar valid.", "danger")
            return redirect(url_for("report"))

        report = Report(
            nama=nama,
            telepon=telepon,
            deskripsi=deskripsi,
            latitude=latitude,
            longitude=longitude,
            nama_file=saved_filename,
            status="Diterima",
        )
        db.session.add(report)
        db.session.commit()

        return redirect(url_for("thank_you", report_id=report.id))

    return render_template("report.html")


@app.route("/thank-you/<int:report_id>")
def thank_you(report_id):
    report = Report.query.get_or_404(report_id)
    return render_template("thank_you.html", report=report)


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():
    if request.method == "POST":
        password = request.form.get("password", "")
        if password == app.config["ADMIN_PASSWORD"]:
            session["admin"] = True
            return redirect(url_for("admin_dashboard"))
        flash("Password admin salah.", "danger")
        return redirect(url_for("admin_login"))
    return render_template("admin_login.html")


@app.route("/admin/logout")
def admin_logout():
    session.pop("admin", None)
    return redirect(url_for("admin_login"))


@app.route("/admin")
def admin_dashboard():
    if not admin_required():
        return redirect(url_for("admin_login"))
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return render_template("admin_dashboard.html", reports=reports)


@app.route("/admin/report/<int:report_id>", methods=["GET", "POST"])
def admin_report_detail(report_id):
    if not admin_required():
        return redirect(url_for("admin_login"))

    report = Report.query.get_or_404(report_id)
    if request.method == "POST":
        report.status = request.form.get("status", report.status)
        report.komentar_admin = request.form.get("komentar_admin", report.komentar_admin)
        db.session.commit()
        flash("Perubahan laporan berhasil disimpan.", "success")
        return redirect(url_for("admin_dashboard"))

    return render_template("admin_detail.html", report=report)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


@app.route("/riwayat", methods=["GET", "POST"])
def riwayat():
    reports = []
    telepon = ""
    if request.method == "POST":
        telepon = request.form.get("telepon", "").strip()
        if telepon:
            reports = Report.query.filter_by(telepon=telepon).order_by(Report.created_at.desc()).all()
    return render_template("riwayat.html", reports=reports, telepon=telepon)
