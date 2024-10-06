import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ItemTable from '@components/ItemTable';
import { KeyValuePair } from '@configs/types.ts';
import { StyleSheet } from '@stylesheet';
import { Button, Card, Col, Flex, Form, Input, Modal, Popconfirm, Row, Space, TableProps, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal/interface';
import { useMemo, useState } from 'react';

type TGetColumns = {
  items: KeyValuePair[];
  setEditItem: (item: TItem) => void;
  onDeleteItem: (id: number) => void;
};

type TItem = {
  item: string;
  quantity: number;
};

type DeliveryFormModal = {
  onCancel: () => void;
} & ModalProps;

const getColumns = ({ items, setEditItem, onDeleteItem }: TGetColumns): TableProps<any>['columns'] => [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: '5%',
    render: (_id, _record, index) => {
      ++index;
      return index;
    },
    showSorterTooltip: false,
  },
  {
    title: 'Item',
    dataIndex: 'item_id',
    key: 'item_id',
    render: (value) => items?.find((item) => item.value === value)?.label || '-',
  },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: '20%' },

  {
    title: 'Actions',
    key: 'actions',
    width: '20%',
    render: (_, record, index) => {
      return (
        <Space size="middle" style={styles.actionButtonContainer}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditItem({ ...record, index });
            }}
          ></Button>
          <Popconfirm
            title="Remove the item"
            description="Are you sure to remove this item?"
            onConfirm={() => onDeleteItem(index)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      );
    },
  },
];

const DeliveryOrder = ({ onCancel, ...others }: DeliveryFormModal) => {
  const [form] = useForm();
  const [items, setItems] = useState<TItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  const onCancelForm = () => {
    form.resetFields();
    onCancel();
  };

  const onDeleteItem = (id: number) => {
    setItems((prevItems) => {
      return (prevItems || [])?.filter((_, index) => index !== id);
    });
    setSelectedItem(null);
  };

  const onFillForm = () => {};

  const columns = useMemo(
    () =>
      getColumns({
        items: [],
        setEditItem: setSelectedItem,
        onDeleteItem,
      }),
    []
  );

  return (
    <Modal
      footer={null}
      open
      title={'Add Delivery Order'}
      style={styles.modal}
      onCancel={() => onCancelForm()}
      onClose={() => onCancelForm()}
      {...others}
    >
      <Row gutter={8}>
        <Col xs={24} md={24} lg={18}>
          <ItemTable items={items || []} columns={columns} loading={false} onSubmit={() => {}} />
        </Col>
        <Col lg={6}>
          <Card style={styles.cardContainer}>
            <Typography.Title level={5} style={styles.formTitle}>
              Add Item(s)
            </Typography.Title>
            <Form onFinish={onFillForm} form={form} layout="vertical" style={styles.itemInsertForm}>
              <Form.Item label={'Item'} name={'item_id'} rules={[{ required: true, message: 'Item is required' }]}>
                {/*<TreeSelect treeLine placeholder={'Select Item'} treeData={dropdownItems} />*/}
              </Form.Item>
              <Form.Item
                label={'Quantity'}
                name={'quantity'}
                rules={[{ required: true, message: 'Quantity is required' }]}
              >
                <Input placeholder="Quantity" type="number" />
              </Form.Item>

              <Flex justify="end" gap={8} style={styles.buttonContainer}>
                <Form.Item style={styles.button}>
                  <Button
                    style={styles.buttonContainer}
                    icon={<DeleteOutlined />}
                    type="default"
                    // loading={mutation.isPending}
                    onClick={() => {
                      setSelectedItem(null);
                      form.resetFields();
                    }}
                    htmlType="reset"
                  >
                    Clear
                  </Button>
                </Form.Item>

                <Form.Item style={styles.button}>
                  <Button
                    style={styles.buttonContainer}
                    // loading={mutation.isPending}
                    icon={<PlusOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    {selectedItem ? 'Update' : 'Add'}
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default DeliveryOrder;

const styles = StyleSheet.create({
  modal: { minWidth: '70%' },
  actionButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    margin: 0,
  },
  itemInsertForm: {
    marginBottom: 16,
  },
  button: {
    width: '50%',
  },

  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
});
