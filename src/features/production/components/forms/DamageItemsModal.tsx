import { DEFAULT_FILTERS } from '@configs/constants';
import { DEFAULT_ERROR_MESSAGE, DEFAULT_SUCCESS_MESSAGE } from '@configs/constants/api.constants.ts';
import { queryClient } from '@configs/react-query.config.ts';
import { StyleSheet } from '@configs/stylesheet';
import { TMarkAsDamaged } from '@configs/types/api.types.ts';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { fetchStockItems, markDamageItems } from '@services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { convertItemObject } from '@utils/index';
import { Button, Flex, Form, Input, InputNumber, Modal, TreeSelect } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal/interface';
import { useEffect, useMemo } from 'react';

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

  const markAsDamaged = useMutation({
    mutationFn: (payload: TMarkAsDamaged) => markDamageItems(payload),
    onSuccess: async () => {
      toastApi.open({
        type: 'success',
        content: DEFAULT_SUCCESS_MESSAGE,
        duration: 4,
      });
      await queryClient.invalidateQueries({ queryKey: ['production-items'] });
      onCancelForm();
    },
    onError: (error) => {
      toastApi.open({
        type: 'error',
        content: error.message || DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

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
    markAsDamaged.mutate({ ...form.getFieldsValue(), type: 'production' });
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
        <Form {...formItemLayout} form={form} style={styles.form} onFinish={onSubmit}>
          <Form.Item label="Item" name="item" rules={[{ required: true, message: 'Please select an Item!' }]}>
            <TreeSelect treeLine placeholder="Select Item" style={styles.fullWidth} treeData={dropdownItems} />
          </Form.Item>
          <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please select Quantity!' }]}>
            <InputNumber placeholder="Select Quantity" type="number" style={styles.fullWidth} />
          </Form.Item>
          <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Please type Reason!' }]}>
            <TextArea placeholder="Reason" style={styles.fullWidth} />
          </Form.Item>

          <Flex justify="end" gap={8}>
            <Form.Item style={styles.formButton}>
              <Button type="default" onClick={onCancel} loading={markAsDamaged.isPending || stockItemLoading}>
                Cancel
              </Button>
            </Form.Item>

            <Form.Item style={styles.formButton}>
              <Button
                loading={markAsDamaged.isPending || stockItemLoading}
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
