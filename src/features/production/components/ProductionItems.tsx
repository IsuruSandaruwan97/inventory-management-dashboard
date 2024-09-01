/** @format */

import { HistoryOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { PRODUCTION_DATA } from '@data/production';
import { Button, Space, TableProps } from 'antd';

const columns: TableProps<any>['columns'] = [
  { title: 'Item Code', dataIndex: 'id', key: 'id' },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: (value) => <img src={value} height={40} width={40} alt={'item_image'} />,
  },
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Quantity Available',
    dataIndex: 'quantity',
    key: 'quantity',
  },
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

const ProductionItems = () => {
  return (
    <>
      <Table columns={columns} rowKey={'id'} dataSource={PRODUCTION_DATA} />
    </>
  );
};

export default ProductionItems;
