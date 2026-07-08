import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, NotificationRecord } from '../../services/api';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-sent-log',
  imports: [CommonModule, TopBar],
  templateUrl: './sent-log.html',
  styleUrl: './sent-log.css'
})
export class SentLog implements OnInit {
  private api = inject(Api);

  notifications = signal<NotificationRecord[]>([]);
  errorMessage = signal('');

  ngOnInit(): void {
    this.api.getNotifications().subscribe({
      next: (notifications) => this.notifications.set(notifications),
      error: () => this.errorMessage.set('Could not load sent notifications.')
    });
  }
}