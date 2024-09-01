/** @format */
import {
  AreaChartOutlined,
  SettingOutlined,
  ShopOutlined,
  StockOutlined,
  SyncOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { lazy, ReactNode } from 'react';

const Dashboard = lazy(() => import('@features/dashboard'));
const Stock = lazy(() => import('@features/stock/Requests'));
const Users = lazy(() => import('@features/users'));
const Inventory = lazy(() => import('@features/stock/Inventory'));
const Production = lazy(() => import('@features/production'));
const Store = lazy(() => import('@features/store'));
const Delivery = lazy(() => import('@features/delivery'));

const Categories = lazy(() => import('@features/configurations/categories'));
const SubCategories = lazy(() => import('@features/configurations/subCategories'));

const defaultIconStyle = { fontSize: 20 };

type TChildren = {
  key: string;
  label: string;
  element: ReactNode;
};
export type TRoutes = {
  name: string;
  path: string;
  icon?: ReactNode;
  component?: ReactNode;
  children?: TChildren[];
};

export const PATH = {
  //Main paths
  DASHBOARD: '/dashboard',
  STOCK: '/stock',
  PRODUCTION: '/production',
  STORE: '/store',
  USERS: '/users',
  CATEGORIES: '/categories',
  DELIVERY: '/delivery',
  SUB_CATEGORIES: '/sub-categories',
  SETTINGS: '/settings',

  //Sub paths
  STOCK_REQUESTS: '/requests',
  INVENTORY: '/inventory',
};

export const ROUTES: TRoutes[] = [
  {
    name: 'Dashboard',
    path: PATH.DASHBOARD,
    icon: <AreaChartOutlined style={defaultIconStyle} />,
    component: <Dashboard />,
  },
  {
    name: 'Stock',
    path: PATH.STOCK,
    icon: <StockOutlined style={defaultIconStyle} />,
    children: [
      { key: PATH.STOCK_REQUESTS, label: 'Requests', element: <Stock /> },
      { key: PATH.INVENTORY, label: 'Inventory', element: <Inventory /> },
    ],
  },
  {
    name: 'Store',
    path: PATH.STORE,
    icon: <ShopOutlined style={defaultIconStyle} />,
    component: <Store />,
  },
  {
    name: 'Production',
    path: PATH.PRODUCTION,
    icon: <SyncOutlined style={defaultIconStyle} />,
    component: <Production />,
  },
  {
    name: 'Delivery',
    path: PATH.DELIVERY,
    icon: <TruckOutlined style={defaultIconStyle} />,
    component: <Delivery />,
  },
  {
    name: 'Users',
    path: PATH.USERS,
    icon: <UsergroupAddOutlined style={defaultIconStyle} />,
    component: <Users />,
  },
  {
    name: 'settings',
    path: PATH.SETTINGS,
    icon: <SettingOutlined style={defaultIconStyle} />,
    children: [
      { key: PATH.CATEGORIES, label: 'Category', element: <Categories /> },
      {
        key: PATH.SUB_CATEGORIES,
        label: 'Sub-Category',
        element: <SubCategories />,
      },
    ],
  },
];
