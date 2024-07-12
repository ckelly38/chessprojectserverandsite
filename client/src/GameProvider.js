import React, {useState, createContext} from "react";
import ChessPiece from "./ChessPiece";
import ChessGame from "./ChessGame";
import CommonClass from "./commonclass";

const GameContext = createContext();

function GameProvider({children})
{
    console.log("INSIDE GAME PROVIDER!");
    let cc = new CommonClass();
    let gid = 1;
    //ChessGame.makeNewChessGameFromColor(gid, "BOTH")
    const [game, setGame] = useState(null);
    const [pieces, setPieces] = useState([]);

    function getPieces()
    {
        return pieces;
    }

    function addPieceToList(mcp)
    {
        console.log("OLD pieces = ", pieces);
        if (cc.isItemNullOrUndefined(mcp))
        {
            cc.logAndThrowNewError("the new piece must not be null or undefined!");
        }
        else setPieces([...pieces, mcp]);
        console.log("ADDED ", mcp);
        console.log("ADDED THE PIECE TO THE LIST!");
    }

    function removePieceFromList(r, c, gid)
    {
        ChessPiece.cc.letMustBeAnInteger(r, "r");
		ChessPiece.cc.letMustBeAnInteger(c, "c");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

        setPieces(pieces.filter((mpc) => {
            if (mpc.getRow() === r && mpc.getCol() === c &&
                mpc.getGameID() === gid)
            {
                console.log("REMOVED ", mpc);
                return false;//remove
            }
            else return true;//keep
        }));
    }

    //need to get the current user

    return (<GameContext.Provider value={{pieces, getPieces, addPieceToList, removePieceFromList,
        game, setGame}}>{children}</GameContext.Provider>);
}

export { GameContext, GameProvider };