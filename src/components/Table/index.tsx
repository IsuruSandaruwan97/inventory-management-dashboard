/** @format */

import {
  Table as AntdTable,
  TableProps as AntdTableProps,
  Typography,
} from "antd";
import { CSSProperties } from "react";

type defaultTypes = { title?: string };
type TableProps = Omit<AntdTableProps, "title"> & defaultTypes;

const { Title } = Typography;

const Table = ({ title, ...props }: TableProps) => {
  const styles = useStyles();
  return (
    <AntdTable
      title={() => (
        <Title style={styles.title} level={4}>
          {title}
        </Title>
      )}
      scroll={{ x: "max-content" }}
      {...props}
    />
  );
};

export default Table;

const useStyles = () => {
  return {
    title: { padding: 0, marginTop: -10, fontWeight: "400" } as CSSProperties,
  };
};
