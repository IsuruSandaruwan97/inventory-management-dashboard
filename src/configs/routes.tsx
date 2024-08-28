/** @format */

import Dashboard from "@features/dashboard";
import Stock from "@features/stock/Requests";
import Users from "@features/users";
import Inventory from "@features/stock/Inventory";
import Production from "@features/production";
import Store from "@features/store";

import {
  AreaChartOutlined,
  SettingOutlined,
  ShopOutlined,
  StockOutlined,
  SyncOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";
import Delivery from "@features/delivery";

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
  DASHBOARD: "/dashboard",
  STOCK: "/stock",
  PRODUCTION: "/production",
  STORE: "/store",
  USERS: "/users",
  CATEGORIES: "/categories",
  DELIVERY: "/delivery",
  SUB_CATEGORIES: "/sub-categories",
  SETTINGS: "/settings",

  //Sub paths
  STOCK_REQUESTS: "/requests",
  INVENTORY: "/inventory",
};

export const ROUTES: TRoutes[] = [
  {
    name: "Dashboard",
    path: PATH.DASHBOARD,
    icon: <AreaChartOutlined style={defaultIconStyle} />,
    component: <Dashboard />,
  },
  {
    name: "Stock",
    path: PATH.STOCK,
    icon: <StockOutlined style={defaultIconStyle} />,
    component: <Stock />,
    children: [
      { key: PATH.STOCK_REQUESTS, label: "Requests", element: <Stock /> },
      { key: PATH.INVENTORY, label: "Inventory", element: <Inventory /> },
    ],
  },
  {
    name: "Store",
    path: PATH.STORE,
    icon: <ShopOutlined style={defaultIconStyle} />,
    component: <Store />,
  },
  {
    name: "Production",
    path: PATH.PRODUCTION,
    icon: <SyncOutlined style={defaultIconStyle} />,
    component: <Production />,
  },
  {
    name: "Delivery",
    path: PATH.DELIVERY,
    icon: <TruckOutlined style={defaultIconStyle} />,
    component: <Delivery />,
  },
  {
    name: "Users",
    path: PATH.USERS,
    icon: <UsergroupAddOutlined style={defaultIconStyle} />,
    component: <Users />,
  },
  {
    name: "settings",
    path: PATH.SETTINGS,
    icon: <SettingOutlined style={defaultIconStyle} />,
    children: [
      { key: PATH.CATEGORIES, label: "Category", element: <></> },
      { key: PATH.SUB_CATEGORIES, label: "Sub-Category", element: <></> },
    ],
  },
];
