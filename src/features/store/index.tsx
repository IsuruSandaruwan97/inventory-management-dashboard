/** @format */

import { Button, Card, Row, Segmented, Space } from "antd";
import ItemTable from "@features/store/components/ItemTable";
import { StyleSheet } from "@configs/stylesheet";
import { useState } from "react";
import ReturnItemsFormModal from "@features/store/components/forms/ReturnItemsForm";
const options = ["Store", "Delivery"];
const Store = () => {
  const [option, setOption] = useState<string>(options[0]);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  return (
    <>
      <Card>
        <Row style={styles.actionBar}>
          <Space>
            <Button>Add for Delivery</Button>
            <Button onClick={() => setShowReturnModal(true)}>
              Return Items
            </Button>
          </Space>
          <Segmented
            options={options}
            value={option}
            onChange={(value) => setOption(value)}
          />
        </Row>
      </Card>
      <Card style={styles.itemTableCard}>
        <ItemTable />
      </Card>
      {showReturnModal && (
        <ReturnItemsFormModal
          open={showReturnModal}
          onCancel={() => setShowReturnModal(false)}
        />
      )}
    </>
  );
};

export default Store;

const styles = StyleSheet.create({
  itemTableCard: {
    marginTop: 8,
  },
  actionBar: { justifyContent: "space-between" },
});
