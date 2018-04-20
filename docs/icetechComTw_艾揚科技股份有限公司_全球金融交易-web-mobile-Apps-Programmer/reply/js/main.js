'use strict';

// 當文件載入時觸發事件
void function ( getClaDataATable, fnReadyAction ) {
    var idxState;
    var stateList = [ 'loading', 'interactive', 'complete' ];

    idxState = stateList.indexOf( document.readyState );

    if ( idxState > 0 ) fnReadyAction( getClaDataATable() );
    else {
        document.addEventListener( 'DOMContentLoaded', function tmp( evt ) {
            document.removeEventListener( 'DOMContentLoaded', tmp, false );
            fnReadyAction( getClaDataATable() );
        }, false );
    }
}(
function () {
    /**
     * 資料表類物件。
     *
     * @class dataATable
     * @param {HTMLElement} table - 顯示資料的 <table> 標籤元素。
     * @param {HTMLElement} usage - 顯示耗時的標籤元素。
     */
    function dataATable( helTable, helUsage ) {
        this._helTable = helTable;
        this._helUsage = helUsage;

        var helTbody = helTable.querySelector( 'tbody' );

        if ( !helTbody ) {
            helTbody = document.createElement( 'tbody' );
            helTable.appendChild( helTbody );
        }

        helTbody.addEventListener( 'click', function bindCleckEvent( evt ) {
            var key, val;
            var helNowTarget, helPreTarget;
            var arrPath = evt.path;

            if ( evt.target.classList.contains( 'star' ) ) {
                evt.target.classList.toggle( 'selected' );
                return;
            }

            for ( key in arrPath ) {
                val = arrPath[ key ];

                if ( val.tagName === 'TR' ) {
                    helNowTarget = val;
                    break;
                }
            }

            helPreTarget = bindCleckEvent._helPreTarget;
            if ( !!helPreTarget ) helPreTarget.classList.remove( 'selected' );
            helNowTarget.classList.add( 'selected' );
            bindCleckEvent._helPreTarget = helNowTarget;
        } );
    }

    /**
     * 資料文件清單： 資料文件取得路徑的清單。
     *
     * @memberof dataATable#
     * @var {Array} _dataFileList
     */
    dataATable.prototype._dataFileList = [
        './data/data1.json',
        './data/data2.json',
        './data/data3.json',
    ];

    /**
     * 取得資料。
     *
     * @memberof dataATable#
     * @func getData
     * @param {function} done - 回調函式。
     */
    dataATable.prototype.getData = function ( fnDone ) {
        var valTime = +new Date;
        var key;
        var tmpFetch;
        var dataFileList = this._dataFileList;

        tmpFetch = [];
        for ( key in dataFileList ) tmpFetch.push( fetch( dataFileList[ key ] ) );

        Promise.all( tmpFetch )
            .then( function ( arrResolve ) {
                console.log( 'Fetch 至接收完成耗時：' + ( +new Date - valTime ) );

                var val;
                var tmpFetch = [];
                for ( key in arrResolve ) {
                    val = arrResolve[ key ];

                    if ( val.status !== 200 )
                        throw Error( 'fetch error code : ' + objResult.status );

                    tmpFetch.push( arrResolve[ key ].json() );
                }

                return Promise.all( tmpFetch );
            } )
            .then( function ( arrResolve ) {
                console.log( 'Fetch 至解析文件完成耗時：' + ( +new Date - valTime ) );
                fnDone( arrResolve );
            } )
            .catch( function ( err ) {
                alert( 'error' );
                throw err;
            } )
        ;
    };

    /**
     * 處理資料聯表： 將三份文件依需求整理。
     *
     * @memberof dataATable#
     * @func handleJoinData
     * @param {Array} txtList - 資料文件的內容文字清單。
     * @return {Object}
     */
    dataATable.prototype.handleJoinData = function ( arrTxtList ) {
        var valTime = +new Date();
        var idx, len, val;
        var [ dataA, dataB, dataC ] = arrTxtList;
        var keyList = [];
        var c4List = [];
        var c8List = [];
        var c9List = [];
        var dataInfo = { dataA, c8List, c9List };

        for ( idx = 0, len = dataA.length; idx < len ; idx++ ) {
            val = dataA[ idx ];
            keyList[ idx ] = val.key;
            c4List[ idx ] = val.cell4;
        }

        for ( idx = 0, len = dataB.length; idx < len ; idx++ ) {
            val = dataB[ idx ];
            c8List[ keyList.indexOf( val.key ) ] = val.cell8;
        }

        for ( idx in dataC ) {
            val = dataC[ idx ];
            c9List[ c4List.indexOf( val.cell4 ) ] = val.cell9;
        }

        console.log( 'handleJoinData 完成耗時：' + ( +new Date - valTime ) );
        return dataInfo;
    };

    /**
     * 處理資料表內容： 將資料整理成表格並顯示於畫面。
     *
     * @memberof dataATable#
     * @func handleTableContent
     * @param {HTMLElement} table - 顯示資料的 <table> 標籤元素。
     * @param {Object} dataInfo - {@link dataATable#handleJoinData} 的回傳值。
     */
    dataATable.prototype.handleTableContent = function ( helTable, objDataInfo ) {
        var valTime = +new Date();
        var idx, len, valA, val8, val9;
        var tmpTr, helTd_key;
        var { dataA, c8List, c9List } = objDataInfo;
        var helTbody = helTable.querySelector( 'tbody' );
        var helPositioning = document.createTextNode( '' );
        var helNodeList = document.createDocumentFragment();
        var helTr = document.createElement( 'tr' );
        var helTd = document.createElement( 'td' );
        var helSpan = document.createElement( 'span' );

        helSpan.className = "star";
        helTd_key = helTd.cloneNode();
        helTd_key.appendChild( helSpan );

        function newTd(helTerget, strTxt) {
            helTerget.appendChild( document.createTextNode( strTxt ) );
            return helTerget;
        }

        for ( idx = 0, len = c8List.length; idx < len; idx++ ) {
            valA = dataA[ idx ];
            val8 = c8List[ idx ];
            val9 = c9List[ idx ];

            tmpTr = helTr.cloneNode();
            tmpTr.appendChild( newTd( helTd_key.cloneNode( true ), valA[ 'key' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell1' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell2' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell3' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell4' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell5' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell6' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), valA[ 'cell7' ] ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), val8 ) );
            tmpTr.appendChild( newTd( helTd.cloneNode(), val9 ) );
            helNodeList.appendChild( tmpTr );
        }

        helTable.insertBefore( helPositioning, helTbody );
        helTbody.remove();
        helTbody.textContent = "";
        helTbody.appendChild( helNodeList );
        helTable.insertBefore( helTbody, helPositioning );
        helPositioning.remove();
        console.log( 'handleTableContent 完成耗時：' + ( +new Date - valTime ) );
    };

    /**
     * 運行。
     *
     * @memberof dataATable#
     * @func run
     */
    dataATable.prototype.run = function () {
        var self = this;
        this.getData( function ( arrTxtList ) {
            var valTime = +new Date();
            var dataInfo = self.handleJoinData( arrTxtList );
            self.handleTableContent( self._helTable, dataInfo );
            self._helUsage.innerText = +new Date() - valTime;
        } );
    };

    return dataATable;
},
function ( claDataATable ) {
    var insDataATable = new claDataATable(
        document.querySelector("table#show"),
        document.querySelector( '.usage' )
    );

    insDataATable.run();
}
);

