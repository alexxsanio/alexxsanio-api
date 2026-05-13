from flask import Flask, Blueprint, request, send_file, jsonify
import tempfile
import os

from utils.pdf2speech import pdf2texts, text2speech

pdf2speech_bp = Blueprint("pdf2speech", __name__)

@pdf2speech_bp.route("/pdf2speech", methods=["POST"])
def pdf2speech():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    start_page = int(request.form.get("start_page", 0))
    end_page = request.form.get("end_page", 0)
    end_page = int(end_page) if end_page is not None else 0

    # Save uploaded PDF temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_pdf:
        pdf_path = tmp_pdf.name
        file.save(pdf_path)

    try:
        # 1. Extract text
        texts = pdf2texts(pdf_path, start_page, end_page)
        print("texts ---------------------------", texts)

        if not texts or texts.strip() == "":
            return jsonify({"error": "No text extracted from PDF"}), 400

        # 2. Convert to speech
        audio_path = text2speech(texts)  # returns "speech.wav"

        # 3. Return file
        return send_file(
            audio_path,
            mimetype="audio/wav",
            as_attachment=True,
            download_name="speech.wav"
        )

    finally:
        # cleanup PDF
        if os.path.exists(pdf_path):
            os.remove(pdf_path)