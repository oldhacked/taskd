//EXPRESS REQUIREMENTS
var express = require('express');
var app = express();
var cors = require('cors');


app.use(cors());
app.use(express.static(__dirname + '/app_client'));

//BODY PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//MONGOOSE AND MONGO
require('./app_api/models/db');

app.use('/user', require('./app_api/user/user-routes.js'));
app.use('/projects', require('./app_api/routes/projectRoutes.js'));

app.use(function(req,res,next){
    res.sendFile('index.html', {
        root : 'app_client'
    });
});

// var uri = 8080;
var uri = 3000;
var port = process.env.PORT || uri;

app.listen(port, function () {
    console.log('Hello World app started on http://localhost:' +
                port + '; press ctrl-c to terminate.');
});

module.exports = app;


