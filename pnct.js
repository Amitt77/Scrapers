const request = require('request');

const bookingNos = ["SA01059533","SA01065164","SA01065164","SA01066264","SA01066664","SA01066664","62291315","SA01061897","SA01063182","SA01063182","SA01067520","EBKG09348026","EBKG09392651","EBKG09560995","EBKG09560995","EBKG09560995","EBKGQ0000F02","EBKG09483251","038HOU1816119"];

async function fetchData() {
    try {
        const extractedData = await Promise.all(bookingNos.map(bookingId => {
            const options = {
                'method': 'GET',
                'url': `https://twpapi.pachesapeake.com/api/track/GetBookingReport?siteId=PNCT_NJ&key=${bookingId}&_=1720694816972`,
                'headers': {
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Connection': 'keep-alive',
                    'Origin': 'https://www.pnct.net',
                    'Referer': 'https://www.pnct.net/',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'cross-site',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"'
                }
            };

            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        console.error('Error fetching API:', error);
                        reject(error);
                    } else {
                        try {
                            const data = JSON.parse(body)[0]; // Assuming the response is an array with one object
                            const extracted = {
                                BookingNumber: data.BookingNumber,
                                VoyageNumber: data.VesselCall.VoyageNumber,
                                Name: data.VesselCall.Name,
                                BeginReceive: data.VesselCall.BeginReceive,
                                GeneralCutoff: data.VesselCall.GeneralCutoff
                            };
                            resolve(extracted);
                        } catch (parseError) {
                            console.error('Error parsing JSON:', parseError);
                            reject(parseError);
                        }
                    }
                });
            });
        }));

        console.log('Extracted Data:', extractedData);

    } catch (error) {
        console.error('Error:', error);
    }
}
fetchData();
