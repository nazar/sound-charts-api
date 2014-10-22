exports = module.exports = function(
    Track,
    GetTrackSnapshots,
    responderJson,
    responderQry
    ){
    'use strict';

    return {

        list: function( request, reply ){

            responderJson( Track, reply, function(){
                return Track
                    .query( function( k ){
                        k.limit( request.query.limit );
                        k.offset( request.query.offset );
                    } )
                    .fetchAll();
            }, this );

        },

        get: function( request, reply ){

            responderJson( Track, reply, function(){
                return Track
                    .forge( {
                        id: request.params.id
                    } )
                    .fetch( { require: true } );
            }, this );

        },

        snapshots: function( request, reply ){
            var qry;

            qry = new GetTrackSnapshots( {
                trackId: request.params.id
            } );

            responderQry( qry, reply );

        }
    };


};

exports['@singleton'] = true;
exports['@require'] = [
    'models/Track',
    'services/queries/GetTrackSnapshots',
    'utils/responderJson',
    'utils/responderQry'
];