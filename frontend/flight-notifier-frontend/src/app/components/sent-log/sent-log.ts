import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api, NotificationRecord } from '../../services/api';

@Component({
  selector: 'app-sent-log',
  imports: [CommonModule],
  templateUrl: './sent-log.html',
  styleUrl: './sent-log.css'
})
export class SentLog implements OnInit {
  private api = inject(Api);
  private router = inject(Router);

  notifications = signal<NotificationRecord[]>([]);
  errorMessage = signal('');

  ngOnInit(): void {
    this.api.getNotifications().subscribe({
      next: (notifications) => this.notifications.set(notifications),
      error: () => this.errorMessage.set('Could not load sent notifications.')
    });
  }

  goToPortal(): void {
    this.router.navigate(['/portal']);
  }
}