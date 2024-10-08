import { HomeOutlined } from '@ant-design/icons';
import '@components/PageHeader/styles.css';
import { Breadcrumb, BreadcrumbProps, Divider, Space, Typography } from 'antd';
import { CSSProperties, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
  breadcrumbs: BreadcrumbProps['items'];
} & HTMLAttributes<HTMLDivElement>;

const defaultItem = [
  {
    title: (
      <Link to={'/'}>
        <Space>
          <HomeOutlined />
          <span>home</span>
        </Space>
      </Link>
    ),
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
        <Breadcrumb items={[...defaultItem, ...(breadcrumbs || [])]} className="page-header-breadcrumbs" />
      </Space>
      <Divider orientation="right" plain>
        <span style={{ textTransform: 'capitalize' }}>{title}</span>
      </Divider>
    </div>
  );
};

const useStyles = () => {
  return {
    title: {
      padding: 0,
      margin: 0,
      textTransform: 'capitalize',
    } as CSSProperties,
  };
};
