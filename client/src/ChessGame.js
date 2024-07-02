
import CommonClass from "./commonclass";
class ChessGame {
	static all = [];
	cc = new CommonClass();
	constructor(gid, offmvs, isdone=false, mclrval="BOTH")
	{
		cc.letMustBeBoolean(isdone, "isdone");
		cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		let numitems = ChessPiece.getNumItemsInList(all);
		if (numitems < 1);
		else
		{
			for (let x = 0; x < numitems; x++)
			{
				if (all.get(x).getGameID() === gid)
				{
					throw new Error("there must be only one game with that ID!");
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
		all.add(this);
	}
	constructor(gid, offmvs, isdone)
	{
		this(gid, offmvs, isdone, "BOTH");
	}
	constructor(gid, mclrval="BOTH")
	{
		this(gid, null, false, mclrval);
	}
	constructor(gid)
	{
		this(gid, "BOTH");
	}
	
	
	
	static convertStringArrayToMultidim(sarr)
	{
		let mymvs = [];
		mymvs.push(sarr);
		return mymvs;
	}
	
	getGameID()
	{
		return this.gameID;
	}
	
	static getGame(gid)
	{
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		else
		{
			let numitems = ChessPiece.getNumItemsInList(all);
			if (numitems < 1);
			else
			{
				for (let x = 0; x < numitems; x++)
				{
					if (all[x].getGameID() == gid) return all[x];
				}
			}
			//return null;
			throw new Error("GAME with ID (" + gid + ") not found!");
		}
	}
	getGame()
	{
		return this.getGame(this.getGameID());
	}
	
	setMyColor(val)
	{
		if (cc.isStringEmptyNullOrUndefined(val))
		{
			throw new Error("my color must be BOTH, WHITE, OR BLACK ONLY!");
		}
		else if (val === "WHITE") this.mycolor = "WHITE";
		else if (val === "BLACK") this.mycolor = "BLACK";
		else if (val === "BOTH") this.mycolor = "BOTH";
		else throw new Error("my color must be BOTH, WHITE, OR BLACK ONLY!");
	}
	getMyColor()
	{
		let myvalidclrs = ["WHITE", "BLACK", "BOTH"];
		if (ChessPiece.itemIsOnGivenList(this.mycolor, myvalidclrs)) return "" + this.mycolor;
		else throw new Error("my color must be BOTH, WHITE, OR BLACK ONLY!");
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
		if (cc.isItemNullOrUndefined(mvstr)) this.lastsetlocmv = null;
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
				if (cc.isItemNullOrUndefined(this.OFFICIAL_MOVES[x]));
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
	
	static colorsForMovesAlternate(myoffmvs)
	{
		let clrs = ChessPiece.getSideColorsForMoves(myoffmvs);
		let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
		cc.letMustBeDefinedAndNotNull(myoffmvs, "myoffmvs")
		if (cc.isItemNullOrUndefined(clrs) || clrs.length != myoffmvs.length)
		{
			throw new Error("myoffmvs must be the same size as the colors!");
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
								throw new Error("COLORS DO NOT ALTERNATE AND MUST!");
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
							else throw new Error("COLORS DO NOT ALTERNATE AND MUST!");
						}
						//else;//do nothing
					}
					//else;//do nothing
				}
				else throw new Error("COLOR (" + clrs[n] + ") IS INVALID!");
			}
		}
	}
	colorsForMovesAlternate()
	{
		this.colorsForMovesAlternate(this.OFFICIAL_MOVES);
	}
	
