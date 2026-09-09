export type PropertyType = 'House' | 'Land' | 'Commercial' | 'Building';
export type PropertyPurpose = 'Sale' | 'Rent';
export type PropertyStatus = 'Active' | 'Pending Review' | 'Sold' | 'Rented' | 'Rejected';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  location: string;
  size: string; // e.g., "10 Marla", "1 Kanal", "5 Marla", "1200 Sq Ft"
  bedrooms?: number;
  bathrooms?: number;
  price: number; // in PKR
  description: string;
  features: string[];
  images: string[];
  status: PropertyStatus;
  ownerName: string;
  ownerPhone: string;
  dateAdded: string;
  assignedAgent?: string;
  commissionPercent?: number;
  featured?: boolean;
}

export type LeadStatus = 'New' | 'Contacted' | 'Visiting' | 'Closed' | 'Negative';

export interface Lead {
  id: string;
  name: string;
  propertyId?: string;
  propertyTitle?: string;
  status: LeadStatus;
  date: string;
  phone: string;
  email?: string;
  notes: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  commission: number;
  commissionPercent: number;
  status: 'Paid' | 'Pending';
  date: string;
  agentName: string;
}

export interface PersonRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyInterest?: string;
  dateAdded: string;
  notes?: string;
  type?: 'seller' | 'buyer';
  role?: 'Seller' | 'Buyer';
}

export type Person = PersonRecord;

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
}

export interface CompanySettings {
  companyName: string;
  name?: string;
  tagline: string;
  secondaryTagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  adminName: string;
  adminEmail: string;
}

export type PublicNavRoute = 
  | 'home' 
  | 'properties' 
  | 'land' 
  | 'houses' 
  | 'commercial' 
  | 'buildings' 
  | 'about' 
  | 'contact' 
  | 'list-property'
  | 'property-detail';

export type AdminNavRoute = 
  | 'dashboard' 
  | 'properties' 
  | 'sellers' 
  | 'buyers' 
  | 'leads' 
  | 'transactions' 
  | 'commissions' 
  | 'ledger' 
  | 'reports' 
  | 'settings';
