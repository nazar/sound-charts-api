'use strict';

/**
 * A promise wrapper with an exception block
 *
 * @param block - function signature function(d) where d is the deferred object
 * @param context - options context
 * @returns {promise}
 */

var Promise = require( 'bluebird' );

var promiser = function(){

    return function( block, context ){
        var d = defer();

        try {
            block.call( context, d );
        } catch ( e ) {
            console.log( 'stack', e.stack );

            d.reject( e );
        }

        return d.promise;

    };
};

module.exports = promiser;


function defer(){
    var resolve;
    var reject;

    var promise = new Promise( function(){
        resolve = arguments[0];
        reject = arguments[1];
    } );

    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}