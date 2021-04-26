import { Ticker, OHLCV } from 'ccxt';
import { exchange } from './exchanges';

export async function getTicker(symbol: string): Promise<Ticker> {
  return exchange.fetchTicker(symbol)
}

export interface IMarketData {
  timestamp: number[]
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

export enum Timeframe {
  Minute = '1m',
  Minute3 = '3m',
  Minute5 = '5m',
  Minute15 = '15m',
  Minute30 = '30m',
  Hour = '1h',
  Hour2 = '2h',
  Hour3 = '3h',
  Hour4 = '4h',
  Hour6 = '6h',
  Hour7 = '8h',
  Hour12 = '12h',
  Day = '1D',
  Day3 = '3D',
  Week = '7D',
  Week2 = '14D',
  Month = '1M',
}

export async function getMarketData(symbol: string, timeframe: Timeframe, limit: number): Promise<IMarketData> {
  if (!exchange.timeframes[timeframe]) {
    throw new Error(`Exchange ${exchange.name} does not support timeframe ${timeframe}`);
  }
  const data = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit);
  return convertMarketData(data);
}

/** Convert `OHLCV` data to more common data format. */
function convertMarketData(input: OHLCV[]): IMarketData {
  const output: IMarketData = {
    timestamp: [],
    open: [],
    high: [],
    low: [],
    close: [],
    volume: [],
  };
  for (const tick of input) {
    output.timestamp.push(tick[0]);
    output.open.push(tick[1]);
    output.high.push(tick[2]);
    output.low.push(tick[3]);
    output.close.push(tick[4]);
    output.volume.push(tick[5]);
  }
  return output;
}
