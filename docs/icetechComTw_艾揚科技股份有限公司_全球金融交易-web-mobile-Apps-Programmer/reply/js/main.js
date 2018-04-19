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
    function dataATable ( helTable, helUsage ) {
        this._helTable = helTable;
        this._helUsage = helUsage;
    }

    dataATable.prototype._dataFileList = [
        './data/data1.json',
        './data/data2.json',
        './data/data3.json',
    ];

    return dataATable;
},
function ( claDataATable ) {
    var insDataATable = new claDataATable(
        document.querySelector("table#show"),
        document.querySelector( '.usuage' )
    );
}
);

