import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Api, Customer, Flight } from '../../services/api';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, TopBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private api = inject(Api);

  customers = signal<Customer[]>([]);
  flights = signal<Flight[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  flightsById = computed(() => {
    const map = new Map<number, Flight>();
    for (const flight of this.flights()) {
      map.set(flight.id, flight);
    }
    return map;
  });

  assignedCustomers = computed(() => this.customers().filter(customer => customer.flight_id !== null).length);
  unassignedCustomers = computed(() => this.customers().length - this.assignedCustomers());

  ngOnInit(): void {
    forkJoin({
      customers: this.api.getCustomers(),
      flights: this.api.getFlights()
    }).subscribe({
      next: ({ customers, flights }) => {
        this.customers.set(customers);
        this.flights.set(flights);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load dashboard data.');
        this.loading.set(false);
      }
    });
  }

  flightFor(customer: Customer): Flight | null {
    if (customer.flight_id === null) {
      return null;
    }
    return this.flightsById().get(customer.flight_id) ?? null;
  }
}
