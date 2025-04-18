from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# Webpage
@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")



# Other
@app.route('/api/posts', methods=['GET'])
def get_posts():
    with open("posts.json", "r") as file:
        posts = json.load(file)
    return jsonify(posts)



if __name__ == '__main__':
    app.run(debug=True)
