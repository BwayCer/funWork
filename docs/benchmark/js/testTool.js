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


function benchmarkOrder() {
    var waitItemList = arguments;
    var idx = 0;
    var len = waitItemList.length;

    console.log(
        '環境：'
        + '\n  * navigator.vendor: ' + navigator.vendor
        + '\n  * navigator.userAgent: ' + navigator.userAgent
    );
    console.log( '' )

    benchmarkOrder.run = function asyncCtrl() {
        if( idx >= len ) return;

        var name, middlewareList, efxObject;
        var waitItem = waitItemList[ idx++ ];
        var middleware = benchmarkOrder.middleware;

        waitItem = typeof waitItem === 'function' ? waitItem() : waitItem;
        name = waitItem[ 0 ];
        middlewareList = waitItem[ 1 ];
        efxObject = waitItem[ 2 ];

        if( idx > 1 ) console.log( '' );
        console.log( name || '測試項目' );
        console.log('=======' );

        if ( !!middlewareList ) {
            middlewareList.forEach( function ( val ) {
                var middlewareFunc;

                if ( typeof val === 'function' )
                    middlewareFunc = val;
                else if ( middleware.hasOwnProperty( val ) )
                    middlewareFunc = middleware[ val ];

                if ( !middlewareFunc )
                    throw Error( '找不到 "' + val + '" 中介層。' );

                middlewareFunc( efxObject )
                return efxObject;
            } );
        }

        efxObject
            .on( 'complete', asyncCtrl )
            .run()
        ;
    };

    if ( benchmarkOrder.stop !== true ) benchmarkOrder.run();
}

benchmarkOrder.middleware = {
    baseShowResult: function ( objSuite ) {
        objSuite
            .on( 'cycle', function ( event ) {
                  console.log( event.target.toString() );
            } )
            .on( 'complete', function () {
                console.log(
                    '本次實測速度最快者為： '
                    + this.filter( 'fastest' ).map( 'name' )
                );
            } )
        ;
    },
};

