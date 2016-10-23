/**
 * Created by ferdous on 10/17/16.
 */
var mongoose = require('mongoose');

exports.MongooseConnector = function (app) {

  if (mongoose.connection.db == null) {

    mongoose.connect('mongodb://localhost/twitterfeed', function () {});
  }
};

