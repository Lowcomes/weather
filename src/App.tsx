import { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { WeatherObservationTable } from '@/components/weather/WeatherObservationTable';
import { WeatherObservationModal } from '@/components/weather/WeatherObservationModal';
import { WeatherFilters } from '@/types/weather';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<WeatherFilters>({
    sortBy: 'datetime',
    sortOrder: 'desc',
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleFiltersChange = (newFilters: WeatherFilters) => {
    setFilters(newFilters);
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Paper elevation={1} className="p-6">
        <Box className="mb-6">
          <Typography variant="h4" component="h1" gutterBottom>
            Наблюдение за погодой
          </Typography>
          <Typography variant="subtitle1" className="text-gray-600">
            Система фиксирования погодных наблюдений
          </Typography>
        </Box>
        <WeatherObservationTable
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onAddObservation={handleOpenModal}
        />
        <WeatherObservationModal open={modalOpen} onClose={handleCloseModal} />
      </Paper>
    </Container>
  );
}

export default App;
