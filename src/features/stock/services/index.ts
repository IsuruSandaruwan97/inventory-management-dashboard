import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockItems, TStockSteps } from '@configs/types/api.types.ts';
import { formatCurrency } from '@utils/index.ts';
import { TStockData } from '../Inventory.tsx';

export const fetchStockItems = async (
  payload: TCommonFilters,
  type?: TStockSteps
): Promise<{ records: TStockData[]; total: number }> => {
  return await Api.get(`${API_PATH.STOCK}${type ? `/${type}` : ''}`, { params: { ...payload } }).then((response) => {
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
            quantity: item.quantity || 0,
            reorderLevel: item?.reorder_level,
            unitPrice: formatCurrency(item.unit_price),
            totalPrice: formatCurrency(item.total) || 0,
            status: item?.status,
            lastOrder: item.last_order,
          };
        }) || [],
      total: response?.data?.data?.count || 0,
    };
  });
};

export const updateStockItems = async (payload: TStockItems): Promise<void> => {
  return await Api.put(API_PATH.STOCK_ITEMS, payload).then((response) => {
    return response?.data;
  });
};
