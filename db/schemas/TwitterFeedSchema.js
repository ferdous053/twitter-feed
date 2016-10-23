/**
 * Created by ferdous on 10/22/16.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var TwitterFeedSchema = new Schema({
  author: {type: String, default: 'Anonymous'},
  feed_date: {type: Date, required: false},
  text: {type: String}
});

var TwitterFeed = mongoose.model('twitter_feeds', TwitterFeedSchema);
exports.TwitterFeed = TwitterFeed;