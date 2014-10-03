var _ = require( 'lodash' );
var moment = require( 'moment' );
var multiline = require( 'multiline' );

exports = module.exports = function( knex ){
    'use strict';

    /**
     * Retrieves top tracks based on charts.rank_playback_count on the given chart_date
     *
     * Requires the following property:
     *   * chartDate - Defaults to today
     *
     * @param options
     * @constructor
     */
    function GetTopTracks( options ){
        var opt = _.extend( {}, options );

        this.chartDate = opt.chartDate ? moment( opt.chartDate ).format( 'YYYY-MM-DD' ) : null;

        this.limit = opt.limit || 1000;
        this.offset = opt.offset || 0;
    }


    GetTopTracks.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            --GetTopTracks
            with  inputs as (
              select
                ?::date as chart_date
            ),

            this_chart_date as (
              select
                CASE
                  WHEN inputs.chart_date IS NULL THEN (
                    select chart_date
                    from charts
                    order by chart_date DESC
                    LIMIT 1
                  )
                ELSE
                  inputs.chart_date
                END as chart_date
              FROM
                inputs
            ),

            chart_tracks as (
              select
                tracks.*,
                charts.rank_playback_count,
                charts.chart_date
              from tracks inner join charts on
                charts.track_id = tracks.id inner join this_chart_date on
                charts.chart_date = this_chart_date.chart_date
            )

            select
              *
            from
              chart_tracks
            order by
              rank_playback_count ASC
            limit
              ?::INTEGER
            offset
              ?::INTEGER

         */
        } );

        return knex.raw( sql, [ this.chartDate, this.limit, this.offset ] );


    };


    ////////////////////////////
    /////// PRIVATE


    return GetTopTracks;

};


exports['@require'] = [
    'knex'
];