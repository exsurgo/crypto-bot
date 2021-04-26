import { Exchanges, Order, getBalance, getTicker, getOrder, createBuyOrder, createSellOrder, setExchange, Strategy } from '../libs';
import { getSocialSentiment } from '../indicators';

// Paper trading symbols/pairs for BitFinex
const BTCUSD = 'TESTBTC/TESTUSD';
const USD = 'TESTUSD';

setExchange(Exchanges.BitFinex);

const BUY_SELL_AMOUNT = 1;
const ALLOWED_LIMIT_SLIPPAGE = 50;

// Social sentiment minimum parameters
const MINIMUM_SOCIAL_SCORE = 3;
const MINIMUM_SOCIAL_VOLUME = 50;
const MINIMUM_AVERAGE_SENTIMENT = 20;
const MINIMUM_1D_INCREASE_PERCENT = 2;
const MINIMUM_7D_DIP_PERCENT = 8;

/** A strategy for buying bitcoin based on social sentiment. */
export class BasicStrategy extends Strategy {
  name = 'Social';
  description = 'Buys/sells Bitcoin based on social sentiment';
  interval = 1000 * 60 * 60 * 12; // 12 Hours

  private buyMode = true;
  private order?: Order;

  async run() {
    // Ensure previous order was filled before proceeding
    if (this.order) {
      const current = await getOrder(this.order.id);
      if (current.remaining !== 0) return;
      this.order = undefined;
    }

    // Get social sentiment for BTC
    const sentiment = await getSocialSentiment(BTCUSD);

    // Asset is a buy if sentiment params meet minimum requirements
    // Also, only bue if recovering from a correction
    const isBuy =
        sentiment.socialScore >= MINIMUM_SOCIAL_SCORE &&
        sentiment.averageSentiment >= MINIMUM_AVERAGE_SENTIMENT &&
        sentiment.socialVolume >= MINIMUM_SOCIAL_VOLUME &&
        sentiment.percentChange7d <= MINIMUM_7D_DIP_PERCENT &&
        sentiment.percentChange24h >= MINIMUM_1D_INCREASE_PERCENT;

    // Buy
    if (this.buyMode && isBuy) {
      const ticker = await getTicker(BTCUSD);
      const limit = ticker.ask + ALLOWED_LIMIT_SLIPPAGE;
      this.order = await createBuyOrder(BTCUSD, BUY_SELL_AMOUNT, limit);
      this.buyMode = false;
    }

    // Sell
    else if (!this.buyMode && !isBuy) {
      const ticker = await getTicker(BTCUSD);
      const limit = ticker.ask - ALLOWED_LIMIT_SLIPPAGE;
      this.order = await createSellOrder(BTCUSD, BUY_SELL_AMOUNT, limit);
      this.buyMode = true;
    }
  }

  async endIf() {
    // End trading if out of money
    const balances = await getBalance(USD);
    return balances.total === 0;
  }
}
