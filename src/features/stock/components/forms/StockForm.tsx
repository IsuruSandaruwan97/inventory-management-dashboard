import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import NumberInput from '@components/NumberInput.tsx';
import Table from '@components/Table';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { DEFAULT_CURRENCY } from '@configs/index';
import { queryClient } from '@configs/react-query.config';
import { StyleSheet } from '@configs/stylesheet';
import { KeyValuePair } from '@configs/types.ts';
import { TStockSteps } from '@configs/types/api.types.ts';
import { fetchItemDropdown } from '@features/configurations/items/services';
import { insertStockItems } from '@features/stock/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { convertItemObject, formatCurrency } from '@utils/index';
import { Button, Card, Col, Flex, Form, Modal, Popconfirm, Row, Space, TableProps, TreeSelect, Typography } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';

type TStockFormProps = {
  visible: boolean;
  onCancel: () => void;
};

export type TItem = {
  index?: number;
  item_id: string;
  quantity?: number;
  unit_price: number;
  type: TStockSteps;
  note?: string;
};

type TGetColumns = {
  items: KeyValuePair[];
  setEditItem: (item: TItem) => void;
  onDeleteItem: (id: number) => void;
};

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
    title: 'Item Name',
    dataIndex: 'item_id',
    key: 'item_id',
    render: (value) => items?.find((item) => item.value === value)?.label || '-',
    width: '35%',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    render: (value) => formatCurrency(value) || '-',
    width: '14%',
  },
  {
    title: `Unit Price (${DEFAULT_CURRENCY})`,
    align: 'right',
    dataIndex: 'unit_price',
    key: 'unit_price',
    render: (value) => formatCurrency(value),
    width: '19%',
  },
  {
    title: `Total Price (${DEFAULT_CURRENCY})`,
    align: 'right',
    key: 'total_price',
    render: (_, { unit_price, quantity }) => formatCurrency(unit_price * quantity),
    width: '20%',
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    width: '15%',
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

const StockForm = ({ visible, onCancel }: TStockFormProps) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<TItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const toastApi = useToastApi();
  const {
    data: itemList,
    isLoading: itemListLoading,
    error: itemListError,
  } = useQuery({
    queryKey: ['item-dropdown'],
    queryFn: () => fetchItemDropdown('stock'),
  });

  const mutation = useMutation({
    mutationFn: (payload: TItem[]) => insertStockItems(payload),
    onSuccess: async () => {
      toastApi.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['stock-items'] });
    },
    onError: (error) => {
      toastApi.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  useEffect(() => {
    if (itemListError) {
      toastApi.open({
        content: itemListError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [itemListError]);

  useEffect(() => {
    if (!isEmpty(selectedItem)) {
      form.setFieldsValue(selectedItem);
      return;
    }
    form.resetFields();
  }, [selectedItem]);

  const onDeleteItem = (id: number) => {
    setItems((prevItems) => {
      return (prevItems || [])?.filter((_, index) => index !== id);
    });
    setSelectedItem(null);
  };

  const columns = useMemo(
    () => getColumns({ items: itemList as unknown as KeyValuePair[], setEditItem: setSelectedItem, onDeleteItem }),
    [itemList]
  );

  const itemTree = useMemo(() => convertItemObject(itemList || []), [itemList]);

  const onClose = () => {
    form.resetFields();
    setSelectedItem(null);
    setItems(null);
    onCancel();
  };

  const onFillForm = () => {
    const values = form.getFieldsValue();
    if (isEmpty(selectedItem)) {
      setItems((prevState) => [...(prevState || []), values]);
      form.resetFields();
      return;
    }
    if (items && selectedItem) {
      const index: number = selectedItem.index || 0;
      const updatedItems = [...items];
      updatedItems[index] = values;
      setItems(updatedItems);
      form.resetFields();
    }
  };

  const submitForm = () => {
    if (!items || isEmpty(items)) {
      toastApi.open({
        content: 'Please select at least one item',
        type: 'error',
        duration: 4,
      });
      return;
    }
    mutation.mutate(
      items?.map((item) => {
        item.type = 'stock';
        return item;
      })
    );
  };

  return (
    <>
      <Modal
        loading={itemListLoading}
        open={visible}
        onCancel={onClose}
        title={'New Stock'}
        style={styles.modal}
        footer={null}
      >
        <Row gutter={8}>
          <Col xs={24} md={24} lg={18}>
            <Card style={styles.cardContainer}>
              <div style={styles.tableContainer}>
                <Table rowKey={'id'} dataSource={items || []} columns={columns} scroll={{ y: 200 }} />
              </div>
              <Space style={styles.submitButtonContainer}>
                <Button onClick={submitForm} style={styles.submitButton} type={'primary'} loading={mutation.isPending}>
                  Submit
                </Button>
              </Space>
            </Card>
          </Col>
          <Col lg={6}>
            <Card style={styles.cardContainer}>
              <Typography.Title level={5} style={styles.formTitle}>
                Add Item(s)
              </Typography.Title>
              <Form onFinish={onFillForm} form={form} layout={'vertical'} style={styles.form}>
                <Form.Item label={'Item'} name={'item_id'} rules={[{ required: true, message: 'Item is required' }]}>
                  <TreeSelect treeLine treeData={itemTree} />
                </Form.Item>
                <Form.Item
                  label={'Quantity'}
                  name={'quantity'}
                  rules={[{ required: true, message: 'Quantity is required' }]}
                >
                  <NumberInput />
                </Form.Item>
                <Form.Item
                  label={'Unit Price(Rs)'}
                  name={'unit_price'}
                  rules={[{ required: true, message: 'Unit price is required' }]}
                >
                  <NumberInput />
                </Form.Item>

                <Flex justify="end" gap={8} style={styles.buttonContainer}>
                  <Form.Item style={styles.button}>
                    <Button
                      style={styles.buttonContainer}
                      icon={<DeleteOutlined />}
                      type="default"
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
                      loading={mutation.isPending}
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
    </>
  );
};

export default StockForm;

const styles = StyleSheet.create({
  modal: {
    minWidth: '80%',
  },
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  tableContainer: {
    flexGrow: 1,
    minHeight: '290px',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px 0',
  },
  submitButton: {
    width: 150,
  },
  button: {
    width: '50%',
  },
  actionButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  formTitle: {
    margin: 0,
  },
  form: {
    width: '100%',
    marginTop: 16,
  },

  buttonContainer: {
    width: '100%',
  },
});
