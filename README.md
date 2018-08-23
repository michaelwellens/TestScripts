# This is a repository for basic testing scripts for Teensy, Arduino, Jetson and Raspberry Pi

On this moment only a script for serial communication in nodejs with the module Serialport is included.

# Usage

## Needed dependancies
To use this script first install node:
	
	&curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
	
	command -v nvm

Second install the serialport with npm --> npm comes together with the node installation:

	npm install serialport

### If problems occur with the node versions
It is possible that errors occur while running a node script due to version confilcts.
Therefore the package node version manager (nvm) is an interesting tool.
To install nvm use:

	sudo apt-get install nvm

Now nvm can be used to easly install different versions and switch between them with the following commands:
To download, compile, and install the latest release of node, do this:

	nvm install node

And then in any new shell just use the installed version:

	nvm use node

Or you can just run it:

	nvm run node --version

Or, you can run any arbitrary command in a subshell with the desired version of node:

	nvm exec 4.2 node --version

You can also get the path to the executable to where it was installed:

	nvm which 5.0

v8-debug does not work with Node 7 or up, try downgrading to 6.
To do so install node 6.6.0

	
	nvm install 6.6.0


