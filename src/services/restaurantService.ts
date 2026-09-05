import { RestaurantProvider } from '../types';

export class RestaurantService {
  private static instance: RestaurantService;

  public static getInstance(): RestaurantService {
    if (!RestaurantService.instance) {
      RestaurantService.instance = new RestaurantService();
    }
    return RestaurantService.instance;
  }

  public getInitialRestaurants(): RestaurantProvider[] {
    return [
      {
        id: 'rest_bkc_jio_concourse',
        name: 'Jio World Grand Concourse Dining Hub',
        zoneId: 'bkc',
        seatingCapacity: 1400,
        currentOccupied: 1290,
        queueTimeMin: 28,
        peakForecast: '18:15 - 20:30',
        mealInventoryPacks: 3400,
        status: 'critical'
      },
      {
        id: 'rest_bkc_artisan',
        name: 'G-Block Artisan Bistro & Lounge Cluster',
        zoneId: 'bkc',
        seatingCapacity: 450,
        currentOccupied: 410,
        queueTimeMin: 35,
        peakForecast: '18:45 - 21:00',
        mealInventoryPacks: 1100,
        status: 'critical'
      },
      {
        id: 'rest_dadar_udupi_hub',
        name: 'Shivaji Park Heritage Dining & Udupi Concourse',
        zoneId: 'dadar',
        seatingCapacity: 650,
        currentOccupied: 520,
        queueTimeMin: 18,
        peakForecast: '19:00 - 21:15',
        mealInventoryPacks: 2200,
        status: 'high'
      },
      {
        id: 'rest_goregaon_nesco_village',
        name: 'NESCO Food Village & Food Trucks Hub',
        zoneId: 'goregaon',
        seatingCapacity: 950,
        currentOccupied: 480,
        queueTimeMin: 8,
        peakForecast: '17:30 - 19:00',
        mealInventoryPacks: 4500,
        status: 'stable'
      },
      {
        id: 'rest_churchgate_promenade',
        name: 'Marine Drive Coastal Pavilion Dining',
        zoneId: 'churchgate',
        seatingCapacity: 500,
        currentOccupied: 380,
        queueTimeMin: 15,
        peakForecast: '17:00 - 18:30',
        mealInventoryPacks: 1600,
        status: 'watch'
      },
      {
        id: 'rest_navi_mumbai_cidco',
        name: 'CIDCO Vashi Regional Food Concourse',
        zoneId: 'navi_mumbai',
        seatingCapacity: 800,
        currentOccupied: 290,
        queueTimeMin: 4,
        peakForecast: '19:30 - 21:00',
        mealInventoryPacks: 5200,
        status: 'stable'
      }
    ];
  }
}

export const restaurantService = RestaurantService.getInstance();
