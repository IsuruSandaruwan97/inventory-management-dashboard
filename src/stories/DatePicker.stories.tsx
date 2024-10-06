import DatePicker from '@components/DatePicker';
import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';

export default {
  title: 'Components/DatePicker',
  component: DatePicker,
} as Meta;

const Template: StoryFn<any> = (args) => <DatePicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  onSelectDate: (date: string) => alert(`Selected date range: ${date}`),
  value: [dayjs().subtract(7, 'day'), dayjs()],
};
