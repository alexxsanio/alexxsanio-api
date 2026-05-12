from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import plotly.express as px

from utility.compare_job_description import sentences2vec, centroid_distance, highlight_text, extract_matches
import json

app = Flask(__name__)
CORS(app, origins=[
    "https://alexxsanio-api.vercel.app"
])

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

@app.route("/api/create-treemap", methods=["POST"])
def create_treemap():
    file = request.files["file"]
    group_by = request.form["group_by"]

    df = pd.read_csv(file)

    counts = (
        df[group_by]
        .fillna("Unknown")
        .astype(str)
        .value_counts()
        .reset_index()
    )

    counts.columns = [group_by, "count"]

    fig = px.treemap(
        counts,
        path=[group_by],
        values="count",
        color="count",
    )

    fig.update_layout(
        margin=dict(t=30, l=10, r=10, b=10)
    )

    html = fig.to_html(
        full_html=False,
        include_plotlyjs="cdn"
    )

    return jsonify({
        "html": html
    })

# -------- Run Server --------
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)