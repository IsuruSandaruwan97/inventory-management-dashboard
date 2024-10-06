import ItemTable from '@components/ItemTable';
import { Meta, StoryFn } from '@storybook/react';
import { ColumnsType } from 'antd/es/table';

export default {
  title: 'Components/ItemTable',
  component: ItemTable,
} as Meta;

const Template: StoryFn<any> = (args: any) => <ItemTable {...args} />;

const columns: ColumnsType<any> = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
];

const items = [
  { id: 1, name: 'Item 1', price: 100 },
  { id: 2, name: 'Item 2', price: 200 },
  { id: 3, name: 'Item 3', price: 300 },
];

export const Default = Template.bind({});
Default.args = {
  items,
  columns,
  loading: false,
  onSubmit: () => alert('Submitted!'),
};
