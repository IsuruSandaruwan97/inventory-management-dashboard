import { PlusCircleOutlined } from '@ant-design/icons';
import { ProductSubCategoriesDataType } from '@features/configurations/configs/types';
import { productSubCategoriesData } from '@data/configurations/product_categories';
import { Button, Row, TableProps, Tag } from 'antd';
import { useState, CSSProperties } from 'react';
import ProductSubCategoriesForm from '@features/configurations/subCategories/components/ProductSubCategoriesForm';
import { findIndex } from 'lodash';
import Table from '@components/Table';

const columns: TableProps<any>['columns'] = [
  {
    title: 'ID',
    dataIndex: 'itemId',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Category',
    dataIndex: 'catName',
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
        <Tag
          color={status ? 'green' : 'red'}
          key={`product_subcategory_${itemId}`}>
          {status ? 'Active' : 'InActive'}
        </Tag>
      </div>
    ),
  },
];

const ProductSubCategory = () => {
  const styles = useStyles();
  const [productSubCategories, setProductSubCategories] = useState<
    ProductSubCategoriesDataType[]
  >(productSubCategoriesData);
  const [showProdSubCategoryModal, setShowProdSubCategoryModal] =
    useState<boolean>(false);
  const [selectedProdSubCategory, setSelectedProdSubCategory] =
    useState<ProductSubCategoriesDataType | null>(null);

  return (
    <>
      <Row style={styles.searchRow}>
        <Button
          onClick={() => setShowProdSubCategoryModal(true)}
          type="primary">
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
        rowKey={'id'}
        columns={columns}
        dataSource={productSubCategories}
      />
      {showProdSubCategoryModal && (
        <ProductSubCategoriesForm
          subCategory={selectedProdSubCategory}
          visible={showProdSubCategoryModal}
          onCancel={() => {
            setShowProdSubCategoryModal(false);
            setSelectedProdSubCategory(null);
          }}
          onInsertSubCategory={(productSubCategory) => {
            setProductSubCategories([
              productSubCategory,
              ...productSubCategories,
            ]);
          }}
          onUpdateSubCategory={(productSubCategory) => {
            const productSubCategoriesIndex = findIndex(
              productSubCategories,
              (item) => item.itemId === productSubCategory.itemId
            );

            if (productSubCategoriesIndex !== -1) {
              const updatedProductSubCategories = [
                ...productSubCategories.slice(0, productSubCategoriesIndex),
                productSubCategory,
                ...productSubCategories.slice(productSubCategoriesIndex + 1),
              ];
              setProductSubCategories(updatedProductSubCategories);
            }
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
