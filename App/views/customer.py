from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from App.controllers import get_all_customers_json

customer_views = Blueprint('customer_views', __name__)

@customer_views.route('/api/customers', methods=['GET'])
@jwt_required()
def get_customers_action():
    customers = get_all_customers_json()
    return jsonify(customers)