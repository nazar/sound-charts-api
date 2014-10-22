'use strict';

var Lab = exports.lab = require( 'lab' );
var ioc = require('electrolyte');

require( '../../app' );
//var ioc = require( './utils' );

Lab.experiment( 'Tracks REST', function(){

    var server = ioc.create( 'server' );

    Lab.experiment( 'Tracks REST - Valid Data', function () {

        Lab.test( 'GET tracks should return an array of tracks', function ( done ) {

            server.inject( {
                url: '/api/tracks'
            }, function( response ){
                var result = response.result;

                Lab.expect( response.statusCode ).to.equal( 200 );
                Lab.expect( result ).to.be.instanceof( Array );

                done();
            } );

        } );

        Lab.test( 'GET track should return a specific track', function ( done ) {

            server.inject( {
                url: '/api/tracks/9663'
            }, function( response ){
                var result = response.result;

                Lab.expect( response.statusCode ).to.equal( 200 );
                Lab.expect( result ).to.be.instanceof( Object );

                done();
            } );

        } );

        Lab.test( 'GET track should return a specific track\'s snapshots', function ( done ) {

            server.inject( {
                url: '/api/tracks/9663/snapshots'
            }, function( response ){
                var result = response.result;

                Lab.expect( response.statusCode ).to.equal( 200 );
                Lab.expect( result ).to.be.instanceof( Object );

                done();
            } );

        } );

    } );

} );