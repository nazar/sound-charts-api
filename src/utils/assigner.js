var assigner = function() {

    'use strict';

    /**
     * promise helper that assigns a value to an object property
     *
     * @param owner - object
     * @param property - string
     *
     */

    return function(  owner, property ) {

        return function( results ) {
            owner[ property ] = results;
            return results;
        };

    };

};

exports = module.exports = assigner;