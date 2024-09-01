import { PlusCircleOutlined } from '@ant-design/icons';
import Table from '@components/Table';
import { StyleSheet } from '@configs/stylesheet';
import { productCategoriesData } from '@data/configurations/product_categories';
import { ProductsCategoriesDataType } from '@features/configurations/configs/types';
import { Button, Row, TableProps, Tag } from 'antd';
import { findIndex } from 'lodash';
import { useState } from 'react';
import ProductCategoriesForm from './components/ProductCategoriesForm';

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
  const [productCategories, setProductCategories] = useState<ProductsCategoriesDataType[]>(productCategoriesData);
  const [showProdCategoryModal, setShowProdCategoryModal] = useState<boolean>(false);
  const [selectedProdCategoty, setSelectedProdCategory] = useState<ProductsCategoriesDataType | null>(null);
  return (
    <div>
      <Row style={styles.searchRow}>
        <Button onClick={() => setShowProdCategoryModal(true)} type="primary">
          <PlusCircleOutlined /> Add new category
        </Button>
      </Row>
      <Table
        onRow={(record) => ({
          onClick: () => {
            setShowProdCategoryModal(true);
            setSelectedProdCategory(record as any);
          },
        })}
        rowKey={'id'}
        columns={columns}
        dataSource={productCategories}
      />
      {showProdCategoryModal && (
        <ProductCategoriesForm
          category={selectedProdCategoty}
          visible={showProdCategoryModal}
          onCancel={() => {
            setShowProdCategoryModal(false);
            setSelectedProdCategory(null);
          }}
          onInsertCategory={(productCategory) => {
            setProductCategories([productCategory, ...productCategories]);
          }}
          onUpdateCategory={(productCategory) => {
            const productCategoriesIndex = findIndex(
              productCategories,
              (item) => item.itemId === productCategory.itemId
            );

            if (productCategoriesIndex !== -1) {
              const updatedProductCategories = [
                ...productCategories.slice(0, productCategoriesIndex),
                productCategory,
                ...productCategories.slice(productCategoriesIndex + 1),
              ];
              setProductCategories(updatedProductCategories);
            }
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
