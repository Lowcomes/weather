import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Box,
  InputAdornment,
  Grid,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  ThermostatOutlined as TempIcon,
  PersonOutline as PersonIcon,
  CommentOutlined as CommentIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { weatherObservationSchema, WeatherObservationFormData } from '@/schemas/weather';
import { WEATHER_OPTIONS } from '@/types/weather';

interface WeatherObservationFormProps {
  onSubmit: (data: WeatherObservationFormData) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const WeatherObservationForm: React.FC<WeatherObservationFormProps> = ({
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<WeatherObservationFormData>({
    resolver: zodResolver(weatherObservationSchema),
    defaultValues: {
      datetime: dayjs(),
      temperature: undefined,
      weather: undefined,
      observerName: '',
      comment: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit = handleSubmit((data: WeatherObservationFormData) => {
    onSubmit(data);
    reset();
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <Paper elevation={0}>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="datetime"
              control={control}
              render={({ field: { value, onChange } }) => (
                <DateTimePicker
                  label="Дата и время наблюдения"
                  value={value}
                  onChange={(newValue: Dayjs | null) => onChange(newValue)}
                  format="DD.MM.YYYY HH:mm"
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.datetime,
                      helperText: errors.datetime?.message,
                      required: true,
                    },
                  }}
                  className="!mt-1"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="temperature"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Температура"
                  type="number"
                  value={value || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : parseFloat(val));
                  }}
                  onBlur={onBlur}
                  error={!!errors.temperature}
                  helperText={
                    errors.temperature?.message ||
                    'От -40°C до +40°C, не более 2 знаков после запятой'
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TempIcon color={errors.temperature ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                    endAdornment: <InputAdornment position="end">°C</InputAdornment>,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="weather"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl fullWidth error={!!errors.weather} required variant="outlined">
                  <InputLabel>Погодные условия</InputLabel>
                  <Select
                    variant={'standard'}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    label="Погодные условия">
                    {Object.entries(WEATHER_OPTIONS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.weather && <FormHelperText>{errors.weather.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="observerName"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="ФИО наблюдателя"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.observerName}
                  helperText={
                    errors.observerName?.message ||
                    'Только буквы кириллицы и латиницы, не более 40 символов'
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color={errors.observerName ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="comment"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  fullWidth
                  label="Комментарий"
                  multiline
                  rows={3}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.comment}
                  helperText={errors.comment?.message || `${value?.length || 0}/100 символов`}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className="self-start mt-2">
                        <CommentIcon color={errors.comment ? 'error' : 'action'} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<CancelIcon />}>
            Отмена
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isValid}
            startIcon={<SaveIcon />}>
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
