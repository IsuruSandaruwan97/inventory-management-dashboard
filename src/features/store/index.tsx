import { DropboxOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { PAGE_SIZES } from '@configs/index';
import { StyleSheet } from '@configs/stylesheet';
import { TCommonFilters } from '@configs/types/api.types.ts';
import InvoiceModal from '@features/stock/components/InvoiceModal';
import ReturnItemsFormModal from '@features/store/components/forms/ReturnItemsForm';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems } from '@services';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Row, Segmented, Space, TableProps } from 'antd';
import { useEffect, useState } from 'react';

const columns: TableProps<any>['columns'] = [
  {
    title: '#',
    dataIndex: 'itemId',
    key: 'id',
    width: 50,
    fixed: 'left',
    render: (_id, _record, index) => {
      ++index;
      return index;
    },
  },
  {
    title: 'Image',
    dataIndex: 'image',
    key: 'image',
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
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Quantity Available',
    dataIndex: 'quantity',
    key: 'quantity',
  },
];

const options = ['Store', 'Delivery'];
const Store = () => {
  const toastApi = useToastApi();
  const [option, setOption] = useState<string>(options[0]);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [filters, setFilter] = useState<TCommonFilters>({ ...DEFAULT_FILTERS, limit: PAGE_SIZES.INVENTORY });

  const {
    data: storeItems,
    isLoading: storeItemLoading,
    error: storeItemError,
  } = useQuery({
    queryKey: ['store-items', filters.search, filters.page],
    queryFn: () => fetchStockItems(filters, 'store'),
  });

  useEffect(() => {
    if (storeItemError) {
      toastApi.open({
        content: storeItemError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [storeItemError]);

  return (
    <>
      <Card>
        <Row style={styles.actionBar}>
          <div>
            <Space>
              <Button>Delivery Order</Button>
              <Button onClick={() => setShowInvoiceModal(true)}>Invoice</Button>
              <Button onClick={() => setShowReturnModal(true)}>Return Items</Button>
            </Space>
          </div>
          <div>
            <Segmented options={options} value={option} onChange={(value) => setOption(value)} />
          </div>
        </Row>
      </Card>
      <Card style={styles.itemTableCard}>
        <Table
          rowKey={'id'}
          loading={storeItemLoading}
          columns={columns}
          dataSource={storeItems?.records}
          pagination={{
            current: filters.page,
            pageSize: PAGE_SIZES.INVENTORY,
            total: storeItems?.total,
            onChange: (page: number) => {
              setFilter((prev) => ({ ...prev, page }));
            },
          }}
        />
      </Card>
      {showReturnModal && <ReturnItemsFormModal open={showReturnModal} onCancel={() => setShowReturnModal(false)} />}
      {showInvoiceModal && <InvoiceModal open={showInvoiceModal} onClose={() => setShowInvoiceModal(false)} />}
    </>
  );
};

export default Store;

const styles = StyleSheet.create({
  itemTableCard: {
    marginTop: 8,
  },
  actionBar: { justifyContent: 'space-between' },
});
