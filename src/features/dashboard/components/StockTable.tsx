import Table from '@components/Table';
import { TableProps } from 'antd/es/table/InternalTable';

const columns: TableProps<any>['columns'] = [
  { title: 'Item Code', dataIndex: 'id', key: 'id', responsive: ['lg'] },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    render: (value) => <img src={value} height={40} width={40} />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Sub Category',
    dataIndex: 'SubCategory',
    key: 'SubCategory',
  },
  {
    title: 'Quantity Available',
    dataIndex: 'quantity',
    key: 'quantity',
  },
];

const StockTable = () => {
  return <Table columns={columns} rowKey={'id'} />;
};

export default StockTable;
