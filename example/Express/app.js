var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var $4p_template = require('4p_template');
var routes = require('./route_index');


var app = express();

// set template engine
var fs = require('fs'); // this engine requires the fs module
app.engine('html', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) throw new Error(err);    
     var my_tpl = $4p_template.template(content.toString());
     var rendered = my_tpl.render(options);
     return callback(null, rendered);
  });
});
app.set('views', path.join(__dirname, 'views')); // specify the views directory
app.set('view engine', 'html'); // register the template engine

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes); 

