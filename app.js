
/**
 * Module dependencies.
 */
 

var express = require('express'),
    yaml = require('yaml'),
    fs = require('fs');
    
var posterousConf = yaml.eval(fs.readFileSync('./config/posterous.yml', 'UTF-8'));
var posterous = new (require('./lib/posterous')).PosterousClient(posterousConf);
    
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['sass'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

/*
app.helpers({
    getPortfolioThumbnail: function(post){ 
      var images = post.media[2].images;
      
      for ( int i = 0, i < images.length, i ++) {
        if images[i].full.url.
      }
      
      return post.media[2].;
    }
});
*/

// Routes

app.get('/', function(req, res){

  posterous.getPosts(function(posts){  
    res.render('index', {
      title: 'Welcome to Witcraft website',
      posts: posts  
    });        
  });
});

app.get('/how-we-work', function(req, res) {

  posterous.getHowWeWork(function(page) {
    res.render('how-we-work', {
      title: "How we work",
      page: page
    });
  });
});

app.get('/about', function(req, res) {

  posterous.getAboutPage(function(page) {
    res.render('about', {
      title: "About us",
      page: page
    });
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
