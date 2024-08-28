/** @format */

import dayjs from "dayjs";

export const randomPassword = (passwordLength: number = 12): string => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password: string = "";
  for (var i = 0; i <= passwordLength; i++) {
    var randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }
  return password;
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format("DD/MM/YYYY");
};

export const findRouteByPath = (routes: any[], path: string): any => {
  const object = routes?.find((item) => {
    if (item.path === path) return item;
    if (item.children) {
      const subRoute = item.children?.find(
        (subItem: any) => subItem.key === path
      );
      if (subRoute) return item;
    }
  });
  if (object) {
    const subDir = object?.children?.find((item: any) => item.key === path);
    return {
      main: { name: object?.name, path: object?.path },
      sub: subDir ? { name: subDir?.label, path: subDir?.key } : null,
    };
  }
  return undefined;
};
