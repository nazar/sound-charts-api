var moment = require( 'moment' );

exports = module.exports = function( GetChartAndTracks, catcher ){
    'use strict';

    return {

        latest: function( request, reply ) {
            var qry;

            qry = new GetChartAndTracks( {
                limit: request.query.limit,
                offset: request.query.offset
            } );

            qry.execute()
                .then( function ( results ) {
                    reply( results.rows );
                } )
                .catch( catcher( reply ) );

        }
    };


};

exports['@singleton'] = true;
exports['@require'] = [
    'services/queries/GetChartAndTracks',
    'utils/catcher'
];