import type { EmergencyService } from '../types';

export const EMERGENCY_SERVICES: EmergencyService[] = [
  {
    id: 'rescue_1122',
    name: 'Rescue 1122',
    number: '1122',
    address: 'HQ building, Sindh Emergency Service Rescue 1122, Block 17 Gulshan-e-Iqbal, Karachi',
    coords: { lat: 24.9128, lng: 67.0933 }
  },
  {
    id: 'madadgar_police',
    name: 'Madadgar Police',
    number: '15',
    address: 'Central Police Office, I.I Chundrigar Road, Karachi',
    coords: { lat: 24.8510, lng: 67.0058 }
  },
  {
    id: 'kmc_fire_brigade',
    name: 'KMC Fire Brigade',
    number: '16',
    address: 'KMC Head Office, M.A. Jinnah Road Karachi',
    coords: { lat: 24.8573, lng: 67.0100 }
  },
  {
    id: 'edhi_ambulance',
    name: 'Edhi Ambulance',
    number: '115',
    address: 'Sarafa Bazar, Boulton Market, Mithadar, Karachi',
    coords: { lat: 24.8530, lng: 66.9980 }
  },
  {
    id: 'chhipa_ambulance',
    name: 'Chhipa Ambulance',
    number: '1020',
    address: 'FTC Bridge, Shahrah-e-Faisal, Karachi',
    coords: { lat: 24.8541, lng: 67.0500 }
  },
  {
    id: 'aman_ambulance',
    name: 'Aman Ambulance',
    number: '1101',
    address: 'Plot # 333, Korangi Township Near Pakistan Refinery Ltd., Karachi',
    coords: { lat: 24.8340, lng: 67.1330 }
  },
  {
    id: 'traffic_police',
    name: 'Traffic Police',
    number: '915',
    address: 'I.I Chundrigar Rd, Lalazar, Karachi',
    coords: { lat: 24.8515, lng: 67.0070 }
  }
];
