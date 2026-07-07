from App.database import db

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    nationality = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    passport_number = db.Column(db.String(20), nullable=False)
    flight_id = db.Column(db.Integer, db.ForeignKey('flight.id'), nullable=True)

    flight = db.relationship('Flight', lazy='subquery')

    def __init__(self, first_name, last_name, date_of_birth, nationality, email,
                 phone_number, passport_number, flight_id=None):
        self.first_name = first_name
        self.last_name = last_name
        self.date_of_birth = date_of_birth
        self.nationality = nationality
        self.email = email
        self.phone_number = phone_number
        self.passport_number = passport_number
        self.flight_id = flight_id

    def get_json(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'nationality': self.nationality,
            'email': self.email,
            'phone_number': self.phone_number,
            'passport_number': self.passport_number,
            'flight_id': self.flight_id,
            'flight_number': self.flight.flight_number if self.flight else None
        }