import { Order } from 'ccxt';
import { log, startLog, endLog } from './logger';
import { exchange } from './exchanges';

export async function getOpenOrders(symbol: string): Promise<Order[]> {
  return await exchange.fetchOpenOrders(symbol);
}

export async function getOrder(id: string): Promise<Order> {
  return await exchange.fetchOrder(id, '');
}

export async function createBuyOrder(symbol: string, amount: number, limit: number): Promise<Order> {
  startLog('Placing buy order');
  const order = await exchange.createLimitBuyOrder(symbol, amount, limit);
  log(order);
  endLog()
  return order;
}

export async function createSellOrder(symbol: string, amount: number, limit: number): Promise<Order> {
  startLog('Placing sell order');
  const order = await exchange.createLimitSellOrder(symbol, amount, limit);
  log(order);
  endLog()
  return order;
}
