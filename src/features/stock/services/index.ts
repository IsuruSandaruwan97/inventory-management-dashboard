import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockItems } from '@configs/types/api.types.ts';
import { TRequestItems } from '@features/configurations/configs/types';
import { TItem } from '@features/stock/components/forms/StockForm.tsx';

export const fetchItemRequests = async (
  params: TCommonFilters & { status: string }
): Promise<{ records: TRequestItems[]; count: number }> => {
  return await Api.get(API_PATH.TRANSACTIONS, { params }).then((response) => {
    return response?.data?.data || [];
  });
};

export const updateStockItems = async (payload: TStockItems): Promise<void> => {
  return await Api.put(API_PATH.STOCK, payload).then((response) => {
    return response?.data;
  });
};

export const insertStockItems = async (payload: TItem[]): Promise<void> => {
  return await Api.post(API_PATH.STOCK, { items: payload }).then((response) => {
    return response?.data;
  });
};

export const acceptRejectRequest = async (payload: {
  requestId: string;
  action: number;
  id?: number;
}): Promise<void> => {
  return await Api.put(API_PATH.ACCEPT_OR_REJECT_REQ, payload).then((response) => {
    return response?.data;
  });
};
