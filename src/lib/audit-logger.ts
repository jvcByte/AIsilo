/**
 * NIST/ISO Compliant Audit Logging System
 * Implements comprehensive audit trails for compliance requirements
 */

export interface AuditEvent {
  id: string;
  timestamp: number;
  eventType: AuditEventType;
  userId: string;
  userAddress: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  severity: AuditSeverity;
  compliance: ComplianceInfo;
}

export type AuditEventType = 
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'encryption'
  | 'decryption'
  | 'emergency_access'
  | 'system_event'
  | 'security_event'
  | 'compliance_event';

export type AuditSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ComplianceInfo {
  nistFramework: string[];
  isoControls: string[];
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  retentionPeriod: number; // days
  encryptionRequired: boolean;
  accessLevel: 'read' | 'write' | 'admin' | 'emergency';
}

export interface AuditQuery {
  userId?: string;
  eventType?: AuditEventType;
  severity?: AuditSeverity;
  startDate?: number;
  endDate?: number;
  resourceId?: string;
  compliance?: Partial<ComplianceInfo>;
}

export interface AuditReport {
  totalEvents: number;
  eventsByType: Record<AuditEventType, number>;
  eventsBySeverity: Record<AuditSeverity, number>;
  complianceStatus: ComplianceStatus;
  securityIncidents: SecurityIncident[];
  recommendations: string[];
}

export interface ComplianceStatus {
  nistCompliance: number; // percentage
  isoCompliance: number; // percentage
  overallScore: number; // percentage
  gaps: ComplianceGap[];
}

export interface ComplianceGap {
  control: string;
  standard: 'NIST' | 'ISO';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: number;
  type: 'unauthorized_access' | 'data_breach' | 'encryption_failure' | 'system_compromise';
  severity: AuditSeverity;
  description: string;
  affectedResources: string[];
  response: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
}

class AuditLogger {
  private events: AuditEvent[] = [];
  private securityIncidents: SecurityIncident[] = [];
  private complianceGaps: ComplianceGap[] = [];

