
export enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Converted = 'Converted',
  Lost = 'Lost',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface Lead {
  id: string;
  customerId: string;
  title: string;
  description: string;
  status: LeadStatus;
  value: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}
