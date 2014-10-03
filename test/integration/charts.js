'use strict';

var Lab = exports.lab = require( 'lab' );
var ioc = require('electrolyte');

require( '../../app' );
//var ioc = require( './utils' );

Lab.experiment( 'Charts REST', function(){

    var server = ioc.create( 'server' );

    Lab.experiment( 'Charts REST - Valid Data', function () {

        Lab.test( 'GET latest charts should return an array of tracks', function ( done ) {

            server.inject( {
                url: '/api/charts/latest'
            }, function( response ){
                var result = response.result;

                Lab.expect( response.statusCode ).to.equal( 200 );
                Lab.expect( result ).to.be.instanceof( Array );

                done();
            } );

        } );

    } );

} );