import { Api } from '@configs/axios.config.ts';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TCompleteItems, TStockSteps } from '@configs/types/api.types.ts';
import { TCompletedItems, TStockData } from '@features/stock/Inventory.tsx';

export const fetchProductionItems = async (
  payload: TCommonFilters,
  type?: TStockSteps
): Promise<{ records: TStockData[]; total: number }> => {
  return await Api.get(`${API_PATH.STOCK_ITEMS}${type ? `/${type}` : ''}`, { params: { ...payload } }).then(
    (response) => {
      return {
        records:
          response.data?.data?.records?.map((item: any) => {
            return {
              id: item.id,
              itemId: item.code,
              name: item.name,
              image: item.image,
              category: item?.itemCategory?.name,
              subCategory: item?.itemSubCategory?.name,
              description: item?.description || '-',
              quantity: item.quantity,
              createdAt: item.createdAt,
            };
          }) || [],
        total: response?.data?.data?.count || 0,
      };
    }
  );
};

export const requestItems = async (items: any): Promise<void> => {
  return await Api.post(API_PATH.REQUEST_ITEMS, { items }).then((response: any) => response?.data);
};

export const completeItems = async (item: TCompleteItems): Promise<void> => {
  return await Api.post(API_PATH.COMPLETE_ITEMS, item).then((response: any) => response?.data);
};

export const fetchCompletedItems = async (
  payload: TCommonFilters
): Promise<{ records: TCompletedItems[]; total: number }> => {
  return await Api.get(API_PATH.COMPLETED_ITEMS, { params: { ...payload } }).then((response) => ({
    records: response.data?.data?.records?.map((item: any) => ({
      ...item,
      name: item?.itemCategory?.name || '-',
      list: item?.item || [],
    })),
    total: response?.data?.data?.count || 0,
  }));
};
