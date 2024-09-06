import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockItems } from '@configs/types/api.types.ts';
import { formatCurrency } from '../../../utils';
import { TStockData } from '../Inventory.tsx';

export const fetchStockItems = async (payload: TCommonFilters): Promise<{ records: TStockData[]; total: number }> => {
  return await Api.get(API_PATH.STOCK_ITEMS, { params: { ...payload } }).then((response) => {
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
            reorderLevel: item?.reorder_level,
            unitPrice: formatCurrency(item.unit_price),
            totalPrice: item.unit_price && item.quantity ? formatCurrency(item.unit_price * item.quantity) : 0,
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
