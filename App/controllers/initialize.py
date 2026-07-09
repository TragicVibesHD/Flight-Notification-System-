import csv
import os
from datetime import datetime

from .user import create_user
from .customer import create_customer
from .flight import create_flight
from App.models import Flight
from App.database import db

CUSTOMERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'customers.txt')
FLIGHTS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'flights.txt')


def initialize():
    db.drop_all()
    db.create_all()
    create_user('bob', 'bobpass')
    seed_flights_from_file()
    seed_customers_from_file()


def seed_flights_from_file():
    if not os.path.exists(FLIGHTS_FILE):
        print(f"Warning: flight seed file not found at {FLIGHTS_FILE}")
        return

    with open(FLIGHTS_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                flight_date = datetime.strptime(row['flight_date'].strip(), '%Y-%m-%d').date()

                create_flight(
                    flight_number=row['flight_number'].strip(),
                    flight_date=flight_date,
                    origin=row['origin'].strip(),
                    destination=row['destination'].strip(),
                    flight_class=row['flight_class'].strip(),
                    aircraft_type=row['aircraft_type'].strip(),
                    tier=row['tier'].strip(),
                    boarding_group=row['boarding_group'].strip(),
                    boarding_time=row['boarding_time'].strip(),
                    departure_time=row['departure_time'].strip(),
                    gate=row['gate'].strip(),
                    seat_number=row['seat_number'].strip()
                )
            except (KeyError, ValueError) as e:
                print(f"Skipping invalid flight row {row}: {e}")


def seed_customers_from_file():
    if not os.path.exists(CUSTOMERS_FILE):
        print(f"Warning: customer seed file not found at {CUSTOMERS_FILE}")
        return

    with open(CUSTOMERS_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                dob = datetime.strptime(row['date_of_birth'].strip(), '%Y-%m-%d').date()

                flight_id = None
                flight_number = row.get('flight_number', '').strip()
                if flight_number:
                    flight = db.session.scalar(
                        db.select(Flight).filter_by(flight_number=flight_number)
                    )
                    flight_id = flight.id if flight else None

                create_customer(
                    first_name=row['first_name'].strip(),
                    last_name=row['last_name'].strip(),
                    date_of_birth=dob,
                    nationality=row['nationality'].strip(),
                    email=row['email'].strip(),
                    phone_number=row['phone_number'].strip(),
                    passport_number=row['passport_number'].strip(),
                    flight_id=flight_id
                )
            except (KeyError, ValueError) as e:
                print(f"Skipping invalid customer row {row}: {e}")