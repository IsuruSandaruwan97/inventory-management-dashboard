import { Api } from '@configs/axios.config.ts';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters, TStockSteps } from '@configs/types/api.types.ts';
import { TStockData } from '@features/stock/Inventory.tsx';

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
            };
          }) || [],
        total: response?.data?.data?.count || 0,
      };
    }
  );
};
