
// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = [];
var mime = require('mime');

var server = http.createServer(function(req, res) {
    var urlObj = url.parse(req.url, true);
    var pathname = urlObj.pathname;
    if (pathname === '/') {
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        fs.readFile('./index.html', function(err, data) {
            res.end(data);
        });
    } else if (pathname === '/getComments') {
        var json = JSON.stringify(comments);
        res.end(json);
    } else if (pathname === '/postComment') {
        var comment = urlObj.query;
        comment.date = new Date();
        comments.unshift(comment);
        res.end(JSON.stringify(comment));
    } else {
        fs.exists('.' + pathname, function(exists) {
            if (exists) {
                res.setHeader('Content-Type', mime.lookup(pathname) + ';charset=utf-8');
                fs.readFile('.' + pathname, function(err, data) {
                    res.end(data);
                });
            } else {
                res.statusCode = 404;
                res.end();
            }
        });
    }
});

server.listen(8080, function() {
    console.log('server started');
});
