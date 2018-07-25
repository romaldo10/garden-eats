var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var session = require('cookie-session');

var config = require('./config');

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: config.secret,
	httpOnly:false
}));

app.use(express.static(__dirname + '/public'));

app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: config.secret,
	httpOnly:false
}));

app.use('/api', expressJwt({ 
	secret: config.secret,
	getToken: function fromCookie (req) {
	    var token = req.session.token;
	    if (token) {
	      	return token;
	    } 
    return null; 
	}
}).unless({ path: ['/api/authentication/login', '/api/authentication/register'] }));

if(process.env.NODE_ENV!=='production'){
	
	var morgan = require('morgan');
	app.use(morgan('dev'));

	mongoose.connect(config.database); 
} else {
	mongoose.connect(config.databaseProd); 
}
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/authentication', require('./api/authentication/authentication.routes'));
app.use('/api/user', require('./api/user/user.routes'));

var port = process.env.PORT || 3000; 

app.listen(port,function(){
	console.log("Running localhost port: "+port);
})

