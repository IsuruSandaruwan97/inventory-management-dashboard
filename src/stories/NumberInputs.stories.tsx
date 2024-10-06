import NumberInput from '@components/NumberInput';

export default {
  title: 'Components/NumberInput',
  component: NumberInput,
};

const Template = (args: any) => <NumberInput {...args} />;

export const Default: any = Template.bind({});
Default.args = {
  value: 0,
  currency: false,
};

export const CurrencyInput: any = Template.bind({});
CurrencyInput.args = {
  value: 100.5,
  currency: true,
};

export const EmptyInput: any = Template.bind({});
EmptyInput.args = {
  value: null,
  currency: false,
};
