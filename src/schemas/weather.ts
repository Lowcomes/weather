import { z } from 'zod';
import { Dayjs } from 'dayjs';

const nameRegex = /^[a-zA-ZА-Яа-яЁё\s]+$/;

export const weatherObservationSchema = z.object({
  datetime: z.any().refine((val) => val && val.isValid && val.isValid(), {
    message: 'Дата и время обязательны',
  }),
  temperature: z
    .number({
      required_error: 'Температура обязательна',
      invalid_type_error: 'Температура должна быть числом',
    })
    .min(-40, 'Температура не может быть меньше -40°C')
    .max(40, 'Температура не может быть больше +40°C')
    .refine((val) => {
      const str = val.toString();
      const decimalPart = str.split('.')[1];
      return !decimalPart || decimalPart.length <= 2;
    }, 'Не более 2 знаков после запятой'),
  weather: z.enum(['sunny', 'cloudy', 'overcast'], {
    required_error: 'Выберите погодные условия',
  }),
  observerName: z
    .string({
      required_error: 'ФИО обязательно',
    })
    .min(1, 'ФИО не может быть пустым')
    .max(40, 'ФИО не может превышать 40 символов')
    .regex(nameRegex, 'ФИО может содержать только буквы кириллицы и латиницы'),
  comment: z
    .string()
    .max(100, 'Комментарий не может превышать 100 символов')
    .default(''),
});

export type WeatherObservationFormData = {
  datetime: Dayjs;
  temperature: number;
  weather: 'sunny' | 'cloudy' | 'overcast';
  observerName: string;
  comment: string;
};