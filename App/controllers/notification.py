from App.models import Notification, Customer
from App.database import db

def send_notification(flight_id, message, customer_ids=None, send_to_all=False):
    notification = Notification(
        flight_id=flight_id,
        message=message,
        sent_to_all=send_to_all
    )

    if send_to_all:
        notification.recipients = db.session.scalars(db.select(Customer)).all()
    elif customer_ids:
        notification.recipients = db.session.scalars(
            db.select(Customer).filter(Customer.id.in_(customer_ids))
        ).all()

    db.session.add(notification)
    db.session.commit()
    return notification

def get_notification(id):
    return db.session.get(Notification, id)

def get_all_notifications():
    return db.session.scalars(
        db.select(Notification).order_by(Notification.timestamp.desc())
    ).all()

def get_all_notifications_json():
    notifications = get_all_notifications()
    return [n.get_json() for n in notifications]