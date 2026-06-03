export interface EmergencyService {
  id: string;
  name: string;
  number: string;
  address: string;
  coords: {
    lat: number;
    lng: number;
  };
  distance?: number; // Optional distance from user location
}

export interface UserLocation {
  lat: number;
  lng: number;
}