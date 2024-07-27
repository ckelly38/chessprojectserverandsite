import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import NewPiece from "./NewPiece";
import Cmdinterface from "./Cmdinterface";
import ChessPiece from "./ChessPiece";
import CommonClass from "./commonclass";

function PieceListForm({addpiece, rempiece, mpcs, getpcs, setpcs, mvs, setmvs, addmv, remmv})
{
    let cc = new CommonClass();
    const history = useHistory();
    let [whitemovesdownranks, setWhiteMovesDownRanks] = useState(true);
    let [useroworcollocdisp, setUseRowColLocDisplay] = useState(true);
    let [whitestarts, setWhiteStarts] = useState(true);
    
    console.log("mpcs = ", mpcs);
    console.log("mvs = ", mvs);

    let disppcs = null;
    if (cc.isStringEmptyNullOrUndefined(mpcs));
    else
    {
        disppcs = mpcs.map((mitem) => {
            let idstr = "pid" + mitem.arrindx;
            return (<NewPiece key={idstr} id={idstr} mid={idstr} getpcs={getpcs} setpcs={setpcs}
                arrindx={mitem.arrindx} rempiece={rempiece} usercloc={useroworcollocdisp}
                wmvsdwnrnks={whitemovesdownranks} />);
        });
    }

    let dispmoves = null;
    if (cc.isStringEmptyNullOrUndefined(mvs));
    else
    {
        let iswhiteturn = whitestarts;//startval
        dispmoves = mvs.map((mitem, index) => {
            if (index === 0);
            else iswhiteturn = !iswhiteturn;
            console.log("iswhiteturn = " + iswhiteturn);
            return (<Cmdinterface key={mitem.id} whitemovesdownranks={whitemovesdownranks}
                iswhiteturn={iswhiteturn} useroworcollocdisp={useroworcollocdisp} mvs={mvs} 
                arrindx={mitem.arrindx} setmvs={setmvs} usefullmvset={false} userem={true}
                remmv={remmv} remitem={(index + 1 === mvs.length)} />);
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

    if (dupfnd);
    else
    {
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
    }

    //NOT DONE YET WITH THE SUBMIT... 7-12-2024
    const iserr = !(cc.isStringEmptyNullOrUndefined(errmsg));//New Piece List
    return (<div style={{ backgroundColor: "cyan", paddingTop: 1 }}><h1>New Custom Game Form:</h1>
    <form onSubmit={(event) => {
        event.preventDefault();
        console.log("INSIDE ONSUBMIT!");
        console.log("mpcs = ", mpcs);
        console.log("mvs = ", mvs);
    }}>
        <button type="button" onClick={(event) => setUseRowColLocDisplay(!useroworcollocdisp)}>
            {useroworcollocdisp ? " Use String Locs" : "Use Row Col Locs"}</button>
        <button type="button" onClick={(event) => setWhiteMovesDownRanks(!whitemovesdownranks)}>
            WHITE MOVES {whitemovesdownranks ? "DOWN": "UP"} RANKS!</button>
        {disppcs}
        <button type="button" onClick={addpiece}>Add Piece</button>
        <button type="button"
            disabled={!(cc.isStringEmptyNullOrUndefined(mvs) || mvs.length < 2)}
            onClick={(event) => {setWhiteStarts(!whitestarts)}}>
                {whitestarts ? "White" : "Black"} Starts</button>
        {dispmoves}
        <button type="button" onClick={addmv}>Add Move</button>
        <input type="submit" value="Submit" disabled={(dupfnd || iserr)} />
        {(dupfnd || iserr) ? (<div style={{ backgroundColor: "red" }}>
            {dupfnd ? (<p>Error: Duplicate Location Found!</p>): null}
            {iserr ? (<p>Error: {errmsg}</p>): null}
        </div>): null}
    </form>
    <button onClick={(event) => history.push("/join")}>Join A Game</button>
    </div>);
}

export default PieceListForm;
