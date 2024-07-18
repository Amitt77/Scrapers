const puppeteer = require('puppeteer');

async function loginAndSearch() {
    const username = 'gabriel.blanco@qualityct.com';
    const password = 'qct2017GB#01';
    const bookingNumber = 'EBKG08415742';

    const browser = await puppeteer.launch({ headless: false }); // Set headless: true to run without a browser UI
    const page = await browser.newPage();

    try {
        // Open website
        await page.goto('https://forecast.fitpev.com/fc-FIT/default.do', { waitUntil: 'networkidle2' });

        // Enter Email or username
        await page.waitForXPath("//input[@id='j_username']");
        await page.type("#j_username", username);

        // Enter Password
        await page.waitForXPath("//input[@id='j_password']");
        await page.type("#j_password", password);

        // Click on Log in
        await page.waitForXPath("//button[@id='signIn']");
        await page.click("#signIn");

        // Wait for navigation after login
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Click on Booking
        await page.waitForXPath("//body/div[3]/div[3]/ul[1]/li[5]/ul[1]/li[1]/a[1]");
        await page.click("body > div.container.main-page > div.page-content > ul:nth-child(6) > li.dropdown.js-activated.disabled > ul > li:nth-child(1) > a");

        // Enter Number
        await page.waitForXPath("//input[@id='number']");
        await page.type("#number", bookingNumber);

        // Click on Search
        await page.waitForXPath("//button[@id='search']");
        await page.click("#search");

        // Wait for search results or perform further actions
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Search completed successfully.');

    } catch (error) {
        console.error('Error during login and search:', error);
    } finally {
        await browser.close();
    }
}

loginAndSearch().catch(error => console.error('Error in main function:', error));
