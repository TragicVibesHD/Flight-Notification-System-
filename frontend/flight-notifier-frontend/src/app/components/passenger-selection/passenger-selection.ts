import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Api, Customer, Flight } from '../../services/api';
import { TopBar } from '../top-bar/top-bar';
import { ComposeMessageModal } from '../compose-message-modal/compose-message-modal';
import { MessageSentModal } from '../message-sent-modal/message-sent-modal';

@Component({
  selector: 'app-passenger-selection',
  imports: [TopBar, ComposeMessageModal, MessageSentModal],
  templateUrl: './passenger-selection.html',
  styleUrl: './passenger-selection.css'
})
export class PassengerSelection implements OnInit {
  private api = inject(Api);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isAllScope = signal(false);
  flightIds = signal<number[]>([]);

  allCustomers = signal<Customer[]>([]);
  allFlights = signal<Flight[]>([]);
  flightsById = computed(() => {
    const map = new Map<number, Flight>();
    for (const f of this.allFlights()) {
      map.set(f.id, f);
    }
    return map;
  });
  selectedFlights = computed(() => {
    const ids = new Set(this.flightIds());
    return this.allFlights().filter(f => ids.has(f.id));
  });

  selectedIds = signal<Set<number>>(new Set());
  globalSendToAll = signal(false);

  showComposeModal = signal(false);
  showSuccessModal = signal(false);
  lastSentCount = signal(0);
  sending = signal(false);

  errorMessage = signal('');
  loading = signal(true);

  showFlightColumns = computed(() => this.isAllScope() || this.flightIds().length > 1);

  displayedCustomers = computed(() => {
    if (this.isAllScope()) {
      return this.allCustomers();
    }
    const ids = new Set(this.flightIds());
    return this.allCustomers().filter(c => c.flight_id !== null && ids.has(c.flight_id));
  });

  allSelected = computed(() => {
    const list = this.displayedCustomers();
    return list.length > 0 && list.every(c => this.selectedIds().has(c.id));
  });

  selectedCount = computed(() => this.selectedIds().size);

  scopeLabel = computed(() => {
    if (this.isAllScope()) {
      return 'All Customers';
    }
    const flights = this.selectedFlights();
    if (flights.length === 1) {
      return flights[0].flight_number;
    }
    if (flights.length > 1) {
      return `${flights.length} Flights (${flights.map(f => f.flight_number).join(', ')})`;
    }
    return '';
  });

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('scope');
    if (param === 'all') {
      this.isAllScope.set(true);
    } else {
      this.flightIds.set((param ?? '').split(',').map(Number).filter(n => !isNaN(n) && n > 0));
    }

    this.api.getCustomers().subscribe({
      next: (customers) => {
        this.allCustomers.set(customers);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load customers.');
        this.loading.set(false);
      }
    });

    this.api.getFlights().subscribe({
      next: (flights) => this.allFlights.set(flights)
    });
  }

  originFor(customer: Customer): string {
    if (customer.flight_id === null) {
      return '—';
    }
    return this.flightsById().get(customer.flight_id)?.origin || '—';
  }

  destinationFor(customer: Customer): string {
    if (customer.flight_id === null) {
      return '—';
    }
    return this.flightsById().get(customer.flight_id)?.destination || '—';
  }

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggleCustomer(id: number, checked: boolean): void {
    const next = new Set(this.selectedIds());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
      this.globalSendToAll.set(false);
    }
    this.selectedIds.set(next);
  }

  toggleSelectAll(checked: boolean): void {
    if (checked) {
      this.selectedIds.set(new Set(this.displayedCustomers().map(c => c.id)));
      this.globalSendToAll.set(this.isAllScope());
    } else {
      this.selectedIds.set(new Set());
      this.globalSendToAll.set(false);
    }
  }

  goBackToSearch(): void {
    this.router.navigate(['/flight-search']);
  }

  openCompose(): void {
    if (this.selectedIds().size === 0) {
      this.errorMessage.set('Select at least one passenger to message.');
      return;
    }
    this.errorMessage.set('');
    this.showComposeModal.set(true);
  }

  closeCompose(): void {
    this.showComposeModal.set(false);
  }

  onSendMessage(message: string): void {
    this.sending.set(true);

    const useGlobalSendToAll = this.isAllScope() && this.globalSendToAll();
    const ids = this.flightIds();
    const singleFlightId = ids.length === 1 ? ids[0] : null;

    this.api.sendNotification({
      flight_id: this.isAllScope() ? null : singleFlightId,
      message,
      customer_ids: useGlobalSendToAll ? undefined : Array.from(this.selectedIds()),
      send_to_all: useGlobalSendToAll
    }).subscribe({
      next: () => {
        this.sending.set(false);
        this.lastSentCount.set(this.selectedIds().size);
        this.showComposeModal.set(false);
        this.showSuccessModal.set(true);
      },
      error: () => {
        this.sending.set(false);
        this.errorMessage.set('Failed to send notification.');
        this.showComposeModal.set(false);
      }
    });
  }

  closeSuccess(): void {
    this.showSuccessModal.set(false);
    this.selectedIds.set(new Set());
    this.globalSendToAll.set(false);
  }
}
