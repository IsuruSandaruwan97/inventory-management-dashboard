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
