var Joi = require( 'joi' );

exports = module.exports = function( ChartsController ){
    'use strict';

    function list(){

        return {
            method: 'GET',
            path: '/api/charts/latest',
            config: {
                handler: ChartsController.latest,
                validate: {
                    query: {
                        offset: Joi.number().min( 0 ).max( 1000 ).default( 0 ),
                        limit: Joi.number().min( 0 ).max( 100 ).default( 100 )
                    }
                }
            }
        };
    }


    function register( server ){
        server.route( list() );
    }

    return {
        register: register
    };

};

exports['@singleton'] = true;
exports['@require'] = [
    'controllers/charts'
];