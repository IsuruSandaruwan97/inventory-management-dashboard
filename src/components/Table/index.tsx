import { Table as AntdTable, TableProps as AntdTableProps, Typography } from 'antd';
import { CSSProperties, ReactNode } from 'react';

type defaultTypes = { title?: string | ReactNode };
type TableProps = Omit<AntdTableProps, 'title'> & defaultTypes;

const { Title } = Typography;

const Table = ({ title, ...props }: TableProps) => {
  const styles = useStyles();
  return (
    <AntdTable
      rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
      title={() =>
        typeof title === 'string' ? (
          <Title style={styles.title} level={4}>
            {title}
          </Title>
        ) : (
          title
        )
      }
      scroll={{ x: 'max-content' }}
      {...props}
    />
  );
};

export default Table;

const useStyles = () => {
  return {
    title: { padding: 0, marginTop: -10, fontWeight: '400' } as CSSProperties,
  };
};
