exports = module.exports = function( server, charts, tracks ){
    'use strict';

    charts.register( server );
    tracks.register( server );

};

exports['@require'] = [
    'server',
    'routes/charts',
    'routes/tracks'
];

exports['@singleton'] = true;