import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api, Customer } from '../../services/api';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-portal',
  imports: [FormsModule],
  templateUrl: './portal.html',
  styleUrl: './portal.css'
})
export class Portal implements OnInit {
  private api = inject(Api);
  private auth = inject(Auth);
  private router = inject(Router);

  customers: Customer[] = [];
  selectedCustomerIds: number[] = [];
  sendToAll = false;

  formData = {
    flight_number: '',
    flight_class: '',
    aircraft_type: '',
    tier: '',
    boarding_group: '',
    boarding_time: '',
    departure_time: '',
    gate: '',
    seat_number: '',
    message: ''
  };

  sending = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.api.getCustomers().subscribe({
      next: (customers) => (this.customers = customers),
      error: () => (this.errorMessage = 'Could not load customer list.')
    });
  }

  toggleCustomer(id: number, checked: boolean): void {
    if (checked) {
      this.selectedCustomerIds.push(id);
    } else {
      this.selectedCustomerIds = this.selectedCustomerIds.filter(cid => cid !== id);
    }
  }

  onSend(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.sendToAll && this.selectedCustomerIds.length === 0) {
      this.errorMessage = 'Select at least one recipient, or choose "Send to all".';
      return;
    }

    this.sending = true;

    this.api.sendNotification({
      ...this.formData,
      customer_ids: this.sendToAll ? undefined : this.selectedCustomerIds,
      send_to_all: this.sendToAll
    }).subscribe({
      next: () => {
        this.sending = false;
        this.successMessage = 'Notification sent!';
        this.selectedCustomerIds = [];
        this.sendToAll = false;
      },
      error: () => {
        this.sending = false;
        this.errorMessage = 'Failed to send notification.';
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