var WEB_PORT = 3000
var GPIO_ENABLED = false // set to false to simulate in case not running on raspberry


var express = require('express')
var app = express()
var gpio = GPIO_ENABLED ? require("gpio") : null;
var socketio = require('socket.io')
var exec = require('child_process').exec;



//tracks last value of gpio22
BUTTON_LAST_VALUE = 1 // 1 -> Button not pressed 0 -> Button pressed
//reserved for websocket connection
WS_CONNECTION = null;


/// SETUP STATIC WEBSERVER //////////////////
app.use(express.static('public'))
var server = app.listen(WEB_PORT, function () {
  console.log('Static server listening on port '+WEB_PORT)
})


/// SETUP FULL-DUPLEX COMMUNICATION /////////

io = socketio.listen(server)
console.log('WebSocker server listening on port '+WEB_PORT)


io.sockets.on('connection', function (socket) {
  WS_CONNECTION = socket;
  sendUpdate();
});



/// SETUP GPIO EVENT LISTENERS /////////////


var sendUpdate = function(){
  if( WS_CONNECTION ){
    console.log("Client connected, sending first update")
    var payload = {'button':BUTTON_LAST_VALUE}
    WS_CONNECTION.emit('message', JSON.stringify(payload))
  }else{
    console.log("Warning: no client connected, cannot send update.")
  }
}


if(GPIO_ENABLED){

  var gpio22 = gpio.export(22, {
     direction: "in",
     ready: function() {
      console.log("GPIO ready")
     }
  });

  gpio22.on("change", function(val) {
    BUTTON_LAST_VALUE = val
    sendUpdate();
  });

  exec("chromium-browser --incognito --kiosk http://localhost:"+WEB_PORT)

}else{
  console.log("GPIO disabled")
}





