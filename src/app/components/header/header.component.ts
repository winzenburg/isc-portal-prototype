import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlossaryModalComponent } from '../help/glossary-modal/glossary-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentCustomer = 'Acme Corporation';

  customers = [
    'Acme Corporation',
    'Global Tech Inc',
    'Enterprise Solutions LLC',
    'TechStart Partners'
  ];

  constructor(private dialog: MatDialog) {}

  onCustomerChange(customer: string) {
    this.currentCustomer = customer;
    console.log('Customer switched to:', customer);
  }

  onSearch() {
    console.log('Global search triggered');
  }

  openGlossary() {
    this.dialog.open(GlossaryModalComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'glossary-dialog',
      autoFocus: true,
      restoreFocus: true
    });
  }
}
