const BASE_URL = 'https://osdag-group-design.onrender.com/api';

export interface LocationApiResponse {
  states: Record<string, string[]>;
}

export interface LocationDataResponse {
  wind_speed: number;
  seismic_zone: string;
  seismic_factor: number;
  max_temp: number;
  min_temp: number;
}

export interface GeometryValidationResponse {
  span_valid: boolean;
  carriageway_valid: boolean;
  skew_warning: boolean;
  errors: string[];
}

export interface GirderCalcResponse {
  girder_spacing?: number;
  num_girders?: number;
  deck_overhang?: number;
  overall_bridge_width?: number;
  constraint_satisfied?: boolean;
  error?: string;
}

export interface DesignResponse {
  ok: boolean;
  warnings: string[];
  message: string;
  inputs: Record<string, unknown>;
  location: Record<string, unknown>;
  results: null | Record<string, unknown>;
  errors?: Record<string, unknown>;
}

export async function fetchLocations(): Promise<LocationApiResponse> {
  const res = await fetch(`${BASE_URL}/locations/`);
  if (!res.ok) throw new Error('Failed to fetch locations');
  return res.json();
}

export async function fetchLocationData(state: string, district: string): Promise<LocationDataResponse> {
  const params = new URLSearchParams({ state, district });
  const res = await fetch(`${BASE_URL}/location-data/?${params}`);
  if (!res.ok) throw new Error('Failed to fetch location data');
  return res.json();
}

export async function validateGeometry(
  span: number,
  carriagewayWidth: number,
  skewAngle: number
): Promise<GeometryValidationResponse> {
  const res = await fetch(`${BASE_URL}/validate-geometry/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ span, carriageway_width: carriagewayWidth, skew_angle: skewAngle }),
  });
  if (!res.ok) throw new Error('Geometry validation failed');
  return res.json();
}


export async function calculateGirder(params: {
  girder_spacing?: number;
  num_girders?: number;
  deck_overhang?: number;
  carriageway_width: number;
}): Promise<GirderCalcResponse> {
  const res = await fetch(`${BASE_URL}/calculate-girder/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Girder calculation failed');
  return res.json();
}


export async function submitDesign(payload: Record<string, unknown>): Promise<DesignResponse> {
  const res = await fetch(`${BASE_URL}/design/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
