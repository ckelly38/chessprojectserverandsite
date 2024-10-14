import React, { useEffect, useState, useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import MyImageComponent from "./MyImageComponent";
import ChessPiece from "./ChessPiece";
import ChessGame from "./ChessGame";
import Cmdinterface from "./Cmdinterface";
import { UserContext } from "./UserProvider";
//import { GameContext } from "./GameProvider";
import CommonClass from "./commonclass";

function GameBoard({srvrgame, pa_id, pb_id, setpaid, setpbid, addpcs=null, setresgames, resgms})
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
    cc.letMustBeDefinedAndNotNull(resgms, "resgms");
    cc.letMustBeDefinedAndNotNull(setresgames, "setresgames");
    cc.letMustBeDefinedAndNotNull(setpaid, "setpaid");
    cc.letMustBeDefinedAndNotNull(setpbid, "setpbid");
    cc.letMustBeAnInteger(pa_id, "pa_id");
    cc.letMustBeAnInteger(pb_id, "pb_id");
    
    function isGameOnResumableGameList(mgame, usemvs)
    {
        console.log("mgame = ", mgame);
        console.log("usemvs = " + usemvs);

        cc.letMustBeDefinedAndNotNull(mgame, "mgame");
        cc.letMustBeBoolean(usemvs, "usemvs");
        
        const tempgid = (usemvs ? mgame.id: mgame.gameID);
        console.log("tempgid = " + tempgid);

        let addit = true;
        for (let n = 0; n < resgms.length; n++)
        {
            if (resgms[n].gid === tempgid)
            {
                addit = false;
                break;
            }
            //else;//do nothing
        }
        //console.log("addit = " + addit);

        return !addit;
    }

    function addResumableGame(mgame, uipa, uipb, usemvs, usetwoboards)
    {
        console.log("mgame = ", mgame);

        cc.letMustBeDefinedAndNotNull(mgame, "mgame");
        cc.letMustBeBoolean(uipa, "uipa");
        cc.letMustBeBoolean(uipb, "uipb");
        cc.letMustBeBoolean(usetwoboards, "usetwoboards");
        cc.letMustBeBoolean(usemvs, "usemvs");

        let addit = !isGameOnResumableGameList(mgame, usemvs);
        console.log("addit = " + addit);

        const mgid = (usemvs ? mgame.id : mgame.gameID);
        if (addit)
        {
            let tempmgmvs = null;
            if (usemvs) tempmgmvs = mgame.moves;
            else tempmgmvs = mgame.getOfficialMovesDisplayList();
            const mytempmvs = (cc.isStringEmptyNullOrUndefined(tempmgmvs) ? []: [...tempmgmvs]);
            console.log("mytempmvs = ", mytempmvs);

            let mynwgm = {"gid": mgid, "userisplayera": uipa, "userisplayerb": uipb,
                "twoboards": usetwoboards, "user_id": mysimpusrobj.id, "username": mysimpusrobj.username,
                "moves": mytempmvs};
            
            setresgames([...resgms, mynwgm]);
        }
        else
        {
            console.error("game with id " + mgid + " already found on the resumable games " +
                "list so not added!");
            return;
        }
    }

    function setMovesListOnResumableGame(mgame, nwmvslist)//, usemvs
    {
        cc.letMustBeDefinedAndNotNull(mgame, "mgame");
        //cc.letMustBeBoolean(usemvs, "usemvs");
        
        //console.log("usemvs = " + usemvs);
        console.log("mgame = ", mgame);
        console.log("resgms = ", resgms);
        
        console.log("mgame.id = ", mgame.id);
        console.log("mgame.gid = ", mgame.gid);
        console.log("mgame.gameID = ", mgame.gameID);
        console.log("mgame.game_id = ", mgame.game_id);

        if (isGameOnResumableGameList(mgame, false))
        {
            setresgames(resgms.map((mgm) => {
                if (mgm.gid === mgame.gameID)
                {
                    let mynwresgm = {...mgm};
                    if (cc.isItemNullOrUndefined(nwmvslist)) mynwresgm.moves = null;
                    else if (nwmvslist.length < 1) mynwresgm.moves = [];
                    else mynwresgm.moves = [...nwmvslist];
                    return mynwresgm;
                }
                else return mgm;
            }));
        }
        else
        {
            cc.logAndThrowNewError("game with id " + mgame.gameID + " not found on the " +
                "resumable games list so moves were not set!");
        }
    }

    function removeResumableGame(mgame)
    {
        cc.letMustBeDefinedAndNotNull(mgame, "mgame");

        let addit = !isGameOnResumableGameList(mgame, false);
        //console.log("addit = " + addit);

        if (addit)
        {
            console.error("game with id " + mgame.gameID + " already removed from the resumable games " +
                "list so not added!");
            return;
        }
        else setresgames(resgms.filter((gm) => (!(gm.gid === mgame.gameID))));
    }

    function isServerGameEndDataValid(msrvrgame)
    {
        //is the winning data on the server game valid
        if (msrvrgame.tied)
        {
            if (msrvrgame.playera_resigned || msrvrgame.playerb_resigned)
            {
                //error
                cc.logAndThrowNewError("the game is tied, so no players should have " +
                    "resigned!");
            }
            //else;//do nothing valid
            if (msrvrgame.completed);
            else
            {
                //error
                cc.logAndThrowNewError("the game is tied, so the game must be completed!");
            }
        }
        else
        {
            if (msrvrgame.playerb_resigned)
            {
                if (msrvrgame.playera_won);
                else
                {
                    //error
                    cc.logAndThrowNewError("a player resigned, but that same player " +
                        "cannot also win the game!");
                }

                if (msrvrgame.playera_resigned)
                {
                    //error
                    cc.logAndThrowNewError("a player resigned, but the other player " +
                        "cannot both resign and also win the game!");
                }
                //else;//do nothing

                if (msrvrgame.completed);
                else
                {
                    //error
                    cc.logAndThrowNewError("a player resigned, so the game must be " +
                        "completed!");
                }
            }
            else
            {
                if (msrvrgame.playera_resigned)
                {
                    if (msrvrgame.playera_won)
                    {
                        //error
                        cc.logAndThrowNewError("a player resigned, but that same player " +
                            "cannot also win the game!");
                    }
                    //else;//do nothing valid

                    if (msrvrgame.completed);
                    else
                    {
                        //error
                        cc.logAndThrowNewError("a player resigned, so the game must be " +
                            "completed!");
                    }
                }
                else
                {
                    if (msrvrgame.completed)
                    {
                        if (msrvrgame.playera_resigned || msrvrgame.playerb_resigned ||
                            msrvrgame.tied || msrvrgame.playera_won || msrvrgame.playerb_won)
                        {
                            //do nothing valid
                        }
                        else
                        {
                            //error
                            cc.logAndThrowNewError("the game is completed, so a least one " +
                                "of the following must be true: a player won the game, the " +
                                "game ended in a tie, or a player must have resigned!");
                        }
                    }
                    else
                    {
                        if (msrvrgame.playera_resigned || msrvrgame.playerb_resigned ||
                            msrvrgame.tied || msrvrgame.playera_won || msrvrgame.playerb_won)
                        {
                            //error
                            cc.logAndThrowNewError("the game is not completed, so a " +
                                "player must not have resigned, the game must not be tied, " +
                                "and no player must have won the game!");
                        }
                        //else;//do nothing valid
                    }
                }         
            }
        }
        return true;
    }

    if (isServerGameEndDataValid(srvrgame));

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
    let [usewizardscmd, setWizardsChessMode] = useState(true);
    let [pcshints, setPcsHints] = useState([]);//[][][]
    let [statsinfo, setStatsInfo] = useState(null);
    let [upsdata, setUserPlayerData] = useState(null);
    let [mygamemoves, setGameMovesData] = useState(null);
    let [errmsg, setErrorMessage] = useState(null);
    //console.log("OLD calledsetup.current = ", calledsetup.current);
    //console.log("pcshints = ", pcshints);
    
    let hints = useRef(cc.fourDimArrToTwoDimArr(pcshints));
    //console.log("hints = ", hints);

    function getNextMoveFromServer(offset)
    {
        console.log("ATTEMPTING TO GET THE NEXT MOVE FROM THE SERVER() NOW:");
        //if we do not get the reply we want keep querying the server, until we do
        cc.letMustBeAnInteger(offset, "offset");

        //what we might want to say on the server:
        //GameMoves.query.filter_by(game_id=gid, number=ChessPiece.getGameVIAGID(gid)).first();
        //"422 error invalid data (" + invpt + ") used to get item of type GameMoves"
        let numoffmvs = ChessPiece.getGameVIAGID(gid).getNumOfficialMoves() + offset;
        const lperrmsg = "422 error invalid data (number) used to get item of type GameMoves!";
        const ftlerrmsg = "422 error invalid data (gid) used to get item of type GameMoves!";
        const sidemvd = ChessPiece.getOppositeColor(ChessPiece.getGameVIAGID(gid).getMyColor());
        console.log("sidemvd = " + sidemvd);

        console.log("");
        console.log("MOVE NUMBER: " + (numoffmvs + 1));
        fetch("/get-one-move-for-game/" + gid + "/move-number/" + (numoffmvs + 1))
        .then((res) => res.json()).then((mdata) => {
            console.log("GOT MOVE NUMBER: " + (numoffmvs + 1));
            console.log("mdata = ", mdata);

            let mdkys = Object.keys(mdata);
            for (let n = 0; n < mdkys.length; n++)
            {
                if (mdkys[n] === "error")
                {
                    if (mdata.error === lperrmsg)
                    {
                        setTimeout(() => getNextMoveFromServer(offset), 3000);
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
            console.error("FAILED TO GET MOVE NUMBER: " + (numoffmvs + 1));
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

        console.log("mygamemoves = ", mygamemoves);
        
        let gmhasmvs = false;
        if (cc.isStringEmptyNullOrUndefined(mygamemoves));
        else gmhasmvs = true;
        console.log("gmhasmvs = " + gmhasmvs);

        const moffset = (ChessPiece.getGameVIAGID(gid).hasPieceListOnServer() ? 1: 0);
        console.log("moffset = " + moffset);

        const num_offmvs = ChessPiece.getGameVIAGID(gid).getNumOfficialMoves();
        console.log("num_offmvs = " + num_offmvs);

        const nwmvnum = num_offmvs + moffset;
        console.log("nwmvnum = " + nwmvnum);

        let configobj = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            "body": JSON.stringify({"move": cnvmvslist[0],
            "number": nwmvnum})
        };
        fetch("/add-one-move-for-game/" + gid, configobj)
        .then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);
            console.log("isnxtmv = " + isnxtmv);
            if (isnxtmv) getNextMoveFromServer(moffset);
            else ChessPiece.getGameVIAGID(gid).sendCompletedGameDataToServer();
        }).catch((merr) => {
            console.error("There was a problem sending the data to the server!");
            console.error(merr);
            cc.logAndThrowNewError("FAILED TO SEND DATA TO SERVER AND ADVANCE THE TURNS!");
        });
    }

    function getNumberOfBoards(mpa_id, mpb_id)
    {
        console.log("mpa_id = " + mpa_id);
        console.log("mpb_id = " + mpb_id);
        
        cc.letMustBeAnInteger(mpa_id, "mpa_id");
        cc.letMustBeAnInteger(mpb_id, "mpb_id");

        let numbrds = -1;
        if (mpa_id < 1 && mpb_id < 1) numbrds = 0;
        else if ((mpa_id < 1 && (1 < mpb_id || mpb_id === 1)) ||
            (mpb_id < 1 && (1 < mpa_id || mpa_id === 1)))
        {
            numbrds = 2;
        }
        else numbrds = 1;
        console.log("numbrds = ", numbrds);

        return numbrds;
    }

    function onSetup(statsarr, myupsdata, msrvrgame, mygmmvs)
    {
        console.log("ATTEMPTING TO SET UP THE BOARD NOW:");
        console.log("addpcs = ", addpcs);
        console.log("gid = ", gid);
        console.log("mpaid = pa_id = " + pa_id);
        console.log("mpbid = pb_id = " + pb_id);
        console.log("msrvrgame = ", msrvrgame);
        console.log("mygmmvs = ", mygmmvs);
        ChessPiece.setAllPieceHintsFunc(setPcsHints);
        ChessPiece.setSendMoveToServerFunc(sendMoveToServer);
        
        //a custom game will have at least one of:
        //different pieces, moves, may start with a different side
        //if it has different pieces
        
        let gmhasmvs = false;
        let gmmvsisempty = false;
        let mi = -1;
        let mpaid = pa_id;
        let mpbid = pb_id;
        if (cc.isStringEmptyNullOrUndefined(mygmmvs))
        {
            gmmvsisempty = true;
            if (isGameOnResumableGameList(msrvrgame, true) && !msrvrgame.completed)
            {
                for (let n = 0; n < resgms.length; n++)
                {
                    if (resgms[n].gid === gid)
                    {
                        mi = n;
                        break;
                    }
                    //else;//do nothing
                }
                console.log("mi = " + mi);

                if (mi < 0 || resgms.length - 1 < mi)
                {
                    cc.logAndThrowNewError("invalid value found and used for mi!");
                }
                //else;//do nothing
                console.log("resgms[" + mi + "] = ", resgms[mi]);

                if (cc.isItemNullOrUndefined(resgms[mi]))
                {
                    cc.logAndThrowNewError("the resumable game object must not be empty!");
                }
                //else;//do nothing

                if (cc.isStringEmptyNullOrUndefined(resgms[mi].moves));
                else gmhasmvs = true;
            }
            //else;//do nothing
        }
        else
        {
            gmhasmvs = true;
            gmmvsisempty = false;
        }
        console.log("gmmvsisempty = " + gmmvsisempty);
        console.log("gmhasmvs = " + gmhasmvs);

        
        if (isGameOnResumableGameList(msrvrgame, true) && !msrvrgame.completed)
        {
            for (let n = 0; n < resgms.length; n++)
            {
                if (resgms[n].gid === gid)
                {
                    mi = n;
                    break;
                }
                //else;//do nothing
            }
            console.log("mi = " + mi);

            if (mi < 0 || resgms.length - 1 < mi)
            {
                cc.logAndThrowNewError("invalid value found and used for mi!");
            }
            //else;//do nothing
            console.log("resgms[" + mi + "] = ", resgms[mi]);

            if (cc.isItemNullOrUndefined(resgms[mi]))
            {
                cc.logAndThrowNewError("the resumable game object must not be empty!");
            }
            //else;//do nothing

            const numbrds = getNumberOfBoards(mpaid, mpbid);

            if (resgms[mi].twoboards)
            {
                console.log("USING TWO BOARDS!");

                if (numbrds === 2);
                else
                {
                    //can handle this error...
                    //there are either 1 on none
                    //0 boards both player ids are invalid
                    //when there is one board, both ids are valid
                    if (numbrds === 1)
                    {
                        console.log("by ids there is only one board!");

                        //much more difficult than 0
                        //both ids are valid but one of them is not
                        if (resgms[mi].userisplayera === resgms[mi].userisplayerb)
                        {
                            if (resgms[mi].userisplayera)
                            {
                                //both are the same user, but we want two boards
                                //need to know which IDS got created by this one, but we do not
                                //server game stores the player IDS
                                //one of these should be invalid, but we do not know which one
                                //game has the color of each player
                                
                                if (mpaid === msrvrgame.playera.id)
                                {
                                    if (mpbid === msrvrgame.playerb.id)
                                    {
                                        //no invalid IDS found, so cannot conclude which is wrong
                                        cc.logAndThrowNewError("using two boards so one of " +
                                            "the IDs must be invalid, but the number of " +
                                            "boards (" + numbrds + ") was invalid! WE " +
                                            "CANNOT CONCLUSIVELY TELL WHICH PLAYER ID IS " +
                                            "WRONG, BUT WE DO KNOW ONE IS WRONG!");
                                    }
                                    else
                                    {
                                        mpbid = -1;
                                        setpbid(-1);
                                    }
                                }
                                else
                                {
                                    mpaid = -1;
                                    setpaid(-1);
                                }
                            }
                            else
                            {
                                cc.logAndThrowNewError("the user must be at least one or both " +
                                    "of the players, but it was neither!");
                            }
                        }
                        else
                        {
                            console.log("one player is the user and the other is not!");

                            //one is and one is not
                            if (resgms[mi].userisplayera)
                            {
                                mpbid = -1;
                                setpbid(-1);
                            }
                            else
                            {
                                //user is player b
                                mpaid = -1;
                                setpaid(-1);
                            }
                        }
                    }
                    else if (numbrds === 0)
                    {
                        //much easier
                        if (resgms[mi].userisplayera)
                        {
                            if (mpaid < 1)
                            {
                                mpaid = msrvrgame.playera.id;
                                setpaid(msrvrgame.playera.id);
                            }
                            //else;//do nothing
                        }
                        else if (resgms[mi].userisplayerb)
                        {
                            if (mpbid < 1)
                            {
                                mpbid = msrvrgame.playerb.id;
                                setpbid(msrvrgame.playerb.id);
                            }
                            //else;//do nothing
                        }
                        else
                        {
                            cc.logAndThrowNewError("the user must be at least one or both of the " +
                                "players, but it was neither!");
                        }
                    }
                    else cc.logAndThrowNewError("illegal number of boards found and used here!");
                }
            }
            else
            {
                console.log("USING ONE BOARD!");

                if (numbrds === 1);
                else
                {
                    //numboards are 2 or numboards are 0
                    if (numbrds === 0 || numbrds === 2)
                    {
                        if (mpaid < 1)
                        {
                            mpaid = msrvrgame.playera.id;
                            setpaid(msrvrgame.playera.id);
                        }
                        //else;//do nothing
                        
                        if (mpbid < 1)
                        {
                            mpbid = msrvrgame.playerb.id;
                            setpbid(msrvrgame.playerb.id);
                        }
                        //else;//do nothing
                    }
                    else cc.logAndThrowNewError("illegal number of boards found and used here!");
                }
            }
        }
        //else;//do nothing    

        //MAY NEED TO FIGURE OUT A WAY TO GET THE CUSTOM PIECES ON A RESUMABLE GAME...
        //MAYBE msrvrgame, but not sure if it will still hold it since test is with normal game

        let mypclist = null;
        if (gmhasmvs && !gmmvsisempty)//THE !empty forces a bypass on resumable game BUG
        {
            const fullmvstr = mygmmvs[0].move.contents;
            console.log("fullmvstr = " + fullmvstr);

            const pci = fullmvstr.indexOf("PCLIST");
            const hspclist = (pci === 0);
            if (hspclist)
            {
                //"PCLIST = [{type: KING color: WHITE row: 7 col: 4 move_count: 0},
                //{type: KING color: BLACK row: 0 col: 4 move_count: 0},
                //{type: QUEEN color: WHITE row: 1 col: 0 move_count: 0}]"

                const fsbi = fullmvstr.indexOf("[");
                if (pci + 6 + 3 === fsbi);
                else cc.logAndThrowNewError("illegal format for PCLIST found and used here!");

                const esbi = fullmvstr.indexOf("]");
                if (esbi === fsbi + 1)
                {
                    cc.logAndThrowNewError("illegal PCLIST found on server!");
                }
                //else;//do nothing
                
                mypclist = [];
                for (let i = fsbi + 1; i < fullmvstr.length; i++)
                {
                    if (fullmvstr.charAt(i) === '{')
                    {
                        //the word type: space must be found next
                        let tpi = cc.getNextIndexOf("type: ", fullmvstr, i);
                        if (tpi === i + 1)
                        {
                            //good
                            let clri = cc.getNextIndexOf(" color: ", fullmvstr, tpi);
                            let idiff = clri - (tpi + 6);
                            if (idiff < 0 || 6 < idiff)
                            {
                                cc.logAndThrowNewError("illegal format for PCLIST found " +
                                    "and used here!");
                            }
                            //else;//do nothing

                            let tpval = fullmvstr.substring(tpi + 6, clri);
                            console.log("tpval = " + tpval);

                            let ri = cc.getNextIndexOf(" row: ", fullmvstr, clri);
                            
                            if (ri === clri + 13);
                            else
                            {
                                cc.logAndThrowNewError("illegal format for PCLIST found " +
                                    "and used here!");
                            }

                            let clrval = fullmvstr.substring(clri + 8, ri);
                            console.log("clrval = " + clrval);
                            
                            let ci = cc.getNextIndexOf(" col: ", fullmvstr, ri);
                            
                            if (ci === ri + 7);
                            else
                            {
                                cc.logAndThrowNewError("illegal format for PCLIST found " +
                                    "and used here!");
                            }

                            let rval = Number(fullmvstr.substring(ri + 6, ci));
                            console.log("rval = " + rval);

                            let mci = cc.getNextIndexOf(" move_count: ", fullmvstr, ci);
                            
                            if (mci === ci + 7);
                            else
                            {
                                cc.logAndThrowNewError("illegal format for PCLIST found " +
                                    "and used here!");
                            }

                            let cval = Number(fullmvstr.substring(ci + 6, mci));
                            console.log("cval = " + cval);

                            let ebi = cc.getNextIndexOf("}", fullmvstr, mci);
                            
                            let ebmcidiff = ebi - (mci + 13);
                            if (ebmcidiff < 1 || 3 < ebmcidiff)
                            {
                                cc.logAndThrowNewError("illegal format for PCLIST found " +
                                    "and used here!");
                            }
                            //else;//do nothing

                            let mvcnt = Number(fullmvstr.substring(mci + 13, ebi));
                            console.log("mvcnt = " + mvcnt);

                            let nwpc = {
                                "type": tpval,
                                "color": clrval,
                                "row": rval,
                                "col": cval,
                                "move_count": mvcnt
                            };
                            mypclist.push(nwpc);
                        }
                        else
                        {
                            cc.logAndThrowNewError("illegal format for PCLIST found " +
                                "and used here!");
                        }
                    }
                }
            }
            //else;//do nothing no custom pieces list
        }
        //else;//do nothing no custom pieces list
        console.log("mypclist = ", mypclist);

        //setup board methods
        //addpcs arr of [{row: 0, col: 0, color: "WHITE", type: "KING", move_count: 0,
        //arrindx: 0, id: "pid0"}] if used it will have at minimum 2 kings
        if (ChessPiece.getNumItemsInList(mypclist) < 2)
        {
            let cpcs = ChessPiece.getAllPiecesWithGameID(gid);
            if (cc.isStringEmptyNullOrUndefined(cpcs));
            else ChessPiece.clearBoard(gid);
            ChessPiece.setUpBoard(gid);
        }
        else ChessPiece.setUpBoardFromList(gid, mypclist, false);
        console.log("Pieces are setup on the board! Now proceeding to set up the game!");
        
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

        console.log("msrvrgame.completed = " + msrvrgame.completed);
        console.log("playeroneusrnm = " + playeroneusrnm);
        console.log("playertwousrnm = " + playertwousrnm);

        let myclr = null;
        if (playertwousrnm === playeroneusrnm || msrvrgame.completed)
        {
            //usernames are the same
            const numbrds = getNumberOfBoards(mpaid, mpbid);
            if (numbrds === 1 || msrvrgame.completed) myclr = "BOTH";
            else if (numbrds === 2)
            {
                //need to know the player id we created
                let pidcrted = -1;
                if (1 < mpbid || mpbid === 1) pidcrted = mpbid;
                else if (1 < mpaid || mpaid === 1) pidcrted = mpaid;
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
        console.log("INIT sclr = " + sclr);


        //game constructor methods
        const gmviaid = ChessGame.getGameVIAGID(gid, true);
        console.log("gmviaid = ", gmviaid);

        const mkgm = cc.isItemNullOrUndefined(gmviaid);
        console.log("mkgm = ", mkgm);

        let nxtmvoffset = 0;
        if (gmhasmvs)
        {
            //the moves will come in from the game...
            //if not empty then take it from the gamemoves else if resuming take it from state.
            let mytempmvsarr = null;
            if (gmmvsisempty) mytempmvsarr = resgms[mi].moves;
            else mytempmvsarr = mygmmvs.map((mygmmv) => mygmmv.move.contents);
            //let mytempmvsarr = msrvrgame.moves.map((mymv) => mymv.contents);//sometimes bad
            nxtmvoffset = 1;
            console.log("mytempmvsarr = ", mytempmvsarr);

            let offmvs = ChessPiece.genFullMoveCommands(mytempmvsarr, gid, null,
                ChessPiece.WHITE_MOVES_DOWN_RANKS, true);
                //bypass must be true because the game has not been created yet
            console.log("offmvs = ", offmvs);
            
            const gm = (mkgm ? new ChessGame(gid, offmvs, msrvrgame.completed, myclr): gmviaid);
            gm.setHasPieceListOnServer(true);
            console.log("gm = ", gm);
            
            //server game is valid
            if (mkgm);
            else gm.resetMoveCount(true);

            if (msrvrgame.completed)
            {
                if (msrvrgame.tied) gm.setIsTied(true, true);
                if (msrvrgame.playera_resigned) gm.setColorResigns("WHITE", true, true);
                if (msrvrgame.playerb_resigned) gm.setColorResigns("BLACK", true, true);
                if (msrvrgame.playera_won) gm.setColorWins("WHITE", true, true);
                if (msrvrgame.playerb_won) gm.setColorWins("BLACK", true, true);
            }
            else
            {
                gm.makeAllGivenOfficialMoves();
                //start color may not be white...
                sclr = gm.getSideTurn();
                console.log("NEW sclr = " + sclr);
            }
        }
        else
        {
            //NORMAL GAME: THIS WORKS:
            const gm = (mkgm ? ChessGame.makeNewChessGameFromColor(gid, myclr): gmviaid);
            gm.setHasPieceListOnServer(false);
            
            //NOTE: OFFICIAL MOVES WILL NEED TO BE FULL SHORT HAND MOVES
            //ChessGame gm = new ChessGame(gid, offmvs=null, isdone=false, mclrval="BOTH");
            //ChessGame.makeNewChessGameFromMoveList(gid, offmvs=null, isdone=false);
            //ChessGame.makeNewChessGameFromGID(gid);
        }

        if (msrvrgame.completed) removeResumableGame(msrvrgame);
        else
        {
            addResumableGame(msrvrgame, (playeroneusrnm === mysimpusrobj.username),
                (playeroneusrnm === mysimpusrobj.username), true, !(myclr === "BOTH"));
        }
        
        
        console.log("PIECE LIST AFTER SET UP BOARD CALLED:");
        //console.log("pieces = ", pieces);
        //console.log("getPieces() = ", getPieces());
        console.log("ChessPiece.cps = ", ChessPiece.cps);
        console.log("ChessGame.all = ", ChessGame.all);
        
        calledsetup.current = true;
        
        console.log("NEW calledsetup.current = ", calledsetup.current);
        console.log("nxtmvoffset = " + nxtmvoffset);
        console.log("myclr = " + myclr);
        console.log("FINAL sclr = " + sclr);

        if (myclr === sclr || myclr === "BOTH")
        {
            console.log("WAITING FOR THE USER ON THIS BOARD TO MAKE THE FIRST MOVE!");
        }
        else
        {
            console.log("FETCHING THE FIRST (NEXT) MOVE FROM THE SERVER!");
            getNextMoveFromServer(nxtmvoffset);
        }
    }


    useEffect(() => {
        console.log("INSIDE OF DATA FETCH USE EFFECT!");
        fetch("/stats").then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);
            setStatsInfo(mdata);
            fetch("/user-players").then((res) => res.json()).then((mupdata) => {
                console.log("mupdata = ", mupdata);
                setUserPlayerData(mupdata);
                fetch("/all-moves-for-game/" + gid).then((res) => res.json())
                .then((gmmvsdata) => {
                    console.log("gmmvsdata = ", gmmvsdata);
                    onSetup(mdata, mupdata, srvrgame, gmmvsdata);
                    setGameMovesData(gmmvsdata);
                    setLoaded(true);
                    //needed to display the pieces, sling shot route does not work
                }).catch((merr) => {
                    console.error("There was a problem getting data from the server!");
                    console.error(merr);
                    setErrorMessage("Could not get the game-moves information: " + merr.message);
                    setLoaded(true);
                });
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
        if (currentsideisincheck)
        {
            currentsideincheckmate = ChessPiece.inCheckmate(clrvalturn, gid, null, null);
        }
        else
        {
            currentsideincheckmate = false;
            smate = ChessPiece.isStalemate(ChessPiece.getOppositeColor(clrvalturn), gid,
                null, null);
        }
        acurrentsidequeenisincheck = ChessPiece.isAtLeastOneQueenForSideInCheck(
            clrvalturn, gid, null, null);
    }
    //else;//defaults will be used

    if (iscompleted && usewizardscmd) setWizardsChessMode(false);
    //else;//do nothing


    //console.log("srvrgame = ", srvrgame);
    //console.log("upsdata = ", upsdata);
    //console.log("statsinfo = ", statsinfo);

    let [playertwousrnm, playeroneusrnm, playeronerank, playertworank] =
        cc.getPlayersUsernamesAndRanksFromData(statsinfo, upsdata, srvrgame);
    
    //"PROMOTION", "CREATE", "DELETE" are move types we might want to forbid access to


    //<button style={{marginLeft: 50}}
    //onClick={(event) => setWhiteMovesDownRanks(!whitemovesdownranks)}>
    //White moves {whitemovesdownranks ? "down": "up"} ranks!</button>
    
    
    function executeUserCommand(usecompletegame, usemywcmd=false)
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
        cc.letMustBeBoolean(usemywcmd, "usemywcmd");
        
        
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
            if (r === nr && c === nc) cc.logAndThrowNewError("NO MOVE WAS MADE!");
            //else;//do nothing safe to proceed

            simpcmd = ChessPiece.genLongOrShortHandPawningCommand(clr, r, c, nr, nc,
                useleft, useshort, usemywcmd);
        }
        else if (mv.cmd_type === "MOVE")
        {
            if (r === nr && c === nc) cc.logAndThrowNewError("NO MOVE WAS MADE!");
            //else;//do nothing safe to proceed

            //option a: generate just the simple move
            simpcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, tp, r, c,
                nr, nc, usedir, useleft, useshort, usemywcmd);
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
                //need to know if the error is due to having many pieces that can move to the endloc
                //if that is the case, catch the error, and disable wizards chess mode
                //in addition to the normal stuff
                //AMBIGUOUS ERROR MESSAGE WILL MOST LIKELY HAVE: "FOUND MORE THAN ONE "
                console.error(ex);
                
                let myambgerrindx = ex.message.indexOf("FOUND MORE THAN ONE ");
                let isambgslocerror = ((0 < myambgerrindx || myambgerrindx === 0) &&
                    myambgerrindx < ex.message.length);
                console.log("isambgslocerror = " + isambgslocerror);

                if (usemywcmd && isambgslocerror) setWizardsChessMode(false);
                //else;//do nothing
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
            
            let cnvmvslist = ChessGame.getGameVIAGID(gid).getOfficialMovesDisplayList();
			console.log("cnvmvslist = ", cnvmvslist);
            
            setMovesListOnResumableGame(ChessGame.getGameVIAGID(gid), cnvmvslist);
            
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

    function goToMove(tmvi, mgid)
    {
        const cmvi = ChessGame.getGameVIAGID(mgid).getMoveIndex();
        //console.log("cmvi = " + cmvi);
        //console.log("tmvi = " + tmvi);

        const miscmptd = true;
        const mdelay = 1000;//1000 for one second
        const nodelay = (mdelay < 1);
        if (cmvi < tmvi)
        {
            for (let n = 0; n < tmvi - cmvi; n++)
            {
                if (n === 0 || nodelay) redoMoveMain(miscmptd);
                else setTimeout(() => redoMoveMain(miscmptd), n * mdelay);
            }
        }
        else if (tmvi < cmvi)
        {
            for (let n = 0; n < cmvi - tmvi; n++)
            {
                if (n === 0 || nodelay) undoMoveMain(miscmptd);
                else setTimeout(() => undoMoveMain(miscmptd), n * mdelay);
            }
        }
        else console.error("THIS IS THE CURRENT MOVE! NO MOVE MADE! MOVE ALREADY MADE!");
    }

    function getMovesRows(mgid, wmvsdnrnks)
    {
        cc.letMustBeAnInteger(mgid, "mgid");
        cc.letMustBeBoolean(wmvsdnrnks, "wmvsdnrnks");
        
        const nolocscnv = (wmvsdnrnks === ChessPiece.WHITE_MOVES_DOWN_RANKS);
        const mgm = ChessGame.getGameVIAGID(mgid);
        const mvstxtonlylist = mgm.getOfficialMovesDisplayList();
        if (cc.isStringEmptyNullOrUndefined(mvstxtonlylist)) return null;
        else
        {
            let fmvcmdsacnv = null;
            if (nolocscnv) fmvcmdsacnv = mvstxtonlylist;
            else
            {
                const mvcmdsfcnv = mvstxtonlylist.map((mvtxt) =>
                    ChessGame.convertStringArrayToMultidim(mvtxt));
                const fnlmvcmdsfcnv = ChessPiece.convertAllLocationsForFullMoveCommands(
                    mvcmdsfcnv, wmvsdnrnks);
                fmvcmdsacnv = fnlmvcmdsfcnv.map((marr) => marr[0]);
            }

            const mvi = mgm.getMoveIndex();
            return fmvcmdsacnv.map((mvtxt, index) => {
                const baseky = "gameid" + mgid + "movenum" + (index + 1);
                return (<tr key={baseky} className={(mvi === index) ? "bg-lime-400": ""}>
                    <td key={baseky + "number"}>{index + 1}</td>
                    <td key={baseky + "text"}>{mvtxt}</td>
                    <td key={baseky + "gotoitcntr"}>
                        <button key={baseky + "gotoitbtn"} onClick={(event) => goToMove(index, mgid)}>
                            Go To Move</button></td>
                </tr>)});
        }
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

    let mvsrws = getMovesRows(gid, whitemovesdownranks);
    const mvi = ChessGame.getGameVIAGID(gid).getMoveIndex();
    
    //style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}
    //style={{marginLeft: 10, paddingTop: 1,
    // style={{fontSize: 15}}
    const gmclr = ChessGame.getGameVIAGID(gid).getMyColor();
    const iserr = !cc.isStringEmptyNullOrUndefined(errmsg);
    //const nobordersobj = {borderStyle: "collapse", border: "none", borderStyle: "none",
    //    borderBottom: "none", borderTop: "none", borderRight: "none", borderLeft: "none"
    //};
    //https://stackoverflow.com/questions/4457274/how-to-specify-tables-height-such-that-a-vertical-scroll-bar-appears
    //style={{display: "block", maxHeight: 562, overflowY: "scroll"}}
    return (<div className="pl-5 pt-1"
        style={{backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")}}>
        <h2>Play Game:</h2>
        <table className="mb-5 border-none">
            <tbody className="border-none">
                <tr className="border-none">
                    <td className="border-none">
                        <table>
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
                                        <button onClick={(event) => setWhiteMovesDownRanks(
                                            !whitemovesdownranks)}>RANK</button></th>
                                    <th>ROW</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateTableRows(whitemovesdownranks, "white", "orange", "grey",
                                    "black", "lime")}
                            </tbody>
                        </table>
                    </td>
                    <td className="border-none" style={{paddingLeft: 50,
                        display: (iscompleted ? "block": "none")}}>
                        <table className="max-h-[562px] block overflow-y-scroll">
                            <thead>
                                <tr>
                                    <th>#</th><th>Move Text</th><th>Go To It</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className={(mvi === -1) ? "bg-lime-400": ""}>
                                    <td>0</td><td>Setup</td><td>
                                        <button onClick={(event) => goToMove(-1, gid)}>
                                            Reset Board</button></td>
                                </tr>
                                {mvsrws}
                            </tbody>
                        </table>
                    </td>
                </tr>
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
            <button className="text-sm/[15px]" onClick={(event) => advanceTurnMain()}>
                <b>{(iswhiteturn ? "Black": "White") + "'s Turn!"}</b></button>
            <button onClick={(event) => swapLocs()}>Swap Locs</button>
            <button onClick={(event) => setUseRowColLocDisplay(!useroworcollocdisp)}>
                {useroworcollocdisp ? "Use string loc(s)" : "Use row-col loc(s)"}
            </button>
            {iscompleted ? null : <button onClick={(event) => setWizardsChessMode(!usewizardscmd)}>
                Use {usewizardscmd ? "non-" : ""}wizard's chess mode</button>}
        </div>
        
        <div style={{backgroundColor: cc.getBGColorToBeUsed(iserr, "GameBoard")}}>
            <Cmdinterface style={{display: "inline-block"}}
                whitemovesdownranks={whitemovesdownranks} iswhiteturn={iswhiteturn}
                useroworcollocdisp={useroworcollocdisp} arrindx={0} mvs={mvslist} setmvs={setMovesList}
                usewizardsmode={usewizardscmd} userem={false} remmv={null} remitem={false} />
            <button className="text-sm/[15px]"
                    onClick={(event) => executeUserCommand(iscompleted, usewizardscmd)}>
                <b>Execute!</b></button>
            <button className="text-sm/[15px]" onClick={(event) => {
                    executeUserCommand(iscompleted, usewizardscmd);
                    advanceTurnMain();
                }}>
                <b>Execute And Advance!</b></button>
            {iserr ? <p>{errmsg}</p>: <br />}
        </div>
        
        <table className="ml-10 mt-5">
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
        <br />
    </div>);
}

export default GameBoard;
