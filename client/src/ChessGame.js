import CommonClass from "./commonclass";
import ChessPiece from "./ChessPiece";
class ChessGame {
	static all = [];
	static cc = new CommonClass();
	constructor(gid, offmvs=null, isdone=false, mclrval="BOTH")
	{
		console.log("INSIDE OF CHESSGAME CONSTRUCTOR!");
		ChessGame.cc.letMustBeBoolean(isdone, "isdone");
		ChessGame.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessGame.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		let numitems = ChessPiece.getNumItemsInList(ChessGame.all);
		if (numitems < 1);
		else
		{
			for (let x = 0; x < numitems; x++)
			{
				if (ChessGame.all[x].getGameID() === gid)
				{
					ChessGame.cc.logAndThrowNewError("there must be only one game with that ID!");
				}
				//else;//do nothing
			}
		}
		this.gameID = gid;
		this.completed = isdone;

		this.lastsetlocmv = null;
		//this.gameID = -1;
		//this.completed = false;
		this.moveindex = -1;
		this.LAST_UNDONE_MOVE = null;
		//this.LAST_REDONE_MOVE = null;
		this.OFFICIAL_MOVES = null;
		this.UNOFFICIAL_MOVE = null;
		this.mycolor = null;
		this.wresigned = false;
		this.bresigned = false;
		this.whitewins = false;
		this.blackwins = false;
		this.istied = false;
		this.whitewantsdraw = false;
		this.blackwantsdraw = false;

		this.setOfficialMoves(offmvs);
		this.setMyColor(mclrval);
		ChessGame.all.push(this);
		console.log(this);
	}
	//constructor(gid, offmvs=null, isdone=false)
	//{
	//	this(gid, offmvs, isdone, "BOTH");
	//}
	//constructor(gid, mclrval="BOTH")
	//{
	//	this(gid, null, false, mclrval);
	//}
	//constructor(gid)
	//{
	//	this(gid, "BOTH");
	//}

	static makeNewChessGameFromColor(gid, mclrval="BOTH")
	{
		return new ChessGame(gid, null, false, mclrval);
	}
	static makeNewChessGameFromMoveList(gid, offmvs=null, isdone=false)
	{
		return new ChessGame(gid, offmvs, isdone, "BOTH");
	}
	static makeNewChessGameFromGID(gid)
	{
		return ChessGame.makeNewChessGameFromColor(gid, "BOTH");
	}
	
	static convertStringArrayToMultidim(sarr)
	{
		return [sarr];
	}
	
	getGameID()
	{
		return this.gameID;
	}
	
	static getGameVIAGID(gid)
	{
		ChessGame.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessGame.cc.logAndThrowNewError("GAME ID must be at least 1!");
		else
		{
			let numitems = ChessPiece.getNumItemsInList(this.all);
			if (numitems < 1);
			else
			{
				for (let x = 0; x < numitems; x++)
				{
					if (this.all[x].getGameID() === gid) return this.all[x];
				}
			}
			//return null;
			ChessGame.cc.logAndThrowNewError("GAME with ID (" + gid + ") not found!");
		}
	}
	getGame()
	{
		return this.getGameVIAGID(this.getGameID());
	}
	
