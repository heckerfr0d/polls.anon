from flask import current_app, g
from psycopg2 import connect
from datetime import datetime
import hashlib

def get_db():
    if 'db' not in g:
        DATABASE_URL = current_app.config['DATABASE_URL']
        # g.db = connect(DATABASE_URL, sslmode='require')
        g.db = connect(DATABASE_URL)
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_app(app):
    app.teardown_appcontext(close_db)

class User:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.authenticated = True

    def is_active(self):
        return True

    def get_id(self):
        return self.username

    def is_authenticated(self):
        return self.authenticated

    def is_anonymous(self):
        return False

def hash_password(password):
    return hashlib.sha3_512(password.encode()).hexdigest()

def get_user(username):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT username, password FROM users WHERE username=%s", (username,))
    user = cur.fetchone()
    cur.close()
    if user:
        return User(user[0], user[1])
    return None

def auth(username, password):
    user = get_user(username)
    if user:
        if user.password == hash_password(password):
            return user
    return None

def add_user(username, password):
    user = get_user(username)
    if user is None:
        db = get_db()
        cur = db.cursor()
        password = hash_password(password)
        cur.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, password))
        db.commit()
        cur.close()
        return User(username, password)
    return None

def get_polls(username):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, title, created, expire FROM polls WHERE oid=(SELECT id FROM users WHERE username=%s)", (username,))
    polls = cur.fetchall()
    cur.close()
    active = []
    expired = []
    for id, title, created, expire in polls:
        tz = created.tzinfo
        if expire < datetime.now(tz):
            expired.append((id, title, created, expire))
        else:
            active.append((id, title, created, expire))
    print(active)
    print(expired)
    return {'active': active, 'expired': expired}

def get_qns(username, id):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, title, created, expire FROM polls WHERE oid=(SELECT id FROM users WHERE username=%s) AND id=%s", (username, id))
    poll = cur.fetchone()
    if not poll:
        return {'error': 'poll not found'}
    cur.execute("SELECT qn, options FROM qns WHERE oid=(SELECT id FROM users WHERE username=%s) AND pid=%s", (username, id))
    qns = cur.fetchall()
    cur.close()
    return {'id': poll[0], 'title': poll[1], 'created': poll[2], 'expire': poll[3], 'questions': [(qn, options) for qn, options in qns]}

def create_poll(username, title, expire, qns):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM users WHERE username=%s", (username,))
    oid = cur.fetchone()
    cur.execute("INSERT INTO polls (oid, title, created, expire) VALUES (%s, %s, %s, %s)", (oid[0], title, datetime.now(), expire))
    pid = cur.lastrowid
    for qn, options in qns:
        cur.execute("INSERT INTO qns (pid, qn, options) VALUES (%s, %s, %s)", (pid, qn, options))
    db.commit()
    cur.close()
    return {'id': pid}