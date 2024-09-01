/** @format */

import { StyleSheet } from '@configs/stylesheet';
import InvoiceModal from '@features/stock/components/InvoiceModal';
import ReturnItemsFormModal from '@features/store/components/forms/ReturnItemsForm';
import ItemTable from '@features/store/components/ItemTable';
import { Button, Card, Row, Segmented, Space } from 'antd';
import { useState } from 'react';

const options = ['Store', 'Delivery'];
const Store = () => {
  const [option, setOption] = useState<string>(options[0]);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  return (
    <>
      <Card>
        <Row style={styles.actionBar}>
          <Space>
            <Button>Delivery Order</Button>
            <Button onClick={() => setShowInvoiceModal(true)}>Invoice</Button>
            <Button onClick={() => setShowReturnModal(true)}>Return Items</Button>
          </Space>
          <Segmented options={options} value={option} onChange={(value) => setOption(value)} />
        </Row>
      </Card>
      <Card style={styles.itemTableCard}>
        <ItemTable />
      </Card>
      {showReturnModal && <ReturnItemsFormModal open={showReturnModal} onCancel={() => setShowReturnModal(false)} />}
      {showInvoiceModal && <InvoiceModal open={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} />}
    </>
  );
};

export default Store;

const styles = StyleSheet.create({
  itemTableCard: {
    marginTop: 8,
  },
  actionBar: { justifyContent: 'space-between' },
});
