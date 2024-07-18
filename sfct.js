const request = require('request');


const bookingNos = ["63614789","64281455","64948575","67286800","68623803","NAM6956040","NAM6956275","NAM7014580","NAM7015304","NAM7017853","NAM7023689"];

async function fetchData() {
    try {
        const filteredResponses = await Promise.all(bookingNos.map(async bookingId => {
            const options = {
                'method': 'POST',
                'url': 'https://www.apmterminals.com/apm/api/trackandtrace/booking-enquiry',
                'headers': {
                  'accept': 'application/json, text/javascript, */*; q=0.01',
                  'accept-language': 'en-US,en;q=0.9',
                  'content-type': 'application/json',
                  'origin': 'https://www.apmterminals.com',
                  'priority': 'u=1, i',
                  'referer': 'https://www.apmterminals.com/en/miami/track-and-trace/booking-enquiry',
                  'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                  'sec-ch-ua-mobile': '?0',
                  'sec-ch-ua-platform': '"Windows"',
                  'sec-fetch-dest': 'empty',
                  'sec-fetch-mode': 'cors',
                  'sec-fetch-site': 'same-origin',
                  'site-id': '369d208d-f0ad-4ea9-93d4-fbef44bbb5d8',
                  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                  'x-requested-with': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                  "TerminalId": "369d208d-f0ad-4ea9-93d4-fbef44bbb5d8",
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
