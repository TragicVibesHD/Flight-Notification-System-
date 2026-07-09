from App.models import Flight
from App.database import db

def create_flight(flight_number, flight_date=None, origin=None, destination=None, flight_class=None, aircraft_type=None, tier=None,
                   boarding_group=None, boarding_time=None, departure_time=None,
                   gate=None, seat_number=None):
    flight = Flight(
        flight_number=flight_number,
        flight_date=flight_date,
        origin=origin,
        destination=destination,
        flight_class=flight_class,
        aircraft_type=aircraft_type,
        tier=tier,
        boarding_group=boarding_group,
        boarding_time=boarding_time,
        departure_time=departure_time,
        gate=gate,
        seat_number=seat_number
    )
    db.session.add(flight)
    db.session.commit()
    return flight

def get_flight(id):
    return db.session.get(Flight, id)

def get_all_flights():
    return db.session.scalars(db.select(Flight)).all()

def get_all_flights_json():
    flights = get_all_flights()
    return [f.get_json() for f in flights]