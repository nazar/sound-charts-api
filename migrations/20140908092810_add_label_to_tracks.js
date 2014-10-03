'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.table( 'tracks', function( table ){
        table.string( 'label' );
    } );

  
};

exports.down = function(knex, Promise) {

    return knex.schema.table( 'tracks', function( table ){
        table.dropColumn( 'label' );
    } );

  
};
