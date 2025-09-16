import { RegistrationData } from '../../UserApp';

// Create dummy files for testing
const createDummyFile = (name: string, type: string, content: string = 'dummy content') => {
  return new File([content], name, { type });
};

export const DUMMY_INDIVIDUAL_DATA = {
  reason: 'new',
  existingTin: '',
  applicantType: 'individual',
  title: 'Mr',
  firstName: 'James',
  middleName: 'Kpannah',
  lastName: 'Johnson',
  identificationType: 'national-id',
  idNumber: 'NID-2023-001234',
  nationality: 'Liberian',
  placeOfIssuance: 'Monrovia',
  gender: 'male',
  dateOfBirth: '1985-03-15',
  cityOfBirth: 'Monrovia',
  countryOfBirth: 'Liberia',
  maritalStatus: 'married',
  occupation: 'Small Business Owner',
  phone: '+231-555-0123',
  email: 'james.johnson@email.lr',
  alternatePhone: '+231-555-0124',
  fatherName: 'Samuel Johnson',
  motherName: 'Mary Johnson',
  streetAddress: '15th Street, Sinkor',
  landmark: 'Near Sinkor Market',
  city: 'Monrovia',
  district: 'Greater Monrovia',
  county: 'Montserrado',
  country: 'Liberia',
  poBox: 'P.O. Box 1234',
  isResident: true,
  mailingAddress: {
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    country: '',
    poBox: ''
  },
  annualTurnover: '50000',
  fiscalYearStart: '2024-01-01',
  fiscalYearEnd: '2024-12-31',
  isImporter: true,
  isExporter: false,
  isLandlord: true,
  isPettyTrader: false,
  pettyTraderClass: '',
  ownsProperty: true,
  paysRent: false
};

export const DUMMY_BUSINESS_DATA = {
  reason: 'new',
  existingTins: [''],
  hasExistingGst: true,
  existingGstNumber: 'GST-2023-1234567',
  organizationType: 'limited-liability',
  registeredName: 'Liberia Trading Company LLC',
  tradeName: 'LTC',
  countryOfIncorporation: 'Liberia',
  registrationDate: '2020-05-15',
  businessRegNumber: 'BR2020-5678',
  nassCorpNumber: 'NSC-2020-1234',
  taxStartDate: '2020-06-01',
  taxCloseDate: '',
  streetAddress: 'Broad Street, Central Monrovia',
  landmark: 'Near Central Bank of Liberia',
  city: 'Monrovia',
  district: 'Central Monrovia',
  county: 'Montserrado',
  country: 'Liberia',
  poBox: 'P.O. Box 5678',
  mailingAddressDifferent: false,
  mailingStreetAddress: '',
  mailingCity: '',
  mailingCounty: '',
  mailingCountry: '',
  mailingPoBox: '',
  buildingType: 'commercial',
  fiscalYearStart: '2024-01-01',
  fiscalYearEnd: '2024-12-31',
  businessActivities: 'Import and export of consumer goods, wholesale distribution, and retail sales of household items and electronics.',
  mainActivity: 'Import/Export Trading',
  businessLicenses: [
    { 
      number: 'BL-2020-001', 
      type: 'General Business License', 
      startDate: '2020-06-01', 
      endDate: '2025-05-31' 
    },
    { 
      number: 'IL-2020-045', 
      type: 'Import License', 
      startDate: '2020-06-15', 
      endDate: '2025-06-14' 
    }
  ],
  contactName: 'Patricia Williams',
  contactPosition: 'General Manager',
  contactPhone: '+231-555-0200',
  contactEmail: 'patricia.williams@ltc.lr',
  annualTurnover: '500000',
  capitalOrigin: 'Local',
  capitalValue: '100000',
  totalShares: '1000',
  bankName: 'Liberia Bank for Development and Investment',
  accountNumber: '123456789',
  businessType: 'company'
};

