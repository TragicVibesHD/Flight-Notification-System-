import csv
import os
from datetime import datetime

from .user import create_user
from .customer import create_customer
from App.database import db

CUSTOMERS_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'customers.txt')


def initialize():
    db.drop_all()
    db.create_all()
    create_user('bob', 'bobpass')
    seed_customers_from_file()


def seed_customers_from_file():
    if not os.path.exists(CUSTOMERS_FILE):
        print(f"Warning: customer seed file not found at {CUSTOMERS_FILE}")
        return

    with open(CUSTOMERS_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                dob = datetime.strptime(row['date_of_birth'].strip(), '%Y-%m-%d').date()
                create_customer(
                    first_name=row['first_name'].strip(),
                    last_name=row['last_name'].strip(),
                    date_of_birth=dob,
                    nationality=row['nationality'].strip(),
                    email=row['email'].strip(),
                    phone_number=row['phone_number'].strip(),
                    passport_number=row['passport_number'].strip()
                )
            except (KeyError, ValueError) as e:
                print(f"Skipping invalid customer row {row}: {e}")