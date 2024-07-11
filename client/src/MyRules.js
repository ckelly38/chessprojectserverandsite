import React, { createContext } from "react";
import CommonClass from "./commonclass";

function MyRules()
{
    const cc = new CommonClass();
    return (<div style={{backgroundColor: cc.getBGColorToBeUsed(false, "Rules"),
        paddingTop: 5
    }}>
        THE <b>RULES OF CHESS</b> THAT THIS PROGRAM ENFORCES:<ul>
        <li>The Pieces: <ul>
            <li><b>The Castle or Rook (MALE):</b><ul>
                <li>Can have at most 10 Castles!</li>
                <li><b>Can only move on the same column (up or down) or row (right or left)!</b></li>
                <li>Shares a Special Move with the King called <b>Castleing (below)!</b><ul>
                    <li>You cannot Castle out of Check!</li>
                    <li>You must not be in check nor can any spots in the path of the King put you in Check!</li>
                    <li>The path of your Castle nor can any spots in the path of the Castle expose the Castle!</li>
                    <li>You are not allowed to finish in a spot that allows your King to be in Check nor allows your Castle to be directly attacked!</li>
                    <li>All spots between the Castle and the King must be empty for the side of the King that you want to Castle!</li>
                    <li>You must not have moved your King or the Castle that you want to Castle with!</li>
                </ul>
                </li>
                </ul></li>
            <br />
            <li><b>The King (MALE):</b><ul>
                <li>Each side can only have one King on the board and you only get one for the entire game!</li>
                <li><b>Can only move one square in any direction!</b></li>
                <li>Shares a Special Move with the Castle called <b>Castleing (see above)!</b></li>
                <li>Is the target! Kill this piece! Directly attack it (Check) and prevent the enemy side from moving out of or blocking Check!</li>
                <li>You can also kill the piece directly attacking (Checking) the King to get out of Check!</li>
                <li>You must say Check when you can directly attack your enemy's King!</li>
                </ul></li>
            <br />
            <li><b>The Bishop (MALE):</b><ul>
                <li>Can have at most 10 Bishops!</li>
                <li><b>Can only move on the diagnals!</b></li>
                <li>Has no Special Moves!</li>
                <li>The color square the Bishop starts on White or Black must remain the same for entire durration of the game!</li>
                <li>Since the color square stays the same, it is possible for the game to end in a Stalemate!</li>
            </ul></li>
            <br />
            <li><b>The Queen (FEMALE):</b><ul>
                <li>Is the equivalent of Castle + Bishop - Castleing!</li>
                <li>Can have at most 9 Queens!</li>
                <li>The Queen cannot Castle and has no Special Moves, but it is still considdered <b><u>the most powerful piece.</u></b></li>
                <li><b>The Queen can move like the Castle on the same row (right or left) or column (up or down), and on the diagnals like the Bishop as well!</b></li>
                </ul>
            </li>
            <br />
            <li><b>The Knight (MALE):</b><ul>
                <li>Can have at most 10 Knights!</li>
                <li>Has no Special Moves, but moves uniquely!</li>
                <b>
                    <li>The Knight can move (up or down) 2 and over (left or right) 1. OR</li>
                    <li>The Knight can move (up or down) 1 and over (left or right) 2.</li>
                </b>
                <li>That means that the Knight has at most 8 possible squares it can move to!</li>
                <li>The Queen cannot move like a Knight! So a Knight is often used to capture a Queen!</li>
                </ul>
            </li>
            <br />
            <li><b>The Pawn (UNKNOWN GENDER):</b><ul>
                <li>Can have at most and you start out with 8 Pawns!</li>
                <b>
                    <li>Can only move forward two spots on its first move! But may move forward one spot on the first move!</li>
                    <li>Moves forward one spot on all the other moves!</li>
                    <li>A Pawn can only kill an enemy piece by moving diagnal!</li>
                    <li>A Pawn cannot move backwards ever!</li>
                </b>
                <li>Has 2 Special Moves. One called <b>Promotion</b> and the other called <b>Pawning or En-Passant</b>.</li>
                <ul>
                    <li><b>Promotion</b> occurs when a Pawn reaches the other end of the board farthest from where it started.</li>
                    <li>When a Pawn can be Promoted it can be Promoted into:<ul>
                        <li>a Queen,</li>
                        <li>a Castle,</li>
                        <li>a Bishop, OR</li>
                        <li>a Knight only!</li>
                        </ul>
                    </li>
                    <li><b>Pawning or En-Passant (French for In-Passing)!</b><ul>
                        <li>In Passing means as one person (Pawn) is walking by an enemy, they kill the enemy <b>in one fluid move!</b></li>
                        <li>Pawning: Can only be done by an enemy Pawn where the other Pawn has moved out 2 spots on its first move and landed next to the enemy Pawn already there and waiting!</li>
                        <li>Then to complete it, the enemy Pawn moves diagnally of the Pawn that made its first move and removes it from the board!</li>
                        <li>This must be immediately after a Pawn's first move out 2 spaces!</li>
                        </ul>
                    </li>
                    </ul>
                </ul>
            </li>
            </ul>
        </li>
        
        <p>CHECK:</p>
        
        <li><b><u>You are not allowed to move into Check!</u></b></li>
        <li>When a piece can be directly attacked by an enemy, that piece is in Check! If that piece is the King that is being attacked, then your side is in Check!</li>
        <li>If your side is in Check, you must get out of Check if you can! If you cannot, then it is Checkmate!</li>
        
        <p>GENERAL RULES:</p>

        <li>You cannot kill your own pieces!</li>
        <li>You cannot pass over your own pieces either (exception: Knight)!</li>
        <li>You can only kill enemy pieces if they are in your normal move pattern (with the exception of En-Passant)!</li>
        <li>You can move to empty squares or to squares with an enemy piece (with the exception of En-Passant)! But only to the first enemy piece!</li>
        <li><b>White moves First and then they alternate (White, Black, White, Black, etc.)!</b></li>
        
        <p>SETUP:</p>

        <li>On the End Rows from both ends it goes: Castles, Knights, Bishops, then Queen takes her Color first, then the King.</li>
        <li>On the Row immediately before the End Row, are all Pawns!</li>
        <li>The color of squares alternate from WHITE and BLACK! The same as the turns!</li>
        <li>The WHITE CASTLE on the BOTTOM RIGHT CORNER must be on a WHITE SQUARE!</li>
        <br />
        <textarea id="board-setup-txt-display-only" style={{minHeight: 160, minWidth: 295}} readOnly={true} value={"  0   1   2   3   4   5   6   7  (c)\n  A   B   C   D   E   F   G   H  RANK r\n|BCE|BKT|BBP|BQN|BKG|BBP|BKT|BCE| 8 1 0\n|BPN|BPN|BPN|BPN|BPN|BPN|BPN|BPN| 7 2 1\n|---|---|---|---|---|---|---|---| 6 3 2\n|---|---|---|---|---|---|---|---| 5 4 3\n|---|---|---|---|---|---|---|---| 4 5 4\n|---|---|---|---|---|---|---|---| 3 6 5\n|WPN|WPN|WPN|WPN|WPN|WPN|WPN|WPN| 2 7 6\n|WCE|WKT|WBP|WQN|WKG|WBP|WKT|WCE| 1 8 7"} />


        <p>THE END OF THE GAME:</p>
        
        <li>Both sides are allowed to agree on a Draw! If they agree, the Game Ends in a Tie!</li>
        <li>A Stalemate is a form of Draw!</li>
        <li>Stalemate is not normally your goal because it means you Tied! But if you know you cannot win, and the best you can do is a Tie, then Stalemate is your goal!</li>
        <li>The Game Ends in a <b>Stalemate</b> automatically (Draw By Insufficient Material) if:<ul>
            <li>King vs King!</li>
            <li>King vs King and Bishop!</li>
            <li>King and zero or more Bishops vs King and zero or more Bishops where all Bishops are on the same color square!</li>
            <li>King vs King and Knight!</li>
            <li>If it is your turn, and you have <b>no legal moves</b> (because your pieces cannot move or because you would be moving into Check), then this is a Stalemate!</li>
            <li>There is a case where most of your pieces are blocked, cannot be freed, and yet you can still move and the same for the enemy, this comes down to the free pieces then, if those said free pieces dissolve into any of the above, then it is also a Stalemate!</li>
            <li>NOTE: Some others programs will call it early if the only outcome is Stalemate!</li>
            <li>For Instance: King vs King and Castle is not necessarily a Stalemate, but can be if the King has no other legal moves other than to kill said Castle, then it becomes King vs King!</li>
            </ul>
        </li>
        <br />
        <li>The Game Ends in <b>Checkmate (YOUR GOAL)</b> if:<ul>
            <li>it is your turn,</li>
            <li>your King is in Check,</li>
            <li>and you cannot get out of Check (IE: YOU LOST AND YOUR OPPONENT WON) by:<ul>
                <li>moving your King,</li>
                <li>blocking check, or</li>
                <li>by killing the Checking piece!</li>
                </ul>
            </li>
            </ul>
        </li>
        <br />
        <li>It is possible, but not guaranteed to Checkmate if you have:<ul>
            <li>King vs King and Castle</li>
            <li>King vs King and Queen</li>
            <li>King vs King and two Bishops where both Bishops are on opposite color squares!</li>
            <li>King vs King and two Knights</li>
            <li>King vs King and Bishop and Knight</li>
            <li>King and Bishop vs King and Knight</li>
            <li>King and Bishop vs King and Castle</li>
            <li>King and Bishop vs King and Queen</li>
            <b><li>This is not an all encompassing list!</li>
            <li>Of course it goes without saying: the more power pieces your have on the board, the more likely you are to Checkmate!</li>
            </b>
        </ul>
        </li>
        <br />
        <li>NOTE: There is no timeout! And therefore No timeout vs Insufficient Material (Stalemate, but it is rediculous to begin with)!</li>
        <li>NOTE: There is no maximum amount of moves made without a capture that results in Draw!</li>
        </ul></div>);
}

export default MyRules;
