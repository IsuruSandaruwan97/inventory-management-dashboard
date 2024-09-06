import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants';
import { TProductSubCategories } from '@features/configurations/configs/types';

export const fetchSubCategories = async (id: number): Promise<TProductSubCategories[]> => {
  return await Api.get(`${API_PATH.SUB_CATEGORIES}/${id}`).then((response) => {
    return (
      response?.data?.data?.map((item: any) => {
        return {
          id: item.id,
          Category: item.Category,
          code: item.code,
          name: item.name,
          status: item.status,
        };
      }) || []
    );
  });
};

export const createSubCategory = async (payload: TProductSubCategories): Promise<void> => {
  return await Api.post(API_PATH.SUB_CATEGORIES, payload).then((response) => {
    return response?.data;
  });
};

export const updateSubCategory = async (payload: TProductSubCategories): Promise<void> => {
  return await Api.put(API_PATH.SUB_CATEGORIES, payload).then((response) => {
    return response?.data;
  });
};
