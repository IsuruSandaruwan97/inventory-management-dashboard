import { HistoryOutlined, PlusCircleFilled } from '@ant-design/icons';
import Table from '@components/Table';
import { StyleSheet } from '@configs/stylesheet';
import { useToastApi } from '@hooks/useToastApi';
import { Button, Form, Input, Modal, ModalProps, Space, TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';

type TRequestItemsModal = {
  onCancel: () => void;
} & ModalProps;

const columns: TableProps<any>['columns'] = [
  { title: 'Code', dataIndex: 'id', key: 'id' },
  { title: 'Item', dataIndex: 'item', key: 'item' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
  {
    title: 'Actions',
    key: 'actions',
    render: () => (
      <Space size="middle">
        <Button>
          <HistoryOutlined />
        </Button>
      </Space>
    ),
  },
];
const RequestItemsModal = ({ onCancel, ...others }: TRequestItemsModal) => {
  const [form] = useForm();
  const toastApi = useToastApi();
  const [selectedItems] = useState<any[]>();

  const onCancelForm = () => {
    form.resetFields();
    onCancel();
  };

  const onRequestItems = () => {
    if (isEmpty(selectedItems)) {
      toastApi.error('Please select an item');
      return;
    }
  };

  return (
    <>
      <Modal
        width={'70%'}
        footer={null}
        title={'Request Items'}
        onCancel={() => onCancelForm()}
        onClose={() => onCancelForm()}
        {...others}
      >
        <Form form={form} layout="inline" style={styles.itemInsertForm}>
          <Form.Item
            label={'Item'}
            name={'item'}
            style={{ width: '50%' }}
            rules={[{ required: true, message: 'Item is required' }]}
          >
            <Input placeholder="Select Item" />
          </Form.Item>
          <Form.Item
            label={'Quantity'}
            name={'quantity'}
            style={{ width: '35%' }}
            rules={[{ required: true, message: 'Quantity is required' }]}
          >
            <Input placeholder="Quantity" type="number" />
          </Form.Item>

          <Form.Item style={{ width: '8%' }}>
            <PlusCircleFilled style={styles.plusIcon} onClick={() => form.validateFields()} />
          </Form.Item>
        </Form>
        <Table columns={columns} dataSource={[]} />
        {selectedItems && selectedItems.length > 1 && (
          <Space style={styles.buttonSpace}>
            <Button onClick={() => onCancelForm()}>Cancel</Button>
            <Button type="primary" onClick={() => onRequestItems()}>
              Request
            </Button>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default RequestItemsModal;

const styles = StyleSheet.create({
  plusIcon: {
    fontSize: 25,
    color: 'blue',
    cursor: 'pointer',
  },
  itemInsertForm: {
    marginBottom: 16,
  },
  buttonSpace: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
