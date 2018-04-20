'use strict';

/***
 * 實測結果：
 *
 * ```
 * 環境：
 *   * navigator.vendor: Google Inc.
 *   * navigator.userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
 *
 * 陣列取值
 * =======
 * Array with for loop x 145,425 ops/sec ±2.96% (54 runs sampled)
 * Array x 20,769 ops/sec ±2.24% (54 runs sampled)
 * Object x 20,785 ops/sec ±1.60% (57 runs sampled)
 * 本次實測速度最快者為： Array with for loop
 * ```
 */

benchmarkOrder(
function () {
    function setup() {
        var setup_keyList = [];
        var setup_arrayTable = [];
        var setup_objectTable = [];

        void function () {
            var idx;
            var key;
            var row = 1000;

            setup_arrayTable = [];
            setup_objectTable = {};

            function getKey() {
                var ownKeyList = getKey.ownKeyList;
                var key = Math.random().toString().substr( -7 );

                if ( !~ownKeyList.indexOf( key ) ) {
                    ownKeyList.push( key );
                    return key;
                } else {
                    return getKey();
                }
            }

            getKey.ownKeyList = setup_keyList;

            for ( idx = 0; idx < row ; idx++ ) {
                key = getKey();
                setup_arrayTable[ idx ] = key;
                setup_objectTable[ Number( key ).toString( 16 ) ] = key;
            }
        }();
    }

    return [
        '陣列取值',
        [ 'baseShowResult' ],
        ( new Benchmark.Suite )
            .add( 'Array with for loop', {
                setup: setup,
                fn: function () {
                    var idx, len;
                    var test_keyList = [];
                    for ( idx = 0, len = setup_arrayTable.length; idx < len ; idx++ )
                        test_keyList.push( setup_arrayTable[ idx ] );
                },
                teardown: function () {
                    assert.deepEqual(
                        test_keyList, setup_keyList,
                        '不符合預期的數值陣列。'
                    );
                },
            } )
            .add( 'Array', {
                setup: setup,
                fn: function () {
                    var idx;
                    var test_keyList = [];
                    for ( idx in setup_arrayTable )
                        test_keyList.push( setup_arrayTable[ idx ] );
                },
                teardown: function () {
                    assert.deepEqual(
                        test_keyList, setup_keyList,
                        '不符合預期的數值陣列。'
                    );
                },
            } )
            .add( 'Object', {
                setup: setup,
                fn: function () {
                    var key;
                    var test_keyList = [];
                    for ( key in setup_arrayTable )
                        test_keyList.push( setup_arrayTable[ key ] );
                },
                teardown: function () {
                    assert.deepEqual(
                        test_keyList, setup_keyList,
                        '不符合預期的物件陣列。'
                    );
                },
            } )
    ];
}
);

