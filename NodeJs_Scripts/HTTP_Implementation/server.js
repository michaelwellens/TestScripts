//  Reference: https://www.tutorialspoint.com/nodejs/nodejs_express_framework.htm

//  Importing packages
var fs = require("fs"); //  File system for opening en edit files or folders
var express = require('express');// Module for running a server
var bodyParser = require('body-parser');
var multer  = require('multer'); //  Module needed for writing data with full information like path name and such
var csvdata = require('csvdata'); // Module for writing and reading csv files

//  Global Variables
var app = express();
var filepath = "/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/HTTP_Implementation/public/uploaded_images"


function Server1(){
  
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: false }));
    //app.use(multer({ dest: '/tmp/'}));
    var upload = multer({ dest: 'tmp/' });
    var type = upload.single('file');
    //var type = upload.any();
  
    app.get('/index.htm', function (req, res) {
       res.sendFile( __dirname + "/" + "index.htm" );
    })
    
  
    app.post('/file_upload',type , function (req, res) {
        console.log(req.file.originalname);
        var tmp_path = req.file.path;
  
        /** The original name of the uploaded file
            stored in the variable "originalname". **/
        var target_path = 'public/uploaded_images/' + req.file.originalname;
      
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        //src.on('end', function() { res.render('complete'); });
        //src.on('error', function(err) { res.render('error'); });
        console.log('Writing Done' + req.file.originalname);
    })
    
    
    app.get('/file_download', function(req, res) {
        
        
        //console.log(res)
        res.sendFile( __dirname + "/public/uploaded_images/Image1.jpg");
        
        console.log("file is send")

    })

    app.get('/request_image_list', function(req, res){

        /////////////////////////////
        // Function for reading a directory containing images
        // and writing the list of images to a csv file
        // the readed images wil be written to an array as an object with 
        // header: file_name
        /////////////////////////////

        // Makeing a function of Image
        function Image(file_name){
        this.file_name = file_name
        }

        var images = fs.readdirSync(filepath) // reading the images in the folder filepath and putting it in a list
        console.log(images)

        // This function is for building an array containing objects of Image
        var images_array = [] // making an empty array

        // Looping over the list and put the names of the images in the array with .push
        for (var i = 0; i < images.length; i++){
            images_array.push(new Image(images[i]))
        }

        // write the array with header: file_name to a csv file named Images.csv
        csvdata.write('tmp/Images.csv',images_array,{header: 'file_name'})

        // Send the file 
        res.sendFile( __dirname + '/tmp/')

    })




    var server = app.listen(8080, function callback_server(err,res) {
       var host = server.address().address
       var port = server.address().port
       
       console.log("server is running")
       console.log("Server app listening at ", host, port)
    })
  
  };


  //main
  Server1();