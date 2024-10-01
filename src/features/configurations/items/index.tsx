import ItemIcon from '@components/ItemIcon.tsx';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters } from '@configs/types/api.types.ts';
import ItemForm from '@features/configurations/items/components/ItemForm';
import { TStockData } from '@features/stock/Inventory.tsx';
import useScreenSize from '@hooks/useScreenSize';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, Flex, Input, Row, Space, TableProps, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { fetchStockItems } from './services';

const { Search } = Input;

const inventoryTableColumns: TableProps<any>['columns'] = [
  // {
  //   title: '#',
  //   dataIndex: 'itemId',
  //   key: 'id',
  //   width: 50,
  //   fixed: 'left',
  //   render: (_id, _record, index) => {
  //     ++index;
  //     return index;
  //   },
  // },
  {
    title: 'Image',
    key: 'image',
    fixed: 'left',
    align: 'center',
    width: 100,
    render: (_, { image, type }) => <ItemIcon type={type} url={image} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
    width: 250,
    render: (_, { itemCategory, name }) => `${itemCategory?.name ? `${itemCategory?.name} - ` : ''}${name}`,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
    width: 100,
    render: (_, { type }) => <Tag className={'first-letter'}>{type}</Tag>,
  },
  {
    title: 'Item Code',
    dataIndex: 'itemId',
    key: 'itemId',
    width: 200,
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
    dataIndex: 'availability',
    key: 'availability',
    width: 450,
    responsive: ['md'],
    render: (_, { availability }) => (
      <Flex style={styles.availabilityContainer}>
        {availability?.map((type: any, i: number) => (
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
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    responsive: ['md'],
    fixed: 'right',
    width: 100,
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
    refetch: stockItemRefetch,
  } = useQuery({
    queryKey: ['items', filters.search, filters.page],
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
          refetch={() => stockItemRefetch()}
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
