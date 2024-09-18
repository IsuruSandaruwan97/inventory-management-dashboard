import { Api } from '@configs/axios.config.ts';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockStatus, TStockSteps } from '@configs/types/api.types.ts';
import { TStockData } from '@features/stock/Inventory.tsx';
import { formatCurrency } from '@utils/index';

export const fetchStockItems = async (
  payload: TCommonFilters,
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
            itemList: item.ItemQuantity || [],
          };
        }) || [],
      total: response?.data?.data?.count || 0,
    };
  });
};
