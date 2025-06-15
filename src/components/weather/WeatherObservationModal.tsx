import { WeatherObservationFormData } from '@/schemas/weather';
import { useCreateWeatherObservationMutation } from '@/store/api';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import React from 'react';
import { WeatherObservationForm } from './WeatherObservationForm';

interface WeatherObservationModalProps {
  open: boolean;
  onClose: () => void;
}

export const WeatherObservationModal: React.FC<WeatherObservationModalProps> = ({
  open,
  onClose,
}) => {
  const [createObservation, { isLoading, error }] = useCreateWeatherObservationMutation();

  const handleSubmit = async (data: WeatherObservationFormData) => {
    try {
      await createObservation({
        datetime: data.datetime.toISOString(),
        temperature: data.temperature,
        weather: data.weather,
        observerName: data.observerName,
        comment: data.comment || '',
      }).unwrap();

      onClose();
    } catch (err) {
      console.error('Failed to create observation:', err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'rounded-lg',
      }}>
      <DialogTitle className="pb-2">
        <Box className="flex justify-between items-center">
          <div>
            <Typography variant="h6" component="div">
              Добавить наблюдение
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Заполните данные о погодных условиях
            </Typography>
          </div>
          <IconButton
            aria-label="закрыть"
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent className="pt-4">
        {error && (
          <Alert severity="error" className="mb-4">
            Произошла ошибка при сохранении данных. Попробуйте еще раз.
          </Alert>
        )}

        <WeatherObservationForm onSubmit={handleSubmit} isLoading={isLoading} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
