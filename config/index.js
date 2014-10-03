var fs = require( 'fs' );

var files = [ __dirname + '/global.json' ];
var envConfigOverride = __dirname + '/' + (process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'local') + '.json';

if ( fs.existsSync( envConfigOverride ) ) {
    files.push( envConfigOverride );
} else {
    throw new Error( 'Error: No configuration for environment: ' + process.env.NODE_ENV );
}


module.exports = require( 'nconf' ).loadFilesSync( files );

exports['@singleton'] = true;