import { PlusCircleOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants';
import { TProductSubCategories } from '@features/configurations/configs/types';
import ProductSubCategoriesForm from '@features/configurations/subCategories/components/ProductSubCategoriesForm';
import { useToastApi } from '@hooks/useToastApi';
import { useQuery } from '@tanstack/react-query';
import { Button, Row, Space, TableProps, Tag } from 'antd';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { fetchCategories } from '../categories/services';
import { fetchSubCategories } from './services';

const getColumns = (categories: any): TableProps<any>['columns'] => {
  return [
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
      dataIndex: 'categoryName',
      key: 'categoryName',
      filters: categories,
      onFilter: (value: any, record) => record?.category === value,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (_, { type }) => {
        return (
          <Space>
            {type?.map((item: string, i: number) => (
              <Tag key={i} color={'default'} className={'first-letter'}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
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
};

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
    queryFn: () => fetchSubCategories(),
  });

  const {
    data: categories,
    isLoading: categoriesIsLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const columns = useMemo(() => {
    return getColumns(
      categories?.map((item) => ({
        text: item.name,
        value: item.id,
      }))
    );
  }, [categories]);

  useEffect(() => {
    if (subCategoriesError) {
      toast.open({
        content: categoriesError?.message || subCategoriesError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [subCategoriesError, categoriesError]);

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
        loading={subCategoriesIsLoading || categoriesIsLoading}
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
