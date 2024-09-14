import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TStockItems } from '@configs/types/api.types.ts';

export const updateStockItems = async (payload: TStockItems): Promise<void> => {
  return await Api.put(API_PATH.STOCK_ITEMS, payload).then((response) => {
    return response?.data;
  });
};

export const createStockItems = async (payload: TStockItems): Promise<void> => {
  return await Api.post(API_PATH.STOCK_ITEMS, payload).then((response) => {
    return response?.data;
  });
};

export const fetchItemDropdown = async (type: string): Promise<void> => {
  return await Api.get(`${API_PATH.STOCK_ITEMS}/list?type=${type}`).then((response) => {
    return response?.data?.data || [];
  });
};
