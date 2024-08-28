/** @format */

import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Card, CardProps, Flex, Typography } from "antd";
import { green, red } from "@ant-design/colors";
import React from "react";
import CountUp from "react-countup";

type Props = {
  title: string;
  value: number;
  diff: number;
  icon: any;
} & CardProps;
const StatsCard = ({ icon, title, value, diff, ...others }: Props) => {
  return (
    <Card {...others}>
      <Flex vertical gap="middle" style={{ width: "100%" }}>
        {icon && React.createElement(icon, { style: { fontSize: 30 } })}

        <Typography.Text style={{ textTransform: "capitalize" }}>
          {title}
        </Typography.Text>
        <Flex gap="small" align="center" justify="space-between">
          <Typography.Title level={2} className="m-0">
            <CountUp end={value} />
          </Typography.Title>
          <Typography.Text
            strong
            style={{ color: diff > 0 ? green[5] : red[5] }}
          >
            {diff}%&nbsp;
            {diff > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          </Typography.Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default StatsCard;
