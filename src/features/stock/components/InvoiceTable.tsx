/** @format */

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_CURRENCY } from '@configs/index';
import { formatCurrency } from '@utils/index';
import { Button, Space, TableProps } from 'antd';

// eslint-disable-next-line no-unused-vars
const columns: (setEditItem: (item: any) => void) => TableProps<any>['columns'] = (setEditItem) => [
  {
    title: 'Item Name',
    dataIndex: 'itemName',
    key: 'itemName',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    render: (value) => value || '-',
  },
  {
    title: `Unit Price (${DEFAULT_CURRENCY})`,
    align: 'right',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    align: 'right',
  },
  {
    title: `Amount (${DEFAULT_CURRENCY})`,
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    render(_, record) {
      return formatCurrency(record.unitPrice * record.quantity);
    },
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: (_, record) => {
      return (
        <Space size="middle">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => setEditItem(record)}></Button>
          <Button type="text" size="small" icon={<DeleteOutlined />} danger></Button>
        </Space>
      );
    },
  },
];
type InvoiceTableProps = {
  // eslint-disable-next-line no-unused-vars
  setEditItem: (value: any) => void;
  dataSource: any[];
};
const InvoiceTable = (props: InvoiceTableProps) => {
  return <Table columns={columns(props?.setEditItem)} dataSource={props.dataSource} pagination={false} />;
};

export default InvoiceTable;
