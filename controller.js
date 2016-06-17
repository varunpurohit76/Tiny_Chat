var socket = io();

var username = prompt('Username','User');
socket.on('connect', function() {        
  socket.emit('user connected', username);
  $('form').submit(function(){
    socket.emit('chat message', $('#m').val(), username);
    $('#m').val('');
    return false;
  });
});

socket.on('chat message', function(msg, username){
  console.log(msg);
  $('#messages').append($('<li>').text(username + ' : ' + msg));
}); 

socket.on('user left', function(username, user_nos, people_online) {
  $('#messages').append($('<li class=\'delete\'>').text(username + ' left! '+user_nos + ' people online.'  ));
  displayonline(people_online);
})

socket.on('user connected', function(username, user_nos, people_online) {
  $('#messages').append($('<li class=\'add\'>').text(username + ' joined! '+user_nos + ' people online.'  ));
  displayonline(people_online);
})


function displayonline(people_online) {
  
  var Parent = document.getElementById('show_online');
  while(Parent.hasChildNodes())
  {
     Parent.removeChild(Parent.firstChild);
  }

  var len = people_online.length;

  for(i=0;i<len;i++) {
    console.log(people_online[i]);
    $('#show_online').append($('<li class=\'add\'>').text(people_online[i]));
  }
}
