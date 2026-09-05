import type { WeatherData, WeatherHourlyData } from '../types/weather';
export type { WeatherData } from '../types/weather';

export class WeatherService {
  private static instance: WeatherService;
  private cachedWeather: WeatherData | null = null;
  private lastFetchTime = 0;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  // Mumbai coordinates: lat 19.0760, lng 72.8777
  public async getMumbaiWeather(): Promise<WeatherData> {
    const now = Date.now();
    // Cache for 60 seconds locally within service
    if (this.cachedWeather && now - this.lastFetchTime < 60000) {
      return this.cachedWeather;
    }

    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m&hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m&timezone=Asia%2FKolkata&forecast_days=1',
        { signal: AbortSignal.timeout(3500) }
      );

      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}`);
      }

      const data = await response.json();
      const temp = Math.round(data.current?.temperature_2m ?? 31);
      const rain = data.current?.rain ?? 0;
      const precip = data.current?.precipitation ?? 0;
      const wind = Math.round(data.current?.wind_speed_10m ?? 14);
      const humidity = Math.round(data.current?.relative_humidity_2m ?? 75);

      // Deterministic risk calculation
      let risk = 15;
      if (rain > 5 || precip > 5) risk += 50;
      else if (rain > 0.5 || precip > 0.5) risk += 25;
      if (wind > 35) risk += 25;
      else if (wind > 20) risk += 10;
      if (temp > 35) risk += 10;

      const riskScore = Math.min(100, risk);
      const condition = rain > 5 ? 'Heavy Monsoon Shower' : rain > 0 ? 'Passing Rain' : temp > 33 ? 'Hot & Humid' : 'Partly Cloudy';
      const advisoryText = riskScore > 70 
        ? 'Heavy monsoon influx detected. Surface walking routes degraded; rail headways monitored.' 
        : riskScore > 40 
          ? 'Intermittent coastal showers across central Mumbai transit corridors.'
          : 'Optimal operational conditions across all 8 zones.';

      const hourly: WeatherHourlyData[] = (data.hourly?.time || []).slice(0, 8).map((t: string, idx: number) => {
        const timeStr = t.includes('T') ? t.split('T')[1].slice(0, 5) : t;
        const prob = data.hourly?.precipitation_probability?.[idx] ?? (precip > 0 ? 65 : 20);
        const pMm = data.hourly?.precipitation?.[idx] ?? precip;
        const wKmh = data.hourly?.wind_speed_10m?.[idx] ?? wind;
        return {
          time: timeStr,
          tempC: Math.round(data.hourly?.temperature_2m?.[idx] ?? temp),
          precipitationMm: pMm,
          rainProbabilityPct: prob,
          weatherRiskScore: Math.min(100, Math.round(15 + prob * 0.5 + pMm * 2)),
          windSpeedKmh: wKmh,
        };
      });

      this.cachedWeather = {
        timestamp: new Date().toISOString(),
        temperature: temp,
        precipitationProbability: data.hourly?.precipitation_probability?.[0] ?? (precip > 0 ? 70 : 25),
        precipitation: precip,
        windSpeed: wind,
        weatherRisk: riskScore,
        advisoryText,
        hourly,
        source: 'live',
        lastUpdated: new Date().toLocaleTimeString(),
        latitude: 19.0760,
        longitude: 72.8777,
        condition,
        weatherRiskScore: riskScore,
        rainProbability: data.hourly?.precipitation_probability?.[0] ?? (precip > 0 ? 70 : 25),
        precipitationMm: precip,
        windSpeedKmh: wind,
        rain,
        humidity,
      };
      this.lastFetchTime = now;
      return this.cachedWeather;
    } catch {
      // Safe realistic fallback for Mumbai event day
      return this.getFallbackWeather();
    }
  }

  public getFallbackWeather(conditionOverride?: 'clear' | 'light_rain' | 'heavy_rain'): WeatherData {
    const defaultHourly: WeatherHourlyData[] = [
      { time: '17:00', tempC: 30, precipitationMm: 1.2, rainProbabilityPct: 35, weatherRiskScore: 32, windSpeedKmh: 16 },
      { time: '18:00', tempC: 29, precipitationMm: 4.2, rainProbabilityPct: 55, weatherRiskScore: 48, windSpeedKmh: 18 },
      { time: '19:00', tempC: 28, precipitationMm: 9.8, rainProbabilityPct: 78, weatherRiskScore: 74, windSpeedKmh: 24 },
      { time: '20:00', tempC: 28, precipitationMm: 12.4, rainProbabilityPct: 82, weatherRiskScore: 82, windSpeedKmh: 26 },
      { time: '21:00', tempC: 27, precipitationMm: 6.0, rainProbabilityPct: 60, weatherRiskScore: 54, windSpeedKmh: 20 },
      { time: '22:00', tempC: 27, precipitationMm: 2.1, rainProbabilityPct: 40, weatherRiskScore: 38, windSpeedKmh: 15 },
    ];

    if (conditionOverride === 'heavy_rain') {
      return {
        timestamp: new Date().toISOString(),
        temperature: 28,
        precipitationProbability: 85,
        precipitation: 18.5,
        windSpeed: 38,
        humidity: 92,
        weatherRisk: 85,
        advisoryText: 'Monsoon deluge warning. Suburban rail headways extended by 6-10 min.',
        hourly: defaultHourly.map(h => ({ ...h, rainProbabilityPct: 85, weatherRiskScore: 85, precipitationMm: 18.5 })),
        condition: 'Intense Monsoon Downpour',
        source: 'demo',
        lastUpdated: new Date().toLocaleTimeString(),
        latitude: 19.0760,
        longitude: 72.8777,
        weatherRiskScore: 85,
        rainProbability: 85,
        precipitationMm: 18.5,
        windSpeedKmh: 38,
        rain: 18.5,
      };
    }

    if (conditionOverride === 'light_rain') {
      return {
        timestamp: new Date().toISOString(),
        temperature: 30,
        precipitationProbability: 55,
        precipitation: 3.2,
        windSpeed: 22,
        humidity: 84,
        weatherRisk: 45,
        advisoryText: 'Intermittent coastal showers across central Mumbai transit corridors.',
        hourly: defaultHourly,
        condition: 'Intermittent Coastal Showers',
        source: 'demo',
        lastUpdated: new Date().toLocaleTimeString(),
        latitude: 19.0760,
        longitude: 72.8777,
        weatherRiskScore: 45,
        rainProbability: 55,
        precipitationMm: 3.2,
        windSpeedKmh: 22,
        rain: 3.2,
      };
    }

    return {
      timestamp: new Date().toISOString(),
      temperature: 31,
      precipitationProbability: 20,
      precipitation: 0.0,
      windSpeed: 16,
      humidity: 72,
      weatherRisk: 22,
      advisoryText: 'Normal weather across Greater Mumbai. Gate and concourse movement optimal.',
      hourly: defaultHourly.map(h => ({ ...h, rainProbabilityPct: 20, weatherRiskScore: 22, precipitationMm: 0 })),
      condition: 'Tropical Humid & Clear',
      source: 'demo',
      lastUpdated: new Date().toLocaleTimeString(),
      latitude: 19.0760,
      longitude: 72.8777,
      weatherRiskScore: 22,
      rainProbability: 20,
      precipitationMm: 0,
      windSpeedKmh: 16,
      rain: 0,
    };
  }
}

export const weatherService = WeatherService.getInstance();
