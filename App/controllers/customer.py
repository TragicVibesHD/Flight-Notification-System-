from App.models import Customer
from App.database import db

def create_customer(first_name, last_name, date_of_birth, nationality, email,
                     phone_number, passport_number, flight_id=None):
    customer = Customer(
        first_name=first_name,
        last_name=last_name,
        date_of_birth=date_of_birth,
        nationality=nationality,
        email=email,
        phone_number=phone_number,
        passport_number=passport_number,
        flight_id=flight_id
    )
    db.session.add(customer)
    db.session.commit()
    return customer

def get_customer(id):
    return db.session.get(Customer, id)

def get_all_customers():
    return db.session.scalars(db.select(Customer)).all()

def get_all_customers_json():
    customers = get_all_customers()
    return [c.get_json() for c in customers]