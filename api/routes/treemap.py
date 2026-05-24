from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
import plotly.express as px

treemap_bp = Blueprint("treemap", __name__, url_prefix="/api")

@treemap_bp.route("/api/create-treemap", methods=["POST"])
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