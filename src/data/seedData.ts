import { Property, Lead, Transaction, PersonRecord, LedgerEntry, CompanySettings } from '../types';

export const CHITRAL_LOCATIONS = [
  'Markaz Rd, Chitral',
  'Singoor, Chitral',
  'Danin, Upper Chitral',
  'Ataliq Bazar, Chitral',
  'Booni Road, Chitral',
  'Ayun Valley, Chitral',
  'Drosh, Lower Chitral',
  'Shahi Bazar, Chitral',
  'Airport Road, Chitral',
  'Polo Ground, Chitral',
  'Garam Chashma, Chitral',
  'Danin Bypass, Chitral',
  'Jutial / Danin, Chitral'
];

export const INITIAL_SETTINGS: CompanySettings = {
  companyName: 'Rafeeq Homes and Properties (PVT LTD)',
  tagline: 'Your Dream Property, Our Priority',
  secondaryTagline: 'Chitral — Land of Opportunities',
  phone: '0345 5429230',
  whatsapp: '923455429230',
  email: 'rafeeqhomes@gmail.com',
  address: 'Markaz Rd, opposite Radio Pakistan, near Polo Grounds, Chitral',
  adminName: 'Rafeeq Ahmad Chitrali',
  adminEmail: 'ramizahmad1601@gmail.com'
};

// High-quality mountain landscape & regional property imagery curated from Unsplash
export const PROPERTY_IMAGES = {
  mountainHouses: [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ],
  lands: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80'
  ],
  buildings: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Clean real database schema - mock arrays deleted per user instruction
export const SEED_PROPERTIES: Property[] = [];
export const SEED_TRANSACTIONS: Transaction[] = [];
export const SEED_LEADS: Lead[] = [];
export const SEED_PEOPLE: PersonRecord[] = [];
export const SEED_LEDGER: LedgerEntry[] = [];
