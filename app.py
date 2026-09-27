from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():
    if "image" not in request.files:
        return jsonify(success=False, message="Please select an image."), 400
    image = request.files["image"]
    if not image.filename:
        return jsonify(success=False, message="Please select an image."), 400
    if not allowed_file(image.filename):
        return jsonify(success=False, message="Only PNG, JPG and JPEG files are supported."), 400

    filename = secure_filename(image.filename)
    image.save(os.path.join(UPLOAD_FOLDER, filename))

    return jsonify(
        success=True,
        text="Image uploaded successfully. Connect an OCR/CNN model here for real handwriting-to-text recognition."
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
