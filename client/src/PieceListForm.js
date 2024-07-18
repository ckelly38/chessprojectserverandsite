import React, { useState } from "react";
import NewPiece from "./NewPiece";
import CommonClass from "./commonclass";
import ChessPiece from "./ChessPiece";

function PieceListForm({addpiece, rempiece, mpcs, getpcs, setpcs})
{
    let cc = new CommonClass();
    
    console.log("mpcs = ", mpcs);

    let disppcs = null;
    if (cc.isStringEmptyNullOrUndefined(mpcs));
    else
    {
        disppcs = mpcs.map((mitem) => {
            let idstr = "pid" + mitem.arrindx;
            return (<NewPiece key={idstr} id={idstr} mid={idstr} arrindx={mitem.arrindx}
                rempiece={rempiece} getpcs={getpcs} setpcs={setpcs} />);
        });
    }
    
    let mylocslist = [];
    let dupfnd = false;
    let errmsg = null;
    for (let x = 0; x < mpcs.length; x++)
    {
        if (ChessPiece.isLocOnListOfLocs(mpcs[x].row, mpcs[x].col, mylocslist))
        {
            if (dupfnd);
            else dupfnd = true;
            //push duplicate anyways but signal error
            mylocslist.push([mpcs[x].row, mpcs[x].col]);
        }
        else mylocslist.push([mpcs[x].row, mpcs[x].col]);
    }

    try
    {
        ChessPiece.isBoardValid(mpcs, false);
        errmsg = null;
    }
    catch(ex)
    {
        console.error(ex);
        errmsg = ex.message;
    }

    //NOT DONE YET WITH THE SUBMIT...
    const iserr = !(cc.isStringEmptyNullOrUndefined(errmsg));
    return (<div style={{ backgroundColor: "cyan" }}><h1>New Piece List Form:</h1>
    <form onSubmit={(event) => {
        event.preventDefault();
        console.log("INSIDE ONSUBMIT!");
        console.log("mpcs = ", mpcs);
    }}>
        {disppcs}
        <button type="button" onClick={addpiece}>Add Piece</button>
        
        <input type="submit" value="Submit" disabled={(dupfnd || iserr)} />
        {(dupfnd || iserr) ? (<div style={{ backgroundColor: "red" }}>
            {dupfnd ? (<p>Error: Duplicate Location Found!</p>): null}
            {iserr ? (<p>Error: {errmsg}</p>): null}
        </div>): null}
    </form>
    </div>);
}

export default PieceListForm;
