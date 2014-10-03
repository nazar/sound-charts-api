'use strict';

var Hapi = require( 'hapi' );
var ioC = require( './ioc' );

var production = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production';
var testing = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test';

var server = new Hapi.Server( 8000 );

var options = {
    subscribers: {}
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

if ( !testing ) {
    server.start( function(){
        console.log( 'Server started', server.info.uri );
    } );
}

module.exports = server;