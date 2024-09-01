/** @format */

import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import FooterNav from '@components/Nav/FooterNav';
import HeaderNav from '@components/Nav/HeaderNav';
import SideNav from '@components/Nav/SideNav';
import { NProgress } from '@components/Nprogress';
import { PageHeader } from '@components/PageHeader/PageHeader';
import Time from '@components/Time';
import { ROUTES } from '@configs/routes';
import { findRouteByPath } from '@utils/index';
import { Button, Flex, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

type TLayout = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: TLayout) => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const nodeRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [navFill, setNavFill] = useState<boolean>(false);
  const styles = useStyles(collapsed, navFill);

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

  const activePage = ROUTES.find((route) => route.path === pathname);

  const breadcrumbObj = useMemo(() => {
    const routes = findRouteByPath(ROUTES, pathname);
    return [
      {
        title:
          routes?.sub?.path && routes?.sub?.name ? (
            <Link to={routes?.sub?.path}>{routes?.sub?.name}</Link>
          ) : (
            <Link to={routes?.main?.path}>{routes?.main?.name}</Link>
          ),
      },
    ];
  }, [pathname]);

  return (
    <>
      <NProgress isAnimating={isLoading} key={location.key} />
      <Layout style={styles.mainLayout}>
        <SideNav
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={styles.sideNav}
        />
        <Layout>
          <HeaderNav style={styles.headerNav}>
            <Flex align="center">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={styles.collapsButton}
              />
            </Flex>
            <Flex align="center" gap="small">
              <Time />
            </Flex>
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
                      <PageHeader title={activePage?.name || ''} breadcrumbs={breadcrumbObj} />
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

const useStyles = (collapsed: boolean, navFill: boolean) => {
  return {
    mainLayout: {
      minHeight: '100vh',
    } as CSSProperties,
    headerNav: {
      marginLeft: collapsed ? '50px' : '200px',
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
      marginLeft: collapsed ? '40px' : 0,
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
      margin: `0 0 0 ${collapsed ? 0 : '200px'}`,
      transition: 'all .25s',
      padding: '10px 32px',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      backgroundColor: 'rgb(235, 237, 240)',
    } as CSSProperties,
    collapsButton: { fontSize: '16px', width: 64, height: 64 } as CSSProperties,
    footer: {
      textAlign: 'center',
      marginLeft: collapsed ? 0 : '200px',
      background: 'white',
    } as CSSProperties,
  };
};
