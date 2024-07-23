// Run the E2E tests in Github Ubuntu machines
// https://hackernoon.com/how-to-set-up-end-to-end-tests-with-webdriverio-on-github-action

const basicConfig = require('./wdio.conf.ts')

exports.config = {
  ...basicConfig.config,
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },
  ],
}
