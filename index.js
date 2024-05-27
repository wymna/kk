const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const urlParam = url.searchParams.get('url');

  if (urlParam) {
    const parsedUrl = new URL(urlParam);
    const qValue = parsedUrl.searchParams.get('q');

    if (qValue) {
      const targetUrl = `https://www.bing.com/search?q=${encodeURIComponent(qValue)}`;

      https.get(targetUrl, (targetRes) => {
        let xmlData = '';

        targetRes.on('data', (chunk) => {
          xmlData += chunk;
        });

        targetRes.on('end', () => {
          res.set('Access-Control-Allow-Origin', '*');
          res.set('Access-Control-Allow-Methods', 'GET');
          res.set('Access-Control-Allow-Headers', 'Content-Type');
          res.set('Content-Type', 'application/xml');
          res.send(xmlData);

        //   const html = `
        //   <html>
        //     <head>
        //       <title>XML Data</title>
        //     </head>
        //     <body>
        //       <pre>${xmlData}</pre>
        //     </body>
        //   </html>
        // `;

        // res.set('Content-Type', 'text/html');
        // res.send(html);
        });
      }).on('error', (error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
    } else {
      res.status(400).send('Bad Request');
    }
  } else {
    res.status(400).send('Bad Request');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});