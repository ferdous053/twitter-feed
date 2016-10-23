/**
 * Created by ferdous on 10/22/16.
 */

module.exports = function (app) {

  var mongoose = require('mongoose');
  var TwitterFeed = require('../db/schemas/TwitterFeedSchema').TwitterFeed;

  app.get('/twitter-feeds', function (req, res) {

    TwitterFeed.find({}, function(error, feeds){
      if(error){
        console.log('Error on finding feeds', error);
        res.send([]);
      }
      else{
        res.send(feeds);
      }
    }).sort({feed_date: -1});
  });

  app.post('/twitter-feeds', function (req, res) {
    var twitObject = {
      feed_date: new Date(),
      text: req.body.text
    };
    if(req.body.author && req.body.author !== ''){
      twitObject.author = req.body.author;
    }
    else{
      twitObject.author = 'Anonymous';
    }
    var twitterFeed = new TwitterFeed(twitObject);
    twitterFeed.save(function(e, savedFeed){
      if(e){
        console.log('Error saving feed.', e);
        res.send({msg:'Error saving feed.', error: e});
      }
      else{
        res.send(savedFeed);
      }
    });
  });

};