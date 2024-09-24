import { Api } from '@configs/axios.config.ts';
import { API_PATH } from '@configs/constants/api.constants.ts';
import {
  TCommonFilters,
  TDefaultResponse,
  TMarkAsDamaged,
  TStockStatus,
  TStockSteps,
} from '@configs/types/api.types.ts';
import { TStockData } from '@features/stock/Inventory.tsx';
import { formatCurrency } from '@utils/index';

export const fetchStockItems = async (
  payload: (TCommonFilters & { category?: number | null }) | null,
  type: TStockSteps = 'stock',
  status: TStockStatus = 'pending'
): Promise<{ records: TStockData[]; total: number }> => {
  return await Api.get(`${API_PATH.STOCK}${type ? `/${type}` : ''}${status ? `/${status}` : ''}`, {
    params: { ...payload },
  }).then((response) => {
    return {
      records:
        response.data?.data?.records?.map((item: any) => {
          return {
            id: item.id,
            itemId: item.code,
            name: `${item?.itemCategory?.name ? `${item?.itemCategory?.name} - ` : ''}${item.name}`,
            image: item.image,
            type: item.type,
            category: item?.itemCategory?.name,
            description: item?.description || '-',
            quantity: item.quantity || 0,
            reorderLevel: item?.reorder_level,
            unitPrice: formatCurrency(item.unit_price),
            totalPrice: formatCurrency(item.total) || 0,
            status: item?.status,
            lastOrder: item.last_order,
            itemList: item.ItemQuantity || [],
          };
        }) || [],
      total: response?.data?.data?.count || 0,
    };
  });
};

export const getPendingReqCount = async (): Promise<number> => {
  return await Api.get(API_PATH.GET_REQ_COUNT).then((response) => response?.data.data || 0);
};

export const markDamageItems = async (payload: TMarkAsDamaged): Promise<TDefaultResponse> => {
  return await Api.put(API_PATH.MARK_DAMAGE_ITEMS, payload).then((response) => response?.data);
};
