'use strict';
var pages = [
  '/',
  "/home",
  '/about',
  '/upload',
  '/results'
];

let path = require('path');
let express = require('express');
let app = express();

app.use(express.static(__dirname + '/dist'))

pages.forEach((page) => app.get(`${page}`, (req, res) => {res.sendFile(path.join(__dirname, '/dist', 'index.html'))}))

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port ${port}`);