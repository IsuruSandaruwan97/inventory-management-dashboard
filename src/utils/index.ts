import { DEFAULT_CURRENCY } from '@configs/index';
import { KEY_CODES } from '@configs/keycodes.ts';
import { queryClient } from '@configs/react-query.config.ts';
import { TStockData } from '@features/stock/Inventory.tsx';
import CryptoJS from 'crypto-js';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
export const logout = () => {
  localStorage.removeItem(KEY_CODES.AUTH_TOKEN);
  localStorage.removeItem(KEY_CODES.PIN);
  localStorage.removeItem(KEY_CODES.REFRESH_TOKEN);
  queryClient.removeQueries();
  location.href = '/';
};

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

export const thousandSeparator = (value: string | number | null): string => {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '';
};

export const getJwtData = (token?: string | null): any => {
  try {
    token = token || localStorage.getItem(KEY_CODES.AUTH_TOKEN);

    if (!token) return null;
    return jwtDecode(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: any) {
    return null;
  }
};

export const validatePin = (code: string): boolean => {
  try {
    const pin = getJwtData().pin;
    if (!pin) return true;
    return String(pin) === code;
  } catch (e) {
    return true;
  }
};

export const encryptData = (data: any): string => {
  if (typeof data !== 'string') data = JSON.stringify(data);
  return CryptoJS.AES.encrypt(data, import.meta.env.VITE_SECRET).toString();
};

export const decryptData = (data: string): any => {
  const rememberBytes = CryptoJS.AES.decrypt(data, import.meta.env.VITE_SECRET).toString(CryptoJS.enc.Utf8);
  return JSON.parse(rememberBytes);
};

export const convertItemObject = (items: TStockData[] | any[], titleSelectable: boolean = false) => {
  console.log(items);
  const categorizedData = items.reduce((acc: any, current) => {
    const { category, id, name, label, value } = current;
    let categoryGroup = acc.find((group: any) => group.title === category);

    if (!categoryGroup) {
      categoryGroup = {
        title: category,
        value: category,
        selectable: titleSelectable,
        children: [],
      };
      acc.push(categoryGroup);
    }

    categoryGroup.children.push({ title: label || name, value: value || id });

    return acc;
  }, []);

  return categorizedData || [];
};
