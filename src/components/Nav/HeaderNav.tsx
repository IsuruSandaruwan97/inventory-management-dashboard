import { Layout } from 'antd';
import { HTMLAttributes, useRef } from 'react';

const { Header } = Layout;

type HeaderNavProps = {
  navFill?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const HeaderNav = ({ ...others }: HeaderNavProps) => {
  const nodeRef = useRef(null);

  return <Header ref={nodeRef} {...others} />;
};

export default HeaderNav;
