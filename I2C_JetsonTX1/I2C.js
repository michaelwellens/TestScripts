var logger = require('winston');

// Pin layout: https://i1.wp.com/www.jetsonhacks.com/wp-content/uploads/2015/12/Jetson-TX1-LidarLite_bb.jpg?ssl=1
// J21 Header pin 27 (SDA)
// J21 Header pin 28 (SCL)
// J21 Header pin 6 GND black

const MAX1704_ADDR            = 0x36;
const MAX1704_SOC             = 0x04;
const MAX1704_VERSION         = 0x08;
const MAX1704_POWER_ON_RESET  = 0x54;
const MAX1704_QUICK_START     = 0x40;
const MAX1704_CONFIG          = 0x0C;
const MAX1704_COMMAND         = 0xFE;
const MAX1704_ALERT_LEVEL     = 0x97;

var battery_update_interval = 60000; // every minute

var os = require('os');
var i2c = (os.platform() == 'linux') ? require('i2c') : {};
var wire;
var measureCallback = function(err, charge) {};

function reset() {
    wire.writeBytes(MAX1704_POWER_ON_RESET, [0x00], function(err) {
        if(err){
            console.log(err);
        }
    });
}

function quickStart() {
    wire.writeBytes(MAX1704_QUICK_START, [0x00], function(err) {
        if(err){
            console.log(err);
        }
    });
}

function measure() {
    if (os.platform() == 'linux') {
         try {
             wire.readBytes(MAX1704_SOC, 2, function(err, res) {
                 // result contains a buffer of bytes [msb, lsb]

                 if (err) {
                     measureCallback(err);
                 } else {
                     if (res.length >=2) {
                         var msb = res.readUInt8(0);
                         var lsb = res.readUInt8(1);

                         var fraction = lsb / 256.0;
                         var percentage = msb + fraction;

                         console.log(percentage);

                         measureCallback(null, percentage);
                     }
                 }
             });
         } catch (error) {
             logger.error("cannot read from I2C on address " + MAX1704_ADDR);
             console.log(error);
             measureCallback(error);
         }
    }
}

function setup(callback) {
     if (os.platform() == 'linux') {
         console.log(os.platform());
         wire = new i2c(MAX1704_ADDR, {device: '/dev/i2c-1'});

         if (typeof callback == 'function') {
             measureCallback = callback;
         }

         try {
             reset();
             quickStart();
             measure();

             // repeat every minute
             setInterval(measure, battery_update_interval);
         } catch (error) {
             console.log(error)
             logger.error(error);
         }
     } else {
         logger.warn("basestation battery charge not available");
     }
}


module.exports = {
    setup: setup,
    measure: measure
}
