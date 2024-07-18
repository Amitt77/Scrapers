const request = require('request');


const bookingNos = ["64620796","241876206","410380791","OCE0296449","OCE0296450","OCE0296450","OCE0296451","OCE0296452","OCE0296452","OCE0299094","SII298246"];

async function fetchData() {
    try {
        const filteredResponses = await Promise.all(bookingNos.map(async bookingId => {
            const options = {
                method: 'POST',
                url: 'https://www.apmterminals.com/apm/api/trackandtrace/booking-enquiry',
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'en-US,en;q=0.9',
                    'content-type': 'application/json',
                    'origin': 'https://www.apmterminals.com',
                    'referer': 'https://www.apmterminals.com/en/los-angeles/track-and-trace/booking-enquiry',
                    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'site-id': 'c56ab48b-586f-4fd2-9a1f-06721c94f3bb',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    "TerminalId": "c56ab48b-586f-4fd2-9a1f-06721c94f3bb",
                    "DateFormat": "mm/dd/y",
                    "Ids": [bookingId]
                })
            };

            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        console.error('Error fetching API:', error);
                        reject(error);
                    } else {
                        const data = JSON.parse(body);
                        const filteredData = data.GroupedBookingResults
                            .filter(item => item.Appointment === false)
                            .map(item => ({
                                BookingId: item.BookingId,
                                VesselName: item.VesselName,
                                Voyage: item.Voyage,
                                BeginReceiveDate: item.BeginReceiveDate,
                                BeginReceiveTime: item.BeginReceiveTime,
                                CargoCutOff: item.CargoCutOff,
                                CargoCutOffTime: item.CargoCutOffTime,
                            }));
                        resolve(filteredData);
                    }
                });
            });
        }));

        console.log('Filtered Responses:', filteredResponses);

    } catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
