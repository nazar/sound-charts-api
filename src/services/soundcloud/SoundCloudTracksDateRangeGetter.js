var util = require( 'util' );
var EventEmitter = require( 'events' ).EventEmitter;

var _ = require( 'lodash' );
var moment = require( 'moment' );
var rest = require( 'restler' );

//TODO add a logger - don't use console.log


exports = module.exports = function( config, promiser ){
    'use strict';

    /**
     * Retrieves tracks from soundcloud by time range. Makes allowances for soundtracks' paging restrictions in that when paging,
     * a maximum offset of 8000, which would fail when requesting more than a few hours apart with fromDate and toDate.
     *
     * This service will attempt to keep iterating if the offset limit is reached by decreasing the fromDate to the last
     * track's date
     *
     * @param options
     * @constructor
     */
    function SoundCloudTracksDateRangeGetter( options ){
        var opt = _.extend( {}, options );

        //service configurations
        this.fromDate = opt.fromDate && moment( opt.fromDate ) || moment( new Date() ).subtract( 2, 'weeks' );
        this.toDate = opt.toDate && moment( opt.toDate ) || moment( new Date() ).subtract( 1, 'weeks' );

        this.timeout = opt.timeout || config.soundcloud.iterationInterval || 1000;
        this.pages = opt.pages || 0;
        this.limit = opt.limit || 200;
        this.limitErrors = opt.limitErrors || 20;

        this.baseUrl = 'http://api.soundcloud.com/tracks.json?client_id=' + config.soundcloud.clientId;

        this.page = 0;
        this.total = 0;
        this.offset = 0;
        this.errors = 0;
    }


    util.inherits( SoundCloudTracksDateRangeGetter, EventEmitter );


    SoundCloudTracksDateRangeGetter.prototype.execute = function(){
        getTracksForPage.call( this, this.page )
            .then( function( tracks ){
                var lastTrackDate;

                if ( tracks && tracks.length && ( this.pages ? this.page < this.pages : true ) ) {

                    this.emit( 'tracks', tracks );

                    this.errors = 0;

                    this.total = this.total + tracks.length;
                    this.page = this.page + 1;
                    this.offset = this.page * this.limit;

                    //soundcloud limits the offset parameter to <= 8000
                    if ( this.offset <= 8000 ) {
                        setTimeout( function(){
                            this.execute();
                        }.bind( this ), this.timeout );
                    } else {
                        //we've reached the offset limit
                        //set the fromDate to the last tracks date

                        //but first check for endless loop condition
                        lastTrackDate = moment( _.last( tracks ).created_at, 'YYYY/MM/DD HH:mm:ss Z' );

                        console.log( 'lastTrack ', lastTrackDate.toString() );
                        console.log( 'Time difference', lastTrackDate.diff( this.fromDate, 'minutes' ) );

                        //todo - might be a better way of doing this - if last track date is same a previous last track date then exit?
                        if ( lastTrackDate.diff( this.fromDate, 'minutes' ) > 5 ) {
                            console.log( 'setting toDate', momentToTimeStamp(lastTrackDate) );
                            this.toDate = lastTrackDate;
                            this.offset = 0;
                            this.page = 0;

                            setTimeout( function(){
                                this.execute();
                            }.bind( this ), this.timeout );

                        } else {
                            this.emit( 'completed', {
                                total: this.total
                            } );
                        }
                    }

                } else {
                    this.emit( 'completed', {
                        total: this.total
                    } );
                }

            }.bind( this ) )

            .catch( function( data, response ){
                //sometimes soundlcoud times out - retry in x seconds
                console.log( 'SoundCloudTracksDateRangeGetter.execute - Get error data: ', data );
                console.log( 'SoundCloudTracksDateRangeGetter.execute - Get error response: ', response );
                console.log( 'SoundCloudTracksDateRangeGetter.execute - error count:', this.errors);

                if ( this.errors < this.limitErrors ) {
                    console.log( 'SoundCloudTracksDateRangeGetter.execute - retrying');

                    this.errors += 1;

                    //retry the request in 10 seconds
                    setTimeout( function () {
                        this.execute();
                    }.bind( this ), 10000 );

                } else {
                    //something is bad with this offset as it keeps erroring - skip it
                    console.log( 'SoundCloudTracksDateRangeGetter.execute - error - Skipping this offset');

                    this.errors = 0;

                    this.total = this.total + 200;
                    this.page = this.page + 1;
                    this.offset = this.page * this.limit;

                    setTimeout( function () {
                        this.execute();
                    }.bind( this ), 10000 );
                }
            }.bind( this ) );

    };

    ////////////////////
    /// PRIVATE

    function getTracksForPage(){
        return promiser( function( d ){
            var url;

            url = [
                this.baseUrl,
                'limit=' + this.limit,
                'created_at[from]=' + momentToTimeStamp( this.fromDate ),
                'created_at[to]=' + momentToTimeStamp( this.toDate ),
                'filter=public',
                'offset=' + this.offset
            ].join( '&' );

            //todo replace with a logger
            console.log( 'SoundCloudTracksDateRangeGetter url:', url );

            rest.get( url )
                .on( 'complete', function( data ){
                    d.resolve( data );
                }.bind( this ) )
                .on( 'error', function( data, response ) {
                    d.reject( data, response );
                } )
                .on( 'timeout', function( ms ) {
                    console.log( 'timed out after', ms);
                    d.reject();
                } )
                .on( 'fail', function( data, response ){
                    d.reject( data, response );
                }.bind( this ) );

        }, this );
    }

    function momentToTimeStamp( time ){
        return time.format( 'YYYY-MM-DD HH:mm:ss' );
    }


    return SoundCloudTracksDateRangeGetter;

};

exports['@require'] = [
    'config',
    'utils/promiser'
];



