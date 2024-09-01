/** @format */

import { DropboxOutlined, PlusOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { stockData } from '@data/stock/stock_items';
import ItemForm from '@features/stock/components/forms/ItemForm';
import useScreenSize from '@hooks/useScreenSize';
import { formatDate } from '@utils/index';
import { Button, Card, Col, Input, Row, Space, TableProps, Tag } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const { Search } = Input;

export type TStockData = {
  itemId: string;
  name: string;
  image: string;
  category: string;
  subCategory: string;
  description: string;
  quantity: number;
  reorderlevel: number;
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
    width: 100,
  },
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
    width: 200,
    responsive: ['md'],
  },

  {
    title: 'Reorder level',
    dataIndex: 'reorderlevel',
    key: 'reorderlevel',
    width: 100,
    responsive: ['md'],
  },
  {
    title: 'Unit Price(Rs)',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: 100,
    responsive: ['md'],
  },
  {
    title: 'Total Price(Rs)',
    dataIndex: 'totalPrice',
    width: 100,
    key: 'totalPrice',
    responsive: ['md'],
  },

  {
    title: 'Last Order',
    dataIndex: 'lastOrder',
    key: 'lastOrder',
    width: 150,
    responsive: ['md'],
    render: (record: Date) => {
      return formatDate(record);
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    responsive: ['md'],
    render: (_, { status, itemId, reorderlevel, quantity }) => (
      <Space direction="vertical" key={`user_status_${itemId}`}>
        <Tag color={status ? 'green' : 'red'}>{status ? 'Active' : 'InActive'}</Tag>
        {reorderlevel && quantity && quantity < reorderlevel && <Tag color="orange">Low Stock</Tag>}
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
  const [lodaing, setLoading] = useState<boolean>(false);
  const [itemFormVisible, setItemFormVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TStockData | null>(null);

  const onSearch = (value: string | null) => {
    if (isEmpty(value) || !value) {
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <Card>
        <Space style={styles.space} size={'middle'} direction="vertical">
          <Row style={styles.headerRow}>
            <Col>
              <Space>
                <Button icon={<PlusOutlined />} onClick={() => setItemFormVisible(true)}>
                  New Item
                </Button>
              </Space>
            </Col>
            <Col style={styles.search}>
              <Search placeholder="Search..." onSearch={onSearch} enterKeyHint="search" allowClear />
            </Col>
          </Row>
          <Table
            loading={lodaing}
            scroll={{ x: 1000 }}
            pagination={{
              pageSize: PAGE_SIZES.INVENTORY,
              total: 100,
              onChange: () => {},
            }}
            style={{
              maxWidth: width - (isMobile ? 65 : 250),
            }}
            rowKey={'itemId'}
            columns={inventoryTableColumns}
            dataSource={stockData}
            rowClassName={(item) => (item.quantity < item.reorderlevel ? 'reorder-row' : '')}
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

export default Inventory;

const styles = StyleSheet.create({
  search: {
    float: 'right',
  },
  space: { width: '100%' },
  headerRow: { justifyContent: 'space-between' },
});
