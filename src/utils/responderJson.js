/**
 * A view responder bookshelf collection helper - takes a reply object and a closure, which should return a promise and
 * either fulfils or catches the closure's promise
 *
 * @param reply - hapi Reply object
 * @param block - function signature function() - must return a promise
 * @param context - context
 * @param Model - Bookshelf model
 *
 */

var Boom = require( 'boom' );

var responder = function(){
    'use strict';

    return function( Model, reply, block, context ){
        try {
            block.call( context )
                .then( function( result ) {
                    reply( result.toJSON() );
                } )
                .catch( Model.NotFoundError, function(){
                    reply( Boom.notFound( 'Object not found' ) );
                } )
                .catch( function( e ){
                    reply( e );
                } );
        } catch ( e ) {
            reply( e );
        }

    };
};

module.exports = responder;