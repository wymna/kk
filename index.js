const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的数据
app.use(bodyParser.json());

app.get('/', (req, res) => {
  const url = "https://www.bing.com/search?q=1|MUID;Generic;GetItem;1,MUID||||||||&wf=Multimedia.UserStore.Mock.MockSavesAPIWorkflow&format=pbxml&features=1";

  if (url) {
    https.get(url, (targetRes) => {
      let xmlData = '';

      targetRes.on('data', (chunk) => {
        xmlData += chunk;
      });

      targetRes.on('end', () => {
        // const html = `
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
        const responseData = {
          xmlData: xmlData
        };

        res.json(responseData);
        console.log(responseData.xmlData);
      });
    }).on('error', (error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
  } else {
    res.status(400).send('Bad Request');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});