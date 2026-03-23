import type { Municipality, ZoneRegulation } from '../types/zoning-platform';

export const municipalities: Municipality[] = [
  {
    id: 'waterloo',
    name: 'Waterloo',
    province: 'Ontario',
    population: 121436,
    area: 64.02,
    zoningBylaw: '2018-001',
    lastUpdated: '2024-11-15'
  },
  {
    id: 'guelph',
    name: 'Guelph',
    province: 'Ontario',
    population: 151984,
    area: 87.22,
    zoningBylaw: '1995-14864',
    lastUpdated: '2024-10-28'
  }
];

export const zoneRegulations: ZoneRegulation[] = [
  // Waterloo Zones
  {
    id: 'wat-r1',
    municipalityId: 'waterloo',
    zoneName: 'Low Density Residential',
    zoneCode: 'R1',
    permittedUses: ['Single detached dwelling', 'Home occupation'],
    maxDensity: 25,
    maxHeight: 10,
    minLotSize: 450,
    minSetbackFront: 6,
    minSetbackSide: 1.2,
    minSetbackRear: 7.5,
    maxLotCoverage: 35,
    minParkingPerUnit: 2,
    minGreenSpace: 40,
    restrictiveness: 'Very High',
    restrictionScore: 82
  },
  {
    id: 'wat-r2',
    municipalityId: 'waterloo',
    zoneName: 'Medium Density Residential',
    zoneCode: 'R2',
    permittedUses: ['Single detached', 'Semi-detached', 'Duplex', 'Converted dwelling'],
    maxDensity: 50,
    maxHeight: 11,
    minLotSize: 300,
    minSetbackFront: 5,
    minSetbackSide: 1.2,
    minSetbackRear: 7.5,
    maxLotCoverage: 40,
    minParkingPerUnit: 1.5,
    minGreenSpace: 35,
    restrictiveness: 'High',
    restrictionScore: 68
  },
  {
    id: 'wat-r3',
    municipalityId: 'waterloo',
    zoneName: 'High Density Residential',
    zoneCode: 'R3',
    permittedUses: ['Townhouse', 'Apartment building', 'Multiple dwelling', 'Mixed-use residential'],
    maxDensity: 150,
    maxHeight: 25,
    minLotSize: 800,
    minSetbackFront: 6,
    minSetbackSide: 3,
    minSetbackRear: 7.5,
    maxLotCoverage: 45,
    minParkingPerUnit: 1.25,
    minGreenSpace: 30,
    restrictiveness: 'Medium',
    restrictionScore: 52
  },
  {
    id: 'wat-r4',
    municipalityId: 'waterloo',
    zoneName: 'High Rise Residential',
    zoneCode: 'R4',
    permittedUses: ['Apartment building', 'High-rise residential', 'Retirement home'],
    maxDensity: 250,
    maxHeight: 45,
    minLotSize: 2000,
    minSetbackFront: 7.5,
    minSetbackSide: 4.5,
    minSetbackRear: 10,
    maxLotCoverage: 40,
    minParkingPerUnit: 1.0,
    minGreenSpace: 25,
    restrictiveness: 'Low',
    restrictionScore: 38
  },

  // Guelph Zones
  {
    id: 'gue-r1',
    municipalityId: 'guelph',
    zoneName: 'Residential Single Detached',
    zoneCode: 'R.1',
    permittedUses: ['Single detached dwelling', 'Accessory dwelling unit', 'Home occupation'],
    maxDensity: 30,
    maxHeight: 10.5,
    minLotSize: 370,
    minSetbackFront: 6,
    minSetbackSide: 1.2,
    minSetbackRear: 7.5,
    maxLotCoverage: 40,
    minParkingPerUnit: 1.5,
    minGreenSpace: 35,
    restrictiveness: 'High',
    restrictionScore: 75
  },
  {
    id: 'gue-r2',
    municipalityId: 'guelph',
    zoneName: 'Residential Duplex/Triplex',
    zoneCode: 'R.2',
    permittedUses: ['Single detached', 'Semi-detached', 'Duplex', 'Triplex', 'Townhouse'],
    maxDensity: 60,
    maxHeight: 11,
    minLotSize: 280,
    minSetbackFront: 4.5,
    minSetbackSide: 1.2,
    minSetbackRear: 7.5,
    maxLotCoverage: 45,
    minParkingPerUnit: 1.25,
    minGreenSpace: 30,
    restrictiveness: 'Medium',
    restrictionScore: 62
  },
  {
    id: 'gue-r3',
    municipalityId: 'guelph',
    zoneName: 'Residential Townhouse',
    zoneCode: 'R.3',
    permittedUses: ['Townhouse', 'Stacked townhouse', 'Apartment building (low-rise)'],
    maxDensity: 100,
    maxHeight: 14,
    minLotSize: 600,
    minSetbackFront: 4.5,
    minSetbackSide: 3,
    minSetbackRear: 7.5,
    maxLotCoverage: 50,
    minParkingPerUnit: 1.2,
    minGreenSpace: 28,
    restrictiveness: 'Medium',
    restrictionScore: 55
  },
  {
    id: 'gue-r4',
    municipalityId: 'guelph',
    zoneName: 'Residential Apartment',
    zoneCode: 'R.4',
    permittedUses: ['Apartment building', 'Mixed-use residential', 'Retirement home'],
    maxDensity: 200,
    maxHeight: 40,
    minLotSize: 1800,
    minSetbackFront: 7.5,
    minSetbackSide: 4.5,
    minSetbackRear: 9,
    maxLotCoverage: 45,
    minParkingPerUnit: 1.0,
    minGreenSpace: 25,
    restrictiveness: 'Low',
    restrictionScore: 45
  }
];

