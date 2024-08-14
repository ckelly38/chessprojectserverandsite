import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import NewPiece from "./NewPiece";
import Cmdinterface from "./Cmdinterface";
import ChessPiece from "./ChessPiece";
import CommonClass from "./commonclass";

function PieceListForm({addpiece, rempiece, mpcs, getpcs, setpcs, mvs, setmvs, addmv, remmv,
    haserrs, sethaserrs})
{
    let cc = new CommonClass();
    const history = useHistory();
    let [whitemovesdownranks, setWhiteMovesDownRanks] = useState(true);
    let [useroworcollocdisp, setUseRowColLocDisplay] = useState(true);
    let [whitestarts, setWhiteStarts] = useState(true);
    let [merrmsg, setMyErrorMessage] = useState(null);

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


    function handleSubmit(event)
    {
        event.preventDefault();
        console.log("INSIDE ONSUBMIT!");
        console.log("mpcs = ", mpcs);
        console.log("mvs = ", mvs);
        //send the and the pieces to the game in App component
        //then we need to start it...
        //we need to know when to pass what in though
        //this will be similar to joinging a game on gamelist
        //create the custom game with 2 of the same players for the same user and start immediately
        //send the moves list, the first move will have the piece list converted into something
        //that can be processed by the server
        //it will also have the rest of the moves
        
        //need to make sure that we are not moving a piece that we did not create
        //if the piece type is not in the piece list, then we cannot move that piece at all
        //need to get the valid piece types for side
        //need to run this against the validation method for the game...
        //will error out if not valid
        const usegets = false;
        let wpcs = ChessPiece.filterListByColor(mpcs, "WHITE", usegets);
        let bpcs = ChessPiece.filterListByColor(mpcs, "BLACK", usegets);
        let wpcstps = ChessPiece.getPieceTypes(wpcs, usegets);
        let bpcstps = ChessPiece.getPieceTypes(bpcs, usegets);
        console.log("GOT THE PIECES BY COLOR AND PIECE TYPES");

        for (let n = 0; n < mvs.length; n++)
        {
            let mpctps = null;
            if (mvs[n].piece_color === "WHITE") mpctps = wpcstps;
            else if (mvs[n].piece_color === "BLACK") mpctps = bpcstps;
            else
            {
                //error out...
                console.log("mvs[" + n + "].piece_color = " + mvs[n].piece_color);
                setMyErrorMessage("color is not valid!");
                return;
            }

            let tpisvalid = false;
            for (let x = 0; x < mpctps.length; x++)
            {
                if (mpctps[x] === mvs[n].piece_type)
                {
                    tpisvalid = true;
                    break;
                }
                //else;//do nothing
            }
            console.log("tpisvalid = " + tpisvalid);

            if (tpisvalid);
            else
            {
                //error out...
                setMyErrorMessage("no piece found with that color and type!");
                return;
            }
            console.log("mvs[" + n + "].start_row = " + mvs[n].start_row);
            console.log("mvs[" + n + "].start_col = " + mvs[n].start_col);
            console.log("mvs[" + n + "].end_row = " + mvs[n].end_row);
            console.log("mvs[" + n + "].end_col = " + mvs[n].end_col);

            //make sure no same locations on the same move now
            if (mvs[n].start_row === mvs[n].end_row && mvs[n].start_col === mvs[n].end_col)
            {
                //error out...
                setMyErrorMessage("no move was made (start and end locations were the same)!");
                return;
            }
            //else;//do nothing

            //on the first and second moves, the pieces will be at the starting locations given
            let fnditem = false;
            for (let x = 0; x < mpcs.length; x++)
            {
                if (n === 0 || n === 1)
                {
                    if (mpcs[x].color === mvs[n].piece_color &&
                        mpcs[x].type === mvs[n].piece_type &&
                        mpcs[x].row === mvs[n].start_row &&
                        mpcs[x].col === mvs[n].start_col)
                    {
                        fnditem = true;
                        break;
                    }
                    //else;//do nothing
                }
                else break;
            }
            if (n === 0 || n === 1)
            {
                if (fnditem);
                else
                {
                    //error out...
                    setMyErrorMessage("did not find our piece at the starting location " +
                        "on the piece list!");
                    return;
                }
            }
            //else;//do nothing
            console.log("mvs[" + n + "].piece_type = " + mvs[n].piece_type);

            //make sure that the piece can actually move there legally
            //partial validation only... (by distance start and end locs comparison)
            //if it looks valid, we will say the move is valid, but need to create an
            //official board before we can for sure say if all of the moves are valid or not
            let locsarevalid = true;
            if (mvs[n].piece_type === "KING" || mvs[n].piece_type === "PAWN")
            {
                //move 1 in any direction
                //start row + 1 start_row - 1
                //start col + 1 start col - 1
                //or stay at current location
                let rdiff = mvs[n].end_row - mvs[n].start_row;
                let cdiff = mvs[n].end_col - mvs[n].start_col;
                if (rdiff < 0) rdiff *= -1;
                if (cdiff < 0) cdiff *= -1;
                if (rdiff === 0 || rdiff === 1)
                {
                    if (cdiff === 0 || cdiff === 1)
                    {
                        if (rdiff === 0 && cdiff === 0) locsarevalid = false;
                        //else;//do nothing true
                        //cannot conclusively tell if pawn can capture or not
                    }
                    else
                    {
                        if (cdiff === 2)
                        {
                            if (mvs[n].piece_type === "KING")
                            {
                                if (mvs[n].cmd_type === "CASTLEING");
                                //else;//cannot conclusively tell if we can castle or not
                            }
                            else locsarevalid = false;
                        }
                        else locsarevalid = false;
                    }
                }
                else
                {
                    if (rdiff === 2)
                    {
                        if (mvs[n].piece_type === "PAWN")
                        {
                            //problem here not necessarily false
                            //now color and location need to be taken into account
                            //and direction of travel
                            //start row for white pawn is 6 row for black is 1
                            if (cdiff === 0)
                            {
                                const srowclr = ((mvs[n].piece_color === "WHITE") ? 6: 1);
                                if (mvs[n].start_row === 6 && mvs[n].end_row === 4 &&
                                    srowclr === 6)
                                {
                                    //valid
                                }
                                else if (mvs[n].start_row === 1 && mvs[n].end_row === 3 &&
                                    srowclr === 1)
                                {
                                    //valid
                                }
                                else locsarevalid = false;
                            }
                            else locsarevalid = false;
                        }
                        else locsarevalid = false;
                    }
                    else locsarevalid = false;
                }
                console.log("locsarevalid = " + locsarevalid);

                if (locsarevalid);
                else
                {
                    //error out...
                    setMyErrorMessage("invalid starting or ending location for KING OR PAWN!");
                    return;
                }
            }
            else if (mvs[n].piece_type === "CASTLE" || mvs[n].piece_type === "ROOK")
            {
                if (mvs[n].end_row === mvs[n].start_row)
                {
                    if (mvs[n].end_col === mvs[n].start_col) locsarevalid = false;
                    //else;//do nothing true
                }
                else
                {
                    if (mvs[n].end_col === mvs[n].start_col);
                    else locsarevalid = false;
                }
                console.log("locsarevalid = " + locsarevalid);

                if (locsarevalid);
                else
                {
                    //error out...
                    setMyErrorMessage("invalid starting or ending location for CASTLE!");
                    return;
                }
            }
            else if (mvs[n].piece_type === "BISHOP")
            {
                let rdiff = mvs[n].end_row - mvs[n].start_row;
                let cdiff = mvs[n].end_col - mvs[n].start_col;
                if (rdiff < 0) rdiff *= -1;
                if (cdiff < 0) cdiff *= -1;
                
                if (rdiff === cdiff)
                {
                    if (rdiff === 0) locsarevalid = false;
                    //else;//do nothing true
                }
                else locsarevalid = false;
                console.log("locsarevalid = " + locsarevalid);

                if (locsarevalid);
                else
                {
                    //error out...
                    setMyErrorMessage("invalid starting or ending location for BISHOP!");
                    return;
                }
            }
            else if (mvs[n].piece_type === "QUEEN")
            {
                let rdiff = mvs[n].end_row - mvs[n].start_row;
                let cdiff = mvs[n].end_col - mvs[n].start_col;
                if (rdiff < 0) rdiff *= -1;
                if (cdiff < 0) cdiff *= -1;
                if (rdiff === cdiff)
                {
                    if (rdiff === 0) locsarevalid = false;
                    //else;//do nothing true
                }
                else
                {
                    //not valid for bishop but might be valid for castle
                    if (mvs[n].end_row === mvs[n].start_row)
                    {
                        if (mvs[n].end_col === mvs[n].start_col) locsarevalid = false;
                        //else;//do nothing true
                    }
                    else
                    {
                        if (mvs[n].end_col === mvs[n].start_col);
                        else locsarevalid = false;
                    }
                }
                console.log("locsarevalid = " + locsarevalid);

                if (locsarevalid);
                else
                {
                    //error out...
                    setMyErrorMessage("invalid starting or ending location for QUEEN!");
                    return;
                }
            }
            else if (mvs[n].piece_type === "KNIGHT")
            {
                let pktlocs = ChessPiece.getAllPossibleKnightMoveToLocs(mvs[n].start_row,
                    mvs[n].start_col);
                //if our end loc is on the list, then the end loc is valid
                //else not
                if (ChessPiece.isLocOnListOfLocs(mvs[n].start_row, mvs[n].start_col, pktlocs));
                else
                {
                    //error out...
                    locsarevalid = false;
                    setMyErrorMessage("invalid starting or ending location for QUEEN!");
                    return;
                }
            }
            else
            {
                //error out...
                setMyErrorMessage("invalid piece type!");
                return;
            }
        }//end of n for loop


        let mstr = "PCLIST = [";
        for (let x = 0; x < mpcs.length; x++)
        {
            mstr += "{type: " + mpcs[x].type + " color: " + mpcs[x].color;
            mstr += " row: " + mpcs[x].row + " col: " + mpcs[x].col;
            mstr += " move_count: " + mpcs[x].move_count + "}";
            if (x + 1 < mpcs.length) mstr += ", ";
        }
        mstr += "]";
        console.log("mstr = " + mstr);

        //need the user display moves for each type only
        let pawon = false;
        let parsgnd = false;
        let pbrsgnd = false;
        let istied = false;
        let iscomplete = false;
        if (ChessPiece.isAutoStalemate(mpcs, false))
        {
            iscomplete = true;
            istied = true;
        }
        //else;//do nothing

        let resigndfnd = false;
        let mvsstrarr = mvs.map((mymv) => {
            if (resigndfnd)
            {
                cc.logAndThrowNewError("NO COMMANDS CAN BE PRESENT AFTER A RESIGNATION!");
            }
            //else;//do nothing safe to proceed

            if (mymv.cmd_type === "MOVE")
            {
                const useleft = (mymv.dir === "LEFT");
                const usedir = false;
                const promoshstr = "INTO" + ChessPiece.getShortHandType(mymv.promo_piece_type);
                const canpropawn = ChessPiece.canPawnBePromotedAt(mymv.end_row, mymv.end_col,
                    mymv.piece_color, mymv.piece_type);
                const myprostr = (canpropawn ? promoshstr: "");
                return ChessPiece.genLongOrShortHandMoveCommandOnlyString(mymv.piece_color,
                    mymv.piece_type, mymv.start_row, mymv.start_col, mymv.end_row, mymv.end_col,
                    usedir, useleft, true) + myprostr;
            }
            else if (mymv.cmd_type === "CASTLEING")
            {
                const useleft = (mymv.dir === "LEFT");
                return ChessPiece.genLongOrShortHandCastelingCommand(mymv.piece_color, useleft,
                    true);
            }
            else if (mymv.cmd_type === "PAWNING")
            {
                const useleft = (mymv.dir === "LEFT");
                return ChessPiece.genLongOrShortHandPawningCommand(mymv.piece_color,
                    mymv.start_row, mymv.start_col, mymv.end_row, mymv.end_col, useleft, true);
            }
            else if (mymv.cmd_type === "RESIGNATION")
            {
                iscomplete = true;
                if (mymv.piece_color === "WHITE") parsgnd = true;
                else
                {
                    pbrsgnd = true;
                    pawon = true;
                }
                iscomplete = true;
                resigndfnd = true;
                return ChessPiece.genLongOrShortHandResignCommand(mymv.piece_color, true);
            }
            else cc.logAndThrowNewError("INVALID COMMMAND TYPE FOUND AND USED HERE!");
        });
        console.log("mvsstrarr = ", mvsstrarr);

        const fmvsarr = [mstr, ...mvsstrarr];
        console.log("fmvsarr = ", fmvsarr);

        //now that we have the moves and the piece list set
        //we need to create the new game and get the game_ID
        //we also need to add it with two of the same player
        
        const useips = false;
        let mynwvalsobj = {id: 0,
            playera_won: pawon,
            playera_resigned: parsgnd,
            playerb_resigned: pbrsgnd,
            tied: istied,
            completed: iscomplete,
            moves: fmvsarr
        };
        if (useips) mynwvalsobj["ipaddress"] = "127.0.0.1";
        //else;//do nothing
        console.log("mynwvalsobj = ", mynwvalsobj);

        let configobj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(mynwvalsobj)
        };
        fetch("/new_custom_game", configobj).then((res) => res.json())
        .then((mdata) => {
            console.log("mdata = ", mdata);
            //game and user-player object
            //user-player object houses a user and a player object as well as their ids
            //user_id, player_id
            //WHAT WE WANT username, gameid, color, defer
            //let mynwgame = {"username": mdata.user_player.user.name, "id": mdata.game.id,
            //    "color": mdata.user_player.player.color,
            //    "defers": mdata.user_player.player.defers};
            //setpaid(mdata.user_player.player.id);
            //setInitData([...initdata, mynwgame]);
            //setUserPlayerData([...userpdata, mdata.user_player]);
            //setLoaded(true);
            //
            //console.log("CALLING CHECK TO SEE IF GAME GOT JOINED() WITH ID: ", mdata.game.id);
            //checkToSeeIfGameGotJoined(mdata.game.id);

            //open join game now though
            history.push("/join");
        }).catch((merr) => {
            console.error("There was a problem updating the server!");
            console.error(merr);
            setMyErrorMessage("There was a problem updating the server! " + merr);
            //setLoaded(true);
        });
    }


    if (dupfnd) sethaserrs(true);
    if (cc.isStringEmptyNullOrUndefined(merrmsg))
    {
        if (dupfnd);
        else
        {
            if (haserrs) sethaserrs(false);
            //else;//do nothing
        }
    }
    else
    {
        if (haserrs);
        else sethaserrs(true);
    }

    let nomoremoves = false;
    if (cc.isStringEmptyNullOrUndefined(mvs));
    else
    {
        let fndresignation = false;
        for (let x = 0; x < mvs.length; x++)
        {
            if (fndresignation)
            {
                setMyErrorMessage("Found a move after a resignation!");
                sethaserrs(true);
                break;
            }
            //else;//do nothings

            if (mvs[x].cmd_type === "RESIGNATION")
            {
                fndresignation = true;
                nomoremoves = true;
            }
            //else;//do nothing
        }
    }

    let iserr = !(cc.isStringEmptyNullOrUndefined(errmsg) &&
        cc.isStringEmptyNullOrUndefined(merrmsg));//New Piece List
    if (haserrs);
    else iserr = false;
    //style={{ backgroundColor: "cyan", paddingTop: 1 }}
    //style={{ backgroundColor: "red" }}
    return (<div className="pt-1" style={{ backgroundColor: "cyan"}}><h1>New Custom Game Form:</h1>
    <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={addmv} disabled={nomoremoves}>Add Move</button>
        <button type="button" onClick={(event) => {
            setMyErrorMessage("");
            sethaserrs(false);
        }}>Clear Errors</button>
        <input type="submit" value="Submit" disabled={(dupfnd || iserr) && haserrs} />
        {(dupfnd || iserr) ? (<div style={{ backgroundColor: "red" }}>
            {dupfnd ? (<p>Error: Duplicate Location Found!</p>): null}
            {iserr ? (<p>Error: {errmsg}</p>): null}
            {iserr ? (<p>Error: {merrmsg}</p>): null}
        </div>): null}
    </form>
    <button onClick={(event) => history.push("/join")}>Join A Game</button>
    </div>);
}

export default PieceListForm;
