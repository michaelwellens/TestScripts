// import custom module
var gpio = require('gpio-jetson-tx1-tx2');

var pin = 219;


function write_On(pin){
    gpio.write(pin, true, function(err){
       if(err){
           console.log(err.toString());
       }
    })

    setTimeout(write_Off, 1000, pin);
}

function write_Off(pin){
    gpio.write(pin, false, function(err){
        if(err){
           console.log(err.toString());
        }
    })

    setTimeout(write_On, 1000, pin);
}

//Main
write_On(pin);





