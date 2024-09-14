export const getTagColor = (status: string) => {
  let color;
  switch (status?.toLowerCase()) {
    case 'rejected':
      color = 'red';
      break;
    case 'partially accepted':
      color = 'orange';
      break;
    case 'new':
      color = 'blue';
      break;
    default:
      color = 'green';
      break;
  }
  return color;
};
