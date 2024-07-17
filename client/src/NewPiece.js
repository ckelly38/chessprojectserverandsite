import React from "react";
import CommonClass from "./commonclass";
import ChessPiece from "./ChessPiece";

function NewPiece({setpcs, mid, arrindx, rempiece, getpcs})
{
    //select color
    //select type
    //select row
    //select col
    //get the initial number of moves for each piece
    
    //Add Pieces
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //color type row col num_moves ? add remove
    //submit

    let cc = new CommonClass();
    cc.letMustBeDefinedAndNotNull(setpcs, "setpcs");
    cc.letMustBeDefinedAndNotNull(getpcs, "getpcs");
    cc.letMustBeDefinedAndNotNull(rempiece, "rempiece");
    cc.letMustBeDefinedAndNotNull(mid, "mid");
    cc.letMustBeAnInteger(arrindx, "arrindx");
    
    const mympcs = getpcs();
    cc.letMustBeDefinedAndNotNull(mympcs, "pcs");

    if ((0 < arrindx || arrindx === 0) && arrindx < mympcs.length);
    else cc.logAndThrowNewError("illegal arrindx (" + arrindx + ") found and used here!");

    const mpc = mympcs[arrindx];
    cc.letMustBeDefinedAndNotNull(mpc, "mpc");

    function mySelectHandleChange(tpstr, event)
    {
        //first we want to create the new object
        //then we want to make the changes
        //then we want to set the changes
        console.log("tpstr = ", tpstr);
        cc.letMustBeDefinedAndNotNull(tpstr, "tpstr");

        const mpckeys = Object.keys(mpc);
        if (ChessPiece.itemIsOnGivenList(tpstr, mpckeys));
        else cc.logAndThrowNewError(cc.getTypeErrorMsgFromList(mpckeys));

        let mynwpcs = getpcs().map(mitem => {
            if (mitem.id === mpc.id)
            {
                let mynwpc = {...mpc};
                mynwpc[tpstr] = event.target.value;
                return mynwpc;
            }
            else return mitem;
        });

        setpcs(mynwpcs);
    }

    return (<div id={mid}>
        <label id={"playercolorlbl" + arrindx} htmlFor={"color" + arrindx}>Color: </label>
        <select id={"color" + arrindx} name="color" value={mpc.color} 
            onChange={mySelectHandleChange.bind(null, "color")}>
            {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
        </select>
        <select id={"type" + arrindx} name="type" value={mpc.type}
            onChange={mySelectHandleChange.bind(null, "type")}>
            {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE", "PAWN"],
                ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
        </select>
        {" LOC: ("}<select id={"row" + arrindx} name="row" value={mpc.row}
            onChange={mySelectHandleChange.bind(null, "row")}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{", "}
        <select id={"col" + arrindx} name="col" value={mpc.col}
            onChange={mySelectHandleChange.bind(null, "col")}>
            {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
        </select>{") "}
        <label id={"myinitmvcntlbl" + arrindx} htmlFor={"myinitmvcnt" + arrindx}>
            Move Count: </label>
        <input id={"myinitmvcnt" + arrindx} type="number" step={1} min={0}
            name="move_count" placeholder={0} value={mpc.move_count}
            onChange={mySelectHandleChange.bind(null, "move_count")} />
        <button type="button" onClick={(event) => rempiece(mid)}>Remove Piece</button>
    </div>);
}

export default NewPiece;
