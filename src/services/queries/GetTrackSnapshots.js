var _ = require( 'lodash' );
var multiline = require( 'multiline' );

exports = module.exports = function( knex ){
    'use strict';

    /**
     * Retrieves a tracks snapshot, including daily download counts and rankings
     *
     * Requires the following property:
     *   * trackId - tracks.id that identifies the track
     *
     * @param options
     * @constructor
     */
    function GetTrackSnapshots( options ){
        var opt = _.extend( {}, options );

        this.trackId = opt.trackId;
    }


    GetTrackSnapshots.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            --GetTrackSnapshots
            with  inputs as (
              select
                ?::integer as track_id
            )

            select
              charts.rank_playback_count,
              charts.rank_favoritings_count,
              snapshots.playback_count,
              snapshots.playback_count_delta,
              snapshots.snapshot_date
            from charts
              inner join inputs
                  on charts.track_id = inputs.track_id
              inner join snapshots
                  on charts.track_id = snapshots.track_id and charts.chart_date = snapshots.snapshot_date
            order by
              snapshots.snapshot_date asc

         */
        } );

        return knex.raw( sql, [ this.trackId ] );


    };


    ////////////////////////////
    /////// PRIVATE


    return GetTrackSnapshots;

};


exports['@require'] = [
    'knex'
];