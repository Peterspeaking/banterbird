from flask import Flask, render_template, jsonify, request, g
import json
import hashlib
from os import urandom
from base64 import b64encode
import sqlite3
from typing import Optional

app = Flask(__name__)
database_path = "clients.db"


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect("clients.db")
    return g.db

@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def generate_salt() -> bytes:
    # 128 bit salt value
    salt = urandom(16)
    return salt


def hash_password( password: str, salt: Optional[bytes] = None) -> tuple[str, bytes, str, int]:
    if salt is None:
        salt = generate_salt()
    iterations = 100_000
    function = "pbkdf2_hmac"
    hash_value = b64encode(
        hashlib.pbkdf2_hmac(
            "sha512",
            password.encode("utf-8"),
            salt,
            iterations
        )
    ).decode("utf-8")
    return_value = (hash_value, salt, function, iterations)
    return return_value



# Webpage
@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

@app.route("/login", methods=['GET'])
def login():
    return render_template("login.html")

@app.route("/new-account", methods=['GET'])
def new_account():
    return render_template("register.html")


# Other
@app.route('/api/posts', methods=['GET'])
def get_posts():
    with open("posts.json", "r") as file:
        posts = json.load(file)
    return jsonify(posts)

@app.route('/api/add_post', methods=['POST'])
def add_posts():
    new_post = request.get_json()
    with open("posts.json", "r") as file:
        posts = json.load(file)
    posts.insert(0, new_post)
    with open("posts.json", "w") as file:
        json.dump(posts, file, indent=4)

    return jsonify({"status": "success"}), 201

@app.route('/api/login', methods=['POST'])
def login_data():
    conn = get_db()
    cursor = conn.cursor()
    data = request.get_json()
    username = data['username']
    password = data['password']
    cursor.execute('''SELECT password, salt, hash_algo, iterations FROM clients WHERE username = ?''', (username,))
    row = cursor.fetchone()
    if row is None:
        return jsonify({"status": "fail"}), 401

    else:
        stored_password, salt, hash_algo, iterations = row
        if hash_algo == "pbkdf2_hmac":
            hashed_password = hash_password(password, salt)[0]
            if hashed_password == stored_password:
                return jsonify({"status": "success"}), 201

@app.route("/api/register", methods=['POST'])
def register_data():
    try:
        conn = get_db()
        cursor = conn.cursor()
        data = request.get_json()
        username = data['username']
        plain_password = data['password']
        print(username, plain_password)
        password, salt, hash_algo, iterations = hash_password(plain_password)
        cursor.execute('''
            INSERT INTO clients (username, password, salt, hash_algo, iterations)
            VALUES (?, ?, ?, ?, ?)
            ''', (username, password, salt, hash_algo, iterations))
        conn.commit()
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "fail"}), 409
    except Exception as e:
        print(e)
        return jsonify({"status": "fail"}), 500

if __name__ == '__main__':
    with app.app_context():
        db = get_db()
        db_cursor = db.cursor()
        db.execute("PRAGMA foreign_keys = ON;")
        db_cursor.execute('''
            CREATE TABLE IF NOT EXISTS clients (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                salt BLOB NOT NULL,
                hash_algo TEXT NOT NULL,
                iterations INTEGER NOT NULL
            )
        ''')
        db.commit()
        db.close()
        print("Table created successfully")
    app.run(debug=True)
