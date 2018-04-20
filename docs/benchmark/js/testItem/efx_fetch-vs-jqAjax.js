'use strict';

/***
 * 結果：
 * ```
 * 環境：
 *   * navigator.vendor: Google Inc.
 *   * navigator.userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
 *
 * 取外部文件測速
 * =======
 * JQurey Ajax x 78.28 ops/sec ±2.65% (40 runs sampled)
 * Fetch x 103 ops/sec ±1.61% (47 runs sampled)
 * 本次實測速度最快者為： Fetch
 * ```
 */

var globalEval = eval;

fetch( './js/testItem_assets/jquery-3.1.1.min.js' )
    .then( function ( result ) {
        if ( result.status !== 200 )
            throw Error( 'fetch error code : ' + result.status );

        return result.text();
    } )
    .then( function ( result ) {
        globalEval( result );
        benchmarkOrder.run();
    } )
    .catch( function ( err ) {
        throw err;
    } )
;

benchmarkOrder.stop = true;
benchmarkOrder(
function () {
    function setup() {
        var test_result;

        var setup_fetchUrl = './js/testItem_assets/key.txt';
        var setup_keyTxt = 'This is a key.\n';
    }

    function teardown() {
        var actualVal;

        actualVal = test_result;
        assert.ok(
            actualVal === setup_keyTxt,
            '不符合預期。 ("' + actualVal + '" !== "' + test_result + '")'
        );
    }

    return [
        '取外部文件測速',
        [ 'baseShowResult' ],
        ( new Benchmark.Suite )
            .add( 'JQurey Ajax', {
                defer : true,
                setup: setup,
                fn: function ( /* deferred */ ) {
                    $.ajax( {
                        url: setup_fetchUrl,
                        type: "GET",
                        success: function ( txt ) {
                            test_result = txt;
                            deferred.resolve();
                        }
                    } );
                },
                teardown: teardown,
            } )
            .add( 'Fetch', {
                defer : true,
                setup: setup,
                fn: function ( /* deferred */ ) {
                    fetch( setup_fetchUrl )
                        .then( function ( objResult ) {
                            if ( objResult.status !== 200 )
                                throw Error( 'fetch error code : ' + objResult.status );

                            return objResult.text();
                        } )
                        .then( function ( txt ) {
                            test_result = txt;
                            deferred.resolve();
                        } )
                    ;
                },
                teardown: teardown,
            } )
    ];
}
);

