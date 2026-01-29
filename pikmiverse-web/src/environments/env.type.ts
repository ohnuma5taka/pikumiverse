export type Env = {
  mode: '' | 'prod' | 'dev' | 'local' | 'test';
  version: string;
  apiPathPrefix: string;
  wsPathPrefix: string;
};
