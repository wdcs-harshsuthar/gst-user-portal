export const LIBERIAN_COUNTIES = [
  'Montserrado',
  'Nimba', 
  'Bong',
  'Lofa',
  'Grand Bassa',
  'Margibi',
  'Grand Cape Mount',
  'Gbarpolu',
  'Bomi',
  'Grand Gedeh',
  'River Cess',
  'Sinoe',
  'Grand Kru',
  'Maryland',
  'River Gee'
];

export const IDENTIFICATION_TYPES = [
  { value: 'voters-card', label: 'Liberian Voter\'s Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'nasscorp-id', label: 'NASSCORP ID' },
  { value: 'drivers-license', label: 'Liberian Driver\'s License' },
  { value: 'birth-certificate', label: 'Birth Certificate' },
  { value: 'national-id', label: 'National ID (LIB)' }
];

export const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];

export const MARITAL_STATUS_OPTIONS = ['single', 'married', 'divorced', 'widowed'];

export const GENDER_OPTIONS = ['male', 'female'];

export const BUILDING_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' }
];

export const ORGANIZATION_TYPES = [
  { value: 'limited-liability', label: 'Limited Liability Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'trust', label: 'Trust' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'association', label: 'Association' },
  { value: 'other', label: 'Other' }
];

export const BUSINESS_TYPES = [
  { value: 'partnership', label: 'Partnership' },
  { value: 'company', label: 'Company' },
  { value: 'corporation', label: 'Corporation' }
];

export const REGISTRATION_REASONS = [
  { value: 'new', label: 'New Registration' },
  { value: 'modify', label: 'Modify Existing Registration' },
  { value: 'reregister', label: 'Re-registration' },
  { value: 'closure', label: 'Closure' }
];

export const PETTY_TRADER_CLASSES = [
  { value: 'class-a', label: 'Class A' },
  { value: 'class-b', label: 'Class B' },
  { value: 'class-c', label: 'Class C' }
];

export const PROPERTY_CONDITIONS = [
  'Excellent',
  'Good',
  'Fair', 
  'Poor',
  'Under Construction'
];

export const FOUNDATION_MATERIALS = [
  'Concrete',
  'Block',
  'Stone',
  'Wood',
  'Other'
];

export const WALL_MATERIALS = [
  'Concrete Block',
  'Brick',
  'Wood',
  'Zinc',
  'Mud Brick',
  'Other'
];

export const ROOF_MATERIALS = [
  'Zinc',
  'Tile',
  'Concrete',
  'Thatch',
  'Other'
];

export const FLOOR_MATERIALS = [
  'Ceramic Tile',
  'Concrete',
  'Wood',
  'Earth',
  'Other'
];

export const EMPLOYMENT_TYPES = [
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'government-employee', label: 'Government, charity or private business employee' },
  { value: 'investor', label: 'Investor' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'petty-trader', label: 'Petty Trader' }
];

export const REPRESENTATION_TYPES = [
  { value: 'accountant', label: 'Accountant' },
  { value: 'broker', label: 'Broker/Commission' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'proxy', label: 'Proxy' },
  { value: 'other', label: 'Other' }
];

export const REPRESENTATION_REASONS = [
  { value: 'deceased', label: 'Deceased' },
  { value: 'legally-disabled', label: 'Legally Disabled' },
  { value: 'illness', label: 'Illness' },
  { value: 'minor', label: 'Minor' },
  { value: 'security-issue', label: 'Security Issue' },
  { value: 'travel-business', label: 'Travel/Business' },
  { value: 'insolvent', label: 'Insolvent' },
  { value: 'other', label: 'Other' }
];

export const LIBERIAN_DISTRICTS = {
  'Montserrado': ['Greater Monrovia', 'Todee', 'Careysburg', 'St. Paul River'],
  'Nimba': ['Sanniquellie-Mahn', 'Tappita', 'Yar-pea-mahn', 'Doe', 'Kparblee', 'Saclepea-mahn', 'Garr-bah', 'Twan-River', 'Jalayah', 'Web-boe'],
  'Bong': ['Fuamah', 'Jorquelleh', 'Kokoyah', 'Panta-Kpa', 'Salala', 'Sanoyeah', 'Suakoko', 'Tappita', 'Zotalay'],
  'Lofa': ['Foya', 'Kolahun', 'Quardu-Gbondi', 'Salayea', 'Vahun', 'Voinjama'],
  'Grand Bassa': ['District #1', 'District #2', 'District #3', 'District #4', 'Owensgrove', 'St. John River'],
  'Margibi': ['Firestone', 'Gibi', 'Kakata', 'Mambah-Kaba'],
  'Grand Cape Mount': ['Commonwealth', 'Garwular', 'Gola Konneh', 'Porkpa', 'Tewor'],
  'Gbarpolu': ['Belle Yalla', 'Bokomu', 'Gounwolaila', 'Kongba'],
  'Bomi': ['Dewoin', 'Klay', 'Mecca', 'Senje'],
  'Grand Gedeh': ['Cavalla', 'Konobo', 'Putu', 'Tchien'],
  'River Cess': ['Cestos', 'Jo River', 'Nia-Kru', 'Sam-Dean', 'Timbo'],
  'Sinoe': ['Bokon', 'Dugbe River', 'Greenville', 'Jaedae', 'Kulu Shaw/Boe', 'Sanquin #1', 'Sanquin #2', 'Sanquin #3'],
  'Grand Kru': ['Barclayville', 'Buah', 'Dorbor', 'Forpoh', 'Garraway', 'Jloh'],
  'Maryland': ['Gwelekpoken', 'Karluway #1', 'Karluway #2', 'Pleebo/Sodeken', 'Whojah'],
  'River Gee': ['Chedepo', 'Gbeapo', 'Glaro', 'Nanee', 'Nyenawliken', 'Potupo', 'Tuobo']
};