import { Service, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  nationality: string;
  email: string;
  phone_number: string;
  passport_number: string;
  flight_id: number | null;
  flight_number: string | null;
}

export interface Flight {
  id: number;
  flight_number: string;
  flight_class: string | null;
  aircraft_type: string | null;
  tier: string | null;
  boarding_group: string | null;
  boarding_time: string | null;
  departure_time: string | null;
  gate: string | null;
  seat_number: string | null;
}

export interface NotificationRecord {
  id: number;
  flight: Flight | null;
  message: string;
  sent_to_all: boolean;
  timestamp: string;
  recipients: Customer[];
}

export interface SendNotificationPayload {
  flight_id: number;
  message: string;
  customer_ids?: number[];
  send_to_all?: boolean;
}

@Service()
export class Api {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private apiUrl = 'http://127.0.0.1:8080/api';

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.auth.getToken()}`
    });
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`, {
      headers: this.authHeaders()
    });
  }

  getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.apiUrl}/flights`, {
      headers: this.authHeaders()
    });
  }

  getNotifications(): Observable<NotificationRecord[]> {
    return this.http.get<NotificationRecord[]>(`${this.apiUrl}/notifications`, {
      headers: this.authHeaders()
    });
  }

  sendNotification(payload: SendNotificationPayload): Observable<{ message: string; notification: NotificationRecord }> {
    return this.http.post<{ message: string; notification: NotificationRecord }>(
      `${this.apiUrl}/notifications`,
      payload,
      { headers: this.authHeaders() }
    );
  }
}