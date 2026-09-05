export interface AccommodationProvider {
  id: string;
  name: string;
  zoneId: string;
  category: 'luxury' | 'business' | 'budget' | 'homestay';
  totalRooms: number;
  availableRooms: number;
  occupancyRate: number; // 0 - 100
  avgRatePerNight: number;
  isBufferPartner: boolean;
  transitShuttleAvailable: boolean;
  contactPerson: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface OverflowCandidate {
  zoneId: string;
  zoneName: string;
  availableRooms: number;
  avgTravelTimeMin: number;
  transitReliability: number; // 0 - 100
  pressureScore: number;
  costAdvantagePct: number;
  recommendationScore: number; // 0 - 100
  shuttleFrequencyMin: number;
}
