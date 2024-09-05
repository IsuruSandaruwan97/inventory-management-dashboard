import { BackwardOutlined } from '@ant-design/icons';
import { ScrollToTop } from '@components/ScrollToTop';
import { Button, Layout, Result } from 'antd';
import { Content } from 'antd/es/layout/layout';
import isEmpty from 'lodash/isEmpty';

import { CSSProperties, ReactNode, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import './App.css';

import { NSpinner } from '@components/Nprogress';
import { KEY_CODES } from '@configs/keycodes';
import { ROUTES } from '@configs/routes';
import Login from '@features/auth/login';
import { useToastApi } from '@hooks/useToastApi';
import DashboardLayout from '@layouts/index';

type TPageWrapper = {
  children: ReactNode;
};
const PageWrapper = ({ children }: TPageWrapper) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toastApi = useToastApi();
  useEffect(() => {
    if (isEmpty(localStorage.getItem(KEY_CODES.AUTH_TOKEN))) {
      toastApi.error('You should login to the system');
      navigate('/');
    }
  }, [location?.pathname]);
  return (
    <DashboardLayout>
      <Suspense fallback={<NSpinner />}>{children}</Suspense>
    </DashboardLayout>
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
                <>
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
                </>
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
