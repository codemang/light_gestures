const http = require('http');
const LifxUdpClient = require('./udp');
var qs = require('querystring');

let light;
LifxUdpClient.loadLight('Nate', _light => light = _light);

http.createServer(function (req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if ( req.method === 'OPTIONS' ) {
    res.writeHead(200);
    res.end();
    return;
  }

  // http header
  res.writeHead(200, {'Content-Type': 'text/html'});

  var url = req.url;

  if (url === '/update-brightness') {
    let body = '';

    req.on('data', data => {
      body += data;
    });

    req.on('end', function () {
      const jsonBody = JSON.parse(body);
      LifxUdpClient.updateBrightness(light, parseInt(jsonBody.amount))
    });
      // updateBrightness
    res.write(' Welcome to about us page');
    res.end();
  }
}).listen(4000, function() {
  // The server object listens on port 3000
  console.log("server start at port 4000");
});
