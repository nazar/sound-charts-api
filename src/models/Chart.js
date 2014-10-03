exports = module.exports = function( db ) {
    'use strict';

    var Chart = db.Model.extend( {
        tableName: 'charts',
        hasTimestamps: true
    } );

    return Chart;

};

exports['@require'] = ['db'];
exports['@singleton'] = true;