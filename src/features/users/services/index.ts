import { Api } from '@configs/axios.config.ts';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TCommonFilters } from '@configs/types/api.types.ts';

export const fetchUsers = async (payload: TCommonFilters): Promise<{ records: any; total: number }> => {
  return await Api.get(API_PATH.USERS, { params: { ...payload } }).then((response) => {
    return {
      records: response.data?.data?.records?.map((user: any) => {
        return {
          empId: user.emp_id,
          name: user.name,
          mobile: user.mobile,
          status: user.status,
          role: user.role,
          address: user.address,
        };
      }),
      total: response?.data?.data?.count || 0,
    };
  });
};
