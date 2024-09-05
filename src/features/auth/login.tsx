import { KEY_CODES } from '@configs/keycodes';
import { TUserLoginRequest } from '@configs/types/api.types.ts';
import { useMutation } from '@tanstack/react-query';
import { Button, Card, Checkbox, Flex, Form, Input, theme, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import isEmpty from 'lodash/isEmpty';
import { CSSProperties, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router';
import { userLogin } from './services/auth.service.ts';

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
const Login = () => {
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const navigate = useNavigate();
  const styles = useStyle();
  const { Title, Text } = Typography;
  const {
    token: { 'blue-6': primary },
  } = theme.useToken();
  const [form] = useForm();

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: TUserLoginRequest) => userLogin({ username, password }),
    onSuccess: (data) => {
      if (data.token) directToDashboard(data.token);
      form.resetFields();
    },
    onError: (error) => {
      console.log('error', error);
      form.resetFields();
    },
  });

  useEffect(() => {
    if (localStorage.getItem(KEY_CODES.AUTH_TOKEN)) {
      navigate('/dashboard');
      return;
    }
    const isRemember = localStorage.getItem(KEY_CODES.REMEMBER);
    if (isRemember && !isEmpty(isRemember)) {
      form.setFieldsValue(JSON.parse(isRemember));
    }
  }, []);

  const directToDashboard = (token: string) => {
    localStorage.setItem(KEY_CODES.AUTH_TOKEN, token);
    navigate('/dashboard');
    if (form.getFieldValue('remember')) {
      localStorage.setItem(KEY_CODES.REMEMBER, JSON.stringify(form.getFieldsValue()));
      return;
    }
    localStorage.removeItem(KEY_CODES.REMEMBER);
  };

  const onLogin = async () => {
    const payload = form.getFieldsValue();
    delete payload.remember;
    loginMutation.mutate(payload);
  };

  return (
    <Flex style={styles.container}>
      <Card style={styles.card}>
        <Flex style={styles.loginContainer} justify="space-between" gap={'16px'}>
          {!isMobile && (
            <Flex
              vertical
              style={{
                width: '50%',
                backgroundColor: primary,
                borderRadius: '8px',
                paddingLeft: '16px',
              }}
              justify="center"
            >
              <Title level={2} style={{ color: 'white' }}>
                Start your journey with us.
              </Title>
              <Text style={{ color: 'white' }}>
                It brings together your tasks, projects, timelines, files, and more
              </Text>
            </Flex>
          )}

          <Flex
            vertical
            style={{
              width: !isMobile ? '50%' : '100%',
              justifyContent: 'center',
            }}
          >
            <Flex vertical style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: primary }}>
                Welcome Back!
              </Title>
              <Text>Sign in to continue</Text>
            </Flex>

            <Form layout="vertical" form={form} onFinish={onLogin}>
              <Form.Item<FieldType>
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item<FieldType> name="remember" valuePropName="checked">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType={'submit'}
                  style={styles.button}
                  onClick={() =>
                    form
                      .validateFields()
                      .then(() => {})
                      .catch(() => {})
                  }
                >
                  Login
                </Button>
              </Form.Item>
              <a>Forgot your password?</a>
            </Form>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

const useStyle = () => {
  return {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    } as CSSProperties,
    card: {
      width: '1100px',
      height: '650px',
      alignContent: 'center',
    } as CSSProperties,
    loginContainer: {
      width: '100%',
      height: '68vh',
    },
    loginLeft: {
      flex: 1,
      background: 'red',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    } as CSSProperties,
    leftContent: {
      textAlign: 'center',
      padding: '20px',
      color: '#1677ff',
    } as CSSProperties,
    button: { width: '100%' } as CSSProperties,
  };
};

export default Login;
