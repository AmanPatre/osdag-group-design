// IS 875 Part 3 (wind), IS 1893 Part 1 (seismic), IS 6 (temperature)
import type { LocationData } from '../types';

export const stateDistricts: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Thane', 'Kolhapur'],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubli-Dharwad'],
  'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore'],
};

const districtData: Record<string, LocationData> = {
  // Maharashtra
  'Mumbai':     { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 38, minTemp: 16 },
  'Pune':       { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 42, minTemp: 10 },
  'Nagpur':     { windSpeed: 44, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 47, minTemp: 8  },
  'Nashik':     { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 42, minTemp: 8  },
  'Aurangabad': { windSpeed: 39, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 44, minTemp: 8  },
  'Thane':      { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 38, minTemp: 16 },
  'Kolhapur':   { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 38, minTemp: 12 },

  // Delhi
  'New Delhi':  { windSpeed: 47, seismicZone: 'Zone IV', seismicFactor: 0.24, maxTemp: 48, minTemp: 1 },
  'North Delhi':{ windSpeed: 47, seismicZone: 'Zone IV', seismicFactor: 0.24, maxTemp: 47, minTemp: 2 },
  'South Delhi':{ windSpeed: 47, seismicZone: 'Zone IV', seismicFactor: 0.24, maxTemp: 47, minTemp: 2 },
  'East Delhi': { windSpeed: 47, seismicZone: 'Zone IV', seismicFactor: 0.24, maxTemp: 47, minTemp: 2 },
  'West Delhi': { windSpeed: 47, seismicZone: 'Zone IV', seismicFactor: 0.24, maxTemp: 47, minTemp: 2 },

  // Tamil Nadu
  'Chennai':         { windSpeed: 50, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 44, minTemp: 19 },
  'Coimbatore':      { windSpeed: 39, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 40, minTemp: 15 },
  'Madurai':         { windSpeed: 47, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 43, minTemp: 18 },
  'Tiruchirappalli': { windSpeed: 47, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 43, minTemp: 18 },
  'Salem':           { windSpeed: 39, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 41, minTemp: 16 },
  'Tirunelveli':     { windSpeed: 47, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 42, minTemp: 19 },

  // Karnataka
  'Bengaluru Urban': { windSpeed: 33, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 38, minTemp: 12 },
  'Bengaluru Rural': { windSpeed: 33, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 38, minTemp: 10 },
  'Mysuru':          { windSpeed: 33, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 37, minTemp: 12 },
  'Mangaluru':       { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 38, minTemp: 18 },
  'Hubli-Dharwad':   { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 40, minTemp: 10 },

  // West Bengal
  'Kolkata':  { windSpeed: 50, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 40, minTemp: 10 },
  'Howrah':   { windSpeed: 50, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 40, minTemp: 10 },
  'Asansol':  { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 43, minTemp: 8  },
  'Siliguri': { windSpeed: 47, seismicZone: 'Zone IV',  seismicFactor: 0.24, maxTemp: 36, minTemp: 5  },
  'Durgapur': { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 43, minTemp: 8  },

  // Gujarat
  'Ahmedabad': { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 46, minTemp: 5  },
  'Surat':     { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 42, minTemp: 10 },
  'Vadodara':  { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 45, minTemp: 6  },
  'Rajkot':    { windSpeed: 39, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 44, minTemp: 7  },
  'Bhavnagar': { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 43, minTemp: 8  },

  // Rajasthan
  'Jaipur':  { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 48, minTemp: 2 },
  'Jodhpur': { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 48, minTemp: 3 },
  'Kota':    { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 47, minTemp: 4 },
  'Bikaner': { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 48, minTemp: 1 },
  'Ajmer':   { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 47, minTemp: 3 },

  // Uttar Pradesh
  'Lucknow':   { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 46, minTemp: 2 },
  'Kanpur':    { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 46, minTemp: 2 },
  'Agra':      { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 47, minTemp: 1 },
  'Varanasi':  { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 46, minTemp: 4 },
  'Meerut':    { windSpeed: 47, seismicZone: 'Zone IV',  seismicFactor: 0.24, maxTemp: 46, minTemp: 1 },
  'Allahabad': { windSpeed: 47, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 47, minTemp: 3 },

  // Madhya Pradesh
  'Bhopal':   { windSpeed: 39, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 46, minTemp: 5 },
  'Indore':   { windSpeed: 39, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 44, minTemp: 6 },
  'Gwalior':  { windSpeed: 47, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 47, minTemp: 2 },
  'Jabalpur': { windSpeed: 39, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 46, minTemp: 5 },
  'Ujjain':   { windSpeed: 39, seismicZone: 'Zone II', seismicFactor: 0.10, maxTemp: 45, minTemp: 5 },

  // Andhra Pradesh
  'Hyderabad':     { windSpeed: 44, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 44, minTemp: 12 },
  'Visakhapatnam': { windSpeed: 50, seismicZone: 'Zone II',  seismicFactor: 0.10, maxTemp: 42, minTemp: 16 },
  'Vijayawada':    { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 44, minTemp: 14 },
  'Guntur':        { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 44, minTemp: 14 },
  'Nellore':       { windSpeed: 44, seismicZone: 'Zone III', seismicFactor: 0.16, maxTemp: 43, minTemp: 15 },
};

export function getDistrictData(district: string): LocationData | null {
  return districtData[district] ?? null;
}

export const states = Object.keys(stateDistricts).sort();
