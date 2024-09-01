import QueryConfigProvider from '@configs/context/QueryConfigProvider.tsx';
import { ToastProvider } from '@configs/context/ToastContext.tsx';
import { theme } from '@configs/theme.config.ts';
import { ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

dayjs.extend(localizedFormat);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider theme={theme}>
        <QueryConfigProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QueryConfigProvider>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>
);
