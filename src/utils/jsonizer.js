/**
 * reply catcher
 *
 * @param reply - hapi Reply object
 *
 */

var _ = require( 'lodash' );

var jsonizer = function( toCamelCase ){
    'use strict';

    return function( rows ){

        var input = rows || [];
        var result = [];

        if ( Array.isArray( input ) ) {

            input.forEach( function( row ){
                var outRow = {};

                _.keys( row ).forEach( function( key ){
                    outRow[ toCamelCase( key ) ] = row[key];
                } );

                result.push( outRow );
            } );

        } else {
            result = {};

            _.keys( input ).forEach( function( key ){
                result[ toCamelCase( key ) ] = input[key];
            } );
        }

        return result;

    };
};

exports = module.exports = jsonizer;

exports['@require'] = [
    'utils/toCamelCase'
];
