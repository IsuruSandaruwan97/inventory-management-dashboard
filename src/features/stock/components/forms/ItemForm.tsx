import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { TStockData } from '@features/stock/Inventory';

import NumberInput from '@components/NumberInput.tsx';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { TStockItems } from '@configs/types/api.types.ts';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Divider, Flex, Form, Input, Modal, Switch, Upload } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { updateStockItems } from '../../services';

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

const ItemForm = ({ item, visible, isUpdate, onCancel, mode = 'stock' }: ItemFormProps) => {
  const [form] = Form.useForm();
  const toast = useToastApi();
  const queryClient = useQueryClient();
  const isStock = mode === 'stock';
  useEffect(() => {
    if (!isEmpty(item)) form.setFieldsValue(item);
  }, [item]);

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

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = () => {
    const formValues = form.getFieldsValue();
    if (!item?.id) {
      toast.open({
        content: DEFAULT_ERROR_MESSAGE,
        duration: 4,
        type: 'error',
      });
      onClose();
      return;
    }
    const payload: TStockItems = {
      id: item?.id,
      description: formValues.description,
      quantity: parseInt(String(formValues.quantity)),
      unit_price: parseFloat(formValues.unitPrice),
      ...(!isStock && {}),
    };
    updateFormMutation.mutate(payload);
  };

  const onValueChange = (changeValues: any) => {
    if (
      Object.prototype.hasOwnProperty.call(changeValues, 'quantity') ||
      Object.prototype.hasOwnProperty.call(changeValues, 'unitPrice')
    ) {
      const quantity = changeValues.quantity ?? form.getFieldValue('quantity');
      const unitPrice = changeValues.unitPrice ?? form.getFieldValue('unitPrice');
      form.setFieldValue('totalPrice', quantity * unitPrice);
    }
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
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        {...{ labelCol: { span: 6 } }}
        onValuesChange={onValueChange}
      >
        <Form.Item label={'Item Code'} name={'itemId'} rules={[{ required: true, message: 'Item ID is required' }]}>
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item label={'Item Name'} name={'name'} rules={[{ required: true, message: 'Item Name is required' }]}>
          <Input disabled={isStock} />
        </Form.Item>
        <Form.Item
          label={'Description'}
          name={'description'}
          rules={[{ required: true, message: 'Description is required' }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label={'Category'} name={'category'} rules={[{ required: true, message: 'Category is required' }]}>
          <Input disabled={isStock} />
        </Form.Item>
        <Form.Item
          label={'Sub Category'}
          name={'subCategory'}
          rules={[{ required: true, message: 'Sub Category is required' }]}
        >
          <Input disabled={isStock} />
        </Form.Item>
        <Form.Item
          label={'Reorder Level'}
          name={'reorderLevel'}
          rules={[{ required: true, message: 'Reorder Level is required' }]}
        >
          <NumberInput disabled={isStock} />
        </Form.Item>
        <Form.Item
          label={'Unit Price'}
          name={'unitPrice'}
          rules={[{ required: true, message: 'Unit Price is required' }]}
        >
          <NumberInput addonBefore={'Rs'} currency />
        </Form.Item>
        <Form.Item
          label={'Total Price'}
          name={'totalPrice'}
          rules={[{ required: true, message: 'Total Price is required' }]}
        >
          <NumberInput addonBefore={'Rs'} disabled={true} currency />
        </Form.Item>
        <Form.Item label={'Quantity'} name={'quantity'} rules={[{ required: true, message: 'Quantity is required' }]}>
          <NumberInput />
        </Form.Item>
        {!isStock && (
          <Form.Item label={'Image'} name={'image'} rules={[{ required: true, message: 'Item image is required' }]}>
            <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false}>
              {item?.image ? (
                <img src={item.image} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton(updateFormMutation.isPending)
              )}
            </Upload>
          </Form.Item>
        )}

        <Form.Item label={'Status'} name={'status'}>
          <Switch disabled={isStock} defaultValue={true} checkedChildren="Active" unCheckedChildren="Inactive" />
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
