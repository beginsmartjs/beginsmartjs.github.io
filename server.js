var express = require('express');
var app = express();
console.log(__dirname);

app.use(express.static('./'));

app.listen(3000);