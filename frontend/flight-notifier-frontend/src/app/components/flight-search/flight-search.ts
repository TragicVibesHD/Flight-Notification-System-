import { Component, OnInit, inject, signal } from '@angular/core';
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
}
