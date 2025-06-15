import { TableContainerStyled } from '@/components/weather/Weather.style';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetWeatherObservationsQuery } from '@/store/api';
import { WEATHER_OPTIONS, WeatherFilters } from '@/types/weather';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ThermostatOutlined as TempIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';

interface WeatherObservationsTableProps {
  filters: WeatherFilters;
  onFiltersChange: (filters: WeatherFilters) => void;
  onAddObservation: () => void;
}

const getWeatherChipColor = (weather: string) => {
  switch (weather) {
    case 'sunny':
      return 'warning';
    case 'cloudy':
      return 'info';
    case 'overcast':
      return 'default';
    default:
      return 'default';
  }
};

const formatTemperature = (temp: number) => {
  return `${temp > 0 ? '+' : ''}${temp}°C`;
};

export const WeatherObservationTable: React.FC<WeatherObservationsTableProps> = ({
  filters,
  onFiltersChange,
  onAddObservation,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  React.useEffect(() => {
    onFiltersChange({
      ...filters,
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch]);

  const { data, isLoading, error } = useGetWeatherObservationsQuery({
    ...filters,
    search: debouncedSearch || undefined,
  });

  const handleSort = (column: WeatherFilters['sortBy']) => {
    const isCurrentColumn = filters.sortBy === column;
    const newOrder = isCurrentColumn && filters.sortOrder === 'asc' ? 'desc' : 'asc';

    onFiltersChange({
      ...filters,
      sortBy: column,
      sortOrder: newOrder,
    });
  };

  if (error) {
    return (
      <Alert severity="error">Ошибка при загрузке данных. Попробуйте обновить страницу.</Alert>
    );
  }

  return (
    <div>
      <Box className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <TextField
          placeholder="Поиск по ФИО наблюдателя..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          className="min-w-[300px] flex-grow max-w-[400px]"
          size="small"
        />

        <Button variant="contained" startIcon={<AddIcon />} onClick={onAddObservation} size="large">
          Добавить наблюдение
        </Button>
      </Box>

      <TableContainerStyled component={Paper} className="custom-scrollbar">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'datetime'}
                  direction={filters.sortBy === 'datetime' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('datetime')}>
                  Дата и время
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'temperature'}
                  direction={filters.sortBy === 'temperature' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('temperature')}>
                  Температура
                </TableSortLabel>
              </TableCell>

              <TableCell>Погода</TableCell>

              <TableCell>
                <TableSortLabel
                  active={filters.sortBy === 'observerName'}
                  direction={filters.sortBy === 'observerName' ? filters.sortOrder : 'asc'}
                  onClick={() => handleSort('observerName')}>
                  ФИО наблюдателя
                </TableSortLabel>
              </TableCell>

              <TableCell>Комментарий</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <CircularProgress />
                  <Typography variant="body2" className="mt-2">
                    Загрузка данных...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : data?.observations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Typography variant="body2" className="text-gray-600">
                    {searchInput
                      ? 'По вашему запросу ничего не найдено'
                      : 'Нет данных для отображения'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data?.observations.map((observation) => (
                <TableRow key={observation.id} hover>
                  <TableCell>{dayjs(observation.datetime).format('DD.MM.YYYY, HH:mm')}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TempIcon className="text-gray-500" fontSize="small" />
                      <span
                        className={`font-medium ${
                          observation.temperature > 0 ? 'text-orange-600' : 'text-blue-600'
                        }`}>
                        {formatTemperature(observation.temperature)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={WEATHER_OPTIONS[observation.weather]}
                      color={getWeatherChipColor(observation.weather) as never}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{observation.observerName}</Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      className="text-gray-600 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                      title={observation.comment}>
                      {observation.comment || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainerStyled>

      {data && data.observations.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <Typography variant="body2" className="text-gray-600">
            Показано {data.observations.length} из {data.total} записей
          </Typography>
        </div>
      )}
    </div>
  );
};
