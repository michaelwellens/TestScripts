// Import required modules
var child_process = require('child_process');
var spawn = child_process.spawn;


var args_write_pin219_value_1 = ['echo','1','>','/sys/class/gpio/gpio219/value'];

var writepin = spawn('echo', args_write_pin219_value_1);

writepin.stdout.on('data', function(data){
	console.log('stdout: ' + data.toString());
})

writepin.stdout.on('error', function(err){
	console.log('stdout: ' + err.toString());
})
