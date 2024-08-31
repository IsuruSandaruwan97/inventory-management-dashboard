/** @format */

import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_CURRENCY } from '@configs/index';
import { invoice_line_items } from '@data/stock/invoice_line_items';
import { formatCurrency } from '@utils/index';
import { Button, Card, Flex, Form, Input, Space, TableProps, Typography } from 'antd';
import { useEffect, useState } from 'react';

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
          <Button size="small" icon={<EditOutlined />} onClick={() => setEditItem(record)}></Button>
          <Button size="small" icon={<DeleteOutlined />} danger></Button>
        </Space>
      );
    },
  },
];
type InvoiceTableProps = {
  setEditItem: (item: any) => void;
  dataSource: any[];
};
const InvoiceTable = (props: InvoiceTableProps) => {
  return <Table columns={columns(props?.setEditItem)} dataSource={props.dataSource} pagination={false} />;
};

export default InvoiceTable;
