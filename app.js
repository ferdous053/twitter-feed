/**
 * Created by ferdous on 10/17/16.
 */
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db/MongooseConnector').MongooseConnector(app);
var httpServer = require('http').createServer(app);

httpServer.listen(8080);

app.set('env', 'development');
app.set('port', (process.env.PORT || 8080));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(app.router);

app.configure('development', function () {
  require('./routes/index')(app);
});

module.exports = app;