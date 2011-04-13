var http = require('http');

var PosterousClient = module.exports.PosterousClient = function(settings) {
  this.user = settings.user;
  this.password = settings.password;
  this.token = settings.token;    
};

PosterousClient.prototype.get = function(path,callback) {
  var auth = 'Basic ' + new Buffer(this.user + ':' + this.password).toString('base64');
  var headers = {'Host': 'posterous.com', 'Authorization': auth};

  var options = {
     host: 'posterous.com',
     port: 80,
     path: '/api/2/users/1117987/sites/witcraft'+path+'?api_token=' + this.token,
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
      console.log(result);
      
      callback(JSON.parse(result));
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });    
};
  
   
PosterousClient.prototype.getPageById = function(id, callback) {
  this.get('/pages/'+id,callback); 
};

PosterousClient.prototype.getPosts = function(callback){
  this.get("/posts",callback);  
};

PosterousClient.prototype.getHowWeWork = function(callback) {   
  this.getPageById('203964',callback);
};

PosterousClient.prototype.getAboutPage = function(callback) {
  this.getPageById('203966',callback);
};

PosterousClient.prototype.getPages = function(callback) {
  this.get("/pages",callback);  
};



