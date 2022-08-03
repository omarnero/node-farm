const fs = require('fs');
const http = require('http');

const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));

    const output = tempOverview.replace(/{%PRODUCT-CARDS%}/g, cardsHtml);
    res.end(output);
  }
  //product page
  else if (pathname === '/product') {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    const productHtml = dataObj[query.id];
    const output = replaceTemplate(tempProduct, productHtml);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>page not found</h1>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listing to server in port 8000');
});
