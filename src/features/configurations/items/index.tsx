import { DropboxOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters } from '@configs/types/api.types.ts';
import ItemForm from '@features/configurations/items/components/ItemForm';
import useScreenSize from '@hooks/useScreenSize';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Flex, Input, Row, Space, TableProps, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { fetchStockItems } from './services';

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
};

const inventoryTableColumns: TableProps<any>['columns'] = [
  {
    title: 'Item Code',
    dataIndex: 'itemId',
    key: 'itemId',
    fixed: 'left',
    width: 150,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    fixed: 'left',
    align: 'center',
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
    width: 250,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    responsive: ['md'],
    fixed: 'left',
    width: 250,
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
    key: 'subCategory',
    width: 150,
    responsive: ['md'],
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 250,
    responsive: ['md'],
  },
  {
    title: 'Availability',
    dataIndex: 'types',
    key: 'availability',
    width: 250,
    responsive: ['md'],
    render: (_, { types }) => (
      <Flex style={styles.availabilityContainer}>
        {types?.map((type: any, i: number) => (
          <Tag className={'first-letter'} key={i}>
            {type}
          </Tag>
        ))}
      </Flex>
    ),
  },
  {
    title: 'Updated by',
    dataIndex: 'updatedBy',
    key: 'updatedBy',
    width: 150,
  },
  {
    title: 'Reorder level',
    dataIndex: 'reorderLevel',
    key: 'reorderLevel',
    width: 100,
    responsive: ['md'],
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    fixed: 'right',
    width: 100,
    render: (_, { status, itemId, reorderLevel, quantity }) => (
      <Space direction="vertical" key={`user_status_${itemId}`}>
        <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'InActive'}</Tag>
        {reorderLevel && quantity && quantity < reorderLevel && <Tag color="orange">Low Stock</Tag>}
      </Space>
    ),
  },
];

const Items = () => {
  const { width } = useScreenSize();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const toastApi = useToastApi();
  const [itemFormVisible, setItemFormVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TStockData | null>(null);
  const [filters, setFilter] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: PAGE_SIZES.INVENTORY });

  const {
    data: stockItems,
    isLoading: stockItemLoading,
    error: stockItemError,
  } = useQuery({
    queryKey: ['stock-items', filters.search, filters.page],
    queryFn: () => fetchStockItems(filters),
  });

  useEffect(() => {
    if (stockItemError) {
      toastApi.open({
        content: stockItemError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [stockItemError]);

  return (
    <>
      <Card>
        <Space style={styles.space} size={'middle'} direction="vertical">
          <Row style={styles.headerRow}>
            <Col>
              <Button onClick={() => setItemFormVisible(true)}>New Item</Button>
            </Col>
            <Col style={styles.search}>
              <Search
                placeholder="Search..."
                onSearch={(search) => setFilter((prev) => ({ ...prev, search }))}
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
            scroll={{ x: 1000 }}
            pagination={{
              current: filters.page,
              pageSize: PAGE_SIZES.INVENTORY,
              total: stockItems?.total,
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
            onRow={(record) => ({
              onClick: () => {
                setItemFormVisible(true);
                setSelectedItem(record as TStockData);
              },
            })}
          />
        </Space>
      </Card>
      {itemFormVisible && (
        <ItemForm
          item={selectedItem}
          visible={itemFormVisible}
          isUpdate={!isEmpty(selectedItem)}
          onCancel={() => {
            setItemFormVisible(false);
            setSelectedItem(null);
          }}
        />
      )}
    </>
  );
};

export default Items;

const styles = StyleSheet.create({
  search: {
    float: 'right',
  },
  space: { width: '100%' },
  headerRow: { justifyContent: 'space-between' },
  availabilityContainer: {
    flexWrap: 'wrap',
    gap: '8px',
  },
});
