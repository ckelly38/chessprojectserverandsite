import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import MyImageComponent from "./MyImageComponent";
import ChessPiece from "./ChessPiece";
import ChessGame from "./ChessGame";
//import { GameContext } from "./GameProvider";
import CommonClass from "./commonclass";

function GameBoard(props)
{
    let cc = new CommonClass();
    const history = useHistory();
    console.log("INSIDE GAME BOARD!");

    let gid = 1;//NEEDS TO BE MODIFIED 7-13-2024
    
    let calledsetup = useRef(false);
    let [loaded, setLoaded] = useState(false);
    let [updateboard, setUpdateBoard] = useState(false);
    let [dir, setDirString] = useState("LEFT");
    let [piece_type, setPieceType] = useState("KING");
    let [piece_color, setPieceColor] = useState("WHITE");
    let [piece_move_count, setPieceMoveCount] = useState(0);
    let [wants_tie, setWantsTie] = useState(0);//not sure if this should be an integer or boolean
    let [promo_piece_type, setPromoPieceType] = useState("QUEEN");
    let [start_row, setStartRow] = useState(0);
    let [start_col, setStartCol] = useState(0);
    let [end_row, setEndRow] = useState(0);
    let [end_col, setEndCol] = useState(0);
    let [useroworcollocdisp, setUseRowColLocDisplay] = useState(false);
    let [showqnwarning, setShowQueenWarning] = useState(true);
    let [whitemovesdownranks, setWhiteMovesDownRanks] = useState(true);
    let [cmd_type, setCMDType] = useState("MOVE");
    console.log("OLD calledsetup.current = ", calledsetup.current);
    
    useEffect(() => {
        console.log("INSIDE OF USE EFFECT!");
        if (calledsetup.current);
        else
        {
            ChessPiece.setUpBoard(gid);
            ChessGame.makeNewChessGameFromColor(gid, "BOTH");//NEEDS TO BE MODIFIED 7-13-2024
            console.log("PIECE LIST AFTER SET UP BOARD CALLED:");
            //console.log("pieces = ", pieces);
            //console.log("getPieces() = ", getPieces());
            console.log("ChessPiece.cps = ", ChessPiece.cps);
            console.log("ChessGame.all = ", ChessGame.all);
            calledsetup.current = true;
            console.log("NEW calledsetup.current = ", calledsetup.current);
            setLoaded(true);//needed to display the pieces, sling shot route does not work
        }
    }, [calledsetup.current]);
    


    function setSelectedLoc(rval, cval, ispcatloc)
    {
        console.log("INSIDE OF SET-SELECTED-LOC()!");
        console.log("rval = " + rval);
        console.log("cval = " + cval);
        console.log("ispcatloc = " + ispcatloc);
        cc.letMustBeBoolean(ispcatloc, "ispcatloc");
        cc.letMustBeAnInteger(rval, "rval");
        cc.letMustBeAnInteger(cval, "cval");
        
        if (ispcatloc)
        {
            //we can get the ChessPiece here
            let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, null, null);
            cc.letMustBeDefinedAndNotNull(cp, "cp");
            //rval, cval, cp.getType() for type and location
            console.log("cp = ", cp);
            
            setStartRow(rval);
            setStartCol(cval);
            setPieceType(cp.getType());
            setPieceColor(cp.getColor());
            setPieceMoveCount(cp.getMoveCount());
        }
        else
        {
            //the location is empty piece type is blank or null
            //we can set the rval and cval as a location to move to
            setEndRow(rval);
            setEndCol(cval);
        }
    }

    function generateTableRows(wtmvsdwnrks, lsqrclr, dsqrclr, lpcclr, dpcclr)
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
                    //these need to come from the piece list
                    //cp is null, then type is null; otherwise cp.getType()
                    console.log("calledsetup.current = ", calledsetup.current);
                    
                    let cp = null;//needed to prevent an error of empty or null board list
                    if (calledsetup.current)
                    {
                        cp = ChessPiece.getPieceAtVIAGID(r, c, gid, null, null);
                    }
                    //else;//do nothing if this is the case empty board will be displayed

                    let islocempty = cc.isItemNullOrUndefined(cp);
                    let ispcatloc = !islocempty;
                    let pcttp = (ispcatloc ? cc.titleCase(cp.getType()) : null);
                    let uselightpcclr = false;
                    if (ispcatloc) uselightpcclr = (cp.getColor() === "WHITE");
                    //else;//do nothing
                    let pcclr = null;//"pink";//#118800
                    if (uselightpcclr) pcclr = "" + lpcclr;
                    else pcclr = "" + dpcclr;
                    mycolsonrw.push(<td onClick={(event) => setSelectedLoc(r, c, ispcatloc)}
                        key={"(" + r + ", " + c + ")"}
                        style={{backgroundColor: mysqrclr, height: 60, width: 60}}>
                            {(ispcatloc) ? (<MyImageComponent type={pcttp} color={pcclr} />): null}
                    </td>);
                    //need to replace this
                    uselightclr = !uselightclr;
                }
                else if (c === 8)
                {
                    let myrnk = -1;
                    if (wtmvsdwnrks) myrnk = r + 1;
                    else myrnk = 8 - r;
                    mycolsonrw.push(<td key={"rank" + myrnk}>{myrnk}</td>);
                }
                else if (c === 9) mycolsonrw.push(<td key={"rval" + r}>{r}</td>);
                else this.cc.logAndThrowNewError("illegal value found and used here for c!");
            }
            myrws.push(<tr key={"rowid" + r}>{mycolsonrw}</tr>);
        }
        return myrws;
    }

    function rowColStartEndHandleChange(usestart, userow, val)
    {
        cc.letMustBeBoolean(usestart, "usestart");
        cc.letMustBeBoolean(userow, "userow");
        cc.letMustBeAnInteger(val, "val");

        if (usestart)
        {
            if (userow) setStartRow(val);
            else setStartCol(val);
        }
        else
        {
            if (userow) setEndRow(val);
            else setEndCol(val);
        }
    }

    function mySelectHandleChange(mysetfunc, event)
    {
        mysetfunc(event.target.value);
    }

    function genRowColLocOrStringLocElements(userowcolloc, usestart)
    {
        cc.letMustBeBoolean(usestart, "usestart");
        cc.letMustBeBoolean(userowcolloc, "userowcolloc");

        const nmprefix = (usestart ? "start" : "end");
        const mybgwrd = (usestart ? "AT" : "TO");
        const rwnm = nmprefix + "_row";
        const clnm = nmprefix + "_col";
        if (userowcolloc)
        {
            return (<>{" " + mybgwrd + ": ("}<select id={rwnm} name={rwnm}
                onChange={(event) =>
                    rowColStartEndHandleChange(usestart, true, event.target.value)}
                value={usestart ? start_row : end_row}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{", "}<select id={clnm} name={clnm}
                    onChange={(event) =>
                        rowColStartEndHandleChange(usestart, false, event.target.value)}
                    value={usestart ? start_col : end_col}>
                        {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7], null)}
                </select>{") "}
            </>);
        }
        else
        {
            const mydispvalarr = (whitemovesdownranks ? [1, 2, 3, 4, 5, 6, 7, 8] :
                [8, 7, 6, 5, 4, 3, 2, 1]);
            return (<>{" " + mybgwrd + ": "}<select id={clnm} name={clnm}
                onChange={(event) =>
                    rowColStartEndHandleChange(usestart, false, event.target.value)}
                value={usestart ? start_col : end_col}>
                    {cc.genOptionListFromArray([0, 1, 2, 3, 4, 5, 6, 7],
                        ["A", "B", "C", "D", "E", "F", "G", "H"])}
                </select>
                <select id={rwnm} name={rwnm} onChange={(event) =>
                    rowColStartEndHandleChange(usestart, true, event.target.value)}
                    value={usestart ? start_row : end_row}>
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
        
        const pctpsel = (<select id={"piece_type"} name="piece_type" value={piece_type}
            onChange={mySelectHandleChange.bind(null, setPieceType)}>
                {cc.genOptionListFromArray(allpctpvals, allpctpdispvals)}
        </select>);
        const pcclrsel = (<select id={"piece_color"} name="piece_color" value={piece_color}
            onChange={mySelectHandleChange.bind(null, setPieceColor)}>
            {cc.genOptionListFromArray(["WHITE", "BLACK"], null)}
        </select>);

        if (cmdtp === "COLOR HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr + "HINTS"}</div>);
        }
        else if (cmdtp === "PIECE HINTS")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr}{pctpsel}
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
                <select id={"dir"} name="dir" value={dir}
                    onChange={mySelectHandleChange.bind(null, setDirString)}>
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
                <select id={"wantstie"} name="wantstie" value={wants_tie}
                    onChange={mySelectHandleChange.bind(null, setWantsTie)}>
                    {cc.genOptionListFromArray([0, 1], null)}
                </select>
            </div>);
        }
        else if (cmdtp === "CREATE" || cmdtp === "DELETE")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {pcclrsel}{pctpsel}{genRowColLocOrStringLocElements(userowcolloc, true)}
                {(cmdtp === "CREATE") ? (<>{" with "}<input id={"myinitmvcnt"} type="number"
                step={1} min={0} name="move_count" placeholder={0} value={piece_move_count}
                onChange={mySelectHandleChange.bind(null, setPieceMoveCount)} />
                {" move(s)"}</>): null}
            </div>);
        }
        else if (cmdtp === "PROMOTION")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {"TURN "}{pcclrsel}{" PAWN "}
                {genRowColLocOrStringLocElements(userowcolloc, true)}{" INTO "}
                <select id={"promo_type"} name="promo_type" value={promo_piece_type}
                    onChange={mySelectHandleChange.bind(null, setPromoPieceType)}>
                    {cc.genOptionListFromArray(["QUEEN", "BISHOP", "KNIGHT", "CASTLE"],
                        ["QUEEN", "BISHOP", "KNIGHT", "CASTLE (ROOK)"])}
                </select>
            </div>);
        }
        else if (cmdtp === "MOVE")
        {
            return (<div style={{display: "inline-block", paddingLeft: 5}}>
                {clrturndispstr}{pctpsel}
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
    
    function displayCheckStatuses(csideinchk, dispqwarn, csdqninchk, useboldqmsg)
    {
        cc.letMustBeBoolean(csideinchk, "csideinchk");
        cc.letMustBeBoolean(dispqwarn, "dispqwarn");
        cc.letMustBeBoolean(csdqninchk, "csdqninchk");
        cc.letMustBeBoolean(useboldqmsg, "useboldqmsg");
        
        return (<div>Check Status: {csideinchk ? (<b>You're in Check!</b>): "No!"}
            {dispqwarn ? " Queen WARNING: " : null}
            {(dispqwarn && csdqninchk && useboldqmsg) ? <b>"You're Queen is in Check!"</b> : null}
            {(dispqwarn && csdqninchk && !useboldqmsg) ? "You're Queen is in Check!" : null}
            {(dispqwarn && !csdqninchk) ? "No!" : null}
        </div>);
    }


    let clrvalturn = null;
    let iswhiteturn = true;
    let iscompleted = false;
    let currentsideisincheck = false;
    let acurrentsidequeenisincheck = false;
    if (loaded)
    {
        clrvalturn = ChessGame.getGameVIAGID(gid).getSideTurn();
        iswhiteturn = (clrvalturn === "WHITE");
        iscompleted = ChessGame.getGameVIAGID(gid).isCompleted();
        currentsideisincheck = ChessPiece.isSideInCheck(clrvalturn, gid, null, null);
        acurrentsidequeenisincheck = ChessPiece.isAtLeastOneQueenForSideInCheck(
            clrvalturn, gid, null, null);
    }
    //else;//defaults will be used
    let playertwousrnm = "tu";
    let playeroneusrnm = "me";
    let playeronecolor = "WHITE";
    let playertwocolor = "BLACK";
    let playeronerank = -1;
    let playertworank = -1;
    
    //"PROMOTION", "CREATE", "DELETE" are move types we might want to forbid access to


    //<button style={{marginLeft: 50}}
    //onClick={(event) => setWhiteMovesDownRanks(!whitemovesdownranks)}>
    //White moves {whitemovesdownranks ? "down": "up"} ranks!</button>

    //const iserr = !(cc.isStringEmptyNullOrUndefined(errormsg));
    //{iserr ? <p>{errormsg}</p>: null}
    
    
    //NOT DONE YET 7-14-2024 2:30 AM
    function executeUserCommand()
    {
        //first we need to generate the command in the notation that the executor can process
        //then we execute it
        const isuser = true;
        const isofficial = false;
        const ignorelist = null;
        const addpcs = null;
        const bpassimnxtmv = false;
        const useshort = true;
        const isundo = false;
        //whitemovesdownranks and gid comes in from state
        //command type will dictate if we are castling or not
        //(unless it is recognized as a special move by the King)
        //THE ONLY TIME PIECE_COLOR STATE IS USED IS FOR COMMAND TYPES:
        //PROMOTION, CREATE, AND DELETE
        //OTHERWISE IT IS FROM COLOR TURN VALUE
        

        
        // static genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist=null,
        //         addpcs=null, ptpval="QUEEN", usecslingasmv=false, bpassimnxtmv=false)
        

        // static makeLocalShortHandMove(mvcmd, gid, isuser, isundo=false,
        //  iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial=false)
        
        //ONLY CONVERTS COMMANDS IN SHORTHAND NOTATION
        // static genFullMoveCommandFromDisplayedCommandMain(usrcmd, gid, ptpval="QUEEN",
        //         iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv=false)
        
        
        // static genUndoMoveToShortHandCommand(mvcmd, redoit=false, remundo=false)
        
        // static genRedoMoveToShortHandCommand(mvcmd)
        
        
        // CHESSGAME:

        // genCommandToUndoLastMadeMove()


        let simpcmd = null;
        let clr = null;
        if (cmd_type === "PROMOTION" || cmd_type === "CREATE" || cmd_type === "DELETE")
        {
            clr = "" + piece_color;
        }
        else
        {
            if (iswhiteturn) clr = "WHITE";
            else clr = "BLACK";
        }
        let r = start_row;
        let c = start_col;
        let nr = end_row;
        let nc = end_col;
        let tp = piece_type;
        let myfullmvcmd = null;

        if (cmd_type === "COLOR HINTS" || cmd_type === "PIECE HINTS")
        {
            const useside = (cmd_type === "COLOR HINTS");
            let mytp = "";
            let mycr = -1;
            let mycc = -1;
            if (cmd_type === "COLOR HINTS");
            else
            {
                mytp = piece_type;
                mycr = start_row;
                mycc = start_col;
            }
            simpcmd = ChessPiece.genLongOrShortHandHintsCommandForPieceOrSide(clr, mytp, mycr,
                mycc, useside, useshort);
        }
        else if (cmd_type === "RESIGNATION")
        {
            simpcmd = ChessPiece.genLongOrShortHandResignCommand(clr, useshort);
        }
        else if (cmd_type === "DRAW")
        {
            const wtval = ((wants_tie === 0) ? false: true);
            simpcmd = ChessPiece.genLongOrShortHandTieDesireCommand(clr, wtval, useshort);
        }
        else if (cmd_type === "PROMOTION")
        {
            simpcmd = ChessPiece.genLongOrShortHandPawnPromotionCommand(clr, nr, nc,
                promo_piece_type, useshort);
        }
        else if (cmd_type === "CREATE")
        {
            simpcmd = ChessPiece.genLongOrShortHandCreateCommand(clr, tp, r, c, piece_move_count,
                useshort);
        }
        else if (cmd_type === "DELETE")
        {
            simpcmd = ChessPiece.genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c,
                piece_move_count, false, useshort);
        }
        else if (cmd_type === "CASTLEING")//NOT DONE YET 7-14-2024 2:30 AM
        {
            cc.logAndThrowNewError("NOT SURE WHAT TO DO HERE TO GENERATE THE COMMAND!");
        }
        else if (cmd_type === "PAWNING")//NOT DONE YET 7-14-2024 2:30 AM
        {
            cc.logAndThrowNewError("NOT SURE WHAT TO DO HERE TO GENERATE THE COMMAND!");
        }
        else if (cmd_type === "MOVE")//NOT DONE YET 7-14-2024 2:30 AM
        {
            cc.logAndThrowNewError("NOT SURE WHAT TO DO HERE TO GENERATE THE COMMAND!");
        }
        else cc.logAndThrowNewError("ERROR: Command type: " + cmd_type + " not recognized!");

        if (cc.isStringEmptyNullOrUndefined(simpcmd))//NOT DONE YET 7-14-2024 2:30 AM
        {
            cc.logAndThrowNewError("NOT SURE WHAT TO DO HERE THE SIMPLE COMMAND WAS NULL!");
        }
        else
        {
            const ptpval = ((cmd_type === "PROMOTION") ? promo_piece_type : "QUEEN");
            myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(simpcmd, gid,
                ptpval, whitemovesdownranks, bpassimnxtmv);
        }

        ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
            whitemovesdownranks, isofficial);
        setUpdateBoard(!updateboard);
    }

    function undoMoveMain(gameisover)
    {
        cc.letMustBeBoolean(gameisover, "gameisover");

        if (gameisover) ChessGame.getGameVIAGID(gid).stepBackward();
        else
        {
            let myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain("UNDO", gid);
            const isundo = true;
            const isuser = true;
            //we do not know if the move is official or if the move is unofficial
            //we can determine what it is though by checking the unofficial move
            let cpunoffmv = ChessGame.getGameVIAGID(gid).genCopyOfUnofficialMove();
            const isofficial = (cc.isStringEmptyNullOrUndefined(cpunoffmv) ? true: false);
            ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                whitemovesdownranks, isofficial);
            setUpdateBoard(!updateboard);
        }
    }

    //NOT DONE YET BUG REDOING DELETING A PIECE...
    function redoMoveMain(gameisover)
    {
        cc.letMustBeBoolean(gameisover, "gameisover");

        if (gameisover) ChessGame.getGameVIAGID(gid).stepForward();
        else
        {
            let myfullmvcmd = ChessGame.getGameVIAGID(gid).genCommandToRedoLastUndoneMove();
            const isundo = false;
            const isuser = true;
            const isofficial = false;
            console.log("INSIDE REDO! myfullmvcmd = ", myfullmvcmd);
            ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                whitemovesdownranks, isofficial);
            setUpdateBoard(!updateboard);
        }
    }


    //NEEDS MODIFIED 7-13-2024 BGCOLOR TO CHANGE IF THERE ARE ERRORS
    return (<div style={{marginLeft: 10,
        backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")}}>
        <h2>Play Game:</h2>
        <table style={{marginLeft: 10, marginBottom: 10}}>
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
                    <th>(COLS)<br />
                        <button onClick={(event) => setWhiteMovesDownRanks(!whitemovesdownranks)}>
                            RANK</button></th>
                    <th>ROW</th>
                </tr>
            </thead>
            <tbody>
                {generateTableRows(whitemovesdownranks, "white", "orange", "grey", "black")}
            </tbody>
        </table>
        
        {displayCheckStatuses(currentsideisincheck, showqnwarning, acurrentsidequeenisincheck,
            false)}
        
        <div>
            <button onClick={(event) => setShowQueenWarning(!showqnwarning)}>
                {(showqnwarning) ? "Hide ": "Show "} Queen Warning</button>
            <button onClick={(event) => undoMoveMain(iscompleted)}>
                {"< " + (iscompleted ? "Previous": "Undo") + " Move"}</button>
            <button onClick={(event) => redoMoveMain(iscompleted)}>
                {"> " + (iscompleted ? "Next": "Redo") + " Move"}</button>
            <button onClick={null}>{(iswhiteturn ? "Black": "White") + "'s Turn!"}</button>
            <button onClick={(event) => setUseRowColLocDisplay(!useroworcollocdisp)}>
                {useroworcollocdisp ? "Use string loc(s)" : "Use row-col loc(s)"}
            </button>
        </div>

        <select id={"cmd_type"} name="cmd_type" value={cmd_type}
            onChange={(event) => setCMDType(event.target.value)}>
            {cc.genOptionListFromArray(["COLOR HINTS", "PIECE HINTS", "CASTLEING", "PAWNING",
                "RESIGNATION", "DRAW", "MOVE", "PROMOTION", "CREATE", "DELETE"], null)}
        </select>
        
        {genCommandInterface(cmd_type, iswhiteturn, useroworcollocdisp)}
        <button onClick={(event) => executeUserCommand()}>Execute!</button>
        
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
