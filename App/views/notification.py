from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from App.controllers import send_notification, get_all_notifications_json

notification_views = Blueprint('notification_views', __name__)

@notification_views.route('/api/notifications', methods=['POST'])
@jwt_required()
def send_notification_action():
    data = request.json

    notification = send_notification(
        flight_number=data.get('flight_number'),
        message=data.get('message'),
        flight_class=data.get('flight_class'),
        aircraft_type=data.get('aircraft_type'),
        tier=data.get('tier'),
        boarding_group=data.get('boarding_group'),
        boarding_time=data.get('boarding_time'),
        departure_time=data.get('departure_time'),
        gate=data.get('gate'),
        seat_number=data.get('seat_number'),
        customer_ids=data.get('customer_ids'),
        send_to_all=data.get('send_to_all', False)
    )

    return jsonify({'message': 'Notification sent!', 'notification': notification.get_json()})

@notification_views.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications_action():
    notifications = get_all_notifications_json()
    return jsonify(notifications)