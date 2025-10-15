#!/bin/bash

# Base path
BASE_PATH="/Users/rwinze026/Projects/ISC Analysis/prototype/src/app/components/pages"

# Create Sites page HTML
cat > "$BASE_PATH/sites-unified/sites-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="sites"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Clouds page HTML
cat > "$BASE_PATH/clouds-unified/clouds-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="clouds"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Circuit Reports page HTML
cat > "$BASE_PATH/circuit-reports-unified/circuit-reports-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="reports"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Network Invoices page HTML
cat > "$BASE_PATH/network-invoices-unified/network-invoices-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="invoices"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Contacts page HTML
cat > "$BASE_PATH/contacts-unified/contacts-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="contacts"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Tickets page HTML
cat > "$BASE_PATH/tickets-unified/tickets-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="tickets"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

# Create Application Performance page HTML
cat > "$BASE_PATH/application-performance-unified/application-performance-unified.component.html" << 'EOF'
<div class="page-container">
  <app-base-table
    [config]="tableConfig"
    [data]="applications"
    [loading]="loading"
  ></app-base-table>
</div>
EOF

echo "All HTML files created successfully!"
