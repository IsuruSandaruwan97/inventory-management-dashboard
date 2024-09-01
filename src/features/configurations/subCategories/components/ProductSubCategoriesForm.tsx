import { productCategories } from '@data/configurations/product_categories';
import { ProductSubCategoriesDataType } from '@features/configurations/configs/types';
import { Button, Divider, Flex, Form, Input, Modal, Select, Switch } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

type ProductSubCategoriesFormProps = {
  visible: boolean;
  subCategory: ProductSubCategoriesDataType | null;
  onCancel: () => void;
  onInsertSubCategory: (subCategory: ProductSubCategoriesDataType) => void;
  onUpdateSubCategory: (subCategory: ProductSubCategoriesDataType) => void;
};

const ProductSubCategoriesForm = ({
  visible,
  subCategory,
  onCancel,
  onInsertSubCategory,
  onUpdateSubCategory,
}: ProductSubCategoriesFormProps) => {
  const [form] = Form.useForm();
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(subCategory)) {
      form.setFieldsValue(subCategory);
    }
  }, [subCategory, visible]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };
  const isUpdate = !isEmpty(subCategory);
  const onFinish = () => {
    let newSubCategory = form.getFieldsValue();
    newSubCategory = { ...newSubCategory, status: true };
    if (isUpdate) {
      onUpdateSubCategory(newSubCategory);
      onCancel();
      return;
    }
    onInsertSubCategory(newSubCategory);
    onCancel();
  };
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={!isUpdate ? 'Add new product subcategory' : `Update ${subCategory.name}`}
      footer={null}
      closeIcon={false}
    >
      <Divider />
      <Form form={form} layout="horizontal" onFinish={onFinish} labelCol={{ span: 6 }}>
        <Form.Item label={'ID'} name={'itemId'} rules={[{ required: true, message: 'Subcategory ID is required' }]}>
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item label={'Name'} name={'name'} rules={[{ required: true, message: 'Subcategory name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Category'} name={'catName'} rules={[{ required: true, message: 'Category is required' }]}>
          <Select defaultValue={'bottle'} options={productCategories} />
        </Form.Item>
        <Form.Item label={'Code'} name={'code'} rules={[{ required: true, message: 'Code is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Status'} name={'status'}>
          <Switch defaultValue={true} checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <Flex justify="end" gap={8}>
          <Form.Item style={{ marginBottom: '4px' }}>
            <Button type="default" onClick={onCancel} loading={loading}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: '4px' }}>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              onClick={() => {
                form
                  .validateFields()
                  .then(() => {})
                  .catch(() => {});
              }}
            >
              {isUpdate ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ProductSubCategoriesForm;
