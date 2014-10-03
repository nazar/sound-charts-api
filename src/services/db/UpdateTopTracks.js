var _ = require( 'lodash' );
var Promise = require( 'bluebird' );

exports = module.exports = function( config, Track, SoundCloudTracksByIdsGetter, TrackUpdateOrCreateFromSoundCloud,
                                     GetTopTracks, GetLastSnapshotTracks, promiser, assigner ){
    'use strict';

    /**
     * Updates tracks based on their chart position. ALso updates the previous snapshot tracks
     *
     * @param options
     * @constructor
     */
    function UpdateTopTracks( options ){
        var opt = _.extend( {}, options );

        this.chartDate = opt.chartDate;
        this.toDate = opt.toDate;

        this.topLimit = opt.topLimit || 1000;

        this.chartTracks = null;
        this.snapTracks = null;
        this.tracks = null;
    }


    UpdateTopTracks.prototype.execute = function(){
        return promiser( function( d ){

            getTopTracks.call( this )
                .then( getPreviousSnapshot.bind( this ) )
                .then( joinChartAndSnapshotTracks.bind( this ) )
                .then( splitTracksIntoBatches.bind( this ) )
                .then( processTracksInBatches.bind( this ) )
                .then( d.resolve )
                .catch( d.reject );

        }, this );

    };

    //////////////////////
    /// PRIVATE

    function getTopTracks(){
        var qry;

        qry = new GetTopTracks( {
            limit: this.topLimit
        } );

        return qry.execute()
            .then( assigner( this, 'chartTracks' ) );
    }

    /**
     * Chart construction is chicken and egg - charts won't be generated till the second import run
     * So getTopTracks will always return an empty row - use this function to retrieve previous tracks based
     * on snapshots
     * @param result
     * @returns {*}
     */
    function getPreviousSnapshot() {
        var qry;

        qry = new GetLastSnapshotTracks( {
            limit: this.topLimit
        } );

        return qry.execute()
            .then( assigner( this, 'snapTracks' ) );
    }

    function joinChartAndSnapshotTracks(){
        this.tracks = _(
            []
                .concat( this.chartTracks && this.chartTracks.rows )
                .concat( this.snapTracks && this.snapTracks.rows )
        )
            .compact()
            .flatten()
            .value();
    }

    function splitTracksIntoBatches(){
        var tracks = _( this.tracks );
        var plucked = tracks.pluck( 'soundcloud_id' ).uniq();

        return _( plucked )
            .groupBy( function( i ){
                return plucked.indexOf( i ) % 20;
            } ).value();
    }

    function processTracksInBatches( trackBatches ){
        return Promise.cast( _.values( trackBatches ) )
            .each( function( ids ){
                return getBatchTracks( ids )
                    .then( processBatchTracks );
            } );
    }

    function getBatchTracks( tracksIds ){
        var service;

        service = new SoundCloudTracksByIdsGetter( {
            ids: tracksIds
        } );

        return service.execute();
    }

    function processBatchTracks( tracks ){
        return Promise.cast( tracks )
            .each( function( track ){
                var service;

                service = new TrackUpdateOrCreateFromSoundCloud( track );

                return service.execute();
            } );
    }


    //////////////////////////
    return UpdateTopTracks;

};


exports['@require'] = [
    'config',
    'models/Track',
    'services/soundcloud/SoundCloudTracksByIdsGetter',
    'services/db/TrackUpdateOrCreateFromSoundCloud',
    'services/queries/GetTopTracks',
    'services/queries/GetLastSnapshotTracks',
    'utils/promiser',
    'utils/assigner'
];