# This module is for reading and writing GPIO pins in node on the Jetson TX1/TX2

## Usage

Install this module with:

	npm install gpio-jetson-tx1-tx2

And import it with:

	var gpio = require('gpio-jetson-tx1-tx2');

## Functions

It is important to note that the pin numbers on de headers of the Jetsons developer board are not the same as the pin number in the kernel of the Jetson. For Example:

	pin 29 on the header J21 is defined as pin gpio219 in the kernel (TX1).


TX1 Kernel 	J21 Header

gpio36	-->	Pin 32
gpio37	-->	Pin 16 
gpio38 	-->	Pin 13 
gpio63 	-->	Pin 33
gpio184	-->	Pin 18 
gpio186	-->	Pin 31 
gpio187	-->	Pin 37 
gpio219 -->	Pin 29 

### write(pin, value, err)
This function is to write a value (true or false) to the given pin number.

### read(pin, mode, err)
This function is to read a pin for a given mode (in or out).


### export(pin, err)
Function to export a pin. In a way it is telling the kernel you gonna read or write this pin.

### direction(pin, mode, err)
The direction is set with this function to input or output. In the parameter mode the value in or out must be given.

### unexport(pin, err)
This function is to unexport a pin. This is needed if the pin is needed to be redifined or not used anymore.

