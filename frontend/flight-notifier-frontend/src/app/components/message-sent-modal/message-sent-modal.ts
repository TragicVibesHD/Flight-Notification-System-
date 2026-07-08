import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-message-sent-modal',
  imports: [],
  templateUrl: './message-sent-modal.html',
  styleUrl: './message-sent-modal.css'
})
export class MessageSentModal {
  recipientCount = input(0);
  closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
