'use strict';

/***
 * 實測結果：
 *
 * ```
 * 環境：
 *   * navigator.vendor: Google Inc.
 *   * navigator.userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
 *
 * 僅創建新元素
 * =======
 * createElement x 2,393,663 ops/sec ±1.96% (58 runs sampled)
 * cloneNode x 2,498,296 ops/sec ±2.63% (58 runs sampled)
 * cloneNode true x 2,412,942 ops/sec ±2.32% (61 runs sampled)
 * 本次實測速度最快者為： cloneNode
 *
 * 普通創建新元素
 * =======
 * createElement x 1,300,682 ops/sec ±2.76% (57 runs sampled)
 * cloneNode x 1,884,617 ops/sec ±2.70% (56 runs sampled)
 * cloneNode true x 1,730,948 ops/sec ±4.21% (54 runs sampled)
 * 本次實測速度最快者為： cloneNode
 *
 * 創建擁有一個子元素的新元素
 * =======
 * createElement x 620,730 ops/sec ±4.98% (54 runs sampled)
 * cloneNode true x 1,027,194 ops/sec ±9.91% (52 runs sampled)
 * 本次實測速度最快者為： cloneNode true
 * ```
 */

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

    if ( benchmarkOrder.stop !== true ) benchmarkOrder.run;
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


benchmarkOrder(
[ '僅創建新元素', [ 'baseShowResult' ],
    ( new Benchmark.Suite )
        .add( 'createElement', {
            fn: function () {
                var test_hel = document.createElement( 'div' );
            },
        } )
        .add( 'cloneNode', {
            setup: function () {
                var setup_helReference = document.createElement( 'div' );
            },
            fn: function ( objDeferred ) {
                var test_hel = setup_helReference.cloneNode();
            },
        } )
        .add( 'cloneNode true', {
            setup: function () {
                var setup_helReference = document.createElement( 'div' );
            },
            fn: function ( objDeferred ) {
                var test_hel = setup_helReference.cloneNode( true );
            },
        } )
],
function () {
    function setup_cloneNode() {
        var setup_key = 'key' + Math.random().toString().substr( -11 );
        var helReference = document.createElement( 'div' );
        helReference.id = setup_key;
    }

    function teardown() {
        var actualVal;

        actualVal = test_hel.id;
        assert.ok(
            actualVal === setup_key,
            '不符合預期的 key 值。 ("' + actualVal + '" !== "' + setup_key + '")'
        );
    }

    return [
        '普通創建新元素',
        [ 'baseShowResult' ],
        ( new Benchmark.Suite )
            .add( 'createElement', {
                setup: function () {
                    var setup_key = 'key' + Math.random().toString().substr( -11 );
                },
                fn: function () {
                    var test_hel = document.createElement( 'div' );
                    test_hel.id = setup_key;
                },
                teardown: teardown,
            } )
            .add( 'cloneNode', {
                setup: setup_cloneNode,
                fn: function ( objDeferred ) {
                    var test_hel = helReference.cloneNode();
                },
                teardown: teardown,
            } )
            .add( 'cloneNode true', {
                setup: setup_cloneNode,
                fn: function ( objDeferred ) {
                    var test_hel = helReference.cloneNode( true );
                },
                teardown: teardown,
            } )
    ];
},
function () {
    function teardown() {
        var actualVal;

        actualVal = test_hel.id;
        assert.ok(
            actualVal === setup_key,
            '不符合預期的 key 值。 ("' + actualVal + '" !== "' + setup_key + '")'
        );

        actualVal = test_hel.childNodes[ 0 ].textContent;
        assert.ok(
            actualVal === setup_key,
            '不符合預期的指定物件。 ("' + actualVal + '" !== "' + setup_key + '")'
        );
    }

    return [
        '創建擁有一個子元素的新元素',
        [ 'baseShowResult' ],
        ( new Benchmark.Suite )
            .add( 'createElement', {
                setup: function () {
                    var setup_key = 'key' + Math.random().toString().substr( -11 );
                },
                fn: function () {
                    var test_hel = document.createElement( 'div' );
                    var helText = document.createTextNode( setup_key );
                    test_hel.id = setup_key;
                    test_hel.appendChild( helText );
                },
                teardown: teardown,
            } )
            .add( 'cloneNode true', {
                setup: function () {
                    var setup_key = 'key' + Math.random().toString().substr( -11 );
                    var helReference = document.createElement( 'div' );
                    var helText = document.createTextNode( setup_key );

                    helReference.id = setup_key;
                    helReference.appendChild( helText );
                },
                fn: function ( objDeferred ) {
                    var test_hel = helReference.cloneNode( true );
                },
                teardown: teardown,
            } )
    ]
}
);

