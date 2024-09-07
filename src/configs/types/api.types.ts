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

export type TStockItems = {
  id: number;
  name?: string;
  image?: string;
  category?: number;
  sub_category?: number;
  description?: string;
  reorder_level?: number;
  unit_price?: number;
  last_order?: Date;
  quantity?: number;
};

export type TStockSteps = 'store' | 'production' | 'delivery' | 'damage' | 'return' | 'stock';