	setMyColor(val)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(val))
		{
			ChessGame.cc.logAndThrowNewError("my color must be BOTH, WHITE, OR BLACK ONLY!");
		}
		else if (val === "WHITE" || val === "BLACK" || val === "BOTH") this.mycolor = "" + val;
		else ChessGame.cc.logAndThrowNewError("my color must be BOTH, WHITE, OR BLACK ONLY!");
	}
	getMyColor()
	{
		let myvalidclrs = ["WHITE", "BLACK", "BOTH"];
		if (ChessPiece.itemIsOnGivenList(this.mycolor, myvalidclrs)) return "" + this.mycolor;
		else ChessGame.cc.logAndThrowNewError("my color must be BOTH, WHITE, OR BLACK ONLY!");
	}
	
	static doesColorAMatchColorB(clrvala, clrvalb)
	{
		ChessPiece.colorIsValid(clrvala);
		ChessPiece.colorIsValid(clrvalb);
		if (clrvala === clrvalb) return true;
		else
		{
			if (((clrvala === "WHITE" || clrvala === "BLACK") && clrvalb === "BOTH") ||
				((clrvalb === "WHITE" || clrvalb === "BLACK") && clrvala === "BOTH"))
			{
				return true;
			}
			else return false;
		}
	}
	doesColorMatchMyColor(clrval)
	{
		return this.doesColorAMatchColorB(clrval, this.getMyColor());
	}
	
	isCompleted()
	{
		return this.completed;
	}
	
	setLastSetLocMove(mvstr)
	{
		if (ChessGame.cc.isItemNullOrUndefined(mvstr)) this.lastsetlocmv = null;
		else this.lastsetlocmv = "" + mvstr;
	}
	getLastSetLocMove()
	{
		return this.lastsetlocmv;
	}
	
	clearOfficalMoves()
	{
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (numofmvs < 1);
		else
		{
			for (let x = 0; x < numofmvs; x++)
			{
				if (ChessGame.cc.isItemNullOrUndefined(this.OFFICIAL_MOVES[x]));
				else if (this.OFFICIAL_MOVES[x].length < 1) this.OFFICIAL_MOVES[x] = null;
				else
				{
					for (let r = 0; r < this.OFFICIAL_MOVES[x].length; r++)
					{
						this.OFFICIAL_MOVES[x][r] = null;
					}
				}
			}
			this.OFFICIAL_MOVES.clear();
		}
	}
	
	static colorsForMovesAlternateMain(myoffmvs)
	{
		let clrs = ChessPiece.getSideColorsForMoves(myoffmvs);
		let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
		ChessGame.cc.letMustBeDefinedAndNotNull(myoffmvs, "myoffmvs")
		if (ChessGame.cc.isItemNullOrUndefined(clrs) || clrs.length != myoffmvs.length)
		{
			ChessGame.cc.logAndThrowNewError("myoffmvs must be the same size as the colors!");
		}
		else
		{
			let mvtps = ChessPiece.getMoveCommandTypes();
			for (let n = 0; n < myoffmvs.length; n++)
			{
				if (clrs[n] === "WHITE" || clrs[n] === "BLACK")
				{
					if (n + 1 < myoffmvs.length)
					{
						console.log("tps[" + n + "] = " + tps[n]);
						
						let fismvcmd = ChessPiece.itemIsOnGivenList(tps[n], mvtps);
						if (fismvcmd);
						else continue;
						
						let needother = false;
						if (clrs[n + 1] === ChessPiece.getOppositeColor(clrs[n]))
						{
							if (fismvcmd && ChessPiece.itemIsOnGivenList(tps[n + 1], mvtps))
							{
								//do nothing
							}
							else needother = true;
						}
						else
						{
							console.log("tps[" + (n + 1) + "] = " + tps[n + 1]);
							let nxtismvcmd = ChessPiece.itemIsOnGivenList(tps[n + 1], mvtps);
							if (fismvcmd && nxtismvcmd)
							{
								ChessGame.cc.logAndThrowNewError("COLORS DO NOT ALTERNATE " +
									"AND MUST!");
							}
							else needother = true;
						}
						
						if (needother)
						{
							let cmpi = -1;
							for (let x = n + 1; x < myoffmvs.length; x++)
							{
								if (tps[x] === "HINTS");
								else
								{
									cmpi = x;
									break;
								}
							}
							if (cmpi < 0 || myoffmvs.length - 1 < cmpi) break;
							//else;//do nothing proceed below
							if (clrs[cmpi] === ChessPiece.getOppositeColor(clrs[n]));
							else
							{
								ChessGame.cc.logAndThrowNewError("COLORS DO NOT ALTERNATE " +
									"AND MUST!");
							}
						}
						//else;//do nothing
					}
					//else;//do nothing
				}
				else ChessGame.cc.logAndThrowNewError("COLOR (" + clrs[n] + ") IS INVALID!");
			}
		}
	}
	colorsForOfficialMovesAlternate()
	{
		ChessGame.colorsForMovesAlternateMain(this.OFFICIAL_MOVES);
	}
	
	static noMovesAfterResigningFromMoves(myoffmvs)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(myoffmvs)) return;
		else
		{
			let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
			if (tps.length === myoffmvs.length);
			else
			{
				ChessGame.cc.logAndThrowNewError("myoffmvs must be the same size as the " +
					"command types!");
			}
			for (let n = 0; n < myoffmvs.length; n++)
			{
				if (tps[n] === "RESIGN")
				{
					if (n + 1 < myoffmvs.length)
					{
						ChessGame.cc.logAndThrowNewError("NO MOVES ALLOWED AFTER RESIGNING!");
					}
					//else;//do nothing
				}
			}//end of n for loop
			//console.log("THERE ARE NO MOVES AFTER RESIGNING OR NO RESIGNATION " +
			//	"AT ALL FOUND (VALID)!");
		}
	}
	noMovesAfterResigning()
	{
		ChessGame.noMovesAfterResigningFromMoves(this.OFFICIAL_MOVES);
	}
	
	//IF NO OFFICIAL MOVES -> WHITE
	//IF THERE ARE OFFICIAL MOVES -> NEXT COLOR WHITE -> BLACK; BLACK -> WHITE;
	//OR ERRORS OUT ON INVALID COLOR
	static getSideTurnFromMoves(myoffmvs)
	{
		//get last side to make an actual move
		//if no side -> return white
		//if a side has return the opposite color side
		let clrs = ChessPiece.getSideColorsForMoves(myoffmvs);
		let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
		if (ChessGame.cc.isStringEmptyNullOrUndefined(clrs) &&
			ChessGame.cc.isStringEmptyNullOrUndefined(tps))
		{
			return "WHITE";
		}
		else if (clrs.length != myoffmvs.length)
		{
			ChessGame.cc.logAndThrowNewError("myoffmvs must be the same size as the colors!");
		}
		else
		{
			let mvtps = ["MOVE", "CASTLEING", "PAWNING", "PROMOTION"];
			let mvi = -1;
			for (let n = 0; n < myoffmvs.length; n++)
			{
				if (ChessPiece.itemIsOnGivenList(tps[n], mvtps)) mvi = n;
				//else;//do nothing
			}
			
			if (mvi < 0 || myoffmvs.length - 1 < mvi) return "WHITE";
			else return ChessPiece.getOppositeColor(clrs[mvi]);
		}
	}
	getSideTurn()
	{
		return ChessGame.getSideTurnFromMoves(this.OFFICIAL_MOVES);
	}
	
	getNumOfficialMoves()
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES)) return 0;
		else return this.OFFICIAL_MOVES.length;
	}
	
	static printAllMoves(mymvs, mvstp)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(mymvs))
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(mvstp)) console.log("NO MOVES!");
			else console.log("NO " + mvstp + " MOVES!");
		}
		else
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(mvstp))
			{
				console.log("THERE ARE " + mymvs.length + " MOVES AND THEY ARE:");
			}
			else console.log("THERE ARE " + mymvs.length + " " + mvstp + " MOVES AND THEY ARE:");
			for (let x = 0; x < mymvs.length; x++)
			{
				if (mymvs[x].length === 1) console.log("" + (x + 1) + ": " + mymvs[x][0]);
				else
				{
					console.log("" + (x + 1) + ":");
					for (let c = 0; c < mymvs[x].length; c++)
					{
						console.log("\t" + (c + 1) + ". " + mymvs[x][c]);
					}
				}
			}
		}
	}
	static printMove(mymv, mvtp)
	{
		ChessGame.printAllMoves(ChessGame.convertStringArrayToMultidim(mymv), mvtp);
	}
	printAllOfficialMoves()
	{
		ChessGame.printAllMoves(this.OFFICIAL_MOVES, "OFFICIAL");
	}
	printUnofficialMove()
	{
		ChessGame.printMove(this.UNOFFICIAL_MOVE, "UNOFFICIAL");
	}
	printLastUndoneMove()
	{
		ChessGame.printMove(this.LAST_UNDONE_MOVE, "LAST UNDONE");
	}
	
	setOfficialMoves(myoffmvs)
	{
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (ChessGame.cc.isItemNullOrUndefined(myoffmvs))
		{
			if (ChessGame.cc.isItemNullOrUndefined(this.OFFICIAL_MOVES));
			else if (numofmvs < 1) this.OFFICIAL_MOVES = null;
			else
			{
				this.clearOfficalMoves();
				this.OFFICIAL_MOVES = null;
			}
		}
		else if (myoffmvs.length < 1)
		{
			if (ChessGame.cc.isItemNullOrUndefined(this.OFFICIAL_MOVES)) this.OFFICIAL_MOVES = [];
			else if (numofmvs < 1);
			else this.clearOfficalMoves();
		}
		else
		{
			//right here validate it
			ChessGame.colorsForMovesAlternateMain(myoffmvs);
			//make sure no commands after resigning
			this.noMovesAfterResigning(myoffmvs, false);
			
			if (ChessGame.cc.isItemNullOrUndefined(this.OFFICIAL_MOVES)) this.OFFICIAL_MOVES = [];
			else if (numofmvs < 1);
			else this.clearOfficalMoves();
			for (let x = 0; x < myoffmvs.length; x++)
			{
				if (ChessGame.cc.isStringEmptyNullOrUndefined(myoffmvs[x]))
				{
					this.OFFICIAL_MOVES.push(null);
				}
				else
				{
					let mynwstrarr = myoffmvs[x].map((mitem) => "" + mitem);
					this.OFFICIAL_MOVES.push(mynwstrarr);
				}
			}
			//this.colorsForOfficialMovesAlternate();
		}
		//this.printAllOfficialMoves();
	}
	
	setUnofficialMove(mymvcmd)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(mymvcmd)) this.UNOFFICIAL_MOVE = null;
		else
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
			{
				this.UNOFFICIAL_MOVE = mymvcmd.map((mitem) => "" + mitem);
			}
			else
			{
				this.printAllOfficialMoves();
				this.printUnofficialMove();
				ChessGame.cc.logAndThrowNewError("YOU NEED TO MAKE THE MOVE OFFICIAL " +
					"FIRST OR CLEAR THE UNOFFICIAL MOVE!");
			}
		}
	}
	clearUnofficialMove()
	{
		this.setUnofficialMove(null);
	}
	
	addOfficialMove(mymvcmd)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(mymvcmd))
		{
			ChessGame.cc.logAndThrowNewError("cannot add an empty or null move to the " +
				"official move list!");
		}
		else
		{
			if (this.isCompleted())
			{
				ChessGame.cc.logAndThrowNewError("cannot add the official because the " +
					"game is already completed!");
			}
			else
			{
				let mycp = mymvcmd.map((mitem) => "" + mitem);
				
				if (ChessGame.cc.isItemNullOrUndefined(this.OFFICIAL_MOVES))
				{
					this.OFFICIAL_MOVES = [];
				}
				//else;//do nothing
				
				this.OFFICIAL_MOVES.push(mycp);
				this.colorsForOfficialMovesAlternate();
				this.noMovesAfterResigning();
				//this.printAllOfficialMoves();
			}
		}
	}
	
	makeUnofficialMoveOfficial()
	{
		if (this.isCompleted())
		{
			ChessGame.cc.logAndThrowNewError("cannot make the unofficial move official " +
				"because the game is already completed!");
		}
		else
		{
			this.addOfficialMove(this.UNOFFICIAL_MOVE);
			this.setUnofficialMove(null);
		}
	}
	
	makeLastOfficialMoveUnofficial()
	{
		//what to do if isCompleted is true?
		//do we allow this to function?
		//if a move ends the game in stalemate, but there was a better move to make
		//for instance checkmate,
		//will it be allowed to undo the position that got it in stalemate and put
		//it in checkmate instead?
		//if (isCompleted())
		
		if (ChessGame.cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES))
			{
				ChessGame.cc.logAndThrowNewError("THERE MUST BE AT LEAST ONE OFFICIAL MOVE!");
			}
			else if (0 < this.OFFICIAL_MOVES.length)
			{
				this.setUnofficialMove(this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1]);
				this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1] = null;
				this.OFFICIAL_MOVES.pop();
				//this.printAllOfficialMoves();
			}
			else ChessGame.cc.logAndThrowNewError("THERE MUST BE AT LEAST ONE OFFICIAL MOVE!");
		}
		else ChessGame.cc.logAndThrowNewError("THE UNOFFICIAL MOVE MUST BE EMPTY!");
	}
	
	setLastUndoneMove(mymvcmd)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(mymvcmd)) this.LAST_UNDONE_MOVE = null;
		else
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(this.LAST_UNDONE_MOVE))
			{
				this.LAST_UNDONE_MOVE = [];//new String[mymvcmd.length];
				for (let n = 0; n < mymvcmd.length; n++)
				{
					this.LAST_UNDONE_MOVE.push("" + mymvcmd[n]);
					console.log("this.LAST_UNDONE_MOVE[" + n + "] = " + this.LAST_UNDONE_MOVE[n]);
				}
			}
			else
			{
				for (let x = 0; x < this.LAST_UNDONE_MOVE.length; x++)
				{
					this.LAST_UNDONE_MOVE[x] = null;
				}
				this.LAST_UNDONE_MOVE = null;
				//ChessGame.cc.logAndThrowNewError("YOU NEED TO CLEAR THE LAST UNDONE MOVE FIRST!");
			}
		}
	}
	
	//if there is an UNOFFICIAL_MOVE use it; OTHERWISE the last OFFICIAL_MOVE will be used
	//then we take the move from above and call the method to undo it and return the result 
	genCommandToUndoLastMadeMove()
	{
		//take the unofficial move
		//UNOFFICIAL_MOVE
		//if it is empty, then get the last official command
		//makeLastOfficialMoveUnofficial()
		//then get the UNOFFICIAL_MOVE
		//then generate the undo command
		let mymv = null;
		if (ChessGame.cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
		{
			if (ChessGame.cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES))
			{
				ChessGame.cc.logAndThrowNewError("No move found!");
			}
			else mymv = this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1];
		}
		else mymv = this.UNOFFICIAL_MOVE;
		return ChessPiece.genUndoMoveToShortHandCommand(mymv);
	}
	
	//returns a copy of the given move
	static genCopyOfStringArray(myinmv)
	{
		if (ChessGame.cc.isStringEmptyNullOrUndefined(myinmv)) return null;
		else return myinmv.map((mitem) => "" + mitem);
	}
	//returns a copy of the LAST_UNDONE_MOVE
	genCommandToRedoLastUndoneMove()
	{
		return ChessGame.genCopyOfStringArray(this.LAST_UNDONE_MOVE);
	}
	//returns a copy of the UNOFFICIAL_MOVE
	genCopyOfUnofficialMove()
	{
		return ChessGame.genCopyOfStringArray(this.UNOFFICIAL_MOVE);
	}
	
	stepForward()
	{
		//TO GO FORWARDS: (MIGHT BE SMART TO START STEP_INDEX AT -1)
		//-INCREASE THE STEP COUNTER/INDEX
		//-GET THE CURRENT MOVE (SET IT AS THE UNOFFICIAL MOVE)
		//-MAKE IT (IT IS ALREADY OFFICIAL, SO DO NOT ADD TO LIST OF OFFICIAL MOVES)
		
		//if (this.isCompleted());
		//else
		//{
		//	ChessGame.cc.logAndThrowNewError("GAME MUST BE COMPLETED IN ORDER TO STEP THROUGH IT!");
		//}

		console.log("OLD moveindex = " + this.moveindex);
		
		this.moveindex++;
		
		console.log("NEW moveindex = " + this.moveindex);
		
		//get the move from list of official moves
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (numofmvs < 1)
		{
			ChessGame.cc.logAndThrowNewError("CANNOT MOVE FORWARD, NO MOVES PROVIDED!");
		}
		else if (this.moveindex < numofmvs)
		{
			ChessPiece.makeLocalShortHandMove(this.OFFICIAL_MOVES[this.moveindex],
				this.getGameID(), false, false,
				ChessPiece.WHITE_MOVES_DOWN_RANKS, true);//isuser, isundo, iswhitedown, isofficial
		}
		else ChessGame.cc.logAndThrowNewError("CANNOT MOVE FORWARD, NO MORE MOVES PROVIDED!");
	}
	
	stepBackward()
	{
		//TO GO BACKWARDS:
		//UNDO THE CURRENT MOVE (PUT ON UNOFFICIAL MOVE, AND THEN UNDO THE UNOFFICIAL MOVE)
		//-COUNTER HAS TO DECREASE,
		//-CLEAR UNOFFICIAL_MOVE.
		//-THEN GET THE PREVIOUS MOVE
		
		if (this.isCompleted());
		else
		{
			ChessGame.cc.logAndThrowNewError("GAME MUST BE COMPLETED IN ORDER TO STEP THROUGH IT!");
		}

		if (this.moveindex < 0) ChessGame.cc.logAndThrowNewError("CANNOT STEP BACKWARD!");
		//else;//do nothing
		
		//get the current move
		//undo it
		//then get the previous move
		//moveindex--;
		//get it
		//then make it
		
		ChessPiece.makeLocalShortHandMove(
			ChessPiece.genUndoMoveToShortHandCommand(this.OFFICIAL_MOVES[this.moveindex]),
			this.getGameID(), false, true,
			ChessPiece.WHITE_MOVES_DOWN_RANKS, true);//isuser, isundo, iswhitedown, isofficial
			
		console.log("OLD moveindex = " + this.moveindex);
		
		this.moveindex--;
		
		console.log("NEW moveindex = " + this.moveindex);
	}
	
	isLastMove()
	{
		if (this.isCompleted());
		else return false;
		
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		//console.log("numofmvs = " + numofmvs);
		//console.log("this.moveindex = " + this.moveindex);
		
		if (this.moveindex < numofmvs) return false;
		else if (this.moveindex === numofmvs) return true;
		else
		{
			ChessGame.cc.logAndThrowNewError("illegal moveindex or total number of moves " +
				"found and used here!");
		}
	}
	
	makeAllGivenOfficialMoves()
	{
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (numofmvs < 1);
		else for (let x = 0; x < numofmvs; x++) this.stepForward();
	}
	
	//NOT DONE WITH THE COMMUNICATE WITH THE SERVER PART YET
	completeGameAndCommunicateWithTheServer(msg)
	{
		this.completed = true;
		this.moveindex = this.OFFICIAL_MOVES.length;
		console.log(msg);
		console.log("GAME IS COMPLETED: " + this.isCompleted());
		this.printAllOfficialMoves();
		
		//make the command
		//add official move then
		//execute it in the game class
		//mark game as completed
		//communicate with the server and tell them that the game is completed and
		//send all the data back
	}
	
	setIsTied(nwval)
	{
		ChessGame.cc.letMustBeBoolean(nwval, "istiednwval");
		if (nwval)
		{
			this.istied = true;
			this.completeGameAndCommunicateWithTheServer("TIE!");
		}
		else this.istied = false;
	}
	isTied()
	{
		return this.istied;
	}
	
	setColorWins(clrval, nwval)
	{
		ChessGame.cc.letMustBeBoolean(nwval, "colorwinsnwval");
		if (ChessGame.cc.isStringEmptyNullOrUndefined(clrval))
		{
			ChessGame.cc.logAndThrowNewError("color cannot be null or empty!");
		}
		else if (clrval === "WHITE") this.whitewins = nwval;
		else if (clrval === "BLACK") this.blackwins = nwval;
		else
		{
			ChessGame.cc.logAndThrowNewError("invalid color (" + clrval + ") found and used here!");
		}
		if (nwval) this.completeGameAndCommunicateWithTheServer("" + clrval + " WINS!");
		//else;//do nothing
	}
	
	setColorResigns(clrval, nwval)
	{
		ChessGame.cc.letMustBeBoolean(nwval, "colorresignsnwval");
		if (ChessGame.cc.isStringEmptyNullOrUndefined(clrval))
		{
			ChessGame.cc.logAndThrowNewError("color cannot be null or empty!");
		}
		else if (clrval === "WHITE") this.wresigned = nwval;
		else if (clrval === "BLACK") this.bresigned = nwval;
		else
		{
			ChessGame.cc.logAndThrowNewError("invalid color (" + clrval + ") found and used here!");
		}
		if (nwval)
		{
			console.log(clrval + " RESIGNED!");
			this.setColorWins(ChessPiece.getOppositeColor(clrval), true);
		}
		//else;//do nothing no resignation made
	}
	
	setColorWantsADraw(clrval, nwval)
	{
		ChessGame.cc.letMustBeBoolean(nwval, "clrdrawval");
		
		if (ChessGame.cc.isStringEmptyNullOrUndefined(clrval))
		{
			ChessGame.cc.logAndThrowNewError("illegal color (" + clrval + ") found and used here!");
		}
		else
		{
			if (clrval === "WHITE") this.whitewantsdraw = nwval;
			else if (clrval === "BLACK") this.blackwantsdraw = nwval;
			else
			{
				ChessGame.cc.logAndThrowNewError("illegal color (" + clrval +
					") found and used here!");
			}
			if (this.whitewantsdraw && this.blackwantsdraw) this.setIsTied(true);
			//else;//do nothing
		}
	}
	setBlackWantsADraw(nwval)
	{
		this.setColorWantsADraw("BLACK", nwval);
	}
	setWhiteWantsADraw(nwval)
	{
		this.setColorWantsADraw("WHITE", nwval);
	}
}

export default ChessGame;
