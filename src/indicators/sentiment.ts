/**
 * To gauge social sentiment, we'll use the LunarCrush service.
 * Example: https://lunarcrush.com/coins/btc/bitcoin
 * API: https://lunarcrush.com/developers/docs
 */


import axios from 'axios';
import { LUNAR_CRUSH_KEY } from '../keys';

const REQUEST_URL = `https://api.lunarcrush.com/v2?data=assets&interval=day&key=${LUNAR_CRUSH_KEY}&symbol=`;

interface ISocialSentiment {
  socialDominance: number;
  socialScore: number;
  socialVolume: number;
  averageSentiment: number;
  percentChange24h: number;
  percentChange7d: number;
  percentChange30d: number;
}

export async function getSocialSentiment(symbol: string): Promise<ISocialSentiment> {
  const response = await axios.get(REQUEST_URL + symbol);
  const data = response.data.data[0] as any;

  const sentiment: ISocialSentiment = {
    socialDominance: data['social_dominance'],
    socialScore: data['social_score_calc_24h_percent'],
    socialVolume: data['social_volume_calc_24h'],
    averageSentiment: data['average_sentiment_calc_24h_percent'],
    percentChange24h: data['percent_change_24h'],
    percentChange7d: data['percent_change_7d'],
    percentChange30d: data['percent_change_30d'],
  };

  return sentiment;
}
