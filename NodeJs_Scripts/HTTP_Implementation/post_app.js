//Reference: https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm

//Importing needed packages
var express = require('express');//Package for running a server
var request = require('request');
var fs = require('fs')


//Defining variables
var app = express();
var filepath = '/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/testimages/'
//var url_upload = 'http://35.189.218.111:8080/file_upload'
var url_upload = 'http://127.0.0.1:8080/file_upload'
var images = fs.readdirSync(filepath) //creates array of listed images in the folder but the items are not the images bu the names



console.log(images);
//loop over dir with images and send them to url
for (var i = 0; i < images.length; i++){

  var req = request.post(url_upload, function (err, resp, body) {
    if (err) { console.log(err);} 
    else { console.log('URL: ' + body);}
  });
  
  
  //read over the names in the array
  var file = fs.createReadStream(filepath + images[i]); //reads the image in the filepath
  var form = req.form(); 
  form.append('file', file); // Send the images
  console.log("Done:",images[i]);
};


