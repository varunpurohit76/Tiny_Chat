var userProfile;
var userToken;
var lock = new Auth0Lock('rlKumH145FiN62bUQGHGJbximTHPvUPF', 'monicagangwar.auth0.com');
var hash = lock.parseHash();
var username;

$('#chat').hide();
$('#login button').click(function(e){
	e.preventDefault();
	lock.show();
});
if(hash){
	if(hash.error){
		console.log('Error logging in',hash.error);
	}
	else{
		lock.getProfile(hash.id_token,function(err,profile){
			if(err){
				console.log('Cannot get user',err);
				return;
			}
			console.log('connected and authenticated');
			userProfile = profile;
			localStorage.setItem('userToken', hash.id_token);
			userToken = hash.id_token;
			openChat();
		});
	}
}

function openChat(){
	var socket = io();
	socket.on('connect', function() {
		socket.on('authenticated',function(){
			$('#login').hide();
			$('#chat').show();
			username = prompt('Nick name','User');
			socket.emit('user connected', username);
			$('form').submit(function(){
				socket.emit('chat message', $('#m').val(), username);
				$('#m').val('');
				return false;
			});
			socket.on('chat message', function(msg, username){
				console.log(msg);
				$('#messages').append($('<li>').text(username + ' : ' + msg));
				updateScroll();
			}); 
			socket.on('user left', function(username, people_online) {
				$('#messages').append($('<li class=\'delete\'>').text(username + ' left! '+ people_online.length + ' people online.'  ));
				displayonline(people_online);
				updateScroll();
			});

			socket.on('user connected', function(username, people_online) {
				$('#messages').append($('<li class=\'add\'>').text(username + ' joined! '+ people_online.length + ' people online.'  ));
				displayonline(people_online);
				updateScroll();
			});

			socket.on('is typing', function(people_typing) {
				var uniqueNames = [];
				$.each(people_typing, function(i, el){
 			   if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
				});
				displayTyping(uniqueNames);
			});

			$( "#m" ).keyup(function() {
			socket.emit('is typing', username);
			});
		}).emit('authenticate',{token: userToken});
	});
}
function displayonline(people_online) {
  var Parent = document.getElementById('show_online');
  while(Parent.hasChildNodes())
  {
     Parent.removeChild(Parent.firstChild);
  }

  var len = people_online.length;
  $('#show_online').append($('<li>').text('People Online'));
  for(i=0;i<len;i++) {
    $('#show_online').append($('<li class=\'online\'>').text(people_online[i]));
  }
}

function displayTyping(people_typing_unique) {
	console.log(people_typing_unique);
	var newHTML;
	if(people_typing_unique) {
		newHTML = ["People typing :"];
	//	newHTML = [];
		for (var i = 0; i < people_typing_unique.length; i++) {
	    	newHTML.push('<span> ' + people_typing_unique[i] + '</span>');
	}
	console.log(newHTML);
	$("p").html(newHTML);
	}
}
function updateScroll(){
    var element = document.getElementById("chat_content");
    element.scrollTop = element.scrollHeight;
}

