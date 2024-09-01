/** @format */

import { StyleSheet } from '@configs/stylesheet';
import { Button, Flex, Form, Input, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ModalProps } from 'antd/es/modal/interface';
import { useState } from 'react';

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
  const [loading, setLoading] = useState<boolean>(false);
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

  return (
    <>
      <Modal
        footer={null}
        title={'Mark Damaged Items'}
        onCancel={() => onCancelForm()}
        onClose={() => onCancelForm()}
        {...others}
      >
        <Form initialValues={{ quantity: 1 }} {...formItemLayout} style={styles.form} onFinish={onSubmit}>
          <Form.Item label="Item" name="item" rules={[{ required: true, message: 'Please select an Item!' }]}>
            <Input placeholder="Select Item" style={styles.fullWidth} />
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
