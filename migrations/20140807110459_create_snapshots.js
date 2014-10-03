'use strict';

exports.up = function( knex ){
    return knex.schema.createTable( 'snapshots', function( table ){
        table.increments();

        table.integer( 'track_id' ).index();

        table.integer( 'playback_count' );
        table.integer( 'download_count' );
        table.integer( 'favoritings_count' );
        table.integer( 'playback_count_delta' );
        table.integer( 'download_count_delta' );
        table.integer( 'favoritings_count_delta' );

        table.date( 'snapshot_date_delta' );

        table.date( 'snapshot_date' ).index();

        table.timestamps();
    } )

};

exports.down = function( knex ){
    return knex.schema.dropTable( 'snapshots' )
};
