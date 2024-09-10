import { Api } from '@configs/axios.config';
import { API_PATH } from '@configs/constants/api.constants.ts';
import { TUserLoginRequest } from '@configs/types/api.types.ts';

export const userLogin = async (payload: TUserLoginRequest) => {
  return await Api.post(API_PATH.LOGIN, payload).then((response) => {
    return response?.data?.data;
  });
};

export const userLogout = async () => {
  return await Api.get(API_PATH.LOGOUT);
};
