import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * User roles in the ISC Portal
 */
export type UserRole = 'admin' | 'user' | 'guest' | 'network-admin' | 'isc-admin' | 'billing-contact' | 'technical-contact';

/**
 * Feature access levels
 */
export type AccessLevel = 'full' | 'read-only' | 'limited' | 'none';

/**
 * Standardized error codes for access control
 */
export enum AccessErrorCode {
  // Permission errors
  NO_PERMISSION = 'ACC_001',
  INSUFFICIENT_ROLE = 'ACC_002',
  FEATURE_NOT_LICENSED = 'ACC_003',
  ACCOUNT_SUSPENDED = 'ACC_004',

  // Feature-specific errors
  CIRCUITS_ACCESS_DENIED = 'FEAT_001',
  SITES_ACCESS_DENIED = 'FEAT_002',
  CLOUDS_ACCESS_DENIED = 'FEAT_003',
  INVOICES_ACCESS_DENIED = 'FEAT_004',
  REPORTS_ACCESS_DENIED = 'FEAT_005',
  CONTACTS_ACCESS_DENIED = 'FEAT_006',
  TICKETS_ACCESS_DENIED = 'FEAT_007',
  APP_PERFORMANCE_ACCESS_DENIED = 'FEAT_008',

  // License errors
  TRIAL_EXPIRED = 'LIC_001',
  FEATURE_NOT_IN_PLAN = 'LIC_002',
  UPGRADE_REQUIRED = 'LIC_003',

  // Network/Account errors
  NETWORK_NOT_PROVISIONED = 'NET_001',
  SERVICE_NOT_ACTIVE = 'NET_002',
  REGION_RESTRICTED = 'NET_003'
}

/**
 * Access control result
 */
export interface AccessResult {
  hasAccess: boolean;
  accessLevel: AccessLevel;
  errorCode?: AccessErrorCode;
  errorMessage?: string;
  upgradeRequired?: boolean;
  contactSalesMessage?: string;
}