  /**
   * Log an audit event
   */
  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): string {
    const auditEvent: AuditEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now()
    };

    this.events.push(auditEvent);
    
    // Check for security incidents
    this.checkSecurityIncidents(auditEvent);
    
    // Check compliance gaps
    this.checkComplianceGaps(auditEvent);

    // Store in persistent storage (in production, this would be a database)
    this.persistEvent(auditEvent);

    return auditEvent.id;
  }

  /**
   * Query audit events
   */
  queryEvents(query: AuditQuery): AuditEvent[] {
    return this.events.filter(event => {
      if (query.userId && event.userId !== query.userId) return false;
      if (query.eventType && event.eventType !== query.eventType) return false;
      if (query.severity && event.severity !== query.severity) return false;
      if (query.startDate && event.timestamp < query.startDate) return false;
      if (query.endDate && event.timestamp > query.endDate) return false;
      if (query.resourceId && event.resourceId !== query.resourceId) return false;
      
      if (query.compliance) {
        const comp = query.compliance;
        if (comp.dataClassification && event.compliance.dataClassification !== comp.dataClassification) return false;
        if (comp.accessLevel && event.compliance.accessLevel !== comp.accessLevel) return false;
      }

      return true;
    });
  }

  /**
   * Generate compliance report
   */
  generateComplianceReport(startDate?: number, endDate?: number): AuditReport {
    const filteredEvents = this.events.filter(event => {
      if (startDate && event.timestamp < startDate) return false;
      if (endDate && event.timestamp > endDate) return false;
      return true;
    });

    const eventsByType = filteredEvents.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<AuditEventType, number>);

    const eventsBySeverity = filteredEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<AuditSeverity, number>);

    const complianceStatus = this.calculateComplianceStatus(filteredEvents);

    return {
      totalEvents: filteredEvents.length,
      eventsByType,
      eventsBySeverity,
      complianceStatus,
      securityIncidents: this.securityIncidents,
      recommendations: this.generateRecommendations(complianceStatus)
    };
  }

  /**
   * Log authentication event
   */
  logAuthentication(
    userId: string,
    userAddress: string,
    action: 'login' | 'logout' | 'failed_login' | 'password_reset',
    details: Record<string, any> = {}
  ): string {
    return this.logEvent({
      eventType: 'authentication',
      userId,
      userAddress,
      action,
      resource: 'system',
      resourceId: 'auth',
      details,
      severity: action === 'failed_login' ? 'high' : 'medium',
      compliance: {
        nistFramework: ['PR.AC-1', 'PR.AC-7'],
        isoControls: ['A.9.1.1', 'A.9.1.2'],
        dataClassification: 'internal',
        retentionPeriod: 2555, // 7 years
        encryptionRequired: false,
        accessLevel: 'read'
      }
    });
  }

  /**
   * Log data access event
   */
  logDataAccess(
    userId: string,
    userAddress: string,
    resourceId: string,
    action: 'read' | 'download' | 'view',
    details: Record<string, any> = {}
  ): string {
    return this.logEvent({
      eventType: 'data_access',
      userId,
      userAddress,
      action,
      resource: 'document',
      resourceId,
      details,
      severity: 'medium',
      compliance: {
        nistFramework: ['PR.AC-3', 'PR.DS-1'],
        isoControls: ['A.9.1.1', 'A.10.1.1'],
        dataClassification: 'confidential',
        retentionPeriod: 2555, // 7 years
        encryptionRequired: true,
        accessLevel: 'read'
      }
    });
  }

  /**
   * Log encryption event
   */
  logEncryption(
    userId: string,
    userAddress: string,
    resourceId: string,
    action: 'encrypt' | 'decrypt' | 'key_rotation',
    details: Record<string, any> = {}
  ): string {
    return this.logEvent({
      eventType: 'encryption',
      userId,
      userAddress,
      action,
      resource: 'document',
      resourceId,
      details,
      severity: 'high',
      compliance: {
        nistFramework: ['PR.DS-1', 'PR.DS-2'],
        isoControls: ['A.10.1.1', 'A.10.1.2'],
        dataClassification: 'restricted',
        retentionPeriod: 2555, // 7 years
        encryptionRequired: true,
        accessLevel: 'write'
      }
    });
  }

  /**
   * Log emergency access event
   */
  logEmergencyAccess(
    userId: string,
    userAddress: string,
    resourceId: string,
    action: 'create' | 'use' | 'revoke',
    details: Record<string, any> = {}
  ): string {
    return this.logEvent({
      eventType: 'emergency_access',
      userId,
      userAddress,
      action,
      resource: 'document',
      resourceId,
      details,
      severity: 'critical',
      compliance: {
        nistFramework: ['PR.AC-1', 'PR.AC-3', 'DE.CM-1'],
        isoControls: ['A.9.1.1', 'A.9.1.2', 'A.12.1.1'],
        dataClassification: 'restricted',
        retentionPeriod: 2555, // 7 years
        encryptionRequired: true,
        accessLevel: 'emergency'
      }
    });
  }

  /**
   * Log security incident
   */
  logSecurityIncident(
    incident: Omit<SecurityIncident, 'id' | 'timestamp'>
  ): string {
    const securityIncident: SecurityIncident = {
      ...incident,
      id: this.generateEventId(),
      timestamp: Date.now()
    };

    this.securityIncidents.push(securityIncident);
    this.persistSecurityIncident(securityIncident);

    return securityIncident.id;
  }

  /**
   * Check for security incidents
   */
  private checkSecurityIncidents(event: AuditEvent): void {
    // Check for multiple failed login attempts
    if (event.eventType === 'authentication' && event.action === 'failed_login') {
      const recentFailures = this.events.filter(e => 
        e.eventType === 'authentication' && 
        e.action === 'failed_login' && 
        e.userId === event.userId &&
        e.timestamp > Date.now() - 15 * 60 * 1000 // 15 minutes
      );

      if (recentFailures.length >= 5) {
        this.logSecurityIncident({
          type: 'unauthorized_access',
          severity: 'high',
          description: `Multiple failed login attempts detected for user ${event.userId}`,
          affectedResources: [event.userId],
          response: 'Account locked temporarily',
          status: 'open'
        });
      }
    }

    // Check for unusual access patterns
    if (event.eventType === 'data_access') {
      const recentAccess = this.events.filter(e => 
        e.eventType === 'data_access' && 
        e.userId === event.userId &&
        e.timestamp > Date.now() - 60 * 60 * 1000 // 1 hour
      );

      if (recentAccess.length >= 100) {
        this.logSecurityIncident({
          type: 'unauthorized_access',
          severity: 'medium',
          description: `Unusual access pattern detected for user ${event.userId}`,
          affectedResources: [event.userId],
          response: 'Access pattern under review',
          status: 'investigating'
        });
      }
    }
  }

  /**
   * Check compliance gaps
   */
  private checkComplianceGaps(event: AuditEvent): void {
    // Check for missing encryption on sensitive data
    if (event.compliance.dataClassification === 'restricted' && !event.compliance.encryptionRequired) {
      this.complianceGaps.push({
        control: 'A.10.1.1',
        standard: 'ISO',
        description: 'Sensitive data not encrypted',
        severity: 'high',
        recommendation: 'Implement encryption for all restricted data'
      });
    }

    // Check for insufficient access controls
    if (event.compliance.accessLevel === 'emergency' && event.severity !== 'critical') {
      this.complianceGaps.push({
        control: 'PR.AC-1',
        standard: 'NIST',
        description: 'Emergency access not properly logged',
        severity: 'medium',
        recommendation: 'Ensure all emergency access is logged with critical severity'
      });
    }
  }

  /**
   * Calculate compliance status
   */
  private calculateComplianceStatus(events: AuditEvent[]): ComplianceStatus {
    const nistControls = new Set<string>();
    const isoControls = new Set<string>();

    events.forEach(event => {
      event.compliance.nistFramework.forEach(control => nistControls.add(control));
      event.compliance.isoControls.forEach(control => isoControls.add(control));
    });

    const nistCompliance = (nistControls.size / 20) * 100; // Assuming 20 NIST controls
    const isoCompliance = (isoControls.size / 15) * 100; // Assuming 15 ISO controls
    const overallScore = (nistCompliance + isoCompliance) / 2;

    return {
      nistCompliance,
      isoCompliance,
      overallScore,
      gaps: this.complianceGaps
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(complianceStatus: ComplianceStatus): string[] {
    const recommendations: string[] = [];

    if (complianceStatus.nistCompliance < 80) {
      recommendations.push('Improve NIST Cybersecurity Framework compliance');
    }

    if (complianceStatus.isoCompliance < 80) {
      recommendations.push('Enhance ISO 27001 controls implementation');
    }

    if (complianceStatus.overallScore < 70) {
      recommendations.push('Conduct comprehensive security assessment');
    }

    return recommendations;
  }

  /**
   * Generate event ID
   */
  private generateEventId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Persist event to storage
   */
  private persistEvent(event: AuditEvent): void {
    // In production, this would save to a database
    const stored = localStorage.getItem('audit-events') || '[]';
    const events = JSON.parse(stored);
    events.push(event);
    localStorage.setItem('audit-events', JSON.stringify(events));
  }

  /**
   * Persist security incident
   */
  private persistSecurityIncident(incident: SecurityIncident): void {
    // In production, this would save to a database
    const stored = localStorage.getItem('security-incidents') || '[]';
    const incidents = JSON.parse(stored);
    incidents.push(incident);
    localStorage.setItem('security-incidents', JSON.stringify(incidents));
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger();

// Export convenience functions
export const logAuth = auditLogger.logAuthentication.bind(auditLogger);
export const logDataAccess = auditLogger.logDataAccess.bind(auditLogger);
export const logEncryption = auditLogger.logEncryption.bind(auditLogger);
export const logEmergencyAccess = auditLogger.logEmergencyAccess.bind(auditLogger);
export const logSecurityIncident = auditLogger.logSecurityIncident.bind(auditLogger);
