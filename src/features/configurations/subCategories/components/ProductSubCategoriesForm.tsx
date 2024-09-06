import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants';
import { queryClient } from '@configs/react-query.config';
import { fetchCategories } from '@features/configurations/categories/services';
import { TProductSubCategories } from '@features/configurations/configs/types';
import { useToastApi } from '@hooks/useToastApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Divider, Flex, Form, Input, Modal, Select, Switch } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { createSubCategory, updateSubCategory } from '../services';

type ProductSubCategoriesFormProps = {
  visible: boolean;
  subCategory: TProductSubCategories | null;
  onCancel: () => void;
};

const ProductSubCategoriesForm = ({ visible, subCategory, onCancel }: ProductSubCategoriesFormProps) => {
  const [form] = Form.useForm();
  const [loading] = useState<boolean>(false);
  const toast = useToastApi();
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
      toast.open({
        content: categoriesError?.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
      });
    }
  }, [categoriesError]);

  useEffect(() => {
    if (!isEmpty(subCategory)) {
      form.setFieldsValue(subCategory);
    }
  }, [subCategory, visible]);

  const productCategories = categories?.map((category) => ({ label: category.name, value: category.id }));
  const isUpdate = !isEmpty(subCategory);
  const subCategoriesMutation = useMutation({
    mutationFn: (payload: TProductSubCategories) =>
      isUpdate ? updateSubCategory(payload) : createSubCategory(payload),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        content: 'Subcategory has been updated successfully',
        duration: 4,
      });
      await queryClient.invalidateQueries({ queryKey: ['subCategories'] });
      onClose();
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
    if (isUpdate) {
      subCategoriesMutation.mutate({ ...form.getFieldsValue(), id: subCategory.id });

      return;
    }
    subCategoriesMutation.mutate(form.getFieldsValue());
  };
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={!isUpdate ? 'Add new product subcategory' : `Update ${subCategory.name}`}
      footer={null}
      closeIcon={false}
    >
      <Divider />
      <Form form={form} layout="horizontal" onFinish={onFinish} labelCol={{ span: 6 }}>
        <Form.Item label={'Name'} name={'name'} rules={[{ required: true, message: 'Subcategory name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Category'} name={'category'} rules={[{ required: true, message: 'Category is required' }]}>
          <Select loading={categoriesIsLoading} options={productCategories} />
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
