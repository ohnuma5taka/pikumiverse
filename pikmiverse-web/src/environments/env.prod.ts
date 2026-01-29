import { Env } from '@/environments/env.type';

export const env: Env = {
  mode: 'prod',
  version: '__APP_VERSION__',
  apiPathPrefix: '/api',
  wsPathPrefix: '/ws',
};
