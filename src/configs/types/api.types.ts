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
  code?: string;
  image?: string;
  category?: number;
  sub_category?: number;
  description?: string;
  reorder_level?: number;
  unit_price?: number;
  last_order?: Date;
  quantity?: number;
  status?: boolean;
};

export type TStockSteps = 'store' | 'production' | 'delivery' | 'damage' | 'return' | 'stock';

export type TStockStatus = 'pending' | 'completed' | 'return' | 'damaged';

export type TRole = 'admin' | 'user' | 'store_manager' | 'stock_manger' | 'production_manager' | 'delivery_manager';
