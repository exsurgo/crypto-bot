/** Add private keys to `keys.ts`. Do not commit to source. */

export interface IApiKey {
  id: string;
  key: string;
  secret: string;
  password?: string;
}

export const ExchangeKeys: IApiKey[] = [
  {
    id: 'bitfinex2',
    key: '...',
    secret: '...',
  },
  {
    id: 'okex',
    key: '...',
    secret: '...',
    password: '...',
  },
  // Add other exchanges as needed
];

export const LUNAR_CRUSH_KEY = '...';
