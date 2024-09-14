import { AimOutlined, ClockCircleOutlined, FileDoneOutlined } from '@ant-design/icons';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { queryClient } from '@configs/react-query.config.ts';
import { TListType } from '@configs/types';
import { TRequestItems } from '@features/configurations/configs/types.ts';
import ActionButtons from '@features/stock/components/ActionButtons';
import { acceptRejectRequest } from '@features/stock/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation } from '@tanstack/react-query';
import { thousandSeparator } from '@utils/index';
import { Card, Flex, Space, Table, TableProps, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import isEmpty from 'lodash/isEmpty';

export type TItemContent = {
  isMobile: boolean;
  styles: any;
  item: TRequestItems;
  listType: TListType;
};

const { Text } = Typography;

const ItemContent = ({ styles, item, listType }: TItemContent) => {
  const toast = useToastApi();
  const acceptRequest = useMutation({
    mutationFn: ({ action, id }: { action: number; id?: number }) =>
      acceptRejectRequest({ requestId: item.request_id, action, id }),
    onSuccess: async (response: any) => {
      const { data, message } = response;
      if (data.errors && !isEmpty(data.errors)) {
        toast.open({
          type: 'warning',
          content: 'Some items are not approved, Please check the stock and try again',
          duration: 4,
        });
        await queryClient.invalidateQueries({ queryKey: ['requests'] });
        return;
      }
      toast.open({
        type: 'success',
        content: message || DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });

      await queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
    onError: (error) => {
      toast.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Request Id',
      dataIndex: 'id',
      key: 'id',
      responsive: ['md'],
    },
    {
      title: 'Item Name',
      dataIndex: 'stockItem',
      key: 'item',
      render: (_, { stockItem }) => <>{stockItem.name}</>,
    },

    {
      title: 'Item Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, { quantity }: { quantity: number }) => thousandSeparator(quantity),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, { status, id }) => {
        return status === 1 ? (
          <ActionButtons
            iconsOnly
            onAccept={() => acceptRequest.mutate({ action: 2, id })}
            onReject={() => acceptRequest.mutate({ action: 0, id })}
          />
        ) : (
          <Tag color={status === 0 ? 'red' : status === 1 ? 'blue' : 'green'}>
            {status === 0 ? 'Rejected' : status === 1 ? 'Pending' : 'Accepted'}
          </Tag>
        );
      },
    },
  ];
  return (
    <Card>
      <Space direction="vertical">
        <Text style={styles.description}>
          <AimOutlined style={{ fontSize: 16 }} />
          &nbsp;{item.description}
        </Text>
        <Text style={{ ...styles.description, marginLeft: 2 }}>
          <ClockCircleOutlined style={{ fontSize: 13 }} />
          &nbsp;{dayjs(item.date).format('LLLL')}
        </Text>
        {item?.note && (
          <Text style={{ ...styles.description, marginLeft: 2 }}>
            <FileDoneOutlined style={{ fontSize: 13 }} />
            &nbsp;{item.note}
          </Text>
        )}
      </Space>
      <Table pagination={false} rowKey={'id'} columns={columns} dataSource={item.records} />
      {listType === 'pending' && (
        <Flex justify={'flex-end'} style={styles.mobileActionButtons}>
          <ActionButtons
            onAccept={() => {
              acceptRequest.mutate({ action: 2 });
            }}
            onReject={() => acceptRequest.mutate({ action: 0 })}
          />
        </Flex>
      )}
    </Card>
  );
};

export default ItemContent;
