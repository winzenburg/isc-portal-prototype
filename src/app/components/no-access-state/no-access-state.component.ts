import { Component } from '@angular/core';

export interface AccessStateConfig {
  title: string;
  description: string;
  icon: string;
  actionButtons: ActionButton[];
  supportInfo: SupportInfo;
  learnMoreUrl?: string;
}

export interface ActionButton {
  label: string;
  action: string;
  primary: boolean;
}

export interface SupportInfo {
  title: string;
  regions: SupportRegion[];
}

export interface SupportRegion {
  name: string;
  phone: string;
  email?: string;
}

@Component({
  selector: 'app-no-access-state',
  templateUrl: './no-access-state.component.html',
  styleUrls: ['./no-access-state.component.scss']
})
export class NoAccessStateComponent {
  config: AccessStateConfig = {
    title: 'SD-WAN Orchestrator Not Configured',
    description: 'Your account has not been set up for SD-WAN orchestration. This service provides advanced network management capabilities including traffic optimization, policy management, and real-time monitoring.',
    icon: 'settings_ethernet',
    actionButtons: [
      {
        label: 'Request Access',
        action: 'request',
        primary: true
      },
      {
        label: 'Learn More',
        action: 'learn',
        primary: false
      }
    ],
    supportInfo: {
      title: 'Need Help?',
      regions: [
        {
          name: 'USA',
          phone: '+(877) 462-7374',
          email: 'support@masergy.com'
        },
        {
          name: 'EMEA',
          phone: '+44 (0) 207 173 6888',
          email: 'support.emea@masergy.com'
        }
      ]
    },
    learnMoreUrl: '#'
  };

  onAction(action: string): void {
    switch (action) {
      case 'request':
        this.handleRequestAccess();
        break;
      case 'learn':
        this.handleLearnMore();
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  handleRequestAccess(): void {
    // In a real implementation, this would open a modal or navigate to a request form
    console.log('Opening access request form...');
    alert('Access request form would open here. In production, this would be a proper modal or form.');
  }

  handleLearnMore(): void {
    // In a real implementation, this would navigate to documentation
    console.log('Navigating to documentation...');
    if (this.config.learnMoreUrl) {
      window.open(this.config.learnMoreUrl, '_blank');
    }
  }

  callSupport(phone: string): void {
    window.location.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  emailSupport(email: string | undefined): void {
    if (email) {
      window.location.href = `mailto:${email}?subject=SD-WAN Orchestrator Access Request`;
    }
  }

  getPhoneHref(phone: string): string {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
  }

  getEmailHref(email: string): string {
    return `mailto:${email}?subject=SD-WAN Orchestrator Access Request`;
  }
}
