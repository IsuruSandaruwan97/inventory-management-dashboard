import { TRole } from '@configs/types/api.types.ts';

export const DEFAULT_FILTERS = { from: null, limit: 10, page: 1, search: '', to: null };

export const DEFAULT_ROLE: TRole = 'user';

export const ROLES = {
  admin: [
    'Dashboard',
    'Stock',
    'Store',
    'Production',
    'Delivery',
    'Users',
    'settings',
    'Items',
    'Category',
    'Sub-Category',
    'Requests',
    'Inventory',
  ],
  user: [],
  store_manager: ['Store'],
  stock_manager: ['Stock'],
  delivery_manager: ['Delivery'],
  production_manager: ['Production'],
};
