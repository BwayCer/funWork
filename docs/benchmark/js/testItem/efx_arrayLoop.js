'use strict';

/***
 * 實測結果：
 *
 * ```
 * 環境：
 *   * navigator.vendor: Google Inc.
 *   * navigator.userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
 *
 * 1,000 次迴圈測速
 * =======
 * for loop x 662,134 ops/sec ±0.42% (64 runs sampled)
 * while loop x 593,386 ops/sec ±0.44% (65 runs sampled)
 * forEach loop x 71,766 ops/sec ±1.57% (63 runs sampled)
 * map loop x 58,351 ops/sec ±1.70% (63 runs sampled)
 * reduce loop x 75,059 ops/sec ±0.31% (65 runs sampled)
 * 本次實測速度最快者為： for loop
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
function () {
    function setup() {
        var setup_array01to100;
        var setup_sum = 0;

        void function () {
            var idx;
            var loopTimes = 1000;

            setup_array01to100 = new Array( loopTimes );

            for ( idx = 0; idx < loopTimes ; ) {
                setup_array01to100[ idx ] = ++idx;
                setup_sum += idx;
            }
        }();
    }

    function teardown() {
        var actualVal;

        actualVal = test_total;
        assert.ok(
            actualVal === setup_sum,
            '不符合預期。 ("' + actualVal + '" !== "' + setup_sum + '")'
        );
    }

    return [
        '1,000 次迴圈測速',
        [ 'baseShowResult' ],
        ( new Benchmark.Suite )
            .add( 'for loop', {
                setup: setup,
                fn: function () {
                    var idx, len;
                    var test_total = 0;
                    for ( idx = 0, len = setup_array01to100.length; idx < len ; idx++ )
                        test_total += setup_array01to100[ idx ];
                },
                teardown: teardown,
            } )
            .add( 'while loop', {
                setup: setup,
                fn: function () {
                    var idx = 0;
                    var len = setup_array01to100.length;
                    var test_total = 0;
                    while ( idx < len )
                        test_total += setup_array01to100[ idx++ ];
                },
                teardown: teardown,
            } )
            .add( 'forEach loop', {
                setup: setup,
                fn: function () {
                    var test_total = 0;
                    setup_array01to100.forEach( function ( val ) {
                        test_total += val;
                    } );
                },
                teardown: teardown,
            } )
            .add( 'map loop', {
                setup: setup,
                fn: function () {
                    var test_total = 0;
                    setup_array01to100.map( function ( val ) {
                        test_total += val;
                    } );
                },
                teardown: teardown,
            } )
            .add( 'reduce loop', {
                setup: setup,
                fn: function () {
                    var test_total = setup_array01to100.reduce(
                        function ( numTotal, val ) {
                            return numTotal + val;
                        }
                    );
                },
                teardown: teardown,
            } )
    ];
}
);

