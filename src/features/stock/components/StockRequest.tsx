/** @format */

import {
  AimOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Table from "@components/Table";
import { TListType } from "@configs/types";
import { stock_requests } from "@data/stock/stock_requests";
import {
  Space,
  Collapse,
  Pagination,
  Button,
  Popconfirm,
  Card,
  Typography,
  Tag,
  TableProps,
  Flex,
} from "antd";
import dayjs from "dayjs";
import { CSSProperties } from "react";
import { useMediaQuery } from "react-responsive";
const { Text } = Typography;
const maxCount: number = 5;

type TItemContent = {
  isMobile: boolean;
  styles: any;
  items: any[];
  title: string;
  date: Date | string;
  listType: TListType;
};

type TStockRequest = {
  listType: TListType;
};

const StockRequest = ({ listType }: TStockRequest) => {
  const styles = useStyles();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  return (
    <>
      <Space direction="vertical" style={styles.space}>
        <Collapse
          expandIcon={() => null}
          style={styles.collaps}
          accordion
          items={stock_requests.map((item, index) => {
            return {
              key: index,
              label: (
                <div style={styles.label}>
                  <Space>
                    <PlusOutlined />
                    {item.title}
                    <Tag color="orange">New</Tag>
                  </Space>
                  {!isMobile && listType !== "history" && <ActionButtons />}
                </div>
              ),
              children: (
                <ItemContent
                  title={item.title}
                  styles={styles}
                  isMobile={isMobile}
                  items={item.request}
                  date={item.date}
                  listType={listType}
                />
              ),
            };
          })}
        />
        <Pagination
          style={styles.pagination}
          defaultCurrent={1}
          pageSize={maxCount}
          total={stock_requests.length}
        />
      </Space>
    </>
  );
};

export default StockRequest;

const ItemContent = ({
  isMobile,
  items,
  styles,
  title,
  date,
  listType,
}: TItemContent) => {
  const columns: TableProps<any>["columns"] = [
    {
      title: "Item Name",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Request Id",
      dataIndex: "id",
      key: "id",
      responsive: ["md"],
    },
    {
      title: "Request Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
      render: (item: Date | string) => <>{dayjs(item).format("LLLL")}</>,
    },
    {
      title: "Item Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_item: any) => {
        return <ActionButtons iconsOnly />;
      },
    },
  ];
  return (
    <Card>
      <Space direction="vertical">
        <Text style={styles.description}>
          <AimOutlined style={{ fontSize: 16 }} />
          &nbsp;{title}
        </Text>
        <Text style={{ ...styles.description, marginLeft: 2 }}>
          <ClockCircleOutlined style={{ fontSize: 13 }} />
          &nbsp;{dayjs(date).format("LLLL")}
        </Text>
      </Space>
      <Table
        pagination={false}
        rowKey={"id"}
        columns={columns}
        dataSource={items}
      />
      {listType === "pending" && (
        <Flex style={styles.mobileActionButtons}>
          {isMobile && <ActionButtons />}
        </Flex>
      )}
    </Card>
  );
};

const ActionButtons = ({ iconsOnly }: { iconsOnly?: boolean }) => {
  return (
    <Space {...(iconsOnly && { size: "large" })}>
      <Popconfirm
        title="Reject the request"
        description="Are you sure to reject this request?"
        okText="Yes"
        cancelText="No"
      >
        {iconsOnly ? (
          <DeleteOutlined style={{ color: "red" }} />
        ) : (
          <Button danger>
            <DeleteOutlined />
            Reject
          </Button>
        )}
      </Popconfirm>

      <Popconfirm
        title="Approve the request"
        description="Are you sure to approve this request?"
        okText="Yes"
        cancelText="No"
      >
        {iconsOnly ? (
          <CheckOutlined style={{ color: "blue" }} />
        ) : (
          <Button type="primary">
            <CheckOutlined />
            Approve
          </Button>
        )}
      </Popconfirm>
    </Space>
  );
};

const useStyles = () => {
  return {
    space: { width: "100%" } as CSSProperties,
    collaps: { width: "100%" } as CSSProperties,
    pagination: { justifyContent: "center" } as CSSProperties,
    label: {
      flexDirection: "row",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    } as CSSProperties,
    description: {
      display: "flex",
      marginTop: -5,
      marginBottom: 10,
      fontSize: 12,
      alignContent: "center",
    } as CSSProperties,
    mobileActionButtons: {
      marginTop: 12,
      justifyContent: "flex-end",
    } as CSSProperties,
  };
};
