'use strict';

!function () {
    var item;
    var globalEval = eval;

    location.search.replace( /[?&]([^=&]+)(?:=([^&]+)|=?)/g, function () {
        switch ( arguments[ 1 ] ) {
            case "item":
                item = arguments[ 2 ];
                break;
        }
    } );

    if ( !item )
        throw Error( 'Pleace choose test "item" with url search field.' );

    fetch( './js/testItem/efx_' + item + '.js' )
        .then( function ( result ) {
            if ( result.status !== 200 )
                throw Error( 'fetch error code : ' + result.status );

            return result.text();
        } )
        .then( function ( result ) {
            globalEval( result );
        } )
        .catch( function ( err ) {
            throw err;
        } )
    ;
}();

