const { Before, After, setDefaultTimeout, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium, expect } = require('@playwright/test');

setDefaultTimeout(60_000);

class AgendaLabWorld {
  constructor() {
    this.baseURL = process.env.BASE_URL || 'https://agendalabqa.vercel.app';
    this.browser = null;
    this.context = null;
    this.page = null;
    this.expect = expect;
    this.appointment = null;
  }
}

setWorldConstructor(AgendaLabWorld);

Before(async function () {
  this.browser = await chromium.launch({
    headless: process.env.HEADED !== 'true',
  });
  this.context = await this.browser.newContext({
    baseURL: this.baseURL,
  });
  this.page = await this.context.newPage();
});

After(async function () {
  await this.context?.close();
  await this.browser?.close();
});
