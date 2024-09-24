import { DropboxOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { StyleSheet } from '@configs/stylesheet';
import { TStockStatus } from '@configs/types/api.types.ts';
import CompleteItemsModal from '@features/production/components/forms/CompleteItemsModal';
import DamageItemsModal from '@features/production/components/forms/DamageItemsModal';
import RequestItemsModal from '@features/production/components/forms/RequestItemsModal';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems } from '@services';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Row, Segmented, Space, TableProps } from 'antd';
import { useEffect, useState } from 'react';

const options = ['Pending', 'Completed', 'Damaged'];

const columns: TableProps<any>['columns'] = [
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
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
  },

  {
    title: 'Quantity Available',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '15%',
  },
];

const Production = () => {
  const toastApi = useToastApi();
  const [option, setOption] = useState<string>('Pending');
  const [completeItemsModal, setCompleteItemsModal] = useState<boolean>(false);
  const [requestModal, setRequestModal] = useState<boolean>(false);
  const [showDamageModal, setShowDamageModal] = useState<boolean>(false);

  const {
    data: stockItems,
    isLoading: stockItemLoading,
    error: stockItemError,
  } = useQuery({
    queryKey: ['production-items', option],
    queryFn: () => fetchStockItems(DEFAULT_FILTERS, 'production', option.toLowerCase() as TStockStatus),
  });

  useEffect(() => {
    if (stockItemError) {
      toastApi.open({
        content: stockItemError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [stockItemError]);

  return (
    <>
      <Space direction="vertical" style={styles.space}>
        <Card>
          <Row style={styles.actionBar}>
            <div>
              <Space>
                <Button onClick={() => setRequestModal(true)}>Request Items</Button>
                <Button onClick={() => setCompleteItemsModal(true)}>Complete Items</Button>
                <Button onClick={() => setShowDamageModal(true)}>Damaged Items</Button>
              </Space>
            </div>

            <div>
              <Segmented value={option} onChange={(value) => setOption(value)} options={options} />
            </div>
          </Row>
        </Card>
        <Table loading={stockItemLoading} columns={columns} rowKey={'id'} dataSource={stockItems?.records || []} />
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
