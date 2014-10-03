var _ = require( 'lodash' );
var moment = require( 'moment' );
var multiline = require( 'multiline' );


exports = module.exports = function( knex ){
    'use strict';

    /**
     * Calculates and inserts into charts based on playback, download and favoritings counts
     *
     * Requires the following property:
     *   * chartDate - Defaults to today
     *
     * @param options
     * @constructor
     */
    function InsertTrackSnapshot( options ){
        var opt = _.extend( {}, options );

        this.chartDate = moment( opt.chartDate || new Date() ).format( 'YYYY-MM-DD' );
    }


    InsertTrackSnapshot.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            with inputs as (
              select
                ?::date as chart_date
            )

            insert into charts (
              track_id, chart_date, playback_count, download_count, favoritings_count,
              rank_playback_count, rank_download_count, rank_favoritings_count,
              created_at, updated_at
            )

            select
              track_id, chart_date, playback_count, download_count, favoritings_count,
              rank() over (order by playback_count_delta desc) rank_playback_count,
              rank() over (order by download_count_delta desc) rank_download_count,
              rank() over (order by favoritings_count_delta desc) rank_favoritings_count,
              current_timestamp,
              current_timestamp

            from
              snapshots, inputs
            where
              snapshots.snapshot_date = inputs.chart_date
            and
              snapshots.snapshot_date_delta is not null
            and
              snapshots.playback_count_delta > 0

          */
        } );

        return knex.raw( sql, [ this.chartDate ] );

    };


    ////////////////////////////
    /////// PRIVATE


    return InsertTrackSnapshot;

};


exports['@require'] = [
    'knex'
];