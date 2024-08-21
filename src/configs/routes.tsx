/** @format */

import Dashboard from "@features/dashboard";
import Stock from "@features/stock";

import {
  AreaChartOutlined,
  BarsOutlined,
  PartitionOutlined,
  ShopOutlined,
  StockOutlined,
  SyncOutlined,
  TruckOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { ReactNode } from "react";

const defaultIconStyle = { fontSize: 20 };

type TRoutes = {
  name: string;
  path: string;
  icon?: ReactNode;
  component?: ReactNode;
};

export const PATH = {
  DASHBOARD: "/dashboard",
  STOCK: "/stock",
  PRODUCTION: "/production",
  STORE: "/store",
  USERS: "/users",
  CATEGORIES: "/categories",
  DELIVERY: "/delivery",
  SUB_CATEGORIES: "/sub-categories",
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
  },
  {
    name: "Store",
    path: PATH.STORE,
    icon: <ShopOutlined style={defaultIconStyle} />,
  },
  {
    name: "Production",
    path: PATH.PRODUCTION,
    icon: <SyncOutlined style={defaultIconStyle} />,
  },
  {
    name: "Delivery",
    path: PATH.DELIVERY,
    icon: <TruckOutlined style={defaultIconStyle} />,
  },
  {
    name: "Users",
    path: PATH.USERS,
    icon: <UsergroupAddOutlined style={defaultIconStyle} />,
  },
  {
    name: "Category",
    path: PATH.CATEGORIES,
    icon: <BarsOutlined style={defaultIconStyle} />,
  },
  {
    name: "Sub-Category",
    path: PATH.SUB_CATEGORIES,
    icon: <PartitionOutlined style={defaultIconStyle} />,
  },
];
