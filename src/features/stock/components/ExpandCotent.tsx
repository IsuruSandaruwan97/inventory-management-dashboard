import { EditOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_CURRENCY } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { formatCurrency, formatDate } from '@utils/index';
import { Button, Card, Space, TableProps } from 'antd';

const columns: TableProps<any>['columns'] = [
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
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',

    render: (value) => formatCurrency(value) || '-',
  },
  {
    title: `Unit Price (${DEFAULT_CURRENCY})`,
    dataIndex: 'unit_price',
    key: 'unit_price',
    render: (value) => formatCurrency(value),
  },
  {
    title: `Total Price (${DEFAULT_CURRENCY})`,
    dataIndex: 'total_price',
    key: 'total_price',
    render: (_, { unit_price, quantity }) => formatCurrency((unit_price || 0) * (quantity || 0)),
  },
  {
    title: `Last Modified`,
    dataIndex: 'lastModified',
    key: 'lastModified',
    render: (_, { updatedAt, createdAt }) => <>{updatedAt || createdAt ? formatDate(updatedAt || createdAt) : '-'}</>,
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    width: '15%',
    render: (_, _record) => {
      return (
        <Space size="middle" style={styles.actionButtonContainer}>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => {}} />
        </Space>
      );
    },
  },
];

const ExpandContent = ({ record }: { record: any }) => {
  return (
    <Card>
      <Table
        columns={columns}
        pagination={{
          pageSize: 5,
          size: 'small',
        }}
        className={'small-font-table'}
        dataSource={record}
        rowKey={'id'}
        size={'small'}
      />
    </Card>
  );
};
export default ExpandContent;

const styles = StyleSheet.create({
  actionButtonContainer: {
    justifyContent: 'center',
    display: 'flex',
  },
});
