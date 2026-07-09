import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compose-message-modal',
  imports: [FormsModule],
  templateUrl: './compose-message-modal.html',
  styleUrl: './compose-message-modal.css'
})
export class ComposeMessageModal {
  recipientCount = input(0);
  subtitle = input('');

  closed = output<void>();
  sent = output<string>();

  message = signal('');

  onCancel(): void {
    this.closed.emit();
  }

  onSend(): void {
    if (!this.message().trim()) {
      return;
    }
    this.sent.emit(this.message());
  }
}
