import { http, HttpResponse } from 'msw';
import { WeatherObservation, CreateWeatherObservationRequest, WeatherFilters } from '@/types/weather';

const initialObservations: WeatherObservation[] = [
  {
    id: '1',
    datetime: new Date('2024-06-10T08:00:00').toISOString(),
    temperature: 22.5,
    weather: 'sunny',
    observerName: 'Иванов Иван Иванович',
    comment: 'Отличная погода для прогулки',
    createdAt: new Date('2024-06-10T08:05:00').toISOString(),
  },
  {
    id: '2',
    datetime: new Date('2024-06-11T14:30:00').toISOString(),
    temperature: 18.0,
    weather: 'cloudy',
    observerName: 'Петрова Анна Сергеевна',
    comment: 'Переменная облачность',
    createdAt: new Date('2024-06-11T14:35:00').toISOString(),
  },
  {
    id: '3',
    datetime: new Date('2024-06-12T09:15:00').toISOString(),
    temperature: 15.8,
    weather: 'overcast',
    observerName: 'Сидоров Петр Михайлович',
    comment: 'Возможен дождь',
    createdAt: new Date('2024-06-12T09:20:00').toISOString(),
  },
  {
    id: '4',
    datetime: new Date('2024-06-13T16:45:00').toISOString(),
    temperature: 25.3,
    weather: 'sunny',
    observerName: 'Johnson Smith',
    comment: 'Perfect weather conditions',
    createdAt: new Date('2024-06-13T16:50:00').toISOString(),
  },
  {
    id: '5',
    datetime: new Date('2024-06-14T11:20:00').toISOString(),
    temperature: 12.7,
    weather: 'overcast',
    observerName: 'Козлова Елена Андреевна',
    comment: '',
    createdAt: new Date('2024-06-14T11:25:00').toISOString(),
  },
];

let observations = [...initialObservations];

export const handlers = [
  http.get('/api/weather-observations', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') as WeatherFilters['sortBy'];
    const sortOrder = url.searchParams.get('sortOrder') as WeatherFilters['sortOrder'];

    let filteredObservations = [...observations];

    if (search) {
      filteredObservations = filteredObservations.filter(obs =>
        obs.observerName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy) {
      filteredObservations.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'datetime':
            aValue = new Date(a.datetime).getTime();
            bValue = new Date(b.datetime).getTime();
            break;
          case 'temperature':
            aValue = a.temperature;
            bValue = b.temperature;
            break;
          case 'observerName':
            aValue = a.observerName.toLowerCase();
            bValue = b.observerName.toLowerCase();
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return HttpResponse.json({
      observations: filteredObservations,
      total: filteredObservations.length,
    });
  }),

  http.post('/api/weather-observations', async ({ request }) => {
    const body = await request.json() as CreateWeatherObservationRequest;

    const newObservation: WeatherObservation = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString(),
    };

    observations.push(newObservation);

    return HttpResponse.json(newObservation, { status: 201 });
  }),
];