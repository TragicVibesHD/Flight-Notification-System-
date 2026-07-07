import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, Customer, Flight } from '../../services/api';
import { Auth } from '../../services/auth';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-portal',
  imports: [FormsModule, TopBar],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal implements OnInit {
  private api = inject(Api);
  private auth = inject(Auth);
  private router = inject(Router);

  customers = signal<Customer[]>([]);
  flights = signal<Flight[]>([]);
  selectedCustomerIds: number[] = [];
  selectedFlightId: number | null = null;
  sendToAll = false;
  message = '';

  filterFlightId = signal<number | null>(null);
  filteredCustomers = computed(() => {
    const fid = this.filterFlightId();
    if (fid === null) {
      return this.customers();
    }
    return this.customers().filter(c => c.flight_id === fid);
  });

  sending = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  ngOnInit(): void {
    this.api.getCustomers().subscribe({
      next: (customers) => this.customers.set(customers),
      error: () => this.errorMessage.set('Could not load customer list.')
    });

    this.api.getFlights().subscribe({
      next: (flights) => this.flights.set(flights),
      error: () => this.errorMessage.set('Could not load flight list.')
    });
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterFlightId.set(value === '' ? null : Number(value));
  }

  toggleCustomer(id: number, checked: boolean): void {
    if (checked) {
      this.selectedCustomerIds.push(id);
    } else {
      this.selectedCustomerIds = this.selectedCustomerIds.filter(cid => cid !== id);
    }
  }

  onSend(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.selectedFlightId) {
      this.errorMessage.set('Select a flight.');
      return;
    }

    if (!this.sendToAll && this.selectedCustomerIds.length === 0) {
      this.errorMessage.set('Select at least one recipient, or choose "Send to all".');
      return;
    }

    this.sending.set(true);

    this.api.sendNotification({
      flight_id: this.selectedFlightId,
      message: this.message,
      customer_ids: this.sendToAll ? undefined : this.selectedCustomerIds,
      send_to_all: this.sendToAll
    }).subscribe({
      next: () => {
        this.sending.set(false);
        this.successMessage.set('Notification sent!');
        this.selectedCustomerIds = [];
        this.sendToAll = false;
        this.message = '';
      },
      error: () => {
        this.sending.set(false);
        this.errorMessage.set('Failed to send notification.');
      }
    });
  }

  goToSentLog(): void {
    this.router.navigate(['/sent-log']);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}