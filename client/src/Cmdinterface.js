import React from "react";
import ChessPiece from "./ChessPiece";
import CommonClass from "./commonclass";

function Cmdinterface({whitemovesdownranks, iswhiteturn, useroworcollocdisp, arrindx,
    mvs, setmvs, usefullmvset=true, remitem=true, remmv=null, userem=true, style=null})
{
    let cc = new CommonClass();
    cc.letMustBeBoolean(whitemovesdownranks, "whitemovesdownranks");
    cc.letMustBeBoolean(useroworcollocdisp, "useroworcollocdisp");
    cc.letMustBeBoolean(iswhiteturn, "iswhiteturn");
    cc.letMustBeBoolean(usefullmvset, "usefullmvset");
    cc.letMustBeBoolean(userem, "userem");
    cc.letMustBeBoolean(remitem, "remitem");
    cc.letMustBeAnInteger(arrindx, "arrindx");
    cc.letMustBeDefinedAndNotNull(mvs, "mvs");
    cc.letMustBeDefinedAndNotNull(setmvs, "setmvs");
    if (userem) cc.letMustBeDefinedAndNotNull(remmv, "remmv");
    //else;//do nothing

    const mv = mvs[arrindx];

    function mySelectHandleChange(tpstr, event)
    {
        //first we want to create the new object
        //then we want to make the changes
        //then we want to set the changes
        console.log("tpstr = ", tpstr);
        cc.letMustBeDefinedAndNotNull(tpstr, "tpstr");

        const mvkeys = Object.keys(mv);
        if (ChessPiece.itemIsOnGivenList(tpstr, mvkeys));
        else cc.logAndThrowNewError(cc.getTypeErrorMsgFromList(mvkeys));

        const mynumbertypes = ["start_row", "end_row", "start_col", "end_col", "wants_tie",
            "piece_move_count"];

        let mynwmvs = mvs.map(mitem => {
            if (mitem.id === mv.id)
            {
                let mynwmv = {...mv};
                if (ChessPiece.itemIsOnGivenList(tpstr, mynumbertypes))
                {
                    mynwmv[tpstr] = Number(event.target.value);
                }
                else mynwmv[tpstr] = event.target.value;
                return mynwmv;
            }
            else return mitem;
        });

        setmvs(mynwmvs);
    }

    function genRowColLocOrStringLocElements(userowcolloc, usestart)
    {
        cc.letMustBeBoolean(usestart, "usestart");
        cc.letMustBeBoolean(userowcolloc, "userowcolloc");

        const nmprefix = (usestart ? "start" : "end");
        const mybgwrd = (usestart ? "AT" : "TO");
        const rwnm = nmprefix + "_row";
        const clnm = nmprefix + "_col";
        //console.log("rwnm = " + rwnm);
        //console.log("clnm = " + clnm);

        if (userowcolloc)
        {
            return (<>{" " + mybgwrd + ": ("}<select id={rwnm} name={rwnm}
                onChange={mySelectHandleChange.bind(null, rwnm)}
                value={usestart ? mv.start_row : mv.end_row}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{", "}<select id={clnm} name={clnm}
                    onChange={mySelectHandleChange.bind(null, clnm)}
                    value={usestart ? mv.start_col : mv.end_col}>
                        {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{") "}
            </>);
        }
        else
        {
            const mydispvalarr = (whitemovesdownranks ? [1, 2, 3, 4, 5, 6, 7, 8] :
                [8, 7, 6, 5, 4, 3, 2, 1]);
            return (<>{" " + mybgwrd + ": "}<select id={clnm} name={clnm}
                onChange={mySelectHandleChange.bind(null, clnm)}
                value={usestart ? mv.start_col : mv.end_col}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7],
                        ["A", "B", "C", "D", "E", "F", "G", "H"])}
                </select>
                <select id={rwnm} name={rwnm} onChange={mySelectHandleChange.bind(null, rwnm)}
                    value={usestart ? mv.start_row : mv.end_row}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], mydispvalarr)}
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

        const allpctpvals = ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE", "PAWN"];
        const allpctpdispvals = ["KING", "QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)", "PAWN"];
        const clrturndispstr = (iswturn ? " WHITE ": " BLACK ");
        
        const pctpsel = (<select id={"piece_type"} name="piece_type" value={mv.piece_type}
            onChange={mySelectHandleChange.bind(null, "piece_type")}>
                {cc.genOptionListFromArray(allpctpvals, allpctpdispvals)}
        </select>);
        const pcclrsel = (<select id={"piece_color"} name="piece_color" value={mv.piece_color}
            onChange={mySelectHandleChange.bind(null, "piece_color")}>
            {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
        </select>);
        const promopctpsel = (<select id={"promo_type"} name="promo_type"
            value={mv.promo_piece_type}
            onChange={mySelectHandleChange.bind(null, "promo_piece_type")}>
            {cc.genOptionListFromArray(["QUEEN", "BISHOP", "KNIGHT", "CASTLE"],
                ["QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)"])}
        </select>);

        if (cmdtp === "COLOR HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {pcclrsel}{" HINTS"}</div>);
        }
        else if (cmdtp === "PIECE HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {pcclrsel}{pctpsel}
                {genRowColLocOrStringLocElements(userowcolloc, true)}{" HINTS"}
            </div>);
        }
        else if (cmdtp === "CASTLEING" || cmdtp === "PAWNING")
        {
            let pctp = null;
            if (cmdtp === "CASTLEING") pctp = "CASTLE";
            else pctp = "PAWN";
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr}
                <select id={"dir"} name="dir" value={mv.dir}
                    onChange={mySelectHandleChange.bind(null, "dir")}>
                    {cc.genOptionListFromArray(["LEFT", "RIGHT"], null)}
                </select>{" " + pctp}
                {(cmdtp === "PAWNING") ? 
                    (<>{genRowColLocOrStringLocElements(userowcolloc, true)}
                    {genRowColLocOrStringLocElements(userowcolloc, false)}</>): null}
            </div>);
        }
        else if (cmdtp === "RESIGNATION")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr}RESIGNS</div>);
        }
        else if (cmdtp === "DRAW")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {"SET" + clrturndispstr + "WANTS TIE: "}
                <select id={"wantstie"} name="wantstie" value={mv.wants_tie}
                    onChange={mySelectHandleChange.bind(null, "wants_tie")}>
                    {cc.genOptionListFromArray([0, 1], null)}
                </select>
            </div>);
        }
        else if (cmdtp === "CREATE" || cmdtp === "DELETE")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {pcclrsel}{pctpsel}{genRowColLocOrStringLocElements(userowcolloc, true)}
                {(cmdtp === "CREATE") ? (<>{" with "}<input id={"myinitmvcnt"} type="number"
                step={1} min={0} name="move_count" placeholder={0} value={mv.piece_move_count}
                onChange={mySelectHandleChange.bind(null, "move_count")} />
                {" move(s)"}</>): null}
            </div>);
        }
        else if (cmdtp === "PROMOTION")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {"TURN "}{pcclrsel}{" PAWN "}
                {genRowColLocOrStringLocElements(userowcolloc, true)}{" INTO "}
                {promopctpsel}
            </div>);
        }
        else if (cmdtp === "MOVE")
        {
            const canpropwn = ChessPiece.canPawnBePromotedAt(mv.end_row, mv.end_col,
              clrturndispstr.substring(1, clrturndispstr.length - 1), mv.piece_type);
            const myprostr = " AND TURN INTO: ";
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr}{pctpsel}
                {genRowColLocOrStringLocElements(userowcolloc, true)}
                {genRowColLocOrStringLocElements(userowcolloc, false)}
                {canpropwn ? <>{myprostr}{promopctpsel}</> : null}
            </div>);
        }
        else
        {
            return (<div className="errorcoloronly">
                ERROR: Command type: {cmdtp} not recognized!</div>);
        }
    }
    
    const basemvs = ["CASTLEING", "PAWNING", "RESIGNATION", "DRAW", "MOVE"];
    const fullmvs = ["COLOR HINTS", "PIECE HINTS", "CASTLEING", "PAWNING",
        "RESIGNATION", "DRAW", "MOVE", "PROMOTION", "CREATE", "DELETE"];
    const movevalsarr = (usefullmvset ? fullmvs : basemvs);
    return (<div style={style}>
        <select id={"cmd_type"} name="cmd_type" value={mv.cmd_type}
            onChange={mySelectHandleChange.bind(null, "cmd_type")}>
            {cc.genOptionListFromArray(movevalsarr, null)}
        </select>

        {genCommandInterface(mv.cmd_type, iswhiteturn, useroworcollocdisp)}

        {userem ? (<button type="button" disabled={!remitem} onClick={remmv.bind(null, mv.id)}>
            Remove Move</button>): null}
    </div>);
}

export default Cmdinterface;
