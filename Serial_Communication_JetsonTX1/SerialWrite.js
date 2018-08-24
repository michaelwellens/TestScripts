// Initializing
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyTHS2', {
	baudRate: 38400
});

port.write('hallo from jetson', function(err){
	if(err){
		return console.log('Error on write: ', err.message);
	}
	
	console.log('message written');
});

port.on('error', function(err){
	console.log('Error: ', err.message);
})
