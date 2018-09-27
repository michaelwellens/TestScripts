//source: https://github.com/extrabacon/python-shell

var PythonShell = require('python-shell'); //importing of python-shell is used for running python scripts


var options = {
    mode: 'text',
    pythonPath: '/usr/bin/python',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: '/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/',
    args: ['/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/Detectnet_Python_Inference/DetectNet.caffemodel', '/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/Detectnet_Python_Inference/deploy.prototxt', '/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/Detectnet_Python_Inference/i.jpg']
  };
  
  PythonShell.run('Detectnet_Python_Inference/detectnet_classifier.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });