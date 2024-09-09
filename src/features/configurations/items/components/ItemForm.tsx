import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { TStockData } from '@features/stock/Inventory';

import NumberInput from '@components/NumberInput.tsx';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { TStockItems } from '@configs/types/api.types.ts';
import { fetchCategories } from '@features/configurations/categories/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Flex, Form, Input, Modal, Select, Switch, Upload } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';
import { fetchSubCategories } from '../../subCategories/services';
import { createStockItems, updateStockItems } from '../services';

const { TextArea } = Input;

type ItemFormProps = {
  item?: TStockData | null;
  visible: boolean;
  isUpdate: boolean;
  onCancel: () => void;
  mode?: 'admin' | 'stock';
};

const uploadButton = (loading: boolean) => (
  <button style={{ border: 0, background: 'none' }} type="button">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

const ItemForm = ({ item, visible, isUpdate, onCancel }: ItemFormProps) => {
  const [form] = Form.useForm();
  const toast = useToastApi();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<number | null>(null);

  useEffect(() => {
    if (!isEmpty(item)) {
      form.setFieldsValue(item);
      return;
    }
    form.setFieldValue('status', true);
  }, [item]);

  const { data: categories, isLoading: categoriesIsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchCategories(),
  });

  const { data: subCategories, isLoading: subCategoriesIsLoading } = useQuery({
    queryKey: ['subCategories', category],
    queryFn: () => fetchSubCategories(category),
  });

  const updateFormMutation = useMutation({
    mutationFn: (payload: TStockItems) => updateStockItems(payload),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['stock-items'] });
    },
    onError: (error) => {
      toast.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  const createFormMutation = useMutation({
    mutationFn: (payload: TStockItems) => createStockItems(payload),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['stock-items'] });
    },
    onError: (error) => {
      toast.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  const itemCategories = useMemo(() => {
    return categories?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [categories]);

  const itemSubCategories = useMemo(() => {
    return subCategories?.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [subCategories]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = () => {
    const formValues = form.getFieldsValue();
    const payload = {
      description: formValues.description,
      reorder_level: formValues.reorderLevel,
      name: formValues.name,
      code: formValues.itemId,
      image: formValues.image,
      status: formValues.status,
      ...(!isUpdate && {
        category: formValues.category,
        sub_category: formValues.subCategory,
      }),
    };
    if (!isUpdate) {
      createFormMutation.mutate(payload as TStockItems);
      return;
    }
    if (!item?.id) {
      toast.open({
        content: DEFAULT_ERROR_MESSAGE,
        duration: 4,
        type: 'error',
      });
      onClose();
      return;
    }
    updateFormMutation.mutate({ ...payload, id: item.id } as TStockItems);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={!isUpdate ? 'Add new item' : `Update ${item?.name || '-'}`}
      footer={null}
      closeIcon={false}
    >
      <Divider />
      <Form form={form} layout="horizontal" onFinish={onFinish} {...{ labelCol: { span: 6 } }}>
        <Form.Item label={'Item Code'} name={'itemId'} rules={[{ required: true, message: 'Item ID is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Item Name'} name={'name'} rules={[{ required: true, message: 'Item Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={'Description'}
          name={'description'}
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label={'Category'} name={'category'} rules={[{ required: true, message: 'Category is required' }]}>
          <Select
            onChange={(value) => setCategory(value)}
            onClear={() => setCategory(null)}
            disabled={isUpdate}
            options={itemCategories}
            loading={categoriesIsLoading}
          />
        </Form.Item>
        <Form.Item
          label={'Sub Category'}
          name={'subCategory'}
          rules={[{ required: true, message: 'Sub Category is required' }]}
        >
          <Select disabled={isUpdate || !category} options={itemSubCategories} loading={subCategoriesIsLoading} />
        </Form.Item>
        <Form.Item
          label={'Reorder Level'}
          name={'reorderLevel'}
          rules={[{ required: true, message: 'Reorder Level is required' }]}
        >
          <NumberInput />
        </Form.Item>

        <Form.Item label={'Image'} name={'image'}>
          <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false}>
            {item?.image ? (
              <img src={item.image} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton(updateFormMutation.isPending)
            )}
          </Upload>
        </Form.Item>

        <Form.Item label={'Status'} name={'status'}>
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Flex justify="end" gap={8}>
          <Form.Item style={{ marginBottom: '4px' }}>
            <Button type="default" onClick={onCancel} loading={updateFormMutation.isPending}>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: '4px' }}>
            <Button
              loading={updateFormMutation.isPending}
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
export default ItemForm;
