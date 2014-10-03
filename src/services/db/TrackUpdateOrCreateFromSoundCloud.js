var moment = require( 'moment' );

exports = module.exports = function( Track ){
    'use strict';

    /**
     * Given a sound cloud track object, the service either updates or creates the tracks in tracks table
     *
     * @constructor
     * @param track
     */
    function TrackUpdateOrCreateFromSoundCloud( track ){
        this.track = track;
    }


    TrackUpdateOrCreateFromSoundCloud.prototype.execute = function(){
        var modelProps = soundCloudToTrackModelProperties( this.track );

        return Track
            .forge( { soundcloud_id: modelProps.soundcloud_id } )
            .fetch( )
            .then( function (model) {
                return model && model.save( modelProps ) || Track.forge( modelProps ).save();
            } );
    };



    ///////////////////////
    ///Tis PRIVATE!!


    function soundCloudToTrackModelProperties( track ){

        var properties = {
            soundcloud_id: track.id,
            name: track.title,
            genre: track.genre,
            uri: track.permalink_url,
            waveform_url: track.waveform_url,
            stream_url: track.stream_url,
            image_url: track.artwork_url,
            playback_count: track.playback_count,
            download_count: track.download_count,
            favoritings_count: track.favoritings_count,
            original_content_size: track.original_content_size,
            duration: track.duration,
            label: track.user && track.user.username,
            uploaded_on: moment.utc( track.created_at, 'YYYY/MM/DD HH:mm:ss Z' ).toDate()
        };

        return properties;
    }

    ////////////////////////

    return TrackUpdateOrCreateFromSoundCloud;
};


exports['@require'] = [
    'models/Track'
];