export const DUMMY_SOLE_PROPRIETORSHIP_DATA = {
  // Enterprise Name
  enterpriseName: 'Mama Kema\'s General Store',
  
  // Enterprise Address
  county: 'Montserrado',
  administrativeDistrict: 'Paynesville District',
  taxDistrict: 'Greater Monrovia',
  cityVillageTown: 'Paynesville',
  majorLandmark: 'Red Light Market',
  streetRoad: 'Robertsfield Highway',
  buildingUnit: 'Section 4, Stall 23',
  poBox: 'P.O. Box 5432',
  
  // Owner (required if Part A is not completed)
  ownerTin: 'TIN-2019-4567',
  ownerName: 'Kema Varney',
  ownerPhone: '+231-555-0300',
  ownerEmail: 'kema.varney@email.lr',
  
  // Contact Person (if different from owner)
  contactTin: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  
  // Business Details
  businessCommencementDate: '2019-08-20',
  numberOfEmployees: '3',
  fiscalYearEndMonth: 'December',
  estimatedAnnualTurnover: '25000',
  paysRent: 'yes',
  
  // Business Activities
  isicCode: '',
  businessActivityDescription: 'Retail sale of household goods, groceries, beverages, and basic consumer items. Also provides mobile phone credit top-up services.',
  isMainActivity: true,
  
  // Bank Account
  declaresBankAccount: 'yes',
  accountNumber: '0123456789',
  accountHolderName: 'Kema Varney',
  bankName: 'United Bank for Africa',
  branchName: 'Paynesville Branch',
  
  // Certification
  certFirstName: 'Kema',
  certMiddleName: '',
  certLastName: 'Varney',
  certSignature: 'Kema Varney',
  certDate: new Date().toISOString().split('T')[0]
};

export const DUMMY_OWNERS_SHAREHOLDERS_DATA = {
  reason: 'new',
  existingTin: '',
  registeredName: 'Nimba Mining Corporation',
  tradeName: 'NMC',
  businessRegNumber: 'MC-2021-7890',
  registrationDate: '2021-03-10',
  streetAddress: 'Tubman Boulevard, Congo Town',
  landmark: 'Near SKD Sports Complex',
  city: 'Monrovia',
  district: 'Congo Town',
  county: 'Montserrado',
  country: 'Liberia',
  poBox: 'P.O. Box 9876',
  email: 'info@nimbamining.lr',
  phone: '+231-555-0400',
  alternatePhone: '+231-555-0401',
  owners: [
    {
      tin: 'TIN-2020-1111',
      fullName: 'Moses Tarnue',
      startDate: '2021-03-10',
      endDate: '',
      numberOfShares: '400',
      percentageOfShares: '40.00'
    },
    {
      tin: 'TIN-2020-2222',
      fullName: 'Sarah Gbessay',
      startDate: '2021-03-10',
      endDate: '',
      numberOfShares: '350',
      percentageOfShares: '35.00'
    },
    {
      tin: 'TIN-2020-3333',
      fullName: 'Robert Karnley',
      startDate: '2021-03-10',
      endDate: '',
      numberOfShares: '250',
      percentageOfShares: '25.00'
    }
  ]
};

