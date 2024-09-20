import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockItems } from '@configs/types/api.types.ts';
import { TStockData } from '../index.tsx';

export const fetchStockItems = async (payload: TCommonFilters): Promise<{ records: TStockData[]; total: number }> => {
  return await Api.get(API_PATH.STOCK_ITEMS, { params: { ...payload } }).then((response) => {
    return {
      records:
        response.data?.data?.records?.map((item: any) => {
          return {
            id: item.id,
            itemId: item.code,
            name: `${item?.itemCategory?.name ? `${item?.itemCategory?.name} - ` : ''}${item.name}`,
            image: item.image,
            category: item?.itemCategory?.name,
            description: item?.description || '-',
            reorderLevel: item?.reorder_level,
            updatedBy: item.updater?.name || '-',
            status: item?.status,
            availability: item.availability,
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
