import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters } from '@configs/types/api.types.ts';
import { formatCurrency } from '../../../utils';
import { TStockData } from '../Inventory.tsx';

export const fetchStockItems = async (payload: TCommonFilters): Promise<TStockData[]> => {
  return await Api.get(API_PATH.STOCK_ITEMS, { params: { ...payload } }).then((response) => {
    return (
      response?.data?.data?.map((item: any) => {
        return {
          itemId: item.code,
          name: item.name,
          image: item.image,
          category: item?.category?.name,
          subCategory: item?.sub_category?.name,
          description: item?.description || '-',
          quantity: item.quantity,
          reorderLevel: item?.reorder_level,
          unitPrice: formatCurrency(item.unit_price),
          totalPrice: item.unit_price && item.quantity ? formatCurrency(item.unit_price * item.quantity) : 0,
          status: item?.status,
          lastOrder: item.last_order,
        };
      }) || []
    );
  });
};
