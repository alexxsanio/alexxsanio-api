from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.compare import compare_bp
from routes.treemap import treemap_bp

app = Flask(__name__)

CORS(app, origins=[
    "https://alexxsanio-api.vercel.app"
])


app.register_blueprint(compare_bp)
app.register_blueprint(treemap_bp)

if __name__ == "__main__":
    app.run(debug=True)