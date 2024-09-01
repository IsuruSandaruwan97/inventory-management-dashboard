/** @format */

import { ToastContext } from '@configs/context/ToastContext';
import { useContext } from 'react';

export const useToastApi = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToastApi must be used within a MessageProvider');

  return context.messageApi;
};
