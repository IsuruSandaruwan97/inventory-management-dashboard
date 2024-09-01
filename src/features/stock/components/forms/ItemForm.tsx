/** @format */

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { TStockData } from '@features/stock/Inventory';

import NumberInput from '@components/NumberInput.tsx';
import { Button, Divider, Flex, Form, Input, Modal, Switch, Upload } from 'antd';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

type ItemFormProps = {
  item?: TStockData | null;
  visible: boolean;
  isUpdate: boolean;
  onCancel: () => void;
};

const uploadButton = (loading: boolean) => (
  <button style={{ border: 0, background: 'none' }} type="button">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

const ItemForm = ({ item, visible, isUpdate, onCancel }: ItemFormProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isEmpty(item)) form.setFieldsValue(item);
  }, [item]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  const onFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onCancel();
    }, 1000);
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
          <Input disabled={isUpdate} />
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
          <Input />
        </Form.Item>
        <Form.Item
          label={'Sub Category'}
          name={'subCategory'}
          rules={[{ required: true, message: 'Sub Category is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'Reorder Level'}
          name={'reOrderLevel'}
          rules={[{ required: true, message: 'Reorder Level is required' }]}
        >
          <NumberInput />
        </Form.Item>
        <Form.Item
          label={'Unit Price'}
          name={'unitPrice'}
          rules={[{ required: true, message: 'Unit Price is required' }]}
        >
          <NumberInput addonBefore={'Rs'} />
        </Form.Item>
        <Form.Item
          label={'Total Price'}
          name={'totalPrice'}
          rules={[{ required: true, message: 'Total Price is required' }]}
        >
          <NumberInput addonBefore={'Rs'} />
        </Form.Item>
        <Form.Item label={'Quantity'} name={'quantity'} rules={[{ required: true, message: 'Quantity is required' }]}>
          <NumberInput addonBefore={'Rs'} />
        </Form.Item>
        <Form.Item label={'Image'} name={'image'} rules={[{ required: true, message: 'Item image is required' }]}>
          <Upload name="avatar" listType="picture-card" className="avatar-uploader" showUploadList={false}>
            {item?.image ? <img src={item.image} alt="avatar" style={{ width: '100%' }} /> : uploadButton(loading)}
          </Upload>
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
export default ItemForm;
