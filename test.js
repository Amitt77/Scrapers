const puppeteer = require('puppeteer');
const request = require('request');

(async () => {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the target page
    await page.goto('https://www.apmterminals.com/en/tools/track-and-trace?tab=1');

    // Wait for the necessary element and trigger the keypress event
    await page.waitForSelector('[onkeypress="CookieInformation.submitAllCategories();"]');
    await page.evaluate(() => {
        const element = document.querySelector('[onkeypress="CookieInformation.submitAllCategories();"]');
        if (element) {
            const event = new KeyboardEvent('keypress', { key: 'Enter' });
            element.dispatchEvent(event);
        }
    });

    // Wait for 30 seconds (30000 milliseconds)
    // await page.waitForTimeout(30000);

    // Scrape the required data from the page
    const scrapedData = await page.evaluate(() => {
        // Example: Scraping the text content of an element with a specific selector
        const element = document.querySelector('#your-element-selector');
        return element ? element.textContent : null;
    });

    console.log('Scraped Data:', scrapedData);

    // Get cookies from the page
    const cookies = await page.cookies();
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    // Close the browser
    await browser.close();

    // Set up the options for the API request
    const options = {
        method: 'POST',
        url: 'https://www.apmterminals.com/apm/api/trackandtrace/booking-enquiry',
        headers: {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'cookie': cookieString,
            'origin': 'https://www.apmterminals.com',
            'priority': 'u=1, i',
            'referer': 'https://www.apmterminals.com/en/port-elizabeth/track-and-trace/booking-enquiry',
            'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'site-id': 'cfc387ee-e47e-400a-80c5-85d4316f1af9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest'
        },
        body: JSON.stringify({
            "TerminalId": "cfc387ee-e47e-400a-80c5-85d4316f1af9",
            "DateFormat": "mm/dd/y",
            "Ids": [
                "240500800"
            ]
        })
    };

    // Make the API request
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
})();
