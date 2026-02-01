
export enum UserRole {
  CITIZEN = 'CITIZEN',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ComplaintStatus {
  SUBMITTED = 'SUBMITTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
  REJECTED = 'REJECTED'
}

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: UserRole;
  token?: string;
}

export interface Complaint {
  id: number;
  complaintNumber: string; // The SNS-YYYYMMDD-XXXX format
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  submittedAt: string;
  slaDeadline?: string;
  categoryId: number;
  categoryName?: string;
  departmentId?: number;
  zoneId?: number;
  citizenId: number;
  citizenName: string;
}
