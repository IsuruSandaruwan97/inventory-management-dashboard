import { BackwardOutlined } from '@ant-design/icons';
import { ScrollToTop } from '@components/ScrollToTop';
import { Button, Layout, Result } from 'antd';
import { Content } from 'antd/es/layout/layout';
import isEmpty from 'lodash/isEmpty';

import React, { CSSProperties, ReactNode, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import './App.css';

import { NSpinner } from '@components/Nprogress';
import { KEY_CODES } from '@configs/keycodes';
import { ROUTES } from '@configs/routes';
import Login from '@features/auth/login';
import Pin from '@features/auth/pin.tsx';
import { useToastApi } from '@hooks/useToastApi';
import DashboardLayout from '@layouts/index';
import { decryptData, encryptData, getJwtData, validatePin } from '@utils/index';
import { useIdleTimer } from 'react-idle-timer';

type TPageWrapper = {
  children: ReactNode;
};
const PageWrapper = ({ children }: TPageWrapper) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastApi = useToastApi();
  const [pin, setPin] = useState<boolean>(true);
  const [pinError, setPinError] = useState<boolean>(false);

  const handleOnIdle = () => {
    if (!getJwtData().pin) return;
    localStorage.setItem(KEY_CODES.PIN, encryptData({ pin: false }));
    setPin(false);
  };

  useIdleTimer({
    timeout: 1200000,
    onIdle: handleOnIdle,
    debounce: 500,
    disabled: import.meta.env.VITE_ENABLE_IDLE === 'false',
  });

  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_IDLE === 'false') {
      return;
    }
    if (!localStorage.getItem(KEY_CODES.PIN) || getJwtData().pin) {
      setPin(false);
      return;
    }
    const pinData = decryptData(localStorage.getItem(KEY_CODES.PIN) || '');
    if (!pinData.pin) setPin(false);
  }, []);

  useEffect(() => {
    if (isEmpty(localStorage.getItem(KEY_CODES.AUTH_TOKEN))) {
      toastApi.error('You should login to the system');
      navigate('/');
    }
  }, [location?.pathname, navigate, toastApi]);

  const onAddPin = (code: string) => {
    const isValid = validatePin(code);
    if (!isValid) {
      setPinError(true);
      return;
    }
    localStorage.setItem(KEY_CODES.PIN, encryptData({ pin: true }));
    setPinError(false);
    setPin(true);
  };

  return pin ? (
    <DashboardLayout>
      <Suspense fallback={<NSpinner />}>{children}</Suspense>
    </DashboardLayout>
  ) : (
    <Pin onComplete={onAddPin} error={pinError} onChange={() => setPinError(false)} />
  );
};

function App() {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <Layout style={styles.body}>
      <Content style={styles.mainContainer}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />

          {ROUTES?.map(
            (route, index) =>
              route.path &&
              (route.component || (isEmpty(route.component) && !isEmpty(route.children))) && (
                <React.Fragment key={`item_${index}`}>
                  <Route
                    key={`route_${index}`}
                    path={route.path}
                    element={<PageWrapper children={route.component} />}
                  />
                  {route?.children &&
                    !isEmpty(route?.children) &&
                    route?.children.map((item, i) => (
                      <Route key={`sub_route_${i}`} path={item.key} element={<PageWrapper children={item.element} />} />
                    ))}
                </React.Fragment>
              )
          )}
          <Route
            path="*"
            element={
              <Result
                status={'404'}
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                  <Button onClick={() => navigate(-1)} type="primary" icon={<BackwardOutlined />}>
                    Go Back
                  </Button>
                }
              />
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}

export default App;

const useStyles = () => {
  return {
    body: {
      backgroundColor: 'white',
    } as CSSProperties,
    mainContainer: {
      minHeight: 'calc(100vh - 60px)',
    } as CSSProperties,
  };
};
