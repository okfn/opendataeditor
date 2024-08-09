import { $, expect } from '@wdio/globals'

describe('Electron Testing', () => {
    it('should display Open Data Editor on header', async () => {
        // make sure we have focus on the correct window
        const handles = await browser.getWindowHandles()
        await browser.switchToWindow(handles[0])
        
        const header = $('header')
        await expect(header).toHaveText(expect.stringContaining('Open Data Editor'))
    })
})

