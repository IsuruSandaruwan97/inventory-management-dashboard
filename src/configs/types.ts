/** @format */

import { ReactNode } from 'react';

export type KeyValuePair = {
  [key: string]: string | number | boolean | ReactNode;
};

export type TListType = 'pending' | 'history';
