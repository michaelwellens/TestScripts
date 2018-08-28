// Import required modules
var child_process = require('child_process');
var exec = child_process.exec;
var fs = require('fs');

// Global variabels
var exportedOutPins = [];



/////////////////////////////////////
// Functions to call in other scripts
/////////////////////////////////////

exports.read = function(pin, mode, cb){
    read_Pin(pin, mode, cb);
}


exports.write = function(pin,value, cb){
    write_Pin(pin, value, cb);
}

exports.unexport = function(pin , cb){
    unexport_Pin(pin, cb);
}

exports.export = function(pin, cb){
    export_Pin(pin, cb);
}

exports.direction = function(pin, mode, cb){
    direction_Pin(pin, mode, cb);
}



////////////////////////////////////
// Functions used inside this module
////////////////////////////////////

function export_Pin(pin, cb /*err*/){
    console.log(pin.toString());
    var pin_nr = pin.toString();
    cb = cb || function(){}


    var exportpin = exec('echo '+pin_nr+' /sys/class/gpio/export', function(err,stdout,stderr){
        if(err){
            console.log('Error on export pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at export ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at export pin ' + pin_nr + ' ' + stderr.toString());

        console.log('pin ' + pin_nr +  ' is exported');

        exportedOutPins.push(pin);
    })
}

function unexport_Pin(pin, cb /*err*/){
    console.log(pin.toString());
    var pin_nr = pin.toString();
    cb = cb || function(){}


    var unexport = exec('echo '+pin_nr+' /sys/class/gpio/unexport', function(err,stdout,stderr){
        if(err){
            console.log('Error on unexport pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at unexport ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at unexport pin ' + pin_nr + ' ' + stderr.toString());

        // Remove the pin number from the exportedOutPins list
        for(var i = exportedOutPins.length - 1; i >= 0; i--) {
            if(exportedOutPins[i] === pin) {
               exportedOutPins.splice(i, 1);
            }
        }

        console.log('pin ' + pin_nr +  ' is unexported');


    })
}


function direction_Pin(pin,mode, cb /*err*/){
    console.log(pin.toString());
    console.log(mode.toString());
    var pin_nr = pin.toString();
    var mode_pin = mode.toString();

    cb = cb || function(){}


    var direction = exec('echo '+mode_pin+' > /sys/class/gpio/gpio' + mode_pin + '/direction', function(err,stdout,stderr){
        if(err){
            console.log('Error on direction pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at direction ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at direction pin ' + pin_nr + ' ' + stderr.toString());

        console.log('pin ' + pin_nr + ' direction is set');


    })
}

function write_Pin(pin,value, cb /*err*/){
    //console.log(pin.toString());
    //console.log(value.toString());
    //console.log(exportedOutPins);


    var pin_nr = pin.toString();
    var pin_value = value.toString();
    var mode_pin = "out";

    // This is a check to convert true to 1 and false to 0 because in some script peolple use true or false instead of 1 and 0
    // We need 1 or 0 because true and false are not recognized with the commands for GPIO control
    if(pin_value === "true"){
        pin_value = "1";
    } if( pin_value === "false"){
        pin_value = "0";
    } else{
        pin_value = pin_value;
    }

    cb = cb || function(){}

    // Check if the selected pin is not already exported
    if(exportedOutPins.includes(pin)){
        var writepin = exec('echo '+pin_value+' > /sys/class/gpio/gpio' + pin_nr + '/value', function(err,stdout,stderr){
            if(err){
                console.log('Error on setting value for pin ' + pin_nr + ' ' + err.toString());
                return err;
            }
            console.log('stdout at setting value for ' + pin_nr + ' ' + stdout.toString());
            console.log('stderr at setting value for ' + pin_nr + ' ' + stderr.toString());

            console.log('pin ' + pin_nr + ' value is set to ' + pin_value);
        })
    } else{
        // First export the pin
        var exportpin = exec('echo '+pin_nr+' > /sys/class/gpio/export', function(err,stdout,stderr){
            if(err){
                console.log('Error on export pin ' + pin_nr + ' ' + err.toString());
                return err;
            }
            console.log('stdout at export ' + pin_nr + ' ' + stdout.toString());
            console.log('stderr at export pin ' + pin_nr + ' ' + stderr.toString());

            console.log('pin ' + pin_nr +  ' is exported');

            exportedOutPins.push(pin);

            // Second set the direction of the pin either in or out but for writing out is the logical choise
            var direction = exec('echo '+mode_pin+' > /sys/class/gpio/gpio' + pin_nr + '/direction', function(err,stdout,stderr){
                if(err){
                    console.log('Error on direction pin ' + pin_nr + ' ' + err.toString());
                    return err;
                }
                console.log('stdout at direction ' + pin_nr + ' ' + stdout.toString());
                console.log('stderr at direction pin ' + pin_nr + ' ' + stderr.toString());

                console.log('pin ' + pin_nr + ' direction is set');

                // After export en setting direction the value 1 or 0 can be written to the pin
                var writepin = exec('echo '+pin_value+' > /sys/class/gpio/gpio' + pin_nr + '/value', function(err,stdout,stderr){
                    if(err){
                        console.log('Error on setting value for pin ' + pin_nr + ' ' + err.toString());
                        return err;
                    }
                    console.log('stdout at setting value for ' + pin_nr + ' ' + stdout.toString());
                    console.log('stderr at setting value for ' + pin_nr + ' ' + stderr.toString());

                    console.log('pin ' + pin_nr + ' value is set to ' + pin_value);


                })
            })
        })
    }
}


function read_Pin(pin, mode, cb /*err*/){
    var pin_nr = pin.toString();
    var mode_pin = mode.toString();


    cb = cb || function(){}

    // Check if the pin is not been already exported
    if(!exportedOutPins.includes(pin)){
        var echo_1 = exec('echo '+pin_nr+' > /sys/class/gpio/export', function(error, stdout, stderr){
            if(error){
                console.log('exec error on define pin '+pin_nr+': ' + error.toString());
                return;
            }
            console.log('stdout at define: ' + stdout.toString());
            console.log('stderr at define: ' + stderr.toString());

            exportedOutPins.push(pin);
            
            var echo_2 = exec('echo '+mode_pin+' > /sys/class/gpio/gpio'+pin_nr+'/direction', function(error, stdout, stderr){
                if(error){
                    console.log('exec error on set pin '+pin_nr+' direction: ' + error.toString());
                    return;
                }
                console.log('stdout at direction: ' + stdout.toString());
                console.log('stdout at direction: ' + stderr.toString());
                
                var readPin = exec('cat /sys/class/gpio/gpio'+pin_nr+'/value', function(err, stdout, stderr){
                    if(err){
                        console.log('error on reading '+pin_nr+' :'  + err.toString());
                    }
                    console.log('stdout at reading: ' + stdout.toString());
                    console.log('stderr at reading: ' + stderr.toString());
                })
            })
        })
    } else{
        var readPin = exec('cat /sys/class/gpio/gpio'+pin_nr+'/value', function(err, stdout, stderr){
            if(err){
                console.log('error on reading '+pin_nr+' :'  + err.toString());
            }
            console.log('stdout at reading: ' + stdout.toString());
            console.log('stderr at reading: ' + stderr.toString());
        })
    }
}
