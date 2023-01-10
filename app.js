const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

console.log('Web-to-pdf | Starting');

app.post('/pdf', (req, res) => {
    console.log(`Web-to-pdf | PDF generating for ${req.body.url}`);
    
    (async () => {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/google-chrome',
            args: ["--no-sandbox"]
        });

        try {
            const page = await (await browser).newPage();
            await page.goto(req.body.url);

            const pdf = await page.pdf({
                format: 'a4',
                margin: {
                    top: '0.4in',
                    right: '0.4in',
                    bottom: '0.4in',
                    left: '0.4in',
                },
            });

            res.contentType('application/pdf');
            res.send(pdf);
        } catch(error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    })();
});

app.listen(6000, () => {
    console.log('Web-to-pdf | Server is now listening on port 6000.')
})
