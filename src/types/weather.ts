export type WeatherType = 'sunny' | 'cloudy' | 'overcast';

export const WEATHER_OPTIONS: Record<WeatherType, string> = {
  sunny: 'Солнечно',
  cloudy: 'Облачно',
  overcast: 'Пасмурно',
} as const;

export interface WeatherObservation {
  id: string;
  datetime: string;
  temperature: number;
  weather: WeatherType;
  observerName: string;
  comment: string;
  createdAt: string;
}

export interface CreateWeatherObservationRequest {
  datetime: string;
  temperature: number;
  weather: WeatherType;
  observerName: string;
  comment: string;
}

export interface WeatherObservationsResponse {
  observations: WeatherObservation[];
  total: number;
}

export interface WeatherFilters {
  search?: string;
  sortBy?: 'datetime' | 'temperature' | 'observerName';
  sortOrder?: 'asc' | 'desc';
}
