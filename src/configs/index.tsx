import { HistoryOutlined, HourglassOutlined } from '@ant-design/icons/lib/icons';
import { KeyValuePair } from '@configs/types';

export const STOCK_FILTER_TYPES: KeyValuePair[] = [
  { label: 'Requests', value: 'requests' },
  { label: 'All Items', value: 'all' },
  { label: 'Return Items', value: 'return' },
  { label: 'Damaged Items', value: 'damaged' },
];

export const TABLE_STATUS = [
  { label: 'Pending', value: 'pending', icon: <HourglassOutlined /> },
  { label: 'History', value: 'history', icon: <HistoryOutlined /> },
];

export const PAGE_SIZES = {
  INVENTORY: 5,
  USERS: 6,
};

export const DEFAULT_CURRENCY = 'Rs';
