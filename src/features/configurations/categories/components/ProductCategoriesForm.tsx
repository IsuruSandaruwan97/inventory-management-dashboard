import { ProductsCategoriesDataType } from '@features/configurations/configs/types';
import { Modal, Divider, Form, Input, Switch, Flex, Button } from 'antd';
import { isEmpty } from 'lodash';
import { useState, useEffect } from 'react';

type ProductCategoriesFormProps = {
  visible: boolean;
  category: ProductsCategoriesDataType | null;
  onCancel: () => void;
  onInsertCategory: (category: ProductsCategoriesDataType) => void;
  onUpdateCategory: (category: ProductsCategoriesDataType) => void;
};

const ProductCategoriesForm = ({
  visible,
  category,
  onCancel,
  onInsertCategory,
  onUpdateCategory,
}: ProductCategoriesFormProps) => {
  const [form] = Form.useForm();
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(category)) {
      form.setFieldsValue(category);
    }
  }, [category, visible]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };
  const isUpdate = !isEmpty(category);
  const onFinish = () => {
    let newCategory = form.getFieldsValue();
    newCategory = { ...newCategory, status: true };
    if (isUpdate) {
      onUpdateCategory(newCategory);
      onCancel();
      return;
    }
    onInsertCategory(newCategory);
    onCancel();
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={!isUpdate ? 'Add new product category' : `Update ${category.name}`}
      footer={null}
      closeIcon={false}>
      <Divider />
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        {...{ labelCol: { span: 6 } }}>
        <Form.Item
          label={'ID'}
          name={'itemId'}
          rules={[{ required: true, message: 'Category ID is required' }]}>
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item
          label={'Name'}
          name={'name'}
          rules={[{ required: true, message: 'Category name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={'Code'}
          name={'code'}
          rules={[{ required: true, message: 'Code is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Status'} name={'status'}>
          <Switch
            defaultValue={true}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
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
              }}>
              {isUpdate ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};
export default ProductCategoriesForm;
