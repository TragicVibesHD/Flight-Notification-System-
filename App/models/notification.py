from datetime import datetime
from App.database import db

notification_recipients = db.Table(
    'notification_recipients',
    db.Column('notification_id', db.Integer, db.ForeignKey('notification.id'), primary_key=True),
    db.Column('customer_id', db.Integer, db.ForeignKey('customer.id'), primary_key=True)
)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flight_id = db.Column(db.Integer, db.ForeignKey('flight.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sent_to_all = db.Column(db.Boolean, default=False, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    flight = db.relationship('Flight', lazy='subquery')
    recipients = db.relationship('Customer', secondary=notification_recipients, lazy='subquery')

    def __init__(self, flight_id, message, sent_to_all=False):
        self.flight_id = flight_id
        self.message = message
        self.sent_to_all = sent_to_all

    def get_json(self):
        return {
            'id': self.id,
            'flight': self.flight.get_json() if self.flight else None,
            'message': self.message,
            'sent_to_all': self.sent_to_all,
            'timestamp': self.timestamp.isoformat(),
            'recipients': [c.get_json() for c in self.recipients]
        }