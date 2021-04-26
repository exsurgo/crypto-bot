import ccxt, { Exchange } from 'ccxt';
import { ExchangeKeys, IApiKey } from '../keys';
import { logSection } from './logger';

const TIMEOUT = 20000;
const VERBOSE = false;

export const enum Exchanges {
  BitFinex = 'bitfinex2', // Paper trading
  Coinbase = 'coinbase',
  GateIO = 'gateio',
  Gemini = 'gemini',
  OKEx = 'okex',
}

export function listExchanges() {
  const exchanges: string[] = ccxt.exchanges;
  logSection('All supported exchanges', exchanges);
}

export let exchange: ccxt.Exchange;

export function setExchange(id: Exchanges): Exchange {
  const ExchangeClass = ccxt[id];
  const apiKey: IApiKey = ExchangeKeys.find((key: IApiKey) => key.id == id)!;
  exchange = new ExchangeClass({
    apiKey: apiKey.key,
    secret: apiKey.secret,
    timeout: TIMEOUT,
    enableRateLimit: true,
    verbose: VERBOSE,
  });
  return exchange;
}
