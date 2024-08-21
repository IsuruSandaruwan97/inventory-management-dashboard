/** @format */
import { Typography } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const { Text } = Typography;

const Time = () => {
  const [date, setDate] = useState<string>(dayjs().format("hh:mm:ss A"));
  useEffect(() => {
    var timer = setInterval(() => setDate(dayjs().format("hh:mm:ss A")), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return <Text>{date}</Text>;
};
export default Time;
