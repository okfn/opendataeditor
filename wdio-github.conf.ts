// Run the E2E tests in Github Ubuntu machines
const basicConfig = require('./wdio.conf.ts')

exports.config = {
  ...basicConfig.config,
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      acceptInsecureCerts: true,
      // https://developer.chrome.com/blog/headless-chrome/#starting_headless_cli
      // https://issues.chromium.org/issues/42323434#comment36
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu', '--remote-debugging-port=9222', '--remote-debugging-pipe'],
      },
    },
  ],
}
