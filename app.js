var express = require('express')
var app = express()

var last_val = 1

app.use(express.static('public'))
app.get('/button/', function (req, res) { 
	var responseObject = {
		'button':last_val
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(responseObject))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var gpio = require("gpio");
var gpio22 = gpio.export(22, {
   direction: "in",
   ready: function() {
   }
});
gpio22.on("change", function(val) {
   // value will report either 1 or 0 (number) when the value changes
   console.log(val)
last_val = val
});

