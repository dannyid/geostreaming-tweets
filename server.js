var express = require('express')
, Tuiter = require('tuiter')
, http = require('http')
, util = require('util')
, keys = require('./keys.json')
, io = require('socket.io');

var TWITTER_FILTER = "sunset"; //filter the tweets by a keyword
var app = express();
app.configure(function(){
    app.use(express.static(__dirname + '/public'));
	app.use(express.logger('dev'));
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(app.router);
    });


app.get('/', function(req, res){
    res.render('index');
    });

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
    });

var io = require('socket.io').listen(server);
var t = new Tuiter(keys);
var loc = {locations: [{long: -180, lat: -90},{long: 180, lat: 90}]};
var filter_str = TWITTER_FILTER;

t.filter(loc, function(stream){
    stream.on("tweet", function(data){
      if(data.coordinates && data.coordinates.coordinates && data.text.toLowerCase().indexOf(filter_str)!==-1){

      io.sockets.emit("tweet", {
coordinates: data.coordinates.coordinates
, screen_name: data.user.screen_name
, text: data.text
, pic: data.user.profile_image_url
, time: data.created_at
});
      } else if(data.place && data.text.toLowerCase().indexOf(filter_str)!==-1){
      var place = data.place.bounding_box.coordinates[0][0];
      io.sockets.emit("tweet", {
coordinates: place
, screen_name: data.user.screen_name
, text: data.text
, pic: data.user.profile_image_url
});
      }
      });

stream.on("error", function(error){
    console.log('error');
    console.log(error);
    });
});

process.on('uncaughtException', function(err){
    util.inspect(err);
    });

