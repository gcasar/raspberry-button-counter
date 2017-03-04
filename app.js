var express = require('express')
var app = express()

app.use(express.static('public'))
app.get('/button/', function (req, res) { 
	var responseObject = {
		'button':1
	}

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(responseObject))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
