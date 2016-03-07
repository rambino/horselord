var express = require('express');
var bodyParser = require('body-parser');

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
      {
          "img_url":"https://media.giphy.com/media/l2JJClemzArq8PFwQ/giphy.gif"
      }
    ]
  };
  res.send(answer);
});

var server = app.listen(3009);
console.log('server started');