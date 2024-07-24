// Run the E2E tests in Github Ubuntu machines
// https://github.com/webdriverio/jasmine-boilerplate/commit/53e88abc19ddf407aa95806532e920b42232a8a7

const basicConfig = require('./wdio.conf.ts')

exports.config = {
  ...basicConfig.config,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['headless', 'disable-gpu']
      },
    },
  ],
}
