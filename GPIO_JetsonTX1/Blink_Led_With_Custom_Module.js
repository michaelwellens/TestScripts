// import custom module
var gpio = require('./custom_module/jetson_gpio.js');

var pin = 219;

gpio.export(pin, function(err){
 if(err){
     console.log(err.toString());
 }
})

gpio.direction(pin, 'out', function(err){
  if(err){
      console.log(err.toString());
  }
})

gpio.write(pin, 1, function(err){
   if(err){
       console.log(err.toString());
   }
})



