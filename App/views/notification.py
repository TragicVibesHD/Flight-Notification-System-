from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from App.controllers import send_notification, get_all_notifications_json

notification_views = Blueprint('notification_views', __name__)

@notification_views.route('/api/notifications', methods=['POST'])
@jwt_required()
def send_notification_action():
    data = request.json

    notification = send_notification(
        flight_id=data.get('flight_id'),
        message=data.get('message'),
        customer_ids=data.get('customer_ids'),
        send_to_all=data.get('send_to_all', False)
    )

    return jsonify({'message': 'Notification sent!', 'notification': notification.get_json()})

@notification_views.route('/api/notifications', methods=['GET'])
@jwt_required()
def get_notifications_action():
    notifications = get_all_notifications_json()
    return jsonify(notifications)