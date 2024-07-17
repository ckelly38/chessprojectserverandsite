import React, { useState } from "react";
import NewPiece from "./NewPiece";
import CommonClass from "./commonclass";

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

    //NOT DONE YET WITH THE SUBMIT...
    return (<div style={{ backgroundColor: "cyan" }}><h1>New Piece List Form:</h1>
    <form onSubmit={(event) => {
        event.preventDefault();
        console.log("INSIDE ONSUBMIT!");
        console.log("mpcs = ", mpcs);
    }}>
        {disppcs}
        <button type="button" onClick={addpiece}>Add Piece</button>
        <input type="submit" value="Submit" />
    </form>
    </div>);
}

export default PieceListForm;
