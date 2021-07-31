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

@app.route('/api/vote/<int:id>/<int:opt>/')
def vote(id, opt):
    db.vote(int(id), int(opt))
    return "success"

@app.route('/api/view/<int:id>/')
@jwt_required()
def view(id):
    return jsonify(db.view(get_jwt_identity(), int(id)))

@app.route('/api/create/', methods=['POST'])
@jwt_required()
def create_poll():
    args = request.get_json(force=True)
    poll = db.create_poll(get_jwt_identity(), args.get('qn'), args.get('opts'), args.get('expire'))
    # poll = db.get_qns(get_jwt_identity())
    return make_response(jsonify(poll), 200)

@app.route('/api/polls/')
@jwt_required()
def get_polls():
    polls = db.get_polls(get_jwt_identity())
    return make_response(jsonify(polls), 200)

@app.route('/api/poll/<int:poll_id>/')
def get_poll(poll_id):
    poll = db.get_qns(poll_id)
    return make_response(jsonify(poll), 200)
