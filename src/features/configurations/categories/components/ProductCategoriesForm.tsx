import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants';
import { queryClient } from '@configs/react-query.config';
import { TProductsCategories } from '@features/configurations/configs/types';
import { useToastApi } from '@hooks/useToastApi';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, Flex, Form, Input, Modal, Switch } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { createCategory, updateCategory } from '../services';

type ProductCategoriesFormProps = {
  visible: boolean;
  category: TProductsCategories | null;
  onCancel: () => void;
};

const ProductCategoriesForm = ({ visible, category, onCancel }: ProductCategoriesFormProps) => {
  const [form] = Form.useForm();
  const toast = useToastApi();
  const [loading] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(category)) {
      form.setFieldsValue(category);
    }
  }, [category, visible]);

  const categoryMutation = useMutation({
    mutationFn: (payload: TProductsCategories) =>
      !isEmpty(category) ? updateCategory(payload) : createCategory(payload),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      toast.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = () => {
    if (!isEmpty(category)) {
      categoryMutation.mutate({ ...form.getFieldsValue(), id: category.id });
      return;
    }
    categoryMutation.mutate({ ...form.getFieldsValue() });
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={!!isEmpty(category) ? 'Add new product category' : `Update ${category.name}`}
      footer={null}
      closeIcon={false}
    >
      <Divider />
      <Form form={form} layout="horizontal" onFinish={onFinish} {...{ labelCol: { span: 6 } }}>
        <Form.Item label={'Name'} name={'name'} rules={[{ required: true, message: 'Category name is required' }]}>
          <Input />
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
              {!isEmpty(category) ? 'Update' : 'Submit'}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </Modal>
  );
};
export default ProductCategoriesForm;
