'use strict';

var ioC =    require('electrolyte');

var config = require('./config/index');

//config
ioC.literal( 'config', config );

ioC.loader( ioC.node( 'src/' ) );

ioC.loader( 'controllers',         ioC.node( 'src/controllers' ) );
ioC.loader( 'models',              ioC.node( 'src/models' ) );
ioC.loader( 'routes',              ioC.node( 'src/routes' ) );
ioC.loader( 'services/db',         ioC.node( 'src/services/db' ) );
ioC.loader( 'services/queries',    ioC.node( 'src/services/queries' ) );
ioC.loader( 'services/soundcloud', ioC.node( 'src/services/soundcloud' ) );
ioC.loader( 'utils',               ioC.node( 'src/utils' ) );

module.exports = ioC;