
/**
 * Module dependencies.
 */
 

var express = require('express'),
    yaml = require('yaml'),
    Seq = require('seq'),
    fs = require('fs'),
    posterous = require('./lib/posterous');
    
var posterousConf = yaml.eval(fs.readFileSync('./config/posterous.yml', 'UTF-8'));
var posterousFactory = function() { return new posterous.PosterousClient(posterousConf); }
    
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

app.helpers({
    getPortfolioThumbnail: function(post){     
      var images = post.media[2].images;
      var thumbnailRegex = new RegExp("^.+/thumbnail.(jpg|jpeg|png|gif)$");
      
      for (var i = 0;i<images.length; i++) {

        if (thumbnailRegex.test(images[i].full.url)){      
         return images[i].full; 
        }
      }
      
      return null;
    }
});


// Routes

app.get('/', function(req, res){
  Seq()
    .par(function () { 
        var that = this;
        posterousFactory().getPosts(function(posts){  
          that(null,posts);
        });
    })
    .par(function () { 
        var that = this;
        posterousFactory().getPortfolio(function(items) {
           that(null,items);
        });
    })          
    .seq(function (posts, items) { 
      res.render('index', {
        title: "Witcraft",
        posts: posts,
        portfolioItems: items 
      });
    });   
});

app.get('/how-we-work', function(req, res) {

  posterousFactory().getHowWeWork(function(page) {
    res.render('how-we-work', {
      title: "How we work",
      page: page
    });
  });
});

app.get('/about', function(req, res) {

  posterousFactory().getAboutPage(function(page) {
    res.render('about', {
      title: "About us",
      page: page
    });
  });
});

app.get('/portfolio', function(req, res) {

  posterousFactory().getPortfolio(function(items) {
    res.render('portfolio', {
      title: "Portfolio",
      items: items
    });
  });
}); 

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port);
}
