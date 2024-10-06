import { ArrowUpOutlined } from '@ant-design/icons';
import StatsCard from '@components/StatsCard';

export default {
  title: 'Components/StatsCard',
  component: StatsCard,
};

const Template = (args: any) => <StatsCard {...args} />;

export const Default: any = Template.bind({});
Default.args = {
  title: 'Sales',
  value: 1000,
  diff: 10,
  icon: ArrowUpOutlined,
};
