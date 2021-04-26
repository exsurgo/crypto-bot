import { Balance } from 'ccxt';
import { exchange } from './exchanges';
import { logSection } from './logger';

export async function getBalance(symbol: string): Promise<Balance> {
  const balances = await exchange.fetchBalance();
  const balance: Balance = balances[symbol];
  logSection(`Balance for ${symbol}`, balance);
  return balance;
}
