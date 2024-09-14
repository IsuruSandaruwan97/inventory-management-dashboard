export type TProductsCategories = {
  id?: number;
  code: string;
  name: string;
  status: boolean;
  type: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProductSubCategories = {
  id: string;
  category: number;
  code: string;
  name: string;
  status: boolean;
  type?: string[];
};

export type TRecord = {
  id: number;
  request_id: string;
  item_id: number;
  quantity: number;
  note: string | null;
  remark: string | null;
  reject_reason: string | null;
  status: number;
  type: string;
  userId: string;
  user_role: number;
  createdAt: string;
  updatedAt: string | null;
  action_taken: string | null;
  action_date: string | null;
  stockItem: {
    name: string;
  };
};

export type TRequestItems = {
  request_id: string;
  status: string;
  date: string;
  description: string;
  note?: string;
  records: TRecord[];
};
