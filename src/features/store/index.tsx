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
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Row, Segmented, Space, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { fetchStockItems } from '../stock/services';

const columns: TableProps<any>['columns'] = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Item Name',
    dataIndex: 'name',
    key: 'name',
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
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: 'Sub Category',
    dataIndex: 'subCategory',
    key: 'subCategory',
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
          <Space>
            <Button>Delivery Order</Button>
            <Button onClick={() => setShowInvoiceModal(true)}>Invoice</Button>
            <Button onClick={() => setShowReturnModal(true)}>Return Items</Button>
          </Space>
          <Segmented options={options} value={option} onChange={(value) => setOption(value)} />
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
