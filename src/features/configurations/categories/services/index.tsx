import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants';
import { TProductsCategories } from '@features/configurations/configs/types';

export const fetchCategories = async (): Promise<TProductsCategories[]> => {
  return await Api.get(API_PATH.CATEGORIES).then((response) => {
    return (
      response?.data?.data?.map((item: any) => {
        return {
          id: item.id,
          code: item.code,
          name: item.name,
          status: item.status,
          type: item.type,
          createdBy: item.created_by,
          updatedBy: item.updated_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        };
      }) || []
    );
  });
};

export const createCategory = async (payload: TProductsCategories): Promise<void> => {
  return await Api.post(API_PATH.CATEGORIES, payload).then((response) => {
    return response?.data;
  });
};

export const updateCategory = async (payload: TProductsCategories): Promise<void> => {
  return await Api.put(API_PATH.CATEGORIES, payload).then((response) => {
    return response?.data;
  });
};
