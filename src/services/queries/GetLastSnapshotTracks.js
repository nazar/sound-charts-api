var _ = require( 'lodash' );
var moment = require( 'moment' );
var multiline = require( 'multiline' );

exports = module.exports = function( knex ){
    'use strict';

    /**
     * Retrieves the previous snapshots track given the current snapshot date
     *
     * Requires the following property:
     *   * snapshotDate - Defaults to today
     *
     * @param options
     * @constructor
     */
    function GetLastSnapshotTracks( options ){
        var opt = _.extend( {}, options );

        this.snapshotDate = opt.snapshotDate ? moment( opt.snapshotDate ).format( 'YYYY-MM-DD' ) : null;
        this.lastSnapshotDelta = opt.lastSnapshotDelta;

        this.limit = opt.limit || 1000;
        this.offset = opt.offset || 0;
    }


    GetLastSnapshotTracks.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            --GetLastSnapshotTracks
            with  inputs as (
              select
                ?::date     as snapshot_date,
                ?::integer  as last_snapshot_date_delta
            ),

            this_snapshot_date as (
              select
                CASE
                  WHEN inputs.snapshot_date IS NULL THEN (
                    select snapshot_date
                    from snapshots
                    order by snapshot_date DESC
                    LIMIT 1
                  )
                ELSE
                  inputs.snapshot_date
                END as snapshot_date
              FROM
                inputs
            ),

            snapshot_tracks as (
              select
                tracks.*,
                snapshots.snapshot_date,
                snapshots.snapshot_date_delta
              from tracks inner join snapshots on
                snapshots.track_id = tracks.id inner join this_snapshot_date on
                snapshots.snapshot_date = this_snapshot_date.snapshot_date
            )

            select
              *
            from
              snapshot_tracks
            where
              snapshot_date_delta is null
            order by
              playback_count DESC
            limit
              ?::INTEGER
            offset
              ?::INTEGER

         */
        } );

        return knex.raw( sql, [ this.snapshotDate, this.lastSnapshotDelta, this.limit, this.offset ] );


    };


    ////////////////////////////
    /////// PRIVATE


    return GetLastSnapshotTracks;

};


exports['@require'] = [
    'knex'
];