/** @format */

import { KeyValuePair } from '@configs/types';
import { Badge, Dropdown, MenuProps, Radio, Space } from 'antd';
import { CSSProperties, ReactNode, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

type TFilters = {
  items: KeyValuePair[];
  value: string | number;
  onChangeValue: (value: string | number) => void;
  customStyles?: CSSProperties;
};

const FilterItems = ({ items, value, onChangeValue, customStyles }: TFilters) => {
  const styles = useStyles();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const menuItems: { key: string; label: string; icon?: ReactNode }[] | KeyValuePair[] = useMemo(() => {
    if (!isMobile) return items;
    return items?.map((item: any) => ({
      key: item.value,
      label: item.label,
      icon: item?.icon,
    }));
  }, [items, isMobile, value]);
  const selectedItem = menuItems.find((item) => item?.key === value);
  return isMobile ? (
    <Dropdown.Button
      style={{ ...styles.rightDropdown, ...customStyles }}
      trigger={['click']}
      key={'value'}
      menu={{
        items: menuItems as MenuProps['items'],
        onClick: (e) => onChangeValue(e?.key),
      }}
    >
      <Space size={4}>
        {selectedItem?.icon}
        {selectedItem?.label}
      </Space>
    </Dropdown.Button>
  ) : (
    <Radio.Group style={styles.rightDropdown} value={value} onChange={(e) => onChangeValue(e.target.value)}>
      {items?.map((_item: any, index: number) => (
        <Radio.Button value={_item.value} key={`filter_${index}`}>
          <Badge size="small" style={styles.badge} count={0} offset={[5, 0]}>
            <Space size={4}>
              {_item?.icon}
              {_item.label}
            </Space>
          </Badge>
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default FilterItems;

const useStyles = () => ({
  rightDropdown: {
    display: 'flex',
  } as CSSProperties,
  badge: { fontSize: '10px' } as CSSProperties,
});
