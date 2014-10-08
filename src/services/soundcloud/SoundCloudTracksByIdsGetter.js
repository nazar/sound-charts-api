var _ = require( 'lodash' );
var rest = require( 'restler' );
var Promise = require( 'bluebird' );

//TODO add a logger - don't use console.log


exports = module.exports = function( config, promiser ){
    'use strict';

    /**
     * Retrieves tracks from soundcloud by track IDs
     *
     * Requires the following options properties:
     *   * ids - Array - list of tracks IDs - try to keep these under say 500 as GET URLs have a 4k size limit
     *
     * @param options
     * @constructor
     */
    function SoundCloudTracksByIdsGetter( options ){
        var opt = _.extend( {}, options );

        //service configurations
        if ( opt.ids ) {
            this.ids = opt.ids;
        } else {
            throw new Error('Service requires options.ids array property - aborting');
        }

        this.limitErrors = opt.limitErrors || 10;

        this.baseUrl = 'http://api.soundcloud.com/tracks.json?client_id=' + config.soundcloud.clientId;

        this.total = 0;
        this.errors = 0;

        this.responses = [];
    }


    SoundCloudTracksByIdsGetter.prototype.execute = function(){
        return promiser( function( d ){
            //attempt to get all tracks in one call...
            //if this fails (which it might), get all batch tracks individually, skipping the bad track

            getAllTracks.call( this )
                .then( d.resolve )
                .catch( function() {
                    //batch import failed.... try individually
                    getIndividually.call( this )
                        .then( d.resolve )
                        .catch( d.reject );

                }.bind( this ) );

        }, this );
    };

    ///////////////////
    // private

    function getAllTracks() {
        return promiser( function( d ){
            var url;

            url = [
                this.baseUrl,
                    'ids=' + this.ids.join(','),
                'limit=200'
            ].join( '&' );

            //todo replace with a logger
            console.log( 'SoundCloudTracksByIdsGetter url:', url );

            rest.get( url )
                .on( 'complete', function( data ){
                    d.resolve( data );
                }.bind( this ) )
                .on( 'fail', function( data, response ){
                    console.log( 'Failed on batch import for url:', url);
                    console.log( 'Importing tracks individually' );
                    d.reject( data, response );
                }.bind( this ) );
        }, this );
    }


    function getIndividually() {
        return Promise.cast( this.ids )
            .each( function( soundcloudId ){

                return getSoundcloudTrack.call( this, soundcloudId )
                    .then( addToResponses.bind( this ) );

            }.bind( this ) )
            .then( returnResults.bind( this ) );
    }

    function returnResults() {
        return _.flatten( this.responses );
    }

    function getSoundcloudTrack( soundcloudId ) {
        return promiser( function( d ){
            var url;

            url = [
                this.baseUrl,
                'ids=' + soundcloudId
            ].join( '&' );

            //todo replace with a logger
            console.log( 'Single SoundCloudTracksByIdsGetter url:', url );

            rest.get( url )
                .on( 'complete', function( data ){
                    d.resolve( data );
                }.bind( this ) )
                .on( 'fail', function( ){
                    console.log( 'Failed importing soundtrack id:', soundcloudId, '. Skipping');
                    //silently ignore
                    d.resolve();
                }.bind( this ) );
        }, this );
    }

    function addToResponses( response ) {
        if ( response ) {
            this.responses.push( response );
        }
    }

    ////////////////////

    return SoundCloudTracksByIdsGetter;

};

exports['@require'] = [
    'config',
    'utils/promiser'
];



