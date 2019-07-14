
const Page = require('./helpers/page');

let page;
beforeEach( async () => {
    page = Page.build();
    await page.goto('http://localhost:3000');
}, 50000);

afterEach( async () => {
     await page.close();
});

test('the header has the correct text', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toEqual('Blogster');
}, 50000); 

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');

    const url = await page.url();

    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed show logged out button', async () => {
    await page.login();
    const text = await page.$eval('a[href="auth/logout"]', ( el => el.innerHTML));
    expect(text).toEqual('Logout');
});