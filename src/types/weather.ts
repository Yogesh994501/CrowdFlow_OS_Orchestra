/**
 * Canonical Weather Data Type for CrowdFlow OS
 * Single source of truth for weather data across all adapters, services, and components.
 */

export type DataSourceMode = 'live' | 'cached' | 'demo' | 'unavailable';

export interface WeatherHourlyData {
  time: string;
  tempC: number;
  precipitationMm: number;
  rainProbabilityPct: number;
  weatherRiskScore: number; // 0 - 100
  windSpeedKmh: number;
}

// Backward compatibility alias for HourlyForecast
export type HourlyForecast = WeatherHourlyData;

export interface WeatherData {
  timestamp: string;

  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;

  weatherRisk: number; // 0 - 100
  advisoryText: string;

  hourly: WeatherHourlyData[];

  source: DataSourceMode;
  lastUpdated: string;

  latitude?: number;
  longitude?: number;

  // Backward-compatible properties used by UI & services
  condition: string;
  weatherRiskScore?: number;
  rainProbability?: number;
  precipitationMm?: number;
  windSpeedKmh?: number;
  rain?: number;
  humidity?: number;
}
