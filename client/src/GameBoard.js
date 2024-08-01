import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import MyImageComponent from "./MyImageComponent";
import ChessPiece from "./ChessPiece";
import ChessGame from "./ChessGame";
import Cmdinterface from "./Cmdinterface";
//import { GameContext } from "./GameProvider";
import CommonClass from "./commonclass";

function GameBoard({srvrgame})
{
    let cc = new CommonClass();
    const history = useHistory();
    //console.log("INSIDE GAME BOARD!");

    let calledsetup = useRef(false);
    let [loaded, setLoaded] = useState(false);
    let [updateboard, setUpdateBoard] = useState(false);

    //console.log("srvrgame = ", srvrgame);
    cc.letMustBeDefinedAndNotNull(srvrgame, "srvrgame");
    
    const gid = srvrgame.id;
    const addpcs = null;
    
    const [mvslist, setMovesList] = useState([{
        dir: "LEFT",
        piece_type: "KING",
        piece_color: "WHITE",
        piece_move_count: 0,
        wants_tie: 0,
        promo_piece_type: "QUEEN",
        start_row: 0,
        end_row: 0,
        start_col: 0,
        end_col: 0,
        cmd_type: "MOVE",
        arrindx: 0,
        id: "mv0"
    }]);
    const mv = mvslist[0];
    
    let [useroworcollocdisp, setUseRowColLocDisplay] = useState(false);
    let [showqnwarning, setShowQueenWarning] = useState(true);
    let [whitemovesdownranks, setWhiteMovesDownRanks] = useState(true);
    let [pcshints, setPcsHints] = useState([]);//[][][]
    //console.log("OLD calledsetup.current = ", calledsetup.current);
    //console.log("pcshints = ", pcshints);
    
    let hints = useRef(cc.fourDimArrToTwoDimArr(pcshints));
    //console.log("hints = ", hints);

    useEffect(() => {
        console.log("INSIDE OF USE EFFECT!");
        console.log("srvrgame = ", srvrgame);
        if (calledsetup.current)
        {
            hints.current = cc.fourDimArrToTwoDimArr(pcshints);
            //console.log("hints.current = ", hints.current);
            setUpdateBoard(!updateboard);
            setTimeout(() => setPcsHints([]), 10000);
        }
        else
        {
            ChessPiece.setAllPieceHintsFunc(setPcsHints);
            
            //setup board methods
            if (ChessPiece.getNumItemsInList(addpcs) < 2) ChessPiece.setUpBoard(gid);
            else ChessPiece.setUpBoardFromList(gid, addpcs);
            
            //game constructor methods
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
    }, [calledsetup.current, pcshints, gid]);
    
    function setSelectedLoc(rval, cval, ispcatloc)
    {
        console.log("INSIDE OF SET-SELECTED-LOC()!");
        console.log("rval = " + rval);
        console.log("cval = " + cval);
        console.log("ispcatloc = " + ispcatloc);
        cc.letMustBeBoolean(ispcatloc, "ispcatloc");
        cc.letMustBeAnInteger(rval, "rval");
        cc.letMustBeAnInteger(cval, "cval");
        
        let mynwmvs = null;
        if (ispcatloc)
        {
            //we can get the ChessPiece here
            let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, null, null);
            cc.letMustBeDefinedAndNotNull(cp, "cp");
            //rval, cval, cp.getType() for type and location
            console.log("cp = ", cp);
            
            mynwmvs = mvslist.map(mitem => {
                if (mitem.id === mv.id)
                {
                    let mynwmv = {...mv};
                    mynwmv.start_row = 0 + rval;
                    mynwmv.start_col = 0 + cval;
                    mynwmv.piece_type = cp.getType();
                    mynwmv.piece_move_count = cp.getMoveCount();
                    mynwmv.color = cp.getColor();
                    return mynwmv;
                }
                else return mitem;
            });
        }
        else
        {
            //the location is empty piece type is blank or null
            //we can set the rval and cval as a location to move to
            mynwmvs = mvslist.map(mitem => {
                if (mitem.id === mv.id)
                {
                    let mynwmv = {...mv};
                    mynwmv.end_row = 0 + rval;
                    mynwmv.end_col = 0 + cval;
                    return mynwmv;
                }
                else return mitem;
            });
        }
        setMovesList(mynwmvs);
    }

    function generateTableRows(wtmvsdwnrks, lsqrclr, dsqrclr, lpcclr, dpcclr, htsclr)
    {
        let myrws = [];
        let uselightclr = true;
        //console.log("hints.current = ", hints.current);

        for (let r = 0; r < 8; r++)
        {
            let mycolsonrw = [];
            if (r % 2 === 0) uselightclr = true;
            else uselightclr = false;
            for (let c = 0; c < 8 + 2; c++)
            {
                const usehintsforsqr = ((c < 8) ?
                    ChessPiece.isLocOnListOfLocs(r, c, hints.current): false);
                let mysqrclr = null;
                //console.log("usehintsforsqr = " + usehintsforsqr);
                if (usehintsforsqr) mysqrclr = "" + htsclr;
                else
                {
                    if (uselightclr) mysqrclr = "" + lsqrclr;
                    else mysqrclr = "" + dsqrclr;
                }
                if (c < 8)
                {
                    //these need to come from the piece list
                    //cp is null, then type is null; otherwise cp.getType()
                    //console.log("calledsetup.current = ", calledsetup.current);
                    
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
        //const ignorelist = null;
        //const addpcs = null;
        const bpassimnxtmv = false;
        const useshort = true;
        const isundo = false;
        //whitemovesdownranks and gid comes in from state
        //command type will dictate if we are castling or not
        //(unless it is recognized as a special move by the King)
        //THE ONLY TIME PIECE_COLOR STATE IS USED IS FOR COMMAND TYPES:
        //PROMOTION, CREATE, AND DELETE
        //OTHERWISE IT IS FROM COLOR TURN VALUE
        
        
        let simpcmd = null;
        let myfullmvcmd = null;
        const usepcclr = (mv.cmd_type === "PROMOTION" || mv.cmd_type === "CREATE" ||
            mv.cmd_type === "DELETE");
        const tp = ((mv.cmd_type === "CASTLEING") ? "CASTLE" :
            ((mv.cmd_type === "PAWNING") ? "PAWN" : "" + mv.piece_type));
        const clr = (usepcclr ? "" + mv.piece_color : (iswhiteturn ? "WHITE" : "BLACK"));
        const usedir = (mv.cmd_type === "CASTLEING" || mv.cmd_type === "PAWNING");
        const useleft = (usedir ? (mv.dir.charAt(0) === "L") : false);
        let r = mv.start_row;
        let c = mv.start_col;
        let nr = mv.end_row;
        let nc = mv.end_col;
        if (mv.cmd_type === "COLOR HINTS" || mv.cmd_type === "PIECE HINTS")
        {
            const useside = (mv.cmd_type === "COLOR HINTS");
            const mytp = (useside ? "" : mv.piece_type);
            const mycr = (useside ? -1 : mv.start_row);
            const mycc = (useside ? -1 : mv.start_col);
            simpcmd = ChessPiece.genLongOrShortHandHintsCommandForPieceOrSide(clr, mytp, mycr,
                mycc, useside, useshort);
        }
        else if (mv.cmd_type === "RESIGNATION")
        {
            simpcmd = ChessPiece.genLongOrShortHandResignCommand(clr, useshort);
        }
        else if (mv.cmd_type === "DRAW")
        {
            const wtval = ((mv.wants_tie === 0) ? false: true);
            simpcmd = ChessPiece.genLongOrShortHandTieDesireCommand(clr, wtval, useshort);
        }
        else if (mv.cmd_type === "PROMOTION")
        {
            simpcmd = ChessPiece.genLongOrShortHandPawnPromotionCommand(clr, nr, nc,
                mv.promo_piece_type, useshort);
        }
        else if (mv.cmd_type === "CREATE")
        {
            simpcmd = ChessPiece.genLongOrShortHandCreateCommand(clr, tp, r, c,
                mv.piece_move_count, useshort);
        }
        else if (mv.cmd_type === "DELETE")
        {
            simpcmd = ChessPiece.genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c,
                mv.piece_move_count, false, useshort);
        }
        else if (mv.cmd_type === "CASTLEING")
        {
            simpcmd = ChessPiece.genLongOrShortHandCastelingCommand(clr, useleft, useshort);
        }
        else if (mv.cmd_type === "PAWNING")
        {
            if (r === nr && c === nc)
            {
                cc.logAndThrowNewError("NO MOVE WAS MADE!");
            }
            //else;//do nothing safe to proceed

            simpcmd = ChessPiece.genLongOrShortHandPawningCommand(clr, r, c, nr, nc,
                useleft, useshort);
        }
        else if (mv.cmd_type === "MOVE")
        {
            if (r === nr && c === nc)
            {
                cc.logAndThrowNewError("NO MOVE WAS MADE!");
            }
            //else;//do nothing safe to proceed

            //option a: generate just the simple move
            simpcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, tp, r, c,
                nr, nc, usedir, useleft, useshort);
            //option b: generate the full move command
        }
        else cc.logAndThrowNewError("ERROR: Command type: " + mv.cmd_type + " not recognized!");

        if (cc.isStringEmptyNullOrUndefined(simpcmd))
        {
            cc.logAndThrowNewError("THE SIMPLE COMMAND MUST NOT BE NULL!");
        }
        else
        {
            const ptpval = ((mv.cmd_type === "PROMOTION" || mv.cmd_type === "MOVE") ?
                mv.promo_piece_type : "QUEEN");
            myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(simpcmd, gid,
                ptpval, ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv);
        }

        ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
            ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
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
                ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
        }
        setUpdateBoard(!updateboard);
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
                ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
        }
        setUpdateBoard(!updateboard);
    }


    //NEEDS MODIFIED 7-13-2024 BGCOLOR TO CHANGE IF THERE ARE ERRORS
    return (<div style={{marginLeft: 10, paddingTop: 1,
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
                {generateTableRows(whitemovesdownranks, "white", "orange", "grey", "black", "lime")}
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
        
        <div>
            <Cmdinterface style={{display: "inline-block"}}
                whitemovesdownranks={whitemovesdownranks} iswhiteturn={iswhiteturn}
                useroworcollocdisp={useroworcollocdisp} arrindx={0} mvs={mvslist}
                setmvs={setMovesList} userem={false} remmv={null} remitem={false} />
            <button onClick={(event) => executeUserCommand()}>Execute!</button>
        </div>
        
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
