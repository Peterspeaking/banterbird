from flask import Flask, render_template, jsonify
import json
from pathlib import Path
app = Flask(__name__)
DATA_FILE = Path("posts.json")

def load_posts():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/api/posts')
def get_posts():
    posts = load_posts()
    return jsonify(posts)

if __name__ == '__main__':
    app.run(debug=True)
