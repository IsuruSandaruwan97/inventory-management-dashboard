/** @format */

import { CSSProperties, HTMLAttributes } from "react";
import { Breadcrumb, BreadcrumbProps, Divider, Space, Typography } from "antd";
import "@components/PageHeader/styles.css";
import { HomeOutlined } from "@ant-design/icons";

type Props = {
  title: string;
  breadcrumbs: BreadcrumbProps["items"];
} & HTMLAttributes<HTMLDivElement>;

const deafultItem = [
  {
    title: (
      <>
        <HomeOutlined />
        <span>home</span>
      </>
    ),
    path: "/",
  },
];

export const PageHeader = ({ breadcrumbs, title, ...others }: Props) => {
  const styles = useStyles();
  return (
    <div {...others}>
      <Space direction="vertical" size="small">
        <Typography.Title level={4} style={styles.title}>
          {title}
        </Typography.Title>
        <Breadcrumb
          items={[...deafultItem, ...(breadcrumbs || [])]}
          className="page-header-breadcrumbs"
        />
      </Space>
      <Divider orientation="right" plain>
        <span style={{ textTransform: "capitalize" }}>{title}</span>
      </Divider>
    </div>
  );
};

const useStyles = () => {
  return {
    title: {
      padding: 0,
      margin: 0,
      textTransform: "capitalize",
    } as CSSProperties,
  };
};
