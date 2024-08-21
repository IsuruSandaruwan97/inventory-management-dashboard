/** @format */

import { Layout } from "antd";

const { Footer } = Layout;

type FooterNavProps = React.HTMLAttributes<HTMLDivElement>;

const FooterNav = ({ ...others }: FooterNavProps) => {
  return (
    <Footer {...others}>Dashboard © 2023 Created by Design ITAWSK</Footer>
  );
};

export default FooterNav;
