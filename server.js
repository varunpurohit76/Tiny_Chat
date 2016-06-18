var express = require('express');
var app = express();
var http = require('http').Server(app);
var socketioJwt = require('socketio-jwt');
var io = require('socket.io')(http);
var people_online = [];
var people_typing = [];

app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io
	.on('connection', socketioJwt.authorize({
		secret: Buffer(process.env.AUTH0_CLIENT_SECRET,'base64'),
		timeout: 15000
	}))
	.on('authenticated',function(socket){
		var user;
		socket.on('disconnect', function(msg, username) {
			var r = people_online.indexOf(user);
			people_online.splice(r,1);
			socket.broadcast.emit('user left', user, people_online);
		});
		socket.on('user connected', function(username) {
			people_online.push(username)
			io.emit('user connected', username, people_online);	
			user = username;
		});
		socket.on('chat message', function(msg ,username){
			io.emit('chat message', msg, username);
		});
		socket.on('is typing', function(username) {
			if(people_online.indexOf(user)+1) {
				var t = people_online.indexOf(user);
				people_typing.splice(t,1);
			}
			people_typing.push(username);
			io.emit('is typing', people_typing);
			setTimeout( function() {
				var t = people_online.indexOf(user);
				people_typing.splice(t,1);
				io.emit('is typing', people_typing);
			}, 750);
		})
});

var port = Number(process.env.PORT || 3000)
http.listen(port, function(){
  console.log('listening on *: ' + port);
});
