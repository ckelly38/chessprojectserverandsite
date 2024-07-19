import React, {useState} from "react";
import CommonClass from "./commonclass";
import ChessPiece from "./ChessPiece";

function NewPiece({setpcs, mid, arrindx, rempiece, getpcs, usercloc, wmvsdwnrnks})
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
    cc.letMustBeBoolean(usercloc, "usercloc");
    cc.letMustBeBoolean(wmvsdwnrnks, "wmvsdwnrnks");
    
    const mympcs = getpcs();
    cc.letMustBeDefinedAndNotNull(mympcs, "pcs");

    if ((0 < arrindx || arrindx === 0) && arrindx < mympcs.length);
    else cc.logAndThrowNewError("illegal arrindx (" + arrindx + ") found and used here!");

    const mpc = mympcs[arrindx];
    cc.letMustBeDefinedAndNotNull(mpc, "mpc");

    let [errmsg, setErrorMessage] = useState(null);

    function mySelectHandleChange(tpstr, event)
    {
        //first we want to create the new object
        //then we want to make the changes
        //then we want to set the changes
        console.log("tpstr = ", tpstr);
        cc.letMustBeDefinedAndNotNull(tpstr, "tpstr");

        if (1 < arrindx);
        else
        {
            if (tpstr === "color" || tpstr === "type")
            {
                setErrorMessage("ERROR: the type and color for these pieces are fixed!");
                console.error("the type and color for these pieces are fixed!");
                return;
            }
            //else;//do nothing
        }

        const mpckeys = Object.keys(mpc);
        if (ChessPiece.itemIsOnGivenList(tpstr, mpckeys));
        else cc.logAndThrowNewError(cc.getTypeErrorMsgFromList(mpckeys));

        let mynwpcs = getpcs().map(mitem => {
            if (mitem.id === mpc.id)
            {
                let mynwpc = {...mpc};
                if (tpstr === "row" || tpstr === "col") mynwpc[tpstr] = Number(event.target.value);
                else mynwpc[tpstr] = event.target.value;
                return mynwpc;
            }
            else return mitem;
        });

        setpcs(mynwpcs);
    }

    function genRowColLocOrStringLocElements(userowcolloc, whitemovesdownranks)
    {
        cc.letMustBeBoolean(userowcolloc, "userowcolloc");
        cc.letMustBeBoolean(whitemovesdownranks, "whitemovesdownranks");

        const rwnm = "row";
        const clnm = "col"; 
        //console.log("rwnm = " + rwnm);
        //console.log("clnm = " + clnm);

        if (userowcolloc)
        {
            return (<>{" AT: ("}<select id={rwnm} name={rwnm} value={mpc.row}
                onChange={mySelectHandleChange.bind(null, rwnm)}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{", "}<select id={clnm} name={clnm} value={mpc.col}
                    onChange={mySelectHandleChange.bind(null, clnm)}>
                        {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{") "}
            </>);
        }
        else
        {
            const mydispvalarr = (whitemovesdownranks ? [1, 2, 3, 4, 5, 6, 7, 8] :
                [8, 7, 6, 5, 4, 3, 2, 1]);
            return (<>{" AT: "}<select id={clnm} name={clnm} value={mpc.col}
                onChange={mySelectHandleChange.bind(null, clnm)}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7],
                        ["A", "B", "C", "D", "E", "F", "G", "H"])}
                </select>
                <select id={rwnm} name={rwnm} value={mpc.row}
                    onChange={mySelectHandleChange.bind(null, rwnm)}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], mydispvalarr)}
                </select>{" "}
            </>);
        }
    }

    // {" LOC: ("}<select id={"row" + arrindx} name="row" value={mpc.row}
    //     onChange={mySelectHandleChange.bind(null, "row")}>
    //     {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
    // </select>{", "}
    // <select id={"col" + arrindx} name="col" value={mpc.col}
    //     onChange={mySelectHandleChange.bind(null, "col")}>
    //     {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
    // </select>{") "}

    const iserr = !(cc.isStringEmptyNullOrUndefined(errmsg));
    return (<div id={mid}>
        {(1 < arrindx) ? (<>
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
        </>) : "Color: " + mpc.color + " " + mpc.type}
        
        {genRowColLocOrStringLocElements(usercloc, wmvsdwnrnks)}

        <label id={"myinitmvcntlbl" + arrindx} htmlFor={"myinitmvcnt" + arrindx}>
            Move Count: </label>
        <input id={"myinitmvcnt" + arrindx} type="number" step={1} min={0}
            name="move_count" placeholder={0} value={mpc.move_count}
            onChange={mySelectHandleChange.bind(null, "move_count")} />
        {(1 < arrindx) ?
        (<button type="button" onClick={(event) => rempiece(mid)}>Remove Piece</button>): null}
        {(iserr) ? (<p>{errmsg}
            <button onClick={(event) => setErrorMessage(null)}>Hide Error</button></p>) : null}
    </div>);
}

export default NewPiece;
