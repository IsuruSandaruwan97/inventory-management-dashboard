/** @format */

import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React, { createContext } from 'react';

export const ToastContext = createContext<{
  messageApi: MessageInstance;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <ToastContext.Provider value={{ messageApi }}>
      {contextHolder}
      {children}
    </ToastContext.Provider>
  );
};
