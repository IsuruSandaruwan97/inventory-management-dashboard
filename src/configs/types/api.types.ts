export type TUserLoginRequest = {
  username: string;
  password: string;
};

export type TCommonFilters = {
  page: number;
  limit: number;
  from?: string | null;
  to?: string | null;
  search?: string | null;
};
