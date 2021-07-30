from flask import request, make_response, jsonify
from flask import current_app as app
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from . import db

@app.route('/api/register/', methods=['POST'])
def register():
    user = db.add_user(request.json.get('username'), request.json.get('password'))
    print(request.json.get('username'), request.json.get('password'))
    if user:
        access_token = create_access_token(identity=user.username)
        return make_response(jsonify(access_token=access_token), 200)
    else:
        return make_response(jsonify(message='User already exists'), 409)

@app.route('/api/login/', methods=['POST'])
def login():
    user = db.auth(request.json.get('username'), request.json.get('password'))
    if user:
        access_token = create_access_token(identity=user.username)
        return make_response(jsonify(access_token=access_token), 200)
    else:
        return make_response(jsonify(message='Invalid credentials'), 401)

@app.route('/api/create')
@jwt_required()
def create_poll(poll_id):
    poll = db.create_poll(get_jwt_identity(), request.json.get('title'), request.json.get('expire'), request.json.get('qns'))
    poll = db.get_qns(get_jwt_identity(), poll_id)
    return make_response(jsonify(poll), 200)

@app.route('/api/polls/')
@jwt_required()
def get_polls():
    polls = db.get_polls(get_jwt_identity())
    return make_response(jsonify(polls), 200)

@app.route('/api/poll/<int:poll_id>/')
@jwt_required()
def get_poll(poll_id):
    poll = db.get_qns(get_jwt_identity(), poll_id)
    return make_response(jsonify(poll), 200)
