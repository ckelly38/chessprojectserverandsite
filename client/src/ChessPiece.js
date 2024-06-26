import CommonClass from "./commonclass";
class ChessPiece {
	static validTypes = ["PAWN", "CASTLE", "KNIGHT", "BISHOP", "QUEEN", "KING", "ROOK"];
	static validColors = ["WHITE", "BLACK"];
	static clrs = getSquareColors();
	static ROWCOLMIN = 0;
	static ROWCOLMAX = 7;
	static WHITE_MOVES_DOWN_RANKS = false;
	static cps = [];
	//only one copy so will cause a problem with multiple games
	
	cc = new CommonClass();
	constructor(tp="", clr="", r=-1, c=-1, gid=-1, initmvcnt=0, let addit)
	{
		if (tp == null || clr == null) throw new Error("the given type and color must not be null!");
		this.setRow(r);
		this.setCol(c);
		this.setType(tp.toUpperCase());
		this.setColor(clr.toUpperCase());
		cc.letMustBeAnInteger(initmvcnt, "initmvcnt");
		cc.letMustBelet(addit, "addit");
		cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		else this.gameID = gid;
		if (initmvcnt < 1)
		{
			this.isfirstmove = true;
			this.movecount = 0;
		}
		else
		{
			this.movecount = initmvcnt;
			this.isfirstmove = false;
		}
		if (addit) cps.add(this);
		//else;//do nothing
	}
	constructor(tp="", clr="", r=-1, c=-1, gid=-1, addit)
	{
		this(tp, clr, r, c, gid, 0, addit);
	}
	constructor(tp="", clr="", r=-1, c=-1, gid=-1)
	{
		this(tp, clr, r, c, gid, 0, true);
	}
	constructor(tp="", clr="", loc, gid=-1, addit)
	{
		this(tp, clr, loc[0], loc[1], gid, 0, addit);
	}
	constructor(tp="", clr="", loc, gid=-1)
	{
		this(tp, clr, loc[0], loc[1], gid, 0, true);
	}
	constructor(tp="", clr="", loc, gid=-1, initmvcnt=0, addit)
	{
		this(tp, clr, loc[0], loc[1], gid, initmvcnt, addit);
	}
	constructor(tp="", clr="", r=-1, c=-1, gid=-1, initmvcnt=0)
	{
		this(tp, clr, r, c, gid, initmvcnt, true);
	}
	
	
	getGameID()
	{
		return 0 + this.gameID;
	}
	
	static getGame(gid)
	{
		return ChessGame.getGame(gid);
	}
	getGame()
	{
		return this.getGame(this.getGameID());
	}
	
	static getSideTurnFromGame(gid)
	{
		return this.getGame(gid).getSideTurn();
	}
	getSideTurnFromGame()
	{
		return this.getSideTurnFromGame(this.getGameID());
	}
	
	//NORMAL BOARD SETUP METHOD
    
    static setUpBoard(gid, pawnsonly)
    {
    	cc.letMustBelet(pawnsonly, "pawnsonly");
		cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing safe to proceed
    	
    	//white pawns on row 6 cols 0 through 7
    	//black pawns on row 1 cols 0 through 7
    	for (let x = 0; x < 2; x++)
    	{
    		let r = -1;
    		String clr = "";
    		if (x == 0)
    		{
    			r = 6;
    			clr = "WHITE";
    		}
    		else
    		{
    			r = 1;
    			clr = "BLACK";
    		}
    		for (let c = 0; c < 8; c++)
	    	{
	    		ChessPiece cp = new ChessPiece("PAWN", clr, r, c, gid);
	    		//cps.add(cp);
	    	}
	    	if (pawnsonly);
	    	else
	    	{
	    		let orw = -1;
		    	if (clr.equals("WHITE")) orw = 7;
		    	else orw = 0;
		    	let mvtypes = ChessPiece.getValidTypes();
		    	for (let k = 0; k < mvtypes.length; k++)
		    	{
		    		if (mvtypes[k].equals("PAWN") || mvtypes[k].equals("ROOK")) continue;
		    		else
		    		{
		    			console.log("mvtypes[" + k + "] = " + mvtypes[k]);
		    			let uselft = true;
		    			for (let i = 0; i < 2; i++)
		    			{
		    				if (i == 0);
		    				else uselft = false;
		    				let nwcl = ChessPiece.getSetUpColForType(mvtypes[k], uselft);
		    				//console.log("i = " + i);
		    				//console.log("CREATED NEW PIECE AT (" + orw + ", " + nwcl + ")");
		    				ChessPiece ocp = new ChessPiece(mvtypes[k], clr, orw, nwcl, gid);
		    				//cps.add(ocp);
		    				if (mvtypes[k].equals("KING") || mvtypes[k].equals("QUEEN")) break;
		    			}//end of i for loop
		    		}
		    	}//end of k for loop
	    	}
    	}//end of x for loop
    }
	static setUpBoard(gid)
	{
		setUpBoard(gid, false);
	}
	
	static clearBoard(gid)
	{
		cc.letMustBeAnInteger(gid, "gid");
		let allpcs = this.getAllPiecesWithGameID(gid);
		let numpcs = this.getNumItemsInList(allpcs);
		if (numpcs < 1);
		else
		{
			for (let x = 0; x < allpcs.length; x++)
			{
				this.removePieceAt(allpcs[x].getRow(), allpcs[x].getCol(), gid, true);
			}
			for (let x = 0; x < allpcs.length; x++) allpcs[x] = null;
			let msz = allpcs.length;
			for (let x = 0; x < msz; x++)
			{
				allpcs.pop();
				msz--;
				x--;
			}
			allpcs = null;
		}
	}
	
	static setUpBoard(gid, addpcs)
	{
		//clear the old board
		//now make copies of those add pcs
		//this is the new board
		let numpcs = getNumItemsInList(addpcs);
		if (numpcs < 1);//do nothing
		else
		{
			this.clearBoard(gid);
			
			let mylist = addpcs.map((mitem) => {
				return new ChessPiece(mitem.getType(), mitem.getColor(), mitem.getRow(),
					mitem.getCol(), gid, mitem.getMoveCount(), true);
			});
		}
	}
	
	//PRlet BOARD METHODS
    
