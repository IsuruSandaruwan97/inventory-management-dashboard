/** @format */

import Table from "@components/Table";
import { StyleSheet } from "@configs/stylesheet";
import { KeyValuePair } from "@configs/types";
import { Card, Space, DatePicker, Radio, Row } from "antd";
import { TableProps } from "antd/es/table/InternalTable";
const { RangePicker } = DatePicker;

const DateOptions: KeyValuePair[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const columns: TableProps<any>["columns"] = [
  { title: "Item Code", dataIndex: "id", key: "id", responsive: ["lg"] },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (value) => <img src={value} height={40} width={40} />,
  },
  {
    title: "Item Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Item Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Delivery By",
    dataIndex: "deliveryBy",
    key: "deliveryBy",
  },
];

const Delivery = () => {
  return (
    <Space direction="vertical" style={styles.space}>
      <Card>
        <Row style={styles.actionBar}>
          <Space>
            <Radio.Group defaultValue={DateOptions[0].value}>
              {DateOptions?.map((item) => (
                <Radio.Button value={item.value} key={`option_${item}`}>
                  {item?.label}
                </Radio.Button>
              ))}
            </Radio.Group>
            <RangePicker />
          </Space>
        </Row>
      </Card>
      <Table columns={columns} dataSource={[]} />
    </Space>
  );
};

export default Delivery;

const styles = StyleSheet.create({
  space: {
    width: "100%",
  },

  actionBar: {
    justifyContent: "flex-end",
  },
});
