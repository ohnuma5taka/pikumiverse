import moment from 'moment';
import 'moment/locale/ja';

export type MomentFormat =
  | 'ddd'
  | 'DD'
  | 'D'
  | 'MM'
  | 'M'
  | 'YYYY'
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DD（ddd）'
  | 'YYYY-MM'
  | 'MM-DD'
  | 'YYYY/MM/DD'
  | 'MM/DD'
  | 'YYYY/MM/DD HH:mm:ss'
  | 'YYYY-MM-DDTHH:mm:ss.SSS'
  | 'YYYY年MM月'
  | 'YYYY年MM月DD日';

moment.locale('ja');

const today = () => moment();
const fromDate = (date: Date) => moment(date.toISOString());
const date = (date: string) =>
  moment((date ? new Date(date) : new Date()).toISOString());
const format = (_date: string, format: MomentFormat): string =>
  date(_date).format(format);
const compareDate = (
  date1: string,
  date2: string,
  format: MomentFormat = 'YYYY-MM-DD'
) => {
  const d1 = date(date1).format(format);
  const d2 = date(date2).format(format);
  return d1 < d2 ? -1 : d1 > d2 ? 1 : 0;
};

export const momentUtil = {
  today,
  date,
  fromDate,
  compareDate,
  format,
};
