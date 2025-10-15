#!/bin/bash

# Fix Circuits
sed -i '' 's/callback: (c) => this\.editCircuit(c)/callback: (c: Circuit) => this.editCircuit(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuits-unified/circuits-unified.component.ts"
sed -i '' 's/callback: (c) => this\.viewDetails(c)/callback: (c: Circuit) => this.viewDetails(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuits-unified/circuits-unified.component.ts"
sed -i '' 's/callback: (c) => this\.export(c)/callback: (c: Circuit[]) => this.export(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuits-unified/circuits-unified.component.ts"
sed -i '' 's/callback: (c) => this\.delete(c)/callback: (c: Circuit[]) => this.delete(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuits-unified/circuits-unified.component.ts"

# Fix Sites
sed -i '' 's/callback: (s) => this\.editSite(s)/callback: (s: Site) => this.editSite(s)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/sites-unified/sites-unified.component.ts"
sed -i '' 's/callback: (s) => this\.viewSite(s)/callback: (s: Site) => this.viewSite(s)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/sites-unified/sites-unified.component.ts"
sed -i '' 's/callback: (s) => this\.export(s)/callback: (s: Site[]) => this.export(s)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/sites-unified/sites-unified.component.ts"
sed -i '' 's/callback: (s) => this\.healthCheck(s)/callback: (s: Site[]) => this.healthCheck(s)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/sites-unified/sites-unified.component.ts"

# Fix Clouds
sed -i '' 's/callback: (c) => this\.viewCloud(c)/callback: (c: Cloud) => this.viewCloud(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/clouds-unified/clouds-unified.component.ts"
sed -i '' 's/callback: (c) => this\.configureCloud(c)/callback: (c: Cloud) => this.configureCloud(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/clouds-unified/clouds-unified.component.ts"

# Fix Circuit Reports
sed -i '' 's/callback: (r) => this\.runReport(r)/callback: (r: CircuitReport) => this.runReport(r)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuit-reports-unified/circuit-reports-unified.component.ts"
sed -i '' 's/callback: (r) => this\.editReport(r)/callback: (r: CircuitReport) => this.editReport(r)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuit-reports-unified/circuit-reports-unified.component.ts"
sed -i '' 's/callback: (r) => this\.downloadReport(r)/callback: (r: CircuitReport) => this.downloadReport(r)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuit-reports-unified/circuit-reports-unified.component.ts"
sed -i '' 's/callback: (r) => this\.deleteReports(r)/callback: (r: CircuitReport[]) => this.deleteReports(r)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/circuit-reports-unified/circuit-reports-unified.component.ts"

# Fix Invoices
sed -i '' 's/callback: (inv) => this\.downloadPDF(inv)/callback: (inv: Invoice) => this.downloadPDF(inv)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/network-invoices-unified/network-invoices-unified.component.ts"
sed -i '' 's/callback: (inv) => this\.downloadCSV(inv)/callback: (inv: Invoice) => this.downloadCSV(inv)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/network-invoices-unified/network-invoices-unified.component.ts"
sed -i '' 's/callback: (inv) => this\.emailInvoice(inv)/callback: (inv: Invoice) => this.emailInvoice(inv)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/network-invoices-unified/network-invoices-unified.component.ts"

# Fix Contacts
sed -i '' 's/callback: (c) => this\.deleteContacts(c)/callback: (c: Contact[]) => this.deleteContacts(c)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/contacts-unified/contacts-unified.component.ts"

# Fix Tickets
sed -i '' 's/callback: (t) => this\.viewTicket(t)/callback: (t: Ticket) => this.viewTicket(t)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/tickets-unified/tickets-unified.component.ts"
sed -i '' 's/callback: (t) => this\.editTicket(t)/callback: (t: Ticket) => this.editTicket(t)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/tickets-unified/tickets-unified.component.ts"

# Fix Application Performance
sed -i '' 's/callback: (a) => this\.viewMetrics(a)/callback: (a: Application) => this.viewMetrics(a)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/application-performance-unified/application-performance-unified.component.ts"
sed -i '' 's/callback: (a) => this\.configureApp(a)/callback: (a: Application) => this.configureApp(a)/g' "/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages/application-performance-unified/application-performance-unified.component.ts"

echo "Type fixes applied!"
