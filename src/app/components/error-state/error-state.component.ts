import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error-state',
  templateUrl: './error-state.component.html',
  styleUrls: ['./error-state.component.scss']
})
export class ErrorStateComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() errorCode: string = '';
  @Input() errorMessage: string = 'An error occurred';
  @Input() errorDetails?: string;
  @Input() timestamp: Date = new Date();
  @Input() showRetry: boolean = true;
  @Input() showContact: boolean = true;

  @Output() retry = new EventEmitter<void>();
  @Output() contactSupport = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }

  onContactSupport() {
    this.contactSupport.emit();
  }

  copyErrorDetails() {
    const details = `
Error Code: ${this.errorCode}
Message: ${this.errorMessage}
Details: ${this.errorDetails || 'N/A'}
Timestamp: ${this.timestamp.toISOString()}
    `.trim();

    navigator.clipboard.writeText(details);
  }
}
