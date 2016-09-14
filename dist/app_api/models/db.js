var mongoose = require('mongoose');
var gracefulShutdown;
// Development Connection URI
var dbURI = 'mongodb://localhost:27017/taskd';
if (process.env.NODE_ENV === 'production') {
    // Reference Heroku Config Variable
    dbURI = process.env.MONGODB_URI;
}

mongoose.connect(dbURI);

// CONNECTION EVENTS
// Success
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
    


//        setInterval(function(){
//            console.log(" dumping ");
//            mongoose.connection.db.dropDatabase();
//            
//        }, 30000);
//        

    
});
// Error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});
// Disconnection
mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

// CAPTURE APP TERMINATION / RESTART EVENTS
// To be called when process is restarted or terminated
gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};
//// For nodemon restarts
process.once('SIGUSR2', function() {
    gracefulShutdown('nodemon restart', function() {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', function() {
    gracefulShutdown('app termination', function() {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', function() {
    gracefulShutdown('Heroku app termination', function() {
        process.exit(0);
    });
});

// Require Models Here:
require('./project-model');
require('../user/user-model');
