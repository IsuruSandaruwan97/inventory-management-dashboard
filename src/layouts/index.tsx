import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import FooterNav from '@components/Nav/FooterNav';
import HeaderNav from '@components/Nav/HeaderNav';
import SideNav from '@components/Nav/SideNav';
import { NProgress } from '@components/Nprogress';
import { PageHeader } from '@components/PageHeader/PageHeader';
import Time from '@components/Time';
import { DEFAULT_ERROR_MESSAGE } from '@configs/constants/api.constants.ts';
import { KEY_CODES } from '@configs/keycodes.ts';
import { ROUTES } from '@configs/routes';
import { getRouts } from '@configs/routes.tsx';
import { userLogout } from '@features/auth/services/auth.service.ts';
import { useToastApi } from '@hooks/useToastApi.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findRouteByPath } from '@utils/index';
import { getJwtData } from '@utils/index.ts';
import { Avatar, Button, Dropdown, Flex, Layout, MenuProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import isEmpty from 'lodash/isEmpty';
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

type TLayout = {
  children: ReactNode;
};

const getMenuItems = (onClick: any): MenuProps['items'] => {
  return [
    {
      key: 'user-logout',
      label: <span style={{ color: 'red' }}>Logout</span>,
      icon: <LogoutOutlined style={{ color: 'red' }} />,
      onClick,
    },
  ];
};

const DashboardLayout = ({ children }: TLayout) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const nodeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [navFill, setNavFill] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const toast = useToastApi();
  const { name } = getJwtData();
  const token = localStorage?.getItem(KEY_CODES.AUTH_TOKEN);
  const routes = useMemo(() => {
    const defaultRole = token ? getJwtData().role : 'user';
    return getRouts(defaultRole);
  }, [token]);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 5) {
        setNavFill(true);
        return;
      }
      setNavFill(false);
    });
  }, []);

  const logoutMutation = useMutation({
    mutationFn: () => userLogout(),
    onSuccess: async () => {
      onLogoutSuccess().then(() => {
        toast.open({
          type: 'success',
          content: 'Successfully Logged out!!',
          duration: 4,
        });
      });
    },
    onError: () => {
      toast.open({
        type: 'error',
        content: DEFAULT_ERROR_MESSAGE,
        duration: 4,
      });
    },
  });

  const onLogoutSuccess = async () => {
    setIsLoading(true);
    localStorage.removeItem(KEY_CODES.AUTH_TOKEN);
    localStorage.removeItem(KEY_CODES.REFRESH_TOKEN);
    queryClient.clear();
    await queryClient.resetQueries();
    setTimeout(() => setIsLoading(false), 2000);
    navigate('/');
  };

  const activePage = ROUTES.find((route) => route.path === pathname);

  const breadcrumbObj = useMemo(() => {
    function convertSubRoute(path: string) {
      return path?.toString()?.replace(/\//g, '');
    }

    const routes = findRouteByPath(ROUTES, pathname);

    return [
      {
        title:
          routes?.sub?.path && routes?.sub?.name ? (
            <Link to={routes?.sub?.path}>
              {typeof routes?.sub?.name === 'object' ? convertSubRoute(routes?.sub?.path) : routes?.sub?.name}
            </Link>
          ) : (
            <Link to={routes?.main?.path}>{routes?.main?.name}</Link>
          ),
      },
    ];
  }, [pathname]);

  const menuItems = useMemo(() => getMenuItems(() => logoutMutation.mutate()), [logoutMutation]);
  const sideNavVisible: boolean = useMemo(() => {
    return routes?.length > 1 || (routes?.length === 1 && !isEmpty(routes[0].children));
  }, [routes]);
  const styles = useStyles(collapsed, navFill, !sideNavVisible);
  return (
    <>
      <NProgress isAnimating={isLoading} key={location.key} />
      <Layout style={styles.mainLayout}>
        {sideNavVisible && (
          <SideNav
            trigger={null}
            collapsible
            routes={routes}
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={styles.sideNav}
          />
        )}
        <Layout>
          <HeaderNav style={styles.headerNav}>
            <Flex align="center">
              {sideNavVisible ? (
                <Button
                  type="text"
                  icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={styles.collapseButton}
                />
              ) : (
                <div />
              )}
            </Flex>
            <Flex align="center" gap="small">
              <Time />
            </Flex>

            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <Flex style={styles.profileDropdown}>
                {name ? (
                  <Avatar className={'profileDropdown'}>{name.slice(0, 2)?.toUpperCase()}</Avatar>
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )}
              </Flex>
            </Dropdown>
          </HeaderNav>
          <Content style={styles.content}>
            <TransitionGroup>
              <SwitchTransition>
                <CSSTransition
                  key={`css-transition-${location.key}`}
                  nodeRef={nodeRef}
                  onEnter={() => {
                    setIsLoading(true);
                  }}
                  onEntered={() => {
                    setIsLoading(false);
                  }}
                  timeout={300}
                  classNames="bottom-to-top"
                  unmountOnExit
                >
                  {() => (
                    <div ref={nodeRef} style={styles.childrenContainer}>
                      <PageHeader
                        title={
                          breadcrumbObj[0]?.title?.props?.children
                            ? breadcrumbObj[0]?.title?.props?.children
                            : activePage?.name || ''
                        }
                        breadcrumbs={breadcrumbObj}
                      />
                      {children}
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </TransitionGroup>
          </Content>

          <FooterNav style={styles.footer} />
        </Layout>
      </Layout>
    </>
  );
};

export default DashboardLayout;

const useStyles = (collapsed: boolean, navFill: boolean, isFull: boolean = false) => {
  return {
    mainLayout: {
      minHeight: '100vh',
    } as CSSProperties,
    headerNav: {
      marginLeft: isFull ? 0 : collapsed ? '50px' : '200px',
      padding: '0 10px 0 0',
      background: 'white',
      backdropFilter: navFill ? 'blur(8px)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      top: 0,
      zIndex: 1,
      gap: 8,
      transition: 'all .25s',
    } as CSSProperties,
    childrenContainer: {
      marginLeft: isFull ? 0 : collapsed ? '40px' : 0,
      background: 'transparent',
    },
    sideNav: {
      overflow: 'hidden',
      position: 'fixed',
      left: 0,
      top: 0,
      bottom: 0,
      background: 'none',
      border: 'none',
      transition: 'all .2s',
    } as CSSProperties,
    content: {
      margin: isFull ? 0 : `0 0 0 ${collapsed ? 0 : '200px'}`,
      transition: 'all .25s',
      padding: '10px 32px',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: 'rgb(235, 237, 240)',
    } as CSSProperties,
    collapseButton: { fontSize: '16px', width: 64, height: 64 } as CSSProperties,
    footer: {
      textAlign: 'center',
      marginLeft: isFull ? 0 : collapsed ? 0 : '200px',
      background: 'white',
    } as CSSProperties,
    profileDropdown: {
      cursor: 'pointer',
    } as CSSProperties,
  };
};
