import { PageHeader } from '@components/PageHeader/PageHeader.tsx';
import { Meta, StoryFn } from '@storybook/react';
import { BreadcrumbProps } from 'antd';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/PageHeader',
  component: PageHeader,
  decorators: [(Story) => <MemoryRouter>{<Story />}</MemoryRouter>],
} as Meta;

const Template: StoryFn<any> = (args) => <PageHeader {...args} />;

const breadcrumbs: BreadcrumbProps['items'] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Settings',
    href: '/settings',
  },
  {
    title: 'Profile',
    href: '/profile',
  },
];

export const Default = Template.bind({});
Default.args = {
  title: 'User Profile',
  breadcrumbs,
};
