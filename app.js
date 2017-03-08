var dotenv = require('dotenv'); //must be 1st
dotenv.load(); //must be 2nd

var express = require('express');
var bodyParser = require('body-parser');
var Botkit = require('./node_modules/botkit/lib/Botkit.js');
var os = require('os');
var request = require('request');
var async = require('async');

var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// Routes
app.get('/who', function(req, res) {
  var msg = 'Ramy is the horselord';
  if (req.query.text.toLowerCase() == 'ramy') {
    msg = 'Correct, ' + msg;
  } else if (req.query.text != '') {
    msg = 'Incorrect, ' + req.query.text + ' is not the horselord. ' + msg;
  }
  var answer = {
    "response_type": "in_channel",
    "text": msg,
    "attachments": [
      {
          "text":"...and always will be."
      }
    ]
  };
  res.send(answer);
});

app.get('/oreo', function(req, res) {
  var msg = 'Joe is the oreolord';
  if (req.query.text.toLowerCase() == 'joe') {
    msg = 'Correct, ' + msg;
  } else if (req.query.text != '') {
    msg = 'Incorrect, ' + req.query.text + ' is not the horselord. ' + msg;
  }
  var answer = {
    "response_type": "in_channel",
    "text": msg,
    "attachments": [
      {
          "text":"...and always will be."
      }
    ]
  };
  res.send(answer);
});

app.get('/net', function(req, res) {
  var msg = 'Nothing but net';
  if (req.query.text != '') {
    msg = req.query.text;
  }
  var answer = {
    "response_type": "in_channel",
    "text": msg,
    "attachments": [
      {   "fallback" : "Awesome gif of the H.O.R.S.E.Lord nailing a sweet shot.", //apparently required by slack but not in docs
          "image_url": "https://media.giphy.com/media/3o7abIyqT0HMHq4oJq/giphy.gif"
      }
    ]
  };
  res.send(answer);
});


// CATIPHY STUFFF --------------------

function catiphy (origMsgTxt) {
  var x = origMsgTxt.indexOf('giphy');
  var y = origMsgTxt.substr(x+5,origMsgTxt.length - x);
  var z = [];
  z.push(y);
  z.push('cat' + y);

  return z;
}

function getGiphy (searchTerm, cb) {
  var baseUrl = 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=';
  var reqUrl = baseUrl + encodeURIComponent(searchTerm);
  console.log(reqUrl);
  request(reqUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(null, body);
    } else {
      cb(true);
    }
  })
}

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token: process.env.SLACK_CATIPHY_TOKEN
}).startRTM();

controller.hears('giphy', ['direct_message,direct_mention,mention,ambient,message_received'], function(bot, message) {
  console.log(message);
  var msgs = catiphy(message.text);
  console.log("msgs: ", msgs);
  async.each(msgs, function (msg, callback) {
    console.log("msg: ", msg);
    getGiphy(msg, function (err, giphyInfo) {
      if (err) {
        console.log('something went wrong with giphy');
      } else {
        giphyInfo = JSON.parse(giphyInfo);
        if (msgs.indexOf(msg) === 0) {
          bot.api.reactions.add({
              timestamp: message.ts,
              channel: message.channel,
              name: 'robot_face',
          }, function(err, res) {
              if (err) {
                  bot.botkit.log('Failed to add emoji reaction :(', err);
              }
          });  
        }
        
        controller.storage.users.get(message.user, function(err, user) {
          if (msgs.indexOf(msg) === 0) {
            var respMsg = '/giphy ' + msg;  
          } else {
            var respMsg = 'I think you meant to say: /giphy ' + msg;
          }
          
          var replyPayload = {
            'text': respMsg,
            'attachments' : [
              {
                'fallback'  : 'giphy catiphy',
                'image_url' : giphyInfo.data.fixed_height_downsampled_url
              }
            ]
          }      
          bot.reply(message, replyPayload);
        });

      }
    });
    setTimeout( function(){}, 3000);
  }, function (err) {
    if (err) {
      console.log('something went wrong with giphy: ', err);
    } else {
      console.log('all msgs processed');
    }
  });
});

var server = app.listen(3009);
console.log('server started');