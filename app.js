'use strict';

if (typeof(PhusionPassenger) !== 'undefined') {
    PhusionPassenger.configure({ autoInstall: false });
}

var Hapi = require( 'hapi' );
var ioC = require( './ioc' );

var production = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production';

var server;

if (typeof(PhusionPassenger) !== 'undefined') {
    // Requires Phusion Passenger >= 4.0.52!
    server = new Hapi.Server('/passenger');
} else {
    server = new Hapi.Server( 8000 );
}

var options = {
    subscribers: {
    }
};

if ( production ) {
    options.subscribers[ './log/' ] = ['request', 'log', 'error'];
} else {
    options.subscribers.console = ['request', 'log', 'error'];
}

server.pack.register({
    plugin: require('good'),
    options: options
}, function (err) {
    if (err) {
        console.log(err);
        return;
    }
});


ioC.literal( 'server', server );

ioC.create( 'routes/index' );

if ( production || !module.parent ) {

    server.start( function(){
        console.log( 'Server started', server.info.uri );
    } );
}

module.exports = server;