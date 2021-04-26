import { Exchanges, getBalance, getTicker, getMarketData, getOpenOrders, createBuyOrder, createSellOrder, logSection, setExchange, Strategy, Timeframe } from '../libs';
import { simpleMovingAverage } from '../indicators';

// Paper trading symbols/pairs for BitFinex
const BTCUSD = 'TESTBTC/TESTUSD';
const USD = 'TESTUSD';

// Use BitFinex since we have paper trading available
setExchange(Exchanges.BitFinex);

const BUY_SELL_AMOUNT = 1;
const ALLOWED_LIMIT_SLIPPAGE = 50;

/** A very basic strategy for buying bitcoin based on SMA. */
export class BasicStrategy extends Strategy {
  name = 'Basic';
  description = 'Buys/sells Bitcoin based on SMA';

  private buyMode = true;

  async run() {
    // Exit if open orders exist
    const orders = await getOpenOrders(BTCUSD);
    if (orders.length) return;

    // Get the current ticker data for BTC
    const ticker = await getTicker(BTCUSD);
    logSection('BTC Data', ticker);

    // Get market data for for past 24 hours
    const data = await getMarketData(BTCUSD, Timeframe.Hour, 24);

    // Get 20 hour SMA
    const sma20h = simpleMovingAverage(data);

    // Buy
    if (this.buyMode && sma20h > ticker.ask) {
      const limit = ticker.ask + ALLOWED_LIMIT_SLIPPAGE;
      await createBuyOrder(BTCUSD, BUY_SELL_AMOUNT, limit);
      this.buyMode = false;
    }

    // Sell
    else if (!this.buyMode && sma20h < ticker.ask) {
      const limit = ticker.ask - ALLOWED_LIMIT_SLIPPAGE;
      await createSellOrder(BTCUSD, BUY_SELL_AMOUNT, limit);
      this.buyMode = true;
    }
  }

  async endIf() {
    // End trading if out of money
    const balances = await getBalance(USD);
    return balances.total === 0;
  }
}
