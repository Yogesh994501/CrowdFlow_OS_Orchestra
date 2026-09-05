import { AccommodationProvider, PressureStatus } from '../types';
import { nominatimApi } from './api/nominatimApi';
import { osrmApi } from './api/osrmApi';
import { MapAdapter } from '../adapters/mapAdapter';

export interface OverflowRecommendation {
  provider: AccommodationProvider;
  rank: number;
  availableBeds: number;
  travelTimeMin: number;
  crowdScore: number;
  priceBand: string;
  transitEase: 'Excellent' | 'Good' | 'Moderate';
  safetyScore: number;
  explainabilityNote: string;
}

export class AccommodationService {
  private static instance: AccommodationService;

  public static getInstance(): AccommodationService {
    if (!AccommodationService.instance) {
      AccommodationService.instance = new AccommodationService();
    }
    return AccommodationService.instance;
  }

  public getInitialProviders(): AccommodationProvider[] {
    return [
      // BKC (Critical zone)
      {
        id: 'acc_trident_bkc',
        name: 'Trident Hotel BKC',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        type: 'hotel',
        totalRooms: 436,
        occupiedRooms: 428,
        availableRooms: 8,
        predictedCheckins: 45,
        pressure: 98,
        status: 'critical',
        priceBand: '₹₹₹₹',
        pricePerNight: 18500,
        rating: 4.8,
        travelTimeToVenue: 4,
        transitAccessScore: 92,
        safetyScore: 98,
        crowdScore: 95,
        amenities: ['Free WiFi', 'Metro Line 3 Access', 'Business Lounge', 'Valet'],
        address: 'C-56, G Block, BKC, Mumbai',
        lat: 19.0660,
        lng: 72.8675
      },
      {
        id: 'acc_sofitel_bkc',
        name: 'Sofitel Mumbai BKC',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        type: 'hotel',
        totalRooms: 302,
        occupiedRooms: 295,
        availableRooms: 7,
        predictedCheckins: 32,
        pressure: 97,
        status: 'critical',
        priceBand: '₹₹₹₹',
        pricePerNight: 19800,
        rating: 4.7,
        travelTimeToVenue: 6,
        transitAccessScore: 90,
        safetyScore: 97,
        crowdScore: 94,
        amenities: ['Luxury Spa', 'Concierge', 'Direct Shuttle', 'Fine Dining'],
        address: 'C-57, Bandra Kurla Complex',
        lat: 19.0645,
        lng: 72.8650
      },
      {
        id: 'acc_grand_hyatt',
        name: 'Grand Hyatt Mumbai',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        type: 'hotel',
        totalRooms: 547,
        occupiedRooms: 512,
        availableRooms: 35,
        predictedCheckins: 60,
        pressure: 93,
        status: 'critical',
        priceBand: '₹₹₹₹',
        pricePerNight: 16500,
        rating: 4.6,
        travelTimeToVenue: 10,
        transitAccessScore: 88,
        safetyScore: 96,
        crowdScore: 91,
        amenities: ['Convention Center', 'Pool', 'Airport Transfer', 'EV Charging'],
        address: 'Off Western Express Hwy, Santacruz East',
        lat: 19.0782,
        lng: 72.8530
      },
      {
        id: 'acc_bkc_exec',
        name: 'BKC Executive Suites & Pods',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        type: 'hostel',
        totalRooms: 120,
        occupiedRooms: 116,
        availableRooms: 4,
        predictedCheckins: 20,
        pressure: 96,
        status: 'critical',
        priceBand: '₹₹',
        pricePerNight: 3400,
        rating: 4.2,
        travelTimeToVenue: 8,
        transitAccessScore: 84,
        safetyScore: 91,
        crowdScore: 93,
        amenities: ['High-speed WiFi', 'Work Desks', 'Locker Storage'],
        address: 'Near Bharat Diamond Bourse, BKC',
        lat: 19.0610,
        lng: 72.8620
      },
      {
        id: 'acc_zostel_santacruz',
        name: 'Zostel Urban Mumbai BKC Link',
        zoneId: 'bkc',
        zoneName: 'Bandra-Kurla Complex',
        type: 'hostel',
        totalRooms: 85,
        occupiedRooms: 82,
        availableRooms: 3,
        predictedCheckins: 14,
        pressure: 96,
        status: 'critical',
        priceBand: '₹',
        pricePerNight: 1600,
        rating: 4.5,
        travelTimeToVenue: 12,
        transitAccessScore: 86,
        safetyScore: 90,
        crowdScore: 92,
        amenities: ['Community Café', 'Bunk Pods', 'Metro Feeder'],
        address: 'Vakola Bridge, Santacruz East',
        lat: 19.0812,
        lng: 72.8580
      },

      // Dadar (High Pressure zone)
      {
        id: 'acc_itc_grand_central',
        name: 'ITC Grand Central Mumbai',
        zoneId: 'dadar',
        zoneName: 'Dadar Transit Core',
        type: 'hotel',
        totalRooms: 242,
        occupiedRooms: 218,
        availableRooms: 24,
        predictedCheckins: 38,
        pressure: 90,
        status: 'high',
        priceBand: '₹₹₹₹',
        pricePerNight: 15000,
        rating: 4.7,
        travelTimeToVenue: 18,
        transitAccessScore: 96,
        safetyScore: 94,
        crowdScore: 88,
        amenities: ['Heritage Architecture', 'Rooftop Pool', 'Central Rail Link'],
        address: '287 Dr B.A. Road, Parel',
        lat: 19.0065,
        lng: 72.8432
      },
      {
        id: 'acc_ramee_guestline',
        name: 'Ramee Guestline Dadar',
        zoneId: 'dadar',
        zoneName: 'Dadar Transit Core',
        type: 'hotel',
        totalRooms: 98,
        occupiedRooms: 86,
        availableRooms: 12,
        predictedCheckins: 20,
        pressure: 87,
        status: 'high',
        priceBand: '₹₹₹',
        pricePerNight: 7200,
        rating: 4.1,
        travelTimeToVenue: 20,
        transitAccessScore: 94,
        safetyScore: 90,
        crowdScore: 89,
        amenities: ['Station Proximity', 'Conference Room', 'Restaurant'],
        address: 'Swami Gyan Jivandas Marg, Dadar East',
        lat: 19.0195,
        lng: 72.8465
      },
      {
        id: 'acc_dadar_heritage',
        name: 'Dadar Heritage Guest House',
        zoneId: 'dadar',
        zoneName: 'Dadar Transit Core',
        type: 'guest_house',
        totalRooms: 45,
        occupiedRooms: 40,
        availableRooms: 5,
        predictedCheckins: 11,
        pressure: 88,
        status: 'high',
        priceBand: '₹₹',
        pricePerNight: 2800,
        rating: 4.0,
        travelTimeToVenue: 22,
        transitAccessScore: 92,
        safetyScore: 89,
        crowdScore: 87,
        amenities: ['Free Breakfast', 'Family Suites', 'AC'],
        address: 'Hindu Colony, Dadar East',
        lat: 19.0225,
        lng: 72.8495
      },

      // Churchgate & South Mumbai
      {
        id: 'acc_taj_mahal_palace',
        name: 'The Taj Mahal Palace & Tower',
        zoneId: 'churchgate',
        zoneName: 'Churchgate & Fort',
        type: 'hotel',
        totalRooms: 543,
        occupiedRooms: 460,
        availableRooms: 83,
        predictedCheckins: 75,
        pressure: 84,
        status: 'high',
        priceBand: '₹₹₹₹',
        pricePerNight: 24000,
        rating: 4.9,
        travelTimeToVenue: 34,
        transitAccessScore: 85,
        safetyScore: 99,
        crowdScore: 78,
        amenities: ['Harbour View', 'Historic Luxury', 'Butler Service'],
        address: 'Apollo Bunder, Colaba',
        lat: 18.9217,
        lng: 72.8332
      },
      {
        id: 'acc_oberoi_marine',
        name: 'The Oberoi Mumbai Marine Drive',
        zoneId: 'churchgate',
        zoneName: 'Churchgate & Fort',
        type: 'hotel',
        totalRooms: 337,
        occupiedRooms: 282,
        availableRooms: 55,
        predictedCheckins: 42,
        pressure: 83,
        status: 'watch',
        priceBand: '₹₹₹₹',
        pricePerNight: 22000,
        rating: 4.8,
        travelTimeToVenue: 30,
        transitAccessScore: 88,
        safetyScore: 98,
        crowdScore: 77,
        amenities: ['Oceanfront Suites', 'Heated Pool', 'Fine Dining'],
        address: 'Nariman Point, Marine Drive',
        lat: 18.9270,
        lng: 72.8210
      },
      {
        id: 'acc_fort_backpackers',
        name: 'Fort Central Youth Hostel',
        zoneId: 'churchgate',
        zoneName: 'Churchgate & Fort',
        type: 'hostel',
        totalRooms: 60,
        occupiedRooms: 46,
        availableRooms: 14,
        predictedCheckins: 18,
        pressure: 76,
        status: 'watch',
        priceBand: '₹',
        pricePerNight: 1400,
        rating: 4.1,
        travelTimeToVenue: 32,
        transitAccessScore: 90,
        safetyScore: 91,
        crowdScore: 79,
        amenities: ['Shared Dorms', 'Lockers', 'Luggage Storage'],
        address: 'Bora Bazar St, Fort',
        lat: 18.9370,
        lng: 72.8360
      },

      // Andheri
      {
        id: 'acc_lalit_andheri',
        name: 'The Lalit Mumbai',
        zoneId: 'andheri',
        zoneName: 'Andheri West & East',
        type: 'hotel',
        totalRooms: 369,
        occupiedRooms: 285,
        availableRooms: 84,
        predictedCheckins: 62,
        pressure: 77,
        status: 'watch',
        priceBand: '₹₹₹₹',
        pricePerNight: 12500,
        rating: 4.5,
        travelTimeToVenue: 18,
        transitAccessScore: 88,
        safetyScore: 94,
        crowdScore: 72,
        amenities: ['Airport Express Feeder', 'Atrium Lounge', 'Spa'],
        address: 'Sahar Airport Road, Andheri East',
        lat: 19.1065,
        lng: 72.8755
      },
      {
        id: 'acc_dragonfly_andheri',
        name: 'Dragonfly Boutique Hotel',
        zoneId: 'andheri',
        zoneName: 'Andheri West & East',
        type: 'hotel',
        totalRooms: 78,
        occupiedRooms: 59,
        availableRooms: 19,
        predictedCheckins: 22,
        pressure: 75,
        status: 'watch',
        priceBand: '₹₹₹',
        pricePerNight: 5500,
        rating: 4.2,
        travelTimeToVenue: 16,
        transitAccessScore: 86,
        safetyScore: 92,
        crowdScore: 71,
        amenities: ['Metro Line 1 Walk', 'Restaurant', 'Express Checkin'],
        address: 'Chakala, Andheri East',
        lat: 19.1170,
        lng: 72.8610
      },
      {
        id: 'acc_cohostel_andheri',
        name: 'Cohostel Versova Community Dorms',
        zoneId: 'andheri',
        zoneName: 'Andheri West & East',
        type: 'hostel',
        totalRooms: 50,
        occupiedRooms: 34,
        availableRooms: 16,
        predictedCheckins: 15,
        pressure: 68,
        status: 'watch',
        priceBand: '₹',
        pricePerNight: 1200,
        rating: 4.4,
        travelTimeToVenue: 25,
        transitAccessScore: 82,
        safetyScore: 88,
        crowdScore: 68,
        amenities: ['Rooftop Deck', 'Coffee Bar', 'Bike Rental'],
        address: 'JP Road, Versova, Andheri West',
        lat: 19.1350,
        lng: 72.8180
      },

      // Goregaon (Key Overflow zone)
      {
        id: 'acc_westin_goregaon',
        name: 'The Westin Mumbai Garden City',
        zoneId: 'goregaon',
        zoneName: 'Goregaon Hub',
        type: 'hotel',
        totalRooms: 269,
        occupiedRooms: 182,
        availableRooms: 87,
        predictedCheckins: 45,
        pressure: 67,
        status: 'watch',
        priceBand: '₹₹₹₹',
        pricePerNight: 13500,
        rating: 4.7,
        travelTimeToVenue: 26,
        transitAccessScore: 85,
        safetyScore: 96,
        crowdScore: 62,
        amenities: ['Direct Highway Link', 'Infinity Pool', 'Mall Access'],
        address: 'Oberoi Garden City, Goregaon East',
        lat: 19.1720,
        lng: 72.8620
      },
      {
        id: 'acc_radisson_goregaon',
        name: 'Radisson Mumbai Goregaon',
        zoneId: 'goregaon',
        zoneName: 'Goregaon Hub',
        type: 'hotel',
        totalRooms: 98,
        occupiedRooms: 62,
        availableRooms: 36,
        predictedCheckins: 25,
        pressure: 63,
        status: 'watch',
        priceBand: '₹₹₹',
        pricePerNight: 6800,
        rating: 4.3,
        travelTimeToVenue: 28,
        transitAccessScore: 84,
        safetyScore: 93,
        crowdScore: 61,
        amenities: ['SV Road Access', 'Buffet Breakfast', 'Soundproof Rooms'],
        address: 'S.V. Road, Goregaon West',
        lat: 19.1620,
        lng: 72.8450
      },
      {
        id: 'acc_nesco_buffer_dorms',
        name: 'Nesco Event Operations Reserve Dorms',
        zoneId: 'goregaon',
        zoneName: 'Goregaon Hub',
        type: 'dorm',
        totalRooms: 500,
        occupiedRooms: 150,
        availableRooms: 350,
        predictedCheckins: 80,
        pressure: 30,
        status: 'stable',
        priceBand: '₹',
        pricePerNight: 950,
        rating: 4.1,
        travelTimeToVenue: 22,
        transitAccessScore: 91,
        safetyScore: 94,
        crowdScore: 42,
        amenities: ['Emergency Readiness', 'Direct Shuttles to BKC', '24/7 Medical on site'],
        address: 'NESCO Hall 5 Annex, Goregaon East',
        lat: 19.1560,
        lng: 72.8565,
        isEmergencyBuffer: true
      },

      // Navi Mumbai (Buffer & Overflow Zone)
      {
        id: 'acc_vivanta_navi_mumbai',
        name: 'Vivanta Navi Mumbai Turbhe',
        zoneId: 'navi_mumbai',
        zoneName: 'Navi Mumbai (Vashi/Belapur)',
        type: 'hotel',
        totalRooms: 146,
        occupiedRooms: 68,
        availableRooms: 78,
        predictedCheckins: 25,
        pressure: 46,
        status: 'stable',
        priceBand: '₹₹₹',
        pricePerNight: 7500,
        rating: 4.6,
        travelTimeToVenue: 36,
        transitAccessScore: 84,
        safetyScore: 95,
        crowdScore: 44,
        amenities: ['Harbour Rail Link', 'Pool', 'Dedicated Event Shuttle'],
        address: 'Turbhe MIDC, Navi Mumbai',
        lat: 19.0712,
        lng: 73.0180
      },
      {
        id: 'acc_park_belapur',
        name: 'The Park Navi Mumbai',
        zoneId: 'navi_mumbai',
        zoneName: 'Navi Mumbai (Vashi/Belapur)',
        type: 'hotel',
        totalRooms: 80,
        occupiedRooms: 35,
        availableRooms: 45,
        predictedCheckins: 18,
        pressure: 43,
        status: 'stable',
        priceBand: '₹₹₹',
        pricePerNight: 6200,
        rating: 4.4,
        travelTimeToVenue: 40,
        transitAccessScore: 80,
        safetyScore: 94,
        crowdScore: 41,
        amenities: ['Lakeside View', 'Spa', 'Secure Parking'],
        address: 'CBD Belapur, Navi Mumbai',
        lat: 19.0180,
        lng: 73.0390
      },
      {
        id: 'acc_cidco_community_vashi',
        name: 'CIDCO Event Community Lodge & Stays',
        zoneId: 'navi_mumbai',
        zoneName: 'Navi Mumbai (Vashi/Belapur)',
        type: 'community_stay',
        totalRooms: 420,
        occupiedRooms: 170,
        availableRooms: 250,
        predictedCheckins: 60,
        pressure: 40,
        status: 'stable',
        priceBand: '₹',
        pricePerNight: 850,
        rating: 4.2,
        travelTimeToVenue: 34,
        transitAccessScore: 88,
        safetyScore: 92,
        crowdScore: 39,
        amenities: ['AC Hall Bedding', 'Locker System', 'Direct Vashi Shuttle'],
        address: 'Sector 30A, Vashi, Navi Mumbai',
        lat: 19.0640,
        lng: 72.9980
      },

      // Thane (Buffer Zone)
      {
        id: 'acc_fortune_thane',
        name: 'Fortune Park LakeCity Thane',
        zoneId: 'thane',
        zoneName: 'Thane Metropolitan',
        type: 'hotel',
        totalRooms: 120,
        occupiedRooms: 54,
        availableRooms: 66,
        predictedCheckins: 22,
        pressure: 45,
        status: 'stable',
        priceBand: '₹₹₹',
        pricePerNight: 5800,
        rating: 4.3,
        travelTimeToVenue: 42,
        transitAccessScore: 82,
        safetyScore: 93,
        crowdScore: 40,
        amenities: ['Eastern Freeway Link', 'Buffet', 'Gym'],
        address: 'Eastern Express Hwy, Thane West',
        lat: 19.2080,
        lng: 72.9730
      },
      {
        id: 'acc_upvan_stay_thane',
        name: 'Upvan Nature Stays & Guest Rooms',
        zoneId: 'thane',
        zoneName: 'Thane Metropolitan',
        type: 'guest_house',
        totalRooms: 65,
        occupiedRooms: 24,
        availableRooms: 41,
        predictedCheckins: 14,
        pressure: 37,
        status: 'stable',
        priceBand: '₹₹',
        pricePerNight: 2400,
        rating: 4.2,
        travelTimeToVenue: 46,
        transitAccessScore: 78,
        safetyScore: 94,
        crowdScore: 36,
        amenities: ['Lakeside Walking', 'Quiet Setting', 'Breakfast Included'],
        address: 'Upvan Lake, Thane West',
        lat: 19.2280,
        lng: 72.9600
      },

      // Virār & Vasai (High-Capacity Overflow Zone)
      {
        id: 'acc_virar_buffer_hub',
        name: 'Virār Northern Mega Overflow Complex',
        zoneId: 'virar',
        zoneName: 'Virār & Vasai Northern Buffer',
        type: 'dorm',
        totalRooms: 800,
        occupiedRooms: 210,
        availableRooms: 590,
        predictedCheckins: 90,
        pressure: 26,
        status: 'stable',
        priceBand: '₹',
        pricePerNight: 750,
        rating: 4.3,
        travelTimeToVenue: 58,
        transitAccessScore: 94, // Fast direct Western Railway local train every 10 min
        safetyScore: 92,
        crowdScore: 24,
        amenities: ['Western Railway Fast Link', 'Free Shuttle to Virar Station', 'Organized Clean Dorms', '24h Security'],
        address: 'Y.K. Nagar, Virar West',
        lat: 19.4650,
        lng: 72.8050,
        isEmergencyBuffer: true
      },
      {
        id: 'acc_vasai_heritage_resort',
        name: 'Vasai Fort Heritage Beachside Stays',
        zoneId: 'virar',
        zoneName: 'Virār & Vasai Northern Buffer',
        type: 'hotel',
        totalRooms: 180,
        occupiedRooms: 68,
        availableRooms: 112,
        predictedCheckins: 28,
        pressure: 38,
        status: 'stable',
        priceBand: '₹₹',
        pricePerNight: 2900,
        rating: 4.5,
        travelTimeToVenue: 52,
        transitAccessScore: 86,
        safetyScore: 95,
        crowdScore: 28,
        amenities: ['Coastal Atmosphere', 'Swimming Pool', 'Express Highway Transit'],
        address: 'Bhuigaon Beach, Vasai West',
        lat: 19.3620,
        lng: 72.7840
      },
      {
        id: 'acc_virar_transit_inn',
        name: 'Virār Station Junction Transit Inn',
        zoneId: 'virar',
        zoneName: 'Virār & Vasai Northern Buffer',
        type: 'hostel',
        totalRooms: 320,
        occupiedRooms: 110,
        availableRooms: 210,
        predictedCheckins: 45,
        pressure: 34,
        status: 'stable',
        priceBand: '₹',
        pricePerNight: 900,
        rating: 4.2,
        travelTimeToVenue: 56,
        transitAccessScore: 96,
        safetyScore: 91,
        crowdScore: 29,
        amenities: ['2 min from Virar Platform 1', 'Fast Express local stop', 'High Speed WiFi'],
        address: 'Station Road, Virar East',
        lat: 19.4540,
        lng: 72.8120
      },
    ];
  }

