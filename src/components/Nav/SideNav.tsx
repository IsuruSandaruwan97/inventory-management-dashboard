import { ExperimentOutlined } from '@ant-design/icons';
import { COLOR } from '@configs/colors';
import { TRoutes } from '@configs/routes.tsx';
import { StyleSheet } from '@configs/stylesheet';
import { getPendingReqCount } from '@services';
import { useQuery } from '@tanstack/react-query';
import { getJwtData } from '@utils/index.ts';
import { Badge, ConfigProvider, Menu, MenuProps, SiderProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import isEmpty from 'lodash/isEmpty';
import { Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

type SideNavProps = SiderProps & { collapsed: boolean; routes: TRoutes[] };
type MenuItem = Required<MenuProps>['items'][number];
const getItem = (label: ReactNode, key: Key, icon?: ReactNode, children?: MenuItem[], type?: 'group'): MenuItem => {
  return {
    key,
    icon,
    label,
    children,
    type,
  } as MenuItem;
};

const rootSubmenuKeys = ['/settings', '/stock', '/user-profile'];

const getNavbarItems = (
  routes: TRoutes[],
  count: number | undefined,
  isSideNav: boolean = false
): MenuProps['items'] => {
  if (count || count === 0) {
    routes.find(({ children, name }) => {
      if (name === 'Stock' && children && !isEmpty(children)) {
        const index = children?.findIndex((child) => child.key === '/requests');

        if (index > -1 && isSideNav) {
          // @ts-ignore
          children[index].label = (
            <Badge status={'success'} offset={[10, 0]} color={'red'} count={count} size={'small'} showZero={true}>
              {children[index].label}
            </Badge>
          );
        }
      }
    });
  }
  return routes?.map((route) => {
    return getItem(route.name, route.path, route.icon, route.children);
  });
};

const SideNav = ({ collapsed, routes, ...others }: SideNavProps) => {
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>();
  const [current, setCurrent] = useState<string>('');
  const [count, setCount] = useState<number>(0);

  const isStockManager = (): boolean => {
    const { role } = getJwtData();
    return role && (role.includes('stock_manager') || role.includes('admin'));
  };

  const { data: reqCount } = useQuery({
    queryKey: ['request-count', pathname],
    queryFn: () => getPendingReqCount(),
    enabled: isStockManager(),
  });
  useEffect(() => {
    const paths = pathname.split('/');
    setOpenKeys(paths);
    setCurrent(`/${paths[paths.length - 1]}`);
  }, [pathname]);

  useEffect(() => {
    if (reqCount && Number.isInteger(Number(reqCount))) setCount(reqCount);
  }, [reqCount]);

  useEffect(() => {
    let socket;
    if (!isStockManager()) {
      return;
    }
    socket = io(import.meta.env.VITE_API_URL.replace(/\/$/, ''));
    socket.on('message', (message) => {
      try {
        const reqCount = Number(message);
        if (Number.isInteger(reqCount)) setCount(reqCount);
      } catch (e) {}
    });
    return () => {
      socket?.disconnect();
    };
  }, []);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key) navigate(key);
  };

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys?.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
      return;
    }
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const items = useMemo(() => getNavbarItems(routes, count, true), [routes, count]);

  return (
    <Sider ref={nodeRef} breakpoint="lg" collapsedWidth="50" collapsed={collapsed} {...others}>
      <div style={styles.logo}>
        <ExperimentOutlined style={{ fontSize: 26 }} />
      </div>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemSelectedBg: COLOR['100'],
              itemHoverBg: COLOR['50'],
              itemSelectedColor: COLOR['600'],
            },
          },
        }}
      >
        <Menu
          key={'key'}
          mode="inline"
          items={items}
          onClick={onClick}
          openKeys={!collapsed ? rootSubmenuKeys : openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={[current]}
          style={styles.menuContainer}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default SideNav;

const styles = StyleSheet.create({
  menuContainer: {
    border: 'none',
    minHeight: '100vh',
  },
  logo: {
    height: '5em',
    backgroundColor: 'white',
    textAlign: 'center',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: 'transparent',
    color: 'transparent',
    border: 'none',
    boxShadow: 'none',
  },
});
