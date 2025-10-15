import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() type?: string;
  @Input() icon: string = 'inbox';
  @Input() title: string = 'No data found';
  @Input() message: string = '';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string = 'add';

  @Output() action = new EventEmitter<void>();

  onAction() {
    this.action.emit();
  }
}
