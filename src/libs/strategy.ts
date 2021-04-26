import { initTALib } from '../indicators';
import { logSection } from './logger';
import { wait } from './utils';

/** Starts execution of a given strategy. */
export async function run(strategy: typeof Strategy) {
  const instance = new (strategy as any)();
  logSection(`Running Strategy ${instance.name}`, instance.description)

  // Initialize TA lib first in case indicators are used
  await initTALib();

  // Continually run strategy on a set interval
  // unless some end condition has occurred
  while (await instance.endIf() !== true) {
    await instance.run();
    await wait(instance.interval);
  }
}

/** Run tick every 1 minute by default. */
const DEFAULT_INTERVAL = 1000 * 60 ;

/** Base class for all strategies. */
export abstract class Strategy {
  /** Name of the strategy. */
  abstract name: string;

  /** A brief description of the strategy. */
  abstract description: string;

  /** Interval in milliseconds in which the check interval is run. */
  interval = DEFAULT_INTERVAL;

  /** Time when the bot was started. */
  readonly startTime: Date;

  constructor() {
    this.startTime = new Date();
  }

  abstract run(): void;

  async endIf(): Promise<boolean | undefined> {
    return false;
  }
}
