from flask import current_app, g
from psycopg2 import connect
from datetime import datetime
import hashlib

def get_db():
    if 'db' not in g:
        DATABASE_URL = current_app.config['DATABASE_URL']
        g.db = connect(DATABASE_URL, sslmode='require')
#         g.db = connect(DATABASE_URL)
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
    cur.execute("SELECT id, qn, opts, expire FROM polls WHERE oid=(SELECT id FROM users WHERE username=%s)", (username,))
    polls = cur.fetchall()
    cur.close()
    active = []
    expired = []
    for id, qn, opts, expire in polls:
        tz = expire.tzinfo
        if expire < datetime.now(tz):
            expired.append((id, qn, opts, expire))
        else:
            active.append((id, qn, opts, expire))
    print(active)
    print(expired)
    return {'active': active, 'expired': expired}

def get_qns(id):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id, qn, opts, expire FROM polls WHERE id=%s", (id,))
    poll = cur.fetchone()
    if not poll:
        return {'error': 'poll not found'}
    # cur.execute("SELECT qn, options FROM qns WHERE oid=(SELECT id FROM users WHERE username=%s) AND pid=%s", (username, id))
    # qns = cur.fetchall()
    cur.close()
    return {'id': poll[0], 'qn': poll[1], 'opts': poll[2], 'expire': poll[3]}#, 'questions': [(qn, options) for qn, options in qns]}

def create_poll(username, qn, opts, expire):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT id FROM users WHERE username=%s", (username,))
    oid = cur.fetchone()
    print(oid, qn, opts, expire)
    cur.execute("INSERT INTO polls (oid, qn, opts, expire) VALUES (%s, %s, %s, %s)", (oid[0], qn, opts, expire))
    cur.execute("SELECT id FROM polls WHERE oid=%s AND qn=%s AND opts=%s AND expire=%s", (oid[0], qn, opts, expire))
    pid = cur.fetchone()[0]
    db.commit()
    cur.close()
    return {'id': pid}

def vote(id, opt):
    db = get_db()
    cur = db.cursor()
    cur.execute("INSERT INTO votes (qnid, opt) values (%s, %s)", (id, opt))
    db.commit()
    cur.close()

def view(username, id):
    db = get_db()
    cur = db.cursor()
    cur.execute("SELECT qn, opts FROM polls WHERE id=%s AND oid=(SELECT id FROM users WHERE username=%s)", (id, username))
    qn, opts = cur.fetchone()
    cur.execute("SELECT COUNT(*) FROM votes WHERE qnid=%s AND opt=1", (id,))
    one = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM votes WHERE qnid=%s AND opt=2", (id,))
    two = cur.fetchone()[0]
    return {'qn': qn, 'opts': opts, 'one': one, 'two': two}
