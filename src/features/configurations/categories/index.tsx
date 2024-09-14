import { PlusCircleOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants';
import { StyleSheet } from '@configs/stylesheet';
import { TProductsCategories } from '@features/configurations/configs/types';
import { useToastApi } from '@hooks/useToastApi';
import { useQuery } from '@tanstack/react-query';
import { Button, Row, TableProps, Tag } from 'antd';
import { useEffect, useState } from 'react';
import ProductCategoriesForm from './components/ProductCategoriesForm';
import { fetchCategories } from './services';

const columns: TableProps<any>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category Code',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: (_, { status, itemId }) => (
      <div key={itemId}>
        <Tag color={status ? 'green' : 'red'} key={`product_categtory_${itemId}`}>
          {status ? 'Active' : 'InActive'}
        </Tag>
      </div>
    ),
  },
];

const ProductCategory = () => {
  const [showProdCategoryModal, setShowProdCategoryModal] = useState<boolean>(false);
  const [selectedProdCategory, setSelectedProdCategory] = useState<TProductsCategories | null>(null);
  const toastApi = useToastApi();
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });
  useEffect(() => {
    if (categoriesError) {
      toastApi.open({
        content: categoriesError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [categoriesError]);

  return (
    <div>
      <Row style={styles.searchRow}>
        <Button onClick={() => setShowProdCategoryModal(true)} type="primary">
          <PlusCircleOutlined /> Add new category
        </Button>
      </Row>
      <Table
        loading={categoriesIsLoading}
        onRow={(record) => ({
          onClick: () => {
            setShowProdCategoryModal(true);
            setSelectedProdCategory(record as any);
          },
        })}
        rowKey={'id'}
        columns={columns}
        dataSource={categories}
      />
      {showProdCategoryModal && (
        <ProductCategoriesForm
          category={selectedProdCategory}
          visible={showProdCategoryModal}
          onCancel={() => {
            setShowProdCategoryModal(false);
            setSelectedProdCategory(null);
          }}
        />
      )}
    </div>
  );
};
export default ProductCategory;

const styles = StyleSheet.create({
  searchRow: {
    float: 'right',
    marginTop: 8,
    marginBottom: 8,
  },
});
