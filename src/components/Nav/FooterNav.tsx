import { Layout } from 'antd';
import { HTMLAttributes } from 'react';

const { Footer } = Layout;

type FooterNavProps = HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  return <Footer {...others}>Dashboard © 2023 Created by Design ITAWSK</Footer>;
};

export default FooterNav;
