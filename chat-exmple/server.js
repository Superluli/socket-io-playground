var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var id = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = {};

io.on('connection', function(socket){
  
  var name = "user" + (id ++); 
  users[name] = 1;

  io.emit('action message', name + " has joined");

  io.emit('id message', name);  

  io.emit('online message', users);

  socket.on('disconnect', function(){
    io.emit('action message', name + " has left");
    delete users[name];
    io.emit('online message', users);
  });

  socket.on('chat message', function(text){
    io.emit('chat message', {id : name, msg : name + " : " + text});
  });

  socket.on('typing message', function(){
    io.emit('typing message', {id : name, msg : name + " is typing..."});
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
