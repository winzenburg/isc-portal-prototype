import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from '../../shared/base-table/base-table.config';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

interface Contact {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

@Component({
  selector: 'app-contacts-unified',
  templateUrl: './contacts-unified.component.html',
  styleUrls: ['./contacts-unified.component.scss']
})
export class ContactsUnifiedComponent implements OnInit {
  tableConfig!: TableConfig<Contact>;
  contacts: Contact[] = [];
  loading = false;
  loadingProgress = 0;
  loadingMessage = 'Loading contacts...';

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.initializeTableConfig();
    this.loadContacts();
  }

  private initializeTableConfig() {
    this.tableConfig = {
      title: 'Manage Contacts',
      tableType: 'editable',
      tableId: 'contacts-table',

      columns: [
        { field: 'name', header: 'Name', sortable: true },
        { field: 'email', header: 'Email', sortable: true },
        { field: 'phone', header: 'Phone', sortable: true, width: '140px' },
        { field: 'role', header: 'Role', sortable: true, width: '150px' },
        { field: 'department', header: 'Department', sortable: true, width: '150px' }
      ],

      actions: {
        header: [
          { label: 'Add Contact', icon: 'person_add', color: 'primary', callback: () => this.addContact() }
        ],
        row: [
          { label: 'Site Assignments', icon: 'location_on', callback: (c: Contact | Contact[]) => {
            this.manageSiteAssignments(c as Contact);
          }, tooltip: 'Manage site assignments' },
          { label: 'Notification Preferences', icon: 'notifications', callback: (c: Contact | Contact[]) => {
            this.manageNotificationPreferences(c as Contact);
          }, tooltip: 'Configure notification preferences' },
          { label: 'Manage ISC Access', icon: 'security', callback: (c: Contact | Contact[]) => {
            this.manageISCAccess(c as Contact);
          }, tooltip: 'Manage ISC portal access' },
          { label: 'Two Factor Auth', icon: 'lock', callback: (c: Contact | Contact[]) => {
            this.manageTwoFactorAuth(c as Contact);
          }, tooltip: 'Configure two-factor authentication' },
          { label: 'Delete', icon: 'delete', color: 'warn', callback: (c: Contact | Contact[]) => {
            this.deleteContact(c as Contact);
          }, tooltip: 'Delete contact' }
        ],
        bulk: [
          { label: 'Delete Selected', icon: 'delete', color: 'warn', callback: (c: Contact[] | Contact[][]) => {
            const contacts = Array.isArray(c[0]) ? (c as Contact[][]).flat() : c as Contact[];
            this.deleteContacts(contacts);
          }}
        ]
      },

      editing: {
        enabled: true,
        columns: [
          { field: 'name', inputType: 'text', required: true },
          { field: 'email', inputType: 'text', required: true },
          { field: 'phone', inputType: 'text' },
          { field: 'role', inputType: 'text' },
          { field: 'department', inputType: 'text' }
        ],
        onSave: (contact) => this.saveContact(contact),
        showActions: true
      },

      filtering: {
        searchEnabled: true,
        searchPlaceholder: 'Search contacts...',
        persistFilters: true
      },

      export: {
        enabled: true,
        filename: 'contacts',
        buttonLabel: 'Export CSV',
        showIcon: true,
        icon: 'download'
      },

      pagination: { enabled: true, pageSize: 10, pageSizeOptions: [10, 25, 50], showFirstLastButtons: true },
      selection: { enabled: true, mode: 'multiple', showCheckboxes: true, selectAllEnabled: true },
      sorting: { enabled: true, defaultSort: { field: 'name', direction: 'asc' } },
      hoverHighlight: true
    };
  }

