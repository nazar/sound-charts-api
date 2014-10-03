'use strict';

exports.up = function( knex ){
    return knex.schema.createTable( 'charts', function( table ){
        table.increments();

        table.integer( 'track_id' ).index();
        table.date( 'chart_date' ).index();

        table.integer( 'playback_count' );
        table.integer( 'download_count' );
        table.integer( 'favoritings_count' );

        table.integer( 'rank_playback_count' );
        table.integer( 'rank_download_count' );
        table.integer( 'rank_favoritings_count' );


        table.timestamps();
    } )
};

exports.down = function( knex ){
    return knex.schema.dropTable( 'charts' )
};
