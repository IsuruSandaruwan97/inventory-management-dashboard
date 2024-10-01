import { DropboxOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index.tsx';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters, TStockStatus } from '@configs/types/api.types.ts';
import CompleteItemsModal from '@features/production/components/forms/CompleteItemsModal';
import DamageItemsModal from '@features/production/components/forms/DamageItemsModal';
import RequestItemsModal from '@features/production/components/forms/RequestItemsModal';
import { fetchCompletedItems } from '@features/production/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchDamagedItems, fetchStockItems } from '@services';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@utils/index.ts';
import { Button, Card, Row, Segmented, Space, TableProps, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const colors = ['cyan', 'geekblue', 'gold'];
const options = ['Pending', 'Completed', 'Damaged'];

const getColumns = (type: string): TableProps<any>['columns'] => [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    width: '10%',
    render: (_id, _record, index) => {
      ++index;
      return index;
    },
    showSorterTooltip: false,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
    fixed: 'left',
    width: '10%',
    render: (value) => {
      if (!value) return <DropboxOutlined />;
      return <img src={value} height={40} width={40} alt="item-image" />;
    },
  },
  {
    title: 'Item',
    dataIndex: 'name',
    key: 'name',
  },
  ...(type === 'completed'
    ? [
        {
          title: 'List',
          dataIndex: 'list',
          key: 'list',
          render: (_: any, { list }: any) => (
            <>
              {list?.map((item: any, index: number) => (
                <Tag color={colors[index % colors.length]} key={index}>
                  {item}
                </Tag>
              ))}
            </>
          ),
        },
      ]
    : []),
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '15%',
  },
  ...(type === 'damaged'
    ? [
        {
          title: 'Reason',
          dataIndex: 'reason',
          key: 'reason',
        },
      ]
    : []),
  {
    title: 'Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '20%',
    render: (_, { createdAt }) => formatDate(createdAt, 'YYYY-MM-DD hh:mm:ss a'),
  },
];

const Production = () => {
  const toastApi = useToastApi();
  const [option, setOption] = useState<string>('Pending');
  const [completeItemsModal, setCompleteItemsModal] = useState<boolean>(false);
  const [requestModal, setRequestModal] = useState<boolean>(false);
  const [showDamageModal, setShowDamageModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<TCommonFilters>(DEFAULT_FILTERS);

  const {
    data: stockItems,
    isLoading: stockItemLoading,
    error: stockItemError,
  } = useQuery({
    queryKey: ['production-items', option, filters.page, filters.search],
    queryFn: () => fetchStockItems(DEFAULT_FILTERS, 'production', option.toLowerCase() as TStockStatus),
    enabled: option === 'Pending',
  });

  const {
    data: completedItems,
    isLoading: completedItemsLoading,
    error: completedItemError,
  } = useQuery({
    queryKey: ['production-items', option, filters.page, filters.search],
    queryFn: () => fetchCompletedItems(DEFAULT_FILTERS),
    enabled: option === 'Completed',
  });

  const {
    data: damagedItems,
    isLoading: damagedItemsLoading,
    error: damagedItemsError,
  } = useQuery({
    queryKey: ['production-items', option, filters.page, filters.search],
    queryFn: () => fetchDamagedItems('production', DEFAULT_FILTERS),
    enabled: option === 'Damaged',
  });
  useEffect(() => {
    if (stockItemError) {
      toastApi.open({
        content: stockItemError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
    if (completedItemError) {
      toastApi.open({
        content: completedItemError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
    if (damagedItemsError) {
      toastApi.open({
        content: damagedItemsError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [stockItemError, completedItemError, damagedItemsError]);

  const columns = useMemo(() => getColumns(option.toLowerCase()), [option]);
  const data: any = option === 'Completed' ? completedItems : option === 'Damaged' ? damagedItems : stockItems;
  return (
    <>
      <Space direction="vertical" style={styles.space}>
        <Card>
          <Row style={styles.actionBar}>
            <div>
              <Space>
                <Button onClick={() => setRequestModal(true)}>Request Items</Button>
                <Button onClick={() => setCompleteItemsModal(true)}>Complete Items</Button>
                <Button onClick={() => setShowDamageModal(true)}>Damage Items</Button>
              </Space>
            </div>

            <div>
              <Segmented value={option} onChange={(value) => setOption(value)} options={options} />
            </div>
          </Row>
        </Card>
        <Table
          loading={stockItemLoading || completedItemsLoading || damagedItemsLoading}
          columns={columns}
          rowKey={'id'}
          pagination={{
            pageSize: PAGE_SIZES.INVENTORY,
            total: data?.count || 0,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
          dataSource={data?.records || []}
        />
      </Space>
      {completeItemsModal && (
        <CompleteItemsModal open={completeItemsModal} onCancel={() => setCompleteItemsModal(false)} />
      )}
      {showDamageModal && <DamageItemsModal open={showDamageModal} onCancel={() => setShowDamageModal(false)} />}
      {requestModal && <RequestItemsModal open={requestModal} onCancel={() => setRequestModal(false)} />}
    </>
  );
};

export default Production;

const styles = StyleSheet.create({
  space: {
    width: '100%',
  },
  actionBar: {
    justifyContent: 'space-between',
  },
});
