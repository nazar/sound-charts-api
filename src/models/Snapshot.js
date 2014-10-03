exports = module.exports = function( db ) {
    'use strict';

    var Snapshot = db.Model.extend( {
        tableName: 'snpashots',
        hasTimestamps: true
    } );

    return Snapshot;

};

exports['@require'] = ['db'];
exports['@singleton'] = true;