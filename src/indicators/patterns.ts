import talib from 'talib.js';
import type { IMarketData } from '../libs';

export function isHammerPattern(data: IMarketData): boolean {
  const result = talib.cdlHammer({ open: data.open, high: data.high, low: data.low, close: data.close });
  return !!result.output.length;
}
