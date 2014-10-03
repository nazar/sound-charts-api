var _ = require( 'lodash' );
var moment = require( 'moment' );
var multiline = require( 'multiline' );


exports = module.exports = function( knex ){
    'use strict';

    /**
     * Query takes a snapshot of tracks into snapshots and records the delta from the previous snapshot.
     *
     * Optionally accepts the following property:
     *   * snapshotDate - Defaults to today - Date of snapshot as recorded in snapshots.snapshot_date
     *   * lastSnapshotDate - Defaults to the previous snapshot - Date on which delta calculations will be based
     *
     * @param options
     * @constructor
     */
    function InsertTrackSnapshot( options ){
        var opt = _.extend( {}, options );

        this.snapshotDate = moment( opt.snapshotDate || new Date() );

        this.snapshotDateFormatted = this.snapshotDate.format( 'YYYY-MM-DD' );
        this.lastSnapshotDayFormatted = opt.lastSnapshotDate && moment( opt.lastSnapshotDate ).format( 'YYYY-MM-DD' ) || null;
    }


    InsertTrackSnapshot.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            with  inputs as (
              select
                ?::date as snapshot_date,
                ?::date as last_snapshot_date
            ),

            tracks_to_snapshot as (
              select tracks.*
              from tracks, inputs
              where not exists (
                select 1 from snapshots inner join tracks on
                  snapshots.track_id = tracks.id and snapshots.snapshot_date = inputs.snapshot_date
              )
            ),

            use_last_date as (
              select
                CASE
                WHEN inputs.last_snapshot_date IS NULL
                  THEN (
                    select snapshot_date
                    from snapshots
                    where snapshot_date < inputs.snapshot_date
                    order by snapshot_date DESC
                    limit 1
                  )
                  ELSE
                    inputs.last_snapshot_date
                  END as last_snapshot_date
               from inputs
            ),

            last_snapshot as (
              select snapshots.*
              from use_last_date, snapshots inner join tracks on
                snapshots.track_id = tracks.id
              where snapshots.snapshot_date = use_last_date.last_snapshot_date
            ),

            snapshot_tracks as (
              select
                tracks_to_snapshot.id track_id,
                tracks_to_snapshot.playback_count playback_count,
                tracks_to_snapshot.download_count download_count,
                tracks_to_snapshot.favoritings_count favoritings_count,
                coalesce( tracks_to_snapshot.playback_count - last_snapshot.playback_count, 0 ) playback_count_delta,
                coalesce( tracks_to_snapshot.download_count - last_snapshot.download_count, 0 ) download_count_delta,
                coalesce( tracks_to_snapshot.favoritings_count - last_snapshot.favoritings_count, 0 ) favoritings_count_delta,
                inputs.snapshot_date snapshot_date,
                last_snapshot.snapshot_date last_snapshot_date
              from inputs, tracks_to_snapshot
                left join last_snapshot on tracks_to_snapshot.id = last_snapshot.track_id
            )


            insert into snapshots ( track_id, playback_count, download_count, favoritings_count,
                    playback_count_delta, download_count_delta, favoritings_count_delta, snapshot_date, snapshot_date_delta,
                    created_at, updated_at )

            select
              snapshot_tracks.track_id,
              snapshot_tracks.playback_count,
              snapshot_tracks.download_count,
              snapshot_tracks.favoritings_count,
              snapshot_tracks.playback_count_delta,
              snapshot_tracks.download_count_delta,
              snapshot_tracks.favoritings_count_delta,
              snapshot_tracks.snapshot_date,
              snapshot_tracks.last_snapshot_date,
              current_timestamp,
              current_timestamp

            from
              snapshot_tracks
            order by
              snapshot_tracks.playback_count_delta DESC
            limit 1000


          */
        } );

        return knex.raw( sql, [ this.snapshotDateFormatted, this.lastSnapshotDayFormatted ] );

    };


    ////////////////////////////
    /////// PRIVATE


    return InsertTrackSnapshot;

};


exports['@require'] = [
    'knex'
];