  // Calculate overflow recommendations ranked by efficiency, crowd score, price, and transit ease
  public getRankedOverflowOptions(providers: AccommodationProvider[], targetZonePressure = 91): OverflowRecommendation[] {
    const candidates = providers.filter(p => p.availableRooms > 15 && p.pressure < 60);

    const scored = candidates.map(provider => {
      const ease: 'Excellent' | 'Good' | 'Moderate' = 
        provider.transitAccessScore >= 90 ? 'Excellent' : 
        provider.transitAccessScore >= 80 ? 'Good' : 'Moderate';

      // Explainability note
      const crowdDiff = Math.max(0, targetZonePressure - provider.crowdScore);
      const note = `Recommended because ${provider.zoneName} has ${Math.round((provider.availableRooms / provider.totalRooms) * 100)}% available capacity and ${crowdDiff}% lower crowd pressure than central zones.`;

      // Scoring formula: higher available rooms, lower crowd score, higher safety, lower price, penalized slightly for extreme travel time
      const priceFactor = provider.priceBand === '₹' ? 30 : provider.priceBand === '₹₹' ? 20 : 10;
      const score = (
        (provider.availableRooms * 0.2) +
        ((100 - provider.crowdScore) * 0.35) +
        (provider.transitAccessScore * 0.25) +
        priceFactor -
        (provider.travelTimeToVenue * 0.3)
      );

      return {
        provider,
        rank: 0,
        score,
        availableBeds: provider.availableRooms,
        travelTimeMin: provider.travelTimeToVenue,
        crowdScore: provider.crowdScore,
        priceBand: provider.priceBand,
        transitEase: ease,
        safetyScore: provider.safetyScore,
        explainabilityNote: note
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  /**
   * Section 12 Accommodation Recommendation Flow:
   * Search query -> Nominatim -> Zone ID -> Providers -> Pressure & Route Time -> Ranked
   */
  public async searchAccommodationsWithOrchestration(
    query: string,
    allProviders: AccommodationProvider[],
    targetZoneIdDefault = 'bkc'
  ): Promise<{
    query: string;
    geocodedPlace: string;
    targetZoneId: string;
    ranked: OverflowRecommendation[];
    source: 'live' | 'cached' | 'demo';
  }> {
    const places = await nominatimApi.searchLocation(query);
    const primary = places[0];
    const targetZoneId = primary ? MapAdapter.matchZoneId(primary.lat, primary.lng) : targetZoneIdDefault;
    const ranked = this.getRankedOverflowOptions(allProviders, 90);

    return {
      query,
      geocodedPlace: primary ? primary.displayName : `${query}, Mumbai`,
      targetZoneId,
      ranked,
      source: primary ? primary.source : 'demo'
    };
  }
}

export const accommodationService = AccommodationService.getInstance();
