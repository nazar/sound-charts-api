exports = module.exports = function( db ) {
    'use strict';

    var Track = db.Model.extend( {
        tableName: 'tracks',
        hasTimestamps: true
    } );

    return Track;

};

exports['@require'] = ['db'];
exports['@singleton'] = true;