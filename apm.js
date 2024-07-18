const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const bookingNos = ["67291313", "720187558", "720187558", "66291707", "241190442"];

    try {
        await page.goto('https://www.apmterminals.com/en/port-elizabeth/track-and-trace/booking-enquiry');
        const filteredResponses = await page.evaluate((bookingNos) => {
            return fetch('https://www.apmterminals.com/apm/api/trackandtrace/booking-enquiry', {
                method: 'POST',
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
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
                    "Ids": bookingNos
                })
            })
            .then(response => response.json())
            .then(data => {
                return data.GroupedBookingResults.filter(item => item.Appointment === false).map(item => ({
                    BookingId: item.BookingId,
                    VesselName: item.VesselName,
                    Voyage: item.Voyage,
                    BeginReceiveDate: item.BeginReceiveDate,
                    BeginReceiveTime: item.BeginReceiveTime,
                    CargoCutOff: item.CargoCutOff,
                    CargoCutOffTime: item.CargoCutOffTime,
                }));
            })
            .catch(error => {
                console.error('Error fetching API:', error);
                return { error: 'Failed to fetch API' };
            });
        }, bookingNos);

        console.log('Fetched Data:', filteredResponses);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
})();