  private loadContacts() {
    this.loading = true;
    this.loadingProgress = 0;
    this.loadingMessage = 'Connecting to server...';

    // Simulate progressive loading with stages
    const stages = [
      { progress: 20, message: 'Authenticating...', delay: 800 },
      { progress: 40, message: 'Fetching contact data...', delay: 1000 },
      { progress: 60, message: 'Loading user profiles...', delay: 1200 },
      { progress: 80, message: 'Processing permissions...', delay: 1000 },
      { progress: 95, message: 'Finalizing...', delay: 500 }
    ];

    let currentStage = 0;

    const updateStage = () => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        this.loadingProgress = stage.progress;
        this.loadingMessage = stage.message;
        currentStage++;
        setTimeout(updateStage, stage.delay);
      } else {
        // Final stage - load data
        this.loadingProgress = 100;
        this.loadingMessage = 'Complete!';
        setTimeout(() => {
          this.contacts = [
            { name: 'Kirk Jones', email: 'kirk.jones@acme.com', phone: '(555) 123-4567', role: 'Admin', department: 'IT' },
            { name: 'Bhargavi Jothi', email: 'bhargavi@acme.com', phone: '(555) 234-5678', role: 'User', department: 'Operations' },
            { name: 'John Smith', email: 'john.smith@acme.com', phone: '(555) 345-6789', role: 'Billing Contact', department: 'Finance' },
            { name: 'Sarah Johnson', email: 'sarah.j@acme.com', phone: '(555) 456-7890', role: 'User', department: 'Sales' },
            { name: 'Mike Davis', email: 'mike.davis@acme.com', phone: '(555) 567-8901', role: 'Admin', department: 'IT' },
            { name: 'Emily Chen', email: 'emily.chen@acme.com', phone: '(555) 678-9012', role: 'User', department: 'Marketing' },
            { name: 'David Miller', email: 'david.m@acme.com', phone: '(555) 789-0123', role: 'Billing Contact', department: 'Finance' },
            { name: 'Lisa Anderson', email: 'lisa.a@acme.com', phone: '(555) 890-1234', role: 'Admin', department: 'IT' }
          ];
          this.loading = false;
        }, 300);
      }
    };

    // Start the loading process
    setTimeout(updateStage, 600);
  }

  addContact() {
    alert('Add Contact functionality');
  }

  manageSiteAssignments(contact: Contact): void {
    console.log('Managing site assignments for:', contact.name);
    alert(`Site Assignments for ${contact.name}\n\nThis feature would allow you to:\n- Assign contact to specific sites\n- View current site assignments\n- Remove site assignments`);
  }

  manageNotificationPreferences(contact: Contact): void {
    console.log('Managing notification preferences for:', contact.name);
    alert(`Notification Preferences for ${contact.name}\n\nThis feature would allow you to configure:\n- Email notifications\n- SMS alerts\n- Notification frequency\n- Alert types (outages, maintenance, billing)`);
  }

  manageISCAccess(contact: Contact): void {
    console.log('Managing ISC access for:', contact.name);
    alert(`Manage ISC Portal Access for ${contact.name}\n\nThis feature would allow you to:\n- Grant/revoke portal access\n- Set permission levels\n- Manage user roles\n- View access history`);
  }

  manageTwoFactorAuth(contact: Contact): void {
    console.log('Managing two-factor authentication for:', contact.name);
    alert(`Two-Factor Authentication for ${contact.name}\n\nThis feature would allow you to:\n- Enable/disable 2FA\n- Configure authentication methods (SMS, authenticator app)\n- Reset 2FA devices\n- View authentication logs`);
  }

  deleteContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Contact',
        message: `Are you sure you want to delete ${contact.name}? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove the contact from the array
        const index = this.contacts.findIndex(c => c.email === contact.email);
        if (index > -1) {
          this.contacts.splice(index, 1);
          // Trigger change detection by creating a new array reference
          this.contacts = [...this.contacts];
          console.log('Contact deleted:', contact);
        }
      }
    });
  }

  deleteContacts(contacts: Contact[]): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Contacts',
        message: `Are you sure you want to delete ${contacts.length} contact${contacts.length > 1 ? 's' : ''}? This action cannot be undone.`,
        confirmText: 'Delete All',
        cancelText: 'Cancel',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Remove all selected contacts
        const emailsToDelete = new Set(contacts.map(c => c.email));
        this.contacts = this.contacts.filter(c => !emailsToDelete.has(c.email));
        console.log('Contacts deleted:', contacts.length);
      }
    });
  }

  saveContact(contact: Contact) {
    console.log('Saving contact:', contact);
    // In a real application, this would call a service to save to backend
    alert('Contact saved successfully');
  }
}
