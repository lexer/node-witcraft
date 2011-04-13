var http = require('http');

var PosterousClient = module.exports.PosterousClient = function(settings) {
  this.user = settings.user;
  this.password = settings.password;
  this.token = settings.token;
};

PosterousClient.prototype.getPosts = function(callback){
  var options = {
     host: 'posterous.com',
     port: 80,
     path: '/api/2/users/1117987/sites/witcraft/posts/public'
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);

    res.setEncoding("UTF-8");

    var result = '';

    res.on('data', function(chunk) {
      result += chunk;
    });

    res.on('end', function() {
      console.log(JSON.parse(result));
      
      callback(JSON.parse(result));
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};

PosterousClient.prototype.getPages = function(callback) {

  var auth = 'Basic ' + new Buffer(this.user + ':' + this.password).toString('base64');

  var headers = {'Host': 'posterous.com', 'Authorization': auth};

  var options = {
     host: 'posterous.com',
     port: 80,
     path: '/api/2/users/1117987/sites/witcraft/pages?api_token=' + this.token,
     headers: headers
  };

  http.get(options, function(res) {
    console.log("Got response: " + res.statusCode);

    res.setEncoding("UTF-8");

    var result = '';

    res.on('data', function(chunk) {
      result += chunk;
    });

    res.on('end', function() {
      console.log(JSON.parse(result));
      
      callback(JSON.parse(result));
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};



