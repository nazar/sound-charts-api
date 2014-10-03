var _ = require( 'lodash' );
var rest = require( 'restler' );

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
    }


    SoundCloudTracksByIdsGetter.prototype.execute = function(){
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
                    d.reject( data, response );
                }.bind( this ) );
        }, this );
    };

    return SoundCloudTracksByIdsGetter;

};

exports['@require'] = [
    'config',
    'utils/promiser'
];



