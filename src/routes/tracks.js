var Joi = require( 'joi' );

exports = module.exports = function( TracksController ){
    'use strict';

    function list(){
        return {
            method: 'GET',
            path: '/api/tracks',
            config: {
                handler: TracksController.list,
                validate: {
                    query: {
                        offset: Joi.number().min( 0 ).max( 1000 ).default( 0 ),
                        limit: Joi.number().min( 0 ).max( 100 ).default( 100 )
                    }
                }
            }
        };
    }

    function get(){
        return {
            method: 'GET',
            path: '/api/tracks/{id}',
            config: {
                handler: TracksController.get,
                validate: {
                    params: {
                        id: Joi.number().min( 0 ).required()
                    }
                }
            }
        };
    }


    function register( server ){
        server.route( list() );
        server.route( get() );
    }

    return {
        register: register
    };

};

exports['@singleton'] = true;
exports['@require'] = [
    'controllers/tracks'
];