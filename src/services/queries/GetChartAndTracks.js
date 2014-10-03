var _ = require( 'lodash' );
var moment = require( 'moment' );
var multiline = require( 'multiline' );


exports = module.exports = function( knex ){
    'use strict';

    /**
     * Query queries charts table for a specific chart date and also retrieves the previous charts. Returns tracks and charts
     *
     * Optionally accepts the following property:
     *   * chartDate - Date - Defaults to the latest charts.chart_date
     *   * lastChartDateDeltaDays - Defaults to one day
     *
     * @param options
     * @constructor
     */
    function GetChartAndTracks( options ){
        var opt = _.extend( {}, options );

        this.chartDate = opt.chartDate ? moment( opt.chartDate ).format( 'YYYY-MM-DD' ) : null;
        this.lastChartDateDeltaDays = opt.lastChartDateDeltaDays;

        this.limit = opt.limit || 100;
        this.offset = opt.offset || 0;
    }


    GetChartAndTracks.prototype.execute = function(){
        var sql;

        sql = multiline(function () { /*
            --GetChartAndTracks
            with  inputs as (
              select
                ?::DATE as chart_date,
                ?::INTEGER as last_chart_date_delta
            ),

            -- if inputs.chart_date is null, lookup the latest charts.date
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

            -- if inputs.last_chart_date_delta is null, lookup the previous charts.chart_date for yesterday (or closest earliest period)
            use_last_date as (
              select
                charts.chart_date AS last_chart_date
              from
                charts, this_chart_date, inputs
              where
                charts.chart_date <= ( this_chart_date.chart_date - ( COALESCE( inputs.last_chart_date_delta, 1  ) || ' DAYS' )::INTERVAL )
              order by
                charts.chart_date DESC
              LIMIT 1
            ),

            -- current chart
            this_chart as (
              select
                charts.*
              from charts inner join this_chart_date on
                this_chart_date.chart_date = charts.chart_date
            ),

            -- last chart
            last_chart as (
              select
                charts.track_id,
                charts.chart_date,
                charts.rank_playback_count,
                charts.rank_download_count,
                charts.rank_favoritings_count
              from use_last_date inner join charts on
                charts.chart_date = use_last_date.last_chart_date
            ),

            -- can i haz charts and tracks
            chart_tracks as (
              select
                tracks.*,
                this_chart.chart_date,
                this_chart.rank_playback_count,
                this_chart.rank_download_count,
                this_chart.rank_favoritings_count,
                last_chart.chart_date last_chart_date,
                last_chart.rank_playback_count last_rank_playback_count,
                last_chart.rank_download_count last_rank_download_count,
                last_chart.rank_favoritings_count last_rank_favoritings_count
              from this_chart inner join tracks on
                this_chart.track_id = tracks.id left join last_chart on
                this_chart.track_id = last_chart.track_id
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
              ?::INTEGER;

          */
        } );

        return knex.raw( sql, [ this.chartDate, this.lastChartDateDeltaDays, this.limit, this.offset ] );

    };


    ////////////////////////////
    /////// PRIVATE


    return GetChartAndTracks;

};


exports['@require'] = [
    'knex'
];