/**
 * These indicators use a C to webassembly port of TA-Lib.
 *  - https://hackape.github.io/talib.js/
 *
 * Alternative technical indicator libraries:
 *  - https://github.com/rubenafo/trendyways
 *  - https://github.com/TulipCharts/tulipnode
 */

import talib from 'talib.js';
import type { IMarketData } from '../libs';


export async function initTALib() {
  await talib.init();
}

export function simpleMovingAverage(data: IMarketData): number {
  const total = data.close.reduce<number>((curr: number, acc: number) => {
    return acc + curr;
  }, 0)
  return total / data.close.length;
}

export function averageDirectionIndex(data: IMarketData): number[] {
  const result = talib.adx({ high: data.high, low: data.low, close: data.close });
  return result.output;
}
