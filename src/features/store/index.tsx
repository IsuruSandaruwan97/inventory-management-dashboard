/** @format */

import { Card } from "antd";
import ItemTable from "./components/ItemTable";
import { StyleSheet } from "@configs/stylesheet";

const Store = () => {
  return (
    <>
      <Card>A</Card>
      <Card style={style.itemTableCard}>
        <ItemTable />
      </Card>
    </>
  );
};

export default Store;

const style = StyleSheet.create({
  itemTableCard: {
    marginTop: 8,
  },
});
