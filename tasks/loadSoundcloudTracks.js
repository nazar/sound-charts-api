var moment = require( 'moment' );

var ioc = require( '../ioc' );

var BatchImportSoundcloudTracks = ioc.create( 'services/db/BatchImportSoundcloudTracks' );
var UpdateTopTracks             = ioc.create( 'services/db/UpdateTopTracks' );
var InsertTrackSnapshot         = ioc.create( 'services/queries/InsertTrackSnapshot' );
var InsertTrackCharts           = ioc.create( 'services/queries/InsertTrackCharts' );

var fromDate = moment.utc().subtract(7, 'days' ).format( 'YYYY-MM-DD' );
var toDate = moment.utc().subtract(6, 'days' ).format( 'YYYY-MM-DD' );

(function() {
    'use strict';

    updateTopTracks()
        .then( importSoundCloudTracks )
        .then( takeSnapshot )
        .then( buildCharts )
        .then( done )
        .catch( bail );



    function updateTopTracks() {
        var service;

        service = new UpdateTopTracks( {
            chartDate: fromDate,
            toDate: toDate
        } );

        return service.execute();
    }


    function importSoundCloudTracks(){
        var service;

        service = new BatchImportSoundcloudTracks( {
            fromDate: fromDate,
            toDate: toDate
        } );

        return service.execute();
    }

    function takeSnapshot(){
        var qry;

        qry = new InsertTrackSnapshot( {
            snapshotDate: toDate
        } );

        return qry.execute();
    }

    function buildCharts() {
        var qry;

        qry = new InsertTrackCharts( {
            chartDate: toDate
        } );

        return qry.execute();
    }

    function done(){
        process.exit( 0 );
    }

    function bail( error ){
        console.log( 'error', error );
        console.log( 'stack', error.stack );
        process.exit( 1 );

    }

})();


//////////////////////////////
/// MAIN


