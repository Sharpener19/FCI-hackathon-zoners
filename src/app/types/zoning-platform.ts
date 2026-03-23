// export interface Municipality {
//   id: string;
//   name: string;
//   province: string;
//   population: number;
//   area: number; // in km²
//   zoningBylaw: string;
//   lastUpdated: string;
// }

// export interface ZoneRegulation {
//   id: string;
//   municipalityId: string;
//   zoneName: string;
//   zoneCode: string;
//   permittedUses: string[];
//   maxDensity: number; // units per hectare
//   maxHeight: number; // in meters
//   minLotSize: number; // in m²
//   minSetbackFront: number; // in meters
//   minSetbackSide: number; // in meters
//   minSetbackRear: number; // in meters
//   maxLotCoverage: number; // percentage
//   minParkingPerUnit: number;
//   minGreenSpace: number; // percentage
//   restrictiveness: 'Low' | 'Medium' | 'High' | 'Very High';
//   restrictionScore: number; // 0-100, higher = more restrictive
// }

// export interface HousingFeasibility {
//   municipalityId: string;
//   zoneName: string;
//   feasibilityScore: number; // 0-100
//   maxUnits: number;
//   estimatedCost: number;
//   constraints: string[];
//   opportunities: string[];
// }

// export interface OCRDocument {
//   id: string;
//   fileName: string;
//   municipalityId: string;
//   uploadDate: string;
//   status: 'processing' | 'completed' | 'failed';
//   extractedData?: Partial<ZoneRegulation>[];
//   pageCount: number;
// }

// export interface ComparisonMetric {
//   metric: string;
//   municipalities: {
//     [municipalityId: string]: number | string;
//   };
// }
export interface Municipality {
  id: string;
  name: string;
  province: string;
  population: number;
  area: number; // in km²
  zoningBylaw: string;
  lastUpdated: string;
}

export interface ZoneRegulation {
  id: string;
  municipalityId: string;
  zoneName: string;
  zoneCode: string;
  permittedUses: string[];
  maxDensity: number; // units per hectare
  maxHeight: number; // in meters
  minLotSize: number; // in m²
  minSetbackFront: number; // in meters
  minSetbackSide: number; // in meters
  minSetbackRear: number; // in meters
  maxLotCoverage: number; // percentage
  minParkingPerUnit: number;
  minGreenSpace: number; // percentage
  restrictiveness: 'Low' | 'Medium' | 'High' | 'Very High';
  restrictionScore: number; // 0-100, higher = more restrictive
}

export interface HousingFeasibility {
  municipalityId: string;
  zoneName: string;
  feasibilityScore: number; // 0-100
  maxUnits: number;
  estimatedCost: number;
  constraints: string[];
  opportunities: string[];
}

export interface OCRDocument {
  id: string;
  fileName: string;
  municipalityId: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  extractedData?: Partial<ZoneRegulation>[];
  pageCount: number;
}

export interface ComparisonMetric {
  metric: string;
  municipalities: {
    [municipalityId: string]: number | string;
  };
}
