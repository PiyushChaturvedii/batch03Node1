var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
const { unescape } = require('querystring');

// Array Types
var arrTypes = {
    "html" : "text/html",
    "jpeg" : "image/jpeg",
    "jpg" : "image/jpeg",
    "png" : "image/png",
    "js" : "text/javascript",
    "css" : "text/css",
}

// Create Server

http.createServer(function (req,res) {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), unescape(uri));
    console.log('Loading' + uri);
    var stats;

    try {
        stats = fs.lstatSync(fileName);
    } catch (e) {
        res.writeHead(404, { 'Content-type': 'text/plain' });
        res.write('404 Not Found');
        res.end();
        return;
    }
    // check if file/directory exists
    if (stats.isFile()) {
        var arrType = arrTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, { 'Content-type': arrType });
        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    } else if (stats.isDirectory()) {
        res.writeHead(302, { 'Location': 'index.html' });
        res.end();
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write("500 Internal Error");
        res.end()
    }
}
).listen(5000);