import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { StyleSheet } from '@configs/stylesheet';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems } from '@services';
import { useQuery } from '@tanstack/react-query';
import { convertItemObject } from '@utils/index';
import { Button, Flex, Form, Input, Modal, TreeSelect } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal/interface';
import { useEffect, useMemo, useState } from 'react';

const { TextArea } = Input;
type TDamageItemsModal = {
  onCancel: () => void;
} & ModalProps;

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
  },
};

const DamageItemsModal = ({ onCancel, ...others }: TDamageItemsModal) => {
  const [form] = useForm();
  const toastApi = useToastApi();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    data: stockItems,
    isLoading: stockItemLoading,
    error: stockItemError,
  } = useQuery({
    queryKey: ['production-items'],
    queryFn: () => fetchStockItems(DEFAULT_FILTERS, 'production'),
  });
  useEffect(() => {
    if (stockItemError) {
      toastApi.open({
        content: stockItemError.message || DEFAULT_ERROR_MESSAGE,
        type: 'error',
        duration: 4,
      });
    }
  }, [stockItemError]);

  const onCancelForm = () => {
    form.resetFields();
    onCancel();
  };

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onCancelForm();
      setLoading(false);
    }, 1000);
  };

  const dropdownItems = useMemo(() => convertItemObject(stockItems?.records || []), [stockItems?.records]);

  return (
    <>
      <Modal
        footer={null}
        title={'Mark Damaged Items'}
        onCancel={() => onCancelForm()}
        onClose={() => onCancelForm()}
        loading={stockItemLoading}
        {...others}
      >
        <Form initialValues={{ quantity: 1 }} {...formItemLayout} style={styles.form} onFinish={onSubmit}>
          <Form.Item label="Item" name="item" rules={[{ required: true, message: 'Please select an Item!' }]}>
            <TreeSelect treeLine placeholder="Select Item" style={styles.fullWidth} treeData={dropdownItems} />
          </Form.Item>
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please select Quantity!' }]}>
            <Input placeholder="Select Quantity" type="number" style={styles.fullWidth} />
          </Form.Item>
          <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Please type Reason!' }]}>
            <TextArea placeholder="Reason" style={styles.fullWidth} />
          </Form.Item>

          <Flex justify="end" gap={8}>
            <Form.Item style={styles.formButton}>
              <Button type="default" onClick={onCancel} loading={loading}>
                Cancel
              </Button>
            </Form.Item>

            <Form.Item style={styles.formButton}>
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
                Submit
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default DamageItemsModal;

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  form: {
    width: '100%',
  },
  formButton: {
    marginBottom: '4px',
  },
});
