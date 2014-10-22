/**
 * A view responder knex query helper
 *
 * @param query {Object} - an instatiated Query object
 * @param reply {Object} - hapi Reply object
 *
 */

var responderQry = function( jsonizer ){
    'use strict';

    return function( query, reply ){
        try {
            query
                .execute()
                .then( function( result ) {
                    reply( jsonizer( result.rows ) );
                } )
                .catch( function(e) {
                    reply(e);
                } );

        } catch(e) {
            reply( e );
        }

    };




};

exports = module.exports = responderQry;

exports['@require'] = [
    'utils/jsonizer'
];
