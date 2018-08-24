// Import required modules
var child_process = require('child_process');
var exec = child_process.exec;

// Global variabels
var exportedOutPins = [219];



/////////////////////////////////////
// Functions to call in other scripts
/////////////////////////////////////

exports.export = function(pin, cb){
    export_Pin(pin,cb);
}

exports.direction = function(pin, cb){
    direction_Pin(pin,cb);
}

exports.write = function(pin,value, cb){
    write_Pin(pin, value, cb);
}

exports.unexports = function(pin, cb){
    unexport_Pin(pin, cb);
}


////////////////////////////////////
// Functions used inside this module
////////////////////////////////////

function export_Pin(pin, cb /*err*/){
    console.log(pin.toString());
    var pin_nr = pin.toString();
    cb = cb || function(){}


    var writepin = exec('echo '+pin_nr+' /sys/class/gpio/export', function(err,stdout,stderr){
        if(err){
            console.log('Error on export pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at export ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at export pin ' + pin_nr + ' ' + stderr.toString());

        console.log('pin ' + pin_nr +  ' is exported');


    })
}

function unexport_Pin(pin, cb /*err*/){
    console.log(pin.toString());
    var pin_nr = pin.toString();
    cb = cb || function(){}


    var writepin = exec('echo '+pin_nr+' /sys/class/gpio/unexport', function(err,stdout,stderr){
        if(err){
            console.log('Error on unexport pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at unexport ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at unexport pin ' + pin_nr + ' ' + stderr.toString());

        console.log('pin ' + pin_nr +  ' is unexported');


    })
}


function direction_Pin(pin,mode, cb /*err*/){
    console.log(pin.toString());
    console.log(mode.toString());
    var pin_nr = pin.toString();
    var mode_pin = mode.toString();

    cb = cb || function(){}


    var writepin = exec('echo '+mode_pin+' > /sys/class/gpio/gpio' + mode_pin + '/direction', function(err,stdout,stderr){
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
    console.log(pin.toString());
    console.log(value.toString());
    var pin_nr = pin.toString();
    var pin_value = value.toString();

    cb = cb || function(){}


    var writepin = exec('echo 1 > /sys/class/gpio/gpio' + pin_value + '/value', function(err,stdout,stderr){
        if(err){
            console.log('Error on setting value for pin ' + pin_nr + ' ' + err.toString());
            return err;
        }
        console.log('stdout at setting value for ' + pin_nr + ' ' + stdout.toString());
        console.log('stderr at setting value for ' + pin_nr + ' ' + stderr.toString());

        console.log('pin ' + pin_nr + ' value is set to ' + pin_value);


    })
}
