from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, current_user, unset_jwt_cookies, set_access_cookies

from App.controllers import login

auth_views = Blueprint('auth_views', __name__)

@auth_views.route('/api/login', methods=['POST'])
def user_login_api():
    data = request.json
    token = login(data['username'], data['password'])
    if not token:
        return jsonify(message='bad username or password given'), 401
    response = jsonify(access_token=token)
    set_access_cookies(response, token)
    return response

@auth_views.route('/api/identify', methods=['GET'])
@jwt_required()
def identify_user():
    return jsonify({'message': f"username: {current_user.username}, id: {current_user.id}"})

@auth_views.route('/api/logout', methods=['GET'])
def logout_api():
    response = jsonify(message="Logged Out!")
    unset_jwt_cookies(response)
    return response