export interface Parcel {
  id: string;
  municipalityId: string;
  address: string;
  zoneCode: string;
  area: number; // m²
  frontage: number; // m
  depth: number; // m
  coordinates: { x: number; y: number }[]; // SVG polygon coordinates
  currentUse?: string;
}

export const parcels: Parcel[] = [
  // Waterloo parcels
  {
    id: 'wat-p1',
    municipalityId: 'waterloo',
    address: '123 University Ave W',
    zoneCode: 'R1',
    area: 550,
    frontage: 15,
    depth: 36.67,
    coordinates: [
      { x: 50, y: 50 },
      { x: 110, y: 50 },
      { x: 110, y: 120 },
      { x: 50, y: 120 }
    ],
    currentUse: 'Single detached dwelling'
  },
  {
    id: 'wat-p2',
    municipalityId: 'waterloo',
    address: '456 King St N',
    zoneCode: 'R2',
    area: 380,
    frontage: 12,
    depth: 31.67,
    coordinates: [
      { x: 115, y: 50 },
      { x: 165, y: 50 },
      { x: 165, y: 110 },
      { x: 115, y: 110 }
    ],
    currentUse: 'Semi-detached dwelling'
  },
  {
    id: 'wat-p3',
    municipalityId: 'waterloo',
    address: '789 Columbia St W',
    zoneCode: 'R3',
    area: 1200,
    frontage: 30,
    depth: 40,
    coordinates: [
      { x: 170, y: 50 },
      { x: 240, y: 50 },
      { x: 240, y: 130 },
      { x: 170, y: 130 }
    ],
    currentUse: 'Townhouse complex'
  },
  {
    id: 'wat-p4',
    municipalityId: 'waterloo',
    address: '101 Caroline St S',
    zoneCode: 'R4',
    area: 3500,
    frontage: 50,
    depth: 70,
    coordinates: [
      { x: 245, y: 50 },
      { x: 330, y: 50 },
      { x: 330, y: 150 },
      { x: 245, y: 150 }
    ],
    currentUse: 'Apartment building'
  },
  {
    id: 'wat-p5',
    municipalityId: 'waterloo',
    address: '234 Weber St N',
    zoneCode: 'R1',
    area: 520,
    frontage: 14,
    depth: 37.14,
    coordinates: [
      { x: 50, y: 125 },
      { x: 105, y: 125 },
      { x: 105, y: 190 },
      { x: 50, y: 190 }
    ]
  },
  {
    id: 'wat-p6',
    municipalityId: 'waterloo',
    address: '567 Erb St W',
    zoneCode: 'R2',
    area: 420,
    frontage: 13,
    depth: 32.31,
    coordinates: [
      { x: 110, y: 115 },
      { x: 160, y: 115 },
      { x: 160, y: 175 },
      { x: 110, y: 175 }
    ],
    currentUse: 'Duplex'
  },

  // Guelph parcels
  {
    id: 'gue-p1',
    municipalityId: 'guelph',
    address: '55 Wyndham St N',
    zoneCode: 'R.1',
    area: 420,
    frontage: 12,
    depth: 35,
    coordinates: [
      { x: 380, y: 50 },
      { x: 430, y: 50 },
      { x: 430, y: 115 },
      { x: 380, y: 115 }
    ],
    currentUse: 'Single detached dwelling'
  },
  {
    id: 'gue-p2',
    municipalityId: 'guelph',
    address: '88 Gordon St',
    zoneCode: 'R.2',
    area: 340,
    frontage: 11,
    depth: 30.91,
    coordinates: [
      { x: 435, y: 50 },
      { x: 480, y: 50 },
      { x: 480, y: 110 },
      { x: 435, y: 110 }
    ],
    currentUse: 'Semi-detached dwelling'
  },
  {
    id: 'gue-p3',
    municipalityId: 'guelph',
    address: '120 Woolwich St',
    zoneCode: 'R.3',
    area: 850,
    frontage: 25,
    depth: 34,
    coordinates: [
      { x: 485, y: 50 },
      { x: 545, y: 50 },
      { x: 545, y: 125 },
      { x: 485, y: 125 }
    ],
    currentUse: 'Townhouse'
  },
  {
    id: 'gue-p4',
    municipalityId: 'guelph',
    address: '200 Speedvale Ave E',
    zoneCode: 'R.4',
    area: 2800,
    frontage: 45,
    depth: 62.22,
    coordinates: [
      { x: 550, y: 50 },
      { x: 625, y: 50 },
      { x: 625, y: 145 },
      { x: 550, y: 145 }
    ],
    currentUse: 'Apartment building'
  },
  {
    id: 'gue-p5',
    municipalityId: 'guelph',
    address: '77 Eramosa Rd',
    zoneCode: 'R.1',
    area: 395,
    frontage: 11.5,
    depth: 34.35,
    coordinates: [
      { x: 380, y: 120 },
      { x: 425, y: 120 },
      { x: 425, y: 180 },
      { x: 380, y: 180 }
    ]
  },
  {
    id: 'gue-p6',
    municipalityId: 'guelph',
    address: '145 Edinburgh Rd S',
    zoneCode: 'R.2',
    area: 310,
    frontage: 10,
    depth: 31,
    coordinates: [
      { x: 430, y: 115 },
      { x: 475, y: 115 },
      { x: 475, y: 170 },
      { x: 430, y: 170 }
    ],
    currentUse: 'Triplex'
  }
];

