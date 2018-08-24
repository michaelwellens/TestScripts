// Import required modules
var child_process = require('child_process');
var exec = child_process.exec;

// Define arguments for GPIO control
var args_define_pin = 'echo 219 > /sys/class/gpio/export';
var args_set_pin_direction = 'echo out > /sys/class/gpio/gpio219/direction';
var args_write_pin219_value_1 = 'echo 1 > /sys/class/gpio/gpio219/value';
var args_write_pin219_value_0 = 'echo 0 > /sys/class/gpio/gpio219/value';


var echo_1 = exec(args_define_pin, args_define_pin, function(err, stdout, stderr){
	if(err){
		console.log('error on pin 219 define: ' + err.toString());
	}	
	console.log('stdout at define: ' + stdout.toString());
    console.log('stderr at define: ' + stderr.toString());

    var echo_2 = exec(args_set_pin_direction, function(err,stdout,stderr){
        if(err){
            console.log('error at direction: ' + err.toString());
        }
        console.log('stdout at direction: ' + stdout.toString());
        console.log('stderr at direction: ' + stderr.toString());
        write_Pin_219_To_1();
    })
})




// Function to set pin 219 high
function write_Pin_219_To_1(){
    var writepin = exec(args_write_pin219_value_1, function(err,stdout,stderr){
        if(err){
            console.log('Error on setting pin high: ' + err.toString());
        }
        console.log('stdout at setting pin high ' + stdout.toString());
        console.log('stderr at setting pin high ' + stderr.toString());

        console.log('pin is set high');
        setTimeout(write_Pin_219_To_0, 1000);
    })
}



// Function to set pin 219 low
function write_Pin_219_To_0(){
    var writepin = exec(args_write_pin219_value_0, function(err,stdout, stderr){
          if(err){
              console.log('Error on setting pin low: ' + err.toString());

          }
          console.log('stdout at setting pin low: ' + stdout.toString());
          console.log('stderr at setting pin low: ' + stderr.toString());
          console.log('pin is set low');

          setTimeout(write_Pin_219_To_1, 1000);
    })
}



// Timer
//setInterval(Write_Pin_219_To_1,1000);
//setInterval(Write_Pin_219_To_0,2000);
