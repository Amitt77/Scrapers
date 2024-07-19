const puppeteer = require('puppeteer');

async function loginAndSubmitBooking() {
    const username = 'gabriel.blanco@qualityct.com';
    const password = 'qct2017GB#01';

    const containerNumbers = ['ABC9876543', 'XYZ1234567', 'MRSU6357389'];
    const bookingNumbers = ['242285070', '242285069', '242285068'];

    let browser;

    try {
        // Launch browser and open a new page
        browser = await puppeteer.launch({ headless: false }); // Set headless to false for debugging
        const page = await browser.newPage();

        // Open website
        await page.goto('https://forecast.fitpev.com/fc-FIT/default.do');

        // Enter Email or username
        await page.type('#j_username', username);

        // Enter Password
        await page.type('#j_password', password);

        // Click on Log in
        await Promise.all([
            page.waitForNavigation(), // Wait for navigation to complete
            page.click('#signIn')
        ]);

        // Wait for the page to load after login
        await page.waitForSelector('a[href="/fc-FIT/import/default.do"]', { timeout: 10000 });

        for (let i = 0; i < containerNumbers.length; i++) {
            const containerNumber = containerNumbers[i];
            const bookingNumber = bookingNumbers[i];

            try {
                await page.click('a[href="/fc-FIT/import/default.do"]');

                await page.waitForSelector('#numbers', { timeout: 10000 });

                await page.type('#numbers', containerNumber);

                await Promise.all([
                    page.waitForNavigation(), // Wait for navigation to complete
                    page.click('#search')
                ]);

                await page.waitForSelector('#result', { timeout: 10000 });

                const line = await page.$eval('#result > table > tbody > tr > td:nth-child(5) > div:nth-child(3) > strong', el => el.innerText)
                    .catch(() => null);

                if (!line) {
                    console.log(`Unable to get information from port site.`);
                    console.log({
                        containerNumber,
                        bookingNumber,
                        sizeType: '',
                        line: '',
                        vesselVoyage: ''
                    });
                    continue;
                }

                await page.goto('https://forecast.fitpev.com/fc-FIT/export/default.do');

                await page.waitForSelector('#number', { timeout: 10000 });

                await page.type('#number', bookingNumber);

                await page.select('#line', line);

                await Promise.all([
                    page.waitForNavigation(), // Wait for navigation to complete
                    page.click('#search')
                ]);

                await page.waitForSelector('.south_20', { timeout: 10000 });

                const tdContent = await page.evaluate((containerNumber, bookingNumber) => {
                    const southDiv = document.querySelector('.south_20');
                    const table = southDiv.querySelector('.table-condensed');
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        const trElement = tbody.querySelector('tr');
                        if (trElement) {
                            const sizeType = trElement.querySelector('td:nth-child(3)').innerHTML; // 3rd <td> (Size/Type)
                            const line = trElement.querySelector('td:nth-child(6)').innerHTML; // 6th <td> (Line)
                            const vesselVoyage = trElement.querySelector('td:nth-child(7)').innerHTML; // 7th <td> (Vessel/Voyage)
                            return { containerNumber, bookingNumber, sizeType, line, vesselVoyage };
                        }
                    }
                    return { containerNumber, bookingNumber, sizeType: '', line: '', vesselVoyage: '' };
                }, containerNumber, bookingNumber);

                console.log(`Successfully Scraped`, tdContent);

            } catch (error) {
                console.error(`Error processing container ${containerNumber} and booking ${bookingNumber}:`, error);
            }
        }

        // Wait for 10 seconds (for demonstration purposes)
        await new Promise(resolve => setTimeout(resolve, 10000));

    } catch (error) {
        console.error('Error during login:', error);
    } finally {
        // Close the browser
        if (browser) {
            await browser.close();
        }
    }
}

loginAndSubmitBooking().catch(error => console.error('Error in main function:', error));
