import { Browser, BrowserContext, Page } from 'playwright';
import { chromium } from 'playwright-extra';
import PluginStealth from "puppeteer-extra-plugin-stealth";

export class POM {
    #browser: Browser | null;

    constructor() {
        this.#browser = null;
    }

    async getBrowser(): Promise<Browser> {
        if (!this.#browser) {
            chromium.use(PluginStealth())
            this.#browser = await chromium.launch({
                args: [
                    '--disable-gpu',
                    '--disable-software-rasterizer',
                ],
            });
        }

        return this.#browser
    }


    async getPage(): Promise<Page> {
        const browser = await this.getBrowser();
        return await browser.newPage();
    }

    async tearDown() {
        (await this.getBrowser()).close();

        this.#browser = null;
    }
}
