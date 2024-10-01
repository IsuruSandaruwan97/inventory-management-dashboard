import { TStockData } from '@features/stock/Inventory';

import NumberInput from '@components/NumberInput.tsx';
import { AVAILABILITY_TYPES, DEFAULT_ITEM_TYPES } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { TStockItems } from '@configs/types/api.types.ts';
import { fetchCategories } from '@features/configurations/categories/services';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Flex, Form, Input, Modal, Select, Switch } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useMemo, useState } from 'react';
import { createStockItems, updateStockItems } from '../services';

const { TextArea } = Input;

type ItemFormProps = {
  item: TStockData | null;
  visible: boolean;
  isUpdate: boolean;
  onCancel: () => void;
  mode?: 'admin' | 'stock';
  refetch: () => void;
};

const ItemForm = ({ item, visible, isUpdate, onCancel, refetch }: ItemFormProps) => {
  const [form] = Form.useForm();
  const toast = useToastApi();
  const queryClient = useQueryClient();
  const [type, setType] = useState<string | null>(null);

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

  const updateFormMutation = useMutation({
    mutationFn: (payload: TStockItems) => updateStockItems(payload),
    onSuccess: async () => {
      toast.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      onClose();
      await queryClient.invalidateQueries({ queryKey: ['items'] });
      refetch();
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
      await queryClient.invalidateQueries({ queryKey: ['items', 'stock-items'] });
      refetch();
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

  const onClose = () => {
    setType(null);
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
      type: formValues.type,
      availability: formValues.availability,
      image: formValues.image || null,
      status: formValues.status,
      ...(!isUpdate && {
        category: formValues.category,
      }),
    };
    if (!isUpdate) {
      createFormMutation.mutate(payload as any);
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

  const availabilityOptions = useMemo(() => {
    if (type) {
      form.setFieldValue(
        'availability',
        type === 'bottle' ? ['stock', 'production', 'store', 'delivery'] : ['stock', 'production', 'store']
      );
    }
    return type === 'bottle'
      ? AVAILABILITY_TYPES
      : [
          { label: 'Stock', value: 'stock' },
          { label: 'Production', value: 'production' },
          { label: 'Store', value: 'store' },
        ];
  }, [type, form]);

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
          <Input placeholder={'Item code + category after submit'} />
        </Form.Item>
        <Form.Item label={'Item Name'} name={'name'} rules={[{ required: true, message: 'Item Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Type'} name={'type'} rules={[{ required: true, message: 'Type is required' }]}>
          <Select options={DEFAULT_ITEM_TYPES} onChange={(e) => setType(e)} loading={categoriesIsLoading} />
        </Form.Item>
        <Form.Item
          label={'Description'}
          name={'description'}
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label={'Category'} name={'category'} rules={[{ required: true, message: 'Category is required' }]}>
          <Select disabled={isUpdate} options={itemCategories} loading={categoriesIsLoading} mode={'multiple'} />
        </Form.Item>

        <Form.Item
          label={'Reorder Level'}
          name={'reorderLevel'}
          rules={[{ required: true, message: 'Reorder Level is required' }]}
        >
          <NumberInput />
        </Form.Item>

        <Form.Item
          label={'Availability'}
          name={'availability'}
          rules={[{ required: true, message: 'Please select at least one' }]}
        >
          <Select
            disabled={isUpdate || !type || !!(type && type === 'bottle')}
            options={availabilityOptions}
            loading={categoriesIsLoading}
            mode={'multiple'}
          />
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
