'use strict';

var bonjour = require('bonjour')();
var ip = require('ip');

var app = require('./app');

var port = process.env.PORT || 64645;

app.listen(port, function () {
  var host = app.address;

  console.log('Server running on port %d', port);
});
