import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { store } from './store';
import App from './App';
import './index.css';

dayjs.locale('ru');

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const renderApp = () => {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
              <App />
            </LocalizationProvider>
          </ThemeProvider>
        </Provider>
      </React.StrictMode>,
    );
  }
};

if (typeof window !== 'undefined' && import.meta.env.DEV) {
  import('./mocks/browser')
    .then(async ({ worker }) => {
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      renderApp();
    })
    .catch((error) => {
      console.error('MSW initialization failed:', error);
    });
} else {
  renderApp();
}
