import isString from 'lodash/isString';
import { FaBottleWater } from 'react-icons/fa6';
import { LiaPrescriptionBottleSolid } from 'react-icons/lia';
import { PiJarLabel } from 'react-icons/pi';

type TItemIcon = {
  url: string | null | undefined;
  type: 'bottle' | 'lid' | 'label';
};

const ItemIcon = ({ type, url }: TItemIcon) => {
  if (url && !isString(url)) return <img src={url} height={40} width={40} alt="item-image" />;
  switch (type) {
    case 'label':
      return <PiJarLabel size={24} />;
    case 'lid':
      return <LiaPrescriptionBottleSolid size={24} />;
    default:
      return <FaBottleWater size={24} />;
  }
};

export default ItemIcon;
