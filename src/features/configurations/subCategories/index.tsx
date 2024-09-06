import { PlusCircleOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants';
import { TProductSubCategories } from '@features/configurations/configs/types';
import ProductSubCategoriesForm from '@features/configurations/subCategories/components/ProductSubCategoriesForm';
import { useToastApi } from '@hooks/useToastApi';
import { useQuery } from '@tanstack/react-query';
import { Button, Row, TableProps, Tag } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';
import { fetchSubCategories } from './services';

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
    title: 'Category',
    dataIndex: 'ategory',
    key: 'category',
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
        <Tag color={status ? 'green' : 'red'} key={`product_subcategory_${itemId}`}>
          {status ? 'Active' : 'InActive'}
        </Tag>
      </div>
    ),
  },
];

const ProductSubCategory = () => {
  const styles = useStyles();
  const toast = useToastApi();
  const [showProdSubCategoryModal, setShowProdSubCategoryModal] = useState<boolean>(false);
  const [selectedProdSubCategory, setSelectedProdSubCategory] = useState<TProductSubCategories | null>(null);

  const {
    data: subCategories,
    isLoading: subCategoriesIsLoading,
    error: subCategoriesError,
  } = useQuery({
    queryKey: ['subCategories'],
    queryFn: () => fetchSubCategories(1),
  });
  useEffect(() => {
    if (subCategoriesError) {
      toast.open({
        content: subCategoriesError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [subCategoriesError]);

  return (
    <>
      <Row style={styles.searchRow}>
        <Button onClick={() => setShowProdSubCategoryModal(true)} type="primary">
          <PlusCircleOutlined /> Add new subcategory
        </Button>
      </Row>
      <Table
        onRow={(record) => ({
          onClick: () => {
            setShowProdSubCategoryModal(true);
            setSelectedProdSubCategory(record as any);
          },
        })}
        loading={subCategoriesIsLoading}
        rowKey={'id'}
        columns={columns}
        dataSource={subCategories}
      />
      {showProdSubCategoryModal && (
        <ProductSubCategoriesForm
          subCategory={selectedProdSubCategory}
          visible={showProdSubCategoryModal}
          onCancel={() => {
            setShowProdSubCategoryModal(false);
            setSelectedProdSubCategory(null);
          }}
        />
      )}
    </>
  );
};

export default ProductSubCategory;

const useStyles = () => {
  return {
    searchRow: {
      float: 'right',
      marginTop: 8,
      marginBottom: 8,
    } as CSSProperties,
  };
};
