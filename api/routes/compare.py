from flask import Blueprint, request, jsonify
from utils.compare_job_description import sentences2vec, centroid_distance, highlight_text, extract_matches
import json

compare_bp = Blueprint("compare", __name__)

@app.route("/api/compare-job-description", methods=["POST"])
def compare_description_responsibility():
    data = request.get_json()

    responsibility = data.get("jobResponsibility", "")
    job_skills = data.get("jobSkills", "")
    resume_experience = data.get("resumeExperience", "")
    resume_skills = data.get("resumeSkills", "")

    with open("skills.json", "r") as f:
        keywords = json.load(f)

    job_text = f"{responsibility} {job_skills}"
    resume_text = f"{resume_experience} {resume_skills}"

    job_matches = extract_matches(job_text, keywords)
    resume_matches = extract_matches(resume_text, keywords)

    missing_keywords = [kw for kw in job_matches if kw not in resume_matches]

    vec1 = sentences2vec(responsibility)
    vec2 = sentences2vec(resume_experience)
    responsibility_score = round(centroid_distance(vec1, vec2)*10, 4)

    return jsonify({
        "highlightedJob": highlight_text(job_text, keywords),
        "highlightedResume": highlight_text(resume_text, keywords),
        "missingKeywords": missing_keywords,
        "responsibilityScore": float(responsibility_score),
    })