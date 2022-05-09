const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
app.use(bodyParser.json());

const browser = puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    args: ["--no-sandbox"]
});

app.post('/pdf', (req, res) => {
    console.log(req.body.url);

    (async () => {
        const page = await (await browser).newPage();
        await page.goto(req.body.url);

        const pdfStream = await page.createPDFStream({
            format: 'a4',
            margin: {
                top: '0.4in',
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in',
            },
        });

        res.attachment('booking.pdf');
        pdfStream.pipe(res);
    })();
});

app.listen(6000, () => {
    console.log('Now listening on port 6000.')
})