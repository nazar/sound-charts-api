exports = module.exports = function( config ){
    'use strict';

    var knex = require( 'knex' )( config.db );

    return knex;
};

exports['@require'] = [ 'config'];
exports['@singleton'] = true;



