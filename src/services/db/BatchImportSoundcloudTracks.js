var _ = require( 'lodash' );

exports = module.exports = function( config, TrackUpdateOrCreateFromSoundCloud, SoundCloudTracksDateRangeGetter, promiser ){
    'use strict';
    /**
     * Given a fromDate and toDate range, imports tracks from soundcloud.
     *
     * If a track with sound_cloud_id exists, it is updated, otherwise, it is created
     *
     * playbackCountCutoff is the the track's playback_count cutoff valule - playback_counts lesser than this will
     * not be imported.
     *
     * @param options {Object}
     * @constructor
     */
    function BatchImportSoundcloudTracks( options ){
        var opt = _.extend( {}, options );

        this.fromDate = opt.fromDate;
        this.toDate = opt.toDate;

        this.playbackCountCutoff = opt.playbackCountCutoff || config.soundcloud.playbackCountCutoff || 5000;
        this.durationCutoff = opt.durationCutoff || 30000;
    }


    BatchImportSoundcloudTracks.prototype.execute = function(){
        return promiser( function( d ){
            var service;

            service = new SoundCloudTracksDateRangeGetter( {
                fromDate: this.fromDate,
                toDate: this.toDate
            } );

            service.on( 'tracks', function( tracks ){

                _( tracks )
                    .each( function( track ){
                        if ( shouldImportTrack.call( this, track ) ) {
                            updateOrCreate.call( this, track );
                        }
                    }, this );

            }.bind( this ) );

            service.on( 'completed', d.resolve );

            service.on( 'error', d.reject );

            service.execute();

        }, this );
    };


    function updateOrCreate( track ){
        var service;

        service = new TrackUpdateOrCreateFromSoundCloud( track );

        return service.execute();
    }

    function shouldImportTrack( track ){
        return ( Number( track.playback_count ) > this.playbackCountCutoff ) &&
            ( Number( track.duration ) > this.durationCutoff );
    }

    //////////////////////////////////////
    /// Tis Private!!

    return BatchImportSoundcloudTracks;

};


exports['@require'] = [
    'config',
    'services/db/TrackUpdateOrCreateFromSoundCloud',
    'services/soundcloud/SoundCloudTracksDateRangeGetter',
    'utils/promiser'
];