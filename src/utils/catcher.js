/**
 * reply catcher
 *
 * @param reply - hapi Reply object
 *
 */

var catcher = function(){
    'use strict';

    return function( reply ){
        return function( e ){
            reply( e );
        };
    };
};

exports = module.exports = catcher;