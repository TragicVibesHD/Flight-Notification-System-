from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from App.controllers import get_all_flights_json

flight_views = Blueprint('flight_views', __name__)

@flight_views.route('/api/flights', methods=['GET'])
@jwt_required()
def get_flights_action():
    flights = get_all_flights_json()
    return jsonify(flights)