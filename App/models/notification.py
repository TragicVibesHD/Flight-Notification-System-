from datetime import datetime

from App.database import db

notification_recipients = db.Table(
    'notification_recipients',
    db.Column('notification_id', db.Integer, db.ForeignKey('notification.id'), primary_key=True),
    db.Column('customer_id', db.Integer, db.ForeignKey('customer.id'), primary_key=True)
)

class Notification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flight_number = db.Column(db.String(20), nullable=False)
    flight_class = db.Column(db.String(50), nullable=True)
    aircraft_type = db.Column(db.String(80), nullable=True)
    tier = db.Column(db.String(50), nullable=True)
    boarding_group = db.Column(db.String(50), nullable=True)
    boarding_time = db.Column(db.String(20), nullable=True)
    departure_time = db.Column(db.String(20), nullable=True)
    gate = db.Column(db.String(20), nullable=True)
    seat_number = db.Column(db.String(10), nullable=True)
    message = db.Column(db.Text, nullable=False)
    sent_to_all = db.Column(db.Boolean, default=False, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    recipients = db.relationship('Customer', secondary=notification_recipients, lazy='subquery')

    def __init__(self, flight_number, message, flight_class=None, aircraft_type=None,
                 tier=None, boarding_group=None, boarding_time=None, departure_time=None,
                 gate=None, seat_number=None, sent_to_all=False):

        self.flight_number = flight_number
        self.message = message
        self.flight_class = flight_class
        self.aircraft_type = aircraft_type
        self.tier = tier
        self.boarding_group = boarding_group
        self.boarding_time = boarding_time
        self.departure_time = departure_time
        self.gate = gate
        self.seat_number = seat_number
        self.sent_to_all = sent_to_all

    def get_json(self):
        return {

            'id': self.id,
            'flight_number': self.flight_number,
            'flight_class': self.flight_class,
            'aircraft_type': self.aircraft_type,
            'tier': self.tier,
            'boarding_group': self.boarding_group,
            'boarding_time': self.boarding_time,
            'departure_time': self.departure_time,
            'gate': self.gate,
            'seat_number': self.seat_number,
            'message': self.message,
            'sent_to_all': self.sent_to_all,
            'timestamp': self.timestamp.isoformat(),
            'recipients': [c.get_json() for c in self.recipients]
        }
 