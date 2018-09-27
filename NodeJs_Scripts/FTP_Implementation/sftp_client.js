var Client = require('ssh2').Client;
var fs = require('fs')

var connSettings = {
    host: '35.189.218.111',
    port: 22, // Normal is 22 port
    username: 'michaelwellens',
    //password: 'Pro-logic008'
    privateKey: fs.readFileSync("/home/airobot/.ssh/AI")
    // You can use a key file too, read the ssh2 documentation
};

//var connSettings = {
//     host: 'localhost',
//     port: 22, // Normal is 22 port
//     username: 'airobot',
//     password: 'admin'
//     // You can use a key file too, read the ssh2 documentation
//};

var conn = new Client();
conn.on('ready', function() {
    conn.sftp(function(err, sftp) {
        if (err) throw err;
        
        var moveFrom = "/home/michaelwellens/test/DJI_0087.JPG";
        var moveTo = "/home/airobot/Desktop/airobot_vision/Deep_Learning/API/Read_Image_Caffe/FTP_Implementation/public/download/downloaded.jpg";

        sftp.fastGet(moveFrom, moveTo , {}, function(downloadError){
            if(downloadError) throw downloadError;

            console.log("Succesfully downloaded");
        });
    });
}).connect(connSettings);