import { ExperimentOutlined } from '@ant-design/icons';
import { COLOR } from '@configs/colors';
import { ROUTES } from '@configs/routes';
import { ConfigProvider, Menu, MenuProps, SiderProps } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { CSSProperties, Key, ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type SideNavProps = SiderProps & { collapsed: boolean };
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

const getNavbarItems = (): MenuProps['items'] => {
  return ROUTES.map((route) => {
    return getItem(route.name, route.path, route.icon, route.children);
  });
};

const SideNav = ({ collapsed, ...others }: SideNavProps) => {
  const styles = useStyles();
  const nodeRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>();
  const [current, setCurrent] = useState<string>('');

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
          items={getNavbarItems()}
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
