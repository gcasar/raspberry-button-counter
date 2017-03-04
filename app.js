const WEB_PORT = 3000
const WEBSOCKET_PORT = 8080
const GPIO_ENABLED = false // set to false to simulate in case not running on raspberry


const express = require('express')
const app = express()
const gpio = GPIO_ENABLED ? require("gpio") : null;
const WebSocket = require('ws');


//tracks last value of gpio22
BUTTON_LAST_VALUE = 1 // 1 -> Button not pressed 0 -> Button pressed
//reserved for websocket connection
WS_CONNECTION = null;


/// SETUP STATIC WEBSERVER //////////////////
app.use(express.static('public'))
app.listen(WEB_PORT, function () {
  console.log('Static server listening on port '+WEB_PORT)
})


/// SETUP FULL-DUPLEX COMMUNICATION /////////

const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });
console.log('WebSocker server listening on port '+WEBSOCKET_PORT)

wss.on('connection', function connection(ws) {
  WS_CONNECTION = ws;
  sendUpdate();
});


/// SETUP GPIO EVENT LISTENERS /////////////


const sendUpdate = function(){
  if( WS_CONNECTION ){
    console.log("Client connected, sending first update")
    const payload = {'button':BUTTON_LAST_VALUE}
    WS_CONNECTION.send(JSON.stringify(payload))
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

}else{
  console.log("GPIO disabled")
}




