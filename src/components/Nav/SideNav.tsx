import { ExperimentOutlined } from '@ant-design/icons';
import { COLOR } from '@configs/colors';
import { TRoutes } from '@configs/routes.tsx';
import { getPendingReqCount } from '@services';
import { useQuery } from '@tanstack/react-query';
import { Badge, ConfigProvider, Menu, MenuProps, SiderProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import isEmpty from 'lodash/isEmpty';
import { CSSProperties, Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

const getNavbarItems = (routes: TRoutes[], count: number | undefined): MenuProps['items'] => {
  if (count && count > 0) {
    routes.find(({ children, name }) => {
      if (name === 'Stock' && children && !isEmpty(children)) {
        const index = children?.findIndex((child) => child.key === '/requests');
        if (index > -1) {
          // @ts-ignore
          children[index].label = (
            <Badge offset={[10, 0]} count={count} size={'small'}>
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
  const styles = useStyles();
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>();
  const [current, setCurrent] = useState<string>('');

  const { data: count } = useQuery({
    queryKey: ['request-count', pathname],
    queryFn: () => getPendingReqCount(),
  });
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

  useEffect(() => {
    const paths = pathname.split('/');
    setOpenKeys(paths);
    setCurrent(`/${paths[paths.length - 1]}`);
  }, [pathname]);

  const items = useMemo(() => getNavbarItems(routes, count), [routes, count]);

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

const useStyles = () => {
  return {
    menuContainer: {
      border: 'none',
      minHeight: '100vh',
    } as CSSProperties,
    logo: {
      height: '5em',
      backgroundColor: 'white',
      textAlign: 'center',
      flex: 1,
      alignContent: 'center',
      alignItems: 'center',
    } as CSSProperties,
  };
};
