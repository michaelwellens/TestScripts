// Import required modules
var child_process = require('child_process');
var exec = child_process.exec;

// Define arguments for GPIO control
var args_define_pin = 'echo 38 > /sys/class/gpio/export';
var args_set_pin_direction = 'echo in > /sys/class/gpio/gpio38/direction';
var args_read_pin38_value = 'cat /sys/class/gpio/gpio38/value';


var echo_1 = exec(args_define_pin, function(error, stdout, stderr){
	if(error){
		console.log('exec error on define pin 38: ' + error.toString());
		return;
	}
	console.log('stdout at define: ' + stdout.toString());
	console.log('stderr at define: ' + stderr.toString());
	
	var echo_2 = exec(args_set_pin_direction, function(error, stdout, stderr){
		if(error){
			console.log('exec error on set pin 38 direction: ' + error.toString());
			return;
		}
		console.log('stdout at direction: ' + stdout.toString());
		console.log('stdout at direction: ' + stderr.toString());
		
        read_Pin_38();
	})
})



// Function toe read Pin38
function read_Pin_38(){
	var readPin38 = exec(args_read_pin38_value, function(err, stdout, stderr){
		if(err){
			console.log('error on reading pin38: ' + err.toString());
		}
		console.log('stdout at reading: ' + stdout.toString());
		console.log('stderr at reading: ' + stderr.toString());
	})
}
	


