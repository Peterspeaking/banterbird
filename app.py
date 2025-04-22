from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/api/posts')
def get_posts():
    with open('data.json', 'r') as file:
        posts = json.load(file)
    return jsonify(posts)

if __name__ == '__main__':
    app.run(debug=True)
