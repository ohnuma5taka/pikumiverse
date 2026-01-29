import { sleep } from '@/app/core/utils/time.util';

export const getUndefined = async () => {
  await sleep(300);
  return undefined;
};