/**
 * Feature definition
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  requiredRoles: UserRole[];
  requiredLicense?: string[];
  requiresActiveService?: boolean;
}

/**
 * User profile with permissions
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  licenses: string[];
  activeServices: string[];
  accountStatus: 'active' | 'suspended' | 'trial' | 'expired';
  trialExpiresAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$: Observable<UserProfile | null> = this.currentUserSubject.asObservable();

  /**
   * Feature definitions
   */
  private features: Map<string, Feature> = new Map([
    ['circuits', {
      id: 'circuits',
      name: 'Network Circuits',
      description: 'View and manage network circuits',
      requiredRoles: ['admin', 'network-admin', 'isc-admin', 'user'],
      requiresActiveService: true
    }],
    ['sites', {
      id: 'sites',
      name: 'Sites Management',
      description: 'View and manage site locations',
      requiredRoles: ['admin', 'network-admin', 'isc-admin', 'user'],
      requiresActiveService: false
    }],
    ['clouds', {
      id: 'clouds',
      name: 'Cloud Services',
      description: 'Manage cloud connectivity',
      requiredRoles: ['admin', 'network-admin', 'isc-admin'],
      requiredLicense: ['cloud-connect', 'enterprise-plus'],
      requiresActiveService: true
    }],
    ['invoices', {
      id: 'invoices',
      name: 'Network Invoices',
      description: 'View billing and invoices',
      requiredRoles: ['admin', 'billing-contact', 'isc-admin'],
      requiresActiveService: false
    }],
    ['circuit-reports', {
      id: 'circuit-reports',
      name: 'Circuit Reports',
      description: 'Generate circuit performance reports',
      requiredRoles: ['admin', 'network-admin', 'isc-admin', 'user'],
      requiredLicense: ['reporting', 'enterprise'],
      requiresActiveService: true
    }],
    ['contacts', {
      id: 'contacts',
      name: 'Contact Management',
      description: 'Manage account contacts',
      requiredRoles: ['admin', 'isc-admin'],
      requiresActiveService: false
    }],
    ['tickets', {
      id: 'tickets',
      name: 'Support Tickets',
      description: 'View and manage support tickets',
      requiredRoles: ['admin', 'network-admin', 'isc-admin', 'user', 'technical-contact'],
      requiresActiveService: false
    }],
    ['application-performance', {
      id: 'application-performance',
      name: 'Application Performance',
      description: 'Monitor application performance metrics',
      requiredRoles: ['admin', 'network-admin', 'isc-admin'],
      requiredLicense: ['apm', 'enterprise-plus'],
      requiresActiveService: true
    }]
  ]);

  constructor() {
    // Initialize with a demo user (in real app, this would come from auth service)
    this.setCurrentUser(this.getDemoUser());
  }

  /**
   * Set the current user
   */
  setCurrentUser(user: UserProfile | null): void {
    this.currentUserSubject.next(user);
  }

  /**
   * Get the current user
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has access to a feature
   */
  checkAccess(featureId: string): AccessResult {
    const user = this.getCurrentUser();
    const feature = this.features.get(featureId);

    if (!user) {
      return {
        hasAccess: false,
        accessLevel: 'none',
        errorCode: AccessErrorCode.NO_PERMISSION,
        errorMessage: 'You must be logged in to access this feature.'
      };
    }

    if (!feature) {
      return {
        hasAccess: true,
        accessLevel: 'full'
      };
    }

    // Check account status
    if (user.accountStatus === 'suspended') {
      return {
        hasAccess: false,
        accessLevel: 'none',
        errorCode: AccessErrorCode.ACCOUNT_SUSPENDED,
        errorMessage: 'Your account has been suspended. Please contact support to restore access.',
        contactSalesMessage: 'Contact our support team at support@isc.com or call 1-800-ISC-HELP'
      };
    }

    if (user.accountStatus === 'expired') {
      return {
        hasAccess: false,
        accessLevel: 'none',
        errorCode: AccessErrorCode.TRIAL_EXPIRED,
        errorMessage: 'Your trial period has expired. Upgrade to continue using this feature.',
        upgradeRequired: true,
        contactSalesMessage: 'Contact sales to upgrade your account: sales@isc.com or call 1-800-ISC-SALES'
      };
    }

    // Check role-based permissions
    if (!feature.requiredRoles.includes(user.role)) {
      return {
        hasAccess: false,
        accessLevel: 'none',
        errorCode: this.getFeatureErrorCode(featureId),
        errorMessage: `Your role (${user.role}) does not have permission to access ${feature.name}.`,
        contactSalesMessage: 'Contact your account administrator to request access.'
      };
    }

    // Check license requirements
    if (feature.requiredLicense && feature.requiredLicense.length > 0) {
      const hasLicense = feature.requiredLicense.some(license =>
        user.licenses.includes(license)
      );

      if (!hasLicense) {
        return {
          hasAccess: false,
          accessLevel: 'none',
          errorCode: AccessErrorCode.FEATURE_NOT_IN_PLAN,
          errorMessage: `${feature.name} is not included in your current plan.`,
          upgradeRequired: true,
          contactSalesMessage: `Upgrade to ${feature.requiredLicense[0]} or higher to access this feature. Contact sales@isc.com`
        };
      }
    }

    // Check service activation
    if (feature.requiresActiveService) {
      const hasActiveService = user.activeServices.includes(featureId);

      if (!hasActiveService) {
        return {
          hasAccess: false,
          accessLevel: 'none',
          errorCode: AccessErrorCode.SERVICE_NOT_ACTIVE,
          errorMessage: `${feature.name} service is not active for your account.`,
          contactSalesMessage: 'Contact support to activate this service: support@isc.com'
        };
      }
    }

    // User has full access
    return {
      hasAccess: true,
      accessLevel: 'full'
    };
  }

  /**
   * Get feature-specific error code
   */
  private getFeatureErrorCode(featureId: string): AccessErrorCode {
    const errorCodeMap: { [key: string]: AccessErrorCode } = {
      'circuits': AccessErrorCode.CIRCUITS_ACCESS_DENIED,
      'sites': AccessErrorCode.SITES_ACCESS_DENIED,
      'clouds': AccessErrorCode.CLOUDS_ACCESS_DENIED,
      'invoices': AccessErrorCode.INVOICES_ACCESS_DENIED,
      'circuit-reports': AccessErrorCode.REPORTS_ACCESS_DENIED,
      'contacts': AccessErrorCode.CONTACTS_ACCESS_DENIED,
      'tickets': AccessErrorCode.TICKETS_ACCESS_DENIED,
      'application-performance': AccessErrorCode.APP_PERFORMANCE_ACCESS_DENIED
    };

    return errorCodeMap[featureId] || AccessErrorCode.NO_PERMISSION;
  }

  /**
   * Get error message for error code
   */
  getErrorMessage(errorCode: AccessErrorCode): string {
    const messages: { [key in AccessErrorCode]: string } = {
      [AccessErrorCode.NO_PERMISSION]: 'You do not have permission to access this feature.',
      [AccessErrorCode.INSUFFICIENT_ROLE]: 'Your user role does not have sufficient permissions.',
      [AccessErrorCode.FEATURE_NOT_LICENSED]: 'This feature is not included in your license.',
      [AccessErrorCode.ACCOUNT_SUSPENDED]: 'Your account has been suspended.',
      [AccessErrorCode.CIRCUITS_ACCESS_DENIED]: 'You do not have access to Network Circuits.',
      [AccessErrorCode.SITES_ACCESS_DENIED]: 'You do not have access to Sites Management.',
      [AccessErrorCode.CLOUDS_ACCESS_DENIED]: 'You do not have access to Cloud Services.',
      [AccessErrorCode.INVOICES_ACCESS_DENIED]: 'You do not have access to Invoices.',
      [AccessErrorCode.REPORTS_ACCESS_DENIED]: 'You do not have access to Circuit Reports.',
      [AccessErrorCode.CONTACTS_ACCESS_DENIED]: 'You do not have access to Contact Management.',
      [AccessErrorCode.TICKETS_ACCESS_DENIED]: 'You do not have access to Support Tickets.',
      [AccessErrorCode.APP_PERFORMANCE_ACCESS_DENIED]: 'You do not have access to Application Performance monitoring.',
      [AccessErrorCode.TRIAL_EXPIRED]: 'Your trial period has expired.',
      [AccessErrorCode.FEATURE_NOT_IN_PLAN]: 'This feature is not included in your current plan.',
      [AccessErrorCode.UPGRADE_REQUIRED]: 'An upgrade is required to access this feature.',
      [AccessErrorCode.NETWORK_NOT_PROVISIONED]: 'Network services have not been provisioned.',
      [AccessErrorCode.SERVICE_NOT_ACTIVE]: 'This service is not active for your account.',
      [AccessErrorCode.REGION_RESTRICTED]: 'This feature is not available in your region.'
    };

    return messages[errorCode] || 'Access denied.';
  }

  /**
   * Demo user for testing (can be changed to simulate different scenarios)
   */
  private getDemoUser(): UserProfile {
    return {
      id: 'demo-user-1',
      name: 'John Smith',
      email: 'john.smith@acme.com',
      role: 'admin', // Change this to test different roles
      licenses: ['basic', 'reporting', 'cloud-connect', 'enterprise-plus', 'apm'], // Try: ['basic', 'reporting', 'cloud-connect', 'enterprise-plus']
      activeServices: ['circuits', 'sites', 'tickets', 'clouds', 'circuit-reports', 'application-performance'], // Services that are provisioned
      accountStatus: 'active' // Options: 'active', 'suspended', 'trial', 'expired'
    };
  }

  /**
   * Simulate different user scenarios (for testing)
   */
  simulateUser(scenario: 'full-access' | 'limited-user' | 'billing-only' | 'no-license' | 'suspended' | 'guest'): void {
    let user: UserProfile;

    switch (scenario) {
      case 'full-access':
        user = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@acme.com',
          role: 'admin',
          licenses: ['basic', 'enterprise-plus', 'cloud-connect', 'apm', 'reporting'],
          activeServices: ['circuits', 'sites', 'clouds', 'tickets', 'circuit-reports', 'application-performance'],
          accountStatus: 'active'
        };
        break;

      case 'limited-user':
        user = {
          id: 'user-2',
          name: 'Limited User',
          email: 'user@acme.com',
          role: 'user',
          licenses: ['basic'],
          activeServices: ['circuits', 'tickets'],
          accountStatus: 'active'
        };
        break;

      case 'billing-only':
        user = {
          id: 'billing-1',
          name: 'Billing Contact',
          email: 'billing@acme.com',
          role: 'billing-contact',
          licenses: ['basic'],
          activeServices: [],
          accountStatus: 'active'
        };
        break;

      case 'no-license':
        user = {
          id: 'trial-1',
          name: 'Trial User',
          email: 'trial@acme.com',
          role: 'user',
          licenses: ['basic'],
          activeServices: ['circuits'],
          accountStatus: 'trial',
          trialExpiresAt: new Date(Date.now() - 86400000) // Expired yesterday
        };
        break;

      case 'suspended':
        user = {
          id: 'suspended-1',
          name: 'Suspended User',
          email: 'suspended@acme.com',
          role: 'user',
          licenses: ['basic'],
          activeServices: [],
          accountStatus: 'suspended'
        };
        break;

      case 'guest':
        user = {
          id: 'guest-1',
          name: 'Guest User',
          email: 'guest@acme.com',
          role: 'guest',
          licenses: [],
          activeServices: [],
          accountStatus: 'active'
        };
        break;

      default:
        user = this.getDemoUser();
    }

    this.setCurrentUser(user);
    console.log(`🔐 Simulating user scenario: ${scenario}`, user);
  }
}
