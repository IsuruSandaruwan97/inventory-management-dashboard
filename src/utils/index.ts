import { DEFAULT_CURRENCY } from '@configs/index';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { KEY_CODES } from '../configs/keycodes.ts';

export const randomPassword = (passwordLength: number = 12): string => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password: string = '';
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const findRouteByPath = (routes: any[], path: string): any => {
  const object = routes?.find((item) => {
    if (item.path === path) return item;
    if (item.children) {
      const subRoute = item.children?.find((subItem: any) => subItem.key === path);
      if (subRoute) return item;
    }
  });
  if (object) {
    const subDir = object?.children?.find((item: any) => item.key === path);
    return {
      main: { name: object?.name, path: object?.path },
      sub: subDir ? { name: subDir?.label, path: subDir?.key } : null,
    };
  }
  return undefined;
};

export const formatCurrency = (value: number | string, showSymbol: boolean = false): string => {
  if (typeof value === 'string') value = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
  })
    .format(value)
    .replace('LKR', showSymbol ? DEFAULT_CURRENCY : '');
};

export const getJwtData = (): any => {
  try {
    const token = localStorage.getItem(KEY_CODES.AUTH_TOKEN);

    if (!token) return null;
    return jwtDecode(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: any) {
    return null;
  }
};
