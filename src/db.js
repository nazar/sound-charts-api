exports = module.exports = function( knex ){
    'use strict';

    var bookshelf = require( 'bookshelf' )( knex );

    return bookshelf;
};

exports['@require'] = [ 'knex'];
exports['@singleton'] = true;



