import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccessErrorCode } from '../../../services/access-control.service';

/**
 * Access Denied Component
 *
 * Displays various "no access" states based on the reason:
 * - Insufficient permissions (wrong role)
 * - Feature not licensed (upgrade required)
 * - Service not active (provisioning required)
 * - Account suspended
 * - Trial expired
 */
@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent {
  /** Error code for the access denial */
  @Input() errorCode: AccessErrorCode = AccessErrorCode.NO_PERMISSION;

  /** Primary error message */
  @Input() errorMessage: string = 'You do not have permission to access this feature.';

  /** Additional details or context */
  @Input() errorDetails?: string;

  /** Contact message (e.g., "Contact your administrator") */
  @Input() contactMessage?: string;

  /** Show upgrade button */
  @Input() showUpgrade: boolean = false;

  /** Show contact support button */
  @Input() showContactSupport: boolean = true;

  /** Show request access button */
  @Input() showRequestAccess: boolean = false;

  /** Custom icon to display */
  @Input() icon?: string;

  /** Feature name being accessed */
  @Input() featureName?: string;

  /** Emitted when upgrade button is clicked */
  @Output() upgrade = new EventEmitter<void>();

  /** Emitted when contact support button is clicked */
  @Output() contactSupport = new EventEmitter<void>();

  /** Emitted when request access button is clicked */
  @Output() requestAccess = new EventEmitter<void>();

  /**
   * Get icon based on error code
   */
  getIcon(): string {
    if (this.icon) {
      return this.icon;
    }

    switch (this.errorCode) {
      case AccessErrorCode.ACCOUNT_SUSPENDED:
        return 'block';
      case AccessErrorCode.TRIAL_EXPIRED:
      case AccessErrorCode.FEATURE_NOT_IN_PLAN:
      case AccessErrorCode.UPGRADE_REQUIRED:
        return 'workspace_premium';
      case AccessErrorCode.SERVICE_NOT_ACTIVE:
      case AccessErrorCode.NETWORK_NOT_PROVISIONED:
        return 'cloud_off';
      case AccessErrorCode.INSUFFICIENT_ROLE:
      case AccessErrorCode.NO_PERMISSION:
      default:
        return 'lock';
    }
  }

  /**
   * Get icon color based on error code
   */
  getIconColor(): string {
    switch (this.errorCode) {
      case AccessErrorCode.ACCOUNT_SUSPENDED:
        return '#d32f2f'; // Red
      case AccessErrorCode.TRIAL_EXPIRED:
      case AccessErrorCode.FEATURE_NOT_IN_PLAN:
      case AccessErrorCode.UPGRADE_REQUIRED:
        return '#f57c00'; // Orange
      case AccessErrorCode.SERVICE_NOT_ACTIVE:
      case AccessErrorCode.NETWORK_NOT_PROVISIONED:
        return '#0288d1'; // Blue
      default:
        return '#616161'; // Gray
    }
  }

  /**
   * Get default title based on error code
   */
  getTitle(): string {
    switch (this.errorCode) {
      case AccessErrorCode.ACCOUNT_SUSPENDED:
        return 'Account Suspended';
      case AccessErrorCode.TRIAL_EXPIRED:
        return 'Trial Expired';
      case AccessErrorCode.FEATURE_NOT_IN_PLAN:
        return 'Feature Not Available';
      case AccessErrorCode.UPGRADE_REQUIRED:
        return 'Upgrade Required';
      case AccessErrorCode.SERVICE_NOT_ACTIVE:
        return 'Service Not Active';
      case AccessErrorCode.NETWORK_NOT_PROVISIONED:
        return 'Service Not Provisioned';
      case AccessErrorCode.INSUFFICIENT_ROLE:
        return 'Insufficient Permissions';
      default:
        return 'Access Denied';
    }
  }

  /**
   * Get help text based on error code
   */
  getHelpText(): string {
    switch (this.errorCode) {
      case AccessErrorCode.ACCOUNT_SUSPENDED:
        return 'Your account has been temporarily suspended. Please contact support to restore access.';
      case AccessErrorCode.TRIAL_EXPIRED:
        return 'Your trial period has ended. Upgrade to continue using ISC Portal features.';
      case AccessErrorCode.FEATURE_NOT_IN_PLAN:
        return 'This feature is available in higher-tier plans. Contact sales to upgrade your subscription.';
      case AccessErrorCode.UPGRADE_REQUIRED:
        return 'Upgrade your plan to access this premium feature.';
      case AccessErrorCode.SERVICE_NOT_ACTIVE:
        return 'This service has not been activated for your account. Contact support to enable it.';
      case AccessErrorCode.NETWORK_NOT_PROVISIONED:
        return 'Network services are being provisioned. This typically takes 24-48 hours.';
      case AccessErrorCode.INSUFFICIENT_ROLE:
        return 'Your user role does not have permission to access this feature. Contact your account administrator.';
      default:
        return 'You do not have the required permissions. Contact your administrator if you believe this is an error.';
    }
  }

  /**
   * Handle upgrade button click
   */
  onUpgrade(): void {
    this.upgrade.emit();
    // In real app, this would navigate to upgrade page or open upgrade modal
    console.log('Upgrade clicked for feature:', this.featureName);
  }

  /**
   * Handle contact support button click
   */
  onContactSupport(): void {
    this.contactSupport.emit();
    // In real app, this would open support dialog or navigate to support page
    console.log('Contact support clicked for error:', this.errorCode);
  }

  /**
   * Handle request access button click
   */
  onRequestAccess(): void {
    this.requestAccess.emit();
    // In real app, this would send access request to administrator
    console.log('Request access clicked for feature:', this.featureName);
  }

  /**
   * Copy error details to clipboard
   */
  copyErrorDetails(): void {
    const details = `
Error Code: ${this.errorCode}
Feature: ${this.featureName || 'N/A'}
Message: ${this.errorMessage}
Details: ${this.errorDetails || 'N/A'}
Timestamp: ${new Date().toISOString()}
    `.trim();

    navigator.clipboard.writeText(details);
    console.log('Error details copied to clipboard');
  }
}
