import { DropboxOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters } from '@configs/types/api.types.ts';
import StockForm from '@features/stock/components/forms/StockForm';
import useScreenSize from '@hooks/useScreenSize';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems } from '@services';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@utils/index';
import { Button, Card, Col, Input, Row, Space, TableProps, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ExpandContent from './components/ExpandCotent.tsx';

const { Search } = Input;

export type TStockData = {
  id?: number;
  itemId: string;
  name: string;
  image: string;
  category: string;
  subCategory: string;
  description: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  totalPrice: number;
  status: boolean;
  lastOrder: Date;
  type?: string;
  createdAt: Date;
};

export type TCompletedItems = {
  id: number;
  category: number;
  item: string[];
  quantity: number;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
  itemCategory: { name: string; code: string };
};

const inventoryTableColumns: TableProps<any>['columns'] = [
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    fixed: 'left',
    width: 100,
    render: (value) => {
      if (!value) return <DropboxOutlined />;
      return <img src={value} height={40} width={40} alt="item-image" />;
    },
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 200,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    responsive: ['md'],
    width: 150,
  },
  {
    title: 'Item Code',
    dataIndex: 'itemId',
    key: 'itemId',
    width: 100,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    responsive: ['lg'],
  },
  {
    title: 'Reorder level',
    dataIndex: 'reorderLevel',
    key: 'reorderLevel',
    width: 100,
    responsive: ['lg'],
  },
  {
    title: 'Total Price(Rs)',
    dataIndex: 'totalPrice',
    width: 120,
    key: 'totalPrice',
    responsive: ['lg'],
  },
  {
    title: 'Last Stock',
    dataIndex: 'lastOrder',
    key: 'lastOrder',
    width: 150,
    responsive: ['lg'],
    render: (record: Date) => {
      return formatDate(record);
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    responsive: ['md'],
    fixed: 'right',
    render: (_, { status, itemId, reorderLevel, quantity }) => (
      <Space direction="vertical" key={`user_status_${itemId}`}>
        <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'InActive'}</Tag>
        {quantity === 0 && <Tag color="orange">Empty Stock</Tag>}
        {quantity > 0 && reorderLevel > quantity && <Tag color="orange">Low Stock</Tag>}
      </Space>
    ),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    fixed: 'right',
    width: 100,
  },
];

const Inventory = () => {
  const { width } = useScreenSize();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const toastApi = useToastApi();
  const [filters, setFilter] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: PAGE_SIZES.INVENTORY });
  const [stockForm, setStockForm] = useState<boolean>(false);

  const {
    data: stockItems,
    isLoading: stockItemLoading,
    error: stockItemError,
    refetch: refetchStockItems,
  } = useQuery({
    queryKey: ['stock-items', filters.search, filters.page],
    queryFn: () => fetchStockItems(filters, 'stock'),
  });

  useEffect(() => {
    if (stockItemError) {
      toastApi.open({
        content: stockItemError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [stockItemError]);

  const onSearch = async (search: string | null) => {
    if (isEmpty(search) || !search) {
      return;
    }
    setFilter((prevState) => ({ ...prevState, search }));
    await refetchStockItems();
  };

  return (
    <>
      <Card>
        <Space style={styles.space} size={'middle'} direction="vertical">
          <Row style={styles.headerRow}>
            <Col>
              <Button onClick={() => setStockForm(true)}>New Stock</Button>
            </Col>
            <Col style={styles.search}>
              <Search
                placeholder="Search..."
                onSearch={onSearch}
                onChange={(e) => {
                  if (isEmpty(e.target.value)) setFilter((prev) => ({ ...prev, search: null }));
                }}
                enterKeyHint="search"
                allowClear
              />
            </Col>
          </Row>
          <Table
            loading={stockItemLoading}
            expandable={{ expandedRowRender: (record) => <ExpandContent record={record?.itemList || []} /> }}
            pagination={{
              current: filters.page,
              pageSize: PAGE_SIZES.INVENTORY,
              total: stockItems?.total,
              align: 'center',
              onChange: (page: number) => {
                setFilter((prev) => ({ ...prev, page }));
              },
            }}
            style={{
              maxWidth: width - (isMobile ? 65 : 250),
            }}
            rowKey={'itemId'}
            columns={inventoryTableColumns}
            dataSource={stockItems?.records}
            rowClassName={(item) => (item.quantity < item.reorderLevel ? 'reorder-row' : '')}
          />
        </Space>
      </Card>
      {stockForm && <StockForm visible={stockForm} onCancel={() => setStockForm(false)} />}
    </>
  );
};

export default Inventory;

const styles = StyleSheet.create({
  search: {
    float: 'right',
  },
  space: { width: '100%' },
  headerRow: { justifyContent: 'space-between' },
});
