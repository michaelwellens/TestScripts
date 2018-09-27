//reference:https://stackoverflow.com/questions/13695046/watch-a-folder-for-changes-using-node-js-and-print-file-paths-when-they-are-cha

var chokidar = require('chokidar');

var watcher = chokidar.watch('/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/fotos', {ignored: /^\./, persistent: true});

watcher
  .on('add', function(path) {console.log('File', path, 'has been added');})
  .on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})
