import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import MyImageComponent from "./MyImageComponent";
import ChessPiece from "./ChessPiece";
import ChessGame from "./ChessGame";
import Cmdinterface from "./Cmdinterface";
import { UserContext } from "./UserProvider";
//import { GameContext } from "./GameProvider";
import CommonClass from "./commonclass";

function GameBoard({srvrgame, pa_id, pb_id, addpcs=null, startmvslist=null})
{
    let cc = new CommonClass();
    const history = useHistory();
    //console.log("INSIDE GAME BOARD!");

    let calledsetup = useRef(false);
    let executehaserr = useRef(false);
    let [loaded, setLoaded] = useState(false);
    let [updateboard, setUpdateBoard] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const mysimpusrobj = cc.getSimplifiedUserObj(user);

    //console.log("srvrgame = ", srvrgame);
    cc.letMustBeDefinedAndNotNull(srvrgame, "srvrgame");
    cc.letMustBeAnInteger(pa_id, "pa_id");
    cc.letMustBeAnInteger(pb_id, "pb_id");
    
    const gid = srvrgame.id;
    
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
    let [statsinfo, setStatsInfo] = useState(null);
    let [upsdata, setUserPlayerData] = useState(null);
    let [errmsg, setErrorMessage] = useState(null);
    //console.log("OLD calledsetup.current = ", calledsetup.current);
    //console.log("pcshints = ", pcshints);
    
    let hints = useRef(cc.fourDimArrToTwoDimArr(pcshints));
    //console.log("hints = ", hints);

    function getNextMoveFromServer()
    {
        console.log("ATTEMPTING TO GET THE NEXT MOVE FROM THE SERVER() NOW:");
        //if we do not get the reply we want keep querying the server, until we do

        //what we might want to say on the server:
        //GameMoves.query.filter_by(game_id=gid, number=ChessPiece.getGameVIAGID(gid)).first();
        //"422 error invalid data (" + invpt + ") used to get item of type GameMoves"
        let numoffmvs = ChessPiece.getGameVIAGID(gid).getNumOfficialMoves();
        const lperrmsg = "422 error invalid data (number) used to get item of type GameMoves!";
        const ftlerrmsg = "422 error invalid data (gid) used to get item of type GameMoves!";
        const sidemvd = ChessPiece.getOppositeColor(ChessPiece.getGameVIAGID(gid).getMyColor());
        console.log("sidemvd = " + sidemvd);

        fetch("/get-one-move-for-game/" + gid + "/move-number/" + (numoffmvs + 1))
        .then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);

            let mdkys = Object.keys(mdata);
            for (let n = 0; n < mdkys.length; n++)
            {
                if (mdkys[n] === "error")
                {
                    if (mdata.error === lperrmsg)
                    {
                        setTimeout(getNextMoveFromServer, 3000);
                        return;
                    }
                    else if (mdata.error === ftlerrmsg)
                    {
                        cc.logAndThrowNewError("FAILED TO GET DATA FROM THE SERVER TO " +
                            "ADVANCE THE TURNS (GID WAS INVALID)!");
                    }
                    //else;//do nothing safe to proceed
                }
                //else;//do nothing safe to proceed
            }

            let simpcmd = mdata.move.contents;
            console.log("simpcmd = " + simpcmd);

            //somehow take the move made on the other board and make it on this one
            //simpcmd the simple command usually entered by the user
            const isuser = false;
            const isundo = false;
            const bpassimnxtmv = false;
            const isofficial = false;
            let ptpval = "QUEEN";//but might come in from command
            let pindx = simpcmd.indexOf("INTO");
            //console.log("pindx = " + pindx);

            if (0 < pindx && pindx < simpcmd.length)
            {
                let stp = simpcmd.substring(pindx + 4);
                ptpval = ChessPiece.getLongHandType(stp);
            }
            //else;//do nothing
            console.log("ptpval = " + ptpval);

            //get the type of command and then get the color from the command
            //alternatively, if using two boards, get the color from the game for our board,
            //then get the opposite color
            console.log("sidemvd = " + sidemvd);
            
            let myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(simpcmd,
                gid, ptpval, ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv);
            ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
            ChessPiece.advanceTurnIfPossible(sidemvd, gid, false, true, null, null);
        }).catch((merr) => {
            console.error("there was an error getting data from the server!");
            console.error(merr);
            cc.logAndThrowNewError("FAILED TO GET DATA FROM THE SERVER TO ADVANCE THE TURNS!");
        });
    }

    function sendMoveToServer(cpunoffmv, isnxtmv=true)
    {
        console.log("INSIDE OF SEND MOVE TO SERVER()");
        console.log("isnxtmv = " + isnxtmv);

        cc.letMustBeBoolean(isnxtmv, "isnxtmv");

        let cnvmvslist = ChessPiece.convertShorthandListOfMovesToDisplayList([cpunoffmv]);
        console.log("cnvmvslist = ", cnvmvslist);
        
        let configobj = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "body": JSON.stringify({"move": cnvmvslist[0],
            "number": ChessPiece.getGameVIAGID(gid).getNumOfficialMoves()})
        };
        fetch("/add-one-move-for-game/" + gid, configobj)
        .then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);
            console.log("isnxtmv = " + isnxtmv);
            if (isnxtmv) getNextMoveFromServer();
            else ChessPiece.getGameVIAGID(gid).sendCompletedGameDataToServer();
        }).catch((merr) => {
            console.error("There was a problem sending the data to the server!");
            console.error(merr);
            cc.logAndThrowNewError("FAILED TO SEND DATA TO SERVER AND ADVANCE THE TURNS!");
        });
    }

    function onSetup(statsarr, myupsdata, msrvrgame)
    {
        console.log("ATTEMPTING TO SET UP THE BOARD NOW:");
        console.log("addpcs = ", addpcs);
        console.log("gid = ", gid);
        console.log("pa_id = " + pa_id);
        console.log("pb_id = " + pb_id);
        ChessPiece.setAllPieceHintsFunc(setPcsHints);
        ChessPiece.setSendMoveToServerFunc(sendMoveToServer);
        
        //setup board methods
        //addpcs arr of [{row: 0, col: 0, color: "WHITE", type: "KING", move_count: 0,
        //arrindx: 0, id: "pid0"}] if used it will have at minimum 2 kings
        if (ChessPiece.getNumItemsInList(addpcs) < 2) ChessPiece.setUpBoard(gid);
        else ChessPiece.setUpBoardFromList(gid, addpcs, false);
        
        let [playertwousrnm, playeroneusrnm, playeronerank, playertworank] =
            cc.getPlayersUsernamesAndRanksFromData(statsarr, myupsdata, msrvrgame);

        //if the users are different, then the colors will be different
        //get the username from the user-player data
        //if both of the usernames are not the same then,
        //-the one that matches the current username will determine the color
        //if both of the usernames are the same, then ?.
        //-if the number of boards is 1 NOT 2, BOTH colors are used
        //-if the number of boards is 2 NOT 1, then ?.
        //--if we know the player id we created, then we can get the color from that.
        //--if we do not know the player id we created, then screwed.

        let myclr = null;
        if (playertwousrnm === playeroneusrnm || msrvrgame.completed)
        {
            //usernames are the same
            let numbrds = -1;
            if (pa_id < 1 && pb_id < 1) numbrds = 0;
            else if ((pa_id < 1 && (1 < pb_id || pb_id === 1)) ||
                (pb_id < 1 && (1 < pa_id || pa_id === 1)))
            {
                numbrds = 2;
            }
            else numbrds = 1;
            console.log("numbrds = ", numbrds);

            if (numbrds === 1 || msrvrgame.completed) myclr = "BOTH";
            else if (numbrds === 2)
            {
                //need to know the player id we created
                let pidcrted = -1;
                if (1 < pb_id || pb_id === 1) pidcrted = pb_id;
                else if (1 < pa_id || pa_id === 1) pidcrted = pa_id;
                //else;//do nothing
                if (msrvrgame.playera.id === pidcrted) myclr = msrvrgame.playera.color;
                else if (msrvrgame.playerb.id === pidcrted) myclr = msrvrgame.playerb.color;
                else
                {
                    cc.logAndThrowNewError("cannot set the color of the board! " +
                        "Invalid player id created or it is not known and not on the game!");
                }
            }
            else
            {
                cc.logAndThrowNewError("cannot set the color of the board! " +
                    "Invalid number of boards!");
            }
        }
        else
        {
            //will be two boards can look up color from based on username
            if (mysimpusrobj.username === playertwousrnm) myclr = msrvrgame.playera.color;
            else myclr = msrvrgame.playerb.color;
        }
        console.log("myclr = " + myclr);

        let sclr = "WHITE";

        //game constructor methods
        if (msrvrgame.completed)
        {
            //the moves will come in from the game...
            let mytempmvsarr = msrvrgame.moves.map((mymv) => mymv.contents);
            console.log("mytempmvsarr = ", mytempmvsarr);

            let offmvs = ChessPiece.genFullMoveCommands(mytempmvsarr, gid, null,
                ChessPiece.WHITE_MOVES_DOWN_RANKS, false);
            console.log("offmvs = ", offmvs);
            
            let gm = new ChessGame(gid, offmvs, true, myclr);
        }
        else
        {
            ChessGame.makeNewChessGameFromColor(gid, myclr);//NEEDS TO BE MODIFIED 7-13-2024
            //NOTE: OFFICIAL MOVES WILL NEED TO BE FULL SHORT HAND MOVES
            //ChessGame gm = new ChessGame(gid, offmvs=null, isdone=false, mclrval="BOTH");
            //ChessGame.makeNewChessGameFromMoveList(gid, offmvs=null, isdone=false);
            //ChessGame.makeNewChessGameFromGID(gid);
        }
        
        
        console.log("PIECE LIST AFTER SET UP BOARD CALLED:");
        //console.log("pieces = ", pieces);
        //console.log("getPieces() = ", getPieces());
        console.log("ChessPiece.cps = ", ChessPiece.cps);
        console.log("ChessGame.all = ", ChessGame.all);
        calledsetup.current = true;
        console.log("NEW calledsetup.current = ", calledsetup.current);

        if (myclr === sclr || myclr === "BOTH");
        else getNextMoveFromServer();
    }


    useEffect(() => {
        console.log("INSIDE OF DATA FETCH USE EFFECT!");
        fetch("/stats").then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);
            setStatsInfo(mdata);
            fetch("/user-players").then((res) => res.json()).then((mupdata) => {
                console.log("mupdata = ", mupdata);
                onSetup(mdata, mupdata, srvrgame);
                setUserPlayerData(mupdata);
                setLoaded(true);//needed to display the pieces, sling shot route does not work
            }).catch((merr) => {
                console.error("There was a problem getting data from the server!");
                console.error(merr);
                setErrorMessage("Could not get the user-player information: " + merr.message);
                setLoaded(true);
            });
        }).catch((merr) => {
            console.error("There was a problem getting data from the server!");
            console.error(merr);
            setErrorMessage("Could not get the stats information: " + merr.message);
            setLoaded(true);
        });
    }, []);

    useEffect(() => {
        console.log("INSIDE OF USE EFFECT!");
        console.log("srvrgame = ", srvrgame);
        console.log("upsdata = ", upsdata);
        console.log("statsinfo = ", statsinfo);
        if (calledsetup.current)
        {
            hints.current = cc.fourDimArrToTwoDimArr(pcshints);
            //console.log("hints.current = ", hints.current);
            setUpdateBoard(!updateboard);
            setTimeout(() => setPcsHints([]), 10000);
        }
        //else
        //{
            //if (loaded) onSetup(statsinfo, upsdata, srvrgame);
            //else;//do nothing
        //}
    }, [calledsetup.current, pcshints, gid, loaded]);
    

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

    function swapLocs()
    {
        let mynwmvs = mvslist.map(mitem => {
            if (mitem.id === mv.id)
            {
                let mynwmv = {...mv};
                let tempstartrow = mynwmv.start_row;
                let tempstartcol = mynwmv.start_col;
                mynwmv.start_row = mynwmv.end_row;
                mynwmv.start_col = mynwmv.end_col;
                mynwmv.end_row = tempstartrow;
                mynwmv.end_col = tempstartcol;
                return mynwmv;
            }
            else return mitem;
        });
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

    function displayCheckStatuses(csideinchk, csideinckmate, cside, smate, dispqwarn,
        csdqninchk, useboldqmsg)
    {
        cc.letMustBeBoolean(csideinchk, "csideinchk");
        cc.letMustBeBoolean(csideinckmate, "csideinckmate");
        cc.letMustBeDefinedAndNotNull(cside, "cside");
        cc.letMustBeBoolean(smate, "smate");
        cc.letMustBeBoolean(dispqwarn, "dispqwarn");
        cc.letMustBeBoolean(csdqninchk, "csdqninchk");
        cc.letMustBeBoolean(useboldqmsg, "useboldqmsg");
        
        if (csideinckmate)
        {
            if (csideinchk);
            else
            {
                cc.logAndThrowNewError("if you are in checkmate, then you must also be in check!");
            }
            if (smate)
            {
                cc.logAndThrowNewError("You cannot have a draw or a stalemate and be in " +
                    "checkmate!");
            }
            //else;//do nothing
        }
        //else;//do nothing

        if (smate)
        {
            if (csideinchk || csideinckmate)
            {
                cc.logAndThrowNewError("You cannot have a draw or a stalemate and be in " +
                    "check or checkmate!");
            }
            //else;//do nothing
        }
        //else;//do nothing

        return (<div style={{paddingBottom: 5}}>Check Status: {csideinchk ? (<b>You're in Check
            {csideinckmate ? <div style={{display: "inline-block"}}>
                mate! {ChessPiece.getOppositeColor(cside)} Wins!</div>: "!"}
            </b>): "No!"}
            {smate ? <>{" "}<b>Stalemate! Tie!</b></>: null}
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
    let currentsideincheckmate = false;
    let smate = false;
    if (loaded)
    {
        clrvalturn = ChessGame.getGameVIAGID(gid).getSideTurn();
        iswhiteturn = (clrvalturn === "WHITE");
        iscompleted = ChessGame.getGameVIAGID(gid).isCompleted();
        currentsideisincheck = ChessPiece.isSideInCheck(clrvalturn, gid, null, null);
        smate = ChessGame.getGameVIAGID(gid).isTied();
        if (currentsideisincheck)
        {
            currentsideincheckmate = ChessPiece.inCheckmate(clrvalturn, gid, null, null);
        }
        //else currentsideincheckmate = false;
        acurrentsidequeenisincheck = ChessPiece.isAtLeastOneQueenForSideInCheck(
            clrvalturn, gid, null, null);
    }
    //else;//defaults will be used


    //console.log("srvrgame = ", srvrgame);
    //console.log("upsdata = ", upsdata);
    //console.log("statsinfo = ", statsinfo);

    let [playertwousrnm, playeroneusrnm, playeronerank, playertworank] =
        cc.getPlayersUsernamesAndRanksFromData(statsinfo, upsdata, srvrgame);
    
    //"PROMOTION", "CREATE", "DELETE" are move types we might want to forbid access to


    //<button style={{marginLeft: 50}}
    //onClick={(event) => setWhiteMovesDownRanks(!whitemovesdownranks)}>
    //White moves {whitemovesdownranks ? "down": "up"} ranks!</button>
    
    
    function executeUserCommand(usecompletegame)
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

        cc.letMustBeBoolean(usecompletegame, "usecompletegame");
        
        
        let simpcmd = null;
        let myfullmvcmd = null;
        const usepcclr = (mv.cmd_type === "PROMOTION" || mv.cmd_type === "CREATE" ||
            mv.cmd_type === "DELETE" || mv.cmd_type === "COLOR HINTS" ||
            mv.cmd_type === "PIECE HINTS");
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

        const baseerrmsg = "invalid command";
        const cgameerrmsg = "! The game is over. If you did not already " +
                    "make this move before, you cannot make it now! ";
        const fullerrmsg = (usecompletegame ? baseerrmsg + cgameerrmsg : baseerrmsg + " ");
        if (cc.isStringEmptyNullOrUndefined(simpcmd))
        {
            cc.logAndThrowNewError("THE SIMPLE COMMAND MUST NOT BE NULL!");
        }
        else
        {
            const ptpval = ((mv.cmd_type === "PROMOTION" || mv.cmd_type === "MOVE") ?
                mv.promo_piece_type : "QUEEN");
            try
            {
                myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(simpcmd, gid,
                    ptpval, ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv);
                executehaserr.current = false;
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrorMessage("");
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage(fullerrmsg + ex.message);
                executehaserr.current = true;
                return;
            }   
        }

        try
        {
            ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
            executehaserr.current = false;
            if (cc.isStringEmptyNullOrUndefined(errmsg));
            else setErrorMessage("");
            setUpdateBoard(!updateboard);
        }
        catch(ex)
        {
            console.error(ex);
            setErrorMessage(fullerrmsg + ex.message);
            executehaserr.current = true;
            return;
        }
    }

    function advanceTurnMain()
    {
        if (executehaserr.current)
        {
            console.error("DID NOT ADVANCE DUE TO EXECUTION ERROR!");
            return;
        }
        //else;//do nothing

        try
        {
            ChessPiece.advanceTurnIfPossibleMain((iswhiteturn ? "WHITE": "BLACK"),
                gid, true, null, null);
            if (cc.isStringEmptyNullOrUndefined(errmsg));
            else setErrorMessage("");
        }
        catch(ex)
        {
            console.error(ex);
            setErrorMessage("invalid command " + ex.message);
            return;
        }
    }

    function undoMoveMain(gameisover)
    {
        cc.letMustBeBoolean(gameisover, "gameisover");

        if (gameisover)
        {
            try
            {
                ChessGame.getGameVIAGID(gid).stepBackward();
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrorMessage("");
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command! The game is over. If you did not already " +
                    "make this move before, you cannot make it now! " + ex.message);
                return;
            }
        }
        else
        {
            let myfullmvcmd = null;
            try
            {
                myfullmvcmd = ChessPiece.genFullMoveCommandFromDisplayedCommandMain("UNDO", gid);
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrorMessage("");
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command " + ex.message);
                return;
            }
            const isundo = true;
            const isuser = true;
            //we do not know if the move is official or if the move is unofficial
            //we can determine what it is though by checking the unofficial move
            let cpunoffmv = ChessGame.getGameVIAGID(gid).genCopyOfUnofficialMove();
            const isofficial = (cc.isStringEmptyNullOrUndefined(cpunoffmv) ? true: false);
            try
            {
                ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                    ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command " + ex.message);
                return;
            }
        }
        setUpdateBoard(!updateboard);
    }

    function redoMoveMain(gameisover)
    {
        cc.letMustBeBoolean(gameisover, "gameisover");

        if (gameisover)
        {
            try
            {
                ChessGame.getGameVIAGID(gid).stepForward();
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrorMessage("");
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command! The game is over. If you did not already " +
                    "make this move before, you cannot make it now! " + ex.message);
                return;
            }
        }
        else
        {
            let myfullmvcmd = null;
            try
            {
                myfullmvcmd = ChessGame.getGameVIAGID(gid).genCommandToRedoLastUndoneMove();
                if (cc.isStringEmptyNullOrUndefined(errmsg));
                else setErrorMessage("");
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command " + ex.message);
                return;
            }
            const isundo = false;
            const isuser = true;
            const isofficial = false;
            console.log("INSIDE REDO! myfullmvcmd = ", myfullmvcmd);
            
            try
            {
                ChessPiece.makeLocalShortHandMove(myfullmvcmd, gid, isuser, isundo,
                    ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial);
            }
            catch(ex)
            {
                console.error(ex);
                setErrorMessage("invalid command " + ex.message);
                return;
            }
        }
        setUpdateBoard(!updateboard);
    }

    function genColorString(mgmclr, usepaclr)
    {
        cc.letMustBeBoolean(usepaclr, "usepaclr");

        let gmclriswt = false;
        let gmclrisbk = false;
        if (mgmclr === "BOTH")
        {
            gmclriswt = true;
            gmclrisbk = true;
        }
        else if (mgmclr === "WHITE") gmclriswt = true;
        else if (mgmclr === "BLACK") gmclrisbk = true;
        else cc.logAndThrowNewError("INVALID COLOR FOUND AND USED FOR THE GAME COLOR!");
        if (usepaclr) return "WHITE" + (gmclriswt ? "*": "");
        else return "BLACK" + (gmclrisbk ? "*": "");
    }


    //console.log("loaded = " + loaded);

    let plyraid = -1;
    let plyrbid = -1;
    if (cc.isItemNullOrUndefined(srvrgame));
    else
    {
        plyraid = srvrgame.playera.id;
        plyrbid = srvrgame.playerb.id;
    }

    if (loaded);
    else return (<div>Loading Game...</div>);
    
    const gmclr = ChessGame.getGameVIAGID(gid).getMyColor();
    const iserr = !cc.isStringEmptyNullOrUndefined(errmsg);
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
        
        {displayCheckStatuses(currentsideisincheck, currentsideincheckmate, clrvalturn, smate,
            showqnwarning, acurrentsidequeenisincheck, false)}
        
        <div>
            <button onClick={(event) => setShowQueenWarning(!showqnwarning)}>
                {(showqnwarning) ? "Hide ": "Show "} Queen Warning</button>
            <button onClick={(event) => undoMoveMain(iscompleted)}>
                {"< " + (iscompleted ? "Previous": "Undo") + " Move"}</button>
            <button onClick={(event) => redoMoveMain(iscompleted)}>
                {"> " + (iscompleted ? "Next": "Redo") + " Move"}</button>
            <button style={{fontSize: 15}} onClick={(event) => advanceTurnMain()}>
                <b>{(iswhiteturn ? "Black": "White") + "'s Turn!"}</b></button>
            <button onClick={(event) => swapLocs()}>Swap Locs</button>
            <button onClick={(event) => setUseRowColLocDisplay(!useroworcollocdisp)}>
                {useroworcollocdisp ? "Use string loc(s)" : "Use row-col loc(s)"}
            </button>
        </div>
        
        <div style={{backgroundColor: cc.getBGColorToBeUsed(iserr, "GameBoard")}}>
            <Cmdinterface style={{display: "inline-block"}}
                whitemovesdownranks={whitemovesdownranks} iswhiteturn={iswhiteturn}
                useroworcollocdisp={useroworcollocdisp} arrindx={0} mvs={mvslist}
                setmvs={setMovesList} userem={false} remmv={null} remitem={false} />
            <button style={{fontSize: 15}} onClick={(event) => executeUserCommand(iscompleted)}>
                <b>Execute!</b></button>
            <button style={{fontSize: 15}} onClick={(event) => {
                    executeUserCommand(iscompleted);
                    advanceTurnMain();
                }}>
                <b>Execute And Advance!</b></button>
            {iserr ? <p>{errmsg}</p>: <br />}
        </div>
        
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>PLAYER 1 (ID: {plyraid}): {genColorString(gmclr, true)}</th>
                    <th>PLAYER 2 (ID: {plyrbid}): {genColorString(gmclr, false)}</th>
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
