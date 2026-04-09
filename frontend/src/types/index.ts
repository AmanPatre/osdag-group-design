export type StructureType = 'highway' | 'other';
export type FootpathOption = 'None' | 'Single-sided' | 'Both';
export type SteelGrade = 'E250' | 'E350' | 'E450';
export type ConcreteGrade = 'M25' | 'M30' | 'M35' | 'M40' | 'M45' | 'M50' | 'M55' | 'M60';

export interface LocationData {
  windSpeed: number;
  seismicZone: string;
  seismicFactor: number;
  maxTemp: number;
  minTemp: number;
}

export interface LocationState {
  mode: 'name' | 'custom' | null;
  state: string;
  district: string;
  resolved: LocationData | null;
}

export interface GeometryInputs {
  span: string;
  carriagewayWidth: string;
  footpath: FootpathOption;
  skewAngle: string;
}

export interface AdditionalGeometry {
  girderSpacing: string;
  numGirders: string;
  deckOverhang: string;
}

export interface MaterialInputs {
  girderSteel: SteelGrade;
  crossBracingSteel: SteelGrade;
  deckConcrete: ConcreteGrade;
}

export interface AppState {
  structureType: StructureType;
  location: LocationState;
  geometry: GeometryInputs;
  additionalGeometry: AdditionalGeometry;
  materials: MaterialInputs;
}
