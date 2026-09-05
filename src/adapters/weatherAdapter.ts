import type { WeatherData, HourlyForecast } from '../types/weather';
import type { RawOpenMeteoResponse } from '../services/api/openMeteoApi';

export class WeatherAdapter {
  /**
   * Deterministically calculate Weather Risk Score (0 - 100)
   * Clear: 5 - 20, Light rain: 30 - 50, Heavy rain: 70 - 95
   */
  static calculateWeatherRiskScore(rainProb: number, precipMm: number, windSpeed: number): number {
    let base = 10;

    // Rain probability contribution (0 - 45 pts)
    base += Math.round((rainProb / 100) * 45);

    // Precipitation intensity contribution (0 - 35 pts)
    if (precipMm > 25) base += 35; // torrential monsoon
    else if (precipMm > 10) base += 25; // heavy rain
    else if (precipMm > 3) base += 15; // moderate rain
    else if (precipMm > 0.5) base += 8; // light drizzle

    // Wind speed contribution (0 - 15 pts)
    if (windSpeed > 45) base += 15;
    else if (windSpeed > 25) base += 8;

    return Math.min(100, Math.max(5, base));
  }

  /**
   * Determine human-readable condition text and advisory
   */
  static getWeatherCondition(code: number, rainProb: number): { condition: string; advisory: string } {
    if (rainProb > 75 || code >= 63) {
      return {
        condition: 'Heavy Monsoon Downpour',
        advisory: 'Heavy convective precipitation alert. Suburban railway headways extended by 4-8 mins. Covered queuing activated.'
      };
    }
    if (rainProb > 40 || (code >= 51 && code <= 61)) {
      return {
        condition: 'Scattered Monsoon Showers',
        advisory: 'Intermittent precipitation expected across Dadar and BKC corridors. Shuttles operating normally.'
      };
    }
    if (code === 0 || code === 1) {
      return {
        condition: 'Clear Coastal Skies',
        advisory: 'Optimal weather across Greater Mumbai. Normal crowd flow and outdoor gate throughput.'
      };
    }
    return {
      condition: 'Partly Cloudy & Humid',
      advisory: 'Humid conditions; ventilation protocols active at high-density indoor concourses.'
    };
  }

  /**
   * Transform raw Open-Meteo payload into normalized WeatherData
   */
  static normalizeOpenMeteoResponse(
    raw: RawOpenMeteoResponse | null,
    source: 'live' | 'cached' | 'demo'
  ): WeatherData {
    if (!raw || !raw.current) {
      // Fallback Mumbai Monsoon Baseline
      return {
        timestamp: new Date().toISOString(),
        temperature: 29.4,
        precipitationProbability: 55,
        precipitation: 4.2,
        windSpeed: 18.5,
        weatherRisk: 48,
        advisoryText: 'Monsoon inflow approaching south-central Mumbai. Transit diversion pre-alerts ready.',
        condition: 'Scattered Showers',
        rainProbability: 55,
        precipitationMm: 4.2,
        windSpeedKmh: 18.5,
        weatherRiskScore: 48,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'demo',
        latitude: 19.0760,
        longitude: 72.8777,
        hourly: [
          { time: '17:00', tempC: 30.1, precipitationMm: 1.2, rainProbabilityPct: 35, weatherRiskScore: 32, windSpeedKmh: 16 },
          { time: '18:00', tempC: 29.4, precipitationMm: 4.2, rainProbabilityPct: 55, weatherRiskScore: 48, windSpeedKmh: 18 },
          { time: '19:00', tempC: 28.6, precipitationMm: 9.8, rainProbabilityPct: 78, weatherRiskScore: 74, windSpeedKmh: 24 },
          { time: '20:00', tempC: 28.0, precipitationMm: 12.4, rainProbabilityPct: 82, weatherRiskScore: 82, windSpeedKmh: 26 },
          { time: '21:00', tempC: 27.8, precipitationMm: 6.0, rainProbabilityPct: 60, weatherRiskScore: 54, windSpeedKmh: 20 },
          { time: '22:00', tempC: 27.5, precipitationMm: 2.1, rainProbabilityPct: 40, weatherRiskScore: 38, windSpeedKmh: 15 }
        ]
      };
    }

    const current = raw.current;
    const rainProb = raw.hourly?.precipitation_probability?.[0] ?? (current.precipitation > 0 ? 70 : 20);
    const riskScore = WeatherAdapter.calculateWeatherRiskScore(
      rainProb,
      current.precipitation,
      current.wind_speed_10m
    );
    const { condition, advisory } = WeatherAdapter.getWeatherCondition(current.weather_code, rainProb);

    const hourly: HourlyForecast[] = (raw.hourly?.time || []).slice(0, 8).map((t, idx) => {
      const timeStr = t.includes('T') ? t.split('T')[1].slice(0, 5) : t;
      const prob = raw.hourly?.precipitation_probability?.[idx] ?? 30;
      const precip = raw.hourly?.precipitation?.[idx] ?? 0;
      const wind = raw.hourly?.wind_speed_10m?.[idx] ?? 15;
      return {
        time: timeStr,
        tempC: raw.hourly?.temperature_2m?.[idx] ?? current.temperature_2m,
        precipitationMm: precip,
        rainProbabilityPct: prob,
        weatherRiskScore: WeatherAdapter.calculateWeatherRiskScore(prob, precip, wind),
        windSpeedKmh: wind
      };
    });

    return {
      timestamp: new Date().toISOString(),
      temperature: Math.round(current.temperature_2m * 10) / 10,
      precipitationProbability: rainProb,
      precipitation: current.precipitation,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherRisk: riskScore,
      advisoryText: advisory,
      condition,
      rainProbability: rainProb,
      precipitationMm: current.precipitation,
      windSpeedKmh: Math.round(current.wind_speed_10m),
      weatherRiskScore: riskScore,
      lastUpdated: new Date().toLocaleTimeString(),
      source,
      hourly,
      latitude: 19.0760,
      longitude: 72.8777,
      rain: current.precipitation,
      humidity: current.relative_humidity_2m
    };
  }
}