	static noMovesAfterResigning(myoffmvs)
	{
		if (cc.isStringEmptyNullOrUndefined(myoffmvs)) return;
		else
		{
			let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
			if (tps.length == myoffmvs.length);
			else throw new Error("myoffmvs must be the same size as the command types!");
			for (let n = 0; n < myoffmvs.length; n++)
			{
				if (tps[n] === "RESIGN")
				{
					if (n + 1 < myoffmvs.length)
					{
						throw new Error("NO MOVES ALLOWED AFTER RESIGNING!");
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
		this.noMovesAfterResigning(this.OFFICIAL_MOVES);
	}
	
	//IF NO OFFICIAL MOVES -> WHITE
	//IF THERE ARE OFFICIAL MOVES -> NEXT COLOR WHITE -> BLACK; BLACK -> WHITE;
	//OR ERRORS OUT ON INVALID COLOR
	static getSideTurn(myoffmvs, val=false)
	{
		//get last side to make an actual move
		//if no side -> return white
		//if a side has return the opposite color side
		cc.letMustBeBoolean(val, "sideturnnwval");
		let clrs = ChessPiece.getSideColorsForMoves(myoffmvs);
		let tps = ChessPiece.getSideTypesForMoves(myoffmvs);
		if (cc.isStringEmptyNullOrUndefined(clrs) && cc.isStringEmptyNullOrUndefined(tps))
		{
			return "WHITE";
		}
		else if (clrs.length != myoffmvs.length)
		{
			throw new Error("myoffmvs must be the same size as the colors!");
		}
		else
		{
			mvtps = ["MOVE", "CASTLEING", "PAWNING", "PROMOTION"];
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
		return this.getSideTurn(this.OFFICIAL_MOVES);
	}
	
	getNumOfficialMoves()
	{
		if (cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES)) return 0;
		else return this.OFFICIAL_MOVES.length;
	}
	
	printAllMoves(mymvs, mvstp)
	{
		if (cc.isStringEmptyNullOrUndefined(mymvs))
		{
			if (cc.isStringEmptyNullOrUndefined(mvstp)) console.log("NO MOVES!");
			else console.log("NO " + mvstp + " MOVES!");
		}
		else
		{
			if (cc.isStringEmptyNullOrUndefined(mvstp))
			{
				console.log("THERE ARE " + mymvs.length + " MOVES AND THEY ARE:");
			}
			else console.log("THERE ARE " + mymvs.length + " " + mvstp + " MOVES AND THEY ARE:");
			for (let x = 0; x < mymvs.length; x++)
			{
				if (mymvs[x].length == 1) console.log("" + (x + 1) + ": " + mymvs[x][0]);
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
	printMove(mymv, mvtp)
	{
		this.printAllMoves(this.convertStringArrayToMultidim(mymv), mvtp);
	}
	printAllOfficialMoves()
	{
		this.printAllMoves(this.OFFICIAL_MOVES, "OFFICIAL");
	}
	printUnofficialMove()
	{
		this.printMove(this.UNOFFICIAL_MOVE, "UNOFFICIAL");
	}
	printLastUndoneMove()
	{
		this.printMove(this.LAST_UNDONE_MOVE, "LAST UNDONE");
	}
	
	setOfficialMoves(myoffmvs)
	{
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (cc.isItemNullOrUndefined(myoffmvs))
		{
			if (cc.isItemNullOrUndefined(this.OFFICIAL_MOVES));
			else if (numofmvs < 1) this.OFFICIAL_MOVES = null;
			else
			{
				this.clearOfficalMoves();
				this.OFFICIAL_MOVES = null;
			}
		}
		else if (myoffmvs.length < 1)
		{
			if (cc.isItemNullOrUndefined(this.OFFICIAL_MOVES)) this.OFFICIAL_MOVES = [];
			else if (numofmvs < 1);
			else this.clearOfficalMoves();
		}
		else
		{
			//right here validate it
			this.colorsForMovesAlternate(myoffmvs, false);
			//make sure no commands after resigning
			this.noMovesAfterResigning(myoffmvs, false);
			
			if (cc.isItemNullOrUndefined(this.OFFICIAL_MOVES)) this.OFFICIAL_MOVES = [];
			else if (numofmvs < 1);
			else this.clearOfficalMoves();
			for (let x = 0; x < myoffmvs.length; x++)
			{
				if (cc.isStringEmptyNullOrUndefined(myoffmvs[x])) this.OFFICIAL_MOVES.add(null);
				else
				{
					let mynwstrarr = myoffmvs[x].map((mitem) => "" + mitem);
					this.OFFICIAL_MOVES.add(mynwstrarr);
				}
			}
			//this.colorsForMovesAlternate(this.OFFICIAL_MOVES);
		}
		//this.printAllOfficialMoves();
	}
	
	setUnofficialMove(mymvcmd)
	{
		if (cc.isStringEmptyNullOrUndefined(mymvcmd)) this.UNOFFICIAL_MOVE = null;
		else
		{
			if (cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
			{
				this.UNOFFICIAL_MOVE = mymvcmd.map((mitem) => "" + mitem);
			}
			else
			{
				this.printAllOfficialMoves();
				this.printUnofficialMove();
				throw new Error("YOU NEED TO MAKE THE MOVE OFFICIAL FIRST OR CLEAR " +
					"THE UNOFFICIAL MOVE!");
			}
		}
	}
	clearUnofficialMove()
	{
		this.setUnofficialMove(null);
	}
	
	addOfficialMove(mymvcmd)
	{
		if (cc.isStringEmptyNullOrUndefined(mymvcmd))
		{
			throw new Error("cannot add an empty or null move to the official move list!");
		}
		else
		{
			if (this.isCompleted())
			{
				throw new Error("cannot add the official because the game is already completed!");
			}
			else
			{
				let mycp = mymvcmd.map((mitem) => "" + mitem);
				
				if (this.OFFICIAL_MOVES == null) this.OFFICIAL_MOVES = [];
				//else;//do nothing
				
				this.OFFICIAL_MOVES.add(mycp);
				this.colorsForMovesAlternate();
				this.noMovesAfterResigning();
				//this.printAllOfficialMoves();
			}
		}
	}
	
	makeUnofficialMoveOfficial()
	{
		if (this.isCompleted())
		{
			throw new Error("cannot make the unofficial move official because the game " +
				"is already completed!");
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
		
		if (cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
		{
			if (cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES))
			{
				throw new Error("THERE MUST BE AT LEAST ONE OFFICIAL MOVE!");
			}
			else if (0 < this.OFFICIAL_MOVES.length)
			{
				setUnofficialMove(this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1]);
				this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1] = null;
				this.OFFICIAL_MOVES.filter((mitem, indx) => {
					if (indx === this.OFFICIAL_MOVES.length - 1) return false;//not this
					else return true;//keep these
				});
			}
			else throw new Error("THERE MUST BE AT LEAST ONE OFFICIAL MOVE!");
		}
		else throw new Error("THE UNOFFICIAL MOVE MUST BE EMPTY!");
	}
	
	setLastUndoneMove(mymvcmd)
	{
		if (cc.isStringEmptyNullOrUndefined(mymvcmd)) this.LAST_UNDONE_MOVE = null;
		else
		{
			if (cc.isStringEmptyNullOrUndefined(this.LAST_UNDONE_MOVE))
			{
				this.LAST_UNDONE_MOVE = new String[mymvcmd.length];
				for (let n = 0; n < mymvcmd.length; n++)
				{
					this.LAST_UNDONE_MOVE[n] = "" + mymvcmd[n];
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
				//throw new Error("YOU NEED TO CLEAR THE LAST UNDONE MOVE FIRST!");
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
		if (cc.isStringEmptyNullOrUndefined(this.UNOFFICIAL_MOVE))
		{
			if (cc.isStringEmptyNullOrUndefined(this.OFFICIAL_MOVES))
			{
				throw new Error("No move found!");
			}
			else mymv = this.OFFICIAL_MOVES[this.OFFICIAL_MOVES.length - 1];
		}
		else mymv = this.UNOFFICIAL_MOVE;
		return ChessPiece.genUndoMoveToShortHandCommand(mymv);
	}
	
	//returns a copy of the given move
	static genCopyOfStringArray(myinmv)
	{
		let mymv = null;
		if (cc.isStringEmptyNullOrUndefined(myinmv));
		else mymv = myinmv.map((mitem) => "" + mitem);
		return mymv;
	}
	//returns a copy of the LAST_UNDONE_MOVE
	genCommandToRedoLastUndoneMove()
	{
		return this.genCopyOfStringArray(this.LAST_UNDONE_MOVE);
	}
	//returns a copy of the UNOFFICIAL_MOVE
	genCopyOfUnofficialMove()
	{
		return this.genCopyOfStringArray(this.UNOFFICIAL_MOVE);
	}
	
	stepForward()
	{
		//TO GO FORWARDS: (MIGHT BE SMART TO START STEP_INDEX AT -1)
		//-INCREASE THE STEP COUNTER/INDEX
		//-GET THE CURRENT MOVE (SET IT AS THE UNOFFICIAL MOVE)
		//-MAKE IT (IT IS ALREADY OFFICIAL, SO DO NOT ADD TO LIST OF OFFICIAL MOVES)
		
		//if (this.isCompleted());
		//else throw new Error("GAME MUST BE COMPLETED IN ORDER TO STEP THROUGH IT!");
		
		console.log("OLD moveindex = " + this.moveindex);
		
		this.moveindex++;
		
		console.log("NEW moveindex = " + this.moveindex);
		
		//get the move from list of official moves
		let numofmvs = ChessPiece.getNumItemsInList(this.OFFICIAL_MOVES);
		if (numofmvs < 1)
		{
			throw new Error("CANNOT MOVE FORWARD, NO MOVES PROVIDED!");
		}
		else if (this.moveindex < numofmvs)
		{
			ChessPiece.makeLocalShortHandMove(this.OFFICIAL_MOVES[this.moveindex],
				this.getGameID(), false,
				ChessPiece.WHITE_MOVES_DOWN_RANKS, false, true);//isuser, isofficial
		}
		else throw new Error("CANNOT MOVE FORWARD, NO MORE MOVES PROVIDED!");
	}
	
	stepBackward()
	{
		//TO GO BACKWARDS:
		//UNDO THE CURRENT MOVE (PUT ON UNOFFICIAL MOVE, AND THEN UNDO THE UNOFFICIAL MOVE)
		//-COUNTER HAS TO DECREASE,
		//-CLEAR UNOFFICIAL_MOVE.
		//-THEN GET THE PREVIOUS MOVE
		
		if (this.isCompleted());
		else throw new Error("GAME MUST BE COMPLETED IN ORDER TO STEP THROUGH IT!");
		
		if (this.moveindex < 0) throw new Error("CANNOT STEP BACKWARD!");
		//else;//do nothing
		
		//get the current move
		//undo it
		//then get the previous move
		//moveindex--;
		//get it
		//then make it
		
		ChessPiece.makeLocalShortHandMove(
			ChessPiece.genUndoMoveToShortHandCommand(this.OFFICIAL_MOVES[this.moveindex]),
			this.getGameID(), true,
			ChessPiece.WHITE_MOVES_DOWN_RANKS, false, true);//isuser, isofficial
			
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
		else if (this.moveindex == numofmvs) return true;
		else throw new Error("illegal moveindex or total number of moves found and used here!");
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
		cc.letMustBeBoolean(nwval, "istiednwval");
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
		cc.letMustBeBoolean(nwval, "colorwinsnwval");
		if (cc.isStringEmptyNullOrUndefined(clrval))
		{
			throw new Error("color cannot be null or empty!");
		}
		else if (clrval === "WHITE") whitewins = nwval;
		else if (clrval === "BLACK") blackwins = nwval;
		else throw new Error("invalid color (" + clrval + ") found and used here!");
		if (nwval) this.completeGameAndCommunicateWithTheServer("" + clrval + " WINS!");
		//else;//do nothing
	}
	
	setColorResigns(clrval, nwval)
	{
		cc.letMustBeBoolean(nwval, "colorresignsnwval");
		if (cc.isStringEmptyNullOrUndefined(clrval))
		{
			throw new Error("color cannot be null or empty!");
		}
		else if (clrval === "WHITE") this.wresigned = nwval;
		else if (clrval === "BLACK") this.bresigned = nwval;
		else throw new Error("invalid color (" + clrval + ") found and used here!");
		if (nwval)
		{
			console.log(clrval + " RESIGNED!");
			this.setColorWins(ChessPiece.getOppositeColor(clrval), true);
		}
		//else;//do nothing no resignation made
	}
	
	setColorWantsADraw(clrval, nwval)
	{
		cc.letMustBeBoolean(nwval, "clrdrawval");
		
		if (cc.isStringEmptyNullOrUndefined(clrval))
		{
			throw new Error("illegal color (" + clrval + ") found and used here!");
		}
		else
		{
			if (clrval === "WHITE") this.whitewantsdraw = nwval;
			else if (clrval === "BLACK") this.blackwantsdraw = nwval;
			else throw new Error("illegal color (" + clrval + ") found and used here!");
			if (this.whitewantsdraw && this.blackwantsdraw) setIsTied(true);
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
