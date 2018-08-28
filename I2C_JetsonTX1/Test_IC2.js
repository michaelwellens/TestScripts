var feul = require('./I2C.js');
var i2c = require('i2c');

var wire = new i2c(0x36,{device: '/dev/i2c-1'});

//wire.scan(function(err, data){
// if(err){
//     console.log(err);
// }
// console.log(data);
//})


feul.setup(function(err){
    if(err){
        console.log(err);
    }

});
