/** @format */

import { ReactNode } from "react";

export type TITEM_PROGRESS_COUNTS = {
  title: string;
  value: number;
  diff: number;
  icon?: ReactNode;
};

export const ITEM_PROGRESS_COUNTS: TITEM_PROGRESS_COUNTS[] = [
  { title: "Items in Production", value: 1000, diff: 10, icon: "" },
  { title: "Items Completed", value: 100, diff: 100, icon: "" },
  { title: "Items Pending", value: 100, diff: 10, icon: "" },
];

export const PRODUCTION_DATA = [
  {
    key: "1",
    id: "001",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "500ml Water Bottle",
    category: "Drinking Water",
    subCategory: "Small Size",
    quantity: 250,
  },
  {
    key: "2",
    id: "002",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "1L Water Bottle",
    category: "Drinking Water",
    subCategory: "Medium Size",
    quantity: 180,
  },
  {
    key: "3",
    id: "003",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "19L Water Bottle",
    category: "Drinking Water",
    subCategory: "Large Size",
    quantity: 60,
  },
  {
    key: "4",
    id: "004",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "500ml Sparkling Water",
    category: "Sparkling Water",
    subCategory: "Small Size",
    quantity: 120,
  },
  {
    key: "5",
    id: "005",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "1L Sparkling Water",
    category: "Sparkling Water",
    subCategory: "Medium Size",
    quantity: 90,
  },
  {
    key: "6",
    id: "006",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "19L Sparkling Water",
    category: "Sparkling Water",
    subCategory: "Large Size",
    quantity: 30,
  },
  {
    key: "7",
    id: "007",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "500ml Flavored Water - Lemon",
    category: "Flavored Water",
    subCategory: "Small Size",
    quantity: 200,
  },
  {
    key: "8",
    id: "008",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "1L Flavored Water - Lemon",
    category: "Flavored Water",
    subCategory: "Medium Size",
    quantity: 150,
  },
  {
    key: "9",
    id: "009",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "500ml Flavored Water - Peach",
    category: "Flavored Water",
    subCategory: "Small Size",
    quantity: 220,
  },
  {
    key: "10",
    id: "010",
    image:
      "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    name: "1L Flavored Water - Peach",
    category: "Flavored Water",
    subCategory: "Medium Size",
    quantity: 140,
  },
];
