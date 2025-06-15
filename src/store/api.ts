import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  WeatherObservation,
  CreateWeatherObservationRequest,
  WeatherObservationsResponse,
  WeatherFilters
} from '@/types/weather';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['WeatherObservation'],
  endpoints: (builder) => ({
    getWeatherObservations: builder.query<WeatherObservationsResponse, WeatherFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.search) {
          params.append('search', filters.search);
        }
        if (filters.sortBy) {
          params.append('sortBy', filters.sortBy);
        }
        if (filters.sortOrder) {
          params.append('sortOrder', filters.sortOrder);
        }

        return {
          url: '/weather-observations/',
          params,
        };
      },
      providesTags: ['WeatherObservation'],
    }),

    createWeatherObservation: builder.mutation<WeatherObservation, CreateWeatherObservationRequest>({
      query: (observation) => ({
        url: '/weather-observations',
        method: 'POST',
        body: observation,
      }),
      invalidatesTags: ['WeatherObservation'],
    }),
  }),
});

export const {
  useGetWeatherObservationsQuery,
  useCreateWeatherObservationMutation,
} = weatherApi;
