const fullPath = () => location.pathname.split('?')[0];
const trailingPath = () => fullPath().split('/').slice(-1)[0];
const leadingPath = () => fullPath().split('/')[1];
const queryParam = <T extends object>() =>
  Object.fromEntries(new URLSearchParams(location.href.split('?')[1])) as T;

export const locationUtil = {
  fullPath,
  trailingPath,
  leadingPath,
  queryParam,
};
