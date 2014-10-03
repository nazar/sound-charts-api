exports = module.exports = function( Track, responderJson ){

    return {

        list: function( request, reply ){

            responderJson( Track, reply, function () {
                return Track
                    .query( function( k ){
                        k.limit( request.query.limit );
                        k.offset( request.query.offset );
                    } )
                    .fetchAll();
            }, this );

        },

        get: function( request, reply ){

            responderJson( Track, reply, function () {
                return Track
                    .forge( {
                        id: request.params.id
                    } )
                    .fetch( { require: true } );
            }, this );

        }
    }


};

exports['@singleton'] = true;
exports['@require'] = [
    'models/Track',
    'utils/responderJson'
];