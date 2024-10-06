import ItemIcon from '@components/ItemIcon.tsx';

export default {
  title: 'Components/ItemIcon',
  component: ItemIcon,
};

const Template = (args: any) => <ItemIcon {...args} />;

export const BottleIcon: any = Template.bind({});
BottleIcon.args = {
  type: 'bottle',
  url: null,
};

export const LidIcon: any = Template.bind({});
LidIcon.args = {
  type: 'lid',
  url: null,
};

export const LabelIcon: any = Template.bind({});
LabelIcon.args = {
  type: 'label',
  url: null,
};

export const ImageIcon: any = Template.bind({});
ImageIcon.args = {
  type: 'bottle',
  url: 'https://example.com/image.png',
};
