import { KeyValuePair } from '@configs/types';
import { Col, DatePicker as AntdDatePicker, DatePickerProps, Radio, RadioChangeEvent, Row, Space } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';

import dayjs from 'dayjs';
import { Key, useMemo, useState } from 'react';

const { RangePicker } = AntdDatePicker;

type TDatePicker = {
  onSelectDate: (date: string) => void;
} & RangePickerProps &
  DatePickerProps;

const today = dayjs();
const defaultFormat: string = 'YYYY-MM-DD';
const defaultDate = [today.format(defaultFormat), today.format(defaultFormat)];

const selectOptions: KeyValuePair[] = [
  { label: 'Today', value: 0 },
  { label: 'Yesterday', value: 1 },
  { label: 'This Week', value: 7 },
  { label: 'This Month', value: 30 },
];

const DatePicker = ({ value, onSelectDate, ...others }: TDatePicker) => {
  const [option, setOption] = useState<Key | undefined>(selectOptions[0].value as Key);
  const [selectedDate, setSelectedDate] = useState<string[] | undefined>(defaultDate);

  const onChangeOption = (e: RadioChangeEvent) => {
    const { value } = e?.target;
    setOption(value);
    const ranges: any = {
      0: [0, 'day'],
      1: [1, 'day'],
      7: [7, 'day'],
      30: [1, 'month'],
    };
    const selectedRange = ranges[value];
    if (!selectedRange) {
      setSelectedDate(undefined);
      return;
    }
    setSelectedDate([
      today.subtract(selectedRange[0], selectedRange[1]).format(defaultFormat),
      today.format(defaultFormat),
    ]);
  };

  const handleSelectDate = (values: any) => {
    if (!values) {
      setSelectedDate(defaultDate);
      setOption(0);
      return;
    }

    const [startDate, endDate] = values;
    const diff = today.diff(startDate, 'day');

    setSelectedDate([dayjs(startDate).format(defaultFormat), dayjs(endDate).format(defaultFormat)]);

    setOption(endDate.isSame(today, 'day') && [0, 1, 7, 30].includes(diff) ? diff : undefined);
  };

  const formatToDate: any = useMemo(() => {
    if (!selectedDate) return undefined;
    return selectedDate?.map((date) => dayjs(date));
  }, [selectedDate]);

  return (
    <Row>
      <Space>
        <Col>
          <Radio.Group value={option} onChange={onChangeOption}>
            {selectOptions.map((item, index) => (
              <Radio.Button value={item.value} key={index}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Col>
        <Col>
          <RangePicker
            maxDate={today}
            format={'YYYY-MM-DD'}
            onChange={handleSelectDate}
            value={formatToDate}
            {...others}
          />
        </Col>
      </Space>
    </Row>
  );
};

export default DatePicker;
