const path = require('path');

//let electronPath = path.join(__dirname, '../node_modules/.bin/electron');
let electronPath = path.join(__dirname, '../dist/opendataeditor-linux-1.0.0.AppImage');
if (process.platform === 'win32') electronPath += '.cmd';

const webdriver = require('selenium-webdriver')
const driver = new webdriver.Builder()
  // The "9515" is the port opened by ChromeDriver.
  .usingServer('http://localhost:9515')
  .withCapabilities({
    'goog:chromeOptions': {
      // Here is the path to your Electron binary.
      binary: electronPath
    }
  })
  .forBrowser('chrome') // note: use .forBrowser('electron') for selenium-webdriver <= 3.6.0
  .build()
driver.findElement(webdriver.By.className('.loader'))
      .getText().then(textValue => {
        assert.exists();
      });
driver.quit()