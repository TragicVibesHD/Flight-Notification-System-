import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, Flight } from '../../services/api';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-flight-search',
  imports: [FormsModule, TopBar],
  templateUrl: './flight-search.html',
  styleUrl: './flight-search.css'
})
export class FlightSearch implements OnInit {
  private api = inject(Api);
  private router = inject(Router);

  flights = signal<Flight[]>([]);
  selectedValue = '';
  errorMessage = signal('');

  selectedDate = signal('');
  selectedDateFlightIds = signal<Set<number>>(new Set());

  flightsOnDate = computed(() => {
    const date = this.selectedDate();
    if (!date) {
      return [];
    }
    return this.flights().filter(f => f.flight_date === date);
  });

  allDateFlightsSelected = computed(() => {
    const list = this.flightsOnDate();
    return list.length > 0 && list.every(f => this.selectedDateFlightIds().has(f.id));
  });

  ngOnInit(): void {
    this.api.getFlights().subscribe({
      next: (flights) => this.flights.set(flights),
      error: () => this.errorMessage.set('Could not load flight list.')
    });
  }

  onSelectFlight(): void {
    if (!this.selectedValue) {
      return;
    }
    this.router.navigate(['/passengers', this.selectedValue]);
  }

  onDateChange(date: string): void {
    this.selectedDate.set(date);
    this.selectedDateFlightIds.set(new Set());
  }

  isDateFlightSelected(id: number): boolean {
    return this.selectedDateFlightIds().has(id);
  }

  toggleDateFlight(id: number, checked: boolean): void {
    const next = new Set(this.selectedDateFlightIds());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selectedDateFlightIds.set(next);
  }

  toggleSelectAllForDay(checked: boolean): void {
    if (checked) {
      this.selectedDateFlightIds.set(new Set(this.flightsOnDate().map(f => f.id)));
    } else {
      this.selectedDateFlightIds.set(new Set());
    }
  }

  viewPassengersForDate(): void {
    const ids = Array.from(this.selectedDateFlightIds());
    if (ids.length === 0) {
      return;
    }
    this.router.navigate(['/passengers', ids.join(',')]);
  }
}