export const DUMMY_PROPERTY_DATA = {
  // Property Owner Info
  ownerTin: 'TIN-2020-1234',
  houseNumber: '25',
  ownerFullName: 'Elizabeth Pewee',
  ownerAddress: '25 Crown Hill, Sinkor, Monrovia, Montserrado County',
  ownerPhone: '+231-555-0500',
  
  // Property Valuation
  declaredValue: '75000',
  taxRate: '0.25',
  annualTaxAmount: '187.50',
  
  // Property Location
  streetAddress: '25 Crown Hill',
  landmark: 'Near Crown Hill Catholic Church',
  city: 'Monrovia',
  district: 'Sinkor',
  county: 'Montserrado',
  country: 'Liberia',
  poBox: 'P.O. Box 2468',
  
  // Property Photos
  frontViewPhotos: [
    {
      id: 'front-view-1',
      file: createDummyFile('property_front_view.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  backViewPhotos: [
    {
      id: 'back-view-1',
      file: createDummyFile('property_back_view.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  leftSidePhotos: [
    {
      id: 'left-side-1',
      file: createDummyFile('property_left_side.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  rightSidePhotos: [
    {
      id: 'right-side-1',
      file: createDummyFile('property_right_side.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  overviewPhotos: [
    {
      id: 'overview-1',
      file: createDummyFile('property_overview.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  interiorPhotos: [
    {
      id: 'interior-1',
      file: createDummyFile('property_interior.jpg', 'image/jpeg'),
      documentType: 'photo',
      uploadDate: new Date().toISOString()
    }
  ],
  
  // Additional Information
  caretakerOccupant: 'Owner occupied',
  constructionDate: '2018-12-15',
  currentCondition: 'Good',
  
  // Property Schedule
  properties: [
    {
      location: '25 Crown Hill, Sinkor, Montserrado',
      description: '2-story residential house with 4 bedrooms, 3 bathrooms',
      classification: 'Residential',
      value: '75000'
    },
    {
      location: 'Lot 15, New Kru Town, Montserrado',
      description: 'Vacant land for future development',
      classification: 'Undeveloped Land',
      value: '15000'
    }
  ],
  
  // Signature
  ownerSignature: 'Elizabeth Pewee',
  signatureDate: '2024-01-15'
};

export const DUMMY_EXISTING_USER_DATA = {
  reason: 'modify',
  existingTin: 'TIN-2019-9876',
  applicantType: 'individual',
  title: 'Mrs',
  firstName: 'Grace',
  middleName: 'Nyemah',
  lastName: 'Cooper',
  identificationType: 'passport',
  idNumber: 'LR1234567',
  nationality: 'Liberian',
  placeOfIssuance: 'Monrovia',
  gender: 'female',
  dateOfBirth: '1978-07-22',
  cityOfBirth: 'Gbarnga',
  countryOfBirth: 'Liberia',
  maritalStatus: 'divorced',
  occupation: 'Teacher',
  phone: '+231-555-0600',
  email: 'grace.cooper@education.gov.lr',
  alternatePhone: '+231-555-0601',
  fatherName: 'Joseph Cooper',
  motherName: 'Martha Cooper',
  streetAddress: 'UN Drive, Mamba Point',
  landmark: 'Near US Embassy',
  city: 'Monrovia',
  district: 'Mamba Point',
  county: 'Montserrado',
  country: 'Liberia',
  poBox: 'P.O. Box 3579',
  isResident: true,
  mailingAddress: {
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    country: '',
    poBox: ''
  },
  annualTurnover: '25000',
  fiscalYearStart: '2024-01-01',
  fiscalYearEnd: '2024-12-31',
  isImporter: false,
  isExporter: false,
  isLandlord: false,
  isPettyTrader: true,
  pettyTraderClass: 'class-b',
  ownsProperty: true,
  paysRent: false
};

// Sample uploaded documents for testing
const SAMPLE_DOCUMENTS_VERIFIED = [
  {
    id: 'doc-1',
    file: createDummyFile('passport.pdf', 'application/pdf'),
    documentType: 'identification_primary',
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
    verifiedBy: 'admin@lra.gov.lr',
    verificationDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verificationNotes: 'Valid passport document verified'
  },
  {
    id: 'doc-2',
    file: createDummyFile('voter_id.jpg', 'image/jpeg'),
    documentType: 'identification_secondary', 
    uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    verified: true,
    verifiedBy: 'admin@lra.gov.lr',
    verificationDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verificationNotes: 'Voter ID card verified successfully'
  }
];

const SAMPLE_DOCUMENTS_UNVERIFIED = [
  {
    id: 'doc-4',
    file: createDummyFile('national_id.pdf', 'application/pdf'),
    documentType: 'identification_primary',
    uploadDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verified: false
  },
  {
    id: 'doc-5',
    file: createDummyFile('drivers_license.jpg', 'image/jpeg'),
    documentType: 'identification_secondary',
    uploadDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verified: false
  }
];

const SAMPLE_BUSINESS_DOCUMENTS = [
  {
    id: 'doc-7',
    file: createDummyFile('business_cert.pdf', 'application/pdf'),
    documentType: 'business_registration',
    uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verified: true,
    verifiedBy: 'admin@lra.gov.lr',
    verificationDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verificationNotes: 'LBR business registration document verified'
  },
  {
    id: 'doc-8',
    file: createDummyFile('owner_passport.pdf', 'application/pdf'),
    documentType: 'identification_primary',
    uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verified: true,
    verifiedBy: 'admin@lra.gov.lr',
    verificationDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verificationNotes: 'Owner passport verified'
  },
  {
    id: 'doc-9',
    file: createDummyFile('birth_cert.pdf', 'application/pdf'),
    documentType: 'identification_secondary',
    uploadDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    verified: true,
    verifiedBy: 'admin@lra.gov.lr',
    verificationDate: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    verificationNotes: 'Birth certificate verified'
  }
];

// Sample completed applications for dashboard demo
export const DUMMY_COMPLETED_APPLICATIONS: RegistrationData[] = [
  {
    entryPoint: 'individual' as const,
    applicantType: 'individual',
    individualData: {
      firstName: 'John',
      lastName: 'Johnson',
      phone: '+231-555-0123',
      email: 'john.johnson@email.lr',
      occupation: 'Small Business Owner',
      county: 'Montserrado'
    },
    propertyData: {
      ownerFullName: 'John Johnson',
      declaredValue: '75000',
      county: 'Montserrado',
      city: 'Monrovia'
    },
    paymentData: {
      paymentMethod: 'card',
      totalAmount: 202.50,
      cardNumber: '**** **** **** 1234',
      cardholderName: 'John Moses Johnson'
    },
    submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationReference: 'LRA/GST/2024/000001',
    status: 'approved' as const,
    uploadedDocuments: SAMPLE_DOCUMENTS_VERIFIED
  },
  {
    entryPoint: 'individual' as const,
    applicantType: 'individual',
    individualData: {
      firstName: 'Mary',
      lastName: 'Williams',
      phone: '+231-555-0456',
      email: 'mary.williams@email.lr',
      occupation: 'Teacher',
      county: 'Montserrado'
    },
    propertyData: {
      ownerFullName: 'Mary Williams',
      declaredValue: '45000',
      county: 'Montserrado',
      city: 'Paynesville'
    },
    paymentData: {
      paymentMethod: 'offline',
      totalAmount: 200.00,
      challanNumber: 'LRA/CH/2024/000004'
    },
    submissionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicationReference: 'LRA/GST/2024/000002',
    status: 'under-review' as const,
    uploadedDocuments: SAMPLE_DOCUMENTS_UNVERIFIED
  },
  {
    entryPoint: 'individual' as const,
    applicantType: 'sole-proprietorship',
    businessType: 'sole proprietorship',
    soleProprietorshipData: {
      registeredName: 'Brown Trading Company',
      businessRegNumber: 'LBR-SP-2024-001'
    },
    individualData: {
      firstName: 'James',
      lastName: 'Brown',
      phone: '+231-555-0789',
      email: 'james.brown@email.lr',
      occupation: 'Business Owner',
      county: 'Montserrado'
    },
    businessData: {
      businessName: 'Brown Trading Company',
      businessType: 'sole proprietorship',
      registrationNumber: 'LBR-SP-2024-001',
      dateOfIncorporation: '2024-01-15',
      businessPhone: '+231-777-234567',
      businessEmail: 'info@browntrading.lr',
      businessAddress: '789 Commerce Street',
      businessCity: 'Monrovia',
      businessCounty: 'Montserrado'
    },
    propertyData: {
      ownerFullName: 'James Brown',
      declaredValue: '120000',
      county: 'Montserrado',
      city: 'Monrovia'
    },
    paymentData: {
      paymentMethod: 'mobile',
      totalAmount: 202.50,
      mobileMoneyNumber: '+231-777-234567'
    },
    submissionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    applicationReference: 'LRA/GST/2024/000003',
    status: 'processing' as const,
    uploadedDocuments: SAMPLE_BUSINESS_DOCUMENTS
  },
  {
    entryPoint: 'individual' as const,
    applicantType: 'individual',
    individualData: {
      firstName: 'Sarah',
      lastName: 'Davis',
      phone: '+231-555-0321',
      email: 'sarah.davis@email.lr',
      occupation: 'Nurse',
      county: 'Montserrado'
    },
    propertyData: {
      ownerFullName: 'Sarah Davis',
      declaredValue: '95000',
      county: 'Montserrado',
      city: 'Sinkor'
    },
    paymentData: {
      paymentMethod: 'offline',
      totalAmount: 25.00,
      challanNumber: 'LRA/CH/2024/000004'
    },
    submissionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    applicationReference: 'LRA/GST/2024/000004',
    status: 'pending-receipt' as const,
    uploadedDocuments: [{
      id: 'doc-11',
      file: createDummyFile('incomplete_docs.pdf', 'application/pdf'),
      documentType: 'identification_primary',
      uploadDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      verified: false
    }]
  }
];

// Additional sample names for variety
export const SAMPLE_LIBERIAN_NAMES = {
  firstNames: {
    male: ['James', 'Moses', 'Robert', 'Samuel', 'Joseph', 'David', 'Daniel', 'Emmanuel', 'Francis', 'George'],
    female: ['Mary', 'Grace', 'Sarah', 'Elizabeth', 'Patricia', 'Kema', 'Martha', 'Ruth', 'Esther', 'Rebecca']
  },
  lastNames: ['Johnson', 'Williams', 'Cooper', 'Pewee', 'Tarnue', 'Gbessay', 'Karnley', 'Varney', 'Freeman', 'Brown']
};

export const SAMPLE_LIBERIAN_LOCATIONS = {
  monroviaAreas: ['Sinkor', 'Congo Town', 'Mamba Point', 'Paynesville', 'New Kru Town', 'West Point', 'Logan Town'],
  landmarks: [
    'Near Sinkor Market',
    'Near Central Bank of Liberia', 
    'Near US Embassy',
    'Near SKD Sports Complex',
    'Near Redemption Hospital',
    'Near Crown Hill Catholic Church',
    'Near Red Light Market'
  ]
};

export const DUMMY_BRANCH_DATA = {
  // 1. Organization Detail
  parentEntityName: 'West Africa Trading Corporation',
  parentTin: 'TIN-2021-5678',
  
  // Branches
  branches: [
    {
      // 2. Branch Detail
      branchName: 'Paynesville Branch',
      dateOpened: '2023-06-15',
      
      // 3. Branch Address
      country: 'Liberia',
      county: 'Montserrado',
      district: 'Greater Monrovia',
      taxDistrict: 'Paynesville Tax District',
      cityVillageTown: 'Paynesville',
      majorLandmark: 'Red Light Market',
      streetRoad: 'Robertsfield Highway',
      buildingUnit: 'Section 3, Building A',
      poBox: 'P.O. Box 1234',
      
      // 4. Contact Details
      contactNumber: '+231-555-0701',
      alternateTelephone: '+231-555-0702',
      email: 'paynesville@watc.lr',
      alternateEmail: 'paynesville.alt@watc.lr',
      managerName: 'Alice Pewee',
      
      // 5. Certification
      firstName: 'Alice',
      middleName: 'Nyemah',
      lastName: 'Pewee',
      position: 'Branch Manager',
      signature: 'Alice Nyemah Pewee',
      signatureDate: new Date().toISOString().split('T')[0],
      
      // Legacy fields (for backward compatibility)
      branchAddress: 'Red Light Market Area, Section 3, Paynesville',
      natureOfBusiness: 'Retail sales of imported goods, household items, and electronic devices',
      managerIdNumber: 'NID-2022-5678',
      managerIdType: 'National ID',
      employeeCount: '8',
      localBusinessLicenses: 'Paynesville City Business License, Retail Trade Permit',
      licenseNumbers: 'PBL-2023-0156, RTP-2023-0089'
    },
    {
      // 2. Branch Detail
      branchName: 'Gbarnga Branch',
      dateOpened: '2023-09-01',
      
      // 3. Branch Address
      country: 'Liberia',
      county: 'Bong',
      district: 'Fuamah',
      taxDistrict: 'Gbarnga Tax District',
      cityVillageTown: 'Gbarnga',
      majorLandmark: 'Cuttington University',
      streetRoad: 'University Road',
      buildingUnit: 'Commercial Complex, Unit 5',
      poBox: 'P.O. Box 5678',
      
      // 4. Contact Details
      contactNumber: '+231-555-0702',
      alternateTelephone: '+231-555-0703',
      email: 'gbarnga@watc.lr',
      alternateEmail: 'gbarnga.alt@watc.lr',
      managerName: 'John Karnley',
      
      // 5. Certification
      firstName: 'John',
      middleName: 'Moses',
      lastName: 'Karnley',
      position: 'Regional Manager',
      signature: 'John Moses Karnley',
      signatureDate: new Date().toISOString().split('T')[0],
      
      // Legacy fields (for backward compatibility)
      branchAddress: 'Central Gbarnga, near Cuttington University',
      natureOfBusiness: 'Wholesale distribution and retail sales of consumer goods',
      managerIdNumber: 'LR2023456789',
      managerIdType: 'Passport',
      employeeCount: '12',
      localBusinessLicenses: 'Bong County Business Permit, Wholesale Distribution License',
      licenseNumbers: 'BCP-2023-0234, WDL-2023-0067'
    }
  ],
  
  // Declaration
  declarationConfirmed: true,
  signatoryName: 'Moses Tarnue',
  signatoryDate: new Date().toISOString().split('T')[0]
};