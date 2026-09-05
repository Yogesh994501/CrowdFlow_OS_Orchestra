/**
 * Open-Meteo Weather API Client for CrowdFlow OS
 * Fetches real-time weather & 24h hourly forecast for Mumbai coordinates
 * Zero API keys, 15-minute caching, graceful fallback to historical event scenario weather
 */

export interface RawOpenMeteoResponse {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
}

class OpenMeteoApiClient {
  private cache: { data: RawOpenMeteoResponse; timestamp: number } | null = null;
  private readonly CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins
  private readonly MUMBAI_LAT = 19.0760;
  private readonly MUMBAI_LNG = 72.8777;
  private readonly TIMEOUT_MS = 4500;

  async fetchMumbaiWeather(): Promise<{ raw: RawOpenMeteoResponse | null; source: 'live' | 'cached' | 'demo' }> {
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_TTL_MS) {
      return { raw: this.cache.data, source: 'cached' };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.MUMBAI_LAT}&longitude=${this.MUMBAI_LNG}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata&forecast_days=1`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data: RawOpenMeteoResponse = await response.json();
        this.cache = { data, timestamp: Date.now() };
        return { raw: data, source: 'live' };
      }
    } catch {
      // Fallback
    }

    return { raw: null, source: 'demo' };
  }
}

export const openMeteoApi = new OpenMeteoApiClient();
