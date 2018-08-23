// Initializing
var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyTHS2', {
	baudRate: 38400
});


// Switches the port into "flowing mode"
port.on('data', function(data){
	console.log('Data: ', data);
});

// Read the data that is available but keep the stream from entering "flowing mode"
port.on('readable',function(){
	console.log('Data:',port.read());
});

port.on('error', function(err){
	console.log('Error: ', err.message);
})

