import { Component } from '@angular/core';

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

  onCustomerChange(customer: string) {
    this.currentCustomer = customer;
    console.log('Customer switched to:', customer);
  }

  onSearch() {
    console.log('Global search triggered');
  }
}
