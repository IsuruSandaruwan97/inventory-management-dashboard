import { Button, Divider, Flex, Form, Input, message, Modal, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';

import CopyOutlined from '@ant-design/icons/lib/icons/CopyOutlined';
import { userRoles } from '@data/users';
import { TUsers } from '@features/users';
import { randomPassword } from '@utils/index';
import isEmpty from 'lodash/isEmpty';

type UserFormProps = {
  visible: boolean;
  user: TUsers | null;
  onCancel: () => void;
  onInsertUser: (user: TUsers) => void;
  onUpdateUser: (user: TUsers) => void;
};

const UserForm = ({ visible, user, onCancel, onInsertUser, onUpdateUser }: UserFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (!isEmpty(user)) {
      form.setFieldsValue(user);
    }
    if (visible && isEmpty(user)) {
      form.setFieldValue('tmpPassword', randomPassword(12));
    }
  }, [user, visible]);

  const onClose = () => {
    form.resetFields();
    onCancel();
  };
  const isUpdate = !isEmpty(user);
  const onFinish = () => {
    let newUser = form.getFieldsValue();
    newUser = { ...newUser, status: true };
    if (isUpdate) {
      onUpdateUser(newUser);
      onCancel();
      return;
    }
    onInsertUser(newUser);
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      onClose={onClose}
      title={!isUpdate ? 'Add new user' : `Update ${user.name}`}
      footer={null}
      closeIcon={false}
    >
      <Divider />
      <Form form={form} layout="horizontal" onFinish={onFinish} {...{ labelCol: { span: 6 } }}>
        <Form.Item
          label={'Employee ID'}
          name={'empId'}
          rules={[{ required: true, message: 'Employee ID is required' }]}
        >
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item label={'Name'} name={'name'} rules={[{ required: true, message: 'Employee name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label={'Mobile'} name={'mobile'} rules={[{ required: true, message: 'Mobile number is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={'Address'}
          name={'address'}
          rules={[{ required: true, message: 'Address number is required' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={'Role'} name={'role'} rules={[{ required: true, message: 'User role is required' }]}>
          <Select defaultValue={'user'} options={userRoles} />
        </Form.Item>

        <Form.Item label={'Status'} name={'status'}>
          <Switch defaultValue={true} checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        {!isUpdate && (
          <Form.Item
            rules={[{ required: true, message: 'Tempory password is required' }]}
            label={'Password'}
            name={'tmpPassword'}
          >
            <Input
              addonAfter={
                <CopyOutlined
                  onClick={() => {
                    setLoading(true);
                    navigator.clipboard.writeText(form.getFieldValue('tmpPassword'));
                    message.success('Password coppied!');
                    setLoading(false);
                  }}
                />
              }
              defaultValue="mysite"
            />
          </Form.Item>
        )}

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

export default UserForm;
