/** @format */

import { AimOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { TListType } from '@configs/types';
import { Card, Flex, Space, Table, TableProps, Typography } from 'antd';
import dayjs from 'dayjs';
import ActionButtons from './ActionButtons';

export type TItemContent = {
  isMobile: boolean;
  styles: any;
  items: any[];
  title: string;
  date: Date | string;
  listType: TListType;
};

const { Text } = Typography;

const ItemContent = ({ isMobile, items, styles, title, date, listType }: TItemContent) => {
  const columns: TableProps<any>['columns'] = [
    {
      title: 'Item Name',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Request Id',
      dataIndex: 'id',
      key: 'id',
      responsive: ['md'],
    },
    {
      title: 'Request Date',
      dataIndex: 'date',
      key: 'date',
      responsive: ['md'],
      render: (item: Date | string) => <>{dayjs(item).format('LLLL')}</>,
    },
    {
      title: 'Item Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_item: any) => {
        return <ActionButtons iconsOnly />;
      },
    },
  ];
  return (
    <Card>
      <Space direction="vertical">
        <Text style={styles.description}>
          <AimOutlined style={{ fontSize: 16 }} />
          &nbsp;{title}
        </Text>
        <Text style={{ ...styles.description, marginLeft: 2 }}>
          <ClockCircleOutlined style={{ fontSize: 13 }} />
          &nbsp;{dayjs(date).format('LLLL')}
        </Text>
      </Space>
      <Table pagination={false} rowKey={'id'} columns={columns} dataSource={items} />
      {listType === 'pending' && <Flex style={styles.mobileActionButtons}>{isMobile && <ActionButtons />}</Flex>}
    </Card>
  );
};

export default ItemContent;
