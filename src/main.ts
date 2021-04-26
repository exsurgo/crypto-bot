import { run, logSection } from './libs';
import { BasicStrategy } from './strategies/basic';

(async function() {

  logSection('Starting Trading Bot');
  await run(BasicStrategy);

})();
