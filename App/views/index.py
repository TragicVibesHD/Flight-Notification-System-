from flask import Blueprint, jsonify
from App.controllers import initialize

index_views = Blueprint('index_views', __name__)

@index_views.route('/init', methods=['GET'])
def init():
    initialize()
    return jsonify(message='db initialized!')

@index_views.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})