import React, { useState } from "react";
import CommonClass from "./commonclass";

function GameBoard(props)
{
    let cc = new CommonClass();

    //const iserr = !(cc.isStringEmptyNullOrUndefined(errormsg));
    //{iserr ? <p>{errormsg}</p>: null}
    //backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")
    //console.log("backgroundColor: " + cc.getBGColorToBeUsed(false, "GameBoard"));
    
    function generateTableRows(whitemovesdownranks, lsqrclr, dsqrclr)
    {
        let myrws = [];
        let uselightclr = true;
        for (let r = 0; r < 8; r++)
        {
            let mycolsonrw = [];
            if (r % 2 === 0) uselightclr = true;
            else uselightclr = false;
            for (let c = 0; c < 8 + 2; c++)
            {
                let mysqrclr = null;
                if (uselightclr) mysqrclr = "" + lsqrclr;
                else mysqrclr = "" + dsqrclr;
                if (c < 8)
                {
                    mycolsonrw.push(<td key={"(" + r + ", " + c + ")"}
                        style={{backgroundColor: mysqrclr, height: 60, width: 60}}>
                            {c}</td>);//need to replace this
                    uselightclr = !uselightclr;
                }
                else if (c === 8)
                {
                    let myrnk = -1;
                    if (whitemovesdownranks) myrnk = r + 1;
                    else myrnk = 8 - r;
                    mycolsonrw.push(<td key={"rank" + myrnk}>{myrnk}</td>);
                }
                else if (c === 9) mycolsonrw.push(<td key={"rval" + r}>{r}</td>);
                else throw new Error("illegal value found and used here for c!");
            }
            myrws.push(<tr key={"rowid" + r}>{mycolsonrw}</tr>);
        }
        return myrws;
    }

    function genRowColLocOrStringLocElements(userowcolloc, usestart)
    {
        let nmprefix = null;
        let mybgwrd = null;
        if (usestart)
        {
            nmprefix = "start";
            mybgwrd = "AT";
        }
        else
        {
            nmprefix = "end";
            mybgwrd = "TO";
        }
        const rwnm = nmprefix + "_row";
        const clnm = nmprefix + "_col";

        if (userowcolloc)
        {
            return (<>{" " + mybgwrd + ": ("}<select id={rwnm} name={rwnm}
                onChange={null} value={0}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{", "}<select id={clnm} name={clnm}
                    onChange={null} value={0}>
                        {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{") "}
            </>);
        }
        else
        {
            return (<>{" " + mybgwrd + ": "}<select id={clnm} name={clnm}
                onChange={null} value={0}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7],
                        ["A", "B", "C", "D", "E", "F", "G", "H"])}
                </select>
                <select id={rwnm} name={rwnm} onChange={null} value={0}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7],
                        [1, 2, 3, 4, 5, 6, 7, 8])}
                </select>
            </>);
        }
    }

    function genCommandInterface(cmdtp, iswturn, userowcolloc)
    {
        //CASTLING NOTATION
        //WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
        //WLCE: (DISPLAY TO USER ONLY)
        //WCEA8TOD8
        //WKGE8TOC8
        //
        //RESIGNATION NOTATION:
        //WHITE RESIGNS
        //WRESIGNS
        //
        //TIE DESIRE NOTATION:
        //SET WHITE WANTS TIE: 1
        //
        //HINTS NOTATION:
        //WHITE HINTS
        //WHINTS
        //WHITE TYPE at: current_loc HINTS
        //WHITE PAWN at: A4 HINTS
        //WPNA4HINTS
        //
        //PAWNING NOTATION
        //WHITE LEFT PAWN at: current_loc to: next_loc
        //-BPN??W?MS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
        //WLPNB4TOA3 (DISPLAY TO THE USER)
        //0123456789
        //
        //PROMOTION NOTATION:
        //TURN COLOR PAWN at: STRINGLOC into: OTHERTYPE
        //TURN BLACK PAWN at: H8 into: QUEEN
        //TBPNH8INTOQN
        //012345678901
        //0         1
        //
        //SHORT HAND MOVE TO EXAMPLES
        //WHITE PAWN at: A5 to: A6
        //WPNA5TOA6
        //WCEA5TOA6
        //WQNA5TOA6
        //WKGA5TOA6
        //WKTA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
        //WBPA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
        //012345678
        //
        //SUPPOSE A CAPTURE WERE TO BE MADE LET US SAY A BLACK PAWN IS AT A6 AND WE CAN KILL IT
        //SHORT HAND EXAMPLES
        //-BPNA6W2MS (MUST BE DONE FIRST)
        //WCEA5TOA6 (DISPLAY TO THE USER)
        //
        //, "CREATE", "DELETE"

        if (cmdtp === "COLOR HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE": " BLACK")} HINTS</div>);
        }
        else if (cmdtp === "PIECE HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE ": " BLACK ")} 
                <select id={"piece_type"} name="piece_type" onChange={null} value={"KING"}>
                    {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE",
                        "PAWN"],
                        ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
                </select>
                {genRowColLocOrStringLocElements(userowcolloc, true)}
                {" HINTS"}
            </div>);
        }
        else if (cmdtp === "CASTLEING")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE ": " BLACK ")} 
                <select id={"dir"} name="dir" onChange={null} value={"LEFT"}>
                    {cc.genOptionListFromArray(["LEFT", "RIGHT"], null)}
                </select>
                {" CASTLE"}
            </div>);
        }
        else if (cmdtp === "PAWNING")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE ": " BLACK ")}
                <select id={"dir"} name="dir" onChange={null}
                    value={"LEFT"}>
                    {cc.genOptionListFromArray(["LEFT", "RIGHT"], null)}
                </select>
                {" PAWN"}
                {genRowColLocOrStringLocElements(userowcolloc, true)}
                {genRowColLocOrStringLocElements(userowcolloc, false)}
            </div>);
        }
        else if (cmdtp === "RESIGNATION")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE": " BLACK")} RESIGNS</div>);
        }
        else if (cmdtp === "DRAW")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                SET {(iswturn ? " WHITE": " BLACK")}{" WANTS TIE: "}
                <select id={"wantstie"} name="wantstie" onChange={null} value={1}>
                    {cc.genOptionListFromArray([0, 1], null)}
                </select>
            </div>);
        }
        else if (cmdtp === "CREATE" || cmdtp === "DELETE")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                <select id={"piece_color"} name="piece_color" onChange={null} value={"WHITE"}>
                    {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
                </select>
                <select id={"piece_type"} name="piece_type" onChange={null} value={"KING"}>
                    {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE",
                        "PAWN"],
                        ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
                </select>
                {genRowColLocOrStringLocElements(userowcolloc, true)}
                {(cmdtp === "CREATE") ? (<>{" with "}<input id={"myinitmvcnt"} type="number"
                step={1} min={0} name="move_count" placeholder={0} onChange={null}
                value={0} />{" move(s)"}</>): null}
            </div>);
        }
        else if (cmdtp === "PROMOTION")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {"TURN "}<select id={"piece_color"} name="piece_color" onChange={null}
                    value={"WHITE"}>
                    {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
                </select>{" "}<select id={"piece_type"} name="piece_type" onChange={null}
                    value={"PAWN"}>
                    {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE",
                        "PAWN"],
                        ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
                </select>
                {genRowColLocOrStringLocElements(userowcolloc, true)}{" INTO "}
                <select id={"promo_type"} name="promo_type" onChange={null}
                    value={"QUEEN"}>
                    {cc.genOptionListFromArray(["QUEEN", "BISHOP", "KNIGHT", "CASTLE"],
                        ["QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)"])}
                </select>
            </div>);
        }
        else if (cmdtp === "MOVE")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {(iswturn ? " WHITE ": " BLACK ")}
                <select id={"piece_type"} name="piece_type" onChange={null}
                    value={"KING"}>
                    {cc.genOptionListFromArray(["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE",
                        "PAWN"],
                        ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"])}
                </select>
                {genRowColLocOrStringLocElements(userowcolloc, true)}
                {genRowColLocOrStringLocElements(userowcolloc, false)}
            </div>);
        }
        else
        {
            return (<div className="errorcoloronly">
                ERROR: Command type: {cmdtp} not recognized!</div>);
        }
    }
    

    let iscompleted = false;
    let currentsideisincheck = true;
    let acurrentsidequeenisincheck = false;
    let iswhiteturn = false;
    let useroworcollocdisp = true;
    let playertwousrnm = "tu";
    let playeroneusrnm = "me";
    let playeronecolor = "WHITE";
    let playertwocolor = "BLACK";
    let playeronerank = -1;
    let playertworank = -1;
    let [cmd_type, setCMDType] = useState("COLOR HINTS");
    //formik.handleChange
    //formik.values.start_row
    //formik.values.start_col
    //formik.values.end_row
    //formik.values.end_col
    //formik.values.piece_type
    //"PROMOTION", "CREATE", "DELETE"
    return (<div style={{marginLeft: 10,
        backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")}}>
        <h2>Play Game:</h2>
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>0<br />A</th>
                    <th>1<br />B</th>
                    <th>2<br />C</th>
                    <th>3<br />D</th>
                    <th>4<br />E</th>
                    <th>5<br />F</th>
                    <th>6<br />G</th>
                    <th>7<br />H</th>
                    <th>(COLS)<br />RANK</th>
                    <th>ROW</th>
                </tr>
            </thead>
            <tbody>
                {generateTableRows(true, "orange", "black")}
            </tbody>
        </table>
        
        <div>Check Status: {currentsideisincheck ? (<b>You're in Check!</b>): "No!"}<br /></div>
        <div>Queen WARNING: {acurrentsidequeenisincheck ? "You're Queen is in Check!": "No!"}</div>
        
        <button>{"< " + (iscompleted ? "Previous": "Undo") + " Move"}</button>
        <button>{"> " + (iscompleted ? "Next": "Redo") + " Move"}</button>
        <button>{(iswhiteturn ? "Black": "White") + "'s Turn!"}</button>
        <br />

        <select id={"cmd_type"} name="cmd_type"
            onChange={(event) => setCMDType(event.target.value)}
            value={cmd_type}>
            {cc.genOptionListFromArray(["COLOR HINTS", "PIECE HINTS", "CASTLEING", "PAWNING",
                "RESIGNATION", "DRAW", "MOVE", "PROMOTION", "CREATE", "DELETE"], null)}
        </select>
        {genCommandInterface(cmd_type, iswhiteturn, useroworcollocdisp)}
        
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>PLAYER 1: {playeronecolor}</th>
                    <th>PLAYER 2: {playertwocolor}</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>USERNAME: {playeroneusrnm}</td><td>USERNAME: {playertwousrnm}</td></tr>
                <tr><td>RANK # {playeronerank}</td><td>RANK # {playertworank}</td></tr>
            </tbody>
        </table>
    </div>);
}

export default GameBoard;
