

//Sript for watch a folder and take action on added images
//Images can be added with a browser

//Import needed packages 
var chokidar = require('chokidar'); //This is the watchdog for watching folder changes
var PythonShell = require('python-shell'); //importing of python-shell is used for running python scripts
var fs = require("fs"); //File system for opening en edit files or folders
var express = require('express');//Package for running a server
var bodyParser = require('body-parser');
var multer  = require('multer');
var request = require('request'); // Package to comunicate with a server



//Defining variables
var watcher = chokidar.watch('/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/public/uploaded_images', {ignored: /^\./, persistent: true});
var url_download = "http://127.0.0.1:8080/file_download"
//var url_download = "http://35.189.218.111:8080/file_download"
var url_request_image_list= "http://127.0.0.1:8080/request_image_list"
//var url_request_image_list= "http://35.189.218.111:8080/request_image_list"
var app = express()


//source: https://github.com/extrabacon/python-shell
function Read_Image_Caffe(image){

    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/',
        args: ['/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/Detectnet_Python_Inference/DetectNet.caffemodel','/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/Detectnet_Python_Inference/deploy.prototxt', image]
      };

      
      
      PythonShell.run('Detectnet_Python_Inference/detectnet_classifier.py', options, function callback_Pythonshell(err, results) {
        //if (err) throw err;
        // results is an array consisting of messages collected during execution
        //console.log('results: %j', results);
      });
  };

//reference:https://stackoverflow.com/questions/13695046/watch-a-folder-for-changes-using-node-js-and-print-file-paths-when-they-are-cha
function watcher1(){
watcher
  .on('add', function(path) {Read_Image_Caffe(path);})
  .on('change', function(path) {console.log('File', path, 'has been changed');})
  .on('unlink', function(path) {console.log('File', path, 'has been removed');})
  .on('error', function(error) {console.error('Error happened', error);})
  console.log('Watcher is running')
};


function Download(){
  //////////////////////
  // HTTP Implementation
  //////////////////////

  //const options = {  
  //  url: url_download,
  //  method: 'GET',
  //  headers: {
  //      'Accept': 'application/json',
  //  }
  //};
  //
  //request.get(options, function (err, resp, body) {
  //
  //
  //  //console.log(body)
  //  console.log(resp.statusCode)
  //
  //
  //}).pipe(fs.createWriteStream('hallo.jpg'))

//OR

//var download = function(url_download, filename, callback){
//  request.head(url_download, function(err, res, body){
//
//    
//    console.log('content-type:', res.headers['content-type']);
//    console.log('content-length:', res.headers['content-length']);
//    
//
//    request(url_download).pipe(fs.createWriteStream(filename)).on('close', callback);
//  });
//};
//download(url_download, 'Image1.jpg', function callback_download(){
//  console.log("done")
//});

//OR

//var request_image_list = function(url_download, filename, callback){
//  request.head(url_download, function(err, res, body){
//    console.log('content-type:', res.headers['content-type']);
//    console.log('content-length:', res.headers['content-length']);
//    
//    request(url_download).pipe(fs.createWriteStream(filename)).on('close', callback);
//  });
//};
//request_image_list(url_request_image_list, 'Images.csv', function callback_request_image_list(){
//  console.log("done")
//});

  ////////////////////////////////////////////
  //FTP implementation
  ////////////////////////////////////////////

  var conn = new Client();
  conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
        if (err) throw err;
        
        var moveFrom = "/home/michaelwellens/test/DJI_0087.JPG";
        var moveTo = "/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/FTP_Implementation/public/download/downloaded.jpg";
        var remotePathToList = "/home/michaelwellens/test/"
        sftp.readdir(remotePathToList, function(err, list) {
          if (err) throw err;
          // List the directory in the console
          console.dir(list);
          // Do not forget to close the connection, otherwise you'll get troubles
          conn.end();
        });
        
        sftp.fastGet(moveFrom, moveTo , {}, function(downloadError){
            if(downloadError) throw downloadError;

            console.log("Succesfully uploaded");
        });
    });
  }).connect(connSettings);


}










//main
//watcher1();

Download();





