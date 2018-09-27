const WebSocket = require('ws');

const ws = new WebSocket('');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});

//ws.on('open', function open() {
    //const array = new Float32Array(5);
  
    //for (var i = 0; i < array.length; ++i) {
      //array[i] = i / 2;
    //}
  
    //ws.send(array);
  //});