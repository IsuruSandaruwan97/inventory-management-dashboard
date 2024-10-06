import { NSpinner } from '@components/Nprogress';

export default {
  title: 'Components/NSpinner',
  component: NSpinner,
};

const Template = (args: any) => <NSpinner {...args} />;

export const Default: any = Template.bind({});
Default.args = {};
