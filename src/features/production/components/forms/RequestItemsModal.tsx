import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ItemTable from '@components/ItemTable';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { queryClient } from '@configs/react-query.config.ts';
import { StyleSheet } from '@configs/stylesheet';
import { KeyValuePair } from '@configs/types.ts';
import { fetchItemDropdown } from '@features/configurations/items/services';
import { requestItems } from '@features/production/services';
import { TItem } from '@features/stock/components/forms/StockForm.tsx';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { convertItemObject } from '@utils/index';
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  ModalProps,
  Popconfirm,
  Row,
  Space,
  TableProps,
  TreeSelect,
  Typography,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';

type TRequestItemsModal = {
  onCancel: () => void;
} & ModalProps;

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
    title: 'Item',
    dataIndex: 'item_id',
    key: 'item_id',
    render: (value) => items?.find((item) => item.value === value)?.label || '-',
  },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: '15%' },
  { title: 'Note', dataIndex: 'note', key: 'note' },
  {
    title: 'Actions',
    key: 'actions',
    width: '12%',
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

const RequestItemsModal = ({ onCancel, ...others }: TRequestItemsModal) => {
  const [form] = useForm();
  const toastApi = useToastApi();
  const [items, setItems] = useState<TItem[] | null>(null);
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
  const {
    data: itemList,
    isLoading: itemListLoading,
    error: itemListError,
  } = useQuery({
    queryKey: ['item-dropdown'],
    queryFn: () => fetchItemDropdown('production'),
  });

  const mutation = useMutation({
    mutationFn: (payload: TItem[]) => requestItems(payload),
    onSuccess: async (response: any) => {
      toastApi.open({
        type: 'success',
        content: response?.message || DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onCancelForm();
      await queryClient.invalidateQueries({ queryKey: ['stock-items', 'request-count'] });
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

  const onCancelForm = () => {
    form.resetFields();
    onCancel();
  };

  const onFillForm = () => {
    const values = form.getFieldsValue();
    if (isEmpty(selectedItem)) {
      setItems((prevState) => [...(prevState || []), { ...values, type: 'store', quantity: Number(values.quantity) }]);
      form.resetFields();
      return;
    }
    if (items && selectedItem) {
      const index: number = selectedItem.index || 0;
      const updatedItems = [...items];
      updatedItems[index] = { ...values, type: 'store', quantity: Number(values.quantity) };
      setItems(updatedItems);
      form.resetFields();
    }
  };

  const onDeleteItem = (id: number) => {
    setItems((prevItems) => {
      return (prevItems || [])?.filter((_, index) => index !== id);
    });
    setSelectedItem(null);
  };

  const columns = useMemo(
    () =>
      getColumns({
        items: itemList as unknown as KeyValuePair[],
        setEditItem: setSelectedItem,
        onDeleteItem,
      }),
    [itemList]
  );

  const submitPayload = () => {
    if (!items || isEmpty(items)) {
      toastApi.open({
        content: 'Please add at least one item!',
        type: 'error',
        duration: 4,
      });
      return;
    }
    mutation.mutate(items);
  };

  const dropdownItems = useMemo(() => convertItemObject(itemList || []), [itemList]);

  return (
    <>
      <Modal
        loading={itemListLoading}
        style={styles.modal}
        footer={null}
        title={'Request Items'}
        onCancel={() => onCancelForm()}
        onClose={() => onCancelForm()}
        {...others}
      >
        <Row gutter={8}>
          <Col xs={24} md={24} lg={18}>
            <ItemTable
              items={items || []}
              columns={columns}
              loading={itemListLoading}
              onSubmit={() => submitPayload()}
            />
          </Col>

          <Col lg={6}>
            <Card style={styles.cardContainer}>
              <Typography.Title level={5} style={styles.formTitle}>
                Add Item(s)
              </Typography.Title>
              <Form onFinish={onFillForm} form={form} layout="vertical" style={styles.itemInsertForm}>
                <Form.Item label={'Item'} name={'item_id'} rules={[{ required: true, message: 'Item is required' }]}>
                  <TreeSelect treeLine placeholder={'Select Item'} treeData={dropdownItems} />
                </Form.Item>
                <Form.Item
                  label={'Quantity'}
                  name={'quantity'}
                  rules={[{ required: true, message: 'Quantity is required' }]}
                >
                  <Input placeholder="Quantity" type="number" />
                </Form.Item>
                <Form.Item label={'Note'} name={'note'}>
                  <TextArea placeholder="Note" />
                </Form.Item>
                <Flex justify="end" gap={8} style={styles.buttonContainer}>
                  <Form.Item style={styles.button}>
                    <Button
                      style={styles.buttonContainer}
                      icon={<DeleteOutlined />}
                      type="default"
                      loading={mutation.isPending}
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
  modal: {
    minWidth: '80%',
  },
  cardContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  formTitle: {
    margin: 0,
  },
  form: {
    width: '100%',
    marginTop: 16,
  },
  button: {
    width: '50%',
  },

  actionButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
  buttonContainer: {
    width: '100%',
  },
});