export interface ZoningDocument {
  id: string;
  municipalityId: string;
  title: string;
  type: 'bylaw' | 'amendment' | 'policy';
  url: string;
  date: string;
  relevantZones: string[];
  searchableText: string;
}

export const zoningDocuments: ZoningDocument[] = [
  {
    id: 'wat-doc1',
    municipalityId: 'waterloo',
    title: 'Comprehensive Zoning By-law 2018-001',
    type: 'bylaw',
    url: 'https://www.waterloo.ca/en/government/zoning-by-law.aspx',
    date: '2018-01-15',
    relevantZones: ['R1', 'R2', 'R3', 'R4'],
    searchableText: 'residential zoning regulations single detached duplex townhouse apartment parking minimum two units allowed setback requirements height restrictions'
  },
  {
    id: 'wat-doc2',
    municipalityId: 'waterloo',
    title: 'Amendment 2023-045: Parking Reductions',
    type: 'amendment',
    url: 'https://www.waterloo.ca/en/government/zoning-amendments.aspx',
    date: '2023-06-20',
    relevantZones: ['R3', 'R4'],
    searchableText: 'parking minimum reduced near transit high density residential one space per unit'
  },
  {
    id: 'gue-doc1',
    municipalityId: 'guelph',
    title: 'Zoning By-law 1995-14864',
    type: 'bylaw',
    url: 'https://guelph.ca/planning-and-building/zoning/',
    date: '1995-04-10',
    relevantZones: ['R.1', 'R.2', 'R.3', 'R.4'],
    searchableText: 'residential zones permitted uses single family semi-detached duplex triplex townhouse apartment accessory dwelling unit'
  },
  {
    id: 'gue-doc2',
    municipalityId: 'guelph',
    title: 'Additional Residential Unit Policy',
    type: 'policy',
    url: 'https://guelph.ca/aru-policy',
    date: '2022-03-15',
    relevantZones: ['R.1', 'R.2'],
    searchableText: 'second unit basement apartment garden suite accessory unit two units allowed duplex permitted'
  }
];
