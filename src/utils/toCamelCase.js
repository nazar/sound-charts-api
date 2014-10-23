/**
 * reply catcher
 *
 * @param reply - hapi Reply object
 *
 */

var toCamelCase = function(){
    'use strict';

    return function( str ){
        var output = str || '';

        return output.replace( /[-_]([a-z])/g, function( g ){
            return g[1].toUpperCase();
        } );
    };
};

exports = module.exports = toCamelCase;