    static printBoard(mycps)
    {
    	//for (let c = 0; c < mycps.length; c++) console.log(mycps[c));
    	console.log("mycps.length = " + mycps.length);
    	const myabt = "ABCDEFGH";
    	for (let c = 0; c < 8; c++) System.out.print("  " + c + " ");
    	console.log(" (cols)");
    	for (let c = 0; c < 8; c++) System.out.print("  " + myabt.charAt(c) + " ");
    	console.log("|RK|RW");
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			System.out.print("|");
    			let fndit = false;
    			for (let x = 0; x < mycps.length; x++)
    			{
    				if (mycps[x).getRow() == r && mycps[x).getCol() == c)
    				{
    					//first letter of color, first letter of type, last letter of type
    					String mtp = "" + mycps[x).getType();
    					String mclr = "" + mycps[x).getColor();
    					System.out.print("" + mclr.charAt(0) + mtp.charAt(0) + mtp.charAt(mtp.length - 1));
    					fndit = true;
    					break;
    				}
    				//else;//do nothing
    			}
    			if (fndit);
    			else System.out.print("---");
    		}
    		if (ChessPiece.WHITE_MOVES_DOWN_RANKS) console.log("| " + (r + 1) + "| " + r);
    		else console.log("| " + (8 - r) + "| " + r);
    	}
    }
    static printBoard(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		else printBoard(ChessPiece.getAllPiecesWithGameID(gid));
    }
	printBoard()
	{
		this.printBoard(this.getGameID());
	}
	
	
	//GET ALL PIECES OF A GAME
	
	static getAllPiecesWithGameID(let val)
	{
		if (val < 1) throw new Error("GAME ID must be at least 1!");
		else
		{
			ArrayList<ChessPiece> mycps = null;
			if (this.getNumItemsInList(this.cps) < 1) return null;
			//else;//do nothing
			for (let x = 0; x < this.cps.length; x++)
			{
				if (this.cps[x).getGameID() == val)
				{
					if (mycps == null) mycps = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					mycps.add(this.cps[x));
				}
				//else;//do nothing
			}
			return mycps;
		}
	}
	getAllPiecesWithGameID()
	{
		return this.getAllPiecesWithGameID(this.getGameID());
	}
	
	
	//NOTE: VALID COLORS LIST DOES NOT INCLUDE BOTH
	static getValidTypesOrColors(useclrs)
	{
		cc.letMustBelet(useclrs, "useclrs");
		let marr = null;
		if (useclrs) marr = validColors;
		else marr = validTypes;
		return marr.map((mitem) => "" + mitem);
	}
	static getValidTypes()
	{
		return this.getValidTypesOrColors(false);
	}
	static getValidColors()
	{
		return this.getValidTypesOrColors(true);
	}
	
	static getSetUpColForType(val, uselft)
	{
		cc.letMustBelet(uselft, "uselft");
		cc.letMustBeDefinedAndNotNull(val, "chess piece type");
		
		if (val.equals("CASTLE") || val.equals("ROOK"))
		{
			if (uselft) return 0;
			else return 7;
		}
		else if (val.equals("KNIGHT"))
		{
			if (uselft) return 1;
			else return 6;
		}
		else if (val.equals("BISHOP"))
		{
			if (uselft) return 2;
			else return 5;
		}
		else if (val.equals("QUEEN")) return 3;
		else if (val.equals("KING")) return 4;
		else throw new Error("PAWNS ARE FOUND ON ALL COLS!");
	}
	
	static isGenderKnownForPiece(tp)
	{
		cc.letMustBeDefinedAndNotNull(tp, "tp");
		cc.letMustBeDefinedAndNotNull(validTypes, "validTypes");
		if (cc.itemIsOnGivenList(tp, validTypes));
		else
		{
			throw new Error("tp (" + tp + ") is not a valid chess piece type!");
		}
		
		if (tp.equals("PAWN")) return false;//pawns are either
		else return true;
	}
	isGenderKnownForPiece()
	{
		return this.isGenderKnownForPiece(this.getType());
	}
	//false for female, true for male, ILLEGALSTATE for PAWNS
	static getGenderForPiece(tp)
	{
		cc.letMustBeDefinedAndNotNull(tp, "tp");
		if (this.isGenderKnownForPiece(tp))
		{
			//return the answer
			if (tp.equals("QUEEN")) return false;
			else return true;
		}
		else
		{
			throw new Error("PAWNS ARE CAPABLE OF BOTH GENDERS SO " +
				"GENDER IS UNKNOWN!");
		}
	}
	getGenderForPiece()
	{
		return this.getGenderForPiece(this.getType());
	}
	convertGenderValueToString()
	{
		if (this.isGenderKnownForPiece())
		{
			if (this.getGenderForPiece()) return "MALE";
			else return "FEMALE";
		}
		else return "UNKNOWN";
	}
	
	//GET TYPE AND COLOR METHODS
	
	setTypeOrColor(String val, let useclr)
	{
		let marr = null;
		if (useclr) marr = validColors;
		else marr = validTypes;
		if (this.itemIsOnGivenList(val, marr))
		{
			if (useclr) this.color = "" + val;
			else
			{
				if (val.equals("ROOK")) this.type = "CASTLE";
				else this.type = "" + val;
			}
		}
		else
		{
			String mitemstr = "";
			if (useclr) mitemstr = "COLOR";
			else mitemstr = "TYPE";
			throw new Error("ILLEGAL " + mitemstr + " (" + val +
				") FOUND AND USED HERE!");
		}
	}
	setType(String val)
	{
		this.setTypeOrColor(val, false);
	}
	setColor(String val)
	{
		this.setTypeOrColor(val, true);
	}
	getTypeOrColor(let useclr)
	{
		if (useclr) return "" + this.color;
		else return "" + this.type;
	}
	getType()
	{
		return this.getTypeOrColor(false);
	}
	getColor()
	{
		return this.getTypeOrColor(true);
	}
	static getLongHandType(String tpval)
	{
		if (tpval == null || tpval.length != 2)
		{
			throw new Error("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		}
		else if (tpval.equals("KG")) return "KING";
		else if (tpval.equals("KT")) return "KNIGHT";
		else if (tpval.equals("CE")) return "CASTLE";
		else if (tpval.equals("QN")) return "QUEEN";
		else if (tpval.equals("BP")) return "BISHOP";
		else if (tpval.equals("PN")) return "PAWN";
		else throw new Error("ILLEGAL SHORT HAND TYPE (" + tpval + ") FOUND!");
	}
	static getShortHandType(String tpval)
	{
		if (tpval == null || tpval.length < 1)
		{
			throw new Error("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		}
		else if (itemIsOnGivenList(tpval, this.validTypes))
		{
			if (tpval.equals("ROOK")) return "CE";
			else return "" + tpval.charAt(0) + tpval.charAt(tpval.length - 1);
		}
		else throw new Error("INVALID TYPE (" + tpval + ") FOUND HERE!");
	}
	getShortHandType()
	{
		return this.getShortHandType(this.getType());
	}
	//NOTE: DOES NOT INCLUDE BOTH
	static getShortHandColor(String clrval)
	{
		if (clrval == null || clrval.length < 1)
		{
			throw new Error("NULL OR EMPTY COLOR NOT ALLOWED HERE!");
		}
		else if (this.itemIsOnGivenList(clrval, this.validColors)) return "" + clrval.charAt(0);
		else throw new Error("INVALID COLOR (" + clrval + ") FOUND HERE!");
	}
	getShortHandColor()
	{
		return this.getShortHandColor(this.getColor());
	}
	static getLongHandColor(String clrval)
	{
		if (clrval == null || clrval.length != 1)
		{
			throw new Error("THE COLOR MUST NOT BE NULL!");
		}
		else if (clrval.equals("W")) return "WHITE";
		else if (clrval.equals("B")) return "BLACK";
		else
		{
			throw new Error("INVALID COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}
	}
	//NOTE: DOES NOT INCLUDE BOTH
	static getOppositeColor(String clrval)
	{
		if (clrval == null) throw new Error("THE COLOR MUST NOT BE NULL!");
		else if (clrval.equals("WHITE")) return "BLACK";
		else if (clrval.equals("BLACK")) return "WHITE";
		else
		{
			throw new Error("INVALID COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}
	}
	//throws an exception if the the colors are not valid
	//allows both by default
	static colorIsValid(String clrval, let allowbth)
	{
		if (clrval == null || clrval.length != 5)
		{
			throw new Error("INVALID LENGTH FOR THE COLOR!");
		}
		else
		{
			if (clrval.equals("WHITE") || clrval.equals("BLACK") ||
				(allowbth && clrval.equals("BOTH")))
			{
				//do nothing
			}
			else throw new Error("INVALID COLOR!");
		}
	}
	static colorIsValid(String clrval)
	{
		this.colorIsValid(clrval, true);
	}
	
	
	//MOVE COUNT METHODS
	
	incrementMoveCount()
	{
		this.movecount = this.movecount + 1;
	}
	decrementMoveCount()
	{
		if (0 < this.movecount) this.movecount = this.movecount - 1;
	}
	getMoveCount()
	{
		return this.movecount;
	}
	setMoveCount(let val)
	{
		if (val < 0)
		{
			throw new Error("illegal value found and used for the move count!");
		}
		else this.movecount = val;
	}
	
	static itemIsOnGivenList(String val, let arr)
	{
		if (arr == null || arr.length < 1) return false;
		for (let i = 0; i < arr.length; i++)
		{
			if (val == null)
			{
				if (arr[i] == null) return true;
				//else;//do nothing
			}
			else
			{
				if (arr[i] == null);
				else
				{
					if (val.equals(arr[i])) return true;
					//else;//do nothing
				}
			}
		}
		return false;
	}
	
	public static int[][] transpose(int[][] myarr)
	{
		if (myarr == null) return null;
		else if (myarr.length < 1) return new int[0][myarr.length];
		else
		{
			//console.log("OLD ARRAY:");
			//for (let r = 0; r < myarr.length; r++)
			//{
			//	for (let c = 0; c < myarr[0].length; c++)
			//	{
			//		console.log("myarr[" + r + "][" + c + "] = " + myarr[r][c]);
			//	}
			//}
			
			//console.log("OLD DIMENSIONS: myarr.length = " + myarr.length);
			//console.log("myarr[0].length = " + myarr[0].length);
			
			int[][] resarr = new int[myarr[0].length][myarr.length];
			//console.log("NEW DIMENTIONS: resarr.length = " + resarr.length);
			//console.log("resarr[0].length = " + resarr[0].length);
			
			for (let r = 0; r < myarr.length; r++)
			{
				for (let c = 0; c < myarr[0].length; c++) resarr[c][r] = myarr[r][c];
			}
			
			//console.log("NEW ARRAY:");
			//for (let r = 0; r < resarr.length; r++)
			//{
			//	for (let c = 0; c < resarr[0].length; c++)
			//	{
			//		console.log("resarr[" + r + "][" + c + "] = " + resarr[r][c]);
			//	}
			//}
			//throw new Error("NEED TO CHECK IF THIS WORKS!");
			return resarr;
		}
	}
	
	
	//METHODS FOR GETTING NUM ITEMS IN LIST
	
	static getNumItemsInList(mylist)
	{
		if (cc.isStringEmptyNullOrUndefined(mylist)) return 0;
		else return mylist.length;
	}
	
	
	//SOME LOCATION METHODS
	
	static isvalidrorc(val)
	{
		cc.letMustBeAnInteger(val, "val");
		if (val < ChessPiece.ROWCOLMIN || ChessPiece.ROWCOLMAX < val) return false;
		else return true;
	}
	setRowOrCol(val, let usecol)
	{
		if (this.isvalidrorc(val))
		{
			if (usecol) this.col = val;
			else this.row = val;
		}
		else throw new Error("the value (" + val + ") for the row or column is invalid!");
	}
	setCol(val)
	{
		this.setRowOrCol(val, true);
	}
	setRow(val)
	{
		this.setRowOrCol(val, false);
	}
	
	static getLocString(let rval, let cval)
	{
		return "(row: " + rval + ", col: " + cval + ")";
	}
	static getLocString(int[] loc)
	{
		if (loc == null) return null;
		else if (loc.length != 2)
		{
			throw new Error("illegal loc found and used here!");
		}
		else return this.getLocString(loc[0], loc[1]);
	}
	getLocString()
	{
		return this.getLocString(this.getRow(), this.getCol());
	}
	
	getRowOrCol(let usecol)
	{
		if (usecol) return this.col;
		else return this.row;
	}
	getRow()
	{
		return this.getRowOrCol(false);
	}
	getCol()
	{
		return this.getRowOrCol(true);
	}
	getLoc()
	{
		return [this.getRow(), this.getCol()];
	}
	//by default set the move
	public void setLoc(let rval, let cval, let skipsetmv=false)
	{
		let terr = false;
		if (isvalidrorc(rval) && isvalidrorc(cval))
		{
			//if (usecastling || canMoveToLoc(rval, cval))
			//{
				if (skipsetmv);
				else
				{
					//generate and save the last set loc call
					//WPNA5TOA6
					String mymvcmd = getShortHandColor() + getShortHandType() +
						convertRowColToStringLoc(getRow(), getCol(), WHITE_MOVES_DOWN_RANKS) +
						"TO" + convertRowColToStringLoc(rval, cval, WHITE_MOVES_DOWN_RANKS);
					console.log("SETLOC: mymvcmd = " + mymvcmd);
					getGame().setLastSetLocMove(mymvcmd);
					//console.log("SETLOC: mymvcmd = " + getGame().getLastSetLocMove());
				}
				setRow(rval);
				setCol(cval);
			//}
			//else terr = true;
		}
		else terr = true;
		if (terr) throw new Error("cannot move to new location " + getLocString(rval, cval) + "!");
	}
	setLoc(let rval, let cval)
	{
		this.setLoc(rval, cval, false);
	}
	setLoc(loc, skipsetmv=false)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else this.setLoc(loc[0], loc[1], skipsetmv);
	}
	
	printSquareColors()
	{
		const myabt = "ABCDEFGH";
		for (let r = 0; r < 8; r++)
		{
			if (r == 0)
			{
				for (let c = 0; c < 8; c++) System.out.print("  " + myabt[c] + "   ");
				console.log("");
			}
			for (let c = 0; c < 8; c++) System.out.print(clrs[r][c] + " ");
			console.log((r + 1));
		}
	}
	getSquareColors()
	{
		//D1 is BLACK; D8 is WHITE; H8 is WHITE
		clrs = new String[8][8];
		for (let r = 0; r < 8; r++)
		{
			String sclr = null;
			if (r % 2 == 0) sclr = "WHITE";
			else sclr = "BLACK";
			for (let c = 0; c < 8; c++)
			{
				if (c%2 == 0) clrs[r][c] = "" + sclr;
				else clrs[r][c] = getOppositeColor(sclr);
				//console.log("clrs[" + r + "][" + c + "] = " + clrs[r][c]);
			}
		}
		
		//printSquareColors();
		return clrs;
	}
	static getColorOfLoc(let rval, let cval)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval)) return "" + clrs[rval][cval];
		else throw new Error("rval and cval must be at least 0 and less than 8!");
	}
	static getColorOfLoc(ChessPiece cp)
	{
		if (cp == null) throw new Error("cp is not allowed to be null!");
		else return this.getColorOfLoc(cp.getRow(), cp.getCol());
	}
	
	//CONVERT LOCS METHODS
	
	static locStringIsInCorrectFormat(String mlocstr)
	{
		if (mlocstr == null) throw new Error("the locstring must not be null!");
		else
		{
			if (mlocstr.length == 2);
			else throw new Error("the locstring must be length 2!");
		}
		
		const abet = "ABCDEFGH";
		let fndltr = false;
		let ltri = -1;
		for (let i = 0; i < abet.length; i++)
		{
			if (mlocstr.charAt(0) == abet.charAt(i))
			{
				ltri = i;
				fndltr = true;
				break;
			}
			//else;//do nothing
		}
		if (fndltr);
		else
		{
			throw new Error("the locstr is in the wrong format! " +
				"A letter must be first! If a letter is actually first, then it is " +
				"illegal! If it is legal, then it is not capitalized!");
		}
		
		const dgts = "0123456789";
		let fnddgt = false;
		//allow only 1 through 8 inclusive
		for (let i = 1; i < dgts.length - 1; i++)
		{
			if (dgts.charAt(i) == mlocstr.charAt(1))
			{
				fnddgt = true;
				break;
			}
			//else;//do nothing
		}
		if (fnddgt);
		else
		{
			throw new Error("the locstr is in the wrong format! A digit " +
				"must be last! If a digit is actually last, then it is illegal!");
		}
		return true;
	}
	
	static convertWhiteDownRanksLocToWhiteUpRanksLocString(String dstr)
	{
		this.locStringIsInCorrectFormat(dstr);
		
		//column stays the same
		return "" + dstr[0] + (8 - Integer.parseInt("" + dstr[1]) + 1);
	}
	static convertWhiteUpRanksLocToWhiteDownRanksLocString(String ustr)
	{
		this.locStringIsInCorrectFormat(ustr);
		
		//column stays the same
		return "" + ustr[0] + (Integer.parseInt("" + ustr[1]) + 8 - 1);
	}
	static convertWhiteDownOrUpRanksLocToOther(String mstr, let iswhitedown)
	{
		if (iswhitedown) return this.convertWhiteDownRanksLocToWhiteUpRanksLocString(mstr);
		else return this.convertWhiteUpRanksLocToWhiteDownRanksLocString(mstr);
	}
	
	//iswhitedown (means does white move down ranks) (what white was doing when the given location string was generated)
	//this will convert the location string if iswhitedown is not the same as WHITE_MOVES_DOWN_RANKS
	static convertStringLocToRowCol(String mlocstr, let iswhitedown)
	{
		this.locStringIsInCorrectFormat(mlocstr);
		if (iswhitedown == this.WHITE_MOVES_DOWN_RANKS);
		else
		{
			return this.convertStringLocToRowCol(
				this.convertWhiteDownOrUpRanksLocToOther(mlocstr, iswhitedown), !iswhitedown);	
		}

		const abet = "ABCDEFGH";
		let fndltr = false;
		let ltri = -1;
		for (let i = 0; i < abet.length; i++)
		{
			if (mlocstr[0] === abet[i])
			{
				ltri = i;
				fndltr = true;
				break;
			}
			//else;//do nothing
		}
		if (fndltr);
		else
		{
			throw new Error("the locstr is in the wrong format! A letter must " +
				"be first! If a letter is actually first, then it is illegal! If it is legal, " +
				"then it is not capitalized!");
		}
		
		const dgts = "0123456789";
		let myloc = [];
		if (this.WHITE_MOVES_DOWN_RANKS) myloc.push(Integer.parseInt("" + mlocstr[1]) - 1);
		//number is row
		else myloc.push(8 - Integer.parseInt("" + mlocstr[1]));//number is row
		myloc.push(Integer.parseInt("" + dgts[ltri]));//letter is column
		
		if (this.isvalidrorc(myloc[0]) && this.isvalidrorc(myloc[1]));
		else throw new Error("CONVERSION ERROR! FINAL R AND C ARE NOT VALID!");
		return myloc;
	}
	
	//retwhitedown is WHITE_MOVES_DOWN_RANKS by default
	static convertRowColToStringLoc(let rval, let cval, let retwhitedown)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("R OR C MUST BE VALID!");
		
		const abet = "ABCDEFGH";
		if (retwhitedown) return "" + abet[cval] + "" + (rval + 1);
		else return "" + abet[cval] + "" + (8 - rval);
	}
	static convertRowColToStringLoc(let rval, let cval)
	{
		return this.convertRowColToStringLoc(rval, cval, this.WHITE_MOVES_DOWN_RANKS);
	}
	static convertRowColToStringLoc(int[] mloc, let retwhitedown)
	{
		if (mloc == null || mloc.length != 2)
		{
			throw new Error("the loc array must have two integers on it!");
		}
		else return this.convertRowColToStringLoc(mloc[0], mloc[1], retwhitedown);
	}
	static convertRowColToStringLoc(int[] mloc)
	{
		return this.convertRowColToStringLoc(mloc, this.WHITE_MOVES_DOWN_RANKS);
	}
	
	//if not valid, it just prints it out and does not convert it
	//uses WHITE_MOVES_DOWN_RANKS value
	static getLocStringAndConvertIt(let rval, let cval)
	{
		const lstr =  this.getLocString(rval, cval);
		if ( this.isvalidrorc(rval) &&  this.isvalidrorc(cval))
		{
			return "" + lstr + " " +
				this.convertRowColToStringLoc(rval, cval, this.WHITE_MOVES_DOWN_RANKS);
		}
		else return lstr;
	}
	static getLocStringAndConvertIt(int[] mloc)
	{
		if (mloc == null || mloc.length != 2)
		{
			throw new Error("the loc array must have two integers on it!");
		}
		else return this.getLocStringAndConvertIt(mloc[0], mloc[1]);
	}
	
	static getLocsFromPieceList(allpcs)
	{
		let mxitems = this.getNumItemsInList(allpcs);
		if (mxitems < 1) return null;
		else
		{
			int[][] locs = new int[mxitems][2];
			for (let x = 0; x < mxitems; x++)
			{
				locs[x][0] = allpcs[x].getRow();
				locs[x][1] = allpcs[x].getCol();
			}
			return locs;
		}
	}
	
	static printLocsArray(locs, arrnm, cp)
    {
    	if (cc.isStringEmptyNullOrUndefined(arrnm))
    	{
    		this.printLocsArray(locs, "locs");
    		return;
    	}
    	//else;//do nothing
    	
    	if (cc.isItemNullOrUndefined(locs)) console.log("" + arrnm + " = null");
    	else if (locs.length < 1) console.log("" + arrnm + " is empty!");
    	else
    	{
    		console.log("" + arrnm + ".length = " + locs.length);
    		let iscloc = false;
	    	for (let x = 0; x < locs.length; x++)
	    	{
	    		if (cp == null);
	    		else iscloc = (cp.getRow() === locs[x][0] && cp.getCol() === locs[x][1]);
	    		let msg = "" + this.getLocStringAndConvertIt(locs[x][0], locs[x][1]);
	    		if (iscloc) msg += " (you are here)";
	    		else
	    		{
	    			if (cp == null);
	    			else
	    			{
	    				if (cp.getType().equals("PAWN"))
		    			{
		    				if (this.canPawnBePromotedAt(locs[x][0], locs[x][1],
								cp.getColor(), cp.getType()))
		    				{
		    					msg += " (promotion)";
		    				}
		    				else if (cp.isMoveToASpecialMove(locs[x][0], locs[x][1],
								null, null, false))
		    				{
		    					msg += " (pawning)";
		    				}
		    				//else;//do nothing
		    			}
		    			else if (cp.getType().equals("KING"))
		    			{
		    				if (cp.isMoveToASpecialMove(locs[x][0], locs[x][1],
								null, null, false))
		    				{
		    					msg += " (castleing)";
		    				}
		    				//else;//do nothing
		    			}
		    			//else;//do nothing
	    			}
	    		}
	    		console.log(msg);
	    	}//end of x for loop
    	}
    }
    static printLocsArray(locs, arrnm)
    {
    	this.printLocsArray(locs, arrnm, null);
    }
    static printLocsArray(locs)
    {
    	this.printLocsArray(locs, "locs");
    }
	
	static printOneDIntArray(arr)
	{
		if (cc.isItemNullOrUndefined(arr)) console.log("arr = null!");
		else if (arr.length < 1) console.log("arr is empty!");
		else
		{
			for (let i = 0; i < arr.length; i++)
			{
				console.log("arr[" + i + "] = " + arr[i]);
			}
		}
		console.log();
	}
	
	static printPiecesList(pcs, onelineonly, bfrmsg)
	{
		cc.letMustBelet(onelineonly, "onelineonly");
		if (cc.isItemNullOrUndefined(bfrmsg))
		{
			this.printPiecesList(pcs, onelineonly, "");
			return;
		}
		//else;//do nothing
		
		if (onelineonly) console.log(bfrmsg + "pcs = " + pcs);
		else
		{
			let numpcs = this.getNumItemsInList(pcs);
			if (numpcs < 1) console.log(bfrmsg + "pcs is null or empty!");
			else
			{
				console.log(bfrmsg + "pcs has " + numpcs + " item(s) on it!");
				for (let p = 0; p < numpcs; p++) console.log("pcs[" + p + "] = " + pcs[p]);
			}
		}
	}
	
	
	//METHODS TO GENERATE THE NEW BOARD LIST FROM A LIST OF CHANGES TO THE OLD BOARD
	
	static combineBoardAndIgnoreLists(ignorelist, boardlist)
	{
		if (cc.isStringEmptyNullOrUndefined(boardlist)) return boardlist;
		if (cc.isStringEmptyNullOrUndefined(ignorelist)) return boardlist;
		//both not empty
		let retlist = null;
		for (let x = 0; x < boardlist.length; x++)
		{
			let addit = true;
			for (let r = 0; r < ignorelist.length; r++)
			{
				if (boardlist[x].getRow() === ignorelist[r][0] &&
					boardlist[x].getCol() === ignorelist[r][1])
				{
					addit = false;
					break;
				}
				//else;//do nothing
			}
			if (addit)
			{
				if (cc.isItemNullOrUndefined(retlist)) retlist = [];
				//else;//do nothing
				retlist.push(boardlist[x]);
			}
			//else;//do nothing
		}
		return retlist;
	}
	static combineBoardAndIgnoreLists(ignorelist, gid)
	{
		return this.combineBoardAndIgnoreLists(ignorelist, this.getAllPiecesWithGameID(gid));
	}
	
	static combineBoardAddAndIgnoreLists(ignorelist, addpcs, boardlist)
	{
		//we prioritize the: addlist > ignorelist > boardlist
		//initially start with the add list
		//then if on the add list and ignore list, ignore what is already accounted for, keep what needs to be kept
		//then determine what we can keep on the last one and that is it...
		//then return result.
		let retlist = null;
		if (this.getNumItemsInList(addpcs) < 1);
		else retlist = addpcs.map((mitem) => mitem);
		//console.log("NEW retlist = " + retlist);
		
		if (this.getNumItemsInList(addpcs) < 1)
		{
			retlist = this.combineBoardAndIgnoreLists(ignorelist, boardlist);
		}
		else
		{
			//console.log("RETLIST IS NOT EMPTY!");
			//generate the new ignore list
			//then get the result and add all of that to the retlist
			if (this.getNumItemsInList(ignorelist) < 1)
			{
				//console.log("IGNORELIST IS EMPTY OR NULL!");
				//need to combine board and add list here
				for (let x = 0; x < boardlist.length; x++)
				{
					let addit = true;
					if (retlist == null) retlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					for (let r = 0; r < retlist.length; r++)
					{
						if (boardlist[x].getRow() === retlist[r].getRow() &&
							boardlist[x].getCol() === retlist[r].getCol())
						{
							addit = false;
							break;
						}
						//else;//do nothing
					}
					if (addit) retlist.add(boardlist[x]);
				}
			}
			else
			{
				//console.log("IGNORELIST IS NOT EMPTY!");
				//let keeploc = new let[ignorelist.length];
				//let numrm = 0;
				//for (let x = 0; x < ignorelist.length; x++)
				//{
					//this gets the ignorelist loc
					//now get the other loc to compare it to
				//	keeploc[x] = true;
				//	for (let i = 0; i < retlist.length; i++)
				//	{
				//		if (retlist[i].getRow() == ignorelist[x][0] &&
				//			retlist[i].getCol() == ignorelist[x][1])
				//		{
				//			//do not keep this on the ignore list
				//			//console.log("REMOVING THIS LOCATION FROM THE IGNORE LIST!");
				//			//console.log("ignorelist[" + x + "][0] = " + ignorelist[x][0]);
				//			//console.log("ignorelist[" + x + "][1] = " + ignorelist[x][1]);
				//			keeploc[x] = false;
				//			numrm++;
				//			break;
				//		}
				//		//else;//do nothing
				//	}
				//}
				//console.log("numrm = " + numrm);
				
				let bdiglist = null;
				//if (numrm < 0) throw new Error("numrm must be at least zero!");
				//else if (numrm < 1) bdiglist = combineBoardAndIgnoreLists(ignorelist, boardlist);
				//else
				//{
					//int[][] nwiglist = new int[ignorelist.length - numrm][2];
					//let nwigli = 0;
					//for (let x = 0; x < ignorelist.length; x++)
					//{
					//	if (nwigli < nwiglist.length);
					//	else break;
					//	
					//	if (keeploc[x])
					//	{
					//		nwiglist[nwigli][0] = ignorelist[x][0];
					//		nwiglist[nwigli][1] = ignorelist[x][1];
					//		nwigli++;
					//	}
					//	//else;//do nothing
					//}
					bdiglist = this.combineBoardAndIgnoreLists(ignorelist, boardlist);//nwiglist
				//}
				if (this.getNumItemsInList(bdiglist) < 1);
				else for (let x = 0; x < bdiglist.length; x++) retlist.add(bdiglist[x]);
			}
		}
		//console.log("FINAL retlist = " + retlist);
		return retlist;
	}
	static combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid)
	{
		return this.combineBoardAddAndIgnoreLists(ignorelist, addpcs,
			this.getAllPiecesWithGameID(gid));
	}
	
	//merges the two lists
	static combineIgnoreLists(ilista, ilistb)
	{
		if (ilista == null || ilista.length < 1) return ilistb;
		else if (ilistb == null || ilistb.length < 1) return ilista;
		else
		{
			int[][] midreslist = new int[ilista.length + ilistb.length][2];
			for (let x = 0; x < midreslist.length; x++)
			{
				midreslist[x][0] = -1;
				midreslist[x][1] = -1;
			}
			let midreslisti = 0;
			for (let x = 0; x < ilista.length; x++)
			{
				midreslist[midreslisti][0] = ilista[x][0];
				midreslist[midreslisti][1] = ilista[x][1];
				midreslisti++;
			}
			for (let x = 0; x < ilistb.length; x++)
			{
				if (isLocOnListOfLocs(ilistb[x], midreslist));//do nothing do not add it
				else
				{
					midreslist[midreslisti][0] = ilistb[x][0];
					midreslist[midreslisti][1] = ilistb[x][1];
					midreslisti++;
				}
			}
			int[][] reslist = new int[midreslisti][2];
			for (let x = 0; x < midreslisti; x++)
			{
				reslist[x][0] = midreslist[x][0];
				reslist[x][1] = midreslist[x][1];
			}
			return reslist;
		}
	}
	
	//WILL ONLY USE ONE PIECE FOR A LOCATION IF THEY ARE DIFFERENT TYPES ONLY THE ONE ON LISTA WILL BE USED
	public static ArrayList<ChessPiece> combineTwoPieceLists(ArrayList<ChessPiece> lista, ArrayList<ChessPiece> listb)
	{
		if (getNumItemsInList(lista) < 1) return listb;
		else if (getNumItemsInList(listb) < 1) return lista;
		else
		{
			ArrayList<ChessPiece> alocs = new ArrayList<ChessPiece>();
			for (let x = 0; x < lista.length; x++)
			{
				let addit = false;
				for (let p = 0; p < alocs.length; p++)
				{
					if ((alocs[p].getRow() == lista[x].getRow()) &&
						(alocs[p].getCol() == lista[x].getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.add(lista[x));
				//else;//do nothing
			}
			for (let x = 0; x < listb.length; x++)
			{
				let addit = false;
				for (let p = 0; p < alocs.length; p++)
				{
					if ((alocs[p].getRow() == listb[x].getRow()) &&
						(alocs[p].getCol() == listb[x].getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.add(listb[x]);
				//else;//do nothing
			}
			return alocs;
		}
	}
	
	
	//GET PIECE AT AND IS LOCATION EMPTY METHODS
	
	public static ChessPiece getPieceAt(let rval, let cval, ArrayList<ChessPiece> mpclist)
	{
		if (mpclist == null || mpclist.length < 1);
		else
		{
			for (let x = 0; x < mpclist.length; x++)
			{
				if (mpclist[x].getRow() === rval && mpclist[x].getCol() === cval)
				{
					return mpclist[x];
				}
			}
		}
		//console.log("NO ITEMS FOUND AT: " + getLocString(rval, cval) + "!");
		return null;
	}
	public static ChessPiece getPieceAt(int[] loc, ArrayList<ChessPiece> mpclist)
	{
		if (loc == null || loc.length != 2) throw new Error("the loc array must have two integers on it!");
		else return getPieceAt(loc[0], loc[1], mpclist);
	}
	public static ChessPiece getPieceAt(let rval, let cval, let gid)
	{
		return getPieceAt(rval, cval, getAllPiecesWithGameID(gid));
	}
	public static ChessPiece getPieceAt(int[] mloc, let gid)
	{
		if (mloc == null || mloc.length != 2) throw new Error("the loc array must have two integers on it!");
		else return getPieceAt(mloc[0], mloc[1], gid);
	}
	public ChessPiece getPieceAt(let rval, let cval)
	{
		return getPieceAt(rval, cval, getAllPiecesWithGameID());
	}
	public ChessPiece getPieceAt(int[] mloc)
	{
		if (mloc == null || mloc.length != 2) throw new Error("the loc array must have two integers on it!");
		else return getPieceAt(mloc[0], mloc[1]);
	}
	
	public static let isLocationEmpty(let rval, let cval, ArrayList<ChessPiece> mpclist)
	{
		ChessPiece cp = getPieceAt(rval, cval, mpclist);
		return (cp == null);
	}
	public static let isLocationEmpty(let rval, let cval, let gid)
	{
		ChessPiece cp = getPieceAt(rval, cval, gid);
		return (cp == null);
	}
	//prioritize addpcs list above board list
	public static let isLocationEmpty(let rval, let cval, let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (isLocationEmpty(rval, cval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid))) return true;
		else return false;
	}
	public static let isLocationEmpty(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return isLocationEmpty(loc[0], loc[1], gid);
	}
	public let isLocationEmpty(let rval, let cval)
	{
		return isLocationEmpty(rval, cval, getGameID());
	}
	public let isLocationEmpty(int[] loc)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return isLocationEmpty(loc[0], loc[1], getGameID());
	}
	
	//FILTER METHODS BY COLOR, TYPE, OR BOTH
	
	public static ArrayList<ChessPiece> filterListByColor(ArrayList<ChessPiece> mylist, String clrval)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new Error("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> myretlist = null;
		if (mylist == null || mylist.length < 1) return null;
		else
		{
			for (let x = 0; x < mylist.length; x++)
			{
				if (mylist[x].getColor().equals(clrval))
				{
					if (myretlist == null) myretlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					myretlist.add(mylist[x]);
				}
			}
			return myretlist;
		}
	}
	
	public static ArrayList<ChessPiece> filterListByType(ArrayList<ChessPiece> mylist, String typeval)
	{
		if (itemIsOnGivenList(typeval, validTypes));
		else throw new Error("ILLEGAL TYPE (" + typeval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> myretlist = null;
		if (mylist == null || mylist.length < 1) return null;
		else
		{
			for (let x = 0; x < mylist.length; x++)
			{
				if (mylist[x].getType().equals(typeval))
				{
					if (myretlist == null) myretlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					myretlist.add(mylist[x]);
				}
			}
			return myretlist;
		}
	}
	
	public static ArrayList<ChessPiece> filterListByColorAndType(String typeval, String clrval,
		ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(filterListByType(allpcs, typeval), clrval);
	}
	public static ArrayList<ChessPiece> filterListByColorAndType(String typeval, String clrval, let gid)
	{
		return filterListByColorAndType(typeval, clrval, getAllPiecesWithGameID(gid));
	}
	
	//GET CURRENT SIDE PIECES
	
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(allpcs, clrval);
	}
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		return getCurrentSidePieces(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, let gid)
	{
		return getCurrentSidePieces(clrval, getAllPiecesWithGameID(gid));
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getCurrentSidePieces(getOppositeColor(clrval), allpcs);
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		return getOpposingSidePieces(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, let gid)
	{
		return getOpposingSidePieces(clrval, getAllPiecesWithGameID(gid));
	}
	public ArrayList<ChessPiece> getMySidePieces()
	{
		return getCurrentSidePieces(getColor(), getGameID());
	}
	
	
	//GET ALL OF A CERTAIN TYPE
	
	public static ArrayList<ChessPiece> getAllOfType(String typeval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByType(allpcs, typeval);
	}
	public static ArrayList<ChessPiece> getAllOfType(String typeval, let gid)
	{
		return getAllOfType(typeval, getAllPiecesWithGameID(gid));
	}
	
	
	public static ArrayList<ChessPiece> getAllKings(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("KING", allpcs);
	}
	public static ArrayList<ChessPiece> getAllKings(let gid)
	{
		return getAllKings(getAllPiecesWithGameID(gid));//return getAllOfType("KING", gid);
	}
	public static ArrayList<ChessPiece> getAllCastles(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("CASTLE", allpcs);
	}
	public static ArrayList<ChessPiece> getAllCastles(let gid)
	{
		return getAllCastles(getAllPiecesWithGameID(gid));//return getAllOfType("CASTLE", gid);
	}
	public static ArrayList<ChessPiece> getAllRooks(ArrayList<ChessPiece> allpcs)
	{
		return getAllCastles(allpcs);
	}
	public static ArrayList<ChessPiece> getAllRooks(let gid)
	{
		return getAllCastles(gid);
	}
	public static ArrayList<ChessPiece> getAllQueens(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("QUEEN", allpcs);
	}
	public static ArrayList<ChessPiece> getAllQueens(let gid)
	{
		return getAllQueens(getAllPiecesWithGameID(gid));//return getAllOfType("QUEEN", gid);
	}
	public static ArrayList<ChessPiece> getAllKnights(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("KNIGHT", allpcs);
	}
	public static ArrayList<ChessPiece> getAllKnights(let gid)
	{
		return getAllKnights(getAllPiecesWithGameID(gid));//return getAllOfType("KNIGHT", gid);
	}
	public static ArrayList<ChessPiece> getAllBishops(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("BISHOP", allpcs);
	}
	public static ArrayList<ChessPiece> getAllBishops(let gid)
	{
		return getAllBishops(getAllPiecesWithGameID(gid));//return getAllOfType("BISHOP", gid);
	}
	public static ArrayList<ChessPiece> getAllPawns(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("PAWN", allpcs);
	}
	public static ArrayList<ChessPiece> getAllPawns(let gid)
	{
		return getAllPawns(getAllPiecesWithGameID(gid));//return getAllOfType("PAWN", gid);
	}
	
	
	public static ArrayList<ChessPiece> getAllKnightsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllKnights(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllKnightsOfColor(String clrval, let gid)
	{
		return getAllKnightsOfColor(clrval, getAllKnights(gid));
	}
	public static ArrayList<ChessPiece> getAllKingsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllKings(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllKingsOfColor(String clrval, let gid)
	{
		return getAllKingsOfColor(clrval, getAllKings(gid));
	}
	public static ArrayList<ChessPiece> getAllCastlesOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllCastles(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllCastlesOfColor(String clrval, let gid)
	{
		return getAllCastlesOfColor(clrval, getAllCastles(gid));
	}
	public static ArrayList<ChessPiece> getAllRooksOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getAllCastlesOfColor(clrval, allpcs);
	}
	public static ArrayList<ChessPiece> getAllRooksOfColor(String clrval, let gid)
	{
		return getAllCastlesOfColor(clrval, gid);
	}
	public static ArrayList<ChessPiece> getAllQueensOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllQueens(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllQueensOfColor(String clrval, let gid)
	{
		return getAllQueensOfColor(clrval, getAllQueens(gid));
	}
	public static ArrayList<ChessPiece> getAllBishopsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllBishops(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllBishopsOfColor(String clrval, let gid)
	{
		return getAllBishopsOfColor(clrval, getAllBishops(gid));
	}
	public static ArrayList<ChessPiece> getAllPawnsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllPawns(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllPawnsOfColor(String clrval, let gid)
	{
		return getAllPawnsOfColor(clrval, getAllPawns(gid));
	}
	
	
	//GET CURRENT SIDE KING
	
	public static ChessPiece getCurrentSideKing(String clrval, ArrayList<ChessPiece> allpcs)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new Error("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> mysidepieces = getCurrentSidePieces(clrval, allpcs);
		if (mysidepieces == null || mysidepieces.length < 1) return null;
		else
		{
			for (let x = 0; x < mysidepieces.length; x++)
			{
				if (mysidepieces[x].getType().equals("KING")) return mysidepieces[x];
			}
			return null;
		}
	}
	public static ChessPiece getCurrentSideKing(String clrval, let gid)
	{
		return getCurrentSideKing(clrval, getAllPiecesWithGameID(gid));
	}
	public static ChessPiece getOppositeSideKing(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getCurrentSideKing(getOppositeColor(clrval), allpcs);
	}
	public static ChessPiece getOppositeSideKing(String clrval, let gid)
	{
		return getOppositeSideKing(clrval, getAllPiecesWithGameID(gid));
	}
	public ChessPiece getMySideKing()
	{
		if (getType().equals("KING")) return this;
		else return getCurrentSideKing(getColor(), getGameID());
	}
	
	
	//IS BOARD VALID METHODS
	
	public static let getCountForPieceTypeForASide(int[] pccnts, String tpval)
	{
		if (tpval == null || tpval.length < 1) throw new Error("illegal type found and used here!");
		//else;//do nothing
		if (pccnts == null || pccnts.length == 0) return 0;
		else if (pccnts.length != 6) throw new Error("illegal counts found and used here!");
		//else;//do nothing
		
		const mytps = ["KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"];//ROOK
		let tpi = -1;
		for (let i = 0; i < mytps.length; i++)
		{
			let fndit = false;
			if ((mytps[i].equals("CASTLE") && tpval.equals("ROOK")) || (mytps[i].equals(tpval))) fndit = true;
			//else;//do nothing
			
			if (fndit)
			{
				tpi = i;
				break;
			}
			//else;//do nothing
		}
		if (tpi < 0 || mytps.length - 1 < tpi) throw new Error("illegal type found and used here!");
		//else;//do nothing
		if (pccnts[tpi] < 0 || 10 < pccnts[tpi]) throw new Error("illegal count found and used here!");
		else return pccnts[tpi];
	}
	
	public static int[] getCountsForEachPieceTypeForASide(let pcstpcs)
	{
		if (pcstpcs == null) throw new Error("there must be pieces on the list!");
		//else;//do nothing
		
		//king, queen, castle (rook), bishop, knight, pawn
		int[] pccnts = new int[6];
		const mytps = ["KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"];//ROOK
		const maxallowed = [1, 9, 10, 10, 10, 8];
		const startamt = [1, 1, 2, 2, 2, 8];
		for (let ci = 0; ci < 6; ci++)
		{
			pccnts[ci] = 0;
			for (let x = 0; x < pcstpcs.length; x++)
			{
				if (ci == 2 && (pcstpcs[x].equals("ROOK") || pcstpcs[x].equals("CASTLE")))
				{
					//count it
					pccnts[ci] = pccnts[ci] + 1;
				}
				else if (pcstpcs[x].equals(mytps[ci]))
				{
					//count it
					pccnts[ci] = pccnts[ci] + 1;
				}
				//else;//do nothing
			}
			//make sure the board is valid
			if (pccnts[ci] < 0 || maxallowed[ci] < pccnts[ci])
			{
				throw new Error("illegal number of pieces found on the board!");
			}
			//else;//do nothing
			if (ci == 0)
			{
				if (pccnts[ci] == maxallowed[ci]);
				else throw new Error("illegal number of kings found on the board!");
			}
			//else;//do nothing
		}
		//make sure the board is valid
		let ttl = 0;
		for (let ci = 0; ci < 6; ci++) ttl += pccnts[ci];
		if (ttl < 1 || 16 < ttl)
		{
			throw new Error("illegal total number of side pieces (" + ttl + ") found on the board!");
		}
		//else;//do nothing
		int[] diffstart = new int[6];
		//actual amount - start amount; diff < 0 when actual < start; 0 < diff when start < actual
		for (let ci = 0; ci < 6; ci++) diffstart[ci] = pccnts[ci] - startamt[ci];
		let numusdpns = 0;
		for (let ci = 0; ci < 6; ci++)
		{
			if (diffstart[ci] < -8 || 8 < diffstart[ci])
			{
				throw new Error("illegal diff (" + diffstart[ci] + ") found and used here!");
			}
			//else;//do nothing
			if (ci == 0)
			{
				if (diffstart[ci] == 0);
				else throw new Error("illegal number of kings found on the board!");
			}
			else
			{
				if (0 < diffstart[ci]) numusdpns += diffstart[ci];
				//else;//do nothing
			}
		}
		//console.log("numusdpns = " + numusdpns);
		//console.log("pccnts[" + 5 + "] = " + pccnts[5]);
		if (numusdpns + pccnts[5] < 0 || 8 < numusdpns + pccnts[5])
		{
			throw new Error("illegal number of used pawns pieces (" + numusdpns +
				") with " + pccnts[5] + " pawn(s) found on the board!");
		}
		//else;//do nothing
		return pccnts;
	}
	
	public static let getPieceTypes(ArrayList<ChessPiece> allpcs)
	{
		if (allpcs == null) return null;
		else
		{
			let wpcstps = new String[allpcs.length];
			for (let x = 0; x < wpcstps.length; x++) wpcstps[x] = allpcs[x].getType();
    		return wpcstps;
		}
	}
	
	static isThereTwoPiecesAtOneLocation(allpcs)
	{
		let numallpcs = this.getNumItemsInList(allpcs);
		if (numallpcs < 2) return false;
		else
		{
			let allocs = this.getLocsFromPieceList(allpcs);
			for (let x = 0; x < allocs.length; x++)
			{
				for (let c = x + 1; c < allocs.length; c++)
				{
					if (allocs[x][0] === allocs[c][0] &&
						allocs[x][1] === allocs[c][1])
					{
						console.log(allpcs[x]);
						console.log(allpcs[c]);
						return true;
					}
					//else;//do nothing
				}
			}
		}
		return false;
	}
	
	//THIS CANNOT TELL IF THE SET UP IS ILLEGAL OR NOT OR RATHER IT CANNOT TELL IF IT IS POSSIBLE OR NOT
	//IT CAN TELL IF THERE ARE AN ILLEGAL NUMBER OF PIECES ON THE BOARD
	static isBoardValid(allpcs)
	{
		//each side must have at most 16 pieces total one of which must be a king
		//there are only 8 pawns so at most 8 pawns plus one of each
		//the most we can have of any one piece excluding kings and pawns is 9
		//at most 1 king, 8 pawns, 9 of the others per side.
		//if we have 9 of one we will have no pawns.
		
		if (this.isThereTwoPiecesAtOneLocation(allpcs))
		{
			throw new Error("THERE ARE TWO PIECES AT A LOCATION!");
		}
		//else;//do nothing
		
		//the # of pawns on the board will be minus one for every one more of another type.
		let wpcs = this.filterListByColor(allpcs, "WHITE");
		let bpcs = this.filterListByColor(allpcs, "BLACK");
		let wpcstps = this.getPieceTypes(wpcs);
		let bpcstps = this.getPieceTypes(bpcs);
		try
		{
			let wpctpscnts = this.getCountsForEachPieceTypeForASide(wpcstps);
		}
		catch(Exception ex)
		{
			throw new Error("ILLEGAL NUMBER OF WHITE PIECES FOUND ON THE BOARD!", ex);
		}
		try
		{
			let bpctpscnts = this.getCountsForEachPieceTypeForASide(bpcstps);
		}
		catch(Exception ex)
		{
			throw new Error("ILLEGAL NUMBER OF BLACK PIECES FOUND ON THE BOARD!", ex);
		}
		return true;
	}
	static isBoardValid(let gid)
	{
		return this.isBoardValid(this.getAllPiecesWithGameID(gid));
	}
	
	
	//HOW TO REMOVE PIECES?
	//WE NEED TO REMOVE THEM FROM THE LIST OF PIECES.
	//WE NEED TO MAKE THEIR REFERENCES BE NULL.
	static removePieceAt(let rval, let cval, let gid, let clearboardcalled=false)
	{
		if (clearboardcalled);
		else this.isBoardValid(gid);
		let numpcs = this.getNumItemsInList(this.cps);
		if (numpcs < 1);
		else
		{
			for (let x = 0; x < numpcs; x++)
			{
				if (cps[x].getRow() === rval && cps[x].getCol() === cval &&
					cps[x].getGameID() === gid)
				{
					console.log("REMOVED " + cps[x]);
					cps.remove(cps[x]);
					numpcs--;
					x--;
				}
				//else;//do nothing
			}
		}
	}
	static removePieceAt(int[] loc, let gid, let clearboardcalled)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else this.removePieceAt(loc[0], loc[1], gid, clearboardcalled);
	}
	static removePieceAt(int[] loc, let gid)
	{
		this.removePieceAt(loc, gid, false);
	}
	
	
	//NEED TO KNOW WHOSE TURN IT IS AND
	//NEED TO PREVENT THE OTHER SIDE FROM MOVING UNTIL WE TELL THEM IT IS THEIR TURN
	//NEED A WAY TO COMMUNICATE WITH MY SERVER:
	//NEED A WAY TO TELL THE OTHER COMPUTER: IT IS THEIR TURN, WHAT MOVES WERE MADE, AND HOW THE GAME ENDS,
	//WHAT TO DO AFTER THE GAME ENDS?
	
	
	//HOW TO STEP THROUGH A COMPLETED GAME (ONLY COMPLETED GAMES):
	//WHAT DOES BACK AND NEXT DO? INCREASE OR DECREASE THE STEP_COUNTER/INDEX.
	//
	//TO GO BACKWARDS: (DONE)
	//UNDO THE CURRENT MOVE (PUT ON UNOFFICIAL MOVE, AND THEN UNDO THE UNOFFICIAL MOVE)
	//-COUNTER HAS TO DECREASE,
	//-CLEAR UNOFFICIAL_MOVE.
	//-THEN GET THE PREVIOUS MOVE
	//
	//TO GO FORWARDS: (MIGHT BE SMART TO START STEP_INDEX AT -1) (DONE)
	//-INCREASE THE STEP COUNTER/INDEX
	//-GET THE CURRENT MOVE (SET IT AS THE UNOFFICIAL MOVE)
	//-MAKE IT (IT IS ALREADY OFFICIAL, SO DO NOT ADD TO LIST OF OFFICIAL MOVES)
	
	//TO UNDO AN UNOFFICIAL_MOVE:
	//TAKE THE UNOFFICIAL_MOVE AND UNDO IT (DO THE OPPOSITE)
	//AND PUT IT ON LAST_UNDONE_MOVE
	
	//TO UNDO AN OFFICIAL MOVE:
	//MAKE IT THE UNOFFICIAL_MOVE
	//CLEAR LAST_REDONE_MOVE (N/A).
	
	//TO REDO AN UNDONE MOVE:
	//TAKE THE LAST_UNDONE_MOVE AND MAKE IT THE UNOFFICIAL_MOVE
	//THEN MAKE THE UNOFFICIAL_MOVE AND
	//CLEAR LAST_UNDONE_MOVE
	
	//TO MAKE AN UNOFFICIAL_MOVE OFFICIAL:
	//ADD IT TO THE LIST_OF_OFFICIAL_MOVES.
	//CLEAR LAST_REDONE_MOVE (N/A).
	
	
	//WHEN WE EXECUTE COMMANDS,
	//WE CAN STORE THE COMMANDS IN A LIST...
	//HINTS COMMANDS DO NOT NEED TO BE STORED, BECAUSE THEY ARE EXECUTE ONLY, YOU CANNOT UNDO Hlet COMMANDS
	
	
	//BEFORE WE ADVANCE TO THE OTHER SIDE'S TURN:
	//MAKE THE UNOFFICIAL_MOVE OFFICIAL
	//IF THEY ARE IN CHECK AND THE UNOFFICIAL_MOVE DID NOT MOVE THEM OUT OF CHECK ASK IF THEY WANT TO SURRENDER OR UNDO?
	//IF THEY CHOOSE SURRENDER: CHECKMATE! OTHER SIDE WINS!
	//IF THEY CHOOSE UNDO: NEED TO LET THEM MOVE THEN RE-ENTER THIS METHOD.
	//WE NEED TO CHECK TO SEE IF THE CURRENT SIDE KING IS STILL IN CHECK() IF SO, END GAME IMMEDIATELY CHECKMATE!
	//CHECK TO SEE IF THE GAME ENDS IN AN AUTO-STALEMATE
	//NOTE: PAWN PROMOTION TAKEN CARE OF WITH GEN MOVE TO COMMAND METHOD!!!
	//--WE NEED TO CHECK TO SEE IF THERE ARE PAWNS FOR THAT SIDE THAT HAVE MADE IT TO THE OTHER SIDE AND (DONE)
	//--NEED PROMOTED AND TO PROMOTE THEM (DONE)
	//IF THE GAME HAS NOT ENDED, THEN WHAT????
	
	static advanceTurnIfPossible(String sidemoved, let gid, let undoifincheck,
		let isuser, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//make sure the side that just moved is not in check
		//if they are in check and it can be undone undo it
		//if they choose surrender, ends the game
		//check to see if it is checkmate
		
		//NUM OFFICIAL MOVES WILL BE AT LEAST ONE!
		this.getGame(gid).makeUnofficialMoveOfficial();
		
		if (this.isSideInCheck(sidemoved, ignorelist, addpcs, gid))
		{
			if (undoifincheck)
			{
				console.log(getGame(gid).getSideTurn() + "'S TURN BEFORE UNDO!");
				
				//force the undo command on the last made move
				//undo it
		    	let myounmv = this.genFullMoveCommandFromDisplayedCommand("UNDO", gid);
		    	//console.log("MY UNDO MOVE:");
		    	this.convertAllShortHandMovesToLongVersion(myounmv);
		    	
		    	this.getGame(gid).makeLastOfficialMoveUnofficial();
		    	
		    	this.makeLocalMove(myounmv, gid, true, this.WHITE_MOVES_DOWN_RANKS, isuser);
		    	this.printBoard(gid);
		    	console.log(this.getGame(gid).getSideTurn() + "'S TURN!");
				
				//then done with this method for the moment so return
				console.log("UNDID THE MOVE, NOT READY TO ADVANCE TURNS YET!");
				//return;
			}
			else
			{
				//surrender unless checkmate
				if (this.inCheckmate(sidemoved, ignorelist, addpcs, gid))
				{
					this.getGame(gid).setColorWins(this.getOppositeColor(sidemoved), true);
				}
				else this.getGame(gid).setColorResigns(sidemoved, true);
			}
		}
		else
		{
			//if is checkmate -> end the game instead
			//if is stalemate -> end the game instead
			//else just advance the turn -> not over
			
			if (this.inCheckmate(this.getOppositeColor(sidemoved), ignorelist, addpcs, gid))
			{
				this.getGame(gid).setColorWins(sidemoved, true);
			}
			else
			{
				if (this.isStalemate(sidemoved, ignorelist, addpcs, gid))
				{
					this.getGame(gid).setIsTied(true);
				}
				else
				{
					//not sure what to do here?
					//WE HAVE JUST MOVED
					//THE MOVE DOES NOT RESULT IN THE END OF THE GAME
					//WHAT TO DO NOW?
					//GOAL: PREVENT CURRENT SIDE FROM MOVING UNTIL WE SAY SO.
					//WHAT WE NEED: TO KNOW THE OTHER SIDE'S MOVE.
					//THE SERVER SENDS US THE OTHER SIDE'S MOVE.
					//THEN IT MAKES IT ON THIS END...
					
					//PREVENT THE USER FROM EXECUTING COMMANDS FOR THE OTHER SIDE
					//
					//SEND THE COMMAND MADE AND YOUR SIDE TURN
					//BLACK'S TURN AFTER: OR WHITE WINS AFTER: OR TIE AFTER:
					//[THE, MOVE, MADE]
					//
					//NOW START THE THREAD THAT LISTENS FOR THEIR MOVE
					
					//if board is both colors, do not send any commands
					//if server, do not send any commands
					if (!isuser || this.getGame(gid).getMyColor().equals("BOTH"));
					else
					{
						//send commands...
					}
					console.log(this.getGame(gid).getSideTurn() + "'S TURN!");
				}
			}
		}
	}
	static advanceTurnIfPossible(String sidemoved, let gid, let undoifincheck,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		this.advanceTurnIfPossible(sidemoved, gid, undoifincheck,
			this.getGame(gid).doesColorMatchMyColor(sidemoved), ignorelist, addpcs);
	}
	static advanceTurnIfPossible(String sidemoved, let gid, let undoifincheck, let isuser)
	{
		this.advanceTurnIfPossible(sidemoved, gid, undoifincheck, isuser, null, null);
	}
	static advanceTurnIfPossible(String sidemoved, let gid, let isuser)
	{
		this.advanceTurnIfPossible(sidemoved, gid, true, isuser);
	}
	static advanceTurnIfPossible(String sidemoved, let gid)
	{
		this.advanceTurnIfPossible(sidemoved, gid, true,
			this.getGame(gid).doesColorMatchMyColor(sidemoved));
	}
	static advanceTurnIfPossible(let gid, let isuser)
	{
		//get the color of the unofficial move before it is official
		let myoffmvcp = this.getGame(gid).genCopyOfUnofficialMove();
		let mymvscp = [];
		mymvscp.push(myoffmvcp);
		let clrsmvs = this.getSideColorsForMoves(mymvscp);
		this.advanceTurnIfPossible(clrsmvs[0], gid, isuser);
	}
	
	
	//CHECKMATE: ONE SIDE IS IN CHECK AND CANNOT GET OUT OF IT
	//THEY CANNOT BLOCK CHECK, THEY CANNOT MOVE OUT OF CHECK, AND THEY CANNOT KILL THE CHECKING PIECE
	
	
	//STALEMATE: IS WHEN A SIDE HAS NO LEGAL MOVES. RULE: YOU CANNOT MOVE INTO CHECK!!!
	//
	//AUTO-STALEMATE:
	//ANY ONE OF THESE SITUATIONS OCCURS THE OTHERSIDE COULD HAVE ONE OF THESE
	//KING VS KING, KING AND KNIGHT VS KING
	//KING AND ANY NUMBER OF BISHOPS VS KING AND ANY NUMBER OF BISHOPS WHERE ALL THE BISHOPS ARE ON THE SAME COLOR SQUARES
	//KING AND PAWNS VS KING AND PAWNS (NO FREE PAWNS, ABILITY TO ALL BE BLOCKED AND REMAIN THAT WAY) -> (KING VS KING)
	//
	//DEBATE SURROUNDING THIS: KING AND 2 KNIGTS AND NO OPPOSING PAWNS VS KING (CHECK MATE IS POSSIBLE, BUT CANNOT BE FORCED)
	//KING AND (KNIGHT OR BISHOP) VS KING AND (KNIGHT OR BISHOP) CHECK MATE IS POSSIBLE, BUT CANNOT BE FORCED
	//
	//HOWEVER IF THERE IS A QUEEN ON THE BOARD OR A CASTLE, YOU WILL BE ABLE TO FORCE CHECKMATE
	
	
	//THE OVERALL GOAL OF THE NEXT SET OF METHODS IS TO DETERMINE WHAT PIECES CAN ATTACK A LOCATION
	//
	//NEED TO KNOW WHAT LOCATIONS CAN BE ATTACKED BY THE OPPOSITE SIDE. (DONE)
	//NEED TO KNOW IF EXCLUDING CERTAIN PIECIES EFFECT IT. (DONE)
	//NEED TO KNOW IF ADDING CERTAIN PIECES AT CERTAIN SPOTS EFFECT IT. (DONE)
	//
	//WE NEED TO KNOW HOW ADDING A PIECE AT CERTAIN SPOTS AND IGNORING OTHERS AT CERTAIN SPOTS EFFECT THIS?
	//WE DO NOT WANT THE NEW PIECE(S) TO BE ON THE BOARD!!!
	//WE ALSO DO NOT WANT IT TO BE ADDED TO THE LIST OF OFFICIAL CHESS PIECES!!!
	//WE HAVE A LIST OF PIECES ON THE BOARD
	//WE CAN TELL THE ALGORITHM TO IGNORE SOME OF THEM WHEN SEARCHING FOR GUARDING LOCATIONS
	//WE WANT TO BE ABLE TO TELL THAT SAME ALGORITHM THAT SOME NEW PIECES ARE AT A CERTAIN LOCATION
	//WE WANT TO KEEP THE RETURN TYPE THE SAME!
	//TELL THE CONSTRUCTOR NOT TO ADD IT SO IT WILL THINK IT IS NOT ON THE BOARD
	
	
	//NOTE: THE IS LOCATION GUARDED METHODS ARE NOT AS ACCURATE AS THE GET PIECES GUARDING LOCATION METHODS
	
	static getAllPossibleKnightMoveToLocs(let rval, let cval)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		
		int[][] pklocs = new int[8][2];
		pklocs[0][0] = rval - 2;
		pklocs[0][1] = cval - 1;
		
		pklocs[1][0] = rval - 2;
		pklocs[1][1] = cval + 1;
		
		pklocs[2][0] = rval + 2;
		pklocs[2][1] = cval - 1;
		
		pklocs[3][0] = rval + 2;
		pklocs[3][1] = cval + 1;
		
		pklocs[4][0] = rval - 1;
		pklocs[4][1] = cval - 2;
		
		pklocs[5][0] = rval - 1;
		pklocs[5][1] = cval + 2;
		
		pklocs[6][0] = rval + 1;
		pklocs[6][1] = cval - 2;
		
		pklocs[7][0] = rval + 1;
		pklocs[7][1] = cval + 2;
		
		return pklocs;
	}
	static getAllPossibleKnightMoveToLocs(int[] loc)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getAllPossibleKnightMoveToLocs(loc[0], loc[1]);
	}
	
	
	//IF THE ALL PIECES LIST IS EMPTY RETURNS FALSE.
	static isPieceAtLocationOnAListOfTypes(let rval, let cval, let mtypes, ArrayList<ChessPiece> allpcs)
	{
		//console.log("INSIDE OF IS PIECE AT LOCATION ON A LIST OF TYPES WITH LOCATION: " +
		//	this.getLocString(rval, cval));
		//console.log("allpcs = " + allpcs);
		//System.out.print("mtypes = [");
		//for (let x = 0; x < mtypes.length; x++)
		//{
		//	System.out.print('"' + mtypes[x] + '"');
		//	if (x + 1 < mtypes.length) System.out.print(", ");
		//}
		//console.log("]");
		
		if (this.getNumItemsInList(allpcs) < 1);//no items on the add pieces list
		else
		{
			//console.log("INSIDE ELSE STATEMENT!");
			for (let x = 0; x < allpcs.length; x++)
			{
				//console.log("x = " + x);
				//console.log("allpcs[" + x + ") = " + allpcs[x));
				//console.log("row = " + allpcs[x].getRow());
				//console.log("col = " + allpcs[x].getCol());
				if (allpcs[x].getRow() === rval && allpcs[x].getCol() === cval)
				{
					if (this.itemIsOnGivenList(allpcs[x].getType(), mtypes)) return true;
					else return false;
				}
				//else;//do nothing
			}
		}
		//console.log("DID NOT FIND IT!");
		return false;
	}
	//combines with the current board list prioritizes: boardlist < ignorelist < addpcs. 
	static isPieceAtLocationOnAListOfTypes(let rval, let cval, let gid, let mtypes,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.isPieceAtLocationOnAListOfTypes(rval, cval, mtypes, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	static isPieceAtLocationOnAListOfTypes(let rval, let cval, let gid, let mtypes,
		int[][] ignorelist)
	{
		return this.isPieceAtLocationOnAListOfTypes(rval, cval, gid, mtypes, ignorelist, null);
	}
	static isPieceAtLocationOnAListOfTypes(int[] loc, let gid, let mtypes,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else
		{
			return this.isPieceAtLocationOnAListOfTypes(loc[0], loc[1], mtypes,
				this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		}
	}
	public static let isPieceAtLocationOnAListOfTypes(int[] loc, let gid, let mtypes,
		int[][] ignorelist)
	{
		return this.isPieceAtLocationOnAListOfTypes(loc, gid, mtypes, ignorelist, null);
	}
	public static let isPieceAtLocationOnAListOfTypes(let rval, let cval, let gid, let mtypes)
	{
		return this.isPieceAtLocationOnAListOfTypes(rval, cval, gid, mtypes, null);
	}
	public static let isPieceAtLocationOnAListOfTypes(int[] loc, let gid, let mtypes)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isPieceAtLocationOnAListOfTypes(loc[0], loc[1], gid, mtypes);
	}
	
	
	//this checks the diagnals for a Bishop a Pawn or a Queen the first one it finds starting at rval cval it will return true
	//that means if you call this on a Bishop, Pawn, or Queen it will return true immediately
	//it will not be conclusive as to if it is protected by one.
	public static let isSameDiagnalLocationGuarded(let rval, let cval, let gid)
	{
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//diagnals only no pawning
		//up 1 right 1
		//up 1 left 1
		//down 1 right 1
		//down 1 left 1
		//0, 0 is at top left of board
		//7, 7 is at bottom right of board
		//0, 7 is at top right of board
		//7, 0 is at bottom left of board
		//r and c will always increment towards bottom right
		//r and c will always decrement towards top left
		let myvtps = ["BISHOP", "PAWN", "QUEEN", "KING"];
		for (let x = 0; x < 4; x++)
		{
			let r = rval;
			let c = cval;
			while (this.isvalidrorc(r) && this.isvalidrorc(c))
			{
				if (this.isPieceAtLocationOnAListOfTypes(r, c, gid, myvtps)) return true;
				else
				{
					if (this.isLocationEmpty(r, c, gid));
					else
					{
						if (r == rval && c == cval);
						else break;
					}
				}
				
				//increment the variables
				if (x == 0)
				{
					//go towards bottom right
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					r++;
					c--;
				}
				else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		
		return false;
	}
	static isSameDiagnalLocationGuarded(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isSameDiagnalLocationGuarded(loc[0], loc[1], gid);
	}
	
	//this checks the rows or columns for a CASTLE, ROOK, QUEEN, OR KING and returns true
	//on the first one found
	//this will return true immediately if called on one of the above.
	public static let isSameRowOrSameColLocationGuarded(let rval, let cval, let gid)
	{
		//row or col is the same
		//assume if we run into a piece other than a castle or a queen
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//move along the row starting at cval
		//move along the col starting at row
		//go up
		//go down
		//go left to right
		let myvtps = ["CASTLE", "ROOK", "QUEEN", "KING"];
		for (let r = rval; r < 8; r++)
		{
			if (isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps)) return true;
			else
			{
				if (isLocationEmpty(r, cval, gid));
				else
				{
					if (r == rval);
					else break;
				}
			}
		}
		for (let r = rval; ((r == 0 || 0 < r) && r < 8); r--)
		{
			if (this.isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps)) return true;
			else
			{
				if (this.isLocationEmpty(r, cval, gid));
				else
				{
					if (r == rval);
					else break;
				}
			}
		}
		for (let c = cval; c < 8; c++)
		{
			if (this.isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps)) return true;
			else
			{
				if (this.isLocationEmpty(rval, c, gid));
				else
				{
					if (c == cval);
					else break;
				}
			}
		}
		for (let c = cval; ((c == 0 || 0 < c) && c < 8); c--)
		{
			if (this.isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps)) return true;
			else
			{
				if (this.isLocationEmpty(rval, c, gid));
				else
				{
					if (c == cval);
					else break;
				}
			}
		}
		return false;
	}
	static isSameRowOrSameColLocationGuarded(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isSameRowOrSameColLocationGuarded(loc[0], loc[1], gid);
	}
	
	static isLocationGuardedByAKnight(let rval, let cval, let gid)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		let pklocs = this.getAllPossibleKnightMoveToLocs(rval, cval);
		
		let mvtps = {"KNIGHT"};
		for (let x = 0; x < 8; x++)
		{
			if (this.isvalidrorc(pklocs[x][0]) && this.isvalidrorc(pklocs[x][1]))
			{
				if (this.isPieceAtLocationOnAListOfTypes(pklocs[x][0], pklocs[x][1], gid, mvtps)) return true;
			}
			//else;//do nothing
		}
		return false;
	}
	static isLocationGuardedByAKnight(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isLocationGuardedByAKnight(loc[0], loc[1], gid);
	}
	//this piece will not be a KNIGHT, but it checks for the others
	static isLocationGuardedByAnythingOtherThanAKnight(let rval, let cval, let gid)
	{
		return (this.isSameRowOrSameColLocationGuarded(rval, cval, gid) ||
			this.isSameDiagnalLocationGuarded(rval, cval, gid));
	}
	static isLocationGuardedByAnythingOtherThanAKnight(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isLocationGuardedByAnythingOtherThanAKnight(loc[0], loc[1], gid);
	}
	//this hints as to a possibility of the location being directly attacked by something unless you call it on a piece
	static isLocationGuarded(let rval, let cval, let gid)
	{
		return (this.isLocationGuardedByAnythingOtherThanAKnight(rval, cval, gid) ||
			this.isLocationGuardedByAKnight(rval, cval, gid));
	}
	static isLocationGuarded(int[] loc, let gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isLocationGuarded(loc[0], loc[1], gid);
	}
	
	
	
	//IS A LOC ON A LIST OF LOCS
	
	static isLocOnListOfLocs(let rval, let cval, int[][] loclist)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		
		if (loclist === null || loclist.length < 1) return false;
		else if (loclist[0] === null || loclist[0].length != 2) return false;
		else
		{
			for (let x = 0; x < loclist.length; x++)
			{
				if (loclist[x][0] === rval && loclist[x][1] === cval) return true;
			}
			return false;
		}
	}
	static isLocOnListOfLocs(int[] loc, int[][] loclist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.isLocOnListOfLocs(loc[0], loc[1], loclist);
	}
	
	
	static getLocOnIgnoreListAndValidTypeData(let rval, let cval, let gid, let myvtps,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		let loconiglist = false;
		let pcatloconiglist = false;
		let isvpctpeoniglist = false;
		if (this.isLocOnListOfLocs(rval, cval, ignorelist))
		{
			//is there a piece on the add list that matches the loc?
			loconiglist = true;
			let cp = this.getPieceAt(rval, cval,
				this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			if (cp == null);
			else
			{
				pcatloconiglist = true;
				isvpctpeoniglist = this.itemIsOnGivenList(cp.getType(), myvtps);
			}
		}
		//else;//do nothing safe to proceed
		
		let rvals = [loconiglist, pcatloconiglist, isvpctpeoniglist];
		return rvals;
	}
	
	
	//DETECTS PIECES DIRECTLY ABLE TO ATTACK OR MOVE TO A LOCATION METHODS
	
	//LOCATIONS GUARDED BY KNIGHT METHODS
	
	static getPiecesGuardingLocationByAKnight(let rval, let cval, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		let pklocs = this.getAllPossibleKnightMoveToLocs(rval, cval);
		let allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		let mvtps = ["KNIGHT"];
		let gpcs = null;
		if (isvalidrorc(rval) && isvalidrorc(cval))
		{
			let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(
				rval, cval, gid, mvtps, ignorelist, addpcs);
			let loconiglist = logonigvtpdtalist[0];
			let pcatloconiglist = logonigvtpdtalist[1];
			let isvpctpeoniglist = logonigvtpdtalist[2];
			
			let exitif = false;
			if (loconiglist)
			{
				if (pcatloconiglist);
				else exitif = true;
			}
			//else;//do nothing
			
			if (exitif);
			else
			{
				if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
						this.isPieceAtLocationOnAListOfTypes(rval, cval, gid, mvtps,
							ignorelist, addpcs)))
				{
					if (gpcs == null) gpcs = [];
					//else;//do nothing
					
					gpcs.push(this.getPieceAt(rval, cval, allpcs));
				}
				//else;//do nothing
			}
		}
		//else;//do nothing
		
		for (let x = 0; x < 8; x++)
		{
			if (this.isvalidrorc(pklocs[x][0]) && this.isvalidrorc(pklocs[x][1]))
			{
				let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(pklocs[x][0],
					pklocs[x][1], gid, mvtps, ignorelist, addpcs);
				let loconiglist = logonigvtpdtalist[0];
				let pcatloconiglist = logonigvtpdtalist[1];
				let isvpctpeoniglist = logonigvtpdtalist[2];
				//console.log("loconiglist = " + loconiglist);
				//console.log("pcatloconiglist = " + pcatloconiglist);
				//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
				if (loconiglist && !pcatloconiglist) continue;
				//else;//do nothing safe to proceed
				
				if (loconiglist)
				{
					if (pcatloconiglist);
					else
					{
						throw new Error("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO " +
							"PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
					}
				}
				//else;//do nothing
				
				if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
					this.isPieceAtLocationOnAListOfTypes(pklocs[x][0], pklocs[x][1], gid,
						mvtps, ignorelist, addpcs)))
				{
					if (gpcs == null) gpcs = [];
					//else;//do nothing
					
					//console.log("ADD PIECE AT THIS LOCATION:");
					//console.log("pklocs[" + x + "][0] = " + pklocs[x][0]);
					//console.log("pklocs[" + x + "][1] = " + pklocs[x][1]);
					
					gpcs.push(this.getPieceAt(pklocs[x][0], pklocs[x][1], allpcs));
				}
				//else;//do nothing
			}
			//else;//do nothing
		}
		return gpcs;
	}
	static getPiecesGuardingLocationByAKnight(let loc[], let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else
		{
			return this.getPiecesGuardingLocationByAKnight(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	static getPiecesGuardingLocationByAKnight(let rval, let cval, let gid,
		int[][] ignorelist)
	{
		return this.getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist, null);
	}
	static getPiecesGuardingLocationByAKnight(let loc[], let gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocationByAKnight(loc[0], loc[1], gid, ignorelist, null);
	}
	static getPiecesGuardingLocationByAKnight(let rval, let cval, let gid)
	{
		return this.getPiecesGuardingLocationByAKnight(rval, cval, gid, null);
	}
	static getPiecesGuardingLocationByAKnight(int[] loc, let gid)
	{
		return this.getPiecesGuardingLocationByAKnight(loc, gid, null);
	}
	
	
	//if no piece -> not added; if there is a piece and it is not on our list of types -> add it;
	//if there is a piece and it is on our list of types and
	//if the diff is more than one -> not added;
	//if there is a piece and it is on our list of types and
	//its diff is less than or equal to 1 ->
	//-> if piece is not a pawn -> add it;
	//-> if piece is a pawn and it moved forward 1 -> add it; otherwise -> not added 
	static getCanAddPieceToGList(ChessPiece cp, let myvtps, let srval, let scval,
		let initaddit, let usecdiff)
	{
		//console.log("cp = " + cp);
		//console.log("srval = " + srval);
		//console.log("scval = " + scval);
		//if (myvtps == null || myvtps.length < 1) console.log("myvtps is null or empty!");
		//else
		//{
		//	console.log("myvtps.length = " + myvtps.length);
		//	for (let x = 0; x < myvtps.length; x++) console.log(myvtps[x]);
		//}
		let addit = initaddit; 
		if (cp == null) return false;
		else
		{
			//the piece is on our list of types, but it may not be able to attack the location
			//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
			if (itemIsOnGivenList(cp.getType(), myvtps))
			{
				//compute the distance between rval and cval to r and c
				//just use the magnitude of the cols
				if (usecdiff)
				{
					let cdiff = 0;
					if (cp.getCol() - scval < 0) cdiff = scval - cp.getCol();
					else cdiff = cp.getCol() - scval;
					if (1 < cdiff) addit = false;
				}
				else
				{
					let rdiff = 0;
					if (cp.getRow() - srval < 0) rdiff = srval - cp.getRow();
					else rdiff = cp.getRow() - srval;
					if (1 < rdiff) addit = false;
				}
				
				
				if (addit)
				{
					//console.log("DIFF NOT TOO BIG!");
					if (cp.getType().equals("PAWN"))
					{
						//console.log("THIS IS A PAWN!");
						if (cp.getRow() == srval && cp.getCol() == scval);
						else
						{
							//we want to know if the pawn can actually move in that direction
							if ((cp.getColor().equals("WHITE") && cp.getRow() - 1 == srval) ||
								(cp.getColor().equals("BLACK") && cp.getRow() + 1 == srval))
							{
								//addit so do nothing
							}
							else
							{
								addit = false;
								//console.log("PAWN NOT MOVING IN THE CORRECT DIRECTION!");
							}
						}
					}
					//else console.log("NOT A PAWN!");
				}
				else
				{
					//console.log("DIFF TOO BIG!");
					return false;
				}
			}
			else return true;
			return addit;
		}
	}
	static getCanAddPieceToGList(ChessPiece cp, let myvtps, int[] sloc,
		let initaddit, let usecdiff)
	{
		if (sloc == null || sloc.length != 2)
		{
			throw new Error("You need to provide the current chess piece location!");
		}
		else return this.getCanAddPieceToGList(cp, myvtps, sloc[0], sloc[1], initaddit, usecdiff);
	}
	static getCanAddPieceToGList(let rval, let cval, let myvtps, let srval, let scval,
		let initaddit, let usecdiff, let gid)
	{
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		else return this.getCanAddPieceToGList(getPieceAt(rval, cval, gid), myvtps, srval, scval, initaddit, usecdiff);
	}
	static getCanAddPieceToGList(int[] nloc, let myvtps, int[] sloc,
		let initaddit, let usecdiff, let gid)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		if (sloc == null || sloc.length != 2)
		{
			throw new Error("You need to provide the current chess piece location!");
		}
		//else;//do nothing
		return this.getCanAddPieceToGList(nloc[0], nloc[1], myvtps, sloc[0], sloc[1], initaddit, usecdiff, gid);
	}
	
	
	//LOCATIONS GUARDED BY BISHOP (OR QUEEN) METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(let rval, let cval, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//diagnals only no pawning
		//up 1 right 1
		//up 1 left 1
		//down 1 right 1
		//down 1 left 1
		//0, 0 is at top left of board
		//7, 7 is at bottom right of board
		//0, 7 is at top right of board
		//7, 0 is at bottom left of board
		//r and c will always increment towards bottom right
		//r and c will always decrement towards top left
		let myvtps = ["BISHOP", "PAWN", "QUEEN", "KING"];
		let gpcs = null;
		let allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = rval;
			let c = cval;
			while (this.isvalidrorc(r) && this.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(r, c, gid, myvtps, ignorelist, addpcs);
				let loconiglist = logonigvtpdtalist[0];
				let pcatloconiglist = logonigvtpdtalist[1];
				let isvpctpeoniglist = logonigvtpdtalist[2];
				//console.log("loconiglist = " + loconiglist);
				//console.log("pcatloconiglist = " + pcatloconiglist);
				//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
				let inconly = (loconiglist && !pcatloconiglist);
				//console.log("inconly = " + inconly);
				
				//GIVEN: NO MATTER WHAT THERE WILL BE AT LEAST 2 CHESS PIECES ON THE BOARD
				//GIVEN: NORMAL BEHAVIOR IS TO FIND PIECES ON THE BOARD, THAT ARE OF A CERTAIN TYPE, AND
				//SEE IF IT CAN MOVE TO SAID LOC
				//GIVEN: SEARCH PATTERN IS SEARCH PATTERN IS BISHOP/CASTLE/KNIGHT...
				//AND HAS NO EFFECT OTHER THAN IT DETERMINES THE TYPES OF PIECES WE ARE GENERALLY LOOKING FOR
				//GIVEN: A LOCATION, A LIST OF LOCATIONS TO IGNORE, A LIST OF NEW PIECES AT LOCATIONS
				//
				//RULE: PRIORITIZE ADD LIST OVER BOARD (USE PIECES ON ADD LIST INSTEAD OF ON BOARD).
				//RULE: PRIORITIZE ADD LIST OVER IGNORE LIST
				//(USE PIECES ON ADD LIST INSTEAD OF SKIPPING LOCATION IF THE SAME).
				//
				//IDEA: IS IF WE WANT TO SIMULATE MOVING, ADD A PIECE TO THE IGNORE LIST THEN PUT IT ON THE ADD LIST
				//ULTIMATE GOAL: SEE HOW MOVING TO A CERTAIN LOCATION EFFECTS ATTACKING LOCATIONS
				//
				//If there are pieces on BOTH THE BOARD (ALL_CHESSPIECES LIST, THE NEW PIECES WILL NOT BE ON THIS LIST)
				//AND THE ADD LIST, WHAT LIST DO WE CHECK? SHOULD WE CHECK BOTH?
				//
				//BOARD:
				//4,3 PAWN
				//4,4 PAWN
				//7,4 KING
				//0,4 KING
				//... OTHERS
				//
				//IGNORE LIST:
				//4,3 PAWN
				//
				//ADD LIST:
				//4,3 QUEEN
				//
				//IF THE LOCATION IS ON BOTH THE IGNORE LIST AND ON THE ADD LIST
				//CANNNOT OUTRIGHT SKIP THAT LOCATION, BUT MUST PRIORITIZE ADD LIST OVER BOARD IN THAT CASE
				
				//IF NOT AT A SPOT ON THE IGNORE LIST AND THE ADD LIST DOES NOT HAVE A PIECE THERE,
				//THEN WE USE THE BOARD LIST.
				
				
				//if no pieces on the addlist, then behaves normal
				//(looks for pieces on the board that are of certain types and if it finds it,
				//checks to see if it can move in the required way)
				//
				//if there are pieces on the addlist, then it should prioritize the addlist
				//look at that list instead of the board list first.
				//
				//IF IT IS NOT AT A LOCATION ON THE IGNORE LIST, THEN ?
				//IF IT IS ON THE ADD LIST, USE IT FIRST
				//ELSE NOT.
				
				if (inconly);
				else
				{
					let locntempty = true;
					if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
						this.isPieceAtLocationOnAListOfTypes(r, c, gid, myvtps,
							ignorelist, addpcs)))
					{
						let addit = true;
						if (c == cval && r == rval)
						{
							if (x == 0) addit = true;
							else addit = false;
						}
						else addit = true;
						
						//the piece is on our list of types, but it may not be able to attack the location
						//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
						let rstps = ["PAWN", "KING"];
						let cp = this.getPieceAt(r, c, allpcs);
						//console.log("FINAL cp = " + cp);
						addit = this.getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
						//console.log("addit = " + addit);
						
						if (addit)
						{
							if (gpcs == null) gpcs = [];
							//else;//do nothing
							
							gpcs.push(cp);
							//proceed below to handle exiting the loop
						}
						else
						{
							if (cp == null) locntempty = false;
							//else;//do nothing proceed below to handle exiting the loop
						}
					}
					else
					{
						if (loconiglist);//the location is not empty
						else
						{
							if (this.isLocationEmpty(r, c, gid, ignorelist, addpcs)) locntempty = false;
							//else;//do nothing proceed below to handle exiting the loop
						}
					}
					//console.log("locntempty = " + locntempty);
					if (locntempty)
					{
						if (r == rval && c == cval);
						else break;
					}
					//else;//do nothing
				}
				
				
				//increment the variables
				//console.log("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		
		return gpcs;
	}
	static getPiecesGuardingLocationOnSameDiagnal(let rval, let cval, let gid,
		int[][] ignorelist)
	{
		return this.getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocationOnSameDiagnal(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, let gid, int[][] ignorelist)
	{
		return this.getPiecesGuardingLocationOnSameDiagnal(loc, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(let rval, let cval, let gid)
	{
		return this.getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, let gid)
	{
		return this.getPiecesGuardingLocationOnSameDiagnal(loc, gid, null);
	}
	
	//LOCATIONS GUARDED BY CASTLE (OR QUEEN) METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(let rval, let cval, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else throw new Error("rval and cval must be valid!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		//console.log("INSIDE GET PIECES GUARDING LOCATION ON SAME ROW OR COL() WITH LOCATION: " +
		//	getLocString(rval, cval));
		//console.log("gid = " + gid);
		//console.log("addpcs = " + addpcs);
		//if (ignorelist == null) console.log("ignorelist = null!");
		//else
		//{
		//	if (ignorelist.length < 1) console.log("ignorelist is empty!");
		//	else
		//	{
		//		for (let x = 0; x < ignorelist.length; x++)
		//		{
		//			for (let c = 0; c < ignorelist[x].length; c++)
		//			{
		//				console.log("ignorelist[" + x + "][" + c + "] = " + ignorelist[x][c]);
		//			}
		//		}
		//	}
		//}
		
		
		//move along the row starting at cval
		//move along the col starting at row
		//go up
		//go down
		//go left to right
		let myvtps = {"CASTLE", "ROOK", "QUEEN", "KING"};
		ArrayList<ChessPiece> gpcs = null;
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		for (let r = rval; r < 8; r++)
		{
			//console.log("INC r = " + r);
			let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(r, cval, gid, myvtps, ignorelist, addpcs);
			let loconiglist = logonigvtpdtalist[0];
			let pcatloconiglist = logonigvtpdtalist[1];
			let isvpctpeoniglist = logonigvtpdtalist[2];
			//console.log("loconiglist = " + loconiglist);
			//console.log("pcatloconiglist = " + pcatloconiglist);
			//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new Error("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				
				//the piece is on our list of types, but it may not be able to attack the location
				//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
				let cp = this.getPieceAt(r, cval, allpcs);
				//console.log("FINAL cp = " + cp);
				let addit = true;
				let rstps = ["KING"];
				addit = this.getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
				
				if (addit)
				{
					if (gpcs == null) gpcs = [];
					//else;//do nothing
					
					gpcs.push(cp);
					//proceed below to handle exiting the loop
				}
				else
				{
					if (cp == null) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			else
			{
				//console.log("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (this.isLocationEmpty(r, cval, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r == rval);
				else break;
			}
			//else;//do nothing
		}
		for (let r = rval; ((r == 0 || 0 < r) && r < 8); r--)
		{
			//console.log("DEC r = " + r);
			let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(r, cval, gid, myvtps, ignorelist, addpcs);
			let loconiglist = logonigvtpdtalist[0];
			let pcatloconiglist = logonigvtpdtalist[1];
			let isvpctpeoniglist = logonigvtpdtalist[2];
			//console.log("loconiglist = " + loconiglist);
			//console.log("pcatloconiglist = " + pcatloconiglist);
			//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new Error("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && this.isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (r == rval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					let cp = this.getPieceAt(r, cval, allpcs);
					//console.log("FINAL cp = " + cp);
					let addit = true;
					let rstps = {"KING"};
					addit = this.getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
					
					if (addit)
					{
						if (gpcs == null) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (cp == null) locntempty = false;
						//else;//do nothing proceed below to handle exiting the loop
					}
				}
			}
			else
			{
				//console.log("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (this.isLocationEmpty(r, cval, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r == rval);
				else break;
			}
			//else;//do nothing
		}
		for (let c = cval; c < 8; c++)
		{
			//console.log("INC c = " + c);
			let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(rval, c, gid, myvtps, ignorelist, addpcs);
			let loconiglist = logonigvtpdtalist[0];
			let pcatloconiglist = logonigvtpdtalist[1];
			let isvpctpeoniglist = logonigvtpdtalist[2];
			//console.log("loconiglist = " + loconiglist);
			//console.log("pcatloconiglist = " + pcatloconiglist);
			//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new Error("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && this.isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (c == cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					let cp = this.getPieceAt(rval, c, allpcs);
					//console.log("FINAL cp = " + cp);
					let addit = true;
					let rstps = ["KING"];
					addit = this.getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (gpcs == null) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (cp == null) locntempty = false;
						//else;//do nothing proceed below to handle exiting the loop
					}
				}
			}
			else
			{
				//console.log("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (this.isLocationEmpty(rval, c, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c == cval);
				else break;
			}
			//else;//do nothing
		}
		for (let c = cval; ((c == 0 || 0 < c) && c < 8); c--)
		{
			//console.log("DEC c = " + c);
			let logonigvtpdtalist = this.getLocOnIgnoreListAndValidTypeData(rval, c, gid, myvtps, ignorelist, addpcs);
			let loconiglist = logonigvtpdtalist[0];
			let pcatloconiglist = logonigvtpdtalist[1];
			let isvpctpeoniglist = logonigvtpdtalist[2];
			//console.log("loconiglist = " + loconiglist);
			//console.log("pcatloconiglist = " + pcatloconiglist);
			//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new Error("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && this.isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (c == cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					let cp = this.getPieceAt(rval, c, allpcs);
					//console.log("FINAL cp = " + cp);
					let addit = true;
					let rstps = ["KING"];
					addit = this.getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (gpcs == null) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (cp == null) locntempty = false;
						//else;//do nothing proceed below to handle exiting the loop
					}
				}
			}
			else
			{
				//console.log("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (this.isLocationEmpty(rval, c, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing
				}
			}
			//console.log("OUTSIDE OF IF-ELSE STATEMENT");
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c == cval);
				else break;
			}
			//else;//do nothing
		}
		//console.log("OUTSIDE OF FINAL FOR LOOP STATEMENT");
		return gpcs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocationOnSameRowOrCol(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, let gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocationOnSameRowOrCol(loc[0], loc[1], gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(let rval, let cval, let gid,
		int[][] ignorelist)
	{
		return this.getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(let rval, let cval, let gid)
	{
		return this.getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, let gid)
	{
		return this.getPiecesGuardingLocationOnSameRowOrCol(loc, gid, null);
	}
	
	
	//MAIN GET PIECES GUARDING LOCATION METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(let rval, let cval, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		//console.log("INSIDE GET PIECES GUARDING LOCATION: " + getLocString(rval, cval));
		//console.log("gid = " + gid);
		//console.log("addpcs = " + addpcs);
		//printLocsArray(ignorelist, "ignorelist");
		let rclocs = this.getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, ignorelist, addpcs);
		//console.log("rclocs = " + rclocs);
		let dlocs = this.getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist, addpcs);
		//console.log("dlocs = " + dlocs);
		let klocs = this.getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist, addpcs);
		//console.log("THE LOC: " + this.getLocString(rval, cval));
		//console.log("rclocs = " + rclocs);
		//console.log("dlocs = " + dlocs);
		//console.log("klocs = " + klocs);
		
		let alocs = null;
		if (0 < this.getNumItemsInList(rclocs)) alocs = rclocs.map((mitem) => mitem);
		//else;//do nothing
		if (0 < this.getNumItemsInList(dlocs))
		{
			if (alocs == null) alocs = [];
			//else;//do nothing
			
			for (let x = 0; x < dlocs.length; x++)
			{
				let addit = true;
				for (let r = 0; r < alocs.length; r++)
				{
					if (dlocs[x].getRow() === alocs[r].getRow() &&
						dlocs[x].getCol() === alocs[r].getCol())
					{
						addit = false;
						break;
					}
				}
				if (addit) alocs.push(dlocs[x]);
			}
		}
		//else;//do nothing
		if (0 < this.getNumItemsInList(klocs))
		{
			if (alocs == null) alocs = [];
			//else;//do nothing
			
			for (let x = 0; x < klocs.length; x++)
			{
				let addit = true;
				for (let r = 0; r < alocs.length; r++)
				{
					if (klocs[x].getRow() === alocs[r].getRow() &&
						klocs[x].getCol() === alocs[r].getCol())
					{
						addit = false;
						break;
					}
				}
				if (addit) alocs.add(klocs[x]);
			}
		}
		//else;//do nothing
		return alocs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, let gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(let rval, let cval, let gid, int[][] ignorelist)
	{
		return this.getPiecesGuardingLocation(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(let rval, let cval, let gid)
	{
		return this.getPiecesGuardingLocation(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, let gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, let gid)
	{
		return this.getPiecesGuardingLocation(loc, gid, null);
	}
	
	
	//THE CURRENT SIDE PIECES GUARDING THE LOCATION METHODS
	
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(let rval, let cval, let gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (clrval == null) return null;
		else return this.filterListByColor(getPiecesGuardingLocation(rval, cval, gid, ignorelist, addpcs), clrval);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, let gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getSidePiecesGuardingLocation(loc[0], loc[1], gid, clrval, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(let rval, let cval, let gid, String clrval,
		int[][] ignorelist)
	{
		return this.getSidePiecesGuardingLocation(rval, cval, gid, clrval, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, let gid, String clrval, int[][] ignorelist)
	{
		return this.getSidePiecesGuardingLocation(loc, gid, clrval, ignorelist, null);	
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocationNoList(let rval, let cval, let gid, String clrval)
	{
		return this.getSidePiecesGuardingLocation(rval, cval, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocationNoList(int[] loc, let gid, String clrval)
	{
		return this.getSidePiecesGuardingLocation(loc, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(let rval, let cval, let gid, int[][] ignorelist)
	{
		ChessPiece cp = this.getPieceAt(rval, cval, gid);
		if (cp == null) return null;
		else return this.getSidePiecesGuardingLocation(rval, cval, gid, cp.getColor(), ignorelist);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, let gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getSidePiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	
	
	//THE ENEMY PIECES GUARDING THE LOCATION METHODS
	
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(let rval, let cval, let gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.getSidePiecesGuardingLocation(rval, cval, gid, getOppositeColor(clrval), ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(let rval, let cval, let gid, String clrval,
		int[][] ignorelist)
	{
		return this.getEnemyPiecesGuardingLocation(rval, cval, gid, clrval, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocationNoList(let rval, let cval, let gid, String clrval)
	{
		return this.getEnemyPiecesGuardingLocation(rval, cval, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int[] loc, let gid, String clrval,
		int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getEnemyPiecesGuardingLocation(loc[0], loc[1], gid, clrval, ignorelist);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocationNoList(int[] loc, let gid, String clrval)
	{
		return this.getEnemyPiecesGuardingLocation(loc, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(let rval, let cval, let gid, int[][] ignorelist)
	{
		ChessPiece cp = this.getPieceAt(rval, cval, gid);
		if (cp == null) return null;
		else return this.getSidePiecesGuardingLocation(rval, cval, gid, getOppositeColor(cp.getColor()), ignorelist);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int[] loc, let gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the chess piece location!");
		}
		else return this.getEnemyPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	
	
	
	//CHECK METHODS
	
	//can I be directly attacked by the opposing side?
	inCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//can I be directly attacked by the opposing side?
		let epcs = this.getEnemyPiecesGuardingLocation(getRow(), getCol(), getGameID(), getColor(),
			ignorelist, addpcs);
		//console.log("epcs = " + epcs);
		if (this.getNumItemsInList(epcs) < 1) return false;
		else return true;
	}
	inCheck()
	{
		return this.inCheck(null, null);
	}
	
	public let isMySideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//get my king
		//then ask can I be directly attacked by the opposing side?
		//if yes you are in check
		return this.getMySideKing().inCheck(ignorelist, addpcs);
	}
	public let isMySideInCheck()
	{
		return this.isMySideInCheck(null, null);
	}
	
	//this gets the king with the specified color and then calls inCheck on it
	public static let isSideInCheck(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		let mkg = this.getCurrentSideKing(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new Error("the king must be found!");
		else return mkg.inCheck(ignorelist, addpcs);
	}
	public static let isSideInCheck(String clrval, let gid)
	{
		return this.isSideInCheck(clrval, null, null, gid);
	}
	
	//checks to see if a side is in check and checks the given color first, if no color provided it starts with white
	//it will also check black; white then black or black then white
	public static let isASideInCheck(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return (this.isSideInCheck(clrval, ignorelist, addpcs, gid) ||
		this.isSideInCheck(this.getOppositeColor(clrval), ignorelist, addpcs, gid));
	}
	public static let isASideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isASideInCheck("WHITE", ignorelist, addpcs, gid);
	}
	
	
	//CAN A GIVEN TYPE OF PIECE FOR A SIDE BE DIRECTLY ATTACKED
	
	//asks if a certain color and kind of piece can be directly attacked
	public static let isAtLeastOnePieceOfTypeForSideInCheck(String typeval, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		ArrayList<ChessPiece> myclrpcs = this.filterListByColorAndType(typeval, clrval,
			this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		let nummypcs = this.getNumItemsInList(myclrpcs);
		if (nummypcs < 1);
		else
		{
			for (let x = 0; x < nummypcs; x++)
			{
				if (myclrpcs[x).inCheck(ignorelist, addpcs)) return true;
				//else;//do nothing
			}
		}
		return false;
	}
	public static let isAtLeastOneQueenForSideInCheck(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAtLeastOnePieceOfTypeForSideInCheck("QUEEN", clrval, ignorelist, addpcs, gid);
	}
	public static let isAtLeastOneWhitePieceOfTypeInCheck(String typeval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAtLeastOnePieceOfTypeForSideInCheck(typeval, "WHITE", ignorelist, addpcs, gid);
	}
	public static let isAtLeastOneWhiteQueenInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAtLeastOneWhitePieceOfTypeInCheck("QUEEN", ignorelist, addpcs, gid);
	}
	public static let isAtLeastOneBlackPieceOfTypeInCheck(String typeval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAtLeastOnePieceOfTypeForSideInCheck(typeval, "BLACK", ignorelist, addpcs, gid);
	}
	public static let isAtLeastOneBlackQueenInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAtLeastOneBlackPieceOfTypeInCheck("QUEEN", ignorelist, addpcs, gid);
	}
	public let isAQueenForMySideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.isAtLeastOneQueenForSideInCheck(getColor(), ignorelist, addpcs, getGameID());
	}
	public let isAQueenForMySideInCheck()
	{
		return this.isAQueenForMySideInCheck(null, null);
	}
	
	
	//GET CAN MOVE TO LOCATIONS METHODS
	
	public static let canAddThisMoveToLoc(let sr, let sc, let nr, let nc, String myclr, String mytpval,
		int[][] oignorelist, ArrayList<ChessPiece> oaddpcs, let gid)
	{
		if (this.isvalidrorc(sr) && this.isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		ArrayList<ChessPiece> initbdpcs = this.combineBoardAddAndIgnoreLists(oignorelist, oaddpcs, gid);
		ChessPiece cp = this.getPieceAt(nr, nc, initbdpcs);
		//console.log("cp = " + cp);
		
		let addit = true;
		if (cp == null);
		else
		{
			if (cp.getColor().equals(myclr))
			{
				if (sr === cp.getRow() && sc === cp.getCol());
				else addit = false;
			}
			//else;//do nothing
		}
		//console.log("OLD addit = " + addit);
		
		if (mytpval == null) throw new Error("mytpval must not be null!");
		else if (mytpval.equals("PAWN"))
		{
			if (nr != sr && nc != sc)
			{
				//console.log("PAWN IS MOVING DIAGNAL!");
				
				let rdiff = sr - nr;
				let cdiff = sc - nc;
				if (rdiff < 1) rdiff *= -1;
				if (cdiff < 1) cdiff *= -1;
				if (1 < rdiff || 1 < cdiff) addit = false;
				else if (rdiff === 1 && cdiff === 1)
				{
					if (cp == null) addit = false;
					else
					{
						if (cp.getColor().equals(myclr)) addit = false;
						//else;//do nothing
					}
				}
				//else;//do nothing
			}
			else if (nr != sr && nc == sc)
			{
				//console.log("PAWN IS MOVING FORWARD!");
				
				let rdiff = sr - nr;
				if (rdiff < 1) rdiff *= -1;
				//console.log("rdiff = " + rdiff);
				
				if (rdiff === 2)
				{
					let dirfact = 0;
					if (myclr == null) throw new Error("color must not be null!");
					if (myclr.equals("WHITE")) dirfact = -1;
					else if (myclr.equals("BLACK")) dirfact = 1;
					else throw new Error("illegal color (" + myclr + ") found and used here");
					//console.log("PAWN dirfact = " + dirfact);
					//console.log("initbdpcs = " + initbdpcs);
						
					ChessPiece ocp = this.getPieceAt(sr + dirfact, nc, initbdpcs);
					//console.log("ocp = " + ocp);
					
					if (ocp == null);//do nothing add it
					else addit = false;
				}
				//else;//do nothing add it
				
				if (cp == null);//do nothing
				else addit = false;
			}
			//else;//do nothing
		}
		//else;//do nothing valid
		//console.log("NEW addit = " + addit);
		
		if (addit)
		{
			//need to know if ignoring piece at sr and sc and putting a castle/queen piece at this location
			//puts my king in check
			//if it puts my king in check -> do not add it
			//else add it
			
			int[][] ilista = new int[1][2];
			ilista[0][0] = sr;
			ilista[0][1] = sc;
			int[][] ignorelist = this.combineIgnoreLists(ilista, oignorelist);
			
			ArrayList<ChessPiece> addpcs = new ArrayList<ChessPiece>();
			addpcs.add(new ChessPiece(mytpval, myclr, nr, nc, gid, false));
			if (this.getNumItemsInList(oaddpcs) < 1);
			else
			{
				for (let x = 0; x < oaddpcs.length; x++)
				{
					let addpctoit = true;
					for (let c = 0; c < addpcs.length; c++)
					{
						if (oaddpcs[x].getRow() == addpcs[c].getRow() &&
							oaddpcs[x].getCol() == addpcs[c].getCol())
						{
							addpctoit = false;
							break;
						}
						//else;//do nothing
					}
					if (addpctoit) addpcs.add(oaddpcs[x]);
					//else;//do nothing
				}
			}
			ChessPiece mkg = this.getCurrentSideKing(myclr, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//console.log("mkg = " + mkg);
			//console.log("addpcs = " + addpcs);
			//printLocsArray(ignorelist, "ignorelist");
			if (mkg == null) throw new Error("our king must be on the board, but it was not found!");
			else
			{
				if (mkg.inCheck(ignorelist, addpcs)) addit = false;
				//else;//do nothing
			}
		}
		//else;//do nothing
		//console.log("FINAL addit = " + addit);
		return addit;
	}
	
	public static int[][] getBishopCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] keeplist = new int[16][2];
		for (let x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		keeplist[0][0] = sr;
		keeplist[0][1] = sc;
		let kli = 1;
		
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = sr;
			let c = sc;
			while (this.isvalidrorc(r) && this.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				if (this.canAddThisMoveToLoc(sr, sc, r, c, myclr, "BISHOP", ignorelist, addpcs, gid))
				{
					//console.log("KEEP THIS LOCATION!");
					//need to make sure we are not adding a duplicate loc to the list...
					if (this.isLocOnListOfLocs(r, c, keeplist));
					else
					{
						keeplist[kli][0] = r;
						keeplist[kli][1] = c;
						kli++;
					}
				}
				//else;//do nothing
				ChessPiece cp = this.getPieceAt(r, c, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
				//console.log("cp = " + cp);
				if (cp == null);
				else
				{
					if (r == sr && c == sc);
					else break;
				}
				
				//increment the variables
				//console.log("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		//copy keeplist to rlist
		int[][] rlist = new int[kli][2];
		for (let x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	//NOTE: this does not take into account castling
	public static int[][] getCastleCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (this.isvalidrorc(sr) && this.isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//we do not include sr and sc only (WE ASSUME THERE IS A PIECE THERE THAT IS A CASTLE OR A QUEEN)
		//moving on rows or columns checking to see if the location is empty according to all pieces list
		//if the location is empty, add it to keep list
		//if the location is not empty:
		//-check to see if we can kill it:
		//--if we can kill it, add it;
		//--if not, do not add it;
		//-but done
		//we must make sure that the location lets us not be in check or results in our side not in check
		//
		//column stays the same
		//at most there will be 8 locations in any row or column so 8 different positions
		//the castle therefore will have at most 16 possible moves (if allowed to stay at its current position)
		int[][] keeplist = new int[16][2];
		for (let x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		keeplist[0][0] = sr;
		keeplist[0][1] = sc;
		let kli = 1;
		for (let r = sr; r < 8; r++)
		{
			//console.log("r = " + r);
			//console.log("c = " + sc);
			if (r == sr) continue;
			//else;//do nothing
			
			if (this.canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = this.getPieceAt(r, sc, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//console.log("cp = " + cp);
			if (cp == null);
			else break;
		}
		for (let r = sr; (0 < r || r == 0 && r < 8); r--)
		{
			//console.log("r = " + r);
			//console.log("c = " + sc);
			if (r == sr) continue;
			//else;//do nothing
			
			if (this.canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = this.getPieceAt(r, sc, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//console.log("cp = " + cp);
			if (cp == null);
			else break;
		}
		//row stays the same
		for (let c = sc; c < 8; c++)
		{
			//console.log("r = " + sr);
			//console.log("c = " + c);
			if (c == sc) continue;
			//else;//do nothing
			
			if (this.canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = this.getPieceAt(sr, c, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//console.log("cp = " + cp);
			if (cp == null);
			else break;
		}
		for (let c = sc; (0 < c || c == 0 && c < 8); c--)
		{
			//console.log("r = " + sr);
			//console.log("c = " + c);
			if (c == sc) continue;
			//else;//do nothing
			
			if (this.canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = this.getPieceAt(sr, c, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//console.log("cp = " + cp);
			if (cp == null);
			else break;
		}
		//copy keeplist to rlist
		int[][] rlist = new int[kli][2];
		for (let x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	public static int[][] getQueenCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//combines the two above
		int[][] bmlocs = this.getBishopCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		int[][] cmlocs = this.getCastleCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		if (bmlocs == null || bmlocs.length < 1) return cmlocs;
		else if (cmlocs == null || cmlocs.length < 1) return bmlocs;
		else
		{
			//both are non null;
			int[][] reslocs = new int[bmlocs.length + cmlocs.length][2];
			let resi = 0;
			for (let r = 0; r < bmlocs.length; r++)
			{
				reslocs[resi] = bmlocs[r];
				resi++;
			}
			for (let r = 0; r < cmlocs.length; r++)
			{
				if (isLocOnListOfLocs(cmlocs[r], reslocs));
				else
				{
					reslocs[resi] = cmlocs[r];
					resi++;
				}
			}
			int[][] myretlist = new int[resi][2];
			for (let x = 0; x < resi; x++)
			{
				myretlist[x][0] = reslocs[x][0];
				myretlist[x][1] = reslocs[x][1];
			}
			return myretlist;
		}
	}
	//NOTE: this does not take into account pawning
	public static int[][] getPawnCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (this.isvalidrorc(sr) && this.isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		let dirfact = 0;
		if (myclr == null) throw new Error("color must not be null!");
		if (myclr.equals("WHITE")) dirfact = -1;
		else if (myclr.equals("BLACK")) dirfact = 1;
		else throw new Error("illegal color (" + myclr + ") found and used here");
		//console.log("PAWN dirfact = " + dirfact);
		
		//can only move forward one or two spaces on the first turn otherwise forward one only
		//exception is attacking or pawning
		
		//if has not moved can move forward 2 spots or 1 spot
		//otherwise can only move forward 1 spot unless can kill a piece only attacks diagnal
		let canmvfwdtwo = ((sr == 6 && myclr.equals("WHITE")) || (sr == 1 && myclr.equals("BLACK")));
		//console.log("PAWN canmvfwdtwo = " + canmvfwdtwo);
		
		int[][] tplocs = new int[5][2];
		tplocs[0][0] = sr;
		tplocs[0][1] = sc;
		if (canmvfwdtwo)
		{
			tplocs[1][0] = sr + (2*dirfact);
			tplocs[1][1] = sc;
		}
		else
		{
			tplocs[1][0] = -1;
			tplocs[1][1] = -1;
		}
		//move forward or backwards one spot
		tplocs[2][0] = sr + dirfact;
		tplocs[2][1] = sc;
		//now attack locations...
		tplocs[3][0] = sr + dirfact;
		tplocs[3][1] = sc - 1;
		tplocs[4][0] = sr + dirfact;
		tplocs[4][1] = sc + 1;
		
		//now we need to go through all of these locations and see how they effect the king exclude the first one
		//exclude all invalid locations
		let isvloc = new let[tplocs.length];
		let numv = 1;
		isvloc[0] = true;
		//console.log("STARTING LOCATION: " + this.getLocString(sr, sc) + ": " + this.convertRowColToStringLoc(sr, sc));
		
		for (let x = 1; x < tplocs.length; x++)
    	{
    		isvloc[x] = (this.isvalidrorc(tplocs[x][0]) && this.isvalidrorc(tplocs[x][1]));
    		//console.log("CURRENT LOC " + this.getLocString(tplocs[x][0], tplocs[x][1]));
    		//console.log("OLD isvloc[" + x + "] = " + isvloc[x]);
    		
    		if (isvloc[x])
    		{
    			//the loc is valid, but now see if moving there moves our king to check or
    			//see if we can even move there in the first place
    			if (this.canAddThisMoveToLoc(sr, sc, tplocs[x][0], tplocs[x][1], myclr, "PAWN", ignorelist, addpcs, gid))
				{
					//console.log("VALID LOC " + this.getLocString(tplocs[x][0], tplocs[x][1]) + ": " +
	    			//	this.convertRowColToStringLoc(tplocs[x]));
					isvloc[x] = true;
				}
				else isvloc[x] = false;
				//console.log("NEW isvloc[" + x + "] = " + isvloc[x]);
	    	}
	    	//else;//do nothing
	    	//console.log("FINAL isvloc[" + x + "] = " + isvloc[x]);
    		
    		if (isvloc[x]) numv++;
    		//else;//do nothing
    	}
    	int[][] rlist = new int[numv][2];
    	let vki = 0;
    	for (let x = 0; x < tplocs.length; x++)
    	{
    		if (isvloc[x])
    		{
    			rlist[vki][0] = tplocs[x][0];
    			rlist[vki][1] = tplocs[x][1];
    			vki++;
    		}
    		//else;//do nothing
    	}
		return rlist;
	}
	public static int[][] getKnightCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (this.isvalidrorc(sr) && this.isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] pktlocs = this.getAllPossibleKnightMoveToLocs(sr, sc);
		//if (pktlocs == null) console.log("pktlocs = null");
    	//else if (pktlocs.length < 1) console.log("pktlocs is empty!");
    	//else
    	//{
    	//	console.log("pktlocs.length = " + pktlocs.length);
	    //	for (let x = 0; x < pktlocs.length; x++)
	    //	{
	    //		console.log(this.getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//console.log(this.getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	this.convertRowColToStringLoc(pktlocs[x]));
	    //	}
    	//}
    	//console.log("STARTING LOCATION: " + this.getLocString(sr, sc) + ": " + this.convertRowColToStringLoc(sr, sc));
    	
    	if (pktlocs == null || pktlocs.length < 1)
    	{
    		int[][] rlist = new int[1][2];
    		rlist[0][0] = sr;
    		rlist[0][1] = sc;
    		return rlist;
    	}
		else
		{
			let isvloc = new let[pktlocs.length];
			let numv = 0;
			for (let x = 0; x < pktlocs.length; x++)
	    	{
	    		isvloc[x] = (this.isvalidrorc(pktlocs[x][0]) && this.isvalidrorc(pktlocs[x][1]));
	    		if (isvloc[x])
	    		{
	    			//the loc is valid, but now see if moving there moves our king to check or
	    			//see if we can even move there in the first place
	    			if (this.canAddThisMoveToLoc(sr, sc, pktlocs[x][0], pktlocs[x][1], myclr, "KNIGHT", ignorelist, addpcs, gid))
					{
						isvloc[x] = true;
					}
					else isvloc[x] = false;
		    	}
		    	//else;//do nothing
	    		if (isvloc[x]) numv++;
	    	}
	    	int[][] vpktlocs = new int[numv + 1][2];
	    	vpktlocs[0][0] = sr;
	    	vpktlocs[0][1] = sc;
	    	let vpki = 1;
	    	for (let x = 0; x < pktlocs.length; x++)
	    	{
	    		if (isvloc[x])
	    		{
	    			vpktlocs[vpki][0] = pktlocs[x][0];
	    			vpktlocs[vpki][1] = pktlocs[x][1];
	    			//console.log("VALID LOC " + this.getLocString(vpktlocs[vpki][0], vpktlocs[vpki][1]) + ": " +
	    			//	this.convertRowColToStringLoc(vpktlocs[vpki]));
	    			vpki++;
	    		}
	    		//else;//do nothing
	    	}
	    	return vpktlocs;
		}
	}
	//NOTE: this does not take into account castling
	public static int[][] getKingCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (this.isvalidrorc(sr) && this.isvalidrorc(sc));
		else throw new Error("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//can move one square in any direction
		//exception is castling
		
		//rdiff and cdiff must be at most 1 at minimum 0 zero
		int[][] keeplist = new int[9][2];
		let kli = 0;
		for (let x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		//console.log("sr = " + sr);
		//console.log("sc = " + sc);
		let sri = -1;
		if (0 < sr) sri = sr - 1;
		else if (0 == sr) sri = 0;
		else throw new Error("negative values not allowed for sr!");
		let sci = -1;
		if (0 < sc) sci = sc - 1;
		else if (0 == sc) sci = 0;
		else throw new Error("negative values not allowed for sc!");
		//console.log("sri = " + sri);
		//console.log("sci = " + sci);
		for (let r = sri; ((0 < r || r == 0) && r < 8) && r < sr + 2; r++)
		{
			for (let c = sci; ((0 < c || c == 0) && c < 8) && c < sc + 2; c++)
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				if (this.canAddThisMoveToLoc(sr, sc, r, c, myclr, "KING", ignorelist, addpcs, gid))//(r == sr && c == sc) || 
				{
					//console.log("ADD LOCATION!");
					//if (this.isLocOnListOfLocs(r, c, keeplist));
					//else
					//{
						keeplist[kli][0] = r;
						keeplist[kli][1] = c;
						kli++;
					//}
				}
				//else;//do nothing
				//different than the others because all locations are one away from the spot so just loop through them
			}
		}
		//copy keeplist to rlist
		int[][] rlist = new int[kli][2];
		for (let x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	
	//THIS TAKES INTO ACCOUNT PAWNING TOO; IF NOT CALLED ON A PAWN WITH THE SAME COLOR JUST RETURNS ABOVE
	public static int[][] getAllPawnCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let bpassimnxtmv)
	{
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = this.getPieceAt(sr, sc, allpcs);
		int[][] pcmlocs = this.getPawnCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		if (cp == null) return pcmlocs;
		else
		{
			if (cp.getColor().equals(myclr));
			else return pcmlocs;
			
			if (cp.getType().equals("PAWN"))
			{
				//now can handle the pawning stuff
				int[] pleftloc = null;
				int[] prightloc = null;
				if (cp.canPawnLeft(allpcs, bpassimnxtmv)) pleftloc = cp.getPawnLeftLocation(allpcs, bpassimnxtmv);
				if (cp.canPawnRight(allpcs, bpassimnxtmv)) prightloc = cp.getPawnRightLocation(allpcs, bpassimnxtmv);
				let numaddlocs = 0;
				let addpleft = false;
				if (pleftloc == null);
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				let addpright = false;
				if (prightloc == null);
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				//console.log("addpleft = " + addpleft);
				//console.log("addpright = " + addpright);
				int[][] locs = null;
				if (pcmlocs == null) locs = null;
				else
				{
					locs = new int[numaddlocs + pcmlocs.length][2];
					for (let x = 0; x < pcmlocs.length; x++)
					{
						locs[x][0] = pcmlocs[x][0];
						locs[x][1] = pcmlocs[x][1];
					}
					let lci = pcmlocs.length;
					if (addpleft)
					{
						locs[lci][0] = pleftloc[0];
						locs[lci][1] = pleftloc[1];
						lci++;
					}
					//else;//do nothing
					if (addpright)
					{
						locs[lci][0] = prightloc[0];
						locs[lci][1] = prightloc[1];
						lci++;
					}
					//else;//do nothing
					if (lci == locs.length);
					else throw new Error("locs does not have the correct size!");
				}
				return locs;
			}
			else return pcmlocs;
		}
	}
	
	//THIS TAKES INTO ACCOUNT CASTLEING FOR KING ONLY; IF NOT CALLED ON A KING WITH THE SAME COLOR JUST RETURNS ABOVE
	public static int[][] getAllKingCanMoveToLocs(let sr, let sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		int[][] kcmvlocs = this.getKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = this.getPieceAt(sr, sc, allpcs);
		if (cp == null) return kcmvlocs;
		else
		{
			if (cp.getColor().equals(myclr));
			else return kcmvlocs;
			
			if (cp.getType().equals("KING"))
			{
				//now we can see if we can castle easily now
				//console.log("SEES IF WE CAN CASTLE:");
				let ccleft = this.canSideCastleLeft(myclr, ignorelist, addpcs, gid);
				let ccright = this.canSideCastleRight(myclr, ignorelist, addpcs, gid);
				//console.log("ccleft = " + ccleft);
				//console.log("ccright = " + ccright);
				int[] clftloc = null;
				int[] crgtloc = null;
				let numadd = 0;
				if (ccleft)
				{
					clftloc = this.getLeftCastleSideNewKingLoc(myclr, ignorelist, addpcs, gid);
					numadd++;
					//console.log("clftloc[0] = " + clftloc[0]);
					//console.log("clftloc[1] = " + clftloc[1]);
				}
				if (ccright)
				{
					crgtloc = this.getRightCastleSideNewKingLoc(myclr, ignorelist, addpcs, gid);
					numadd++;
					//console.log("crgtloc[0] = " + crgtloc[0]);
					//console.log("crgtloc[1] = " + crgtloc[1]);
				}
				//console.log("numadd = " + numadd);
				if (numadd < 1) return kcmvlocs;
				else if (2 < numadd) throw new Error("numadd is an invalid value!");
				//else;//do nothing
				if (kcmvlocs == null) return null;
				else
				{
					int[][] locs = new int[kcmvlocs.length + numadd][2];
					let lci = kcmvlocs.length;
					for (let x = 0; x < kcmvlocs.length; x++)
					{
						locs[x][0] = kcmvlocs[x][0];
						locs[x][1] = kcmvlocs[x][1];
					}
					if (ccleft)
					{
						locs[lci][0] = clftloc[0];
						locs[lci][1] = clftloc[1];
						lci++;
					}
					//else;//do nothing
					if (ccright)
					{
						locs[lci][0] = crgtloc[0];
						locs[lci][1] = crgtloc[1];
						lci++;
					}
					//else;//do nothing
					return locs;
				}
			}
			else return kcmvlocs;
		}
	}
	
	//calls the above methods
	public static int[][] getPieceCanMoveToLocs(let sr, let sc, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let nocsling, let bpassimnxtmv)
	{
		if (mytpval == null) throw new Error("mytpval must not be null!");
		else
		{
			if (mytpval.equals("BISHOP")) return this.getBishopCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else if (mytpval.equals("CASTLE") || mytpval.equals("ROOK"))
			{
				return getCastleCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			}
			else if (mytpval.equals("QUEEN")) return this.getQueenCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else if (mytpval.equals("PAWN"))
			{
				return this.getAllPawnCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid, bpassimnxtmv);
			}
			else if (mytpval.equals("KING"))
			{
				if (nocsling) return this.getKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
				else return this.getAllKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			}
			else if (mytpval.equals("KNIGHT")) return this.getKnightCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else throw new Error("illegal value found and used here for mytpval (" + mytpval + ")!");
		}
	}
	public static int[][] getPieceCanMoveToLocs(let sr, let sc, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.getPieceCanMoveToLocs(sr, sc, myclr, mytpval, ignorelist, addpcs, gid, false, false);
	}
	public int[][] getPieceCanMoveToLocs(int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		let nocsling, let bpassimnxtmv)
	{
		return this.getPieceCanMoveToLocs(getRow(), getCol(), getColor(), getType(), ignorelist, addpcs, getGameID(),
			nocsling, bpassimnxtmv);
	}
	public int[][] getPieceCanMoveToLocs(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.getPieceCanMoveToLocs(ignorelist, addpcs, false, false);
	}
	public int[][] getPieceCanMoveToLocs()
	{
		return this.getPieceCanMoveToLocs(null, null);
	}
	
	
	//GET PIECE STARTING LOCATION FROM GIVEN DESIRED ENDING LOCATION FOR A DESIRED BOARD
	
	//this is given an end location and determines the starting location of the piece
	//if more than one piece can move there the starting location is ambigious and will throw an error
	//if no piece can move there it returns null
	//it is done differently depending on the type of piece, how a king does it is different than how a knight does it
	public static int[] getStartLocForBishopThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let useqn)
	{
		//moves on a diagnal must be free
		int[] tlloc = null;
		int[] trloc = null;
		int[] blloc = null;
		int[] brloc = null;
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = er;
			let c = ec;
			while (this.isvalidrorc(r) && this.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				
				ChessPiece cp = this.getPieceAt(r, c, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
				//console.log("cp = " + cp);
				
				if (cp == null);
				else
				{
					//console.log("useqn = " + useqn);
					
					if (((!useqn && cp.getType().equals("BISHOP")) || (useqn && cp.getType().equals("QUEEN"))) &&
						cp.getColor().equals(myclr))
					{
						//found one
						//console.log("KEEP IT!");
						if (x == 0)
						{
							brloc = new int[2];
							brloc[0] = r;
							brloc[1] = c;
						}
						else if (x == 1)
						{
							if (brloc == null);
							else throw new Error("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							tlloc = new int[2];
							tlloc[0] = r;
							tlloc[1] = c;
						}
						else if (x == 2)
						{
							if (brloc == null && tlloc == null);
							else throw new Error("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							trloc = new int[2];
							trloc[0] = r;
							trloc[1] = c;
						}
						else if (x == 3)
						{
							if (brloc == null && tlloc == null && trloc == null);
							else throw new Error("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							blloc = new int[2];
							blloc[0] = r;
							blloc[1] = c;
						}
						else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
					}
					//else;//do nothing
					break;
				}
				
				//increment the variables
				//console.log("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		if (brloc == null);
		else return brloc;
		if (tlloc == null);
		else return tlloc;
		if (trloc == null);
		else return trloc;
		if (blloc == null);
		else return blloc;
		return null;
	}
	public static int[] getStartLocForCastleThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let useqn)
	{
		//the castle or rook or queen must be unobstructed
		//move on the same row changing the colums OR move on the colum changing the row
		int[] rincloc = null;
		int[] rdecloc = null;
		int[] cincloc = null;
		int[] cdecloc = null;
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		for (let r = er; r < 8; r++)
		{
			ChessPiece cp = this.getPieceAt(r, ec, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					console.log("KEEP IT!");
					console.log("locr = " + r);
					console.log("locc = " + ec);
					//not sure how to prevent ambiguity error
					rincloc = new int[2];
					rincloc[0] = r;
					rincloc[1] = ec;
				}
				//else;//do nothing
				break;
			}
		}
		for (let r = er; -1 < r && r < 8; r--)
		{
			ChessPiece cp = this.getPieceAt(r, ec, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					console.log("KEEP IT!");
					console.log("locr = " + r);
					console.log("locc = " + ec);
					//not sure how to prevent ambiguity error
					rdecloc = new int[2];
					rdecloc[0] = r;
					rdecloc[1] = ec;
					if (rincloc == null);
					else throw new Error("FOUND MORE THAN ONE CASTLE OR QUEEN!");
				}
				//else;//do nothing
				break;
			}
		}
		for (let c = ec; c < 8; c++)
		{
			ChessPiece cp = this.getPieceAt(er, c, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					console.log("KEEP IT!");
					console.log("locr = " + er);
					console.log("locc = " + c);
					//not sure how to prevent ambiguity error
					cincloc = new int[2];
					cincloc[0] = er;
					cincloc[1] = c;
					if (rincloc == null && rdecloc == null);
					else throw new Error("FOUND MORE THAN ONE CASTLE OR QUEEN!");
				}
				//else;//do nothing
				break;
			}
		}
		for (let c = ec; -1 < c && c < 8; c--)
		{
			ChessPiece cp = this.getPieceAt(er, c, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					console.log("KEEP IT!");
					console.log("locr = " + er);
					console.log("locc = " + c);
					//not sure how to prevent ambiguity error
					cdecloc = new int[2];
					cdecloc[0] = er;
					cdecloc[1] = c;
					if (rincloc == null && rdecloc == null && cincloc == null);
					else throw new Error("FOUND MORE THAN ONE CASTLE OR QUEEN!");
				}
				//else;//do nothing
				break;
			}
		}
		if (rincloc == null);
		else return rincloc;
		if (rdecloc == null);
		else return rdecloc;
		if (cincloc == null);
		else return cincloc;
		if (cdecloc == null);
		else return cdecloc;
		return null;
	}
	public static int[] getStartLocForQueenThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		int[] bsloc = this.getStartLocForBishopThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, true);
		int[] csloc = this.getStartLocForCastleThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, true);
		if (bsloc == null || !(isvalidrorc(bsloc[0]) && isvalidrorc(bsloc[1]))) return csloc;
		else
		{
			if (csloc == null || !(this.isvalidrorc(csloc[0]) && this.isvalidrorc(csloc[1]))) return bsloc;
			else throw new Error("FOUND MORE THAN ONE QUEEN!");
		}
	}
	public static int[] getStartLocForKnightThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		//we can use the all possible knight locs and provied the ending location to get the starting location
		//if it is ambiguous, throw an error that it was ambiguous!
		
		int[][] pktlocs = this.getAllPossibleKnightMoveToLocs(er, ec);
		//if (pktlocs == null) console.log("pktlocs = null");
    	//else if (pktlocs.length < 1) console.log("pktlocs is empty!");
    	//else
    	//{
    	//	console.log("pktlocs.length = " + pktlocs.length);
	    //	for (let x = 0; x < pktlocs.length; x++)
	    //	{
	    //		console.log(this.getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//console.log(this.getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	this.convertRowColToStringLoc(pktlocs[x]));
	    //	}
    	//}
    	//console.log("STARTING LOCATION: " + this.getLocString(sr, sc) + ": " + this.convertRowColToStringLoc(sr, sc));
    	
    	if (pktlocs == null || pktlocs.length < 1)
    	{
    		//check our location if not there return null
    		//ChessPiece cp = this.getPieceAt(er, ec, ArrayList<ChessPiece> mpclist);
			//if (cp == null) return null;
			//else
			//{
			//	if (cp.getType().equals("KNIGHT") && cp.getColor().equals(myclr))
			//	{
			//		//there is already a knight at our end loc
			//		int[] res = new int[2];
			//		res[0] = er;
			//		res[1] = ec;
			//		return res;
			//	}
			//	else return null;
			//}
			return null;
    	}
    	else
    	{
    		//check all of the given locations for a knight that is our color
    		//if there is more than 1 error ambiguous!
    		let keepit = new let[pktlocs.length];
    		for (let x = 0; x < pktlocs.length; x++) keepit[x] = false;
    		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    		for (let x = 0; x < pktlocs.length; x++)
    		{
    			//check our location for the current piece type and color
    			console.log("pktlocs[" + x + "][0] = " + pktlocs[x][0]);
    			console.log("pktlocs[" + x + "][1] = " + pktlocs[x][1]);
    			ChessPiece cp = this.getPieceAt(pktlocs[x][0], pktlocs[x][1], allpcs);
    			if (cp == null);
    			else
    			{
    				if (cp.getType().equals("KNIGHT") && cp.getColor().equals(myclr))
    				{
    					console.log("KEEP IT!");
    					//found one
    					keepit[x] = true;
    					for (let c = 0; c < x; c++)
    					{
    						if (keepit[c]) throw new Error("FOUND MORE THAN ONE KNIGHT!");
    						//else;//do nothing
    					}
    				}
    				//else;//do nothing
    			}
    		}//end of x for loop
    		for (let x = 0; x < pktlocs.length; x++)
    		{
    			if (keepit[x]) return pktlocs[x];
    			//else;//do nothing
    		}
    	}
    	return null;
	}
	public static int[] getStartLocForKingThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let nocsling)
	{
		ChessPiece mkg = this.getCurrentSideKing(myclr, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new Error("OUR SIDE KING MUST NOT BE NULL!");
		//else;//do nothing
		
		int[][] mkgmvlocs = this.getPieceCanMoveToLocs(mkg.getRow(), mkg.getCol(), myclr, "KING",
			ignorelist, addpcs, gid, nocsling, false);
		if (mkgmvlocs == null || mkgmvlocs.length < 1) return null;//king cannot move there
		else
		{
			for (let x = 0; x < mkgmvlocs.length; x++)
			{
				if (mkgmvlocs[x][0] == er && mkgmvlocs[x][1] == ec)
				{
					console.log("KEEP IT");
					console.log("locr = " + mkg.getRow());
					console.log("locc = " + mkg.getCol());
					int[] res = new int[2];
					res[0] = mkg.getRow();
					res[1] = mkg.getCol();
					return res;
				}
				//else;//do nothing
			}
		}
		return null;
	}
	public static int[] getStartLocForPawnThatCanMoveTo(let er, let ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let bpassimnxtmv)
	{
		//it seems the best way is to get all the pawns for the color and then see where they can move to
		//if there is only one that can move to our ending location great, else error or none.
		
		ArrayList<ChessPiece> mypwns = this.getAllPawnsOfColor(myclr, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		//console.log("mypwns = " + mypwns);
		let numpwns = this.getNumItemsInList(mypwns);
		if (numpwns < 1) return null;
		else
		{
			let fndit = false;
			int[] ploc = null;
			for (let p = 0; p < numpwns; p++)
			{
				int[][] pwnmvlocs = mypwns[p].getPieceCanMoveToLocs(ignorelist, addpcs, true, bpassimnxtmv);
				if (pwnmvlocs == null || pwnmvlocs.length < 1);
				else
				{
					//console.log("THIS HAS MOVE LOCS: mypwns[" + p + ") = " + mypwns[p));
					for (let x = 0; x < pwnmvlocs.length; x++)
					{
						//console.log("pwnmvlocs[" + x + "][0] = " + pwnmvlocs[x][0]);
						//console.log("pwnmvlocs[" + x + "][1] = " + pwnmvlocs[x][1]);
						if (pwnmvlocs[x][0] == er && pwnmvlocs[x][1] == ec)
						{
							console.log("KEEP IT!");
							console.log("locr = " + mypwns[p].getRow());
							console.log("locc = " + mypwns[p].getCol());
							if (fndit) throw new Error("FOUND MORE THAN ONE PAWN!");
							else
							{
								fndit = true;
								ploc = new int[2];
								ploc[0] = mypwns[p].getRow();
								ploc[1] = mypwns[p].getCol();
							}
							break;
						}
						//else;//do nothing
					}//end of x for loop
				}
			}//end of p for loop
			return ploc;
		}
	}
	//calls the above methods
	public static int[] getStartLocForPieceThatCanMoveTo(let er, let ec, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, let nocsling, let bpassimnxtmv)
	{
		if (mytpval == null || mytpval.length < 1)
		{
			throw new Error("INVALID TYPE (NULL OR EMPTY) FOUND AND USED HERE!");
		}
		else if (mytpval.equals("CASTLE") || mytpval.equals("ROOK"))
		{
			return this.getStartLocForCastleThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, false);
		}
		else if (mytpval.equals("KING"))
		{
			return this.getStartLocForKingThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, nocsling);
		}
		else if (mytpval.equals("KNIGHT"))
		{
			return this.getStartLocForKnightThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid);
		}
		else if (mytpval.equals("PAWN"))
		{
			return this.getStartLocForPawnThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, bpassimnxtmv);
		}
		else if (mytpval.equals("QUEEN"))
		{
			return this.getStartLocForQueenThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid);
		}
		else if (mytpval.equals("BISHOP"))
		{
			return this.getStartLocForBishopThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, false);
		}
		else throw new Error("INVALID TYPE (" + mytpval + ") FOUND AND USED HERE!");
	}
	
	
	//ARE PIECES FREE TO MOVE AROUND
	
	//asks can piece at loc move around to another location other than the current location
	//if no piece is at the loc returns false
	public static let isPieceAtLocFreeToMoveAround(let sr, let sc, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid, let nocsling, let bpassimnxtmv)
	{
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = this.getPieceAt(sr, sc, allpcs);
		//console.log("sr = " + sr);
		//console.log("sc = " + sc);
		//console.log("cp = " + cp);
		if (cp == null) return false;
		else
		{
			int[][] mvlocs = this.getPieceCanMoveToLocs(sr, sc, cp.getColor(), cp.getType(), ignorelist, addpcs, gid,
				nocsling, bpassimnxtmv);
			if (mvlocs == null || mvlocs.length < 1)
			{
				//console.log("MOVELOCS IS EMPTY!");
				return false;
			}
			else
			{
				//console.log("mvlocs.length = " + mvlocs.length);
				if (mvlocs.length == 1)
				{
					//console.log("mvlocs[0][0] = " + mvlocs[0][0]);
					//console.log("mvlocs[0][1] = " + mvlocs[0][1]);
					if (mvlocs[0][0] == sr && mvlocs[0][1] == sc) return false;
					//else;//do nothing
				}
				//else
				//{
					//for (let x = 0; x < mvlocs.length; x++)
					//{
					//	console.log("mvlocs[" + x + "][0] = " + mvlocs[x][0]);
					//	console.log("mvlocs[" + x + "][1] = " + mvlocs[x][1]);
					//}
				//}
				return true;
			}
		}
	}
	public static let isPieceAtLocFreeToMoveAround(let sr, let sc, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isPieceAtLocFreeToMoveAround(sr, sc, ignorelist, addpcs, gid, false, false);
	}
	
	public static ArrayList<ChessPiece> getPiecesThatAreFreeToMove(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid, let nocsling, let bpassimnxtmv)
	{
		//they can move to a location other than the current location it is on
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		if (this.getNumItemsInList(allpcs) < 1) return null;
		else
		{
			ArrayList<ChessPiece> fpcs = null;
			for (let x = 0; x < allpcs.length; x++)
			{
				if (this.isPieceAtLocFreeToMoveAround(allpcs[x).getRow(), allpcs[x).getCol(),
					ignorelist, addpcs, gid, nocsling, bpassimnxtmv))
				{
					//add to list
					
					if (fpcs == null) fpcs = [];
					//else;//do nothing
					
					fpcs.push(allpcs[x]);
				}
				//else;//do nothing
			}
			return fpcs;
		}
	}
	public static ArrayList<ChessPiece> getPiecesThatAreFreeToMove(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, false, false);
	}
	
	
	//WHERE ALL CAN A SIDE REACH METHODS
	
	public static int[][] getPieceMoveToLocsForLocs(int[][] smvlocs, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (smvlocs == null || smvlocs.length < 1) return null;
		
		//for each location on the smvlocs list get the moveto locs and combine them all then return the list
		int[][][] tempmvlocs = new int[smvlocs.length][2][];
		let numadded = 0;
		for (let x = 0; x < smvlocs.length; x++)
		{
			int[][] mvlocs = this.getPieceCanMoveToLocs(smvlocs[x][0], smvlocs[x][1], myclr, mytpval,
				ignorelist, addpcs, gid, true, false);
			if (mvlocs == null || mvlocs.length < 1) tempmvlocs[x] = null;
			else
			{
				tempmvlocs[x][0] = new int[mvlocs.length];
				tempmvlocs[x][1] = new int[mvlocs.length];
				for (let c = 0; c < mvlocs.length; c++)
				{
					//console.log("mvlocs[" + c + "][0] = " + mvlocs[c][0]);
					//console.log("mvlocs[" + c + "][1] = " + mvlocs[c][1]);
					tempmvlocs[x][0][c] = mvlocs[c][0];
					tempmvlocs[x][1][c] = mvlocs[c][1];
				}
				numadded += mvlocs.length;
			}
		}
		
		int[][] rmvlocs = new int[numadded][2];
		for (let x = 0; x < numadded; x++)
		{
			rmvlocs[x][0] = -1;
			rmvlocs[x][1] = -1;
		}
		let mvi = 0;
		for (let x = 0; x < smvlocs.length; x++)
		{
			if (tempmvlocs[x] == null);
			else
			{
				for (let c = 0; c < tempmvlocs[x][0].length; c++)
				{
					if (this.isLocOnListOfLocs(tempmvlocs[x][0][c], tempmvlocs[x][1][c], rmvlocs));
					else
					{
						rmvlocs[mvi][0] = tempmvlocs[x][0][c];
						rmvlocs[mvi][1] = tempmvlocs[x][1][c];
						mvi++;
					}
				}
			}
		}
		//console.log("mvi = " + mvi);
		
		int[][] rlistmvlocs = new int[mvi][2];
		for (let x = 0; x < mvi; x++)
		{
			rlistmvlocs[x][0] = rmvlocs[x][0];
			rlistmvlocs[x][1] = rmvlocs[x][1];
		}
		//this.printLocsArray(rlistmvlocs, "rlistmvlocs");
		return rlistmvlocs;
	}
	
	public static int[][] getAllLocsThatCanBeReachedByPiece(let sr, let sc, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid, int[][] vlocs)
	{
		//what if our location is already on the vlocs list? need to stop the recursion
		
		//get the piece can move to locations no castling
		//if there are no locations we can move to, then what?
		//
		//if there are locations we can move to, then what?
		//we want to add all of these locations on the rlist of course...
		//we go through all of the locations and for each location:
		//(D7 - F7 and D8 - F8 inclusive on both)
		//where can they go?
		//-on the calling vlist will be the starting location that called it
		//-then we get all the possible moveto locs that these can move to
		//-then we add it to the return list provided it is not already on it
		//
		//  A   B   C   D   E   F   G   H  
		//|---|---|---|---|BKG|---|---|---| 1
		//|---|---|---|---|---|---|---|---| 2
		//|---|---|---|---|---|---|---|---| 3
		//|BPN|---|BPN|---|BPN|---|BPN|---| 4
		//|WPN|---|WPN|---|WPN|---|WPN|---| 5
		//|-4-|-3-|-2-|-2-|-2-|-2-|-2-|-3-| 6
		//|-4-|-3-|-2-|-1-|-1-|-1-|-2-|-3-| 7
		//|-4-|-3-|-2-|-1-|WKG|-1-|-2-|-3-| 8
		//
		//take the initial starting location and get the move to locs for it
		//now take each of the locations (1s) and get their unique move to locs for it
		//now take each of those locations (2s) and get their unique move to locs for it
		//now take each of those locations (3s) and get their unique move to locs for it
		//now take each of those locations (4s) and get their unique move to locs for it
		//repeat until cannot add any new unique locations...
		
		//if we visit all the locations we can move to first, then the starting location will be on the vlocs
		//do not add all locations on vlocs
		//add locations that are not on vlocs
		//the return list will be the vlocs + mvlocs not on vlocs
			
		int[][] mvlocs = this.getPieceCanMoveToLocs(sr, sc, myclr, mytpval, ignorelist, addpcs, gid, true, false);
		//if no mvlocs return vlist
		if (mvlocs == null || mvlocs.length < 1) return null;
		else
		{
			//if all of mvlocs are on the vlist return the vlist
			if (vlocs == null || vlocs.length < 1);
			else
			{
				let allonit = true;
				for (let x = 0; x < mvlocs.length; x++)
				{
					let fndit = false;
					for (let c = 0; c < vlocs.length; c++)
					{
						if (vlocs[c][0] == mvlocs[x][0] &&
							vlocs[c][1] == mvlocs[x][1])
						{
							fndit = true;
							break;
						}
						//else;//do nothing
					}
					if (fndit);
					else
					{
						allonit = false;
						break;
					}
				}
				if (allonit) return null;
				//else;//do nothing
			}
		}
		
		//now determine the unique move to locs that this offers...
		//keep getting it as long as size keeps increasing
		let prevsz = 0;
		int[][] mymvlocs = this.getPieceMoveToLocsForLocs(mvlocs, mytpval, myclr, ignorelist, addpcs, gid);
		//console.log("INIT prevsz = " + prevsz);
		//printLocsArray(mymvlocs, "lvtwomvlocs");
		
		if (mymvlocs == null);
		else
		{
			while(prevsz < mymvlocs.length)
			{
				prevsz = mymvlocs.length;
				//console.log("NEW prevsz = " + prevsz);
				
				mymvlocs = this.getPieceMoveToLocsForLocs(mymvlocs, mytpval, myclr, ignorelist, addpcs, gid);
				//this.printLocsArray(mymvlocs, "mymvlocs");
			}//end of while loop
		}
		
		//console.log("STARTING LOCATION IS " + this.getLocStringAndConvertIt(sr, sc));
		//this.printLocsArray(mymvlocs, "FINAL mymvlocs");
		return mymvlocs;
	}
	public static int[][] getAllLocsThatCanBeReachedByPiece(let sr, let sc, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.getAllLocsThatCanBeReachedByPiece(sr, sc, mytpval, myclr, ignorelist, addpcs, gid, null);
	}
	public int[][] getAllLocsThatCanBeReachedByPiece(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.getAllLocsThatCanBeReachedByPiece(getRow(), getCol(), getType(), getColor(), ignorelist, addpcs, getGameID());
	}
	
	public static int[][] getAllLocsThatCanBeReachedBySide(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		//gets all the pieces for a side...
		//get all of their move to locations for each piece
		//then save a list of all of the unique locations
		ArrayList<ChessPiece> allmypcs = this.getCurrentSidePieces(clrval, gid, ignorelist, addpcs);
		let numallmypcs = this.getNumItemsInList(allmypcs);
		if (numallmypcs < 1) throw new Error("there must be at least a king on one side!");
		//else;//do nothing
		int[][] tmplocslist = new int[64][2];
		for (let x = 0; x < 64; x++)
		{
			tmplocslist[x][0] = -1;
			tmplocslist[x][1] = -1;
		}
		let rszi = 0;
		for (let x = 0; x < numallmypcs; x++)
		{
			int[][] pcmvlocs = allmypcs[x].getAllLocsThatCanBeReachedByPiece(ignorelist, addpcs);
			if (pcmvlocs == null || pcmvlocs.length < 1);
			else
			{
				//add these to the rlist
				for (let c = 0; c < pcmvlocs.length; c++)
				{
					if (this.isLocOnListOfLocs(pcmvlocs[c][0], pcmvlocs[c][1], tmplocslist));
					else
					{
						tmplocslist[rszi][0] = pcmvlocs[c][0];
						tmplocslist[rszi][1] = pcmvlocs[c][1];
						rszi++;
					}
				}
			}
		}
		int[][] rlist = new int[rszi][2];
		for (let x = 0; x < rszi; x++)
		{
			rlist[x][0] = tmplocslist[x][0];
			rlist[x][1] = tmplocslist[x][1];
		}
		return rlist;
	}
	
	
	//SPECIAL MOVES AND MAIN CAN MOVE TO METHODS
	
	
	//DOES NOT TAKE INTO ACCOUNT PAWN PROMOTION AS BEING SPECIAL
	//IF CALLED ON A CASTLE, DOES NOT CONSIDDER CASTLING
	public let isMoveToASpecialMove(let nrval, let ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		let bpassimnxtmv)
	{
		let tpsnospcmvs = ["QUEEN", "BISHOP", "KNIGHT", "CASTLE", "ROOK"];
		if (this.itemIsOnGivenList(getType(), tpsnospcmvs)) return false;
		else
		{
			int[][] allpclocs = this.getPieceCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getType(), ignorelist, addpcs,
				this.getGameID(), false, bpassimnxtmv);
			int[][] normalpclocs = null;
			if (getType().equals("KING"))
			{
				normalpclocs = this.getKingCanMoveToLocs(this.getRow(), this.getCol(),
					this.getColor(), ignorelist, addpcs, this.getGameID());
			}
			else
			{
				//pawn
				normalpclocs = this.getPawnCanMoveToLocs(this.getRow(), this.getCol(),
					this.getColor(), ignorelist, addpcs, this.getGameID());
			}
			let onnrml = false;
			let onall = false;
			if (normalpclocs == null || normalpclocs.length < 1);
			else
			{
				for (let x = 0; x < normalpclocs.length; x++)
				{
					if (normalpclocs[x][0] == nrval && normalpclocs[x][1] == ncval)
					{
						onnrml = true;
						break;
					}
					//else;//do nothing
				}
			}
			if (allpclocs == null || allpclocs.length < 1);
			else
			{
				for (let x = 0; x < allpclocs.length; x++)
				{
					if (allpclocs[x][0] == nrval && allpclocs[x][1] == ncval)
					{
						onall = true;
						break;
					}
					//else;//do nothing
				}
			}
			//to be special it must be on all, but not on normal
			//if it is on all and on normal, then it is normal
			//if it is not on either it is not valid
			return (onall && !onnrml);
		}
	}
	
	
	//NOTE: TAKES INTO ACCOUNT PAWNING WHEN CALLED ON PAWN ONLY, TAKES INTO ACCOUNT CASTLING WHEN CALLED ON KING ONLY,
	//DOES NOT TAKE INTO ACCOUNT WHOSE TURN IT IS
	//TAKES INTO ACCOUNT WHAT THE NEW BOARD LOOKS LIKE, BUT REALLY SHOULD NOT
	public let canMoveTo(let rval, let cval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let bpassimnxtmv)
	{
		if (this.isvalidrorc(rval) && this.isvalidrorc(cval));
		else return false;
		//use current location, piece type, if side is in check or not, and opposing piece locations
		//to determine where I can move or if I can move at all.
		
		int[][] locs = null;
		if (this.getType().equals("BISHOP"))
		{
			//on diagnals only
			locs = this.getBishopCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID());
		}
		else if (this.getType().equals("CASTLE") || this.getType().equals("ROOK"))
		{
			//on same row or col only
			//can castle if the other pieces between the castle and the king are not there and if not in check
			//and if neither castle nor king have moved
			locs = this.getCastleCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID());
		}
		else if (this.getType().equals("QUEEN"))
		{
			//diagnals and on same row or same col
			locs = this.getQueenCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID());
		}
		else if (this.getType().equals("KNIGHT"))
		{
			//has at most 8 possible moves
			//up or down 3 right or left 1
			//up or down 1 right or left 3
			//--*-*--
			//-*---*-
			//---x---
			//-*---*-
			//--*-*--
			locs = this.getKnightCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID());
		}
		else if (this.getType().equals("PAWN"))
		{
			//can only move forward or diagnal one space to attack
			//if it is the first move, can move forward two spaces
			//in passing or EN PASSANT is a form of attack
			//you can only pawn a pawn that has made its first move
			locs = this.getAllPawnCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID(), bpassimnxtmv);
		}
		else if (this.getType().equals("KING"))
		{
			//1 in any direction provided move does not put king in check
			//if in check and king cannot move without being put into check, see if another piece can block it
			//if the king cannot get out of check -> checkmate other side wins.
			//if the king cannot move, but must move -> stalemate tie.
			locs = this.getAllKingCanMoveToLocs(this.getRow(), this.getCol(), this.getColor(), ignorelist, addpcs, this.getGameID());
		}
		else throw new Error("ILLEGAL TYPE FOUND AND USED HERE!");
		if (locs == null || locs.length < 1)
		{
			//console.log("LOCS LIST IS EMPTY!");
			return false;
		}
		else
		{
			for (let x = 0; x < locs.length; x++)
			{
				if (locs[x][0] == rval && locs[x][1] == cval) return true;
				//else;//do nothing
			}
		}
		//console.log("LOC " + this.getLocString(rval, cval) + " NOT FOUND ON THE LIST!");
		return false;
	}
	public let canMoveToLoc(let rval, let cval, int[][] ignorelist)
	{
		return this.canMoveTo(rval, cval, ignorelist, null, false);
	}
	public let canMoveToLoc(let rval, let cval)
	{
		return this.canMoveTo(rval, cval, null, null, false);
	}
	public let canMoveToLoc(int[] nloc)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		else return this.canMoveToLoc(nloc[0], nloc[1]);
	}
	
	
	//CHECKMATE METHODS
	
	//is color side in checkmate
	public static let inCheckmate(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		//KING MUST BE IN CHECK
		//KING CANNOT MOVE OUT OF CHECK
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY MOVING A PIECE IN FRONT OF IT
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY KILLING THE PIECE(S) CHECKING THE KING
		
		ChessPiece mkg = this.getCurrentSideKing(clrval, this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new Error("the king must be found!");
		//else;//do nothing
		
		//can I be directly attacked by the opposing side?
		ArrayList<ChessPiece> epcs = this.getEnemyPiecesGuardingLocation(mkg.getRow(), mkg.getCol(), gid, clrval,
			ignorelist, addpcs);
		//console.log("epcs = " + epcs);
		//is in check
		if (this.getNumItemsInList(epcs) < 1) return false;//not in check so not in checkmate
		//else;//do nothing my king is in check now need to determine if it is checkmate
		console.log("" + clrval + " KING IS IN CHECK!");
		
		//need to know if this king is free to move or rather can move somewhere other than the current location
		if (this.isPieceAtLocFreeToMoveAround(mkg.getRow(), mkg.getCol(), ignorelist, addpcs, gid, true, false)) return false;
		//can move out of check
		//else;//do nothing still in check
		console.log("" + clrval + " KING CANNOT MOVE OUT OF CHECK!");
		
		//can check be blocked
		//does side have no legal moves
		//if there is a legal move other than staying where we are, then it blocks check somehow
		
		ArrayList<ChessPiece> fpcs = this.getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false);
		//console.log("fpcs = " + fpcs);
		
		ArrayList<ChessPiece> myclrfpcs = this.filterListByColor(fpcs, clrval);
		//console.log("myclrfpcs = " + myclrfpcs);
		
		if (this.getNumItemsInList(myclrfpcs) < 1)
		{
			console.log("" + clrval + " HAS NO FREE PIECES! IT CANNOT BLOCK CHECK! IT IS CHECKMATE! " +
				this.getOppositeColor(clrval) + " WINS!");
			return true;
		}
		//else;//do nothing might be able to block check
		
		for (let x = 0; x < myclrfpcs.length; x++)
		{
			//console.log("myclrfpcs[" + x + ") = " + myclrfpcs[x));
			
			int[][] pcmvlocs = this.getPieceCanMoveToLocs(myclrfpcs[x].getRow(), myclrfpcs[x].getCol(), clrval,
				myclrfpcs[x].getType(), ignorelist, addpcs, gid, true, false);
			//printLocsArray(pcmvlocs, "pcmvlocs");
			
			//determine where the piece can move to block check... if it indeed does block check
			if (myclrfpcs[x].getType().equals("KING"))
			{
				throw new Error("the king cannot move out of check, now it says it can!");
			}
			else
			{
				if (1 < pcmvlocs.length)
				{
					console.log("AT LEAST ONE PIECE ON THE " + clrval + " SIDE CAN BLOCK CHECK!");
					return false;
				}
				//else;//do nothing
			}
		}//end of x for loop
		
		console.log("" + clrval + " CANNOT BLOCK CHECK WITH ITS FREE PIECES! IT IS CHECKMATE! " +
			this.getOppositeColor(clrval) + " WINS!");
		return true;
	}
	//is white in checkmate
	public static let inCheckmateWhite(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.inCheckmate("WHITE", ignorelist, addpcs, gid);
	}
	//is black in checkmate
	public static let inCheckmateBlack(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.inCheckmate("BLACK", ignorelist, addpcs, gid);
	}
	
	
	//STALEMATE METHODS
	
	//returns true if less than 2 pieces of that type are on the board
	public static let areAllOfTypeOnSameColorSquare(String typeval, ArrayList<ChessPiece> allpcs)
	{
		ArrayList<ChessPiece> bps = this.getAllOfType(typeval, allpcs);
		if (this.getNumItemsInList(bps) < 2) return true;
		else
		{
			String myfbpclr = this.getColorOfLoc(bps[0]);
			for (let x = 1; x < bps.length; x++)
			{
				if (this.getColorOfLoc(bps[x]).equals(myfbpclr));
				else return false;
			}
			return true;
		}
	}
	
	public static let areAllBishopsOnSameColorSquare(ArrayList<ChessPiece> allpcs)
	{
		return this.areAllOfTypeOnSameColorSquare("BISHOP", allpcs);
	}
	public static let areAllBishopsOnSameColorSquare(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.areAllBishopsOnSameColorSquare(this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static let areAllBishopsOnSameColorSquare(let gid)
	{
		return this.areAllBishopsOnSameColorSquare(this.getAllPiecesWithGameID(gid));
	}
	public let areAllBishopsOnSameColorSquare()
	{
		return this.areAllBishopsOnSameColorSquare(this.getGameID());
	}
	
	public static let isAutoStalemate(ArrayList<ChessPiece> allpcs)
	{
		//if we have just 2 kings -> yes
		//if we have a king and a bishop vs a king -> yes
		//if we have just 2 kings and bishops and bishops are all on the same color squares -> yes
		//if we have a king and a knight vs a king -> yes
		
		//STALEMATE, BUT NOT AUTO STALEMATE:
		//if we 2 kings and a bunch of pawns all blocking each other, but cannot capture each other -> yes
		//if no piece can kill an enemy piece to free up check-mating pieces (pawn, castle, or a queen) -> yes
		//if one side has no legal moves if not checkmate and it is their turn -> yes
		//if checkmate is not possible -> yes
		
		//CHECKMATE IS POSSIBLE:
		//king and 2 bishops (provided bishops are on different color squares) vs king
		//king and 2 knights vs king
		//if we have a king a knight or bishop vs a king and knight or bishop
		//king and queen vs king
		//king and castle vs king
		//checkmate is more likely than stalemate to occur with more pieces in general
		
		ArrayList<ChessPiece> wpcs = this.getCurrentSidePieces("WHITE", allpcs);
		ArrayList<ChessPiece> bpcs = this.getCurrentSidePieces("BLACK", allpcs);
		let wpcstps = this.getPieceTypes(wpcs);
		let bpcstps = this.getPieceTypes(bpcs);
		//king, queen, castle (rook), bishop, knight, pawn
		int[] wpccnts = this.getCountsForEachPieceTypeForASide(wpcstps);
		int[] bpccnts = this.getCountsForEachPieceTypeForASide(bpcstps);
		let numwkgs = this.getCountForPieceTypeForASide(wpccnts, "KING");
		let numbkgs = this.getCountForPieceTypeForASide(bpccnts, "KING");
		let numwbps = this.getCountForPieceTypeForASide(wpccnts, "BISHOP");
		let numbbps = this.getCountForPieceTypeForASide(bpccnts, "BISHOP");
		let numwcs = this.getCountForPieceTypeForASide(wpccnts, "CASTLE");
		let numbcs = this.getCountForPieceTypeForASide(bpccnts, "CASTLE");
		let numwqs = this.getCountForPieceTypeForASide(wpccnts, "QUEEN");
		let numbqs = this.getCountForPieceTypeForASide(bpccnts, "QUEEN");
		let numwkts = this.getCountForPieceTypeForASide(wpccnts, "KNIGHT");
		let numbkts = this.getCountForPieceTypeForASide(bpccnts, "KNIGHT");
		let numwps = this.getCountForPieceTypeForASide(wpccnts, "PAWN");
		let numbps = this.getCountForPieceTypeForASide(bpccnts, "PAWN");
		if (numwkgs == 1 && numbkgs == 1);
		else throw new Error("invalid number of kings on the board!");
		//if there is a castle, a pawn, or a queen on the board: not an automatic stalemate
		if (0 < numwqs || 0 < numbqs || 0 < numwps || 0 < numbps || 0 < numwcs || 0 < numbcs) return false;
		//else;//do nothing this might be an automatic stalemate
		//is king vs king -> yes
		let kgvskg = (numwkgs == 1 && numbkgs == 1 && numwbps < 1 && numbbps < 1 && numwcs < 1 && numbcs < 1 &&
			numwqs < 1 && numbqs < 1 && numwkts < 1 && numbkts < 1 && numwps < 1 && numbps < 1);
		if (kgvskg) return true;
		//is king vs king and knight -> yes
		let kgvskgandkt = (numwkgs == 1 && numbkgs == 1 && ((numwkts == 1 && numbkts < 1) ||
			(numbkts == 1 && numwkts < 1)) && numwps < 1 && numbps < 1 && numwqs < 1 && numbqs < 1 && numwbps < 1 &&
			numbbps < 1 && numwcs < 1 && numbcs < 1);
		if (kgvskgandkt) return true;
		//king and any number of bishops vs king and any number of bishops provided all bishops are on same color square
		let kgsandbps = (numwkgs == 1 && numbkgs == 1 && numwcs < 1 && numbcs < 1 && numwqs < 1 && numbqs < 1 &&
			numwps < 1 && numbps < 1 && numwkts < 1 && numbkts < 1);
		if (kgsandbps && this.areAllBishopsOnSameColorSquare(allpcs)) return true;
		else return false;
	}
	public static let isAutoStalemate(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isAutoStalemate(combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	
	//can an entire side not move
	public static let doesSideHaveNoLegalMoves(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		ArrayList<ChessPiece> fpcs = this.getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false);
		//console.log("fpcs = " + fpcs);
		
		ArrayList<ChessPiece> myclrfpcs = this.filterListByColor(fpcs, clrval);
		//console.log("myclrfpcs = " + myclrfpcs);
		
		if (this.getNumItemsInList(myclrfpcs) < 1)
		{
			console.log("" + clrval + " HAS NO FREE PIECES! IT HAS NO LEGAL MOVES IT CAN MAKE! STALEMATE!");
			return true;
		}
		else return false;
	}
	public static let doesWhiteHaveNoLegalMoves(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.doesSideHaveNoLegalMoves("WHITE", ignorelist, addpcs, gid);
	}
	public static let doesBlackHaveNoLegalMoves(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.doesSideHaveNoLegalMoves("BLACK", ignorelist, addpcs, gid);
	}
	
	
	//THESE CAPTURE METHODS ARE NOT ERROR FREE DUE TO ASSUMPTIONS THEY OPERATE WITH
	
	//how to determine if a situation comes down to just the free pieces?
	//how to determine if a free piece is able to capture an enemy piece through a series of legal moves?
	//-to move a piece on one board only, I could call setLoc which does not register the moves
	//-determine all possible places a piece can get from a certain starting location
	//-then from each of those locations see where it can get and add those locs to the list
	//-ignore castling to speed it up
	//-once the list is complete IE you cannot get to a new location because it is already on the list -> done
	//-now check and see if any enemy pieces are on those locations
	//if it does come down to just the free pieces, and those free pieces generate auto-stalemate -> yes
	//if an entire side cannot move and it is their turn and not checkmate -> yes
	
	//this asks is it possible for a specific side to capture an enemy piece (if the enemy stays in their current positions)
	public static let canSideCaptureAPieceIfEnemyStaysSame(String sideclrtomv, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		//if we can move to an enemy piece's square then yes a capture is possible
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible and not a stalemate.
		
		ArrayList<ChessPiece> myfpcs = this.filterListByColor(
			this.getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false), sideclrtomv);
		let numfpcs = this.getNumItemsInList(myfpcs);
		if (numfpcs < 1)
		{
			//console.log("sideclrtomv = " + sideclrtomv);
			//throw new Error("the side has legal moves, that means that there is at least one piece " +
			//	"that is free, but none were found!");
			return false;
		}
		//else;//do nothing
		
		ArrayList<ChessPiece> allepcs = this.getOpposingSidePieces(sideclrtomv, gid, ignorelist, addpcs);
		int[][] epclocs = this.getLocsFromPieceList(allepcs);
		//this.printLocsArray(epclocs, "epclocs");
		//console.log();
		//console.log("MY SIDE PIECES CAN MOVE TO:");
		for (let x = 0; x < numfpcs; x++)
		{
			int[][] allpossiblemvlocsforpc = myfpcs[x].getAllLocsThatCanBeReachedByPiece(ignorelist, addpcs);
			//console.log("myfpcs[" + x + ") = " + myfpcs[x));
			//this.printLocsArray(allpossiblemvlocsforpc, "allpossiblemvlocsforpc");
			if (allpossiblemvlocsforpc == null || allpossiblemvlocsforpc.length < 2)
			{
				throw new Error("the piece was free meaning it has more than one location " +
					"it can move to, but now it claims it cannot move!");
			}
			else
			{
				for (let r = 0; r < allpossiblemvlocsforpc.length; r++)
				{
					for (let c = 0; c < epclocs.length; c++)
					{
						if (allpossiblemvlocsforpc[r][0] == epclocs[c][0] &&
							allpossiblemvlocsforpc[r][0] == epclocs[c][1])
						{
							//it is possible to kill an enemy piece, therefore not a stalemate
							//console.log("A MATCH IS FOUND!");
							return true;
						}
						//else;//do nothing
					}//end of c for loop
				}//end of r for loop
			}
		}//end of x for loop
		//console.log("NO MATCHES FOUND!");
		return false;
	}
	
	//this asks is a capture possible starting with the given color, then it uses the opposite color
	//white is passed in by default for the color, so white then black or black then white
	public static let canASideCaptureAPieceIfEnemyStaysSame(String sideclrtomv, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return (this.canSideCaptureAPieceIfEnemyStaysSame(sideclrtomv, ignorelist, addpcs, gid) ||
		this.canSideCaptureAPieceIfEnemyStaysSame(this.getOppositeColor(sideclrtomv), ignorelist, addpcs, gid));
	}
	public static let canASideCaptureAPieceIfEnemyStaysSame(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.canASideCaptureAPieceIfEnemyStaysSame("WHITE", ignorelist, addpcs, gid);
	}
	
	//this asks is it possible for both sides to move to a common location (this assumes that both sides move)
	public static let isACapturePossible(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		int[][] wmvlocs = this.getAllLocsThatCanBeReachedBySide("WHITE", ignorelist, addpcs, gid);
		//this.printLocsArray(wmvlocs, "wmvlocs");
		int[][] bmvlocs = this.getAllLocsThatCanBeReachedBySide("BLACK", ignorelist, addpcs, gid);
		//this.printLocsArray(bmvlocs, "bmvlocs");
		if (wmvlocs == null || wmvlocs.length < 1 || bmvlocs == null || bmvlocs.length < 1) return true;//not sure
		//else;//do nothing
		for (let x = 0; x < wmvlocs.length; x++)
		{
			for (let c = 0; c < bmvlocs.length; c++)
			{
				if (wmvlocs[x][0] == bmvlocs[c][0] &&
					wmvlocs[x][1] == bmvlocs[c][1])
				{
					//console.log("THE FIRST CAPTURE LOC FOUND IS: " +
					//	this.getLocStringAndConvertIt(wmvlocs[x][0], wmvlocs[x][1]));
					return true;
				}
				//else;//do nothing
			}
		}
		return false;
	}
	
	
	//MAIN STALEMATE METHODS
	
	//is stalemate side's color's turn to move
	public static let isStalemate(String sideclrtomv, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		//checks to see if both sides are in check starting with the color given then it will check the opposite color
		if (this.isASideInCheck(sideclrtomv, ignorelist, addpcs, gid))
		{
			console.log("ONE SIDE IS IN CHECK! SO NO STALEMATE!");
			return false;
		}
		//else;//do nothing
		console.log("NO SIDE IS IN CHECK!");
		
		if (this.isAutoStalemate(ignorelist, addpcs, gid) ||
			this.doesSideHaveNoLegalMoves(sideclrtomv, ignorelist, addpcs, gid))
		{
			console.log("EITHER THERE ARE NOT ENOUGH PIECES OR THE SIDE WHO IS SUPPOSED TO MOVE CANNOT! " +
				"SO STALEMATE!");
			return true;
		}
		//else;//do nothing
		console.log("THERE ARE ENOUGH PIECES ON THE BOARD! A CAPTURE MIGHT BE POSSIBLE!");
		
		//if it is not possible to make a capture, then the game cannot end in checkmate -> yes it is a stalemate
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible and not a stalemate.
		
		let cppossiblebmvs = this.isACapturePossible(ignorelist, addpcs, gid);
		//console.log("IS A CAPTURE POSSIBLE: " + cppossiblebmvs);
		
		if (cppossiblebmvs || this.canASideCaptureAPieceIfEnemyStaysSame(sideclrtomv, ignorelist, addpcs, gid))
		{
			console.log("IT IS POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE!");
			
			//IF THIS IS THE LAST MOVE IN A COMPLETED GAME AND THE GAME ENDED IN A TIE OR DRAW THEN -> yes
			//OTHERWISE -> no
			//console.log("this.getGame(gid).isCompleted() = " + this.getGame(gid).isCompleted());
			//console.log("this.getGame(gid).isTied() = " + this.getGame(gid).isTied());
			//console.log("this.getGame(gid).isLastMove() = " + this.getGame(gid).isLastMove());
			
			if (this.getGame(gid).isCompleted() && this.getGame(gid).isTied() && this.getGame(gid).isLastMove()) return true;
			else return false;
		}
		else
		{
			console.log("IT IS NOT POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE SO STALEMATE!");
			return true;//cannot capture an enemy piece -> stalemate
		}
	}
	public static let isStalemateWhite(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isStalemate("WHITE", ignorelist, addpcs, gid);
	}
	public static let isStalemateBlack(int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return this.isStalemate("BLACK", ignorelist, addpcs, gid);
	}
	
	
	//SERVER METHODS
	
	public static let isDigit(String wd)
	{
		if (wd == null || wd.length != 1) return false;
		
		const dgts = "0123456789";
		let isdgt = false;
		for (let di = 0; di < dgts.length; di++)
		{
			if (wd[0] === dgts[di]) return true;
			//else;//do nothing
		}
		return false;
	}
	
	//numei is inclusive
	public static int[] getNumStartAndEndIndexs(String wd, let offset)
	{
		if (offset < 0) throw new Error("offset MUST BE AT LEAST ZERO (0)!");
		//else;//do nothing
		let numsi = -1;
		let numei = -1;
		int[] res = new int[2];
		res[0] = -1;
		res[1] = -1;
		for (let i = 0; i < wd.length; i++)
		{
			if (this.isDigit("" + wd.charAt(i)))
			{
				numsi = i;
				break;
			}
			//else;//do nothing
		}
		if (numsi < 0 || wd.length - 1 < numsi) return res;
		for (let i = numsi; i < wd.length; i++)
		{
			if (isDigit("" + wd.charAt(i)))
			{
				if (i + 1 < wd.length);
				else if (i + 1 == wd.length)
				{
					numei = wd.length - 1;
					break;
				}
				else throw new Error("ILLEGAL VALUE FOUND AND USED HERE FOR DIGIT INDEX I!");
			}
			else
			{
				numei = i - 1;
				break;
			}
		}
		if (numei < 0 || numei < numsi || wd.length - 1 < numei)
		{
			throw new Error("END NUMBER INDEX NOT SET CORRECTLY!");
		}
		//else;//do nothing
		res[0] = numsi + offset;
		res[1] = numei + offset;
		return res;
	}
	
	public static let isANumber(String wd)
	{
		if (wd == null || wd.length < 1) return false;
		else
		{
			for (let i = 0; i < wd.length; i++)
			{
				if (this.isDigit("" + wd.charAt(i)));
				else return false;
			}
			return true;
		}
	}
	
	public static String getShortHandNotationForWord(String wd)
	{
		if (wd == null || wd.length < 1) return wd;
		else
		{
			let myspcs = [" ", "\t", "\n"];
			for (let i = 0; i < wd.length; i++)
			{
				if (this.itemIsOnGivenList("" + wd.charAt(i), myspcs))
				{
					throw new Error("THE WORD (" + wd +
						") MUST NOT HAVE SPACING CHARACTERS ON IT, BUT IT DID!");
				}
				//else;//do nothing
			}
			if (wd.equals("CREATE")) return "+";
			else if (wd.equals("DELETE")) return "-";
			else if (wd.equals("HINTS")) return "HINTS";
			else if (this.itemIsOnGivenList(wd, validTypes)) return this.getShortHandType(wd);
			else if (this.itemIsOnGivenList(wd, validColors)) return this.getShortHandColor(wd);
			else if (this.itemIsOnGivenList(wd.substring(0, wd.length - 1), validTypes))
			{
				return this.getShortHandType(wd.substring(0, wd.length - 1)) + wd[wd.length - 1];
			}
			else if (this.itemIsOnGivenList(wd.substring(0, wd.length - 1), validColors))
			{
				return this.getShortHandColor(wd.substring(0, wd.length - 1)) + wd[wd.length - 1];
			}
			else if (wd.equals("SET") || wd.equals("set")) return "S";
			else if (wd.equals("into:") || wd.equals("INTO:")) return "INTO";
			else if (wd.equals("TURN") || wd.equals("turn")) return "T";
			else if (wd.equals("TIE:") || wd.equals("tie:")) return "T";
			else if (wd.equals("to:") || wd.equals("TO:")) return "TO";
			else if (wd.equals("WITH") || wd.equals("with")) return "W";
			else if (wd.equals("WANTS") || wd.equals("wants")) return "W";
			else if (wd.equals("LEFT") || wd.equals("left")) return "L";
			else if (wd.equals("RIGHT") || wd.equals("right")) return "R";
			else if (wd.equals("RESIGNS") || wd.equals("resigns") ||
				wd.equals("SURRENDERS") || wd.equals("surrenders"))
			{
				return "RESIGNS";
			}
			else if (wd.equals("move(s)!") || wd.equals("move(s)") || wd.equals("moves!") || wd.equals("moves") ||
				wd.equals("move!") || wd.equals("move"))
			{
				return "MS";
			}
			else if (wd.equals("at:") || wd.equals("AT:") || wd.equals("AT") || wd.equals("at")) return "";
			else if (this.isANumber(wd)) return wd;
			else
			{
				console.log("wd = " + wd);
				console.log("NOT SURE WHAT TO DO HERE!");
				return "";
			}
		}
	}
	//converts the location to string loc
	public static let getShortHandMoves(let mvs)
	{
		if (mvs == null || mvs.length < 1) return mvs;
		else
		{
			let nwmvs = [];
			for (let c = 0; c < mvs.length; c++)
			{
				String oldmv = "" + mvs[c];
				String nwmv = "";
				let si = 0;
				let addstraight = false;
				for (let i = 0; i < oldmv.length; i++)
				{
					if (oldmv.charAt(i) == ' ' || i + 1 == oldmv.length)
					{
						if (addstraight)
						{
							//console.log("HANDLE ADD STRAIGHT HERE:");
							if (i + 1 == oldmv.length) nwmv += "" + oldmv.substring(si + 1);
							else nwmv += "" + oldmv.substring(si + 1, i);
							addstraight = false;
						}
						else
						{
							if (i + 1 == oldmv.length) nwmv += "" + this.getShortHandNotationForWord(oldmv.substring(si));
							else nwmv += "" + this.getShortHandNotationForWord(oldmv.substring(si, i));
						}
						si = i + 1;
					}
					else if (0 < i && (oldmv.charAt(i) == 'a' ||  oldmv.charAt(i) == 'A') &&
						(oldmv.charAt(i + 1) == 't' || oldmv.charAt(i + 1) == 'T') && oldmv.charAt(i + 2) == ':' &&
						oldmv.charAt(i + 3) == ' ' && oldmv.charAt(i + 4) != '(')
					{
						si = i + 3;
						addstraight = true;
						i = i + 4;
						//console.log("AT: FOUND!");
						//console.log("si = " + si);
					}
					else if (0 < i && oldmv.charAt(i - 1) == ' ' && (oldmv.charAt(i) == 't' ||  oldmv.charAt(i) == 't') &&
						(oldmv.charAt(i + 1) == 'o' || oldmv.charAt(i + 1) == 'O') && oldmv.charAt(i + 2) == ':' &&
						oldmv.charAt(i + 3) == ' ' && oldmv.charAt(i + 4) != '(')
					{
						si = i + 3;
						addstraight = true;
						i = i + 4;
						//console.log("TO: FOUND!");
						//console.log("si = " + si);
						nwmv += "TO";
					}
					else if (0 < i && oldmv.charAt(i) == '(')
					{
						if (oldmv.charAt(i + 1) == 's');
						else
						{
							let cpi = -1;
							for (let k = i + 1; k < oldmv.length; k++)
							{
								if (oldmv.charAt(k) == ')')
								{
									cpi = k;
									break;
								}
								//else;//do nothing
							}
							if (cpi < 0 || cpi < i + 1 || oldmv.length - 1 < cpi)
							{
								throw new Error("ILLEGAL INDEX (" + cpi +
									") FOUND AND USED FOR THE CLOSING PARENTHESIS INDEX!");
							}
							//else;//do nothing
							let myr = -1;
							let myc = -1;
							//get the numstartindex and numendindex
							//console.log("oldmv = " + oldmv);
							//console.log("oldmv.substring(" + i + ", " + cpi + ") = " + oldmv.substring(i, cpi));
							
							int[] snumsieis = this.getNumStartAndEndIndexs(oldmv.substring(i, cpi), i);
							//console.log("snumsieis[0] = " + snumsieis[0]);
							//console.log("snumsieis[1] = " + snumsieis[1]);
							
							myr = Integer.parseInt(oldmv.substring(snumsieis[0], snumsieis[1] + 1));
							int[] enumsieis = this.getNumStartAndEndIndexs(oldmv.substring(snumsieis[1] + 1, cpi),
								snumsieis[1] + 1);
							//console.log("enumsieis[0] = " + enumsieis[0]);
							//console.log("enumsieis[1] = " + enumsieis[1]);
							
							myc = Integer.parseInt(oldmv.substring(enumsieis[0], enumsieis[1] + 1));
							//console.log("myr = " + myr);
							//console.log("myc = " + myc);
							
							nwmv += this.convertRowColToStringLoc(myr, myc, WHITE_MOVES_DOWN_RANKS);
							i = cpi;
							si = cpi + 1;
						}
					}
					//else;//do nothing
				}//end of i for loop
				console.log("oldmv = " + oldmv);
				console.log("nwmv = " + nwmv);
				nwmvs[c] = "" + nwmv;
			}//end of c for loop
			return nwmvs;
		}
	}
	
	public static String convertShortHandMoveToLongVersion(String mv)
	{
		if (mv == null || mv.length < 1) throw new Error("mv must not be empty or null!");
		//else;//do nothing
		
		console.log("mv = " + mv);
		
		String nwmv = "";
		if (mv.charAt(0) == '-') nwmv += "DELETE ";
		else if (mv.charAt(0) == '+') nwmv += "CREATE ";
		else if (mv.charAt(0) == 'W') nwmv += "WHITE ";
		else if (mv.charAt(0) == 'B') nwmv += "BLACK ";
		else if (mv.charAt(0) == 'T') nwmv += "TURN ";
		else if (mv.charAt(0) == 'S') nwmv += "SET ";
		else if (mv.indexOf("UNDO") == 0)
		{
			String retstr = "UNDO " + this.convertShortHandMoveToLongVersion(mv.substring(4));
			console.log("nwmv = " + retstr);
			return retstr;
		}
		else throw new Error("ILLEGAL STARTING CHARACTER FOR THE MOVE!");
		//console.log("OLD nwmv = " + nwmv);
		
		String shtp = null;
		let ei = -1;
		let usetpat = true;
		if (mv.charAt(0) == '-' || mv.charAt(0) == '+' || mv.charAt(0) == 'T' || mv.charAt(0) == 'S')
		{
			//next will be color
			if (mv.charAt(1) == 'W') nwmv += "WHITE ";
			else if (mv.charAt(1) == 'B') nwmv += "BLACK ";
			else throw new Error("ILLEGAL SECOND CHARACTER FOR THE MOVE!");
			
			if (mv.charAt(0) == 'S') usetpat = false;
			else
			{
				if (mv.charAt(2) == 'L' || mv.charAt(2) == 'R')
				{
					ei = 5;
					if (mv.charAt(2) == 'L') nwmv += "LEFT ";
					else nwmv += "RIGHT ";
				}
				else ei = 4;
				
				//next will be type
				shtp = mv.substring(ei - 2, ei);
			}
		}
		else
		{
			//type is next
			if (mv.charAt(1) == 'L' || mv.charAt(1) == 'R')
			{
				ei = 4;
				if (mv.charAt(1) == 'L') nwmv += "LEFT ";
				else nwmv += "RIGHT ";
			}
			else ei = 3;
			shtp = mv.substring(ei - 2, ei);
		}
		if (mv.length == 5)
		{
			nwmv += this.getLongHandType(shtp) + mv.substring(ei);
			//System.out.print("FINAL ");
			console.log("nwmv = " + nwmv);
			return "" + nwmv;
		}
		else if (usetpat) nwmv += this.getLongHandType(shtp) + " at: " + mv.substring(ei, ei + 2) + " ";
		else nwmv += " WANTS TIE: " + mv.charAt(mv.length - 1);
		//console.log("NEW nwmv = " + nwmv);
		if (usetpat)
		{
			//console.log("mv.charAt(ei + 2=" + (ei + 2) + ") = " + mv.charAt(ei + 2));
			//console.log("mv.substring(ei + 6) = " + mv.substring(ei + 6));
			
			//mv.substring(ei + 2, ei + 4)
			if (mv.charAt(ei + 2) == 'T') nwmv += "to: " + mv.substring(ei + 4);
			else if (mv.charAt(ei + 2) == 'W') nwmv += "with " + mv.substring(ei + 3, mv.length - 2) + " move(s)!";
			else if (mv.charAt(ei + 2) == 'I') nwmv += "into: " + this.getLongHandType(mv.substring(ei + 6)); 
			else
			{
				throw new Error("ILLEGAL CHARACTER FOUND AT POSITION FAILED TO CONVERT SHORT HAND " +
					"MOVE TO LONG HAND VERSION!");
			}
		}
		//else;//do nothing for set tie command
		
		//System.out.print("FINAL ");
		console.log("nwmv = " + nwmv);
		return "" + nwmv;
	}
	public static let convertAllShortHandMovesToLongVersion(let mvs)
	{
		if (mvs == null || mvs.length < 1) return mvs;
		else
		{
			let nwmvs = new String[mvs.length];
			for (let x = 0; x < mvs.length; x++)
			{
				nwmvs[x] = this.convertShortHandMoveToLongVersion(mvs[x]);
			}
			return nwmvs;
		}
	}
	
	
	//GEN-MOVETO METHODS
	
	//INDIVIDUAL MOVE TO COMMANDS (MOVETO, CASTLING, PAWNING, CREATE OR DELETE, HINTS, PROMOTION, RESIGNATION, TIEDESIRE)
	
	//CMD_TYPE COLOR TYPE at: LOC_STRING with NUM move(s)!
	public static String genLongOrShortHandDeleteOrCreateCommand(String clr, String tp, let r, let c, let mvscnt,
		let usecreate, let useshort)
	{
		String bgstr = null;
		if (usecreate)
		{
			if (useshort) bgstr = "+";
			else bgstr = "CREATE ";
		}
		else
		{
			if (useshort) bgstr = "-";
			else bgstr = "DELETE ";
		}
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = this.getShortHandType(tp);
		else mytp = "" + tp + " at: ";
		String mymvscntstr = null;
		if (useshort) mymvscntstr = "W" + mvscnt + "MS";
		else mymvscntstr = " with " + mvscnt + " move(s)!";
		String cmd = "" + bgstr + myclr + mytp + this.convertRowColToStringLoc(r, c, this.WHITE_MOVES_DOWN_RANKS) + mymvscntstr;
		return cmd;
	}
	public static String genLongOrShortHandCreateCommand(String clr, String tp, let r, let c, let mvscnt, let useshort)
	{
		return this.genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c, mvscnt, true, useshort);
	}
	public static String genLongOrShortHandDeleteCommand(ChessPiece cp, String errmsg, let throwerr, let useshort)
	{
		if (cp == null)
		{
			if (throwerr)
			{
				if (errmsg == null || errmsg.length < 1)
				{
					throw new Error("the piece must not be null!");
				}
				else throw new Error(errmsg);
			}
			else return null;
		}
		else
		{
			return this.genLongOrShortHandDeleteOrCreateCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(),
				cp.getMoveCount(), false, useshort);
		}
	}
	
	//COLOR TYPE at: START_LOC_STRING to: END_LOC_STRING
	public static String genLongOrShortHandMoveCommandOnlyString(String clr, String tp, let cr, let cc, let nr, let nc,
		let usedir, let useleft, let useshort)
	{
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = this.getShortHandType(tp);
		else mytp = "" + tp + " at: ";
		String dirstr = null;
		if (useleft)
		{
			if (useshort) dirstr = "L";
			else dirstr = "LEFT ";
		}
		else
		{
			if (useshort) dirstr = "R";
			else dirstr = "RIGHT ";
		}
		String dirpart = null;
		if (usedir) dirpart = dirstr;
		else dirpart = "";
		String transolocstr = null;
		if (useshort) transolocstr = "TO";
		else transolocstr = " to: ";
		String cmd = "" + myclr + dirpart + mytp +
			this.convertRowColToStringLoc(cr, cc, this.WHITE_MOVES_DOWN_RANKS) + transolocstr +
			this.convertRowColToStringLoc(nr, nc, this.WHITE_MOVES_DOWN_RANKS);
		return cmd;
	}
	public static String genLongOrShortHandMoveCommandOnlyString(ChessPiece cp, let nr, let nc, let usedir,
		let useleft, String errmsg, let throwerr, let useshort)
	{
		if (cp == null)
		{
			if (throwerr)
			{
				if (errmsg == null || errmsg.length < 1)
				{
					throw new Error("the chess piece must not be null!");
				}
				else throw new Error(errmsg);
			}
			else return null;
		}
		else
		{
			return this.genLongOrShortHandMoveCommandOnlyString(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nr, nc,
				usedir, useleft, useshort);
		}
	}
	
	//TURN PAWN at: LOC_STRING into: NEW_TYPE
	public static String genLongOrShortHandPawnPromotionCommand(String clr, let nr, let nc, String ptpval, let useshort)
	{
		let myvptps = {"QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"};
		String myctpval = null;
		if (this.itemIsOnGivenList(ptpval, myvptps))
		{
			if (ptpval.equals("ROOK")) myctpval = "CASTLE";
			else myctpval = "" + ptpval;
		}
		else throw new Error("CANNOT PROMOTE A PAWN TO GIVEN TYPE (" + ptpval + ")!");
		
		String fpart = null;
		if (useshort) fpart = "T";
		else fpart = "TURN ";
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = "PN";
		else mytp = "PAWN at: ";
		String lpart = null;
		if (useshort) lpart = "INTO";
		else lpart = " into: ";
		String propwncmd = fpart + myclr + mytp + this.convertRowColToStringLoc(nr, nc, this.WHITE_MOVES_DOWN_RANKS) + lpart + myctpval;
		return propwncmd;
	}
	
	//COLOR HINTS
	//COLOR TYPE at: LOC_STRING HINTS
	public static String genLongOrShortHandHintsCommandForPieceOrSide(String clr, String tp, let cr, let cc,
		let useside, let useshort)
	{
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String myhtsstr = null;
		if (useshort) myhtsstr = "HINTS";
		else myhtsstr = " HINTS";
		String cmd = null;
		if (useside) cmd = "" + myclr + myhtsstr;
		else
		{
			String mytp = null;
			if (useshort) mytp = this.getShortHandType(tp);
			else mytp = "" + tp + " at: ";
			cmd = "" + myclr + mytp + this.convertRowColToStringLoc(cr, cc, this.WHITE_MOVES_DOWN_RANKS) + myhtsstr;
		}
		return cmd;
	}
	
	//COLOR RESIGNS
	public static String genLongOrShortHandResignCommand(String clr, let useshort)
	{
		//WHITE RESIGNS
		//BLACK RESIGNS
		//WRESIGNS
		//BRESIGNS
		//0123456789012
		//0         1
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		return "" + myclr + "RESIGNS";
		//return "" + myclr + "SURRENDERS";
	}
	
	//SET COLOR WANTS TIE: VALUE
	public static String genLongOrShortHandTieDesireCommand(String clr, let val, let useshort)
	{
		String myclr = null;
		if (useshort) myclr = this.getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String fpart = null;
		if (useshort) fpart = "S";
		else fpart = "SET ";
		String myboolval = null;
		if (val) myboolval = "1";
		else myboolval = "0";
		String midstr = null;
		if (useshort) midstr = "WT";
		else midstr = "WANTS TIE: ";
		return "" + fpart + myclr + midstr + myboolval;
	}
	
	//DELETE OTHER_COLOR PAWN at: LOC_STRING with NUM move(s)!
	//COLOR DIR_STRING PAWN at: START_LOC_STRING to: END_LOC_STRING
	public static let genPawningMoveToCommand(String clr, let crval, let ccval, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let bpassimnxtmv)
	{
		//PAWNING NOTATION
		//WHITE LEFT PAWN at: current_loc to: next_loc
		//-BPN??W?MVS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
		//WLPNB4TOA3 (DISPLAY TO THE USER)
		//
		
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mpc = this.getPieceAt(crval, ccval, allpcs);
		
		final let useleft = (ncval < ccval);
		
		//make sure we can do this otherwise error out
		if (mpc.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
		else throw new Error("" + mpc + " CANNOT MOVE TO " + this.getLocString(nrval, ncval) + "!");
		
		//if command involves adding or removing a piece we need to include that here...
		ChessPiece epc = mpc.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
		final let useshort = false;
		String delcmd = this.genLongOrShortHandDeleteCommand(epc, "the enemy pawn must not be null!", true, useshort);
		String cmd = this.genLongOrShortHandMoveCommandOnlyString(clr, "PAWN", crval, ccval, nrval, ncval, true,
			useleft, useshort);
		console.log("cmd = " + cmd);
		let mvcmd = new String[2];
		mvcmd[0] = "" + delcmd;
		mvcmd[1] = "" + cmd;
		return this.getShortHandMoves(mvcmd);
	}
	
	//COLOR DIR_STRING CASTLE:
	//COLOR CASTLE at: START_LOC_STRING to: END_LOC_STRING
	//COLOR KING at: START_LOC_STRING to: END_LOC_STRING
	public static let genCastlingMoveToCommand(String clr, let useleft, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
		//WLCE: (DISPLAY TO USER ONLY)
		//WCEA8TOD8
		//WKGE8TOC8
		String dirstr = null;
		if (useleft) dirstr = "LEFT";
		else dirstr = "RIGHT";
		if (this.canSideCastleLeftOrRight(useleft, clr, ignorelist, addpcs, gid));
		else throw new Error("" + clr + " CANNOT CASTLE " + dirstr + "!");
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mkg = this.getCurrentSideKing(clr, allpcs);
		let ncol = -1;
		if (useleft) ncol = 0;
		else ncol = 7;
		ChessPiece clcp = this.getPieceAt(mkg.getRow(), ncol, allpcs);
		int[] ncloc = this.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, clr, ignorelist, addpcs, gid);
		final let useshort = false;
		String ccmvcmd = this.genLongOrShortHandMoveCommandOnlyString(clr, "CASTLE", clcp.getRow(), clcp.getCol(),
			ncloc[0], ncloc[1], false, false, useshort);//usedir, useleft, useshort
		console.log("ccmvcmd = " + ccmvcmd);
		int[] nkgloc = this.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, clr, ignorelist, addpcs, gid);
		String kgmvcmd = this.genLongOrShortHandMoveCommandOnlyString(clr, "KING", mkg.getRow(), mkg.getCol(),
			nkgloc[0], nkgloc[1], false, false, useshort);//usedir, useleft, useshort
		console.log("kgmvcmd = " + kgmvcmd);
		let mvcmd = new String[3];
		mvcmd[0] = "" + clr + " " + dirstr + " CASTLE:";
		mvcmd[1] = "" + ccmvcmd;
		mvcmd[2] = "" + kgmvcmd;
		return this.getShortHandMoves(mvcmd);
	}
	
	
	//MAIN Hlet METHODS SIMILAR TO GEN MOVE TO
	
	//result array will only have one item on it
	public static let genHintsCommandForPiece(String clr, String tp, let crval, let ccval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//HINTS NOTATION:
		//COLOR TYPE at: STRINGLOC HINTS
		//WPNA5HINTS
		ArrayList<ChessPiece> allpcs = this.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mpc = this.getPieceAt(crval, ccval, allpcs);
		if (mpc == null) throw new Error("there must be a piece at the location!");
		else
		{
			if (mpc.getColor().equals(clr) && mpc.getType().equals(tp));
			else throw new Error("piece obtained does not match the color and-or the type!");
		}
		String cmd = this.genLongOrShortHandHintsCommandForPieceOrSide(clr, tp, crval, ccval, false, false);
		console.log("cmd = " + cmd);
		let htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return this.getShortHandMoves(htscmd);
	}
	public static let genHintsCommandForPiece(String clr, String tp, int[] loc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		else return this.genHintsCommandForPiece(clr, tp, loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static let genHintsCommandForPiece(ChessPiece cp, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.genHintsCommandForPiece(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), cp.getGameID(),
			ignorelist, addpcs);
	}
	public let genHintsCommandForPiece(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return this.genHintsCommandForPiece(this, ignorelist, addpcs);
	}
	public let genHintsCommandForPiece()
	{
		return this.genHintsCommandForPiece(null, null);
	}
	
	//result array will only have one item on it
	public static let genHintsCommandForSide(String clr)
	{
		String cmd = this.genLongOrShortHandHintsCommandForPieceOrSide(clr, null, -1, -1, true, false);
		console.log("cmd = " + cmd);
		let htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return this.getShortHandMoves(htscmd);
	}
	public static let genHintsCommandForWhite()
	{
		return this.genHintsCommandForSide("WHITE");
	}
	public static let genHintsCommandForBlack()
	{
		return this.genHintsCommandForSide("BLACK");
	}
	public let genHintsCommandForSide()
	{
		return this.genHintsCommandForSide(this.getColor());
	}
	
	//result array will only have one item on it
	public static let getFullResignationCommand(String clr)
	{
		String cmd = this.genLongOrShortHandResignCommand(clr, false);
		console.log("cmd = " + cmd);
		let htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return this.getShortHandMoves(htscmd);
	}
	
	//result array will only have one item on it
	public static let getFullTieCommand(String clr, let val, let useshort)
	{
		String cmd = this.genLongOrShortHandTieDesireCommand(clr, val, useshort);
		console.log("cmd = " + cmd);
		let htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return this.getShortHandMoves(htscmd);
	}
	
	
	//COMMAND TYPE METHODS
	
	public static String getTypeOfMoveCommand(String usrcmd)
	{
		if (usrcmd == null || usrcmd.length < 2)
		{
			throw new Error("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
		}
		//else;//do nothing
		if (usrcmd.charAt(0) == '+') return "CREATE";
		else if (usrcmd.charAt(0) == '-') return "DELETE";
		else if (usrcmd.charAt(0) == 'S') return "TIEDESIRE";
		else if (0 < usrcmd.indexOf("RESIGNS") && usrcmd.indexOf("RESIGNS") < usrcmd.length &&
			(usrcmd.length == 8 || usrcmd.length == 13))
		{
			return "RESIGN";
		}
		else if (usrcmd.charAt(1) == 'L' || usrcmd.charAt(1) == 'R')
		{
			if (usrcmd.charAt(2) == 'P') return "PAWNING";
			else return "CASTLEING";
		}
		else if (usrcmd.charAt(0) == 'T') return "PROMOTION";
		else if (usrcmd.indexOf("TO") == 5 || usrcmd.indexOf("TO") == 3) return "MOVE";
		else if (usrcmd.indexOf("HINTS") == 5 || usrcmd.indexOf("HINTS") == 1) return "HINTS";
		else throw new Error("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
	}
	
	public static String getOverallTypeOfCommand(let mycmd)
	{
		let tps = new String[mycmd.length];
		for (let x = 0; x < mycmd.length; x++) tps[x] = this.getTypeOfMoveCommand(mycmd[x]);
		let mysmtps = ["CASTLEING", "PAWNING", "PROMOTION", "HINTS", "RESIGN", "TIEDESIRE"];
		for (let x = 0; x < mycmd.length; x++)
		{
			if (this.itemIsOnGivenList(tps[x], mysmtps)) return "" + tps[x];
			//else;//do nothing
		}
		for (let x = 0; x < mycmd.length; x++)
		{
			if (tps[x].equals("MOVE")) return "" + tps[x];
			//else;//do nothing
		}
		if (tps.length == 1) return "" + tps[0];
		else throw new Error("ILLEGAL COMMAND TYPE FOUND AND USED HERE!");
	}
	
	public static let getMoveCommandTypes()
	{
		let mvtps = ["MOVE", "CASTLEING", "PAWNING", "PROMOTION"];
		return mvtps;
	}
	public static let isCommandTypeAMoveCommand(String cmdtp)
	{
		return this.itemIsOnGivenList(cmdtp, this.getMoveCommandTypes());
	}
	
	public static let getSideColorOrTypesForMoves(let[] mymvs, let usecolor)
	{
		//SHORT HAND EXAMPLES
		//WPNA5TOA6 (MOVE)
		//-BPNA6W2MS (CREATE OR DELETE)
		//TBPNH8INTOQN (PROMOTION)
		//WLCE: (CASTLING)
		//WLPNB4TOA3 (PAWNING)
		//WHINTS (HINTS)
		//BPNH8HINTS (HINTS)
		
		//- FOR DELETE
		//+ FOR CREATE
		
		if (mymvs == null || mymvs.length < 1) return null;
		else
		{
			let myclrs = new String[mymvs.length];
			let mytps = new String[mymvs.length];
			for (let n = 0; n < mymvs.length; n++)
			{
				mytps[n] = null;
				myclrs[n] = null;
				let mytpsforcmd = new String[mymvs[n].length];
				for (let x = 0; x < mymvs[n].length; x++) mytpsforcmd[x] = this.getTypeOfMoveCommand(mymvs[n][x]);
				let addedtp = false;
				let pci = -1;
				if (mytpsforcmd == null || mytpsforcmd.length < 1 || 3 < mytpsforcmd.length)
				{
					throw new Error("the type was an illegal length!");
				}
				else
				{
					if (mytpsforcmd.length == 1)
					{
						mytps[n] = "" + mytpsforcmd[0];
						pci = 0;
						addedtp = true;
					}
					else
					{
						for (let x = 0; x < mytpsforcmd.length; x++)
						{
							if (mytpsforcmd[x].equals("PAWNING") || mytpsforcmd[x].equals("CASTLEING") ||
								mytpsforcmd[x].equals("HINTS"))
							{
								mytps[n] = "" + mytpsforcmd[x];
								pci = x;
								addedtp = true;
								break;
							}
							//else;//do nothing
						}
					}
				}
				
				let mvi = -1;
				if (addedtp) mvi = pci;
				else
				{
					//GIVEN TYPES OF STEPS FOR ONE MOVE COMMAND: DELETE MOVE PROMOTE -> WHAT IS THE OVERALL TYPE?
					//IT WILL NEVER BE DELETE. WE WILL USE PROMOTION OVER MOVE.
					for (let x = 0; x < mytpsforcmd.length; x++)
					{
						//console.log("mytpsforcmd[" + x + "] = " + mytpsforcmd[x]);
						if (mytpsforcmd[x].equals("PROMOTION"))
						{
							mytps[n] = "PROMOTION";
							addedtp = true;
							mvi = x;
							break;
						}
						//else;//do nothing
					}
					
					if (addedtp);
					else
					{
						for (let x = 0; x < mytpsforcmd.length; x++)
						{
							//console.log("mytpsforcmd[" + x + "] = " + mytpsforcmd[x]);
							if (mytpsforcmd[x].equals("MOVE"))
							{
								mytps[n] = "MOVE";
								addedtp = true;
								mvi = x;
								break;
							}
							//else;//do nothing
						}
						
						if (addedtp);
						else throw new Error("AN INVALID TYPE OR INVALID COMMAND WAS FOUND HERE!");
					}
				}
				
				if (mytps[n] == null || mytps[n].length < 1)
				{
					throw new Error("the type must have already been set!");
				}
				else
				{
					//console.log("mytps[" + n + "] = " + mytps[n]);
					let clrzeroimytps = ["CASTLEING", "PAWNING", "HINTS", "MOVE", "RESIGN"];
					let clrci = -1;
					if (this.itemIsOnGivenList(mytps[n], clrzeroimytps)) clrci = 0;
					else clrci = 1;//promotion
					myclrs[n] = this.getLongHandColor("" + mymvs[n][mvi].charAt(clrci));
					//console.log("myclrs[" + n + "] = " + myclrs[n]);
				}
			}//end of n for loop
			if (usecolor) return myclrs;
			else return mytps;
		}
	}
	public static let getSideColorsForMoves(let[] mymvs)
	{
		return this.getSideColorOrTypesForMoves(mymvs, true);
	}
	public static let getSideTypesForMoves(let[] mymvs)
	{
		return this.getSideColorOrTypesForMoves(mymvs, false);
	}
	
	
	//MAIN GEN MOVE TO COMMAND METHODS
	
	public static let genMoveToCommand(String clr, String tp, let crval, let ccval, let nrval, let ncval, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv, String ptpval, let bpassimnxtmv)
	{
		//SHORT HAND EXAMPLES
		//WPNA5TOA6
		//WCEA5TOA6
		//WQNA5TOA6
		//WKGA5TOA6
		//WKTA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
		//WBPA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
		
		//RESIGN NOTATION:
		//WHITE RESIGNS
		//WRESIGNS
		
		//SUPPOSE A CAPTURE WERE TO BE MADE LET US SAY A BLACK PAWN IS AT A6 AND WE CAN KILL IT
		//SHORT HAND EXAMPLES
		//-BPNA6W2MS (MUST BE DONE FIRST)
		//WCEA5TOA6 (DISPLAY TO THE USER)
		
		//PROMOTION NOTATION:
		//TURN COLOR PAWN at: STRINGLOC into: OTHERTYPE
		//TURN BLACK PAWN at: H8 into: QUEEN
		//TBPNH8INTOQN
		
		//CASTLING MOVETO NOTATION
		//WHITE LEFT CASTLE at: A8 to: D8 AND KING at: E8 to: C8
		//WLCEA8TOD8ANDKGE8TOC8
		//
		//OR:
		//
		//WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
		//WLCE: (DISPLAY TO USER ONLY)
		//WCEA8TOD8
		//WKGE8TOC8
		//
		//OR:
		//
		//WLCEA8TOD8
		//WKGE8TOC8
		//
		//WHITE RIGHT CASTLE
		//WRCE:
		//WCEH8TOF8
		//WKGE8TOG8
		//
		//OR:
		//
		//WRCEH8TOF8
		//WKGE8TOG8
		
		
		//PAWNING NOTATION
		//WHITE LEFT PAWN at: current_loc to: next_loc
		//-BPWN??W?MVS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
		//WLPNB4TOA3 (DISPLAY TO THE USER)
		//
		//WHITE RIGHT PAWN at: current_loc to: next_loc
		//-BPWN??W?MVS
		//WRPNB4TOA3
		//
		//BLACK LEFT PAWN at: current_loc to: next_loc
		//-WPWN??W?MVS
		//BLPNB5TOA6
		//
		
		//- FOR DELETE
		//+ FOR CREATE
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mpc = getPieceAt(crval, ccval, allpcs);
		if (mpc == null) throw new Error("there must be a piece at the location!");
		//cannot handle special moves if called with certain pieces it might recognize a special move is possible
		//to detect a special move, we need to get the generic move set, and the full move set, the difference is the
		//special set
		if (mpc.canMoveTo(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
		{
			if ((mpc.getType().equals("CASTLE") && usecslingasmv) ||
				mpc.isMoveToASpecialMove(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
			{
				console.log("MOVE IS A SPECIAL MOVE!");
				if (mpc.getType().equals("KING") || (mpc.getType().equals("CASTLE") && usecslingasmv))
				{
					console.log("WE ARE CASTLING!");
					
					let useleft = false;
					if (mpc.getType().equals("KING")) useleft = (ncval < ccval);
					else
					{
						//(mpc.getType().equals("CASTLE") && usecslingasmv)
						//we called it on a castle and told it we want to castle
						//there are two castles for each side
						//if the castle is left of the king it will be left
						//if the castle is right of the king it will be right
						ChessPiece mkg = mpc.getMySideKing();
						useleft = (mpc.getCol() < mkg.getCol());
					}
					console.log("useleft = " + useleft);
					
					return genCastlingMoveToCommand(clr, useleft, gid, ignorelist, addpcs);
				}
				else if (mpc.getType().equals("PAWN"))
				{
					return genPawningMoveToCommand(clr, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, bpassimnxtmv);
				}
				else throw new Error("THIS PIECE TYPE (" + mpc.getType() + ") HAS NO SPECIAL MOVES!");
			}
			//else;//do nothing safe to proceed
		}
		else throw new Error("" + mpc + " CANNOT MOVE TO " + getLocString(nrval, ncval) + "!");
		let canpropawn = canPawnBePromotedAt(nrval, ncval, mpc.getColor(), mpc.getType());
		console.log("canpropawn = " + canpropawn);
		
		//if command involves adding or removing a piece we need to include that here...
		ChessPiece ecp = getPieceAt(nrval, ncval, allpcs);
		let usedelcmd = true;
		final let useshort = false;
		String delcmd = genLongOrShortHandDeleteCommand(ecp, null, false, useshort);
		if (delcmd == null) usedelcmd = false;
		//else;//do nothing
		String cmd = genLongOrShortHandMoveCommandOnlyString(clr, tp, crval, ccval, nrval, ncval, false, false, useshort);
		console.log("cmd = " + cmd);
		let mxcnt = 0;
		if (usedelcmd)
		{
			if (canpropawn) mxcnt = 3;
			else mxcnt = 2;
		}
		else
		{
			if (canpropawn) mxcnt = 2;
			else mxcnt = 1;
		}
		let mvcmd = new String[mxcnt];
		String propwncmd = null;
		if (canpropawn) propwncmd = genLongOrShortHandPawnPromotionCommand(mpc.getColor(), nrval, ncval, ptpval, useshort);
		//else;//do nothing
		if (usedelcmd)
		{
			mvcmd[0] = "" + delcmd;
			mvcmd[1] = "" + cmd;
			if (canpropawn) mvcmd[2] = "" + propwncmd;
			//else;//do nothing
		}
		else
		{
			mvcmd[0] = "" + cmd;
			if (canpropawn) mvcmd[1] = "" + propwncmd;
			//else;//do nothing
		}
		return getShortHandMoves(mvcmd);
		//return convertAllShortHandMovesToLongVersion(getShortHandMoves(mvcmd));
	}
	public static let genMoveToCommand(String clr, String tp, let crval, let ccval, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, false, ptpval, false);
	}
	public static let genMoveToCommand(String clr, String tp, let crval, let ccval, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, false, "QUEEN", false);
	}
	public static let genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv, String ptpval)
	{
		if (cloc == null || cloc.length != 2)
		{
			throw new Error("You need to provide the current chess piece location!");
		}
		//else;//do nothing
		if (nloc == null || nloc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		
		return genMoveToCommand(clr, tp, cloc[0], cloc[1], nloc[0], nloc[1], gid, ignorelist, addpcs,
			usecslingasmv, ptpval, false);
	}
	public static let genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(clr, tp, cloc, nloc, gid, ignorelist, addpcs, false, ptpval);
	}
	public static let genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(clr, tp, cloc, nloc, gid, ignorelist, addpcs, false, "QUEEN");
	}
	public static let genMoveToCommand(ChessPiece cp, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv, String ptpval)
	{
		if (cp == null)
		{
			throw new Error("You need to provide the current chess piece location and the new location!");
		}
		else
		{
			return genMoveToCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nrval, ncval,
				gid, ignorelist, addpcs, usecslingasmv, ptpval, false);
		}
	}
	public static let genMoveToCommand(ChessPiece cp, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public static let genMoveToCommand(ChessPiece cp, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, false, ptpval);
	}
	public static let genMoveToCommand(ChessPiece cp, let nrval, let ncval,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, false, "QUEEN");
	}
	public static let genMoveToCommand(ChessPiece cp, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv, String ptpval)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		
		if (cp == null)
		{
			throw new Error("You need to provide the current chess piece location and the new location!");
		}
		else
		{
			return genMoveToCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nloc[0], nloc[1],
				gid, ignorelist, addpcs, usecslingasmv, ptpval, false);
		}
	}
	public static let genMoveToCommand(ChessPiece cp, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public static let genMoveToCommand(ChessPiece cp, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, false, ptpval);
	}
	public static let genMoveToCommand(ChessPiece cp, int[] nloc,
		let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, false, "QUEEN");
	}
	//non-static version convenience method
	public let genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		let usecslingasmv, String ptpval)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new Error("You need to provide the next chess piece location!");
		}
		else return genMoveToCommand(this, nloc, getGameID(), ignorelist, addpcs, usecslingasmv, ptpval);
	}
	public let genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let usecslingasmv)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public let genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, false, ptpval);
	}
	public let genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, false, "QUEEN");
	}
	public let genMoveToCommand(int[] nloc, let usecslingasmv, String ptpval)
	{
		return genMoveToCommand(nloc, null, null, usecslingasmv, ptpval);
	}
	public let genMoveToCommand(int[] nloc, let usecslingasmv)
	{
		return genMoveToCommand(nloc, usecslingasmv, "QUEEN");
	}
	public let genMoveToCommand(int[] nloc, String ptpval)
	{
		return genMoveToCommand(nloc, false, ptpval);
	}
	public let genMoveToCommand(int[] nloc)
	{
		return genMoveToCommand(nloc, false, "QUEEN");
	}
	public let genMoveToCommand(let nrval, let ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		let usecslingasmv, String ptpval)
	{
		return genMoveToCommand(this, nrval, ncval, getGameID(), ignorelist, addpcs, usecslingasmv, ptpval);
	}
	public let genMoveToCommand(let nrval, let ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		let usecslingasmv)
	{
		return genMoveToCommand(this, nrval, ncval, getGameID(), ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public let genMoveToCommand(let nrval, let ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(nrval, ncval, ignorelist, addpcs, false);
	}
	public let genMoveToCommand(let nrval, let ncval, let usecslingasmv)
	{
		return genMoveToCommand(nrval, ncval, null, null, usecslingasmv);
	}
	public let genMoveToCommand(let nrval, let ncval)
	{
		return genMoveToCommand(nrval, ncval, false);
	}
	
	
	//UNDO OR REDO COMMANDS
	
	public static String genUndoMoveToCommandForMoveCommand(String mvcmdonly, let redoit)
	{
		if (mvcmdonly == null || mvcmdonly.length < 9 || 10 < mvcmdonly.length)
		{
			throw new Error("illegal move or pawning command found and used here!");
		}
		//else;//do nothing
		
		//add undo in front of it for starters
		//it will most likely be a move to command
		//might be pawning or changing types
		
		//PAWNING NOTATION
		//WCEA5TOA6 (MOVING)
		//WLPNB4TOA3 (PAWING)
		//0123456789
		let si = -1;
		if (mvcmdonly.charAt(1) == 'L' || mvcmdonly.charAt(1) == 'R') si = 4;//handle pawning
		else si = 3;//handle normal moveto
		String myretstr = null;
		if (redoit) myretstr = "";
		else myretstr = "UNDO";
		myretstr += mvcmdonly.substring(0, si) + mvcmdonly.substring(si + 4) +
			mvcmdonly.substring(si + 2, si + 4) + mvcmdonly.substring(si, si + 2);
		return myretstr;
	}
	
	public static String genUndoMoveToCommandForCreateDeleteCommand(String cdelmvcmdonly)
	{
		if (cdelmvcmdonly == null || cdelmvcmdonly.length < 10 || 12 < cdelmvcmdonly.length)
		{
			console.log("cdelmvcmdonly = " + cdelmvcmdonly);
			throw new Error("illegal create or delete command found and used here!");
		}
		//else;//do nothing
		
		if (cdelmvcmdonly.charAt(0) == '+' || cdelmvcmdonly.charAt(0) == '-')
		{
			//EXPECTED FORMAT FOR A DELETE OR CREATE COMMAND:
			//-BPWN??W?MVS
			//+BPWN??W?MVS
			//-BPNA6W2MS
			//0123456789
			String mc = null;
			if (cdelmvcmdonly.charAt(0) == '+') mc = "-";
			else mc = "+";
			return "" + mc + cdelmvcmdonly.substring(1);
		}
		else
		{
			console.log("cdelmvcmdonly = " + cdelmvcmdonly);
			throw new Error("illegal create or delete command found and used here!");
		}
	}
	
	public static String genUndoMoveToCommandForPromotionCommand(String promvcmdonly, let redoit)
	{
		if (promvcmdonly == null)
		
		if (promvcmdonly == null || promvcmdonly.length != 12)
		{
			console.log("promvcmdonly = " + promvcmdonly);
			if (promvcmdonly == null);
			else console.log("promvcmdonly.length = " + promvcmdonly.length);
			throw new Error("illegal promotion command found and used here!");
		}
		//else;//do nothing
		
		//promotion
		//TWPNA1INTOQN
		//012345678901
		//0         1
		String myretstr = null;
		if (redoit) myretstr = "";
		else myretstr = "UNDO";
		myretstr += promvcmdonly.substring(0, 2) + promvcmdonly.substring(10) +
			promvcmdonly.substring(4, 10) + promvcmdonly.substring(2, 4);
		return myretstr;
	}
	
	public static String genUndoMoveToCommandForResignationCommand(String mvcmdonly, let redoit)
	{
		if (redoit) return "" + mvcmdonly;
		else return "UNDO" + mvcmdonly;
	}
	
	public static String genUndoMoveToCommandForTieDesireCommand(String mvcmdonly, let redoit)
	{
		String fpart = mvcmdonly.substring(0, mvcmdonly.length - 1);
		String valstr = null;
		if (mvcmdonly.charAt(mvcmdonly.length - 1) == '0') valstr = "1";
		else if (mvcmdonly.charAt(mvcmdonly.length - 1) == '1') valstr = "0";
		else throw new Error("invalid value found and used here!");
		return fpart + valstr;
	}
	
	//MAIN UNDO COMMAND METHODS
	
	public static let genUndoMoveToShortHandCommand(let mvcmd, let redoit, let remundo)
	{
		if (mvcmd == null) return null;
		
		//the new undo command will be the asme size as the the move command
		//if we delete a piece, we want to create a piece
		//if we castle we want to uncastle???
		//if we pawn we want to create the piece we took and put our piece back
		//if we promoted a pawn, we make it a pawn again
		//
		//CASTLING NOTATION
		//WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
		//WLCE: (DISPLAY TO USER ONLY)
		//WCEA8TOD8
		//WKGE8TOC8
		//
		//PAWNING NOTATION
		//WHITE LEFT PAWN at: current_loc to: next_loc
		//-BPWN??W?MVS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
		//WLPNB4TOA3 (DISPLAY TO THE USER)
		//
		//PROMOTION NOTATION:
		//TURN COLOR PAWN at: STRINGLOC into: OTHERTYPE
		//TURN BLACK PAWN at: H8 into: QUEEN
		//TBPNH8INTOQN
		//
		//SHORT HAND EXAMPLES
		//WPNA5TOA6
		//WCEA5TOA6
		//WQNA5TOA6
		//WKGA5TOA6
		//WKTA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
		//WBPA5TOA6 (NOT LEGAL, BUT EXAMPLE ONLY)
		//
		//SUPPOSE A CAPTURE WERE TO BE MADE LET US SAY A BLACK PAWN IS AT A6 AND WE CAN KILL IT
		//SHORT HAND EXAMPLES
		//-BPNA6W2MS (MUST BE DONE FIRST)
		//WCEA5TOA6 (DISPLAY TO THE USER)
		//
		//- FOR DELETE
		//+ FOR CREATE
		//
		//TO UNDO DIFFERENT TYPES OF COMMANDS:
		//
		//FOR A DELETE COMMAND:
		//-BPWN??W?MVS (BEFORE UNDO)
		//+BPWN??W?MVS (AFTER UNDO) (THE ONLY DIFFERENCE IS INSTEAD OF A - WE NOW HAVE A +)
		//
		//DELETE <COLOR> <TYPE> at: STRINGLOC with <MOVE_COUNT> move(s)!
		//CREATE <COLOR> <TYPE> at: STRINGLOC with <MOVE_COUNT> move(s)!
		//
		//FOR A MOVETO COMMAND:
		//WCEA5TOA6
		//   old new
		//UNDOWCEA6TOA5 (and decrement the move count)
		//       new old
		//
		//<COLOR> <TYPE> at: STRINGLOC to: STRINGLOC
		//
		//TO UNDO CASTLING:
		//ADD UNDO IN FRONT OF ALL OF IT
		//THEN SWAP THE LOCATIONS ON THE MOVES ONLY DECREMENT KING MOVE COUNT
		//UNDOWLCE: (DISPLAY TO USER ONLY)
		//UNDOWCEA8TOD8
		//UNDOWKGE8TOC8 (decrements the move count for the king only because we only incremented that for the king)
		//
		//TO UNDO PAWNING OR A CAPTURE:
		//FIRST SWAP THE TWO PARTS OF THE MOVE
		//ADD UNDO TO THE MOVE ITSELF
		//FOR THE DELETE CHANGE IT TO CREATE OR - TO + AND VISE-VERSAS IF APPLICABLE
		//
		//UNDOWLPNA3TOB4 (decrements the move count)
		//+BPWN??W?MVS
		//
		//TO UNDO A CAPTURE:
		//
		//UNDO THE MOVE FIRST:
		//UNDOWCEA6TOA5 (decrements the move count)
		//+BPWN??W?MVS
		
		let undomvs = new String[mvcmd.length];
		for (let x = 0; x < mvcmd.length; x++) console.log("mvcmd[" + x + "] = " + mvcmd[x]);
		if (redoit && remundo)
		{
			for (let x = 0; x < mvcmd.length; x++)
			{
				if (mvcmd[x].indexOf("UNDO") == 0) undomvs[x] = mvcmd[x].substring(4);
				else undomvs[x] = "" + mvcmd[x];
			}
			return genUndoMoveToShortHandCommand(undomvs, redoit, false);
		}
		//else;//do nothing
		if (mvcmd.length == 3)
		{
			//castling or capture and promotion
			if (mvcmd[0].equals("WLCE:") || mvcmd[0].equals("WRCE:") || mvcmd[0].equals("BLCE:") || mvcmd[0].equals("BRCE:"))
			{
				//castling
				for (let x = 0; x < mvcmd.length; x++)
				{
					if (x == 0)
					{
						if (redoit) undomvs[x] = "" + mvcmd[x];
						else undomvs[x] = "UNDO" + mvcmd[x];
					}
					else undomvs[x] = genUndoMoveToCommandForMoveCommand(mvcmd[x], redoit);
				}	
			}
			else
			{
				//handle the capture and promotion case here
				//capture move promotion
				//TWPNA1INTOQN
				//012345678901
				//0         1
				if (redoit)
				{
					//capture move promote is the order we want
					undomvs[0] = genUndoMoveToCommandForCreateDeleteCommand(mvcmd[2]);
					undomvs[1] = genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit);
					undomvs[2] = genUndoMoveToCommandForPromotionCommand(mvcmd[0], redoit);
				}
				else
				{
					//undoit demote move back uncapture order is used
					undomvs[0] = genUndoMoveToCommandForPromotionCommand(mvcmd[2], redoit);
					undomvs[1] = genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit);
					undomvs[2] = genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]);
				}
			}
		}
		else if (mvcmd.length == 2)
		{
			//move and promote or
			//some sort of capture was involved
			//swap the order
			let sai = -1;
			if (redoit) sai = 1;
			else sai = 0;
			if (mvcmd[sai].charAt(0) == '+' || mvcmd[sai].charAt(0) == '-')
			{
				if (redoit)
				{
					undomvs[0] = genUndoMoveToCommandForCreateDeleteCommand(mvcmd[1]);
					undomvs[1] = genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit);
				}
				else
				{
					//undoit
					//capture
					undomvs[0] = genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit);
					undomvs[1] = genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]);
				}
			}
			else
			{
				if (redoit)
				{
					//move and promote order is used
					undomvs[0] = genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit);
					undomvs[1] = genUndoMoveToCommandForPromotionCommand(mvcmd[0], redoit);
				}
				else
				{
					//undoit
					//move and promote -> demote then move back order is used
					undomvs[0] = genUndoMoveToCommandForPromotionCommand(mvcmd[1], redoit);
					undomvs[1] = genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit);
				}
			}
		}
		else if (mvcmd.length == 1)
		{
			if (mvcmd[0].charAt(0) == '+' || mvcmd[0].charAt(0) == '-')
			{
				undomvs[0] = genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]);
			}
			else if (mvcmd[0].charAt(0) == 'T')
			{
				undomvs[0] = genUndoMoveToCommandForPromotionCommand(mvcmd[0], redoit);
			}
			else
			{
				//add undo in front of it for starters
				//it will most likely be a move to command
				//might be pawning or changing types
				String cmdtp = getTypeOfMoveCommand(mvcmd[0]);
				if (cmdtp.equals("RESIGN")) undomvs[0] = genUndoMoveToCommandForResignationCommand(mvcmd[0], redoit);
				else if (cmdtp.equals("TIEDESIRE")) undomvs[0] = genUndoMoveToCommandForTieDesireCommand(mvcmd[0], redoit);
				else undomvs[0] = genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit);
			}
		}
		else
		{
			throw new Error("illegal number of commands found and used here! Everything must be " +
				"executed as one command!");
		}
		for (let x = 0; x < undomvs.length; x++) console.log("undomvs[" + x + "] = " + undomvs[x]);
		return undomvs;
	}
	public static let genUndoMoveToLongHandCommand(let mvcmd, let redoit, let remundo)
	{
		return convertAllShortHandMovesToLongVersion(genUndoMoveToShortHandCommand(
			getShortHandMoves(mvcmd), redoit, remundo));
	}
	public static let genUndoMoveToShortHandCommand(let mvcmd)
	{
		return genUndoMoveToShortHandCommand(mvcmd, false, false);
	}
	public static let genUndoMoveToLongHandCommand(let mvcmd)
	{
		return genUndoMoveToLongHandCommand(mvcmd, false, false);
	}
	//redo calls undo
	public static let genRedoMoveToLongHandCommand(let mvcmd)
	{
		return genUndoMoveToLongHandCommand(mvcmd, true, true);
	}
	public static let genRedoMoveToShortHandCommand(let mvcmd)
	{
		return genUndoMoveToShortHandCommand(mvcmd, true, true);
	}
	
	
	//GEN FULL MOVE COMMAND FROM DISPLAYED COMMAND METHODS
	
	//TAKES A SIMPLIFIED VERSION OF THE COMMAND AND FULLY EXPANDS IT TO INCLUDE ALL THE STEPS
	//RETURNS SHORTHAND VERSION ONLY
	
	//ONLY CONVERTS COMMANDS IN SHORT HAND NOTATION
	public static let genFullMoveCommandFromDisplayedCommand(String usrcmd, let gid, String ptpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let iswhitedown, let bpassimnxtmv)
	{
		//CASTLING NOTATION:
		//WLCE:
		//WRCE:
		//BLCE:
		//BRCE:
		//take that and generate the move to commands needed for it as well
		//WCEA8TOD8
		//WKGE8TOC8
		
		//PAWNING NOTATION:
		//WLPNB4TOA3
		//0123456789
		//
		//take that and generate the delete command needed before it
		
		//PROMOTION NOTATION: (YOU ARE DONE, JUST RETURN IT)
		//TBPNH8INTOQN
		//012345678901
		//0         1
		
		//MOVE NOTATION:
		//WCEA5TOA6
		//WCETOA6
		//012345678
		//
		//needs to know if moving there requires a capture or not
		//needs to know if moving there results in a promotion for the pawn or not
		//if we are promoting a pawn, need to know what to promote it to
		
		//HINTS NOTATIONS: (YOU ARE DONE, JUST RETURN IT)
		//WHINTS
		//BPNH8HINTS
		//0123456789
		
		//CREATE OR DELETE NOTATIONS: (YOU ARE DONE, JUST RETURN IT)
		//-BPN??W?MS
		//+BPN??W?MS
		//0123456789
		
		console.log("usrcmd = " + usrcmd);
		if (usrcmd.equals("UNDO"))
		{
			//get the unofficial move
			//if unofficial move is empty we want to take the last official move and make it unofficial
			//then take the unofficial move and generate the command to undo it...
			//then we need to generate the full undo commands
			//let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
			return getGame(gid).genCommandToUndoLastMadeMove();
		}
		else if (usrcmd.equals("REDO"))
		{
			return getGame(gid).genCommandToRedoLastUndoneMove();
		}
		//else;//do nothing safe to proceed
		
		String cmdtp = getTypeOfMoveCommand(usrcmd);
		console.log("cmdtp = " + cmdtp);
		
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		if (cmdtp.equals("HINTS") || cmdtp.equals("CREATE") || cmdtp.equals("DELETE") || cmdtp.equals("PROMOTION"))
		{
			let si = -1;
			let ei = -1;
			let resstr = new String[1];
			if (cmdtp.equals("HINTS"))
			{
				if (usrcmd.length == 6)
				{
					resstr[0] = "" + usrcmd;
					console.log("resstr[0] = " + resstr[0]);
					return resstr;
				}
				else
				{
					si = 3;
					ei = 5;
				}
			}
			else
			{
				si = 4;
				ei = 6;
			}
			console.log("si = " + si);
			console.log("ei = " + ei);
			
			String slocstr = usrcmd.substring(si, ei);
			String nwusrcmd = null;
			console.log("OLD slocstr = " + slocstr);
			
			int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
			console.log("sloc[0] = " + sloc[0]);
			console.log("sloc[1] = " + sloc[1]);
			
			slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
			console.log("NEW slocstr = " + slocstr);
			
			nwusrcmd = usrcmd.substring(0, si) + slocstr + usrcmd.substring(ei);
			console.log("nwusrcmd = " + nwusrcmd);
			
			resstr[0] = "" + nwusrcmd;
			console.log("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp.equals("RESIGN"))
		{
			let resstr = new String[1];
			resstr[0] = "" + usrcmd;
			console.log("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp.equals("PAWNING"))
		{
			String myclr = "" + usrcmd.charAt(0);
			String fullclr = getLongHandColor(myclr);
			let useleft = (usrcmd.charAt(1) == 'L');
			String slocstr = usrcmd.substring(4, 6);
			int[] sloc = null;
			String nwusrcmd = null;
			console.log("OLD slocstr = " + slocstr);
			
			//BLPNB5TOA6
			//BLPNTOA6
			//0123456789
			
			if (usrcmd.indexOf("TO") == 4)
			{
				//need to get the starting location
				String elocstr = usrcmd.substring(6);
				//calculate sloc from eloc;
				int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				console.log("myclr = " + myclr);
				console.log("mytp = PAWN");
				console.log("elocstr = " + elocstr);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				
				sloc = getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr, "PAWN",
					ignorelist, addpcs, gid, false, bpassimnxtmv);
				if (sloc == null)
				{
					throw new Error("THERE MUST BE A STARTING LOCATION IN ORDER FOR PAWN TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
				console.log("NEW slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 4) + slocstr + usrcmd.substring(4, 6) + 
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			else sloc = convertStringLocToRowCol(slocstr, iswhitedown);
			console.log("sloc[0] = " + sloc[0]);
			console.log("sloc[1] = " + sloc[1]);
			
			ChessPiece cp = getPieceAt(sloc[0], sloc[1], allpcs);
			if (cp == null) throw new Error("the current pawn must not be null!");
			else
			{
				if (cp.getType().equals("PAWN") && cp.getColor().equals(fullclr));
				else throw new Error("the current pawn was not of the correct type and color!");
			}
			
			if (cp.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
			else throw new Error("you cannot pawn!");
			
			ChessPiece ep = cp.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
			if (ep == null) throw new Error("the enemy pawn must not be null!");
			else
			{
				if (ep.getType().equals("PAWN") && ep.getColor().equals(getOppositeColor(fullclr)));
				else throw new Error("the enemy pawn was not of the correct type and color!");
			}
			
			String delcmd = genLongOrShortHandDeleteCommand(ep, "the enemy pawn must not be null!", true, true);
			let resstr = new String[2];
			resstr[0] = "" + delcmd;
			if (nwusrcmd == null || nwusrcmd.length < 1) resstr[1] = "" + usrcmd;
			else resstr[1] = "" + nwusrcmd;
			console.log("resstr[0] = " + resstr[0]);
			console.log("resstr[1] = " + resstr[1]);
			return resstr;
		}
		else if (cmdtp.equals("CASTLEING"))
		{
			let resstr = new String[3];
			resstr[0] = "" + usrcmd;
			//need to generate the two move to commands
			String myclr = "" + usrcmd.charAt(0);
			String fullclr = getLongHandColor(myclr);
			let useleft = (usrcmd.charAt(1) == 'L');
			let mccol = -1;
			if (useleft) mccol = 0;
			else mccol = 7;
			ChessPiece mkg = getCurrentSideKing(fullclr, allpcs);
			if (canSideCastleLeftOrRight(useleft, fullclr, ignorelist, addpcs, gid));
			else throw new Error("CANNOT CASTLE!");
			
			if (mkg.getCol() == 4 && (mkg.getRow() == 7 || mkg.getRow() == 0));
			else throw new Error("CANNOT CASTLE! KING IS NOT AT THE CORRECT POSITION!");
			int[] ncsloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, fullclr, ignorelist, addpcs, gid);
			//console.log("ncsloc[0] = " + ncsloc[0]);
			//console.log("ncsloc[1] = " + ncsloc[1]);
			String cslcmd = genLongOrShortHandMoveCommandOnlyString(fullclr, "CASTLE", mkg.getRow(), mccol,
				ncsloc[0], ncsloc[1], false, false, true);
			int[] nkgloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, fullclr, ignorelist, addpcs, gid);
			//console.log("nkgloc[0] = " + nkgloc[0]);
			//console.log("nkgloc[1] = " + nkgloc[1]);
			String kgcmd = genLongOrShortHandMoveCommandOnlyString(mkg, nkgloc[0], nkgloc[1], false, false,
				"THE KING MUST NOT BE NULL!", true, true);
			resstr[1] = "" + cslcmd;
			resstr[2] = "" + kgcmd;
			console.log("resstr[0] = " + resstr[0]);
			console.log("resstr[1] = " + resstr[1]);
			console.log("resstr[2] = " + resstr[2]);
			return resstr;
		}
		else if (cmdtp.equals("MOVE"))
		{
			//need to determine if the move is actually a special move
			//need to determine if the move results in a capture
			//need to determine if the move results in a pawn getting promoted
			
			//if type is not a pawn, then no promotion
			//see if it is a pawn and the move is a special move
			//-if so, then it is pawning...
			//-if it is pawning convert it to pawning format and return that result instead
			//-need to insert the direction in between the color and the rest of the move to command
			
			//static canPawnBePromotedAt(let nrval, let ncval, String clrval, String tpval)
			//non-static isMoveToASpecialMove(let nrval, let ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
			//if type is king, and we can determine that the move is a special move, then convert it to castling notation
			
			String myclr = "" + usrcmd.charAt(0);
			String mytp = usrcmd.substring(1, 3);
			String fullclr = getLongHandColor(myclr);
			String slocstr = null;
			String elocstr = null;
			String nwusrcmd = null;
			int[] sloc = null;
			int[] eloc = null;
			let esi = -1;
			if (usrcmd.indexOf("TO") == 3)
			{
				elocstr = usrcmd.substring(5);
				//calculate sloc from eloc;
				eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				console.log("myclr = " + myclr);
				console.log("mytp = " + mytp);
				console.log("elocstr = " + elocstr);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				sloc = getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr, getLongHandType(mytp),
					ignorelist, addpcs, gid, false, bpassimnxtmv);
				if (sloc == null)
				{
					throw new Error("THERE MUST BE A STARTING LOCATION IN ORDER FOR " +
						getLongHandType(mytp) + " TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
				console.log("slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 3) + slocstr + usrcmd.substring(3, 5) +
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			else
			{
				slocstr = usrcmd.substring(3, 5);
				elocstr = usrcmd.substring(7);
				console.log("slocstr = " + slocstr);
				console.log("elocstr = " + elocstr);
				
				eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				sloc = convertStringLocToRowCol(slocstr, iswhitedown);
				console.log("sloc[0] = " + sloc[0]);
				console.log("sloc[1] = " + sloc[1]);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				
				nwusrcmd = usrcmd.substring(0, 3) + convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS) +
					usrcmd.substring(5, 7) + convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			
			//console.log("gid = " + gid);
			
			ChessPiece cp = getPieceAt(sloc[0], sloc[1], allpcs);
			if (cp == null) throw new Error("the current piece must not be null!");
			else
			{
				if (cp.getType().equals(getLongHandType(mytp)) && cp.getColor().equals(fullclr));
				else throw new Error("the current piece was not of the correct type and color!");
			}
			
			if (cp.isMoveToASpecialMove(eloc[0], eloc[1], ignorelist, addpcs, bpassimnxtmv))
			{
				//determine if it is castling or pawning
				//need the direction
				//then can generate the correct command
				//then call this method with the correct command
				let usecsling = cp.getType().equals("KING");
				let useleft = (eloc[1] < sloc[1]);
				String dirstr = null;
				if (useleft) dirstr = "L";
				else dirstr = "R";
				String nwcmd = null;
				if (usecsling) nwcmd = "" + myclr + dirstr + "CE:";
				else nwcmd = "" + myclr + dirstr + usrcmd.substring(1);
				return genFullMoveCommandFromDisplayedCommand(nwcmd, gid, ptpval, ignorelist, addpcs,
					iswhitedown, bpassimnxtmv);
			}
			//else;//do nothing safe to proceed
			
			let canpropawn = canPawnBePromotedAt(eloc[0], eloc[1], fullclr, cp.getType());
			String propawncmd = null;
			if (canpropawn)
			{
				//TBPNH8INTOQN
				
				let myvptps = {"QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"};
				String myctpval = null;
				if (itemIsOnGivenList(ptpval, myvptps))
				{
					if (ptpval.equals("ROOK")) myctpval = "CASTLE";
					else myctpval = "" + ptpval;
					myctpval = getShortHandType(myctpval);
				}
				else
				{
					let myovptps = {"QN", "BP", "CE", "KT"};
					if (itemIsOnGivenList(ptpval, myvptps)) myctpval = "" + ptpval;
					else throw new Error("CANNOT PROMOTE A PAWN TO GIVEN TYPE (" + ptpval + ")!");
				}
				
				propawncmd = "T" + usrcmd.substring(0, 3) +
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS) + "INTO" + myctpval;
				console.log("propawncmd = " + propawncmd);
			}
			//else;//do nothing
			
			//if command involves adding or removing a piece we need to include that here...
			ChessPiece ecp = getPieceAt(eloc[0], eloc[1], allpcs);
			String delcmd = null;
			let usedelcmd = true;
			if (ecp == null) usedelcmd = false;
			else
			{
				if (ecp.getColor().equals(getOppositeColor(cp.getColor())));
				else throw new Error("enemy piece must be different than our color!");
				
				delcmd = genLongOrShortHandDeleteCommand(ecp, "the enemy piece must not be null!", true, true);
				console.log("delcmd = " + delcmd);
			}
			
			let mxsz = 1;
			if (usedelcmd) mxsz++;
			if (canpropawn) mxsz++;
			let resstr = new String[mxsz];
			if (usedelcmd)
			{
				resstr[0] = "" + delcmd;
				if (nwusrcmd == null) resstr[1] = "" + usrcmd;
				else resstr[1] = "" + nwusrcmd;
				if (canpropawn) resstr[2] = "" + propawncmd;
			}
			else
			{
				if (nwusrcmd == null) resstr[0] = "" + usrcmd;
				else resstr[0] = "" + nwusrcmd;
				if (canpropawn) resstr[1] = "" + propawncmd;
			}
			for (let x = 0; x < mxsz; x++) console.log("resstr[" + x + "] = " + resstr[x]);
			return resstr;
		}
		else throw new Error("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
	}
	public static let genFullMoveCommandFromDisplayedCommand(String usrcmd, let gid, String ptpval,
		let iswhitedown, let bpassimnxtmv)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, gid, ptpval, null, null, iswhitedown, bpassimnxtmv);
	}
	public static let genFullMoveCommandFromDisplayedCommand(String usrcmd, let gid)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, gid, "QUEEN", null, null, WHITE_MOVES_DOWN_RANKS, false);
	}
	public let genFullMoveCommandFromDisplayedCommand(String usrcmd, String ptpval)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, getGameID(), ptpval, null, null, WHITE_MOVES_DOWN_RANKS, false);
	}
	public let genFullMoveCommandFromDisplayedCommand(String usrcmd)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, "QUEEN");
	}
	
	
	public static int[][] getNewIgnoreListFromCommand(let mvcmds, let iswhitedown)
	{
		if (mvcmds == null || mvcmds.length < 1) return null;
		else
		{
			let tpcmds = new String[mvcmds.length];
			let numskp = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				tpcmds[x] = getTypeOfMoveCommand(mvcmds[x]);
				if (tpcmds[x].equals("HINTS") || tpcmds[x].equals("CASTLEING") || tpcmds[x].equals("TIEDESIRE") ||
					tpcmds[x].equals("RESIGN"))
				{
					numskp++;
				}
				//else;//do nothing
			}
			int[][] ignorelist = new int[mvcmds.length - numskp][2];
			let igi = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				String slocstr = null;
				if (tpcmds[x].equals("CREATE") || tpcmds[x].equals("DELETE"))
				{
					//-BPN??W?MS
					//+BPN??W?MS
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
				}
				else if (tpcmds[x].equals("PAWNING"))
				{
					//PAWNING NOTATION
					//WLPNB4TOA3
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
				}
				else if (tpcmds[x].equals("MOVE"))
				{
					//MOVE NOTATION
					//WPNB4TOA3
					//012345678
					slocstr = mvcmds[x].substring(3, 5);
				}
				else if (tpcmds[x].equals("PROMOTION"))
				{
					//PROMOTION NOTATION:
					//TBPNH8INTOQN
					//012345678901
					//0         1
					slocstr = mvcmds[x].substring(4, 6);
				}
				//else;//do nothing
				
				if (slocstr == null);
				else
				{
					int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
					ignorelist[igi][0] = sloc[0];
					ignorelist[igi][1] = sloc[1];
					igi++;
				}
			}//end of second x for loop
			if (igi == ignorelist.length) return ignorelist;
			else throw new Error("illegal number of ignore locs found and used here!");
		}
	}
	
	public static ArrayList<ChessPiece> getNewAddPiecesListFromCommand(let mvcmds,
		ArrayList<ChessPiece> oldaddpcs, let gid, let iswhitedown)
	{
		if (mvcmds == null || mvcmds.length < 1) return oldaddpcs;
		else
		{
			let tpcmds = new String[mvcmds.length];
			let numskp = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				tpcmds[x] = getTypeOfMoveCommand(mvcmds[x]);
				if (tpcmds[x].equals("HINTS") || tpcmds[x].equals("CASTLEING") || tpcmds[x].equals("TIEDESIRE") ||
					tpcmds[x].equals("RESIGN"))
				{
					numskp++;
				}
				//else;//do nothing
			}
			
			ArrayList<ChessPiece> addpcs = null;
			let keepit = null;
			let numoldaddpcs = getNumItemsInList(oldaddpcs);
			if (numoldaddpcs < 1);
			else
			{
				keepit = new let[numoldaddpcs];
				for (let x = 0; x < numoldaddpcs; x++) keepit[x] = true;
			}
			
			for (let x = 0; x < mvcmds.length; x++)
			{
				String slocstr = null;
				String elocstr = null;
				if (tpcmds[x].equals("DELETE"))
				{
					//-BPN??W?MS
					//+BPN??W?MS
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
					int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
					let fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (let p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs[p).getRow() == sloc[0] &&
								oldaddpcs[p).getCol() == sloc[1])
							{
								fndit = true;
								keepit[p] = false;
								break;
							}
							//else;//do nothing
						}
					}
				}
				else if (tpcmds[x].equals("PAWNING") || tpcmds[x].equals("MOVE"))
				{
					let si = -1;
					if (tpcmds[x].equals("PAWNING"))
					{
						//PAWNING NOTATION
						//WLPNB4TOA3
						//0123456789
						slocstr = mvcmds[x].substring(4, 6);
						elocstr = mvcmds[x].substring(8);
						si = 2;
					}
					else if (tpcmds[x].equals("MOVE"))
					{
						//MOVE NOTATION
						//WPNB4TOA3
						//012345678
						slocstr = mvcmds[x].substring(3, 5);
						elocstr = mvcmds[x].substring(7);
						si = 1;
					}
					else throw new Error("THE TYPE MUST BE MOVE OR PAWNING, BUT NOW IT IS NOT!");
					
					int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
					int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
					//if old piece was on the add list, setLoc to eloc
					//else add it at that loc with at least 2 moves
					
					let fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (let p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs[p).getRow() == sloc[0] &&
								oldaddpcs[p).getCol() == sloc[1])
							{
								fndit = true;
								oldaddpcs[p).setLoc(eloc[0], eloc[1], true);
								//oldaddpcs[p).incrementMoveCount();//not sure if we want to do this or not
								break;
							}
							//else;//do nothing
						}
					}
					if (fndit);
					else
					{
						String clrval = getLongHandColor("" + mvcmds[x].charAt(0));
						String ntpstr = getLongHandType(mvcmds[x].substring(si, si + 2));
						if (addpcs == null) addpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.add(new ChessPiece(ntpstr, clrval, eloc[0], eloc[1], gid, 1, false));
					}
				}
				else if (tpcmds[x].equals("PROMOTION") || tpcmds[x].equals("CREATE"))
				{
					//PROMOTION NOTATION:
					//TBPNH8INTOQN
					//012345678901
					//0         1
					slocstr = mvcmds[x].substring(4, 6);
					String ntpstr = getLongHandType(mvcmds[x].substring(10));
					String clrval = getLongHandColor("" + mvcmds[x].charAt(1));
					int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
					//PROMOTION if our piece is on the addlist already, just call setType()
					//if not create the new piece use 1 for the default moves made unless provided
					let initmvcnt = -1;
					let addit = true;
					if (tpcmds[x].equals("CREATE"))
					{
						String mymvcntstr = mvcmds[x].substring(7, mvcmds[x].indexOf("MS"));
						initmvcnt = Integer.parseInt(mymvcntstr);
					}
					else
					{
						initmvcnt = 1;
						let fndit = false;
						if (numoldaddpcs < 1);
						else
						{
							for (let p = 0; p < numoldaddpcs; p++)
							{
								if (oldaddpcs[p).getRow() == sloc[0] &&
									oldaddpcs[p).getCol() == sloc[1])
								{
									fndit = true;
									oldaddpcs[p).setType(ntpstr);
									initmvcnt = oldaddpcs[p).getMoveCount();
									break;
								}
								//else;//do nothing
							}
						}
						if (fndit) addit = false;
						//else;//do nothing
					}
					
					//+BPN??W?MS
					//0123456789
					
					if (addit)
					{
						if (addpcs == null) addpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.add(new ChessPiece(ntpstr, clrval, sloc[0], sloc[1], gid, initmvcnt, false));
					}
					//else;//do nothing
				}
				//else;//do nothing
			}//end of second x for loop
			if (numoldaddpcs < 1);
			else
			{
				for (let x = 0; x < numoldaddpcs; x++)
				{
					if (keepit[x])
					{
						if (addpcs == null) addpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.add(oldaddpcs[x));
					}
					//else;//do nothing
				}
			}
			return addpcs;
		}
	}
	
	//calls genFullMoveCommandFromDisplayedCommand and allows the user to specify what types
	//they want to promote the pawns to when the time comes
	//if no types are given or not enough types are given queen is used by default
	public static let[] genFullMoveCommands(let mvcmds, let gid, let promotps,
		let iswhitedown, let bpassimnxtmv)
	{
		if (mvcmds == null || mvcmds.length < 1) return null;
		
		let[] myfullcmds = new String[mvcmds.length][];
		let ptpvali = 0;
		String ptpval = "QUEEN";
		int[][] ignorelist = null;
		ArrayList<ChessPiece> addpcs = null;
		for (let x = 0; x < mvcmds.length; x++)
		{
			let canpropawn = false;
			//WCEA5TOA6
			//WCETOA6
			//012345678
			//CTPSS--EE
			ptpval = "QUEEN";
			String clrval = getLongHandColor("" + mvcmds[x].charAt(0));
			if (mvcmds[x].charAt(1) == 'L' || mvcmds[x].charAt(1) == 'R');
			else
			{
				String cmdtp = getTypeOfMoveCommand(mvcmds[x]);
				console.log("mvcmds[" + x + "] = " + mvcmds[x]);
				console.log("cmdtp = " + cmdtp);
				
				if (cmdtp.equals("MOVE"))
				{
					String tpval = getLongHandType(mvcmds[x].substring(1, 3));
					let esi = -1;
					if (mvcmds[x].charAt(3) == 'T') esi = 5;
					else esi = 7;
					int[] eloc = convertStringLocToRowCol(mvcmds[x].substring(esi), iswhitedown);
					canpropawn = canPawnBePromotedAt(eloc[0], eloc[1], clrval, tpval);
				}
				//else;//do nothing
			}
			if (canpropawn)
			{
				if (promotps == null || promotps.length < 1);
				else
				{
					if (ptpvali < promotps.length)
					{
						ptpval = promotps[ptpvali];
						ptpvali++;
					}
					//else;//do nothing
				}
			}
			//else;//do nothing
			myfullcmds[x] = genFullMoveCommandFromDisplayedCommand(mvcmds[x], gid, ptpval, ignorelist, addpcs,
				iswhitedown, bpassimnxtmv);
			
			//generate the new ignorelist taking into account the new commands without actually making the moves
			//if you want to get rid of the piece, you could just ignore it and make sure it is not on the add list
			//-if it is on the add list, then remove it.
			//to move a piece to a new location: ignore current loc, then add the piece to the add list at the new loc
			//-if piece is already on the add list, then just set its location to the new location
			
			//ignorelist = new int[1][2];
			for (let p = 0; p < myfullcmds[x].length; p++)
			{
				console.log("myfullcmds[" + x + "][" + p + "] = " + myfullcmds[x][p]);
			}
			printLocsArray(ignorelist, "OLD ignorelist");
			
			//if the location gets converted then that flips the iswhitedown variable
			//if the location does not get converted then the iswhitedown variable stays the same
			
			let noloccnv = (iswhitedown == WHITE_MOVES_DOWN_RANKS);
			//if true, no conversion took place
			//if false, the conversion already took place
			console.log("iswhitedown = " + iswhitedown);
			console.log("WHITE_MOVES_DOWN_RANKS = " + WHITE_MOVES_DOWN_RANKS);
			console.log("noloccnv = " + noloccnv);
			
			let nwiswhitedown = false;
			if (noloccnv) nwiswhitedown = iswhitedown;
			else nwiswhitedown = !iswhitedown;
			console.log("nwiswhitedown = " + nwiswhitedown);
			
			int[][] nwiglist = getNewIgnoreListFromCommand(myfullcmds[x], nwiswhitedown);
			
			printPiecesList(addpcs, false, "OLD ");
			printLocsArray(nwiglist, "nwiglist");
			
			addpcs = getNewAddPiecesListFromCommand(myfullcmds[x], addpcs, gid, nwiswhitedown);
			
			printPiecesList(addpcs, false, "NEW ");
			
			ignorelist = combineIgnoreLists(ignorelist, nwiglist);
			printLocsArray(ignorelist, "NEW ignorelist");
		}
		return myfullcmds;
	}
	
	//this converts the locations from the full move commands given to this if needed
	//this does not verify if the commands are legal and are ASSUMED TO BE LEGAL
	//all commands must be in SHORT HAND NOTATION
	public static let[] convertAllLocationsForFullMoveCommands(let[] mvcmds, let iswhitedown)
	{
		//CASTLING NOTATION:
		//WLCE:
		//WRCE:
		//BLCE:
		//BRCE:
		//take that and generate the move to commands needed for it as well
		//WCEA8TOD8
		//WKGE8TOC8
		
		//PAWNING NOTATION:
		//WLPNB4TOA3
		//0123456789
		//
		//take that and generate the delete command needed before it
		
		//PROMOTION NOTATION: (YOU ARE DONE, JUST RETURN IT)
		//TBPNH8INTOQN
		//012345678901
		//0         1
		
		//MOVE NOTATION:
		//WCEA5TOA6
		//WCETOA6
		//012345678
		//
		//needs to know if moving there requires a capture or not
		//needs to know if moving there results in a promotion for the pawn or not
		//if we are promoting a pawn, need to know what to promote it to
		
		//HINTS NOTATIONS: (YOU ARE DONE, JUST RETURN IT)
		//WHINTS
		//BPNH8HINTS
		//0123456789
		
		//RESIGNATION NOTATION:
		//WRESIGNS
		//01234567
		
		//TIE DESIRE NOTATION:
		//SWWT0
		//SBWT1
		//01234
		
		//CREATE OR DELETE NOTATIONS: (YOU ARE DONE, JUST RETURN IT)
		//-BPN??W?MS
		//+BPN??W?MS
		//0123456789
		
		if (mvcmds == null || mvcmds.length < 1) return null;
		else
		{
			//if we do not need a conversion return the input unchanged
			//else make the changes below
			if (iswhitedown == WHITE_MOVES_DOWN_RANKS) return mvcmds;
			//else;//do nothing
			
			let[] nwmvcmds = new String[mvcmds.length][];
			//for (let n = 0; n < mvcmds.length; n++)
			//{
			//	for (let x = 0; x < mvcmds[n].length; x++)
			//	{
			//		console.log("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
			//	}
			//}
			//console.log();
			
			for (let n = 0; n < mvcmds.length; n++)
			{
				let cmdtps = new String[mvcmds[n].length];
				let resstr = new String[mvcmds[n].length];
				for (let x = 0; x < mvcmds[n].length; x++)
				{
					cmdtps[x] = getTypeOfMoveCommand(mvcmds[n][x]);
					console.log("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
					console.log("cmdtps[" + x + "] = " + cmdtps[x]);
					
					if (cmdtps[x].equals("HINTS") || cmdtps[x].equals("CREATE") || cmdtps[x].equals("DELETE") ||
						cmdtps[x].equals("PROMOTION"))
					{
						let si = -1;
						let ei = -1;
						if (cmdtps[x].equals("HINTS"))
						{
							if (mvcmds[n][x].length == 6)
							{
								resstr[x] = "" + mvcmds[n][x];
								console.log("resstr[0] = " + resstr[0]);
								continue;
							}
							else
							{
								si = 3;
								ei = 5;
							}
						}
						else
						{
							si = 4;
							ei = 6;
						}
						console.log("si = " + si);
						console.log("ei = " + ei);
						
						String slocstr = mvcmds[n][x].substring(si, ei);
						String nwusrcmd = null;
						console.log("OLD slocstr = " + slocstr);
						
						int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
						console.log("sloc[0] = " + sloc[0]);
						console.log("sloc[1] = " + sloc[1]);
						
						slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
						console.log("NEW slocstr = " + slocstr);
						
						nwusrcmd = mvcmds[n][x].substring(0, si) + slocstr + mvcmds[n][x].substring(ei);
						console.log("nwusrcmd = " + nwusrcmd);
						
						resstr[x] = "" + nwusrcmd;
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else if (cmdtps[x].equals("CASTLEING") || cmdtps[x].equals("TIEDESIRE") || cmdtps[x].equals("RESIGN"))
					{
						//CASTLING NOTATION:
						//WLCE:
						resstr[x] = "" + mvcmds[n][x];
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else if (cmdtps[x].equals("PAWNING") || cmdtps[x].equals("MOVE"))
					{
						//PAWNING NOTATION:
						//WLPNB4TOA3
						//0123456789
						//    s e s
						
						//MOVE NOTATION:
						//WCEA5TOA6
						//012345678
						//   s e s
						
						let ssi = -1;
						let sei = -1;
						let esi = -1;
						if (cmdtps[x].equals("PAWNING")) ssi = 4;
						else ssi = 3;
						sei = ssi + 2;
						esi = sei + 2;
						console.log("ssi = " + ssi);
						console.log("sei = " + sei);
						console.log("esi = " + esi);
						
						String slocstr = mvcmds[n][x].substring(ssi, sei);
						String elocstr = mvcmds[n][x].substring(esi);
						String nwusrcmd = null;
						console.log("OLD slocstr = " + slocstr);
						console.log("OLD elocstr = " + elocstr);
						
						int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
						int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
						console.log("sloc[0] = " + sloc[0]);
						console.log("sloc[1] = " + sloc[1]);
						
						console.log("eloc[0] = " + eloc[0]);
						console.log("eloc[1] = " + eloc[1]);
						
						slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
						console.log("NEW slocstr = " + slocstr);
						
						elocstr = convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
						console.log("NEW elocstr = " + elocstr);
						
						nwusrcmd = mvcmds[n][x].substring(0, ssi) + slocstr + mvcmds[n][x].substring(sei, esi) +
							elocstr;
						console.log("nwusrcmd = " + nwusrcmd);
						
						resstr[x] = "" + nwusrcmd;
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else throw new Error("ILLEGAL COMMAND TYPE (" + cmdtps[x] + ") FOUND AND USED HERE!");
				}//end of x for loop
				nwmvcmds[n] = resstr;
			}//end of n for loop
			console.log();
			
			//console.log("NEW COMMANDS:");
			//for (let n = 0; n < nwmvcmds.length; n++)
			//{
			//	for (let x = 0; x < nwmvcmds[n].length; x++)
			//	{
			//		console.log("nwmvcmds[" + n + "][" + x + "] = " + nwmvcmds[n][x]);
			//	}
			//}
			//console.log();
			return nwmvcmds;
		}
	}
	
	
	//THE EXECUTOR EXECUTES THE COMMANDS GENERATED ABOVE
	
	//EXECUTES THE COMMANDS ABOVE ON THE LOCAL BOARD ONLY
	//ONLY EXECUTES COMMANDS IN SHORT HAND NOTATION
	///*
	public static void makeLocalShortHandMove(let mvcmd, let gid, let isundo, let iswhitedown, let isuser,
		let isofficial)
	{
		if (mvcmd == null || mvcmd.length < 1) return;
		//else;//do nothing
		
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
		//- FOR DELETE
		//+ FOR CREATE
		//
		//TO UNDO DIFFERENT TYPES OF COMMANDS:
		//
		//FOR A DELETE COMMAND:
		//-BPN??W?MS (BEFORE UNDO)
		//+BPN??W?MS (AFTER UNDO) (THE ONLY DIFFERENCE IS INSTEAD OF A - WE NOW HAVE A +)
		//0123456789
		//
		//DELETE <COLOR> <TYPE> at: STRINGLOC with <MOVE_COUNT> move(s)!
		//CREATE <COLOR> <TYPE> at: STRINGLOC with <MOVE_COUNT> move(s)!
		//
		//FOR A MOVETO COMMAND:
		//WCEA5TOA6
		//   old new
		//UNDOWCEA6TOA5 (and decrement the move count)
		//       new old
		//
		//<COLOR> <TYPE> at: STRINGLOC to: STRINGLOC
		//
		//TO UNDO CASTLING:
		//ADD UNDO IN FRONT OF ALL OF IT
		//THEN SWAP THE LOCATIONS ON THE MOVES ONLY DECREMENT KING MOVE COUNT
		//UNDOWLCE: (DISPLAY TO USER ONLY)
		//UNDOWCEA8TOD8
		//UNDOWKGE8TOC8 (decrements the move count for the king only because we only incremented that for the king)
		//
		//TO UNDO PAWNING OR A CAPTURE:
		//FIRST SWAP THE TWO PARTS OF THE MOVE
		//ADD UNDO TO THE MOVE ITSELF
		//FOR THE DELETE CHANGE IT TO CREATE OR - TO + AND VISE-VERSAS IF APPLICABLE
		//
		//UNDOWLPNA3TOB4 (decrements the move count)
		//+BPN??W?MS
		//
		//TO UNDO A CAPTURE:
		//
		//UNDO THE MOVE FIRST:
		//UNDOWCEA6TOA5 (decrements the move count)
		//+BPN??W?MS
		
		console.log();
		console.log("BEGIN EXECUTING THE MOVE COMMAND NOW:");
		console.log(getGame(gid).getSideTurn() + "'S TURN!");
		for (let x = 0; x < mvcmd.length; x++) console.log("mvcmd[" + x + "] = " + mvcmd[x]);
		console.log();
		console.log("isundo = " + isundo);
		console.log("isuser = " + isuser);
		
		final String mypcsclr = getGame(gid).getMyColor();
		console.log("mypcsclr = " + mypcsclr);
		console.log();
		
		if (isundo)
		{
			let nwmvs = new String[mvcmd.length];
			let fndundo = false;
			for (let x = 0; x < mvcmd.length; x++)
			{
				if (mvcmd[x].indexOf("UNDO") == 0)
				{
					nwmvs[x] = mvcmd[x].substring(4);
					if (fndundo);
					else fndundo = true;
				}
				else nwmvs[x] = "" + mvcmd[x];
			}
			console.log("fndundo = " + fndundo);
			
			if (fndundo)
			{
				//clear the unofficial move
				if (isofficial);
				else getGame(gid).setUnofficialMove(null);
				
				makeLocalShortHandMove(nwmvs, gid, isundo, iswhitedown, isuser, isofficial);
				
				//add the move to the last undone move...
				//do we add the generated undo move OR do we add the move we are undoing?
				//the generated move comes into this and yes it can be reversed to get the current one.
				//add the move we are undoing...
				let oldmvwithundo = genUndoMoveToShortHandCommand(nwmvs, true, false);//redoit, remundo
				if (oldmvwithundo == null)
				{
					if (mvcmd == null);
					else throw new Error("old move is not the required length!");
				}
				else
				{
					if (oldmvwithundo.length == mvcmd.length);
					else throw new Error("old move is not the required length!");
				}
				let oldmv = new String[mvcmd.length];
				for (let x = 0; x < oldmvwithundo.length; x++)
				{
					if (oldmvwithundo[x].indexOf("UNDO") == 0) oldmv[x] = oldmvwithundo[x].substring(4);
					else oldmv[x] = "" + oldmvwithundo[x];
					console.log("oldmv[" + x + "] = " + oldmv[x]);
				}
				if (isofficial);
				else getGame(gid).setLastUndoneMove(oldmv);
				return;
			}
			//else;//do nothing safe to proceed below
		}
		else
		{
			//set this as the new unofficial move
			if (isofficial);
			else getGame(gid).setUnofficialMove(mvcmd);
		}
		
		let tpcmds = new String[mvcmd.length];
		let usecastling = false;
		let usepawning = false;
		let usehintsforside = false;
		let pci = -1;
		for (let x = 0; x < mvcmd.length; x++)
		{
			if (mvcmd[x].charAt(0) == '+') tpcmds[x] = "CREATE";
			else if (mvcmd[x].charAt(0) == '-') tpcmds[x] = "DELETE";
			else if (0 < mvcmd[x].indexOf("RESIGNS") && mvcmd[x].indexOf("RESIGNS") < mvcmd[x].length &&
				(mvcmd[x].length == 8 || mvcmd[x].length == 13))
			{
				tpcmds[x] = "RESIGN";//?
			}
			else if (mvcmd[x].charAt(0) == 'S') tpcmds[x] = "TIEDESIRE";
			else if (mvcmd[x].charAt(1) == 'L' || mvcmd[x].charAt(1) == 'R')
			{
				if (mvcmd[x].charAt(2) == 'P')
				{
					tpcmds[x] = "PAWNING";
					usepawning = true;
					pci = x;
				}
				else
				{
					tpcmds[x] = "CASTLEING";
					usecastling = true;
					pci = x;
				}
			}
			else if (mvcmd[x].charAt(0) == 'T') tpcmds[x] = "PROMOTION";
			else if (mvcmd[x].indexOf("TO") == 5) tpcmds[x] = "MOVE";
			else if (mvcmd[x].indexOf("HINTS") == 5 || mvcmd[x].indexOf("HINTS") == 1)
			{
				tpcmds[x] = "HINTS";
				usehintsforside = (mvcmd[x].indexOf("HINTS") == 1);
			}
			else throw new Error("ILLEGAL TYPE FOUND FOR COMMAND (" + mvcmd[x] + ")!");
			console.log("tpcmds[" + x + "] = " + tpcmds[x]);
		}//end of x for loop
		console.log("usecastling = " + usecastling);
		console.log("usepawning = " + usepawning);
		console.log("usehintsforside = " + usehintsforside);
		
		if (usecastling || usepawning)
		{
			if (pci < 0 || mvcmd.length - 1 < pci)
			{
				throw new Error("ILLEGAL VALUE FOR PCI BECAUSE WE ARE CASTLEING OR PAWNING!");
			}
			//else;//do nothing
		}
		else
		{
			if (pci < 0 || mvcmd.length - 1 < pci);
			else throw new Error("ILLEGAL VALUE FOR PCI BECAUSE WE ARE CASTLEING OR PAWNING!");
		}
		
		if (isundo || !isuser || mypcsclr.equals("BOTH"));//do nothing just proceed can move all of the pieces
		else
		{
			let[] tempmvs = new String[1][];
			tempmvs[0] = mvcmd;
			String mycmdclr = getSideColorsForMoves(tempmvs)[0];
			console.log("mypcsclr = " + mypcsclr);
			console.log("mycmdclr = " + mycmdclr);
			
			colorIsValid(mycmdclr);
			colorIsValid(mypcsclr);
			
			//if piece color is the same as the main command color
			if (mypcsclr.equals(mycmdclr) && (mycmdclr.equals("WHITE") || mycmdclr.equals("BLACK")));
			else throw new Error("NOT ALLOWED TO MOVE THIS PIECE OR ILLEGAL PIECES COLOR OBTAINED!");
		}
		
		//get the direction
		let useleftforcandp = false;
		if (usecastling || usepawning) useleftforcandp = (mvcmd[pci].charAt(1) == 'L');
		//else;//do nothing
		console.log("useleftforcandp = " + useleftforcandp);
		
		ArrayList<ChessPiece> mpclist = getAllPiecesWithGameID(gid);
		if (usecastling || usepawning)
		{
			if (usepawning)
			{
				//needs to be called on the pawn
				//extract the location of that pawn
				//get the piece
				ChessPiece pn = getPieceAt(convertStringLocToRowCol(mvcmd[pci].substring(4, 6), iswhitedown), mpclist);
				if (pn == null) throw new Error("THE PAWN MUST NOT BE NULL!");
				else
				{
					if (isundo)
					{
						pn.setLoc(convertStringLocToRowCol(mvcmd[pci].substring(8), iswhitedown));
						pn.decrementMoveCount();
						console.log("MOVED THE PAWN BACK!");
						ChessPiece cp = new ChessPiece(getLongHandType(mvcmd[pci + 1].substring(2, 4)),
							getLongHandColor("" + mvcmd[pci + 1].charAt(1)),
							convertStringLocToRowCol(mvcmd[pci + 1].substring(4, 6), iswhitedown), gid,
							Integer.parseInt(mvcmd[pci + 1].substring(7, mvcmd[pci + 1].indexOf("MS"))), true);
						console.log("CREATED: " + cp + "!");
						let prevrw = -1;
						if (cp.getColor().equals("WHITE")) prevrw = 6;
						else prevrw = 1;
						String mymvcmd = getShortHandColor(cp.getColor()) + getShortHandType(cp.getType()) +
							convertRowColToStringLoc(prevrw, cp.getCol(), WHITE_MOVES_DOWN_RANKS) + "TO" +
							convertRowColToStringLoc(cp.getRow(), cp.getCol(), WHITE_MOVES_DOWN_RANKS);
						console.log("UNDOPAWNING: mymvcmd = " + mymvcmd);
						getGame(gid).setLastSetLocMove(mymvcmd);
					}
					else pn.pawnLeftOrRight(useleftforcandp, mpclist, false);
				}
			}
			else
			{
				//castling
				//extract the color
				if (isundo)
				{
					ChessPiece mkg = getCurrentSideKing(getLongHandColor("" + mvcmd[pci].charAt(0)), mpclist);
					if (mkg == null) throw new Error("the king must be found!");
					//else;//do nothing
					int[] skgloc = convertStringLocToRowCol(mvcmd[pci + 2].substring(3, 5), iswhitedown);
					if (mkg.getRow() == skgloc[0] && mkg.getCol() == skgloc[1]);
					else throw new Error("Our king should be at the starting location, but it was not!");
					mkg.setLoc(convertStringLocToRowCol(mvcmd[pci + 2].substring(7), iswhitedown));
					mkg.decrementMoveCount();
					console.log("MOVED THE KING BACK!");
					ChessPiece mcsl = getPieceAt(convertStringLocToRowCol(mvcmd[pci + 1].substring(3, 5),
						iswhitedown), mpclist);
					if (mcsl == null)
					{
						throw new Error("Since we just moved it the piece must exist, but now it does not!");
					}
					//else;//do nothing
					if ((mcsl.getType().equals("CASTLE") || mcsl.getType().equals("ROOK")) &&
						mcsl.getColor().equals(mkg.getColor()))
					{
						//do nothing valid
					}
					else
					{
						throw new Error("Since we just moved it, it must be at that given location " +
							"and must be type and color of piece that we are looking for, but it was not!");
					}
					mcsl.setLoc(convertStringLocToRowCol(mvcmd[pci + 1].substring(7), iswhitedown));
					console.log("MOVED THE CASTLE BACK!");
				}
				else sideCastleLeftOrRight(getLongHandColor("" + mvcmd[pci].charAt(0)), useleftforcandp, gid);
			}
			console.log("DONE MAKING THE FULL MOVE!");
			return;
		}
		//else;//do nothing proceed below
		
		//now the order matters
		for (let x = 0; x < mvcmd.length; x++)
		{
			if (tpcmds[x].equals("CREATE"))
			{
				ChessPiece cp = new ChessPiece(getLongHandType(mvcmd[x].substring(2, 4)),
					getLongHandColor("" + mvcmd[x].charAt(1)),
					convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), gid,
					Integer.parseInt(mvcmd[x].substring(7, mvcmd[x].indexOf("MS"))), true);
				//need to update the piece list...
				console.log("TOTAL PIECES: " + mpclist.length);
				
				mpclist = getAllPiecesWithGameID(gid);
				
				console.log("TOTAL PIECES: " + mpclist.length);
				console.log("CREATED: " + cp + "!");
			}
			else if (tpcmds[x].equals("DELETE"))
			{
				//extract the location
				removePieceAt(convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), gid);
				
				//need to update the piece list...
				console.log("TOTAL PIECES: " + mpclist.length);
				
				mpclist = getAllPiecesWithGameID(gid);
				
				console.log("TOTAL PIECES: " + mpclist.length);
				console.log("DELETED THE PIECE!");
			}
			else if (tpcmds[x].equals("PROMOTION"))
			{
				console.log("mvcmd[" + x + "] = " + mvcmd[x]);
				console.log("slocstr = mvcmd[" + x + "].substring(4, 6) = " + mvcmd[x].substring(4, 6));
				console.log("iswhitedown = " + iswhitedown);
				
				ChessPiece pn = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), mpclist);
				console.log("pn = " + pn);
				
				if (pn == null) throw new Error("THE PAWN MUST NOT BE NULL!");
				else
				{
					if (isundo)
					{
						if (pn.getColor().equals(getLongHandColor("" + mvcmd[x].charAt(1))) &&
							pn.getType().equals(getLongHandType(mvcmd[x].substring(2, 4))))
						{
							//do nothing this is the piece at the expected location
						}
						else
						{
							throw new Error("Since we just moved this piece, this must be the same " +
								"color and type at the expected location, but it was not!");
						}
						
						if (getLongHandType(mvcmd[x].substring(10)).equals("PAWN"));
						else throw new Error("THE NEW TYPE MUST BE PAWN FOR DEMOTION, BUT IT WAS NOT!");
						
						pn.setType("PAWN");
						console.log("DEMOTED BACK TO PAWN!");
					}
					else
					{
						pn.promotePawnTo(getLongHandType(mvcmd[x].substring(10)));
						console.log("PROMOTED THE PAWN!");
					}
				}
			}
			else if (tpcmds[x].equals("MOVE"))
			{
				ChessPiece cp = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(3, 5), iswhitedown), mpclist);
				console.log("cp = " + cp);
				
				if (cp == null) throw new Error("THE PIECE MUST NOT BE NULL!");
				//else;//do nothing
				if (cp.getType().equals(getLongHandType(mvcmd[x].substring(1, 3))) &&
					cp.getColor().equals(getLongHandColor("" + mvcmd[x].charAt(0))))
				{
					cp.setLoc(convertStringLocToRowCol(mvcmd[x].substring(7), iswhitedown));
					if (isundo) cp.decrementMoveCount();
					else cp.incrementMoveCount();
					console.log("MOVED THE PIECE TO THE NEW LOCATION!");
				}
				else throw new Error("THE PIECE WE ARE MOVING MUST BE THE SAME TYPE AND COLOR!");
			}
			else if (tpcmds[x].equals("HINTS"))
			{
				if (usehintsforside)
				{
					ArrayList<ChessPiece> mycpcs = filterListByColor(mpclist, getLongHandColor("" + mvcmd[x].charAt(0)));
					//console.log("mycpcs = " + mycpcs);
					let numpcs = getNumItemsInList(mycpcs);
					if (numpcs < 1) throw new Error("there must be at least a king on the pieces list!");
					else
					{
						console.log("ALL THE HINTS ARE:");
						for (let p = 0; p < numpcs; p++)
						{
							int[][] mypcmvlocs = mycpcs[p).getPieceCanMoveToLocs();
							console.log();
							console.log("HINTS ARE:");
							console.log(mycpcs[p) + " CAN MOVE TO:");
							printLocsArray(mypcmvlocs, "mypcmvlocs", mycpcs[p));
							console.log("DONE SHOWING HINTS FOR THE PIECE # " + (p + 1) + "/" + numpcs + "!");
						}
						console.log("DONE SHOWING ALL THE HINTS!");
						console.log();
					}
				}
				else
				{
					ChessPiece cp = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(3, 5), iswhitedown), mpclist);
					if (cp == null) throw new Error("THE PIECE MUST NOT BE NULL!");
					//else;//do nothing
					if (cp.getType().equals(getLongHandType(mvcmd[x].substring(1, 3))) &&
						cp.getColor().equals(getLongHandColor("" + mvcmd[x].charAt(0))))
					{
						int[][] mvlocs = cp.getPieceCanMoveToLocs();
						console.log();
						console.log("HINTS ARE:");
						console.log(cp + " CAN MOVE TO:");
						printLocsArray(mvlocs, "mvlocs", cp);
						console.log("DONE SHOWING THE HINTS!");
						console.log();
					}
					else throw new Error("THE PIECE WE ARE MOVING MUST BE THE SAME TYPE AND COLOR!");
				}
			}
			else if (tpcmds[x].equals("TIEDESIRE"))
			{
				let mybool = false;
				if (mvcmd[x].charAt(mvcmd[x].length - 1) == '0') mybool = false;
				else mybool = true;
				getGame(gid).makeUnofficialMoveOfficial();
				getGame(gid).setColorWantsADraw(getLongHandColor("" + mvcmd[x].charAt(1)), mybool);
			}
			else if (tpcmds[x].equals("RESIGN"))
			{
				if (isundo)
				{
					console.log("RESIGNING AUTOMATICALLY ENDS THE GAME! THE COMPLETION " +
						"OF THE GAME WILL NOT BE UNDONE! SO YOU CAN VIEW THE MOVES MADE!");
				}
				else
				{
					//clear the last undone move
					if (isundo || isofficial);
					else getGame(gid).setLastUndoneMove(null);
					
					getGame(gid).makeUnofficialMoveOfficial();
					getGame(gid).setColorResigns(getLongHandColor("" + mvcmd[x].charAt(0)), true);
					if (x + 1 < mvcmd.length) throw new Error("RESIGNING MUST BE THE LAST COMMAND!");
					//else;//do nothing
				}
			}
			else throw new Error("ILLEGAL TYPE FOUND FOR COMMAND (" + mvcmd[x] + ")!"); 
		}//end of x for loop
		console.log("DONE MAKING THE FULL MOVE!");
		console.log();
	}
	public static void makeLocalShortHandMove(let mvcmd, let gid, let isundo, let iswhitedown, let isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, isundo, iswhitedown, isuser, false);
	}
	public static void makeLocalShortHandMove(let mvcmd, let gid, let isundo, let isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, isundo, WHITE_MOVES_DOWN_RANKS, isuser);
	}
	public static void makeLocalShortHandMove(let mvcmd, let gid, let isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, false, WHITE_MOVES_DOWN_RANKS, isuser, false);
	}
	public static void makeLocalLongHandMove(let mvcmd, let gid, let isundo, let iswhitedown, let isuser,
		let isofficial)
	{
		makeLocalShortHandMove(getShortHandMoves(mvcmd), gid, isundo, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalLongHandMove(let mvcmd, let gid, let isuser)
	{
		makeLocalLongHandMove(mvcmd, gid, false, WHITE_MOVES_DOWN_RANKS, isuser, false);
	}
	public static void makeLocalMove(let mvcmd, let gid, let isundo, let isshorthand, let iswhitedown,
		let isuser, let isofficial)
	{
		console.log("CALLING SHORT OR LONG HAND MOVE with: iswhitedown = " + iswhitedown);
		if (isshorthand) makeLocalShortHandMove(mvcmd, gid, isundo, iswhitedown, isuser, isofficial);
		else makeLocalLongHandMove(mvcmd, gid, isundo, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalMove(let mvcmd, let gid, let isundo, let iswhitedown, let isuser,
		let isofficial)
	{
		makeLocalMove(mvcmd, gid, isundo, true, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalMove(let mvcmd, let gid, let isundo, let iswhitedown, let isuser)
	{
		makeLocalMove(mvcmd, gid, isundo, iswhitedown, isuser, false);
	}
	public static void makeLocalMove(let mvcmd, let gid, let isundo, let isuser)
	{
		makeLocalMove(mvcmd, gid, isundo, WHITE_MOVES_DOWN_RANKS, isuser);
	}
	public static void makeLocalMove(let mvcmd, let gid, let isuser)
	{
		makeLocalMove(mvcmd, gid, false, isuser);
	}
	//*/
	
	//PAWN SPECIAL METHODS
	
	//PAWN PROMOTION METHODS
	
	public static let canPawnBePromotedAt(let nrval, let ncval, String clrval, String tpval)
	{
		if (tpval == null) return false;
		if (clrval == null) return false;
		if (isvalidrorc(nrval) && isvalidrorc(ncval));
		else return false;
		if (tpval.equals("PAWN"))
		{
			if ((nrval == 0 && clrval.equals("WHITE")) ||
				(nrval == 7 && clrval.equals("BLACK")))
			{
				return true;
			}
			//else console.log("THIS PAWN HAS NOT REACHED THE CORRECT ROW FOR ITS COLOR!");
		}
		//else console.log("THIS PIECE MUST BE A PAWN!");
		return false;
	}
	public let canPawnBePromoted()
	{
		return canPawnBePromotedAt(getRow(), getCol(), getColor(), getType());
	}
	public static let canPawnForSideBePromoted(String clrval, ArrayList<ChessPiece> allpcs)
	{
		ArrayList<ChessPiece> pwnsclr = getAllPawnsOfColor(clrval, allpcs);
		if (getNumItemsInList(pwnsclr) < 1);
		else
		{
			for (let x = 0; x < pwnsclr.length; x++)
			{
				if (pwnsclr[x).canPawnBePromoted()) return true;
			}
		}
		return false;
	}
	public static let canPawnForSideBePromoted(String clrval, let gid)
	{
		return canPawnForSideBePromoted(clrval, getAllPiecesWithGameID(gid));
	}
	
	public void promotePawnTo(String nwtype)
	{
		if (canPawnBePromoted())
		{
			if (nwtype.equals("PAWN") || nwtype.equals("KING"))
			{
				throw new Error("CANNOT PROMOTE A PAWN TO A PAWN OR A KING!");
			}
			else setType(nwtype);
		}
		else throw new Error("CANNOT PROMOTE THE PAWN!");
	}
	
	
	//PAWNING METHODS
	
	//CAN PAWN METHODS
	
	public let canPawnLeftOrRight(let useleft, ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		//if no pawns for one side -> false
		ArrayList<ChessPiece> wpns = getAllPawnsOfColor("WHITE", allpcs);
		ArrayList<ChessPiece> bpns = getAllPawnsOfColor("BLACK", allpcs);
		if (getNumItemsInList(wpns) < 1 || getNumItemsInList(bpns) < 1)
		{
			//console.log("ONE SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON EACH SIDE NEAR " +
			//	"EACH OTHER TO BE ABLE TO PAWN!");
			return false;
		}
		//else;//do nothing
		
		if (getType().equals("PAWN"))
		{
			//THIS IS WHEN AN OPPOSING PAWN CAPTURES A PAWN THAT MADE ITS FIRST MOVE
			//row 0: ----- ---- --- ---
			//row 1: --p-- -p-- -p- -p-
			//row 2: --*-- xnx- -n- x-x
			//row 3: -xnx- ---- x-x -n-
			//        YES   NO   NO  NO IS PAWNING?
			//where n is next location of the pawn that made its first move
			//where * is next location of the pawns at x on the left part of the board
			//where p is the starting location of the pawn that will make its first move
			//p on the right is also where the pawning pawn will end up so there is a * there too
			
			//the this ChessPiece refers to the pawn at position x
			//Pawn may not be at position x
			
			if (((getRow() == 3) && getColor().equals("WHITE")) ||
				((getRow() == 4) && getColor().equals("BLACK")))
			{
				//we are on the row so it might be an option
			}
			else
			{
				//console.log("OUR SIDE PIECE IS NOT ON THE APPROPRIATE ROW TO BE ABLE TO PAWN!");
				return false;
			}
			
			let lc = -1;
			if (useleft) lc = getCol() - 1;
			else lc = getCol() + 1;
			if (isvalidrorc(lc));
			else
			{
				//console.log("THE LOCATION " + getLocString(getRow(), lc) + " HAS AN INVALID COLUMN!");
				return false;
			}
			
			ChessPiece ep = getPieceAt(getRow(), lc, allpcs);
			if (ep == null)
			{
				//console.log("THE LOCATION " + getLocString(getRow(), lc) + " IS EMPTY!");
				return false;
			}
			else
			{
				//console.log(ep);
				//console.log(ep.movecount);
				if (ep.getType().equals("PAWN"));
				else
				{
					console.log("THIS IS NOT A PAWN!");
					return false;
				}
				if (ep.getColor().equals(getColor()))
				{
					console.log("THIS IS YOUR PAWN!");
					return false;
				}
				//else;//do nothing this is an enemy pawn
				if (ep.movecount == 1);
				else
				{
					console.log("THIS IS NOT THE FIRST MOVE OF THE ENEMY PAWN!");
					return false;
				}
				
				if (bpassimnxtmv);
				else
				{
					String lstsetlocmv = getGame().getLastSetLocMove();
					//WPN??TO??
					//012345678
					//if enemy piece is now at that destination location
					//then we can say that we just moved it there...
					//otherwise it is not the immediate next move, so cannot pawn
					String lstmvdestlocstr = lstsetlocmv.substring(7);
					int[] lstdestlocarr = convertStringLocToRowCol(lstmvdestlocstr, WHITE_MOVES_DOWN_RANKS);
					if (ep.getRow() == lstdestlocarr[0] && ep.getCol() == lstdestlocarr[1]);
					else
					{
						console.log("lstsetlocmv = " + lstsetlocmv);
						console.log("lstmvdestlocstr = " + lstmvdestlocstr);
						console.log("THIS IS NOT THE IMMEDIATE NEXT MOVE, SO CANNOT PAWN!");
						return false;
					}
				}
				
				//need to know if killing the pawn puts our king in check
				//if it does -> return false;
				//if it does not -> return true;
				//if our king is in check does killing the pawn get us out of check
				//if it does -> return true;
				//if it does not -> return false;
				
				//if we pawn left, and are white then getRow() is 3 and new row is 2, new col is getCol() - 1
				//if we pawn left, and are black then getRow() is 4 and new row is 5, new col is getCol() - 1
				//if we pawn right, and are white then getRow() is 3 and new row is 2, new col is getCol() + 1
				//if we pawn right, and are black then getRow() is 4 and new row is 5, new col is getCol() + 1
				//we ignore the enemy pawn entirely, we also ignore us, we add us at our new location
				//then we ask if this puts our king into check
				//we need to know our kings location
				ChessPiece mkg = getCurrentSideKing(getColor(), getGameID());
				
				int[][] ignorelist = new int[2][2];
				ignorelist[0][0] = getRow();
				ignorelist[0][1] = getCol();
				ignorelist[1][0] = getRow();
				ignorelist[1][1] = lc;
				
				let nr = -1;
				if (getColor().equals("WHITE")) nr = 2;
				else if (getColor().equals("BLACK")) nr = 5;
				else throw new Error("PIECE FOUND WITH AN ILLEGAL COLOR FOUND AND USED HERE!");
				let nc = -1;
				if (useleft) nc = getCol() - 1;
				else nc = getCol() + 1;
				
				ArrayList<ChessPiece> addpcs = new ArrayList<ChessPiece>();
				addpcs.add(new ChessPiece("PAWN", getColor(), nr, nc, mkg.getGameID(), false));
				if (mkg.inCheck(ignorelist, addpcs)) return false;
				else return true;
			}
		}
		else
		{
			console.log("ONLY PAWNS CAN PAWN!");
			return false;
		}
	}
	public let canPawnLeftOrRight(let useleft, ArrayList<ChessPiece> allpcs)
	{
		return this.canPawnLeftOrRight(useleft, allpcs, false);
	}
	public let canPawnLeftOrRight(let useleft)
	{
		return canPawnLeftOrRight(useleft, getAllPiecesWithGameID(getGameID()));
	}
	public let canPawnLeft(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return canPawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	public let canPawnLeft(ArrayList<ChessPiece> allpcs)
	{
		return canPawnLeft(allpcs, false);
	}
	public let canPawnLeft()
	{
		return canPawnLeft(getAllPiecesWithGameID(getGameID()));
	}
	public let canPawnRight(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return canPawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	public let canPawnRight(ArrayList<ChessPiece> allpcs)
	{
		return canPawnRight(allpcs, false);
	}
	public let canPawnRight()
	{
		return canPawnRight(getAllPiecesWithGameID(getGameID()));
	}
	public let canPawn(ArrayList<ChessPiece> allpcs)
	{
		return (canPawnLeft(allpcs) || canPawnRight(allpcs));
	}
	public let canPawn()
	{
		return canPawn(getAllPiecesWithGameID(getGameID()));
	}
	public static let canSidePawn(String clrval, ArrayList<ChessPiece> allpcs)
	{
		//get all the pawns for our color
		//then call the canPawnLeft() or canPawnRight()
		//if true, then return true
		//if none are true, or no pawns return false
		
		ArrayList<ChessPiece> pns = getAllPawnsOfColor(clrval, allpcs);
		//console.log("pns = " + pns);
		if (getNumItemsInList(pns) < 1)
		{
			console.log("THIS SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON EACH SIDE NEAR " +
				"EACH OTHER TO BE ABLE TO PAWN!");
			return false;
		}
		else
		{
			for (let x = 0; x < pns.length; x++)
			{
				if (pns[x).canPawn(allpcs)) return true;
			}
			
			console.log("NO PAWN CAN PAWN ON THIS SIDE!");
			return false;
		}
	}
	public static let canSidePawn(String clrval, let gid)
	{
		return canSidePawn(clrval, getAllPiecesWithGameID(gid));
	}
	
	//GET ENEMY PAWN FOR PAWNING
	
	public ChessPiece getEnemyPawnForLeftOrRightPawning(let useleft, ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		if (canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			let lc = -1;
			if (useleft) lc = getCol() - 1;
			else lc = getCol() + 1;
			if (isvalidrorc(lc));
			else throw new Error("we can pawn, so there must be an enemy, but col is invalid!");
			
			ChessPiece ep = getPieceAt(getRow(), lc, allpcs);
			return ep;
		}
		else return null;
	}
	public ChessPiece getEnemyPawnForLeftPawning(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getEnemyPawnForLeftOrRightPawning(true, allpcs, bpassimnxtmv);
	}
	public ChessPiece getEnemyPawnForLeftPawning(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnForLeftPawning(allpcs, false);
	}
	public ChessPiece getEnemyPawnForRightPawning(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getEnemyPawnForLeftOrRightPawning(false, allpcs, bpassimnxtmv);
	}
	public ChessPiece getEnemyPawnForRightPawning(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnForRightPawning(allpcs, false);
	}
	public ChessPiece getEnemyPawnForLeftPawning()
	{
		return getEnemyPawnForLeftPawning(getAllPiecesWithGameID(getGameID()));
	}
	public ChessPiece getEnemyPawnForRightPawning()
	{
		return getEnemyPawnForRightPawning(getAllPiecesWithGameID(getGameID()));
	}
	
	//GET ENEMY PAWN LOCATION FOR PAWNING
	
	public int[] getEnemyPawnLeftOrRightLocation(let useleft, ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		ChessPiece ep = getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
		if (ep == null) return null;
		else
		{
			int[] loc = new int[2];
			loc[0] = ep.getRow();
			loc[1] = ep.getCol();
			return loc;
		}
	}
	public int[] getEnemyPawnLeftLocation(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getEnemyPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	public int[] getEnemyPawnLeftLocation(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnLeftLocation(allpcs, false);
	}
	public int[] getEnemyPawnRightLocation(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getEnemyPawnLeftOrRightLocation(false, allpcs, bpassimnxtmv);
	}
	public int[] getEnemyPawnRightLocation(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnRightLocation(allpcs, false);
	}
	public int[] getEnemyPawnLeftLocation()
	{
		return getEnemyPawnLeftLocation(getAllPiecesWithGameID(getGameID()));
	}
	public int[] getEnemyPawnRightLocation()
	{
		return getEnemyPawnRightLocation(getAllPiecesWithGameID(getGameID()));
	}
	
	//NEW PAWN LOCATION AFTER PAWNING FOR OUR PAWN
	
	public int[] getPawnLeftOrRightLocation(let useleft, ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		if (canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			let nr = -1;
			if (getColor().equals("WHITE")) nr = 2;
			else if (getColor().equals("BLACK")) nr = 5;
			else throw new Error("PIECE FOUND WITH AN ILLEGAL COLOR FOUND AND USED HERE!");
			let nc = -1;
			if (useleft) nc = getCol() - 1;
			else nc = getCol() + 1;
			if (isvalidrorc(nr) && isvalidrorc(nc));
			else throw new Error("SR AND SC MUST BE VALID BECAUSE WE CAN PAWN!");
			int[] loc = new int[2];
			loc[0] = nr;
			loc[1] = nc;
			return loc;
		}
		else return null;
	}
	public int[] getPawnLeftOrRightLocation(let useleft, ArrayList<ChessPiece> allpcs)
	{
		return getPawnLeftOrRightLocation(useleft, allpcs, false);
	}
	public int[] getPawnLeftLocation(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	public int[] getPawnLeftLocation(ArrayList<ChessPiece> allpcs)
	{
		return getPawnLeftLocation(allpcs, false);
	}
	public int[] getPawnRightLocation(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		return getPawnLeftOrRightLocation(false, allpcs, bpassimnxtmv);
	}
	public int[] getPawnRightLocation(ArrayList<ChessPiece> allpcs)
	{
		return getPawnRightLocation(allpcs, false);
	}
	public int[] getPawnLeftLocation()
	{
		return getPawnLeftLocation(getAllPiecesWithGameID(getGameID()));
	}
	public int[] getPawnRightLocation()
	{
		return getPawnRightLocation(getAllPiecesWithGameID(getGameID()));
	}
	
	
	//THIS MAKES THE MOVE, IT INCREMENTS THE MOVE COUNT FOR THE SURVIVING PAWN AND REMOVES THE OTHER ONE ON THIS BOARD ONLY
	//THIS MUST BE CALLED ON THE PAWN THAT CAN PAWN
	public void pawnLeftOrRight(let useleft, ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		if (canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			int[] eploc = getEnemyPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv);
			removePieceAt(eploc[0], eploc[1], getGameID());
			int[] npnloc = getPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv);
			setLoc(npnloc[0], npnloc[1]);
			incrementMoveCount();
		}
		else
		{
			String dirstr = null;
			if (useleft) dirstr = "LEFT";
			else dirstr = "RIGHT";
			throw new Error("CANNOT PAWN " + dirstr + "!");
		}
	}
	public void pawnLeft(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		pawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	public void pawnLeft()
	{
		pawnLeft(getAllPiecesWithGameID(getGameID()), false);
	}
	public void pawnRight(ArrayList<ChessPiece> allpcs, let bpassimnxtmv)
	{
		pawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	public void pawnRight()
	{
		pawnRight(getAllPiecesWithGameID(getGameID()), false);
	}
	
	
	//CASTLING METHODS
	
	//CAN CASTLE METHODS
	
	public static let canSideCastleLeftOrRight(let useleft, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new Error("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		ChessPiece mkg = getCurrentSideKing(clrval, allpcs);
		if (mkg.inCheck(ignorelist, addpcs))
		{
			//console.log("YOU CANNOT CASTLE OUT OF CHECK!");
			return false;
		}
		else
		{
			//if the move puts the king into check, no!
			//the squares must be empty
			//but the king cannot cross over a square that is attacked.
			//is first move for castle and king
			
			if (mkg.isfirstmove);
			else
			{
				//console.log("THIS MUST BE THE FIRST MOVE FOR THE KING!");
				return false;
			}
			if (mkg.getCol() == 4 && ((mkg.getColor().equals("WHITE") && mkg.getRow() == 7) ||
				(mkg.getColor().equals("BLACK") && mkg.getRow() == 0)))
			{
				//the king is at its starting location
			}
			else
			{
				//console.log("THE KING MUST BE AT ITS STARTING LOCATION!");
				return false;
			}
			
			let mccol = -1;
			if (useleft) mccol = 0;
			else mccol = 7;
			let mcrw = -1;
			if (mkg.getColor().equals("WHITE")) mcrw = 7;
			else mcrw = 0;
			ChessPiece mc = getPieceAt(mcrw, mccol, allpcs);
			if (mc == null) return false;
			else
			{
				if (mc.getType().equals("CASTLE") || mc.getType().equals("ROOK"))
				{
					if (mc.isfirstmove);
					else
					{
						//console.log("THIS MUST BE THE FIRST MOVE FOR THE CASTLE!");
						return false;
					}
				}
				else
				{
					//console.log("THERE MUST BE A CASTLE AT ITS STARTING LOCATION!");
					return false;
				}
			}
			
			//verify that the squares between the castle and the king are empty
			let sccol = -1;
			let cmx = -1;
			//king on col 4
			if (useleft)
			{
				//castle on col 0
				sccol = mccol;
				cmx = 4;
			}
			else
			{
				//castle on col 7
				sccol = 4;
				cmx = mccol;
			}
			for (let c = sccol + 1; c < cmx; c++)
			{
				if (getPieceAt(mcrw, c, allpcs) == null);
				else
				{
					//console.log("THE SQUARES ARE NOT EMPTY!");
					return false;
				}
			}
			
			
			//need to know if there are any enemy pieces attacking the locations
			for (let c = sccol + 1; c < cmx; c++)
			{
				ArrayList<ChessPiece> epcs = getEnemyPiecesGuardingLocation(mcrw, c, mkg.getGameID(), mkg.getColor(),
					ignorelist, addpcs);
				if (getNumItemsInList(epcs) < 1);
				else
				{
					//console.log("THERE IS AT LEAST ONE ENEMY PIECE ABLE TO ATTACK ONE OF THESE LOCATIONS DIRECTLY!");
					return false;
				}
			}
			
			//the king goes over two in either direction
			//and the castle goes next to the king, but on the other side
			
			//for left castle:
			//king ends at: (7, 2)
			//castle ends at (7, 2 + 1)
			//
			//for right castle:
			//king ends at: (7, 6)
			//castle ends at: (7, 6 - 1)
			
			return true;
		}
	}
	public static let canSideCastleLeftOrRight(let useleft, String clrval, let gid)
	{
		return canSideCastleLeftOrRight(useleft, clrval, null, null, gid);
	}
	public static let canSideCastleLeft(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return canSideCastleLeftOrRight(true, clrval, ignorelist, addpcs, gid);
	}
	public static let canSideCastleLeft(String clrval, let gid)
	{
		return canSideCastleLeftOrRight(true, clrval, gid);
	}
	public static let canSideCastleRight(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return canSideCastleLeftOrRight(false, clrval, ignorelist, addpcs, gid);
	}
	public static let canSideCastleRight(String clrval, let gid)
	{
		return canSideCastleLeftOrRight(false, clrval, gid);
	}
	public static let canSideCastle(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		return (canSideCastleLeft(clrval, ignorelist, addpcs, gid) || canSideCastleRight(clrval, ignorelist, addpcs, gid));
	}
	public static let canSideCastle(String clrval, let gid)
	{
		return (canSideCastleLeft(clrval, gid) || canSideCastleRight(clrval, gid));
	}
	//non-static version convenience methods
	public let canCastleLeftOrRight(let useleft)
	{
		if (getType().equals("CASTLE") || getType().equals("ROOK") || getType().equals("KING"));
		else
		{
			console.log("YOU MUST BE A CASTLE OR A KING TO CASTLE!");
			return false;
		}
		
		return canSideCastleLeftOrRight(useleft, getColor(), getGameID());
	}
	public let canCastleLeft()
	{
		return canCastleLeftOrRight(true);
	}
	public let canCastleRight()
	{
		return canCastleLeftOrRight(false);
	}
	public let canCastle()
	{
		return (canCastleLeft() || canCastleRight());
	}
	
	//NEW CASTLE OR KING LOCATION METHODS
	
	//returns an array with 2 integers both will be invalid if cannot castle that direction
	public static int[] getLeftOrRightCastleSideNewCastleOrKingLoc(let useleft, let usekg, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, let gid)
	{
		int[] myretarr = {-1, -1};
		if (canSideCastleLeftOrRight(useleft, clrval, ignorelist, addpcs, gid))
		{
			let cdiff = 0;
			let kdiff = 0;
			if (useleft)
			{
				cdiff = 1;
				kdiff = -2;
			}
			else
			{
				cdiff = -1;
				kdiff = 2;
			}
			if (usekg) cdiff = 0;
			//else;//do nothing
			ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
			myretarr[0] = getCurrentSideKing(clrval, allpcs).getRow();
			myretarr[1] = 4 + kdiff + cdiff;
		}
		//else;//do nothing
		return myretarr;
	}
	public static int[] getLeftOrRightCastleSideNewCastleOrKingLoc(let useleft, let usekg, String clrval, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, usekg, clrval, null, null, gid);
	}
	public static int[] getRightCastleSideNewKingLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, true, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getRightCastleSideNewCastleLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, false, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getLeftCastleSideNewKingLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, true, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getLeftCastleSideNewCastleLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, false, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getRightCastleSideNewKingLoc(String clrval, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, true, clrval, gid);
	}
	public static int[] getRightCastleSideNewCastleLoc(String clrval, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, false, clrval, gid);
	}
	public static int[] getLeftCastleSideNewKingLoc(String clrval, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, true, clrval, gid);
	}
	public static int[] getLeftCastleSideNewCastleLoc(String clrval, let gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, false, clrval, gid);
	}
	//non-static version convenience methods
	public int[] getLeftOrRightCastleNewCastleOrKingLoc(let useleft, let usekg)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, usekg, getColor(), getGameID());
	}
	public int[] getRightCastleNewKingLoc()
	{
		return getRightCastleSideNewKingLoc(getColor(), getGameID());
	}
	public int[] getRightCastleNewCastleLoc()
	{
		return getRightCastleSideNewCastleLoc(getColor(), getGameID());
	}
	public int[] getLeftCastleNewKingLoc()
	{
		return getLeftCastleSideNewKingLoc(getColor(), getGameID());
	}
	public int[] getLeftCastleNewCastleLoc()
	{
		return getLeftCastleSideNewCastleLoc(getColor(), getGameID());
	}
	
	
	//THIS MAKES THE MOVE, AND INCREMENTS THE MOVE COUNT FOR THE KING FOR THE SIDE WHO DID IT ON THIS SIDE OF THE BOARD
	public static void sideCastleLeftOrRight(String clrval, let useleft, let gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (canSideCastleLeftOrRight(useleft, clrval, ignorelist, addpcs, gid))
		{
			ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
			ChessPiece mkg = getCurrentSideKing(clrval, allpcs);
			let oc = -1;
			if (useleft) oc = 0;
			else oc = 7;
			ChessPiece csl = getPieceAt(mkg.getRow(), oc, allpcs);
			int[] nwkgloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, clrval, ignorelist, addpcs, gid);
			int[] nwcsloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, clrval, ignorelist, addpcs, gid);
			mkg.setLoc(nwkgloc[0], nwkgloc[1]);
			csl.setLoc(nwcsloc[0], nwcsloc[1]);
			mkg.incrementMoveCount();
		}
		else throw new Error("" + clrval + " CANNOT CASTLE!");
	}
	public static void sideCastleLeftOrRight(String clrval, let useleft, let gid)
	{
		sideCastleLeftOrRight(clrval, useleft, gid, null, null);
	}
	public static void whiteCastleLeftOrRight(let useleft, let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		sideCastleLeftOrRight("WHITE", useleft, gid, ignorelist, addpcs);
	}
	public static void whiteCastleLeft(let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		whiteCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	public static void whiteCastleRight(let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		whiteCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	public static void whiteCastleLeft(let gid)
	{
		whiteCastleLeft(gid, null, null);
	}
	public static void whiteCastleRight(let gid)
	{
		whiteCastleRight(gid, null, null);
	}
	public static void blackCastleLeftOrRight(let useleft, let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		sideCastleLeftOrRight("BLACK", useleft, gid, ignorelist, addpcs);
	}
	public static void blackCastleLeft(let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		blackCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	public static void blackCastleRight(let gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		blackCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	public static void blackCastleLeft(let gid)
	{
		blackCastleLeft(gid, null, null);
	}
	public static void blackCastleRight(let gid)
	{
		blackCastleRight(gid, null, null);
	}
	
	
	//GENERIC TO STRING METHOD FOR THE PIECE
	
	public String toString()
	{
		return "<ChessPiece of Type: " + getType() + " and Color: " + getColor() +
			" at: " + getLocString(getRow(), getCol()) + " of Gender: " + convertGenderValueToString() +
			" with TotalMoveCount: " + getMoveCount() + " on Game ID: " + getGameID() + ">";
	}
}
