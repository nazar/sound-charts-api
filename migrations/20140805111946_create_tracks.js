'use strict';

exports.up = function( knex ){
    return knex.schema.createTable( 'tracks', function( table ){
        table.increments();

        table.string( 'name' );
        table.string( 'genre' );
        table.string( 'uri' );
        table.string( 'waveform_url' );
        table.string( 'stream_url' );

        table.integer( 'soundcloud_id' ).index();
        table.integer( 'playback_count' );
        table.integer( 'download_count' );
        table.integer( 'favoritings_count' );

        table.timestamp( 'uploaded_on' ).index();

        table.integer( 'original_content_size' );
        table.integer( 'duration' );

        table.timestamps();
    } )

};

exports.down = function( knex ){
    return knex.schema.dropTable( 'tracks' )
};
