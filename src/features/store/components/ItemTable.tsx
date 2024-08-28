/** @format */

import Table from "@components/Table";
import { Space, TableProps } from "antd";

const columns: TableProps<any>["columns"] = [
  {
    title: "Item Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Quantity Available",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => <Space size="middle"></Space>,
  },
];
const ItemTable = () => {
  return (
    <>
      <Table columns={columns} dataSource={[]} />
    </>
  );
};

export default ItemTable;
