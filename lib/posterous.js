var http = require('http');

module.exports.getPosts = function(callback) {
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


