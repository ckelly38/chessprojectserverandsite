import ChessGame from "./ChessGame";
import CommonClass from "./commonclass";
class ChessPiece {
	static validTypes = ["PAWN", "CASTLE", "KNIGHT", "BISHOP", "QUEEN", "KING", "ROOK"];
	static validColors = ["WHITE", "BLACK"];
	static cc = new CommonClass();
	static ROWCOLMIN = 0;
	static ROWCOLMAX = 7;
	static WHITE_MOVES_DOWN_RANKS = false;
	static clrs = ChessPiece.getSquareColors();
	static cps = [];
	static remPC = null;
	static addPC = null;
	static getPCS = null;
	//only one copy so will cause a problem with multiple games
	constructor(tp="", clr="", r=-1, c=-1, gid=-1, initmvcnt=0, addit=true)
	{
		ChessPiece.cc.letMustBeAnInteger(initmvcnt, "initmvcnt");
		ChessPiece.cc.letMustBeBoolean(addit, "addit");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tp) ||
			ChessPiece.cc.isStringEmptyNullOrUndefined(clr))
		{
			ChessPiece.cc.logAndThrowNewError("the given type and color must not be null!");
		}
		//else;//do nothing

		this.setRow(r);
		this.setCol(c);
		this.setType(tp.toUpperCase());
		this.setColor(clr.toUpperCase());
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
		if (addit)
		{
			//console.log("ATEMPTING TO ADD THE PIECE TO THE LIST!");
			//console.log("ChessPiece.addPC = ", ChessPiece.addPC);
			if (ChessPiece.cc.isItemNullOrUndefined(ChessPiece.addPC)) ChessPiece.cps.push(this);
			else ChessPiece.addPC(this);
		}
		//else;//do nothing
	}
	//constructor(tp="", clr="", r=-1, c=-1, gid=-1, addit=true)
	//{
	//	this(tp, clr, r, c, gid, 0, addit);
	//}
	//constructor(tp="", clr="", r=-1, c=-1, gid=-1)
	//{
	//	this(tp, clr, r, c, gid, 0, true);
	//}
	//constructor(tp="", clr="", loc, gid=-1, addit=true)
	//{
	//	this(tp, clr, loc[0], loc[1], gid, 0, addit);
	//}
	//constructor(tp="", clr="", loc, gid=-1)
	//{
	//	this(tp, clr, loc[0], loc[1], gid, 0, true);
	//}
	//constructor(tp="", clr="", loc, gid=-1, initmvcnt=0, addit=true)
	//{
	//	this(tp, clr, loc[0], loc[1], gid, initmvcnt, addit);
	//}
	//constructor(tp="", clr="", r=-1, c=-1, gid=-1, initmvcnt=0)
	//{
	//	this(tp, clr, r, c, gid, initmvcnt, true);
	//}

	static makeNewChessPiece(tp="", clr="", loc, gid=-1, initmvcnt=0, addit=true)
	{
		return new ChessPiece(tp, clr, loc[0], loc[1], gid, initmvcnt, addit);
	}
	static makeNewChessPieceMain(tp="", clr="", loc, gid=-1, addit=true)
	{
		return ChessPiece.makeNewChessPiece(tp, clr, loc, gid, 0, addit);
	}
	static makeNewChessPieceRCLocMain(tp="", clr="", r=-1, c=-1, gid=-1, addit=true)
	{
		return ChessPiece.makeNewChessPieceMain(tp, clr, [r, c], gid, addit);
	}
	
	static setMyAddPieceToListFunc(myfunc)
	{
		ChessPiece.addPC = myfunc;
	}

	static setMyRemovePieceFromListFunc(myfunc)
	{
		ChessPiece.remPC = myfunc;
	}

	static setGetPCS(myfunc)
	{
		ChessPiece.getPCS = myfunc;
	}

	getGameID()
	{
		return 0 + this.gameID;
	}
	
	static getGameVIAGID(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessGame.getGameVIAGID(gid);
	}
	getGame()
	{
		return ChessPiece.getGameVIAGID(this.getGameID());
	}
	
	static getSideTurnFromGameVIAGID(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getGameVIAGID(gid).getSideTurn();
	}
	getSideTurnFromGame()
	{
		return ChessPiece.getSideTurnFromGameVIAGID(this.getGameID());
	}
	
	//NORMAL BOARD SETUP METHOD
    
    static setUpBoard(gid, pawnsonly=false)
    {
    	ChessPiece.cc.letMustBeBoolean(pawnsonly, "pawnsonly");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing safe to proceed
    	
    	//white pawns on row 6 cols 0 through 7
    	//black pawns on row 1 cols 0 through 7
    	for (let x = 0; x < 2; x++)
    	{
    		let r = ((x === 0) ? 6 : 1);
			let clr = ((x === 0) ? "WHITE" : "BLACK");
			for (let c = 0; c < 8; c++)
	    	{
	    		let cp = new ChessPiece("PAWN", clr, r, c, gid);
	    		//ChessPiece.cps.add(cp);
	    	}
	    	if (pawnsonly);
	    	else
	    	{
	    		let orw = ((clr === "WHITE") ? 7 : 0);
		    	let mvtypes = ChessPiece.getValidTypes();
		    	for (let k = 0; k < mvtypes.length; k++)
		    	{
		    		if (mvtypes[k] === "PAWN" || mvtypes[k] === "ROOK") continue;
		    		else
		    		{
		    			console.log("mvtypes[" + k + "] = " + mvtypes[k]);
		    			
						let uselft = true;
		    			for (let i = 0; i < 2; i++)
		    			{
		    				if (i === 0);
		    				else uselft = false;
		    				let nwcl = ChessPiece.getSetUpColForType(mvtypes[k], uselft);
		    				//console.log("i = " + i);
		    				//console.log("CREATED NEW PIECE AT (" + orw + ", " + nwcl + ")");
		    				let ocp = new ChessPiece(mvtypes[k], clr, orw, nwcl, gid);
		    				//ChessPiece.cps.add(ocp);
		    				if (mvtypes[k] === "KING" || mvtypes[k] === "QUEEN") break;
		    			}//end of i for loop
		    		}
		    	}//end of k for loop
	    	}
    	}//end of x for loop
    }
	
	static clearBoard(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		let allpcs = ChessPiece.getAllPiecesWithGameID(gid);
		let numpcs = ChessPiece.getNumItemsInList(allpcs);
		if (numpcs < 1);
		else
		{
			for (let x = 0; x < allpcs.length; x++)
			{
				ChessPiece.removePieceAt(allpcs[x].getRow(), allpcs[x].getCol(), gid, true);
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
	
	static setUpBoardFromList(gid, addpcs)
	{
		//clear the old board
		//now make copies of those add pcs
		//this is the new board
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		let numpcs = ChessPiece.getNumItemsInList(addpcs);
		if (numpcs < 1);//do nothing
		else
		{
			ChessPiece.clearBoard(gid);
			
			let mylist = addpcs.map((mitem) => {
				return new ChessPiece(mitem.getType(), mitem.getColor(), mitem.getRow(),
					mitem.getCol(), gid, mitem.getMoveCount(), true);
			});
		}
	}
	
	//PRINT BOARD METHODS
    
    static printBoard(mycps)
    {
    	if (ChessPiece.cc.isItemNullOrUndefined(mycps))
		{
			ChessPiece.printBoard([]);
			return;
		}
		//else;//do nothing
		//for (let c = 0; c < mycps.length; c++) console.log(mycps[c]);
    	console.log("mycps.length = " + mycps.length);
    	const myabt = "ABCDEFGH";
    	let mystr = "";
		for (let c = 0; c < 8; c++) mystr += "  " + c + " ";
    	console.log(mystr + " (cols)");
		mystr = "";
    	for (let c = 0; c < 8; c++) mystr += "  " + myabt.charAt(c) + " ";
    	console.log(mystr + "|RK|RW");
		mystr = "";
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			mystr += "|";
    			let fndit = false;
    			for (let x = 0; x < mycps.length; x++)
    			{
    				if (mycps[x].getRow() === r && mycps[x].getCol() === c)
    				{
    					//first letter of color, first letter of type, last letter of type
    					let mtp = "" + mycps[x].getType();
    					let mclr = "" + mycps[x].getColor();
    					mystr += "" + mclr.charAt(0) + mtp.charAt(0) + mtp.charAt(mtp.length - 1);
    					fndit = true;
    					break;
    				}
    				//else;//do nothing
    			}
    			if (fndit);
    			else mystr += "---";
    		}
    		if (ChessPiece.WHITE_MOVES_DOWN_RANKS) console.log(mystr + "| " + (r + 1) + "| " + r);
    		else console.log(mystr + "| " + (8 - r) + "| " + r);
			mystr = "";
    	}
    }
    static printBoardViaGameID(gid)
    {
    	ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		else ChessPiece.printBoard(ChessPiece.getAllPiecesWithGameID(gid));
    }
	printBoard()
	{
		this.printBoard(this.getAllPiecesWithGameID(this.getGameID()));
	}
	
	
	//GET ALL PIECES OF A GAME
	
	static getAllPiecesWithGameID(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		else
		{
			//console.log("ChessPiece.getPCS = ", ChessPiece.getPCS);
			//console.log("ChessPiece.cc.isItemNullOrUndefined(ChessPiece.getPCS) = ",
			//	ChessPiece.cc.isItemNullOrUndefined(ChessPiece.getPCS));
			//console.log("ChessPiece.getPCS() = ", ChessPiece.getPCS());
			//console.log("ChessPiece.cps = ", ChessPiece.cps);

			const mypcsarr = (ChessPiece.cc.isItemNullOrUndefined(ChessPiece.getPCS) ?
				ChessPiece.cps : ChessPiece.getPCS());
			let mycps = null;
			if (ChessPiece.getNumItemsInList(mypcsarr) < 1) return null;
			//else;//do nothing
			for (let x = 0; x < mypcsarr.length; x++)
			{
				if (mypcsarr[x].getGameID() === gid)
				{
					if (ChessPiece.cc.isItemNullOrUndefined(mycps)) mycps = [];
					//else;//do nothing
					
					mycps.push(mypcsarr[x]);
				}
				//else;//do nothing
			}
			return mycps;
		}
	}
	getAllPiecesWithGameID()
	{
		return ChessPiece.getAllPiecesWithGameID(this.getGameID());
	}
	
	
	//NOTE: VALID COLORS LIST DOES NOT INCLUDE BOTH
	static getValidTypesOrColors(useclrs)
	{
		ChessPiece.cc.letMustBeBoolean(useclrs, "useclrs");
		const marr = ((useclrs) ? ChessPiece.validColors : ChessPiece.validTypes);
		return marr.map((mitem) => "" + mitem);
	}
	static getValidTypes()
	{
		return ChessPiece.getValidTypesOrColors(false);
	}
	static getValidColors()
	{
		return ChessPiece.getValidTypesOrColors(true);
	}
	
	static getSetUpColForType(val, uselft)
	{
		ChessPiece.cc.letMustBeBoolean(uselft, "uselft");
		ChessPiece.cc.letMustBeDefinedAndNotNull(val, "chess piece type");
		
		if (val === "CASTLE" || val === "ROOK") return ((uselft) ? 0 : 7);
		else if (val === "KNIGHT") return ((uselft) ? 1 : 6);
		else if (val === "BISHOP") return ((uselft) ? 2 : 5);
		else if (val === "QUEEN") return 3;
		else if (val === "KING") return 4;
		else ChessPiece.cc.logAndThrowNewError("PAWNS ARE FOUND ON ALL COLS!");
	}
	
	static isGenderKnownForPieceMain(tp)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");
		ChessPiece.cc.letMustBeDefinedAndNotNull(ChessPiece.validTypes, "validTypes");
		
		if (ChessPiece.itemIsOnGivenList(tp, ChessPiece.validTypes))
		{
			return ((tp === "PAWN") ? false : true);
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("tp (" + tp + ") is not a valid chess piece type!");
		}
	}
	isGenderKnownForPiece()
	{
		return ChessPiece.isGenderKnownForPieceMain(this.getType());
	}
	//false for female, true for male, ILLEGALSTATE for PAWNS
	static getGenderForPieceMain(tp)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");

		if (ChessPiece.isGenderKnownForPieceMain(tp))
		{
			//return the answer
			if (tp === "QUEEN") return false;
			else return true;
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("PAWNS ARE CAPABLE OF BOTH GENDERS SO GENDER " +
				"IS UNKNOWN!");
		}
	}
	getGenderForPiece()
	{
		return ChessPiece.getGenderForPieceMain(this.getType());
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
	
	setTypeOrColor(val, useclr)
	{
		ChessPiece.cc.letMustBeBoolean(useclr, "useclr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(val, "colorortypeval");
		
		const marr = ((useclr) ? ChessPiece.validColors : ChessPiece.validTypes);
		if (ChessPiece.itemIsOnGivenList(val, marr))
		{
			if (useclr) this.color = "" + val;
			else this.type = ((val === "ROOK") ? "CASTLE" : "" + val);
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL " + (useclr ? "COLOR" : "TYPE") + " (" +
				val + ") FOUND AND USED HERE!");
		}
	}
	setType(val)
	{
		this.setTypeOrColor(val, false);
	}
	setColor(val)
	{
		this.setTypeOrColor(val, true);
	}
	getTypeOrColor(useclr)
	{
		ChessPiece.cc.letMustBeBoolean(useclr, "useclr");
		return ((useclr) ? "" + this.color : "" + this.type);
	}
	getType()
	{
		return this.getTypeOrColor(false);
	}
	getColor()
	{
		return this.getTypeOrColor(true);
	}
	static getLongHandType(tpval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tpval) || tpval.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		}
		else if (tpval === "KG") return "KING";
		else if (tpval === "KT") return "KNIGHT";
		else if (tpval === "CE") return "CASTLE";
		else if (tpval === "QN") return "QUEEN";
		else if (tpval === "BP") return "BISHOP";
		else if (tpval === "PN") return "PAWN";
		else ChessPiece.cc.logAndThrowNewError("ILLEGAL SHORT HAND TYPE (" + tpval + ") FOUND!");
	}
	static getShortHandType(tpval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tpval) || tpval.length < 1)
		{
			ChessPiece.cc.logAndThrowNewError("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		}
		else if (ChessPiece.itemIsOnGivenList(tpval, ChessPiece.validTypes))
		{
			if (tpval === "ROOK") return "CE";
			else return "" + tpval.charAt(0) + tpval.charAt(tpval.length - 1);
		}
		else ChessPiece.cc.logAndThrowNewError("INVALID TYPE (" + tpval + ") FOUND HERE!");
	}
	getShortHandType()
	{
		return ChessPiece.getShortHandType(this.getType());
	}
	//NOTE: DOES NOT INCLUDE BOTH
	static getShortHandColor(clrval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval))
		{
			ChessPiece.cc.logAndThrowNewError("NULL OR EMPTY COLOR NOT ALLOWED HERE!");
		}
		else if (ChessPiece.itemIsOnGivenList(clrval, ChessPiece.validColors))
		{
			return "" + clrval.charAt(0);
		}
		else ChessPiece.cc.logAndThrowNewError("INVALID COLOR (" + clrval + ") FOUND HERE!");
	}
	getShortHandColor()
	{
		return ChessPiece.getShortHandColor(this.getColor());
	}
	static getLongHandColor(clrval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval) || clrval.length != 1)
		{
			ChessPiece.cc.logAndThrowNewError("THE COLOR MUST NOT BE NULL!");
		}
		else if (clrval === "W") return "WHITE";
		else if (clrval === "B") return "BLACK";
		else
		{
			ChessPiece.cc.logAndThrowNewError("INVALID COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}
	}
	//NOTE: DOES NOT INCLUDE BOTH
	static getOppositeColor(clrval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval))
		{
			ChessPiece.cc.logAndThrowNewError("THE COLOR MUST NOT BE NULL!");
		}
		else if (clrval === "WHITE") return "BLACK";
		else if (clrval === "BLACK") return "WHITE";
		else
		{
			ChessPiece.cc.logAndThrowNewError("INVALID COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}
	}
	//throws an exception if the the colors are not valid
	//allows both by default
	static colorIsValid(clrval, allowbth=true)
	{
		ChessPiece.cc.letMustBeBoolean(allowbth, "allowbth");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval) || clrval.length != 5)
		{
			ChessPiece.cc.logAndThrowNewError("INVALID LENGTH FOR THE COLOR!");
		}
		else
		{
			if (clrval === "WHITE" || clrval === "BLACK" || (allowbth && clrval === "BOTH"))
			{
				//do nothing
			}
			else ChessPiece.cc.logAndThrowNewError("INVALID COLOR!");
		}
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
	setMoveCount(val)
	{
		ChessPiece.cc.letMustBeAnInteger(val, "movecount")
		
		if (val < 0)
		{
			ChessPiece.cc.logAndThrowNewError("illegal value found and used for the move count!");
		}
		else this.movecount = val;
	}
	
	static itemIsOnGivenList(val, arr)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(arr)) return false;
		for (let i = 0; i < arr.length; i++)
		{
			if (ChessPiece.cc.isItemNullOrUndefined(val))
			{
				if (ChessPiece.cc.isItemNullOrUndefined(arr[i])) return true;
				//else;//do nothing
			}
			else
			{
				if (ChessPiece.cc.isItemNullOrUndefined(arr[i]));
				else
				{
					if (val === arr[i]) return true;
					//else;//do nothing
				}
			}
		}
		return false;
	}
	
	static transpose(myarr)
	{
		if (ChessPiece.cc.isItemNullOrUndefined(myarr)) return null;
		else if (myarr.length < 1) return [];//new int[0][myarr.length]
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
			
			let resarr = [];//new int[myarr[0].length][myarr.length]
			
			//resarr[c][r] = myarr[r][c];
			for (let c = 0; c < myarr[0].length; c++)
			{
				let mytemparr = [];
				for (let r = 0; r < myarr.length; r++) mytemparr.push(myarr[r][c]);
				resarr.push(mytemparr);
			}
			
			//console.log("NEW DIMENTIONS: resarr.length = " + resarr.length);
			//console.log("resarr[0].length = " + resarr[0].length);
			//console.log("NEW ARRAY:");
			//for (let r = 0; r < resarr.length; r++)
			//{
			//	for (let c = 0; c < resarr[0].length; c++)
			//	{
			//		console.log("resarr[" + r + "][" + c + "] = " + resarr[r][c]);
			//	}
			//}
			if (resarr.length === myarr.length && resarr[0].length === myarr.length);
			else
			{
				ChessPiece.cc.logAndThrowNewError("resarr did not end up with the correct " +
					"sizes!");
			}
			//ChessPiece.cc.logAndThrowNewError("NEED TO CHECK IF THIS WORKS!");
			return resarr;
		}
	}
	
	
	//METHODS FOR GETTING NUM ITEMS IN LIST
	
	static getNumItemsInList(mylist)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mylist)) return 0;
		else return mylist.length;
	}
	
	
	//SOME LOCATION METHODS
	
	static isvalidrorc(val)
	{
		ChessPiece.cc.letMustBeAnInteger(val, "val");

		if (val < ChessPiece.ROWCOLMIN || ChessPiece.ROWCOLMAX < val) return false;
		else return true;
	}
	setRowOrCol(val, usecol)
	{
		ChessPiece.cc.letMustBeAnInteger(val, "roworcolval");
		ChessPiece.cc.letMustBeBoolean(usecol, "usecol");

		if (ChessPiece.isvalidrorc(val))
		{
			if (usecol) this.col = val;
			else this.row = val;
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("the value (" + val +
				") for the row or column is invalid!");
		}
	}
	setCol(val)
	{
		this.setRowOrCol(val, true);
	}
	setRow(val)
	{
		this.setRowOrCol(val, false);
	}
	
	static getLocString(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");

		return "(row: " + rval + ", col: " + cval + ")";
	}
	static getLocStringMain(loc)
	{
		if (ChessPiece.cc.isItemNullOrUndefined(loc)) return null;
		else if (loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("illegal loc found and used here!");
		}
		else return ChessPiece.getLocString(loc[0], loc[1]);
	}
	getMyLocString()
	{
		return ChessPiece.getLocString(this.getRow(), this.getCol());
	}
	
	getRowOrCol(usecol)
	{
		ChessPiece.cc.letMustBeBoolean(usecol, "usecol");

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
	setLoc(rval, cval, skipsetmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeBoolean(skipsetmv, "skipsetmv");

		let terr = false;
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval))
		{
			//if (usecastling || this.canMoveToLoc(rval, cval))
			//{
				if (skipsetmv);
				else
				{
					//generate and save the last set loc call
					//WPNA5TOA6
					let mymvcmd = "" + this.getShortHandColor() + this.getShortHandType() +
						ChessPiece.convertRowColToStringLoc(this.getRow(), this.getCol(),
							ChessPiece.WHITE_MOVES_DOWN_RANKS) + "TO" +
						ChessPiece.convertRowColToStringLoc(rval, cval,
							ChessPiece.WHITE_MOVES_DOWN_RANKS);
					console.log("SETLOC: mymvcmd = " + mymvcmd);
					this.getGame().setLastSetLocMove(mymvcmd);
					//console.log("SETLOC: mymvcmd = " + this.getGame().getLastSetLocMove());
				}
				this.setRow(rval);
				this.setCol(cval);
			//}
			//else terr = true;
		}
		else terr = true;
		if (terr)
		{
			ChessPiece.cc.logAndThrowNewError("cannot move to new location " +
				ChessPiece.getLocString(rval, cval) + "!");
		}
		//else;//do nothing
	}
	setLocMain(loc, skipsetmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(skipsetmv, "skipsetmv");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else this.setLoc(loc[0], loc[1], skipsetmv);
	}
	
	static printSquareColors()
	{
		const myabt = "ABCDEFGH";
		for (let r = 0; r < 8; r++)
		{
			let mystr = "";
			if (r === 0)
			{
				for (let c = 0; c < 8; c++) mystr += "  " + myabt[c] + "   ";
				console.log(mystr + "");
			}
			mystr = "";
			for (let c = 0; c < 8; c++) mystr += "" + ChessPiece.clrs[r][c] + " ";
			console.log(mystr + (r + 1));
		}
	}
	static getSquareColors()
	{
		//D1 is BLACK; D8 is WHITE; H8 is WHITE
		ChessPiece.clrs = [];
		for (let r = 0; r < 8; r++)
		{
			let sclr = ((r % 2 === 0) ? "WHITE" : "BLACK");
			let mytemparr = [];
			for (let c = 0; c < 8; c++)
			{
				//if (c % 2 === 0) ChessPiece.clrs[r][c] = "" + sclr;
				//else clrs[r][c] = ChessPiece.getOppositeColor(sclr);
				mytemparr.push(((c % 2 === 0) ? "" + sclr : ChessPiece.getOppositeColor(sclr)));
				//console.log("ChessPiece.clrs[" + r + "][" + c + "] = " +
				//	ChessPiece.clrs[r][c]);
			}
			//console.log("mytemparr = ", mytemparr);

			if (mytemparr.length === 8) ChessPiece.clrs.push(mytemparr);
			else ChessPiece.cc.logAndThrowNewError("illegal length found and used here!");
		}
		//console.log(ChessPiece.clrs);

		if (ChessPiece.clrs.length === 8 && ChessPiece.clrs[0].length === 8);
		else ChessPiece.cc.logAndThrowNewError("illegal length found and used here!");
		
		//ChessPiece.printSquareColors();
		return ChessPiece.clrs;
	}
	static getColorOfLoc(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval))
		{
			return "" + ChessPiece.clrs[rval][cval];
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("rval and cval must be at least 0 and less " +
				"than 8!");
		}
	}
	static getColorOfLocFromPiece(cp)
	{
		if (ChessPiece.cc.isItemNullOrUndefined(cp))
		{
			ChessPiece.cc.logAndThrowNewError("cp is not allowed to be null!");
		}
		else return ChessPiece.getColorOfLoc(cp.getRow(), cp.getCol());
	}
	
	//CONVERT LOCS METHODS
	
	static locStringIsInCorrectFormat(mlocstr)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mlocstr))
		{
			ChessPiece.cc.logAndThrowNewError("the locstring must not be null!");
		}
		else
		{
			if (mlocstr.length === 2);
			else ChessPiece.cc.logAndThrowNewError("the locstring must be length 2!");
		}
		
		const abet = "ABCDEFGH";
		let fndltr = false;
		let ltri = -1;
		for (let i = 0; i < abet.length; i++)
		{
			if (mlocstr.charAt(0) === abet.charAt(i))
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
			ChessPiece.cc.logAndThrowNewError("the locstr is in the wrong format! " +
				"A letter must be first! If a letter is actually first, then it is " +
				"illegal! If it is legal, then it is not capitalized!");
		}
		
		const dgts = "0123456789";
		let fnddgt = false;
		//allow only 1 through 8 inclusive
		for (let i = 1; i < dgts.length - 1; i++)
		{
			if (dgts.charAt(i) === mlocstr.charAt(1))
			{
				fnddgt = true;
				break;
			}
			//else;//do nothing
		}
		if (fnddgt);
		else
		{
			ChessPiece.cc.logAndThrowNewError("the locstr is in the wrong format! A digit " +
				"must be last! If a digit is actually last, then it is illegal!");
		}
		return true;
	}
	
	static convertWhiteDownRanksLocToWhiteUpRanksLocString(dstr)
	{
		ChessPiece.locStringIsInCorrectFormat(dstr);
		
		//column stays the same
		return "" + dstr.charAt(0) + (8 - Number("" + dstr.charAt(1)) + 1);
	}
	static convertWhiteUpRanksLocToWhiteDownRanksLocString(ustr)
	{
		ChessPiece.locStringIsInCorrectFormat(ustr);
		
		//column stays the same
		return "" + ustr.charAt(0) + (Number("" + ustr.charAt(1)) + 8 - 1);
	}
	static convertWhiteDownOrUpRanksLocToOther(mstr, iswhitedown)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");

		if (iswhitedown) return ChessPiece.convertWhiteDownRanksLocToWhiteUpRanksLocString(mstr);
		else return ChessPiece.convertWhiteUpRanksLocToWhiteDownRanksLocString(mstr);
	}
	
	//iswhitedown (means does white move down ranks) (what white was doing when the
	//given location string was generated)
	//this will convert the location string if iswhitedown is not the same as
	//WHITE_MOVES_DOWN_RANKS
	static convertStringLocToRowCol(mlocstr, iswhitedown)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		ChessPiece.locStringIsInCorrectFormat(mlocstr);
		
		if (iswhitedown === ChessPiece.WHITE_MOVES_DOWN_RANKS);
		else
		{
			return ChessPiece.convertStringLocToRowCol(
				ChessPiece.convertWhiteDownOrUpRanksLocToOther(mlocstr, iswhitedown),
				!iswhitedown);	
		}

		const abet = "ABCDEFGH";
		let fndltr = false;
		let ltri = -1;
		for (let i = 0; i < abet.length; i++)
		{
			if (mlocstr.charAt(0) === abet.charAt(i))
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
			ChessPiece.cc.logAndThrowNewError("the locstr is in the wrong format! A letter " +
				"must be first! If a letter is actually first, then it is illegal! If it is " +
				"legal, then it is not capitalized!");
		}
		
		const dgts = "0123456789";
		let myloc = [];
		if (ChessPiece.WHITE_MOVES_DOWN_RANKS) myloc.push(Number("" + mlocstr.charAt(1)) - 1);
		//number is row
		else myloc.push(8 - Number("" + mlocstr.charAt(1)));//number is row
		myloc.push(Number("" + dgts.charAt(ltri)));//letter is column
		
		//console.log("mlocstr = " + mlocstr);
		//console.log("myloc = ", myloc);
		if (ChessPiece.isvalidrorc(myloc[0]) && ChessPiece.isvalidrorc(myloc[1])) return myloc;
		else ChessPiece.cc.logAndThrowNewError("CONVERSION ERROR! FINAL R AND C ARE NOT VALID!");
	}
	
	//retwhitedown is WHITE_MOVES_DOWN_RANKS by default
	static convertRowColToStringLoc(rval, cval, retwhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeBoolean(retwhitedown, "retwhitedown");
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("R OR C MUST BE VALID!");
		
		const abet = "ABCDEFGH";
		if (retwhitedown) return "" + abet.charAt(cval) + "" + (rval + 1);
		else return "" + abet.charAt(cval) + "" + (8 - rval);
	}
	static convertRowColToStringLocMain(mloc, retwhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS)
	{
		ChessPiece.cc.letMustBeBoolean(retwhitedown, "retwhitedown");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.convertRowColToStringLoc(mloc[0], mloc[1], retwhitedown);
	}
	
	//if not valid, it just prints it out and does not convert it
	//uses WHITE_MOVES_DOWN_RANKS value
	static getLocStringAndConvertIt(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		const lstr = ChessPiece.getLocString(rval, cval);
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval))
		{
			return "" + lstr + " " + ChessPiece.convertRowColToStringLoc(rval, cval,
					ChessPiece.WHITE_MOVES_DOWN_RANKS);
		}
		else return lstr;
	}
	static getLocStringAndConvertItMain(mloc)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.getLocStringAndConvertIt(mloc[0], mloc[1]);
	}
	
	static getLocsFromPieceList(allpcs)
	{
		let mxitems = ChessPiece.getNumItemsInList(allpcs);
		if (mxitems < 1) return null;
		else return allpcs.map((mpc) => [mpc.getRow(), mpc.getCol()]);
	}
	
	static printLocsArray(locs, arrnm="locs", cp=null)
    {
    	if (ChessPiece.cc.isStringEmptyNullOrUndefined(arrnm))
    	{
    		ChessPiece.printLocsArray(locs, "locs");
    		return;
    	}
    	//else;//do nothing
    	
    	if (ChessPiece.cc.isItemNullOrUndefined(locs)) console.log("" + arrnm + " = null");
    	else if (locs.length < 1) console.log("" + arrnm + " is empty!");
    	else
    	{
    		console.log("" + arrnm + ".length = " + locs.length);
    		let iscloc = false;
	    	for (let x = 0; x < locs.length; x++)
	    	{
	    		if (ChessPiece.cc.isItemNullOrUndefined(cp));
	    		else iscloc = (cp.getRow() === locs[x][0] && cp.getCol() === locs[x][1]);
	    		let msg = "" + ChessPiece.getLocStringAndConvertIt(locs[x][0], locs[x][1]);
	    		if (iscloc) msg += " (you are here)";
	    		else
	    		{
	    			if (ChessPiece.cc.isItemNullOrUndefined(cp));
	    			else
	    			{
	    				if (cp.getType() === "PAWN")
		    			{
		    				if (ChessPiece.canPawnBePromotedAt(locs[x][0], locs[x][1],
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
		    			else if (cp.getType() === "KING")
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
	
	static printOneDIntArray(arr)
	{
		if (ChessPiece.cc.isItemNullOrUndefined(arr)) console.log("arr = null!");
		else if (arr.length < 1) console.log("arr is empty!");
		else for (let i = 0; i < arr.length; i++) console.log("arr[" + i + "] = " + arr[i]);
		console.log("");
	}
	
	static printPiecesList(pcs, onelineonly, bfrmsg="")
	{
		ChessPiece.cc.letMustBeBoolean(onelineonly, "onelineonly");
		if (ChessPiece.cc.isItemNullOrUndefined(bfrmsg))
		{
			ChessPiece.printPiecesList(pcs, onelineonly, "");
			return;
		}
		//else;//do nothing
		
		if (onelineonly) console.log(bfrmsg + "pcs = ", pcs);
		else
		{
			let numpcs = ChessPiece.getNumItemsInList(pcs);
			if (numpcs < 1) console.log(bfrmsg + "pcs is null or empty!");
			else
			{
				console.log(bfrmsg + "pcs has " + numpcs + " item(s) on it!");
				for (let p = 0; p < numpcs; p++)
				{
					console.log("pcs[" + p + "] = " + pcs[p].toString());
				}
			}
		}
	}
	
	
	//METHODS TO GENERATE THE NEW BOARD LIST FROM A LIST OF CHANGES TO THE OLD BOARD
	
	static combineBoardAndIgnoreLists(ignorelist, boardlist)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(boardlist)) return boardlist;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(ignorelist)) return boardlist;
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
				if (ChessPiece.cc.isItemNullOrUndefined(retlist)) retlist = [];
				//else;//do nothing
				retlist.push(boardlist[x]);
			}
			//else;//do nothing
		}
		return retlist;
	}
	static combineBoardAndIgnoreListsMain(ignorelist, gid)
	{
		return ChessPiece.combineBoardAndIgnoreLists(ignorelist,
			ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	static combineBoardAddAndIgnoreLists(ignorelist, addpcs, boardlist)
	{
		//we prioritize the: addlist > ignorelist > boardlist
		//initially start with the add list
		//then if on the add list and ignore list, ignore what is already accounted for,
		//keep what needs to be kept
		//then determine what we can keep on the last one and that is it...
		//then return result.
		
		ChessPiece.cc.letMustBeDefinedAndNotNull(boardlist, "boardlist");
		
		let retlist = null;
		if (ChessPiece.getNumItemsInList(addpcs) < 1);
		else retlist = addpcs.map((mitem) => mitem);
		//console.log("NEW retlist = ", retlist);
		
		if (ChessPiece.getNumItemsInList(addpcs) < 1)
		{
			retlist = ChessPiece.combineBoardAndIgnoreLists(ignorelist, boardlist);
		}
		else
		{
			//console.log("RETLIST IS NOT EMPTY!");
			//generate the new ignore list
			//then get the result and add all of that to the retlist
			if (ChessPiece.getNumItemsInList(ignorelist) < 1)
			{
				//console.log("IGNORELIST IS EMPTY OR NULL!");
				//need to combine board and add list here
				for (let x = 0; x < boardlist.length; x++)
				{
					let addit = true;
					if (ChessPiece.cc.isItemNullOrUndefined(retlist)) retlist = [];
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
					if (addit) retlist.push(boardlist[x]);
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
				//		if (retlist[i].getRow() === ignorelist[x][0] &&
				//			retlist[i].getCol() === ignorelist[x][1])
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
				//if (numrm < 0)
				//{
				//	ChessPiece.cc.logAndThrowNewError("numrm must be at least zero!");
				//}
				//else if (numrm < 1)
				//{
				//	bdiglist = ChessPiece.combineBoardAndIgnoreLists(ignorelist, boardlist);
				//}
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
					bdiglist = ChessPiece.combineBoardAndIgnoreLists(ignorelist, boardlist);
					//nwiglist
				//}
				if (ChessPiece.getNumItemsInList(bdiglist) < 1);
				else for (let x = 0; x < bdiglist.length; x++) retlist.push(bdiglist[x]);
			}
		}
		//console.log("FINAL retlist = ", retlist);
		return retlist;
	}
	static combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid)
	{
		return ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs,
			ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	static copyPartOfListAndReturn(mxsz, keeplist, errmsg=null)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(keeplist, "keeplist");
		ChessPiece.cc.letMustBeAnInteger(mxsz, "mxsz");

		//copy keeplist into rlist
		let rlist = [];//new int[mxsz][2];
		for (let x = 0; x < mxsz; x++)
		{
			rlist.push([keeplist[x][0], keeplist[x][1]]);
		}
		//console.log("rlist = ", rlist);
		//ChessPiece.printLocsArray(rlistmvlocs, "rlistmvlocs");
		if (rlist.length === mxsz && (mxsz === 0 || (0 < mxsz && rlist[0].length === 2)))
		{
			return rlist;
		}
		else
		{
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(errmsg))
			{
				ChessPiece.cc.logAndThrowNewError("the resultant array rlist has " +
					"invalid dimensions!");
			}
			else ChessPiece.cc.logAndThrowNewError(errmsg);
		}
	}

	//merges the two lists
	static combineIgnoreLists(ilista, ilistb)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(ilista)) return ilistb;
		else if (ChessPiece.cc.isStringEmptyNullOrUndefined(ilistb)) return ilista;
		else
		{
			let midreslist = [];//new int[ilista.length + ilistb.length][2];
			for (let x = 0; x < ilista.length + ilistb.length; x++) midreslist.push([-1, -1]);
			let midreslisti = 0;
			for (let x = 0; x < ilista.length; x++)
			{
				midreslist[midreslisti][0] = ilista[x][0];
				midreslist[midreslisti][1] = ilista[x][1];
				midreslisti++;
			}
			for (let x = 0; x < ilistb.length; x++)
			{
				//do nothing do not add it
				if (ChessPiece.isLocOnListOfLocsMain(ilistb[x], midreslist));
				else
				{
					midreslist[midreslisti][0] = ilistb[x][0];
					midreslist[midreslisti][1] = ilistb[x][1];
					midreslisti++;
				}
			}
			//console.log("midreslisti = " + midreslisti);

			//copy midreslist into reslist
			return ChessPiece.copyPartOfListAndReturn(midreslisti, midreslist);
		}
	}
	
	//WILL ONLY USE ONE PIECE FOR A LOCATION IF THEY ARE DIFFERENT TYPES ONLY THE ONE ON
	//LISTA WILL BE USED
	static combineTwoPieceLists(lista, listb)
	{
		if (ChessPiece.getNumItemsInList(lista) < 1) return listb;
		else if (ChessPiece.getNumItemsInList(listb) < 1) return lista;
		else
		{
			let alocs = [];
			for (let x = 0; x < lista.length; x++)
			{
				let addit = false;
				for (let p = 0; p < alocs.length; p++)
				{
					if ((alocs[p].getRow() === lista[x].getRow()) &&
						(alocs[p].getCol() === lista[x].getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.push(lista[x]);
				//else;//do nothing
			}
			for (let x = 0; x < listb.length; x++)
			{
				let addit = false;
				for (let p = 0; p < alocs.length; p++)
				{
					if ((alocs[p].getRow() === listb[x].getRow()) &&
						(alocs[p].getCol() === listb[x].getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.push(listb[x]);
				//else;//do nothing
			}
			return alocs;
		}
	}
	
	
	//GET PIECE AT AND IS LOCATION EMPTY METHODS
	
	static getPieceAt(rval, cval, mpclist)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mpclist));
		else
		{
			for (let x = 0; x < mpclist.length; x++)
			{
				if (mpclist[x].getRow() === rval && mpclist[x].getCol() === cval)
				{
					return mpclist[x];
				}
				//else;//do nothing no match
			}
		}
		//console.log("NO ITEMS FOUND AT: " + ChessPiece.getLocString(rval, cval) + "!");
		return null;
	}
	static getPieceAtMain(mloc, mpclist)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.getPieceAt(mloc[0], mloc[1], mpclist);
	}
	static getPieceAtVIAGID(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		
		return ChessPiece.getPieceAt(rval, cval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	static getPieceAtVIAGIDMain(mloc, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.getPieceAtVIAGID(mloc[0], mloc[1], gid, ignorelist, addpcs);
	}
	getPieceAtFromMe(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		return ChessPiece.getPieceAt(rval, cval, this.getAllPiecesWithGameID());
	}
	getPieceAtFromMeMain(mloc)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return this.getPieceAtFromMe(mloc[0], mloc[1]);
	}
	
	static isLocationEmpty(rval, cval, mpclist)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		let cp = ChessPiece.getPieceAt(rval, cval, mpclist);
		return (ChessPiece.cc.isItemNullOrUndefined(cp));
	}
	static isLocationEmptyMain(mloc, mpclist)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.isLocationEmptyVIAGID(mloc[0], mloc[1], mpclist);
	}
	//prioritize addpcs list above board list
	static isLocationEmptyVIAGID(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, ignorelist, addpcs);
		return (ChessPiece.cc.isItemNullOrUndefined(cp));
	}
	static isLocationEmptyVIAGIDMain(mloc, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return ChessPiece.isLocationEmptyVIAGID(mloc[0], mloc[1], gid, ignorelist, addpcs);
	}
	isLocationEmptyFromMe(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		return ChessPiece.isLocationEmptyVIAGID(rval, cval, this.getGameID());
	}
	isLocationEmptyFromMeMain(mloc)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mloc) || mloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("the loc array must have two integers on it!");
		}
		else return this.isLocationEmptyFromMe(mloc[0], mloc[1]);
	}
	

	//FILTER METHODS BY COLOR, TYPE, OR BOTH
	
	static filterListByColorOrType(mylist, clrortpval, usetp)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrortpval, "clrortpval");
		ChessPiece.cc.letMustBeBoolean(usetp, "usetp");
		let myvarr = ((usetp) ? ChessPiece.validTypes : ChessPiece.validColors);
		if (ChessPiece.itemIsOnGivenList(clrortpval, myvarr));
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL " + ((usetp) ? "TYPE" : "COLOR") +
				" (" + clrortpval + ") FOUND AND USED HERE!");
		}

		let myretlist = null;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mylist)) return null;
		else
		{
			for (let x = 0; x < mylist.length; x++)
			{
				let mytempval = ((usetp) ? mylist[x].getType() : mylist[x].getColor());
				if (mytempval === clrortpval)
				{
					if (ChessPiece.cc.isItemNullOrUndefined(myretlist)) myretlist = [];
					//else;//do nothing
					myretlist.push(mylist[x]);
				}
			}
			return myretlist;
		}
	}
	static filterListByColor(mylist, clrval)
	{
		return ChessPiece.filterListByColorOrType(mylist, clrval, false);
	}
	static filterListByType(mylist, typeval)
	{
		return ChessPiece.filterListByColorOrType(mylist, typeval, true);
	}
	
	static filterListByColorAndType(typeval, clrval, allpcs)
	{
		return ChessPiece.filterListByColor(ChessPiece.filterListByType(allpcs, typeval), clrval);
	}
	static filterListByColorAndTypeMain(typeval, clrval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.filterListByColorAndType(typeval, clrval,
			ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	//GET CURRENT SIDE PIECES
	
	static getCurrentSidePieces(clrval, allpcs)
	{
		return ChessPiece.filterListByColor(allpcs, clrval);
	}
	static getCurrentSidePiecesMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getCurrentSidePieces(clrval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	static getOpposingSidePieces(clrval, allpcs)
	{
		return ChessPiece.getCurrentSidePieces(ChessPiece.getOppositeColor(clrval), allpcs);
	}
	static getOpposingSidePiecesMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getOpposingSidePieces(clrval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	getMySidePieces()
	{
		return ChessPiece.getCurrentSidePiecesMain(this.getColor(), this.getGameID());
	}
	
	
	//GET ALL OF A CERTAIN TYPE
	
	static getAllOfType(typeval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(typeval, "typeval");
		return ChessPiece.filterListByType(allpcs, typeval);
	}
	static getAllOfTypeMain(typeval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(typeval, "typeval");
		return ChessPiece.getAllOfType(typeval, ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	
	static getAllKings(allpcs)
	{
		return ChessPiece.getAllOfType("KING", allpcs);
	}
	static getAllKingsMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllKings(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfTypeMain("KING", gid);
	}
	static getAllCastles(allpcs)
	{
		return ChessPiece.getAllOfType("CASTLE", allpcs);
	}
	static getAllCastlesMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllCastles(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfTypeMain("CASTLE", gid);
	}
	static getAllRooks(allpcs)
	{
		return ChessPiece.getAllCastles(allpcs);
	}
	static getAllRooksMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllCastlesMain(gid);
	}
	static getAllQueens(allpcs)
	{
		return ChessPiece.getAllOfType("QUEEN", allpcs);
	}
	static getAllQueensMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllQueens(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfTypeMain("QUEEN", gid);
	}
	static getAllKnights(allpcs)
	{
		return ChessPiece.getAllOfType("KNIGHT", allpcs);
	}
	static getAllKnightsMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllKnights(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfType("KNIGHT", gid);
	}
	static getAllBishops(allpcs)
	{
		return ChessPiece.getAllOfType("BISHOP", allpcs);
	}
	static getAllBishopsMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllBishops(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfTypeMain("BISHOP", gid);
	}
	static getAllPawns(allpcs)
	{
		return ChessPiece.getAllOfType("PAWN", allpcs);
	}
	static getAllPawnsMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllPawns(ChessPiece.getAllPiecesWithGameID(gid));
		//return ChessPiece.getAllOfTypeMain("PAWN", gid);
	}
	
	
	static getAllKnightsOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllKnights(allpcs), clrval);
	}
	static getAllKnightsOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllKnightsOfColor(clrval, ChessPiece.getAllKnightsMain(gid));
	}
	static getAllKingsOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllKings(allpcs), clrval);
	}
	static getAllKingsOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllKingsOfColor(clrval, ChessPiece.getAllKingsMain(gid));
	}
	static getAllCastlesOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllCastles(allpcs), clrval);
	}
	static getAllCastlesOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllCastlesOfColor(clrval, ChessPiece.getAllCastlesMain(gid));
	}
	static getAllRooksOfColor(clrval, allpcs)
	{
		return ChessPiece.getAllCastlesOfColor(clrval, allpcs);
	}
	static getAllRooksOfColorMain(clrval, gid)
	{
		return ChessPiece.getAllCastlesOfColorMain(clrval, gid);
	}
	static getAllQueensOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllQueens(allpcs), clrval);
	}
	static getAllQueensOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllQueensOfColor(clrval, ChessPiece.getAllQueensMain(gid));
	}
	static getAllBishopsOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllBishops(allpcs), clrval);
	}
	static getAllBishopsOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllBishopsOfColor(clrval, ChessPiece.getAllBishopsMain(gid));
	}
	static getAllPawnsOfColor(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.filterListByColor(ChessPiece.getAllPawns(allpcs), clrval);
	}
	static getAllPawnsOfColorMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getAllPawnsOfColor(clrval, ChessPiece.getAllPawnsMain(gid));
	}
	
	
	//GET CURRENT SIDE KING
	
	static getCurrentSideKing(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		if (ChessPiece.itemIsOnGivenList(clrval, ChessPiece.validColors));
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}

		let mysidepieces = ChessPiece.getCurrentSidePieces(clrval, allpcs);
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mysidepieces)) return null;
		else
		{
			for (let x = 0; x < mysidepieces.length; x++)
			{
				if (mysidepieces[x].getType() === "KING") return mysidepieces[x];
			}
			return null;
		}
	}
	static getCurrentSideKingMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getCurrentSideKing(clrval, ChessPiece.getAllPiecesWithGameID(gid));
	}
	static getOppositeSideKing(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		return ChessPiece.getCurrentSideKing(ChessPiece.getOppositeColor(clrval), allpcs);
	}
	static getOppositeSideKingMain(clrval, gid)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.getOppositeSideKing(clrval, ChessPiece.getAllPiecesWithGameID(gid));
	}
	getMySideKing()
	{
		if (this.getType() === "KING") return this;
		else return ChessPiece.getCurrentSideKingMain(this.getColor(), this.getGameID());
	}
	
	
	//IS BOARD VALID METHODS
	
	static getCountForPieceTypeForASide(pccnts, tpval)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tpval))
		{
			ChessPiece.cc.logAndThrowNewError("illegal type found and used here!");
		}
		//else;//do nothing
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(pccnts)) return 0;
		else if (pccnts.length != 6)
		{
			ChessPiece.cc.logAndThrowNewError("illegal counts found and used here!");
		}
		//else;//do nothing
		
		const mytps = ["KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"];//ROOK
		let tpi = -1;
		for (let i = 0; i < mytps.length; i++)
		{
			let fndit = false;
			if ((mytps[i] === "CASTLE" && tpval === "ROOK") || (mytps[i] === tpval)) fndit = true;
			//else;//do nothing
			
			if (fndit)
			{
				tpi = i;
				break;
			}
			//else;//do nothing
		}
		if (tpi < 0 || mytps.length - 1 < tpi)
		{
			ChessPiece.cc.logAndThrowNewError("illegal type found and used here!");
		}
		//else;//do nothing
		if (pccnts[tpi] < 0 || 10 < pccnts[tpi])
		{
			ChessPiece.cc.logAndThrowNewError("illegal count found and used here!");
		}
		else return pccnts[tpi];
	}
	
	static getCountsForEachPieceTypeForASide(pcstpcs)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(pcstpcs))
		{
			ChessPiece.cc.logAndThrowNewError("there must be pieces on the list!");
		}
		//else;//do nothing
		
		//king, queen, castle (rook), bishop, knight, pawn
		let pccnts = [0, 0, 0, 0, 0, 0];
		const mytps = ["KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"];//ROOK
		const maxallowed = [1, 9, 10, 10, 10, 8];
		const startamt = [1, 1, 2, 2, 2, 8];
		for (let ci = 0; ci < 6; ci++)
		{
			pccnts[ci] = 0;
			for (let x = 0; x < pcstpcs.length; x++)
			{
				if (ci === 2 && (pcstpcs[x] === "ROOK" || pcstpcs[x] === "CASTLE"))
				{
					//count it
					pccnts[ci] = pccnts[ci] + 1;
				}
				else if (pcstpcs[x] === mytps[ci])
				{
					//count it
					pccnts[ci] = pccnts[ci] + 1;
				}
				//else;//do nothing
			}
			//make sure the board is valid
			if (pccnts[ci] < 0 || maxallowed[ci] < pccnts[ci])
			{
				ChessPiece.cc.logAndThrowNewError("illegal number of pieces found on the board!");
			}
			//else;//do nothing
			if (ci === 0)
			{
				if (pccnts[ci] === maxallowed[ci]);
				else
				{
					ChessPiece.cc.logAndThrowNewError("illegal number of kings found on " +
						"the board!");
				}
			}
			//else;//do nothing
		}
		//make sure the board is valid
		let ttl = 0;
		for (let ci = 0; ci < 6; ci++) ttl += pccnts[ci];
		if (ttl < 1 || 16 < ttl)
		{
			ChessPiece.cc.logAndThrowNewError("illegal total number of side pieces (" + ttl +
				") found on the board!");
		}
		//else;//do nothing
		let diffstart = [0, 0, 0, 0, 0, 0];
		//actual amount - start amount; diff < 0 when actual < start; 0 < diff when start < actual
		for (let ci = 0; ci < 6; ci++) diffstart[ci] = pccnts[ci] - startamt[ci];
		let numusdpns = 0;
		for (let ci = 0; ci < 6; ci++)
		{
			if (diffstart[ci] < -8 || 8 < diffstart[ci])
			{
				ChessPiece.cc.logAndThrowNewError("illegal diff (" + diffstart[ci] +
					") found and used here!");
			}
			//else;//do nothing
			if (ci === 0)
			{
				if (diffstart[ci] === 0);
				else
				{
					ChessPiece.cc.logAndThrowNewError("illegal number of kings found on " +
						"the board!");
				}
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
			ChessPiece.cc.logAndThrowNewError("illegal number of used pawns pieces (" +
				numusdpns + ") with " + pccnts[5] + " pawn(s) found on the board!");
		}
		//else;//do nothing
		return pccnts;
	}
	
	static getPieceTypes(allpcs)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(allpcs)) return null;
		else return allpcs.map((mpc) => mpc.getType());
	}
	
	static isThereTwoPiecesAtOneLocation(allpcs)
	{
		let numallpcs = ChessPiece.getNumItemsInList(allpcs);
		if (numallpcs < 2) return false;
		else
		{
			let allocs = ChessPiece.getLocsFromPieceList(allpcs);
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
	
	//THIS CANNOT TELL IF THE SET UP IS ILLEGAL OR NOT OR RATHER IT CANNOT TELL
	//IF IT IS POSSIBLE OR NOT
	//IT CAN TELL IF THERE ARE AN ILLEGAL NUMBER OF PIECES ON THE BOARD
	static isBoardValid(allpcs)
	{
		//each side must have at most 16 pieces total one of which must be a king
		//there are only 8 pawns so at most 8 pawns plus one of each
		//the most we can have of any one piece excluding kings and pawns is 9
		//at most 1 king, 8 pawns, 9 of the others per side.
		//if we have 9 of one we will have no pawns.
		
		if (ChessPiece.isThereTwoPiecesAtOneLocation(allpcs))
		{
			ChessPiece.cc.logAndThrowNewError("THERE ARE TWO PIECES AT A LOCATION!");
		}
		//else;//do nothing
		
		//the # of pawns on the board will be minus one for every one more of another type.
		let wpcs = ChessPiece.filterListByColor(allpcs, "WHITE");
		let bpcs = ChessPiece.filterListByColor(allpcs, "BLACK");
		let wpcstps = ChessPiece.getPieceTypes(wpcs);
		let bpcstps = ChessPiece.getPieceTypes(bpcs);
		try
		{
			let wpctpscnts = ChessPiece.getCountsForEachPieceTypeForASide(wpcstps);
		}
		catch(ex)
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL NUMBER OF WHITE PIECES FOUND " +
				"ON THE BOARD!", ex);
		}
		try
		{
			let bpctpscnts = ChessPiece.getCountsForEachPieceTypeForASide(bpcstps);
		}
		catch(ex)
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL NUMBER OF BLACK PIECES FOUND " +
				"ON THE BOARD!", ex);
		}
		return true;
	}
	static isBoardValidMain(gid)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.isBoardValid(ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	
	//HOW TO REMOVE PIECES?
	//WE NEED TO REMOVE THEM FROM THE LIST OF PIECES.
	//WE NEED TO MAKE THEIR REFERENCES BE NULL.
	static removePieceAt(rval, cval, gid, clearboardcalled=false)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeBoolean(clearboardcalled, "clearboardcalled");

		if (clearboardcalled);
		else ChessPiece.isBoardValidMain(gid);
		const mypcsarr = (ChessPiece.cc.isItemNullOrUndefined(ChessPiece.getPCS) ?
			ChessPiece.cps : ChessPiece.getPCS());
		let numpcs = ChessPiece.getNumItemsInList(mypcsarr);
		if (numpcs < 1);
		else
		{
			if (ChessPiece.cc.isItemNullOrUndefined(ChessPiece.remPC))
			{
				ChessPiece.cps = ChessPiece.cps.filter((mpc) => {
					if (mpc.getRow() === rval && mpc.getCol() === cval &&
						mpc.getGameID() === gid)
					{
						console.log("REMOVED ", mpc);
						return false;//remove
					}
					else return true;//keep
				});
			}
			else ChessPiece.remPC(rval, cval, gid);
		}
	}
	static removePieceAtMain(loc, gid, clearboardcalled=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeBoolean(clearboardcalled, "clearboardcalled");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else ChessPiece.removePieceAt(loc[0], loc[1], gid, clearboardcalled);
	}
	
	
	//NEED TO KNOW WHOSE TURN IT IS AND
	//NEED TO PREVENT THE OTHER SIDE FROM MOVING UNTIL WE TELL THEM IT IS THEIR TURN
	//NEED A WAY TO COMMUNICATE WITH MY SERVER:
	//NEED A WAY TO TELL THE OTHER COMPUTER: IT IS THEIR TURN, WHAT MOVES WERE MADE,
	//AND HOW THE GAME ENDS,
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
	//HINTS COMMANDS DO NOT NEED TO BE STORED, BECAUSE THEY ARE EXECUTE ONLY,
	//YOU CANNOT UNDO HINTS COMMANDS
	
	
	//BEFORE WE ADVANCE TO THE OTHER SIDE'S TURN:
	//MAKE THE UNOFFICIAL_MOVE OFFICIAL
	//IF THEY ARE IN CHECK AND THE UNOFFICIAL_MOVE DID NOT MOVE THEM OUT OF CHECK ASK IF THEY
	//WANT TO SURRENDER OR UNDO?
	//IF THEY CHOOSE SURRENDER: CHECKMATE! OTHER SIDE WINS!
	//IF THEY CHOOSE UNDO: NEED TO LET THEM MOVE THEN RE-ENTER THIS METHOD.
	//WE NEED TO CHECK TO SEE IF THE CURRENT SIDE KING IS STILL IN CHECK() IF SO, END GAME
	//IMMEDIATELY CHECKMATE!
	//CHECK TO SEE IF THE GAME ENDS IN AN AUTO-STALEMATE
	//NOTE: PAWN PROMOTION TAKEN CARE OF WITH GEN MOVE TO COMMAND METHOD!!!
	//--WE NEED TO CHECK TO SEE IF THERE ARE PAWNS FOR THAT SIDE THAT HAVE MADE IT TO THE
	//OTHER SIDE AND (DONE)
	//--NEED PROMOTED AND TO PROMOTE THEM (DONE)
	//IF THE GAME HAS NOT ENDED, THEN WHAT????
	
	static advanceTurnIfPossible(sidemoved, gid, isuser, undoifincheck=true, ignorelist=null,
		addpcs=null)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(sidemoved, "sidemoved");
		ChessPiece.cc.letMustBeBoolean(undoifincheck, "undoifincheck");
		ChessPiece.cc.letMustBeBoolean(isuser, "isuser");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		
		//make sure the side that just moved is not in check
		//if they are in check and it can be undone undo it
		//if they choose surrender, ends the game
		//check to see if it is checkmate
		
		//NUM OFFICIAL MOVES WILL BE AT LEAST ONE!
		ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
		
		if (ChessPiece.isSideInCheck(sidemoved, ignorelist, addpcs, gid))
		{
			if (undoifincheck)
			{
				console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN BEFORE UNDO!");
				
				//force the undo command on the last made move
				//undo it
		    	let myounmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain("UNDO", gid);
		    	//console.log("MY UNDO MOVE:");
		    	ChessPiece.convertAllShortHandMovesToLongVersion(myounmv);
		    	
		    	ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
		    	
		    	ChessPiece.makeLocalMove(myounmv, gid, true, ChessPiece.WHITE_MOVES_DOWN_RANKS,
					isuser);
		    	ChessPiece.printBoard(gid);
		    	console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
				
				//then done with this method for the moment so return
				console.log("UNDID THE MOVE, NOT READY TO ADVANCE TURNS YET!");
				//return;
			}
			else
			{
				//surrender unless checkmate
				if (ChessPiece.inCheckmate(sidemoved, gid, ignorelist, addpcs))
				{
					ChessPiece.getGameVIAGID(gid).setColorWins(
						ChessPiece.getOppositeColor(sidemoved), true);
				}
				else ChessPiece.getGameVIAGID(gid).setColorResigns(sidemoved, true);
			}
		}
		else
		{
			//if is checkmate -> end the game instead
			//if is stalemate -> end the game instead
			//else just advance the turn -> not over
			
			if (ChessPiece.inCheckmate(ChessPiece.getOppositeColor(sidemoved),
				gid, ignorelist, addpcs))
			{
				ChessPiece.getGameVIAGID(gid).setColorWins(sidemoved, true);
			}
			else
			{
				if (ChessPiece.isStalemate(sidemoved, gid, ignorelist, addpcs))
				{
					ChessPiece.getGameVIAGID(gid).setIsTied(true);
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
					if (!isuser || ChessPiece.getGameVIAGID(gid).getMyColor() === "BOTH");
					else
					{
						//send commands...
					}
					console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
				}
			}
		}
	}
	static advanceTurnIfPossibleMain(sidemoved, gid, undoifincheck=true,
		ignorelist=null, addpcs=null)
	{
		ChessPiece.advanceTurnIfPossible(sidemoved, gid,
			ChessPiece.getGameVIAGID(gid).doesColorMatchMyColor(sidemoved), undoifincheck,
				ignorelist, addpcs);
	}
	static advanceTurnIfPossibleViaTheUnofficialMove(gid, isuser)
	{
		ChessPiece.cc.letMustBeBoolean(isuser, "isuser");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		//get the color of the unofficial move before it is official
		let mymvscp = [ChessPiece.getGameVIAGID(gid).genCopyOfUnofficialMove()];
		let clrsmvs = ChessPiece.getSideColorsForMoves(mymvscp);
		ChessPiece.advanceTurnIfPossible(clrsmvs[0], gid, isuser);
	}
	
	
	//CHECKMATE: ONE SIDE IS IN CHECK AND CANNOT GET OUT OF IT
	//THEY CANNOT BLOCK CHECK, THEY CANNOT MOVE OUT OF CHECK, AND THEY CANNOT
	//KILL THE CHECKING PIECE
	
	
	//STALEMATE: IS WHEN A SIDE HAS NO LEGAL MOVES. RULE: YOU CANNOT MOVE INTO CHECK!!!
	//
	//AUTO-STALEMATE:
	//ANY ONE OF THESE SITUATIONS OCCURS THE OTHERSIDE COULD HAVE ONE OF THESE
	//KING VS KING, KING AND KNIGHT VS KING
	//KING AND ANY NUMBER OF BISHOPS VS KING AND ANY NUMBER OF BISHOPS WHERE
	//ALL THE BISHOPS ARE ON THE SAME COLOR SQUARES
	//KING AND PAWNS VS KING AND PAWNS (NO FREE PAWNS, ABILITY TO ALL BE BLOCKED AND
	//REMAIN THAT WAY) -> (KING VS KING)
	//
	//DEBATE SURROUNDING THIS: KING AND 2 KNIGTS AND NO OPPOSING PAWNS VS KING
	//(CHECK MATE IS POSSIBLE, BUT CANNOT BE FORCED)
	//KING AND (KNIGHT OR BISHOP) VS KING AND (KNIGHT OR BISHOP) CHECK MATE IS POSSIBLE,
	//BUT CANNOT BE FORCED
	//
	//HOWEVER IF THERE IS A QUEEN ON THE BOARD OR A CASTLE, YOU WILL BE ABLE TO FORCE CHECKMATE
	
	
	//THE OVERALL GOAL OF THE NEXT SET OF METHODS IS TO DETERMINE WHAT PIECES CAN
	//ATTACK A LOCATION
	//
	//NEED TO KNOW WHAT LOCATIONS CAN BE ATTACKED BY THE OPPOSITE SIDE. (DONE)
	//NEED TO KNOW IF EXCLUDING CERTAIN PIECIES EFFECT IT. (DONE)
	//NEED TO KNOW IF ADDING CERTAIN PIECES AT CERTAIN SPOTS EFFECT IT. (DONE)
	//
	//WE NEED TO KNOW HOW ADDING A PIECE AT CERTAIN SPOTS AND IGNORING OTHERS AT
	//CERTAIN SPOTS EFFECT THIS?
	//WE DO NOT WANT THE NEW PIECE(S) TO BE ON THE BOARD!!!
	//WE ALSO DO NOT WANT IT TO BE ADDED TO THE LIST OF OFFICIAL CHESS PIECES!!!
	//WE HAVE A LIST OF PIECES ON THE BOARD
	//WE CAN TELL THE ALGORITHM TO IGNORE SOME OF THEM WHEN SEARCHING FOR GUARDING LOCATIONS
	//WE WANT TO BE ABLE TO TELL THAT SAME ALGORITHM THAT SOME NEW PIECES ARE AT
	//A CERTAIN LOCATION
	//WE WANT TO KEEP THE RETURN TYPE THE SAME!
	//TELL THE CONSTRUCTOR NOT TO ADD IT SO IT WILL THINK IT IS NOT ON THE BOARD
	
	
	//NOTE: THE IS LOCATION GUARDED METHODS ARE NOT AS ACCURATE AS
	//THE GET PIECES GUARDING LOCATION METHODS
	
	static getAllPossibleKnightMoveToLocs(rval, cval)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		
		let pklocs = [];
		pklocs.push([rval - 2, cval - 1]);
		pklocs.push([rval - 2, cval + 1]);
		pklocs.push([rval + 2, cval - 1]);
		pklocs.push([rval + 2, cval + 1]);
		pklocs.push([rval - 1, cval - 2]);
		pklocs.push([rval - 1, cval + 2]);
		pklocs.push([rval + 1, cval - 2]);
		pklocs.push([rval + 1, cval + 2]);
		return pklocs;
	}
	static getAllPossibleKnightMoveToLocsMain(loc)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.getAllPossibleKnightMoveToLocs(loc[0], loc[1]);
	}
	
	
	//IF THE ALL PIECES LIST IS EMPTY RETURNS FALSE.
	static isPieceAtLocationOnAListOfTypes(rval, cval, mtypes, allpcs)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");

		//console.log("INSIDE OF IS PIECE AT LOCATION ON A LIST OF TYPES WITH LOCATION: " +
		//	ChessPiece.getLocString(rval, cval));
		//console.log("allpcs = ", allpcs);
		//System.out.print("mtypes = [");
		//for (let x = 0; x < mtypes.length; x++)
		//{
		//	System.out.print('"' + mtypes[x] + '"');
		//	if (x + 1 < mtypes.length) System.out.print(", ");
		//}
		//console.log("]");
		
		if (ChessPiece.getNumItemsInList(allpcs) < 1);//no items on the add pieces list
		else
		{
			//console.log("INSIDE ELSE STATEMENT!");
			for (let x = 0; x < allpcs.length; x++)
			{
				//console.log("x = " + x);
				//console.log("allpcs[" + x + "] = ", allpcs[x]);
				//console.log("row = " + allpcs[x].getRow());
				//console.log("col = " + allpcs[x].getCol());
				if (allpcs[x].getRow() === rval && allpcs[x].getCol() === cval)
				{
					if (ChessPiece.itemIsOnGivenList(allpcs[x].getType(), mtypes)) return true;
					else return false;
				}
				//else;//do nothing
			}
		}
		//console.log("DID NOT FIND IT!");
		return false;
	}
	//combines with the current board list prioritizes: boardlist < ignorelist < addpcs. 
	static isPieceAtLocationOnAListOfTypesGenPieceList(rval, cval, gid, mtypes,
		ignorelist=null, addpcs=null)
	{
		return ChessPiece.isPieceAtLocationOnAListOfTypes(rval, cval, mtypes,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	static isPieceAtLocationOnAListOfTypesGenPieceListMain(loc, gid, mtypes,
		ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.isPieceAtLocationOnAListOfTypes(loc[0], loc[1], mtypes,
				ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		}
	}
	
	
	//this checks the diagnals for a Bishop a Pawn or a Queen the first one it finds starting
	//at rval cval it will return true
	//that means if you call this on a Bishop, Pawn, or Queen it will return true immediately
	//it will not be conclusive as to if it is protected by one.
	static isSameDiagnalLocationGuarded(rval, cval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
			while (ChessPiece.isvalidrorc(r) && ChessPiece.isvalidrorc(c))
			{
				if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, c, gid, myvtps))
				{
					return true;
				}
				else
				{
					if (ChessPiece.isLocationEmptyVIAGID(r, c, gid));
					else
					{
						if (r === rval && c === cval);
						else break;
					}
				}
				
				//increment the variables
				if (x === 0)
				{
					//go towards bottom right
					r++;
					c++;
				}
				else if (x === 1)
				{
					//go towards top left
					r--;
					c--;
				}
				else if (x === 2)
				{
					//go towards top right
					r--;
					c++;
				}
				else if (x === 3)
				{
					//go towards bottom left
					r++;
					c--;
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED HERE " +
						"FOR INDEX X!");
				}
			}//end of while loop
		}//end of x for loop
		
		return false;
	}
	static isSameDiagnalLocationGuardedMain(loc, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isSameDiagnalLocationGuarded(loc[0], loc[1], gid);
	}
	
	//this checks the rows or columns for a CASTLE, ROOK, QUEEN, OR KING and returns true
	//on the first one found
	//this will return true immediately if called on one of the above.
	static isSameRowOrSameColLocationGuarded(rval, cval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		//row or col is the same
		//assume if we run into a piece other than a castle or a queen
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		//move along the row starting at cval
		//move along the col starting at row
		//go up
		//go down
		//go left to right
		let myvtps = ["CASTLE", "ROOK", "QUEEN", "KING"];
		for (let r = rval; r < 8; r++)
		{
			if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, cval, gid, myvtps))
			{
				return true;
			}
			else
			{
				if (ChessPiece.isLocationEmptyVIAGID(r, cval, gid));
				else
				{
					if (r === rval);
					else break;
				}
			}
		}
		for (let r = rval; ((r === 0 || 0 < r) && r < 8); r--)
		{
			if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, cval, gid, myvtps))
			{
				return true;
			}
			else
			{
				if (ChessPiece.isLocationEmptyVIAGID(r, cval, gid));
				else
				{
					if (r === rval);
					else break;
				}
			}
		}
		for (let c = cval; c < 8; c++)
		{
			if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(rval, c, gid, myvtps))
			{
				return true;
			}
			else
			{
				if (ChessPiece.isLocationEmptyVIAGID(rval, c, gid));
				else
				{
					if (c === cval);
					else break;
				}
			}
		}
		for (let c = cval; ((c === 0 || 0 < c) && c < 8); c--)
		{
			if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(rval, c, gid, myvtps))
			{
				return true;
			}
			else
			{
				if (ChessPiece.isLocationEmptyVIAGID(rval, c, gid));
				else
				{
					if (c === cval);
					else break;
				}
			}
		}
		return false;
	}
	static isSameRowOrSameColLocationGuardedMain(loc, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isSameRowOrSameColLocationGuarded(loc[0], loc[1], gid);
	}
	
	static isLocationGuardedByAKnight(rval, cval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let pklocs = ChessPiece.getAllPossibleKnightMoveToLocs(rval, cval);
		
		let mvtps = ["KNIGHT"];
		for (let x = 0; x < 8; x++)
		{
			if (ChessPiece.isvalidrorc(pklocs[x][0]) && ChessPiece.isvalidrorc(pklocs[x][1]))
			{
				if (ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(pklocs[x][0],
					pklocs[x][1], gid, mvtps))
				{
					return true;
				}
				//else;//do nothing
			}
			//else;//do nothing
		}
		return false;
	}
	static isLocationGuardedByAKnightMain(loc, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isLocationGuardedByAKnight(loc[0], loc[1], gid);
	}
	//this piece will not be a KNIGHT, but it checks for the others
	static isLocationGuardedByAnythingOtherThanAKnight(rval, cval, gid)
	{
		return (ChessPiece.isSameRowOrSameColLocationGuarded(rval, cval, gid) ||
			ChessPiece.isSameDiagnalLocationGuarded(rval, cval, gid));
	}
	static isLocationGuardedByAnythingOtherThanAKnightMain(loc, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isLocationGuardedByAnythingOtherThanAKnight(loc[0], loc[1], gid);
	}
	//this hints as to a possibility of the location being directly attacked by something
	//unless you call it on a piece
	static isLocationGuarded(rval, cval, gid)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		return (ChessPiece.isLocationGuardedByAnythingOtherThanAKnight(rval, cval, gid) ||
			ChessPiece.isLocationGuardedByAKnight(rval, cval, gid));
	}
	static isLocationGuardedMain(loc, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isLocationGuarded(loc[0], loc[1], gid);
	}
	
	
	
	//IS A LOC ON A LIST OF LOCS
	
	static isLocOnListOfLocs(rval, cval, loclist)
	{
		//console.log("rval = " + rval);
		//console.log("cval = " + cval);

		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loclist)) return false;
		else if (ChessPiece.cc.isStringEmptyNullOrUndefined(loclist[0]) || loclist[0].length != 2)
		{
			return false;
		}
		else
		{
			for (let x = 0; x < loclist.length; x++)
			{
				if (loclist[x][0] === rval && loclist[x][1] === cval) return true;
			}
			return false;
		}
	}
	static isLocOnListOfLocsMain(loc, loclist)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.isLocOnListOfLocs(loc[0], loc[1], loclist);
	}
	
	
	static getLocOnIgnoreListAndValidTypeData(rval, cval, gid, myvtps,
		ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		let loconiglist = false;
		let pcatloconiglist = false;
		let isvpctpeoniglist = false;
		if (ChessPiece.isLocOnListOfLocs(rval, cval, ignorelist))
		{
			//is there a piece on the add list that matches the loc?
			loconiglist = true;
			let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, ignorelist, addpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else
			{
				pcatloconiglist = true;
				isvpctpeoniglist = ChessPiece.itemIsOnGivenList(cp.getType(), myvtps);
			}
		}
		//else;//do nothing safe to proceed
		
		let rvals = [loconiglist, pcatloconiglist, isvpctpeoniglist];
		return rvals;
	}
	
	
	//DETECTS PIECES DIRECTLY ABLE TO ATTACK OR MOVE TO A LOCATION METHODS
	
	//LOCATIONS GUARDED BY KNIGHT METHODS
	
	static getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let pklocs = ChessPiece.getAllPossibleKnightMoveToLocs(rval, cval);
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		
		let mvtps = ["KNIGHT"];
		let gpcs = null;
		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval))
		{
			let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(
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
						ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(rval, cval, gid,
							mvtps, ignorelist, addpcs)))
				{
					if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
					//else;//do nothing
					
					gpcs.push(ChessPiece.getPieceAt(rval, cval, allpcs));
				}
				//else;//do nothing
			}
		}
		//else;//do nothing
		
		for (let x = 0; x < 8; x++)
		{
			if (ChessPiece.isvalidrorc(pklocs[x][0]) && ChessPiece.isvalidrorc(pklocs[x][1]))
			{
				let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(pklocs[x][0],
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
						ChessPiece.cc.logAndThrowNewError("WE ARE AT AN IGNORE LIST SPOT, " +
							"BUT THERE IS NO PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
					}
				}
				//else;//do nothing
				
				if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
					ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(pklocs[x][0],
						pklocs[x][1], gid, mvtps, ignorelist, addpcs)))
				{
					if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
					//else;//do nothing
					
					//console.log("ADD PIECE AT THIS LOCATION:");
					//console.log("pklocs[" + x + "][0] = " + pklocs[x][0]);
					//console.log("pklocs[" + x + "][1] = " + pklocs[x][1]);
					
					gpcs.push(ChessPiece.getPieceAt(pklocs[x][0], pklocs[x][1], allpcs));
				}
				//else;//do nothing
			}
			//else;//do nothing
		}
		return gpcs;
	}
	static getPiecesGuardingLocationByAKnightMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getPiecesGuardingLocationByAKnight(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	
	
	//if no piece -> not added; if there is a piece and it is not on our list of types -> add it;
	//if there is a piece and it is on our list of types and
	//if the diff is more than one -> not added;
	//if there is a piece and it is on our list of types and
	//its diff is less than or equal to 1 ->
	//-> if piece is not a pawn -> add it;
	//-> if piece is a pawn and it moved forward 1 -> add it; otherwise -> not added 
	static getCanAddPieceToGList(cp, myvtps, srval, scval, initaddit, usecdiff)
	{
		ChessPiece.cc.letMustBeAnInteger(srval, "srval");
		ChessPiece.cc.letMustBeAnInteger(scval, "scval");
		ChessPiece.cc.letMustBeBoolean(initaddit, "initaddit");
		ChessPiece.cc.letMustBeBoolean(usecdiff, "usecdiff");

		//console.log("cp = ", cp);
		//console.log("srval = " + srval);
		//console.log("scval = " + scval);
		//if (ChessPiece.cc.isStringEmptyNullOrUndefined(myvtps))
		//{
		//	console.log("myvtps is null or empty!");
		//}
		//else
		//{
		//	console.log("myvtps.length = " + myvtps.length);
		//	for (let x = 0; x < myvtps.length; x++) console.log(myvtps[x]);
		//}
		let addit = initaddit; 
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return false;
		else
		{
			//the piece is on our list of types, but it may not be able to attack the location
			//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
			if (ChessPiece.itemIsOnGivenList(cp.getType(), myvtps))
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
					if (cp.getType() === "PAWN")
					{
						//console.log("THIS IS A PAWN!");
						if (cp.getRow() === srval && cp.getCol() === scval);
						else
						{
							//we want to know if the pawn can actually move in that direction
							if ((cp.getColor() === "WHITE" && cp.getRow() - 1 === srval) ||
								(cp.getColor() === "BLACK" && cp.getRow() + 1 === srval))
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
	static getCanAddPieceToGListMain(cp, myvtps, sloc, initaddit, usecdiff)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(sloc) || sloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the current chess " +
				"piece location!");
		}
		else
		{
			return ChessPiece.getCanAddPieceToGList(cp, myvtps, sloc[0], sloc[1], initaddit,
				usecdiff);
		}
	}
	static getCanAddPieceToGListVIAGID(rval, cval, myvtps, srval, scval, initaddit, usecdiff, gid)
	{
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		else
		{
			return ChessPiece.getCanAddPieceToGList(ChessPiece.getPieceAtVIAGID(rval, cval, gid),
				myvtps, srval, scval, initaddit, usecdiff);
		}
	}
	static getCanAddPieceToGListVIALocsAndGID(nloc, myvtps, sloc, initaddit, usecdiff, gid)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(nloc) || nloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess piece " +
				"location!");
		}
		//else;//do nothing
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(sloc) || sloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the current chess piece " +
				"location!");
		}
		//else;//do nothing
		return ChessPiece.getCanAddPieceToGListVIAGID(nloc[0], nloc[1], myvtps, sloc[0], sloc[1],
			initaddit, usecdiff, gid);
	}
	
	
	//LOCATIONS GUARDED BY BISHOP (OR QUEEN) METHODS
	
	static getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = rval;
			let c = cval;
			while (ChessPiece.isvalidrorc(r) && ChessPiece.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(r, c, gid,
					myvtps, ignorelist, addpcs);
				let loconiglist = logonigvtpdtalist[0];
				let pcatloconiglist = logonigvtpdtalist[1];
				let isvpctpeoniglist = logonigvtpdtalist[2];
				//console.log("loconiglist = " + loconiglist);
				//console.log("pcatloconiglist = " + pcatloconiglist);
				//console.log("isvpctpeoniglist = " + isvpctpeoniglist);
				let inconly = (loconiglist && !pcatloconiglist);
				//console.log("inconly = " + inconly);
				
				//GIVEN: NO MATTER WHAT THERE WILL BE AT LEAST 2 CHESS PIECES ON THE BOARD
				//GIVEN: NORMAL BEHAVIOR IS TO FIND PIECES ON THE BOARD, THAT ARE OF A
				//CERTAIN TYPE, AND
				//SEE IF IT CAN MOVE TO SAID LOC
				//GIVEN: SEARCH PATTERN IS SEARCH PATTERN IS BISHOP/CASTLE/KNIGHT...
				//AND HAS NO EFFECT OTHER THAN IT DETERMINES THE TYPES OF PIECES WE ARE
				//GENERALLY LOOKING FOR
				//GIVEN: A LOCATION, A LIST OF LOCATIONS TO IGNORE, A LIST OF NEW PIECES AT
				//LOCATIONS
				//
				//RULE: PRIORITIZE ADD LIST OVER BOARD (USE PIECES ON ADD LIST INSTEAD
				//OF ON BOARD).
				//RULE: PRIORITIZE ADD LIST OVER IGNORE LIST
				//(USE PIECES ON ADD LIST INSTEAD OF SKIPPING LOCATION IF THE SAME).
				//
				//IDEA: IS IF WE WANT TO SIMULATE MOVING, ADD A PIECE TO THE IGNORE LIST
				//THEN PUT IT ON THE ADD LIST
				//ULTIMATE GOAL: SEE HOW MOVING TO A CERTAIN LOCATION EFFECTS ATTACKING LOCATIONS
				//
				//If there are pieces on BOTH THE BOARD (ALL_CHESSPIECES LIST, THE NEW
				//PIECES WILL NOT BE ON THIS LIST)
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
				//CANNNOT OUTRIGHT SKIP THAT LOCATION, BUT MUST PRIORITIZE ADD LIST OVER
				//BOARD IN THAT CASE
				
				//IF NOT AT A SPOT ON THE IGNORE LIST AND THE ADD LIST DOES NOT HAVE A
				//PIECE THERE,
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
						ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, c, gid, myvtps,
							ignorelist, addpcs)))
					{
						let addit = true;
						if (c === cval && r === rval)
						{
							if (x === 0) addit = true;
							else addit = false;
						}
						else addit = true;
						
						//the piece is on our list of types, but it may not be able to attack
						//the location
						//if it is a king or pawn and distance in magnitude is more than 1,
						//not a threat.
						let rstps = ["PAWN", "KING"];
						let cp = ChessPiece.getPieceAt(r, c, allpcs);
						//console.log("FINAL cp = ", cp);
						addit = ChessPiece.getCanAddPieceToGList(cp, rstps, rval, cval, addit,
							true);
						//console.log("addit = " + addit);
						
						if (addit)
						{
							if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
							//else;//do nothing
							
							gpcs.push(cp);
							//proceed below to handle exiting the loop
						}
						else
						{
							if (ChessPiece.cc.isItemNullOrUndefined(cp)) locntempty = false;
							//else;//do nothing proceed below to handle exiting the loop
						}
					}
					else
					{
						if (loconiglist);//the location is not empty
						else
						{
							if (ChessPiece.isLocationEmptyVIAGID(r, c, gid, ignorelist, addpcs))
							{
								locntempty = false;
							}
							//else;//do nothing proceed below to handle exiting the loop
						}
					}
					//console.log("locntempty = " + locntempty);
					if (locntempty)
					{
						if (r === rval && c === cval);
						else break;
					}
					//else;//do nothing
				}
				
				
				//increment the variables
				//console.log("x = " + x);
				if (x === 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x === 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x === 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x === 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED " +
						"HERE FOR INDEX X!");
				}
			}//end of while loop
		}//end of x for loop
		
		return gpcs;
	}
	static getPiecesGuardingLocationOnSameDiagnalMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getPiecesGuardingLocationOnSameDiagnal(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	
	//LOCATIONS GUARDED BY CASTLE (OR QUEEN) METHODS
	
	static getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else ChessPiece.cc.logAndThrowNewError("rval and cval must be valid!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		//console.log("INSIDE GET PIECES GUARDING LOCATION ON SAME ROW OR COL() WITH LOCATION: " +
		//	ChessPiece.getLocString(rval, cval));
		//console.log("gid = " + gid);
		//console.log("addpcs = ", addpcs);
		//if (ChessPiece.cc.isItemNullOrUndefined(ignorelist)) console.log("ignorelist = null!");
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
		let myvtps = ["CASTLE", "ROOK", "QUEEN", "KING"];
		let gpcs = null;
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		for (let r = rval; r < 8; r++)
		{
			//console.log("INC r = " + r);
			let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(r, cval, gid,
				myvtps, ignorelist, addpcs);
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
					ChessPiece.cc.logAndThrowNewError("WE ARE AT AN IGNORE LIST SPOT, BUT " +
						"THERE IS NO PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, cval,
					gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				
				//the piece is on our list of types, but it may not be able to attack the location
				//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
				let cp = ChessPiece.getPieceAt(r, cval, allpcs);
				//console.log("FINAL cp = ", cp);
				let addit = true;
				let rstps = ["KING"];
				addit = ChessPiece.getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
				
				if (addit)
				{
					if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
					//else;//do nothing
					
					gpcs.push(cp);
					//proceed below to handle exiting the loop
				}
				else
				{
					if (ChessPiece.cc.isItemNullOrUndefined(cp)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			else
			{
				//console.log("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (ChessPiece.isLocationEmptyVIAGID(r, cval, gid, ignorelist, addpcs))
					{
						locntempty = false;
					}
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r === rval);
				else break;
			}
			//else;//do nothing
		}
		for (let r = rval; ((r === 0 || 0 < r) && r < 8); r--)
		{
			//console.log("DEC r = " + r);
			let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(r, cval, gid,
				myvtps, ignorelist, addpcs);
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
					ChessPiece.cc.logAndThrowNewError("WE ARE AT AN IGNORE LIST SPOT, BUT " +
						"THERE IS NO PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(r, cval,
					gid, myvtps, ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (r === rval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack
					//the location
					//if it is a king or pawn and distance in magnitude is more than 1,
					//not a threat.
					let cp = ChessPiece.getPieceAt(r, cval, allpcs);
					//console.log("FINAL cp = ", cp);
					let addit = true;
					let rstps = ["KING"];
					addit = ChessPiece.getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
					
					if (addit)
					{
						if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (ChessPiece.cc.isItemNullOrUndefined(cp)) locntempty = false;
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
					if (ChessPiece.isLocationEmptyVIAGID(r, cval, gid, ignorelist, addpcs))
					{
						locntempty = false;
					}
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r === rval);
				else break;
			}
			//else;//do nothing
		}
		for (let c = cval; c < 8; c++)
		{
			//console.log("INC c = " + c);
			let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(rval, c, gid,
				myvtps, ignorelist, addpcs);
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
					ChessPiece.cc.logAndThrowNewError("WE ARE AT AN IGNORE LIST SPOT, BUT " +
						"THERE IS NO PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
				ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(rval, c, gid, myvtps,
					ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (c === cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack
					//the location
					//if it is a king or pawn and distance in magnitude is more than 1,
					//not a threat.
					let cp = ChessPiece.getPieceAt(rval, c, allpcs);
					//console.log("FINAL cp = ", cp);
					let addit = true;
					let rstps = ["KING"];
					addit = ChessPiece.getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (ChessPiece.cc.isItemNullOrUndefined(cp)) locntempty = false;
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
					if (ChessPiece.isLocationEmptyVIAGID(rval, c, gid, ignorelist, addpcs))
					{
						locntempty = false;
					}
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c === cval);
				else break;
			}
			//else;//do nothing
		}
		for (let c = cval; ((c === 0 || 0 < c) && c < 8); c--)
		{
			//console.log("DEC c = " + c);
			let logonigvtpdtalist = ChessPiece.getLocOnIgnoreListAndValidTypeData(rval, c, gid,
				myvtps, ignorelist, addpcs);
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
					ChessPiece.cc.logAndThrowNewError("WE ARE AT AN IGNORE LIST SPOT, BUT " +
						"THERE IS NO PIECE THERE, SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			let locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
				ChessPiece.isPieceAtLocationOnAListOfTypesGenPieceList(rval, c, gid, myvtps,
					ignorelist, addpcs)))
			{
				//console.log("INSIDE IF STATEMENT!");
				if (c === cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack
					//the location
					//if it is a king or pawn and distance in magnitude is more than 1,
					//not a threat.
					let cp = ChessPiece.getPieceAt(rval, c, allpcs);
					//console.log("FINAL cp = ", cp);
					let addit = true;
					let rstps = ["KING"];
					addit = ChessPiece.getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (ChessPiece.cc.isItemNullOrUndefined(gpcs)) gpcs = [];
						//else;//do nothing
						
						gpcs.push(cp);
						//proceed below to handle exiting the loop
					}
					else
					{
						if (ChessPiece.cc.isItemNullOrUndefined(cp)) locntempty = false;
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
					if (ChessPiece.isLocationEmptyVIAGID(rval, c, gid, ignorelist, addpcs))
					{
						locntempty = false;
					}
					//else;//do nothing
				}
			}
			//console.log("OUTSIDE OF IF-ELSE STATEMENT");
			//console.log("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c === cval);
				else break;
			}
			//else;//do nothing
		}
		//console.log("OUTSIDE OF FINAL FOR LOOP STATEMENT");
		return gpcs;
	}
	static getPiecesGuardingLocationOnSameRowOrColMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getPiecesGuardingLocationOnSameRowOrCol(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	
	
	//MAIN GET PIECES GUARDING LOCATION METHODS
	
	static getPiecesGuardingLocation(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		//console.log("INSIDE GET PIECES GUARDING LOCATION: " +
		//	ChessPiece.getLocString(rval, cval));
		//console.log("gid = " + gid);
		//console.log("addpcs = ", addpcs);
		//printLocsArray(ignorelist, "ignorelist");
		let rclocs = ChessPiece.getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid,
			ignorelist, addpcs);
		//console.log("rclocs = ", rclocs);
		let dlocs = ChessPiece.getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist,
			addpcs);
		//console.log("dlocs = ", dlocs);
		let klocs = ChessPiece.getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist,
			addpcs);
		//console.log("THE LOC: " + ChessPiece.getLocString(rval, cval));
		//console.log("rclocs = ", rclocs);
		//console.log("dlocs = ", dlocs);
		//console.log("klocs = ", klocs);
		
		let alocs = null;
		if (0 < ChessPiece.getNumItemsInList(rclocs)) alocs = rclocs.map((mitem) => mitem);
		//else;//do nothing
		if (0 < ChessPiece.getNumItemsInList(dlocs))
		{
			if (ChessPiece.cc.isItemNullOrUndefined(alocs)) alocs = [];
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
		if (0 < ChessPiece.getNumItemsInList(klocs))
		{
			if (ChessPiece.cc.isItemNullOrUndefined(alocs)) alocs = [];
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
				if (addit) alocs.push(klocs[x]);
			}
		}
		//else;//do nothing
		return alocs;
	}
	static getPiecesGuardingLocationMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else return ChessPiece.getPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	
	
	//THE CURRENT SIDE PIECES GUARDING THE LOCATION METHODS
	
	static getSidePiecesGuardingLocation(rval, cval, gid, clrval, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval)) return null;
		else
		{
			return ChessPiece.filterListByColor(ChessPiece.getPiecesGuardingLocation(rval, cval,
				gid, ignorelist, addpcs), clrval);
		}
	}
	static getSidePiecesGuardingLocationMain(loc, gid, clrval, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getSidePiecesGuardingLocation(loc[0], loc[1], gid, clrval,
				ignorelist, addpcs);
		}
	}
	static getSidePiecesGuardingLocationUseCPColor(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, ignorelist, addpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return null;
		else
		{
			return ChessPiece.getSidePiecesGuardingLocation(rval, cval, gid, cp.getColor(),
				ignorelist, addpcs);
		}
	}
	static getSidePiecesGuardingLocationUseCPColorMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getSidePiecesGuardingLocationUseCPColor(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	
	
	//THE ENEMY PIECES GUARDING THE LOCATION METHODS
	
	static getEnemyPiecesGuardingLocation(rval, cval, gid, clrval, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		return ChessPiece.getSidePiecesGuardingLocation(rval, cval, gid,
			ChessPiece.getOppositeColor(clrval), ignorelist, addpcs);
	}
	static getEnemyPiecesGuardingLocationMain(loc, gid, clrval, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getEnemyPiecesGuardingLocation(loc[0], loc[1], gid, clrval,
				ignorelist, addpcs);
		}
	}
	static getEnemyPiecesGuardingLocationUseCPColor(rval, cval, gid, ignorelist=null, addpcs=null)
	{
		let cp = ChessPiece.getPieceAtVIAGID(rval, cval, gid, ignorelist, addpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return null;
		else
		{
			return ChessPiece.getSidePiecesGuardingLocation(rval, cval, gid,
				ChessPiece.getOppositeColor(cp.getColor()), ignorelist, addpcs);
		}
	}
	static getEnemyPiecesGuardingLocationUseCPColorMain(loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the chess piece location!");
		}
		else
		{
			return ChessPiece.getEnemyPiecesGuardingLocationUseCPColor(loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	
	
	
	//CHECK METHODS
	
	//can I be directly attacked by the opposing side?
	inCheck(ignorelist=null, addpcs=null)
	{
		//can I be directly attacked by the opposing side?
		let epcs = ChessPiece.getEnemyPiecesGuardingLocation(this.getRow(), this.getCol(),
			this.getGameID(), this.getColor(), ignorelist, addpcs);
		//console.log("epcs = ", epcs);
		if (ChessPiece.getNumItemsInList(epcs) < 1) return false;
		else return true;
	}
	
	isMySideInCheck(ignorelist=null, addpcs=null)
	{
		//get my king
		//then ask can I be directly attacked by the opposing side?
		//if yes you are in check
		return this.getMySideKing().inCheck(ignorelist, addpcs);
	}
	
	//this gets the king with the specified color and then calls inCheck on it
	static isSideInCheck(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		let mkg = ChessPiece.getCurrentSideKing(clrval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		if (ChessPiece.cc.isItemNullOrUndefined(mkg))
		{
			ChessPiece.cc.logAndThrowNewError("the king must be found!");
		}
		else return mkg.inCheck(ignorelist, addpcs);
	}
	
	//checks to see if a side is in check and checks the given color first,
	//if no color provided it starts with white
	//it will also check black; white then black or black then white
	static isASideInCheck(clrval="WHITE", gid, ignorelist=null, addpcs=null)
	{
		return (ChessPiece.isSideInCheck(clrval, gid, ignorelist, addpcs) ||
			ChessPiece.isSideInCheck(ChessPiece.getOppositeColor(clrval), gid, ignorelist, addpcs));
	}
	
	
	//CAN A GIVEN TYPE OF PIECE FOR A SIDE BE DIRECTLY ATTACKED
	
	//asks if a certain color and kind of piece can be directly attacked
	static isAtLeastOnePieceOfTypeForSideInCheck(typeval, clrval, gid,
		ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeDefinedAndNotNull(typeval, "typeval");

		let myclrpcs = ChessPiece.filterListByColorAndType(typeval, clrval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		let nummypcs = ChessPiece.getNumItemsInList(myclrpcs);
		if (nummypcs < 1);
		else
		{
			for (let x = 0; x < nummypcs; x++)
			{
				if (myclrpcs[x].inCheck(ignorelist, addpcs)) return true;
				//else;//do nothing
			}
		}
		return false;
	}
	static isAtLeastOneQueenForSideInCheck(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOnePieceOfTypeForSideInCheck("QUEEN", clrval, gid, ignorelist,
			addpcs);
	}
	static isAtLeastOneWhitePieceOfTypeInCheck(typeval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOnePieceOfTypeForSideInCheck(typeval, "WHITE", gid, ignorelist,
			addpcs);
	}
	static isAtLeastOneWhiteQueenInCheck(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOneWhitePieceOfTypeInCheck("QUEEN", gid, ignorelist, addpcs);
	}
	static isAtLeastOneBlackPieceOfTypeInCheck(typeval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOnePieceOfTypeForSideInCheck(typeval, "BLACK", gid, ignorelist,
			addpcs);
	}
	static isAtLeastOneBlackQueenInCheck(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOneBlackPieceOfTypeInCheck("QUEEN", gid, ignorelist, addpcs);
	}
	isAQueenForMySideInCheck(ignorelist=null, addpcs=null)
	{
		return ChessPiece.isAtLeastOneQueenForSideInCheck(this.getColor(), this.getGameID(),
			ignorelist, addpcs);
	}
	
	
	//GET CAN MOVE TO LOCATIONS METHODS
	
	static canAddThisMoveToLoc(sr, sc, nr, nc, myclr, mytpval, gid,
		oignorelist=null, oaddpcs=null)
	{
		//console.log("INSIDE CAN-ADD-THIS-MOVE-TO-LOC()");

		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeAnInteger(nr, "nr");
		ChessPiece.cc.letMustBeAnInteger(nc, "nc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(mytpval, "mytpval");

		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		let initbdpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(oignorelist, oaddpcs, gid);
		let cp = ChessPiece.getPieceAt(nr, nc, initbdpcs);
		//console.log("cp = ", cp);
		
		let addit = true;
		if (ChessPiece.cc.isItemNullOrUndefined(cp));
		else
		{
			if (cp.getColor() === myclr)
			{
				if (sr === cp.getRow() && sc === cp.getCol());
				else addit = false;
			}
			//else;//do nothing
		}
		//console.log("OLD addit = " + addit);
		//console.log("mytpval = " + mytpval);
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mytpval))
		{
			ChessPiece.cc.logAndThrowNewError("mytpval must not be null!");
		}
		else if (mytpval === "PAWN")
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
					if (ChessPiece.cc.isItemNullOrUndefined(cp)) addit = false;
					else
					{
						if (cp.getColor() === myclr) addit = false;
						//else;//do nothing
					}
				}
				//else;//do nothing
			}
			else if (nr != sr && nc === sc)
			{
				//console.log("PAWN IS MOVING FORWARD!");
				
				let rdiff = sr - nr;
				if (rdiff < 1) rdiff *= -1;
				//console.log("rdiff = " + rdiff);
				
				if (rdiff === 2)
				{
					let dirfact = 0;
					if (ChessPiece.cc.isStringEmptyNullOrUndefined(myclr))
					{
						ChessPiece.cc.logAndThrowNewError("color must not be null!");
					}
					else if (myclr === "WHITE") dirfact = -1;
					else if (myclr === "BLACK") dirfact = 1;
					else
					{
						ChessPiece.cc.logAndThrowNewError("illegal color (" + myclr +
							") found and used here");
					}
					//console.log("PAWN dirfact = " + dirfact);
					//console.log("initbdpcs = ", initbdpcs);
						
					let ocp = ChessPiece.getPieceAt(sr + dirfact, nc, initbdpcs);
					//console.log("ocp = ", ocp);
					
					if (ChessPiece.cc.isItemNullOrUndefined(ocp));//do nothing add it
					else addit = false;
				}
				//else;//do nothing add it
				
				if (ChessPiece.cc.isItemNullOrUndefined(cp));//do nothing
				else addit = false;
			}
			//else;//do nothing
		}
		//else;//do nothing valid
		//console.log("NEW addit = " + addit);
		
		if (addit)
		{
			//need to know if ignoring piece at sr and sc and putting a castle/queen piece
			//at this location puts my king in check
			//if it puts my king in check -> do not add it
			//else add it
			let ilista = [[sr, sc]];//new int[1][2];
			let ignorelist = ChessPiece.combineIgnoreLists(ilista, oignorelist);
			
			let addpcs = [];
			addpcs.push(ChessPiece.makeNewChessPieceRCLocMain(mytpval, myclr, nr, nc, gid, false));
			if (ChessPiece.getNumItemsInList(oaddpcs) < 1);
			else
			{
				for (let x = 0; x < oaddpcs.length; x++)
				{
					let addpctoit = true;
					for (let c = 0; c < addpcs.length; c++)
					{
						if (oaddpcs[x].getRow() === addpcs[c].getRow() &&
							oaddpcs[x].getCol() === addpcs[c].getCol())
						{
							addpctoit = false;
							break;
						}
						//else;//do nothing
					}
					if (addpctoit) addpcs.push(oaddpcs[x]);
					//else;//do nothing
				}
			}
			let mkg = ChessPiece.getCurrentSideKing(myclr,
				ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
			//console.log("mkg = ", mkg);
			//console.log("addpcs = ", addpcs);
			//ChessPiece.printLocsArray(ignorelist, "ignorelist");
			if (ChessPiece.cc.isItemNullOrUndefined(mkg))
			{
				ChessPiece.cc.logAndThrowNewError("our king must be on the board, but it " +
					"was not found!");
			}
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
	
	static getBishopCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let keeplist = [];//new int[16][2];
		for (let x = 0; x < 16; x++)
		{
			if (x === 0) keeplist.push([sr, sc]);
			else keeplist.push([-1, -1]);
		}
		let kli = 1;
		
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = sr;
			let c = sc;
			while (ChessPiece.isvalidrorc(r) && ChessPiece.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				if (ChessPiece.canAddThisMoveToLoc(sr, sc, r, c, myclr, "BISHOP", gid,
					ignorelist, addpcs))
				{
					//console.log("KEEP THIS LOCATION!");
					//need to make sure we are not adding a duplicate loc to the list...
					if (ChessPiece.isLocOnListOfLocs(r, c, keeplist));
					else
					{
						keeplist[kli][0] = r;
						keeplist[kli][1] = c;
						kli++;
					}
				}
				//else;//do nothing
				let cp = ChessPiece.getPieceAtVIAGID(r, c, gid, ignorelist, addpcs);
				//console.log("cp = ", cp);
				if (ChessPiece.cc.isItemNullOrUndefined(cp));
				else
				{
					if (r === sr && c === sc);
					else break;
				}
				
				//increment the variables
				//console.log("x = " + x);
				if (x === 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x === 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x === 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x === 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED HERE " +
						"FOR INDEX X!");
				}
			}//end of while loop
		}//end of x for loop

		//copy keeplist to rlist
		return ChessPiece.copyPartOfListAndReturn(kli, keeplist);
	}
	//NOTE: this does not take into account castling
	static getCastleCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		//we do not include sr and sc only (WE ASSUME THERE IS A PIECE THERE THAT IS A CASTLE
		//OR A QUEEN)
		//moving on rows or columns checking to see if the location is empty according to
		//all pieces list
		//if the location is empty, add it to keep list
		//if the location is not empty:
		//-check to see if we can kill it:
		//--if we can kill it, add it;
		//--if not, do not add it;
		//-but done
		//we must make sure that the location lets us not be in check or results in our
		//side not in check
		//
		//column stays the same
		//at most there will be 8 locations in any row or column so 8 different positions
		//the castle therefore will have at most 16 possible moves (if allowed to stay
		//at its current position)
		let keeplist = [];//new int[16][2];
		for (let x = 0; x < 16; x++)
		{
			if (x === 0) keeplist.push([sr, sc]);
			else keeplist.push([-1, -1]);
		}
		let kli = 1;
		for (let r = sr; r < 8; r++)
		{
			//console.log("r = " + r);
			//console.log("c = " + sc);
			if (r === sr) continue;
			//else;//do nothing
			
			if (ChessPiece.canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", gid,
				ignorelist, addpcs))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			let cp = ChessPiece.getPieceAtVIAGID(r, sc, gid, ignorelist, addpcs);
			//console.log("cp = ", cp);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else break;
		}
		for (let r = sr; ((0 < r || r === 0) && r < 8); r--)
		{
			//console.log("r = " + r);
			//console.log("c = " + sc);
			if (r === sr) continue;
			//else;//do nothing
			
			if (ChessPiece.canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", gid,
				ignorelist, addpcs))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			let cp = ChessPiece.getPieceAtVIAGID(r, sc, gid, ignorelist, addpcs);
			//console.log("cp = ", cp);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else break;
		}
		//row stays the same
		for (let c = sc; c < 8; c++)
		{
			//console.log("r = " + sr);
			//console.log("c = " + c);
			if (c === sc) continue;
			//else;//do nothing
			
			if (ChessPiece.canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", gid,
				ignorelist, addpcs))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			let cp = ChessPiece.getPieceAtVIAGID(sr, c, gid, ignorelist, addpcs);
			//console.log("cp = ", cp);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else break;
		}
		for (let c = sc; ((0 < c || c === 0) && c < 8); c--)
		{
			//console.log("r = " + sr);
			//console.log("c = " + c);
			if (c === sc) continue;
			//else;//do nothing
			
			if (ChessPiece.canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", gid,
				ignorelist, addpcs))
			{
				//console.log("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			let cp = ChessPiece.getPieceAtVIAGID(sr, c, gid, ignorelist, addpcs);
			//console.log("cp = ", cp);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else break;
		}

		//copy keeplist to rlist
		return ChessPiece.copyPartOfListAndReturn(kli, keeplist);
	}
	static getQueenCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		//combines the two above
		let bmlocs = ChessPiece.getBishopCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
		let cmlocs = ChessPiece.getCastleCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(bmlocs)) return cmlocs;
		else if (ChessPiece.cc.isStringEmptyNullOrUndefined(cmlocs)) return bmlocs;
		else
		{
			//both are non null;
			//int[][] reslocs = new int[bmlocs.length + cmlocs.length][2];
			let reslocs = bmlocs.map((mloc) => [mloc[0], mloc[1]]);
			let resi = bmlocs.length;
			for (let r = 0; r < cmlocs.length; r++)
			{
				if (ChessPiece.isLocOnListOfLocsMain(cmlocs[r], reslocs));
				else
				{
					reslocs.push([cmlocs[r][0], cmlocs[r][1]]);
					resi++;
				}
			}

			//copy reslocslist to myretlist
			return ChessPiece.copyPartOfListAndReturn(resi, reslocs);
		}
	}
	//NOTE: this does not take into account pawning
	static getPawnCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let dirfact = 0;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(myclr))
		{
			ChessPiece.cc.logAndThrowNewError("color must not be null!");
		}
		else if (myclr === "WHITE") dirfact = -1;
		else if (myclr === "BLACK") dirfact = 1;
		else
		{
			ChessPiece.cc.logAndThrowNewError("illegal color (" + myclr +
				") found and used here");
		}
		//console.log("PAWN dirfact = " + dirfact);
		
		//can only move forward one or two spaces on the first turn otherwise forward one only
		//exception is attacking or pawning
		
		//if has not moved can move forward 2 spots or 1 spot
		//otherwise can only move forward 1 spot unless can kill a piece only attacks diagnal
		let canmvfwdtwo = ((sr === 6 && myclr === "WHITE") || (sr === 1 && myclr === "BLACK"));
		//console.log("PAWN canmvfwdtwo = " + canmvfwdtwo);
		
		let tplocs = [];//new int[5][2];
		tplocs.push([sr, sc]);
		if (canmvfwdtwo) tplocs.push([sr + (2*dirfact), sc]);
		else tplocs.push([-1, -1]);
		//move forward or backwards one spot
		tplocs.push([sr + dirfact, sc]);
		//now attack locations...
		tplocs.push([sr + dirfact, sc - 1]);
		tplocs.push([sr + dirfact, sc + 1]);
		
		//now we need to go through all of these locations and see how they effect the
		//king exclude the first one
		//exclude all invalid locations
		let isvloc = [true, false, false, false, false];//new boolean[tplocs.length];
		let numv = 1;
		//console.log("STARTING LOCATION: " + ChessPiece.getLocString(sr, sc) + ": " +
		//	ChessPiece.convertRowColToStringLoc(sr, sc, ChessPiece.WHITE_MOVES_DOWN_RANKS));
		
		for (let x = 1; x < tplocs.length; x++)
    	{
    		isvloc[x] = (ChessPiece.isvalidrorc(tplocs[x][0]) &&
				ChessPiece.isvalidrorc(tplocs[x][1]));
    		//console.log("CURRENT LOC " + ChessPiece.getLocString(tplocs[x][0], tplocs[x][1]));
    		//console.log("OLD isvloc[" + x + "] = " + isvloc[x]);
    		
    		if (isvloc[x])
    		{
    			//the loc is valid, but now see if moving there moves our king to check or
    			//see if we can even move there in the first place
    			if (ChessPiece.canAddThisMoveToLoc(sr, sc, tplocs[x][0], tplocs[x][1], myclr,
					"PAWN", gid, ignorelist, addpcs))
				{
					//console.log("VALID LOC " + ChessPiece.getLocString(tplocs[x][0],
					//	tplocs[x][1]) + ": " +
					//	ChessPiece.convertRowColToStringLocMain(tplocs[x],
					//		ChessPiece.WHITE_MOVES_DOWN_RANKS));
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
    	let rlist = [];//new int[numv][2];
    	let vki = 0;
    	for (let x = 0; x < tplocs.length; x++)
    	{
    		if (isvloc[x])
    		{
    			rlist.push([tplocs[x][0], tplocs[x][1]]);
    			vki++;
    		}
    		//else;//do nothing
    	}
		if (rlist.length === numv) return rlist;
		else
		{
			ChessPiece.cc.logAndThrowNewError("illegal resultant array size for the list " +
				"of locs!");
		}
	}
	static getKnightCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let pktlocs = ChessPiece.getAllPossibleKnightMoveToLocs(sr, sc);
		//if (ChessPiece.cc.isItemNullOrUndefined(pktlocs)) console.log("pktlocs = null");
    	//else if (pktlocs.length < 1) console.log("pktlocs is empty!");
    	//else
    	//{
    	//	console.log("pktlocs.length = " + pktlocs.length);
	    //	for (let x = 0; x < pktlocs.length; x++)
	    //	{
	    //		console.log(ChessPiece.getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//console.log(ChessPiece.getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	ChessPiece.convertRowColToStringLocMain(pktlocs[x],
		//		//		ChessPiece.WHITE_MOVES_DOWN_RANKS));
	    //	}
    	//}
    	//console.log("STARTING LOCATION: " + ChessPiece.getLocString(sr, sc) + ": " +
		//	ChessPiece.convertRowColToStringLoc(sr, sc, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	
    	if (ChessPiece.cc.isStringEmptyNullOrUndefined(pktlocs)) return [[sr, sc]];
		else
		{
			let isvloc = [];//new boolean[pktlocs.length];
			for (let x = 0; x < pktlocs.length; x++) isvloc.push(false);
			let numv = 0;
			for (let x = 0; x < pktlocs.length; x++)
	    	{
	    		isvloc[x] = (ChessPiece.isvalidrorc(pktlocs[x][0]) &&
					ChessPiece.isvalidrorc(pktlocs[x][1]));
	    		if (isvloc[x])
	    		{
	    			//the loc is valid, but now see if moving there moves our king to check or
	    			//see if we can even move there in the first place
	    			if (ChessPiece.canAddThisMoveToLoc(sr, sc, pktlocs[x][0], pktlocs[x][1],
						myclr, "KNIGHT", gid, ignorelist, addpcs))
					{
						isvloc[x] = true;
					}
					else isvloc[x] = false;
		    	}
		    	//else;//do nothing
	    		if (isvloc[x]) numv++;
	    	}
	    	let vpktlocs = [];//new int[numv + 1][2];
	    	vpktlocs.push([sr, sc]);
	    	let vpki = 1;
	    	for (let x = 0; x < pktlocs.length; x++)
	    	{
	    		if (isvloc[x])
	    		{
	    			vpktlocs.push([pktlocs[x][0], pktlocs[x][1]]);
	    			//console.log("VALID LOC " + ChessPiece.getLocString(vpktlocs[vpki][0],
					//	vpktlocs[vpki][1]) + ": " +
					//	ChessPiece.convertRowColToStringLocMain(vpktlocs[vpki],
					//		ChessPiece.WHITE_MOVES_DOWN_RANKS));
	    			vpki++;
	    		}
	    		//else;//do nothing
	    	}
	    	if (vpktlocs.length === numv + 1 && vpktlocs[0].length === 2) return vpktlocs;
			else
			{
				ChessPiece.cc.logAndThrowNewError("illegal resultant array size for the " +
					"list of locs!");
			}
		}
	}
	//NOTE: this does not take into account castling
	static getKingCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		if (ChessPiece.isvalidrorc(sr) && ChessPiece.isvalidrorc(sc));
		else ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID!");
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		//can move one square in any direction
		//exception is castling
		
		//rdiff and cdiff must be at most 1 at minimum 0 zero
		let keeplist = [];//new int[9][2];
		let kli = 0;
		for (let x = 0; x < 9; x++) keeplist.push([-1, -1]);
		//console.log("sr = " + sr);
		//console.log("sc = " + sc);
		let sri = -1;
		if (0 < sr) sri = sr - 1;
		else if (0 === sr) sri = 0;
		else ChessPiece.cc.logAndThrowNewError("negative values not allowed for sr!");
		let sci = -1;
		if (0 < sc) sci = sc - 1;
		else if (0 === sc) sci = 0;
		else ChessPiece.cc.logAndThrowNewError("negative values not allowed for sc!");
		//console.log("sri = " + sri);
		//console.log("sci = " + sci);
		for (let r = sri; ((0 < r || r === 0) && r < 8) && r < sr + 2; r++)
		{
			for (let c = sci; ((0 < c || c === 0) && c < 8) && c < sc + 2; c++)
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				if (ChessPiece.canAddThisMoveToLoc(sr, sc, r, c, myclr, "KING",
					gid, ignorelist, addpcs))//(r === sr && c === sc) || 
				{
					//console.log("ADD LOCATION!");
					//if (ChessPiece.isLocOnListOfLocs(r, c, keeplist));
					//else
					//{
						keeplist[kli][0] = r;
						keeplist[kli][1] = c;
						kli++;
					//}
				}
				//else;//do nothing
				//different than the others because all locations are one away from the spot
				//so just loop through them
			}
		}
		
		//copy keeplist to rlist
		return ChessPiece.copyPartOfListAndReturn(kli, keeplist);
	}
	
	//THIS TAKES INTO ACCOUNT PAWNING TOO; IF NOT CALLED ON A PAWN WITH THE SAME COLOR
	//JUST RETURNS ABOVE
	static getAllPawnCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null,
		bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		//console.log("allpcs = ", allpcs);

		let cp = ChessPiece.getPieceAt(sr, sc, allpcs);
		let pcmlocs = ChessPiece.getPawnCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return pcmlocs;
		else
		{
			if (cp.getColor() === myclr);
			else return pcmlocs;
			
			if (cp.getType() === "PAWN")
			{
				//now can handle the pawning stuff
				let pleftloc = null;
				let prightloc = null;
				if (cp.canPawnLeftMain(allpcs, bpassimnxtmv))
				{
					pleftloc = cp.getPawnLeftLocationMain(allpcs, bpassimnxtmv);
				}
				if (cp.canPawnRightMain(allpcs, bpassimnxtmv))
				{
					prightloc = cp.getPawnRightLocationMain(allpcs, bpassimnxtmv);
				}
				let numaddlocs = 0;
				let addpleft = false;
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(pleftloc));
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				let addpright = false;
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(prightloc));
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				//console.log("addpleft = " + addpleft);
				//console.log("addpright = " + addpright);

				let locs = null;
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(pcmlocs)) locs = null;
				else
				{
					//locs = new int[numaddlocs + pcmlocs.length][2];
					locs = pcmlocs.map((mitem) => [mitem[0], mitem[1]]);
					let lci = pcmlocs.length;
					if (addpleft)
					{
						locs.push([pleftloc[0], pleftloc[1]]);
						lci++;
					}
					//else;//do nothing
					if (addpright)
					{
						locs.push([prightloc[0], prightloc[1]]);
						lci++;
					}
					//else;//do nothing
					if (lci === locs.length && locs.length === numaddlocs + pcmlocs.length);
					else
					{
						ChessPiece.cc.logAndThrowNewError("locs does not have the correct size!");
					}
				}
				return locs;
			}
			else return pcmlocs;
		}
	}
	
	//THIS TAKES INTO ACCOUNT CASTLEING FOR KING ONLY; IF NOT CALLED ON A KING WITH THE
	//SAME COLOR JUST RETURNS ABOVE
	static getAllKingCanMoveToLocs(sr, sc, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		let kcmvlocs = ChessPiece.getKingCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let cp = ChessPiece.getPieceAt(sr, sc, allpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return kcmvlocs;
		else
		{
			if (cp.getColor() === myclr);
			else return kcmvlocs;
			
			if (cp.getType() === "KING")
			{
				//now we can see if we can castle easily now
				//console.log("SEES IF WE CAN CASTLE:");
				let ccleft = ChessPiece.canSideCastleLeft(myclr, gid, ignorelist, addpcs);
				let ccright = ChessPiece.canSideCastleRight(myclr, gid, ignorelist, addpcs);
				//console.log("ccleft = " + ccleft);
				//console.log("ccright = " + ccright);
				let clftloc = null;
				let crgtloc = null;
				let numadd = 0;
				if (ccleft)
				{
					clftloc = ChessPiece.getLeftCastleSideNewKingLocMain(myclr, gid, ignorelist,
						addpcs);
					numadd++;
					//console.log("clftloc[0] = " + clftloc[0]);
					//console.log("clftloc[1] = " + clftloc[1]);
				}
				if (ccright)
				{
					crgtloc = ChessPiece.getRightCastleSideNewKingLocMain(myclr, gid,
						ignorelist, addpcs);
					numadd++;
					//console.log("crgtloc[0] = " + crgtloc[0]);
					//console.log("crgtloc[1] = " + crgtloc[1]);
				}
				//console.log("numadd = " + numadd);
				if (numadd < 1) return kcmvlocs;
				else if (2 < numadd)
				{
					ChessPiece.cc.logAndThrowNewError("numadd is an invalid value!");
				}
				//else;//do nothing
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(kcmvlocs)) return null;
				else
				{
					//int[][] locs = new int[kcmvlocs.length + numadd][2];
					let locs = kcmvlocs.map((mitem) => [mitem[0], mitem[1]]);
					let lci = kcmvlocs.length;
					if (ccleft)
					{
						locs.push([clftloc[0], clftloc[1]]);
						lci++;
					}
					//else;//do nothing
					if (ccright)
					{
						locs.push([crgtloc[0], crgtloc[1]]);
						lci++;
					}
					//else;//do nothing
					if (lci === locs.length && locs.length === numadd + kcmvlocs.length)
					{
						return locs;
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("locs does not have the correct size!");
					}
				}
			}
			else return kcmvlocs;
		}
	}
	
	//calls the above methods
	static getPieceCanMoveToLocsMain(sr, sc, myclr, mytpval, gid, ignorelist=null, addpcs=null,
		nocsling=false, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeBoolean(nocsling, "nocsling");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mytpval))
		{
			ChessPiece.cc.logAndThrowNewError("mytpval must not be null!");
		}
		else
		{
			if (mytpval === "BISHOP")
			{
				return ChessPiece.getBishopCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
			}
			else if (mytpval === "CASTLE" || mytpval === "ROOK")
			{
				return ChessPiece.getCastleCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
			}
			else if (mytpval === "QUEEN")
			{
				return ChessPiece.getQueenCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
			}
			else if (mytpval === "PAWN")
			{
				return ChessPiece.getAllPawnCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs,
					bpassimnxtmv);
			}
			else if (mytpval === "KING")
			{
				if (nocsling)
				{
					return ChessPiece.getKingCanMoveToLocs(sr, sc, myclr, gid, ignorelist,
						addpcs);
				}
				else
				{
					return ChessPiece.getAllKingCanMoveToLocs(sr, sc, myclr, gid, ignorelist,
						addpcs);
				}
			}
			else if (mytpval === "KNIGHT")
			{
				return ChessPiece.getKnightCanMoveToLocs(sr, sc, myclr, gid, ignorelist, addpcs);
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("illegal value found and used here for " +
					"mytpval (" + mytpval + ")!");
			}
		}
	}
	getPieceCanMoveToLocs(ignorelist=null, addpcs=null, nocsling=false, bpassimnxtmv=false)
	{
		return ChessPiece.getPieceCanMoveToLocsMain(this.getRow(), this.getCol(), this.getColor(),
			this.getType(), this.getGameID(), ignorelist, addpcs, nocsling, bpassimnxtmv);
	}
	
	
	//GET PIECE STARTING LOCATION FROM GIVEN DESIRED ENDING LOCATION FOR A DESIRED BOARD
	
	//this is given an end location and determines the starting location of the piece
	//if more than one piece can move there the starting location is ambigious and
	//will throw an error
	//if no piece can move there it returns null
	//it is done differently depending on the type of piece, how a king does it is
	//different than how a knight does it
	static getStartLocForBishopThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null,
		useqn=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeBoolean(useqn, "useqn");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		//moves on a diagnal must be free
		let tlloc = null;
		let trloc = null;
		let blloc = null;
		let brloc = null;
		for (let x = 0; x < 4; x++)
		{
			//console.log("x = " + x);
			
			let r = er;
			let c = ec;
			while (ChessPiece.isvalidrorc(r) && ChessPiece.isvalidrorc(c))
			{
				//console.log("r = " + r);
				//console.log("c = " + c);
				
				let cp = ChessPiece.getPieceAtVIAGID(r, c, gid, ignorelist, addpcs);
				//console.log("cp = ", cp);
				
				if (ChessPiece.cc.isItemNullOrUndefined(cp));
				else
				{
					//console.log("useqn = " + useqn);
					
					if (((!useqn && cp.getType() === "BISHOP") ||
						(useqn && cp.getType() === "QUEEN")) && cp.getColor() === myclr)
					{
						//found one
						//console.log("KEEP IT!");
						if (x === 0) brloc = [r, c];//new int[2];
						else if (x === 1)
						{
							if (ChessPiece.cc.isStringEmptyNullOrUndefined(brloc));
							else
							{
								ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE " +
									"BISHOP OR QUEEN!");
							}
							tlloc = [r, c];//new int[2];
						}
						else if (x === 2)
						{
							if (ChessPiece.cc.isStringEmptyNullOrUndefined(brloc) &&
								ChessPiece.cc.isStringEmptyNullOrUndefined(tlloc))
							{
								//do nothing valid
							}
							else
							{
								ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE " +
									"BISHOP OR QUEEN!");
							}
							trloc = [r, c];//new int[2];
						}
						else if (x === 3)
						{
							if (ChessPiece.cc.isStringEmptyNullOrUndefined(brloc) &&
								ChessPiece.cc.isStringEmptyNullOrUndefined(tlloc) &&
								ChessPiece.cc.isStringEmptyNullOrUndefined(trloc))
							{
								//do nothing valid
							}
							else
							{
								ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE " +
									"BISHOP OR QUEEN!");
							}
							blloc = [r, c];//new int[2];
						}
						else
						{
							ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED " +
								"HERE FOR INDEX X!");
						}
					}
					//else;//do nothing
					break;
				}
				
				//increment the variables
				//console.log("x = " + x);
				if (x === 0)
				{
					//go towards bottom right
					//console.log("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x === 1)
				{
					//go towards top left
					//console.log("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x === 2)
				{
					//go towards top right
					//console.log("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x === 3)
				{
					//go towards bottom left
					//console.log("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED HERE " +
						"FOR INDEX X!");
				}
			}//end of while loop
		}//end of x for loop
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(brloc));
		else return brloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tlloc));
		else return tlloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(trloc));
		else return trloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(blloc));
		else return blloc;
		return null;
	}
	static getStartLocForCastleThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null,
		useqn=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeBoolean(useqn, "useqn");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		//the castle or rook or queen must be unobstructed
		//move on the same row changing the colums OR move on the colum changing the row
		let rincloc = null;
		let rdecloc = null;
		let cincloc = null;
		let cdecloc = null;
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		for (let r = er; r < 8; r++)
		{
			let cp = ChessPiece.getPieceAt(r, ec, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else
			{
				if (((useqn && cp.getType() === "QUEEN") ||
					(!useqn && (cp.getType() === "CASTLE" || cp.getType() === "ROOK"))) &&
					cp.getColor() === myclr)
				{
					console.log("KEEP IT!");
					console.log("locr = " + r);
					console.log("locc = " + ec);
					//not sure how to prevent ambiguity error
					rincloc = [r, ec];//new int[2];
				}
				//else;//do nothing
				break;
			}
		}
		for (let r = er; -1 < r && r < 8; r--)
		{
			let cp = ChessPiece.getPieceAt(r, ec, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else
			{
				if (((useqn && cp.getType() === "QUEEN") ||
					(!useqn && (cp.getType() === "CASTLE" || cp.getType() === "ROOK"))) &&
					cp.getColor() === myclr)
				{
					console.log("KEEP IT!");
					console.log("locr = " + r);
					console.log("locc = " + ec);
					//not sure how to prevent ambiguity error
					rdecloc = [r, ec];//new int[2];
					if (ChessPiece.cc.isStringEmptyNullOrUndefined(rincloc));
					else
					{
						ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE CASTLE OR QUEEN!");
					}
				}
				//else;//do nothing
				break;
			}
		}
		for (let c = ec; c < 8; c++)
		{
			let cp = ChessPiece.getPieceAt(er, c, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else
			{
				if (((useqn && cp.getType() === "QUEEN") ||
					(!useqn && (cp.getType() === "CASTLE" || cp.getType() === "ROOK"))) &&
					cp.getColor() === myclr)
				{
					console.log("KEEP IT!");
					console.log("locr = " + er);
					console.log("locc = " + c);
					//not sure how to prevent ambiguity error
					cincloc = [er, c];//new int[2];
					if (ChessPiece.cc.isStringEmptyNullOrUndefined(rincloc) &&
						ChessPiece.cc.isStringEmptyNullOrUndefined(rdecloc))
					{
						//do nothing valid
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE CASTLE OR QUEEN!");
					}
				}
				//else;//do nothing
				break;
			}
		}
		for (let c = ec; -1 < c && c < 8; c--)
		{
			let cp = ChessPiece.getPieceAt(er, c, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp));
			else
			{
				if (((useqn && cp.getType() === "QUEEN") ||
					(!useqn && (cp.getType() === "CASTLE" || cp.getType() === "ROOK"))) &&
					cp.getColor() === myclr)
				{
					console.log("KEEP IT!");
					console.log("locr = " + er);
					console.log("locc = " + c);
					//not sure how to prevent ambiguity error
					cdecloc = [er, c];//new int[2];
					if (ChessPiece.cc.isStringEmptyNullOrUndefined(rincloc) &&
						ChessPiece.cc.isStringEmptyNullOrUndefined(rdecloc) &&
						ChessPiece.cc.isStringEmptyNullOrUndefined(cincloc))
					{
						//do nothing valid
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE CASTLE OR QUEEN!");
					}
				}
				//else;//do nothing
				break;
			}
		}
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(rincloc));
		else return rincloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(rdecloc));
		else return rdecloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(cincloc));
		else return cincloc;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(cdecloc));
		else return cdecloc;
		return null;
	}
	static getStartLocForQueenThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null)
	{
		let bsloc = ChessPiece.getStartLocForBishopThatCanMoveTo(er, ec, myclr, gid, ignorelist,
			addpcs, true);
		let csloc = ChessPiece.getStartLocForCastleThatCanMoveTo(er, ec, myclr, gid, ignorelist,
			addpcs, true);
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(bsloc) ||
			!(ChessPiece.isvalidrorc(bsloc[0]) && ChessPiece.isvalidrorc(bsloc[1])))
		{
			return csloc;
		}
		else
		{
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(csloc) ||
				!(ChessPiece.isvalidrorc(csloc[0]) && ChessPiece.isvalidrorc(csloc[1])))
			{
				return bsloc;
			}
			else ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE QUEEN!");
		}
	}
	static getStartLocForKnightThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		//we can use the all possible knight locs and provied the ending location to get
		//the starting location
		//if it is ambiguous, throw an error that it was ambiguous!
		
		let pktlocs = ChessPiece.getAllPossibleKnightMoveToLocs(er, ec);
		//if (ChessPiece.cc.isItemNullOrUndefined(pktlocs)) console.log("pktlocs = null");
    	//else if (pktlocs.length < 1) console.log("pktlocs is empty!");
    	//else
    	//{
    	//	console.log("pktlocs.length = " + pktlocs.length);
	    //	for (let x = 0; x < pktlocs.length; x++)
	    //	{
	    //		console.log(ChessPiece.getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//console.log(ChessPiece.getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	ChessPiece.convertRowColToStringLocMain(pktlocs[x],
		//		//		ChessPiece.WHITE_MOVES_DOWN_RANKS));
	    //	}
    	//}
    	//console.log("STARTING LOCATION: " + ChessPiece.getLocString(sr, sc) + ": " +
		//	ChessPiece.convertRowColToStringLoc(sr, sc, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	
    	if (ChessPiece.cc.isStringEmptyNullOrUndefined(pktlocs))
    	{
    		//check our location if not there return null
    		//ChessPiece cp = ChessPiece.getPieceAt(er, ec, ArrayList<ChessPiece> mpclist);
			//if (ChessPiece.cc.isItemNullOrUndefined(cp)) return null;
			//else
			//{
			//	if (cp.getType() === "KNIGHT" && cp.getColor() === myclr)
			//	{
			//		//there is already a knight at our end loc
			//		return [er, ec];//new int[2];
			//	}
			//	else return null;
			//}
			return null;
    	}
    	else
    	{
    		//check all of the given locations for a knight that is our color
    		//if there is more than 1 error ambiguous!
    		let keepit = [];//new boolean[pktlocs.length];
    		for (let x = 0; x < pktlocs.length; x++) keepit.push(false);
    		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    		for (let x = 0; x < pktlocs.length; x++)
    		{
    			//check our location for the current piece type and color
    			console.log("pktlocs[" + x + "][0] = " + pktlocs[x][0]);
    			console.log("pktlocs[" + x + "][1] = " + pktlocs[x][1]);
    			
				let cp = ChessPiece.getPieceAt(pktlocs[x][0], pktlocs[x][1], allpcs);
    			if (ChessPiece.cc.isItemNullOrUndefined(cp));
    			else
    			{
    				if (cp.getType() === "KNIGHT" && cp.getColor() === myclr)
    				{
    					console.log("KEEP IT!");
    					//found one
    					keepit[x] = true;
    					for (let c = 0; c < x; c++)
    					{
    						if (keepit[c])
							{
								ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE KNIGHT!");
							}
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
	static getStartLocForKingThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null,
		nocsling=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeBoolean(nocsling, "nocsling");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		let mkg = ChessPiece.getCurrentSideKing(myclr,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		if (ChessPiece.cc.isItemNullOrUndefined(mkg))
		{
			ChessPiece.cc.logAndThrowNewError("OUR SIDE KING MUST NOT BE NULL!");
		}
		//else;//do nothing
		
		let mkgmvlocs = ChessPiece.getPieceCanMoveToLocsMain(mkg.getRow(), mkg.getCol(), myclr,
			"KING", gid, ignorelist, addpcs, nocsling, false);
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mkgmvlocs)) return null;
		//king cannot move there
		else
		{
			for (let x = 0; x < mkgmvlocs.length; x++)
			{
				if (mkgmvlocs[x][0] === er && mkgmvlocs[x][1] === ec)
				{
					console.log("KEEP IT");
					console.log("locr = " + mkg.getRow());
					console.log("locc = " + mkg.getCol());

					return [mkg.getRow(), mkg.getCol()];
				}
				//else;//do nothing
			}
		}
		return null;
	}
	static getStartLocForPawnThatCanMoveTo(er, ec, myclr, gid, ignorelist=null, addpcs=null,
		bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");

		//it seems the best way is to get all the pawns for the color and then see where
		//they can move to
		//if there is only one that can move to our ending location great, else error or none.
		
		let mypwns = ChessPiece.getAllPawnsOfColor(myclr,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		//console.log("mypwns = ", mypwns);
		let numpwns = ChessPiece.getNumItemsInList(mypwns);
		if (numpwns < 1) return null;
		else
		{
			let fndit = false;
			let ploc = null;
			for (let p = 0; p < numpwns; p++)
			{
				let pwnmvlocs = mypwns[p].getPieceCanMoveToLocs(ignorelist, addpcs, true,
					bpassimnxtmv);
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(pwnmvlocs));
				else
				{
					//console.log("THIS HAS MOVE LOCS: mypwns[" + p + "] = ", mypwns[p]);
					for (let x = 0; x < pwnmvlocs.length; x++)
					{
						//console.log("pwnmvlocs[" + x + "][0] = " + pwnmvlocs[x][0]);
						//console.log("pwnmvlocs[" + x + "][1] = " + pwnmvlocs[x][1]);
						if (pwnmvlocs[x][0] === er && pwnmvlocs[x][1] === ec)
						{
							console.log("KEEP IT!");
							console.log("locr = " + mypwns[p].getRow());
							console.log("locc = " + mypwns[p].getCol());
							if (fndit)
							{
								ChessPiece.cc.logAndThrowNewError("FOUND MORE THAN ONE PAWN!");
							}
							else
							{
								fndit = true;
								ploc = [mypwns[p].getRow(), mypwns[p].getCol()];//new int[2];
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
	static getStartLocForPieceThatCanMoveTo(er, ec, myclr, mytpval, gid, 
		ignorelist=null, addpcs=null, nocsling=false, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(er, "er");
		ChessPiece.cc.letMustBeAnInteger(ec, "ec");
		ChessPiece.cc.letMustBeBoolean(nocsling, "nocsling");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mytpval))
		{
			ChessPiece.cc.logAndThrowNewError("INVALID TYPE (NULL OR EMPTY) FOUND AND " +
				"USED HERE!");
		}
		else if (mytpval === "CASTLE" || mytpval === "ROOK")
		{
			return ChessPiece.getStartLocForCastleThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs, false);
		}
		else if (mytpval === "KING")
		{
			return ChessPiece.getStartLocForKingThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs, nocsling);
		}
		else if (mytpval === "KNIGHT")
		{
			return ChessPiece.getStartLocForKnightThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs);
		}
		else if (mytpval === "PAWN")
		{
			return ChessPiece.getStartLocForPawnThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs, bpassimnxtmv);
		}
		else if (mytpval === "QUEEN")
		{
			return ChessPiece.getStartLocForQueenThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs);
		}
		else if (mytpval === "BISHOP")
		{
			return ChessPiece.getStartLocForBishopThatCanMoveTo(er, ec, myclr, gid, ignorelist,
				addpcs, false);
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("INVALID TYPE (" + mytpval +
				") FOUND AND USED HERE!");
		}
	}
	
	
	//ARE PIECES FREE TO MOVE AROUND
	
	//asks can piece at loc move around to another location other than the current location
	//if no piece is at the loc returns false
	static isPieceAtLocFreeToMoveAround(sr, sc, gid, ignorelist=null, addpcs=null, 
		nocsling=false, bpassimnxtmv=false)
	{
		//console.log("sr = " + sr);
		//console.log("sc = " + sc);
		//console.log("gid = " + gid);
		//console.log("nocsling = " + nocsling);
		//console.log("bpassimnxtmv = " + bpassimnxtmv);
		
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeBoolean(nocsling, "nocsling");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let cp = ChessPiece.getPieceAt(sr, sc, allpcs);
		//console.log("cp = ", cp);
		if (ChessPiece.cc.isItemNullOrUndefined(cp)) return false;
		else
		{
			let mvlocs = ChessPiece.getPieceCanMoveToLocsMain(sr, sc, cp.getColor(),
				cp.getType(), gid, ignorelist, addpcs, nocsling, bpassimnxtmv);
			//console.log("mvlocs = ", mvlocs);
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvlocs))
			{
				//console.log("MOVELOCS IS EMPTY!");
				return false;
			}
			else
			{
				//console.log("mvlocs.length = " + mvlocs.length);
				if (mvlocs.length === 1)
				{
					//console.log("mvlocs[0][0] = " + mvlocs[0][0]);
					//console.log("mvlocs[0][1] = " + mvlocs[0][1]);
					if (mvlocs[0][0] === sr && mvlocs[0][1] === sc) return false;
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
	
	static getPiecesThatAreFreeToMove(gid, ignorelist=null, addpcs=null,
		nocsling=false, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeBoolean(nocsling, "nocsling");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		
		//they can move to a location other than the current location it is on
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		if (ChessPiece.getNumItemsInList(allpcs) < 1) return null;
		else
		{
			let fpcs = null;
			for (let x = 0; x < allpcs.length; x++)
			{
				if (ChessPiece.isPieceAtLocFreeToMoveAround(allpcs[x].getRow(),
					allpcs[x].getCol(), gid, ignorelist, addpcs, nocsling, bpassimnxtmv))
				{
					//add to list
					
					if (ChessPiece.cc.isItemNullOrUndefined(fpcs)) fpcs = [];
					//else;//do nothing
					
					fpcs.push(allpcs[x]);
				}
				//else;//do nothing
			}
			return fpcs;
		}
	}
	
	
	//WHERE ALL CAN A SIDE REACH METHODS
	
	static getPieceMoveToLocsForLocs(smvlocs, mytpval, myclr, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(mytpval, "mytpval");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(smvlocs)) return null;
		
		//for each location on the smvlocs list get the moveto locs and combine them all
		//then return the list
		let tempmvlocs = [];//new int[smvlocs.length][2][];
		let numadded = 0;
		for (let x = 0; x < smvlocs.length; x++)
		{
			let mvlocs = ChessPiece.getPieceCanMoveToLocsMain(smvlocs[x][0], smvlocs[x][1],
				myclr, mytpval, gid, ignorelist, addpcs, true, false);
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvlocs)) tempmvlocs.push(null);
			else
			{
				//tempmvlocs[x][0] = [];//new int[mvlocs.length];
				//tempmvlocs[x][1] = [];//new int[mvlocs.length];
				let mytemprwsarr = [];
				let mytempclsarr = [];
				for (let c = 0; c < mvlocs.length; c++)
				{
					//console.log("mvlocs[" + c + "][0] = " + mvlocs[c][0]);
					//console.log("mvlocs[" + c + "][1] = " + mvlocs[c][1]);
					mytemprwsarr.push(mvlocs[c][0]);
					mytempclsarr.push(mvlocs[c][1]);
				}
				tempmvlocs.push([mytemprwsarr, mytempclsarr]);
				numadded += mvlocs.length;
			}
		}
		
		let rmvlocs = [];//new int[numadded][2];
		for (let x = 0; x < numadded; x++) rmvlocs.push([-1, -1]);
		let mvi = 0;
		for (let x = 0; x < smvlocs.length; x++)
		{
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(tempmvlocs[x]));
			else
			{
				for (let c = 0; c < tempmvlocs[x][0].length; c++)
				{
					if (ChessPiece.isLocOnListOfLocs(tempmvlocs[x][0][c],
						tempmvlocs[x][1][c], rmvlocs))
					{
						//do nothing valid
					}
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
		
		//copy rmvlocs into rlistmvlocs
		return ChessPiece.copyPartOfListAndReturn(mvi, rmvlocs);
	}
	
	static getAllLocsThatCanBeReachedByPiece(sr, sc, mytpval, myclr, gid,
		ignorelist=null, addpcs=null, vlocs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeAnInteger(sr, "sr");
		ChessPiece.cc.letMustBeAnInteger(sc, "sc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(myclr, "myclr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(mytpval, "mytpval");
		
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
		
		//if we visit all the locations we can move to first, then the starting location
		//will be on the vlocs
		//do not add all locations on vlocs
		//add locations that are not on vlocs
		//the return list will be the vlocs + mvlocs not on vlocs
			
		let mvlocs = ChessPiece.getPieceCanMoveToLocsMain(sr, sc, myclr, mytpval, gid, ignorelist,
			addpcs, true, false);
		//if no mvlocs return vlist
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvlocs)) return null;
		else
		{
			//if all of mvlocs are on the vlist return the vlist
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(vlocs));
			else
			{
				let allonit = true;
				for (let x = 0; x < mvlocs.length; x++)
				{
					let fndit = false;
					for (let c = 0; c < vlocs.length; c++)
					{
						if (vlocs[c][0] === mvlocs[x][0] &&
							vlocs[c][1] === mvlocs[x][1])
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
		let mymvlocs = ChessPiece.getPieceMoveToLocsForLocs(mvlocs, mytpval, myclr, gid,
			ignorelist, addpcs);
		//console.log("INIT prevsz = " + prevsz);
		//printLocsArray(mymvlocs, "lvtwomvlocs");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mymvlocs));
		else
		{
			while(prevsz < mymvlocs.length)
			{
				prevsz = mymvlocs.length;
				//console.log("NEW prevsz = " + prevsz);
				
				mymvlocs = ChessPiece.getPieceMoveToLocsForLocs(mymvlocs, mytpval, myclr, gid,
					ignorelist, addpcs);
				//ChessPiece.printLocsArray(mymvlocs, "mymvlocs");
			}//end of while loop
		}
		
		//console.log("STARTING LOCATION IS " + ChessPiece.getLocStringAndConvertIt(sr, sc));
		//ChessPiece.printLocsArray(mymvlocs, "FINAL mymvlocs");
		return mymvlocs;
	}
	getAllLocsThatCanBeReachedByThisPiece(ignorelist=null, addpcs=null)
	{
		return ChessPiece.getAllLocsThatCanBeReachedByPiece(this.getRow(), this.getCol(),
			this.getType(), this.getColor(), this.getGameID(), ignorelist, addpcs);
	}
	
	static getAllLocsThatCanBeReachedBySide(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		
		//gets all the pieces for a side...
		//get all of their move to locations for each piece
		//then save a list of all of the unique locations
		let allmypcs = ChessPiece.getCurrentSidePiecesMain(clrval, gid, ignorelist, addpcs);
		let numallmypcs = ChessPiece.getNumItemsInList(allmypcs);
		if (numallmypcs < 1)
		{
			ChessPiece.cc.logAndThrowNewError("there must be at least a king on one side!");
		}
		//else;//do nothing
		let tmplocslist = [];//new int[64][2];
		for (let x = 0; x < 64; x++) tmplocslist.push([-1, -1]);
		let rszi = 0;
		for (let x = 0; x < numallmypcs; x++)
		{
			let pcmvlocs = allmypcs[x].getAllLocsThatCanBeReachedByThisPiece(ignorelist, addpcs);
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(pcmvlocs));
			else
			{
				//add these to the rlist
				for (let c = 0; c < pcmvlocs.length; c++)
				{
					if (ChessPiece.isLocOnListOfLocs(pcmvlocs[c][0], pcmvlocs[c][1], tmplocslist));
					else
					{
						tmplocslist[rszi][0] = pcmvlocs[c][0];
						tmplocslist[rszi][1] = pcmvlocs[c][1];
						rszi++;
					}
				}
			}
		}
		
		//copy tmplocslist into rlist
		return ChessPiece.copyPartOfListAndReturn(rszi, tmplocslist);
	}
	
	
	//SPECIAL MOVES AND MAIN CAN MOVE TO METHODS
	
	
	//DOES NOT TAKE INTO ACCOUNT PAWN PROMOTION AS BEING SPECIAL
	//IF CALLED ON A CASTLE, DOES NOT CONSIDDER CASTLING
	isMoveToASpecialMove(nrval, ncval, ignorelist=null, addpcs=null, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(nrval, "nrval");
		ChessPiece.cc.letMustBeAnInteger(ncval, "ncval");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");

		let tpsnospcmvs = ["QUEEN", "BISHOP", "KNIGHT", "CASTLE", "ROOK"];
		if (ChessPiece.itemIsOnGivenList(this.getType(), tpsnospcmvs)) return false;
		else
		{
			let allpclocs = ChessPiece.getPieceCanMoveToLocsMain(this.getRow(), this.getCol(),
				this.getColor(), this.getType(), this.getGameID(), ignorelist, addpcs,
				false, bpassimnxtmv);
			let normalpclocs = null;
			if (this.getType() === "KING")
			{
				normalpclocs = ChessPiece.getKingCanMoveToLocs(this.getRow(), this.getCol(),
					this.getColor(), this.getGameID(), ignorelist, addpcs);
			}
			else
			{
				//pawn
				normalpclocs = ChessPiece.getPawnCanMoveToLocs(this.getRow(), this.getCol(),
					this.getColor(), this.getGameID(), ignorelist, addpcs);
			}
			let onnrml = false;
			let onall = false;
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(normalpclocs));
			else
			{
				for (let x = 0; x < normalpclocs.length; x++)
				{
					if (normalpclocs[x][0] === nrval && normalpclocs[x][1] === ncval)
					{
						onnrml = true;
						break;
					}
					//else;//do nothing
				}
			}
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(allpclocs));
			else
			{
				for (let x = 0; x < allpclocs.length; x++)
				{
					if (allpclocs[x][0] === nrval && allpclocs[x][1] === ncval)
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
	
	
	//NOTE: TAKES INTO ACCOUNT PAWNING WHEN CALLED ON PAWN ONLY, TAKES INTO ACCOUNT CASTLING WHEN
	//CALLED ON KING ONLY,
	//DOES NOT TAKE INTO ACCOUNT WHOSE TURN IT IS
	//TAKES INTO ACCOUNT WHAT THE NEW BOARD LOOKS LIKE, BUT REALLY SHOULD NOT
	canMoveTo(rval, cval, ignorelist=null, addpcs=null, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(rval, "rval");
		ChessPiece.cc.letMustBeAnInteger(cval, "cval");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");

		if (ChessPiece.isvalidrorc(rval) && ChessPiece.isvalidrorc(cval));
		else return false;
		//use current location, piece type, if side is in check or not, and opposing piece
		//locations to determine where I can move or if I can move at all.
		
		let locs = null;
		if (this.getType() === "BISHOP")
		{
			//on diagnals only
			locs = ChessPiece.getBishopCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs);
		}
		else if (this.getType() === "CASTLE" || this.getType() === "ROOK")
		{
			//on same row or col only
			//can castle if the other pieces between the castle and the king are not there and
			//if not in check
			//and if neither castle nor king have moved
			locs = ChessPiece.getCastleCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs);
		}
		else if (this.getType() === "QUEEN")
		{
			//diagnals and on same row or same col
			locs = ChessPiece.getQueenCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs);
		}
		else if (this.getType() === "KNIGHT")
		{
			//has at most 8 possible moves
			//up or down 3 right or left 1
			//up or down 1 right or left 3
			//--*-*--
			//-*---*-
			//---x---
			//-*---*-
			//--*-*--
			locs = ChessPiece.getKnightCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs);
		}
		else if (this.getType() === "PAWN")
		{
			//can only move forward or diagnal one space to attack
			//if it is the first move, can move forward two spaces
			//in passing or EN PASSANT is a form of attack
			//you can only pawn a pawn that has made its first move
			locs = ChessPiece.getAllPawnCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs, bpassimnxtmv);
		}
		else if (this.getType() === "KING")
		{
			//1 in any direction provided move does not put king in check
			//if in check and king cannot move without being put into check,
			//see if another piece can block it
			//if the king cannot get out of check -> checkmate other side wins.
			//if the king cannot move, but must move -> stalemate tie.
			locs = ChessPiece.getAllKingCanMoveToLocs(this.getRow(), this.getCol(),
				this.getColor(), this.getGameID(), ignorelist, addpcs);
		}
		else ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND AND USED HERE!");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(locs))
		{
			//console.log("LOCS LIST IS EMPTY!");
			return false;
		}
		else
		{
			for (let x = 0; x < locs.length; x++)
			{
				if (locs[x][0] === rval && locs[x][1] === cval) return true;
				//else;//do nothing
			}
		}
		//console.log("LOC " + ChessPiece.getLocString(rval, cval) + " NOT FOUND ON THE LIST!");
		return false;
	}
	canMoveToLoc(nloc)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(nloc) || nloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess " +
				"piece location!");
		}
		else return this.canMoveToLoc(nloc[0], nloc[1]);
	}
	
	
	//CHECKMATE METHODS
	
	//is color side in checkmate
	static inCheckmate(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		//KING MUST BE IN CHECK
		//KING CANNOT MOVE OUT OF CHECK
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY MOVING A PIECE IN FRONT OF IT
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY KILLING THE PIECE(S)
		//CHECKING THE KING
		
		let mkg = ChessPiece.getCurrentSideKing(clrval,
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
		if (ChessPiece.cc.isItemNullOrUndefined(mkg))
		{
			ChessPiece.cc.logAndThrowNewError("the king must be found!");
		}
		//else;//do nothing
		
		//can I be directly attacked by the opposing side?
		let epcs = ChessPiece.getEnemyPiecesGuardingLocation(mkg.getRow(), mkg.getCol(),
			gid, clrval, ignorelist, addpcs);
		//console.log("epcs = ", epcs);
		//is in check
		if (ChessPiece.getNumItemsInList(epcs) < 1) return false;
		//not in check so not in checkmate
		//else;//do nothing my king is in check now need to determine if it is checkmate
		console.log("" + clrval + " KING IS IN CHECK!");
		
		//need to know if this king is free to move or rather can move somewhere other
		//than the current location
		if (ChessPiece.isPieceAtLocFreeToMoveAround(mkg.getRow(), mkg.getCol(), gid,
			ignorelist, addpcs, true, false))
		{
			console.log("NOT CHECKMATE!");
			return false;
		}
		//can move out of check
		//else;//do nothing still in check
		console.log("" + clrval + " KING CANNOT MOVE OUT OF CHECK!");
		
		//can check be blocked
		//does side have no legal moves
		//if there is a legal move other than staying where we are, then it blocks check somehow
		
		let fpcs = ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist, addpcs, true, false);
		//console.log("fpcs = ", fpcs);
		
		let myclrfpcs = ChessPiece.filterListByColor(fpcs, clrval);
		//console.log("myclrfpcs = ", myclrfpcs);
		
		if (ChessPiece.getNumItemsInList(myclrfpcs) < 1)
		{
			console.log("" + clrval + " HAS NO FREE PIECES! IT CANNOT BLOCK CHECK! " +
				"IT IS CHECKMATE! " + ChessPiece.getOppositeColor(clrval) + " WINS!");
			return true;
		}
		//else;//do nothing might be able to block check
		
		for (let x = 0; x < myclrfpcs.length; x++)
		{
			console.log("myclrfpcs[" + x + "] = ", myclrfpcs[x]);
			
			let pcmvlocs = ChessPiece.getPieceCanMoveToLocsMain(myclrfpcs[x].getRow(),
				myclrfpcs[x].getCol(), clrval, myclrfpcs[x].getType(), gid, ignorelist,
				addpcs, true, false);
			//printLocsArray(pcmvlocs, "pcmvlocs");
			
			//determine where the piece can move to block check... if it indeed does block check
			if (myclrfpcs[x].getType() === "KING")
			{
				ChessPiece.cc.logAndThrowNewError("the king cannot move out of check, " +
					"now it says it can!");
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
			ChessPiece.getOppositeColor(clrval) + " WINS!");
		return true;
	}
	//is white in checkmate
	static inCheckmateWhite(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.inCheckmate("WHITE", gid, ignorelist, addpcs);
	}
	//is black in checkmate
	static inCheckmateBlack(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.inCheckmate("BLACK", gid, ignorelist, addpcs);
	}
	
	
	//STALEMATE METHODS
	
	//returns true if less than 2 pieces of that type are on the board
	static areAllOfTypeOnSameColorSquare(typeval, allpcs=null)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(typeval, "typeval");
		
		let bps = ChessPiece.getAllOfType(typeval, allpcs);
		if (ChessPiece.getNumItemsInList(bps) < 2) return true;
		else
		{
			let myfbpclr = ChessPiece.getColorOfLocFromPiece(bps[0]);
			for (let x = 1; x < bps.length; x++)
			{
				if (ChessPiece.getColorOfLocFromPiece(bps[x]) === myfbpclr);
				else return false;
			}
			return true;
		}
	}
	
	static areAllBishopsOnSameColorSquare(allpcs)
	{
		return ChessPiece.areAllOfTypeOnSameColorSquare("BISHOP", allpcs);
	}
	static areAllBishopsOnSameColorSquareMain(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.areAllBishopsOnSameColorSquare(
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	areAllBishopsOnSameColorSquare()
	{
		return ChessPiece.areAllBishopsOnSameColorSquareMain(this.getGameID());
	}
	
	static isAutoStalemate(allpcs)
	{
		//if we have just 2 kings -> yes
		//if we have a king and a bishop vs a king -> yes
		//if we have just 2 kings and bishops and bishops are all on the same color squares -> yes
		//if we have a king and a knight vs a king -> yes
		
		//STALEMATE, BUT NOT AUTO STALEMATE:
		//if we 2 kings and a bunch of pawns all blocking each other, but cannot capture
		//each other -> yes
		//if no piece can kill an enemy piece to free up check-mating pieces
		//(pawn, castle, or a queen) -> yes
		//if one side has no legal moves if not checkmate and it is their turn -> yes
		//if checkmate is not possible -> yes
		
		//CHECKMATE IS POSSIBLE:
		//king and 2 bishops (provided bishops are on different color squares) vs king
		//king and 2 knights vs king
		//if we have a king a knight or bishop vs a king and knight or bishop
		//king and queen vs king
		//king and castle vs king
		//checkmate is more likely than stalemate to occur with more pieces in general
		
		let wpcs = ChessPiece.getCurrentSidePieces("WHITE", allpcs);
		let bpcs = ChessPiece.getCurrentSidePieces("BLACK", allpcs);
		let wpcstps = ChessPiece.getPieceTypes(wpcs);
		let bpcstps = ChessPiece.getPieceTypes(bpcs);
		//king, queen, castle (rook), bishop, knight, pawn
		let wpccnts = ChessPiece.getCountsForEachPieceTypeForASide(wpcstps);
		let bpccnts = ChessPiece.getCountsForEachPieceTypeForASide(bpcstps);
		let numwkgs = ChessPiece.getCountForPieceTypeForASide(wpccnts, "KING");
		let numbkgs = ChessPiece.getCountForPieceTypeForASide(bpccnts, "KING");
		let numwbps = ChessPiece.getCountForPieceTypeForASide(wpccnts, "BISHOP");
		let numbbps = ChessPiece.getCountForPieceTypeForASide(bpccnts, "BISHOP");
		let numwcs = ChessPiece.getCountForPieceTypeForASide(wpccnts, "CASTLE");
		let numbcs = ChessPiece.getCountForPieceTypeForASide(bpccnts, "CASTLE");
		let numwqs = ChessPiece.getCountForPieceTypeForASide(wpccnts, "QUEEN");
		let numbqs = ChessPiece.getCountForPieceTypeForASide(bpccnts, "QUEEN");
		let numwkts = ChessPiece.getCountForPieceTypeForASide(wpccnts, "KNIGHT");
		let numbkts = ChessPiece.getCountForPieceTypeForASide(bpccnts, "KNIGHT");
		let numwps = ChessPiece.getCountForPieceTypeForASide(wpccnts, "PAWN");
		let numbps = ChessPiece.getCountForPieceTypeForASide(bpccnts, "PAWN");
		if (numwkgs === 1 && numbkgs === 1);
		else ChessPiece.cc.logAndThrowNewError("invalid number of kings on the board!");
		//if there is a castle, a pawn, or a queen on the board: not an automatic stalemate
		if (0 < numwqs || 0 < numbqs || 0 < numwps || 0 < numbps || 0 < numwcs || 0 < numbcs)
		{
			return false;
		}
		//else;//do nothing this might be an automatic stalemate
		//is king vs king -> yes
		let kgvskg = (numwkgs === 1 && numbkgs === 1 && numwbps < 1 && numbbps < 1 &&
			numwcs < 1 && numbcs < 1 && numwqs < 1 && numbqs < 1 && numwkts < 1 &&
			numbkts < 1 && numwps < 1 && numbps < 1);
		if (kgvskg) return true;
		//is king vs king and knight -> yes
		let kgvskgandkt = (numwkgs === 1 && numbkgs === 1 && ((numwkts === 1 && numbkts < 1) ||
			(numbkts === 1 && numwkts < 1)) && numwps < 1 && numbps < 1 && numwqs < 1 &&
			numbqs < 1 && numwbps < 1 && numbbps < 1 && numwcs < 1 && numbcs < 1);
		if (kgvskgandkt) return true;
		//king and any number of bishops vs king and any number of bishops
		//provided all bishops are on same color square
		let kgsandbps = (numwkgs === 1 && numbkgs === 1 && numwcs < 1 && numbcs < 1 &&
			numwqs < 1 && numbqs < 1 && numwps < 1 && numbps < 1 && numwkts < 1 && numbkts < 1);
		if (kgsandbps && ChessPiece.areAllBishopsOnSameColorSquare(allpcs)) return true;
		else return false;
	}
	static isAutoStalemateMain(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		return ChessPiece.isAutoStalemate(
			ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid));
	}
	
	//can an entire side not move
	static doesSideHaveNoLegalMoves(clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let fpcs = ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist, addpcs, true, false);
		//console.log("fpcs = ", fpcs);
		
		let myclrfpcs = ChessPiece.filterListByColor(fpcs, clrval);
		//console.log("myclrfpcs = ", myclrfpcs);
		
		if (ChessPiece.getNumItemsInList(myclrfpcs) < 1)
		{
			console.log("" + clrval + " HAS NO FREE PIECES! IT HAS NO LEGAL MOVES " +
				"IT CAN MAKE! STALEMATE!");
			return true;
		}
		else return false;
	}
	static doesWhiteHaveNoLegalMoves(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.doesSideHaveNoLegalMoves("WHITE", gid, ignorelist, addpcs);
	}
	static doesBlackHaveNoLegalMoves(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.doesSideHaveNoLegalMoves("BLACK", gid, ignorelist, addpcs);
	}
	
	
	//THESE CAPTURE METHODS ARE NOT ERROR FREE DUE TO ASSUMPTIONS THEY OPERATE WITH
	
	//how to determine if a situation comes down to just the free pieces?
	//how to determine if a free piece is able to capture an enemy piece through a
	//series of legal moves?
	//-to move a piece on one board only, I could call setLoc which does not register the moves
	//-determine all possible places a piece can get from a certain starting location
	//-then from each of those locations see where it can get and add those locs to the list
	//-ignore castling to speed it up
	//-once the list is complete IE you cannot get to a new location because
	//it is already on the list -> done
	//-now check and see if any enemy pieces are on those locations
	//if it does come down to just the free pieces, and those free pieces
	//generate auto-stalemate -> yes
	//if an entire side cannot move and it is their turn and not checkmate -> yes
	
	//this asks is it possible for a specific side to capture an enemy piece
	//(if the enemy stays in their current positions)
	static canSideCaptureAPieceIfEnemyStaysSame(sideclrtomv, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(sideclrtomv, "sideclrtomv");
		
		//if we can move to an enemy piece's square then yes a capture is possible
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible
		//and not a stalemate.
		
		let myfpcs = ChessPiece.filterListByColor(ChessPiece.getPiecesThatAreFreeToMove(gid,
			ignorelist, addpcs, true, false), sideclrtomv);
		let numfpcs = ChessPiece.getNumItemsInList(myfpcs);
		if (numfpcs < 1)
		{
			//console.log("sideclrtomv = " + sideclrtomv);
			//ChessPiece.cc.logAndThrowNewError("the side has legal moves, that means that " +
			//	"there is at least one piece that is free, but none were found!");
			return false;
		}
		//else;//do nothing
		
		let allepcs = ChessPiece.getOpposingSidePiecesMain(sideclrtomv, gid, ignorelist, addpcs);
		let epclocs = ChessPiece.getLocsFromPieceList(allepcs);
		//ChessPiece.printLocsArray(epclocs, "epclocs");
		//console.log("");
		//console.log("MY SIDE PIECES CAN MOVE TO:");
		for (let x = 0; x < numfpcs; x++)
		{
			let allpossiblemvlocsforpc = myfpcs[x].getAllLocsThatCanBeReachedByThisPiece(
				ignorelist, addpcs);
			//console.log("myfpcs[" + x + "] = ", myfpcs[x]);
			//ChessPiece.printLocsArray(allpossiblemvlocsforpc, "allpossiblemvlocsforpc");
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(allpossiblemvlocsforpc) ||
				allpossiblemvlocsforpc.length < 2)
			{
				ChessPiece.cc.logAndThrowNewError("the piece was free meaning it has more " +
					"than one location it can move to, but now it claims it cannot move!");
			}
			else
			{
				for (let r = 0; r < allpossiblemvlocsforpc.length; r++)
				{
					for (let c = 0; c < epclocs.length; c++)
					{
						if (allpossiblemvlocsforpc[r][0] === epclocs[c][0] &&
							allpossiblemvlocsforpc[r][0] === epclocs[c][1])
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
	
	//this asks is a capture possible starting with the given color, then it uses
	//the opposite color
	//white is passed in by default for the color, so white then black or black then white
	static canASideCaptureAPieceIfEnemyStaysSame(sideclrtomv, gid, ignorelist=null, addpcs=null)
	{
		return (ChessPiece.canSideCaptureAPieceIfEnemyStaysSame(sideclrtomv, gid, ignorelist,
			addpcs) ||
		ChessPiece.canSideCaptureAPieceIfEnemyStaysSame(ChessPiece.getOppositeColor(sideclrtomv),
			gid, ignorelist, addpcs));
	}
	static canASideCaptureAPieceIfEnemyStaysSameMain(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.canASideCaptureAPieceIfEnemyStaysSame("WHITE", gid, ignorelist, addpcs);
	}
	
	//this asks is it possible for both sides to move to a common location
	//(this assumes that both sides move)
	static isACapturePossible(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		let wmvlocs = ChessPiece.getAllLocsThatCanBeReachedBySide("WHITE", gid, ignorelist,
			addpcs);
		//ChessPiece.printLocsArray(wmvlocs, "wmvlocs");
		let bmvlocs = ChessPiece.getAllLocsThatCanBeReachedBySide("BLACK", gid, ignorelist,
			addpcs);
		//ChessPiece.printLocsArray(bmvlocs, "bmvlocs");
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(wmvlocs) ||
			ChessPiece.cc.isStringEmptyNullOrUndefined(bmvlocs))
		{
			return true;//not sure
		}
		//else;//do nothing
		for (let x = 0; x < wmvlocs.length; x++)
		{
			for (let c = 0; c < bmvlocs.length; c++)
			{
				if (wmvlocs[x][0] === bmvlocs[c][0] &&
					wmvlocs[x][1] === bmvlocs[c][1])
				{
					//console.log("THE FIRST CAPTURE LOC FOUND IS: " +
					//	ChessPiece.getLocStringAndConvertIt(wmvlocs[x][0], wmvlocs[x][1]));
					return true;
				}
				//else;//do nothing
			}
		}
		return false;
	}
	
	
	//MAIN STALEMATE METHODS
	
	//is stalemate side's color's turn to move
	static isStalemate(sideclrtomv, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(sideclrtomv, "sideclrtomv");

		//checks to see if both sides are in check starting with the color given then it
		//will check the opposite color
		if (ChessPiece.isASideInCheck(sideclrtomv, gid, ignorelist, addpcs))
		{
			console.log("ONE SIDE IS IN CHECK! SO NO STALEMATE!");
			return false;
		}
		//else;//do nothing
		console.log("NO SIDE IS IN CHECK!");
		
		if (ChessPiece.isAutoStalemateMain(gid, ignorelist, addpcs) ||
			ChessPiece.doesSideHaveNoLegalMoves(sideclrtomv, gid, ignorelist, addpcs))
		{
			console.log("EITHER THERE ARE NOT ENOUGH PIECES OR THE SIDE WHO IS SUPPOSED " +
				"TO MOVE CANNOT! SO STALEMATE!");
			return true;
		}
		//else;//do nothing
		console.log("THERE ARE ENOUGH PIECES ON THE BOARD! A CAPTURE MIGHT BE POSSIBLE!");
		
		
		//if it is not possible to make a capture, then the game cannot end in
		//checkmate -> yes it is a stalemate
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible
		//and not a stalemate.
		
		let cppossiblebmvs = ChessPiece.isACapturePossible(gid, ignorelist, addpcs);
		console.log("IS A CAPTURE POSSIBLE: " + cppossiblebmvs);
		
		if (cppossiblebmvs || ChessPiece.canASideCaptureAPieceIfEnemyStaysSame(sideclrtomv,
			gid, ignorelist, addpcs))
		{
			console.log("IT IS POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE!");
			
			//IF THIS IS THE LAST MOVE IN A COMPLETED GAME AND THE GAME ENDED IN A TIE OR
			//DRAW THEN -> yes
			//OTHERWISE -> no
			//console.log("ChessPiece.getGameVIAGID(gid).isCompleted() = " +
			//	ChessPiece.getGameVIAGID(gid).isCompleted());
			//console.log("ChessPiece.getGameVIAGID(gid).isTied() = " +
			//	ChessPiece.getGameVIAGID(gid).isTied());
			//console.log("ChessPiece.getGameVIAGID(gid).isLastMove() = " +
			//	ChessPiece.getGameVIAGID(gid).isLastMove());
			
			if (ChessPiece.getGameVIAGID(gid).isCompleted() &&
				ChessPiece.getGameVIAGID(gid).isTied() &&
				ChessPiece.getGameVIAGID(gid).isLastMove())
			{
				return true;
			}
			else return false;
		}
		else
		{
			console.log("IT IS NOT POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE SO STALEMATE!");
			return true;//cannot capture an enemy piece -> stalemate
		}
	}
	static isStalemateWhite(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isStalemate("WHITE", gid, ignorelist, addpcs);
	}
	static isStalemateBlack(gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.isStalemate("BLACK", gid, ignorelist, addpcs);
	}
	
	
	//SERVER METHODS
	
	//numei is inclusive
	static getNumStartAndEndIndexs(wd, offset=0)
	{
		ChessPiece.cc.letMustBeAnInteger(offset, "offset");
		ChessPiece.cc.letMustBeDefinedAndNotNull(wd, "wd");

		if (offset < 0) ChessPiece.cc.logAndThrowNewError("offset MUST BE AT LEAST ZERO (0)!");
		//else;//do nothing
		let numsi = -1;
		let numei = -1;
		let res = [-1, -1];//new int[2];
		for (let i = 0; i < wd.length; i++)
		{
			if (ChessPiece.cc.isDigit("" + wd.charAt(i)))
			{
				numsi = i;
				break;
			}
			//else;//do nothing
		}
		if (numsi < 0 || wd.length - 1 < numsi) return res;
		for (let i = numsi; i < wd.length; i++)
		{
			if (ChessPiece.cc.isDigit("" + wd.charAt(i)))
			{
				if (i + 1 < wd.length);
				else if (i + 1 === wd.length)
				{
					numei = wd.length - 1;
					break;
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOUND AND USED HERE " +
						"FOR DIGIT INDEX I!");
				}
			}
			else
			{
				numei = i - 1;
				break;
			}
		}
		if (numei < 0 || numei < numsi || wd.length - 1 < numei)
		{
			ChessPiece.cc.logAndThrowNewError("END NUMBER INDEX NOT SET CORRECTLY!");
		}
		//else;//do nothing
		res[0] = numsi + offset;
		res[1] = numei + offset;
		return res;
	}
	
	static getShortHandNotationForWord(wd)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(wd)) return wd;
		else
		{
			let myspcs = [" ", "\t", "\n"];
			for (let i = 0; i < wd.length; i++)
			{
				if (ChessPiece.itemIsOnGivenList("" + wd.charAt(i), myspcs))
				{
					ChessPiece.cc.logAndThrowNewError("THE WORD (" + wd +
						") MUST NOT HAVE SPACING CHARACTERS ON IT, BUT IT DID!");
				}
				//else;//do nothing
			}
			if (wd === "CREATE") return "+";
			else if (wd === "DELETE") return "-";
			else if (wd === "HINTS") return "HINTS";
			else if (ChessPiece.itemIsOnGivenList(wd, ChessPiece.validTypes))
			{
				return ChessPiece.getShortHandType(wd);
			}
			else if (ChessPiece.itemIsOnGivenList(wd, ChessPiece.validColors))
			{
				return ChessPiece.getShortHandColor(wd);
			}
			else if (ChessPiece.itemIsOnGivenList(wd.substring(0, wd.length - 1),
				ChessPiece.validTypes))
			{
				return ChessPiece.getShortHandType(wd.substring(0, wd.length - 1)) +
					wd.charAt(wd.length - 1);
			}
			else if (ChessPiece.itemIsOnGivenList(wd.substring(0, wd.length - 1),
				ChessPiece.validColors))
			{
				return ChessPiece.getShortHandColor(wd.substring(0, wd.length - 1)) +
					wd.charAt(wd.length - 1);
			}
			else if (wd === "SET" || wd === "set") return "S";
			else if (wd === "into:" || wd === "INTO:") return "INTO";
			else if (wd === "TURN" || wd === "turn") return "T";
			else if (wd === "TIE:" || wd === "tie:") return "T";
			else if (wd === "to:" || wd === "TO:") return "TO";
			else if (wd === "WITH" || wd === "with") return "W";
			else if (wd === "WANTS" || wd === "wants") return "W";
			else if (wd === "LEFT" || wd === "left") return "L";
			else if (wd === "RIGHT" || wd === "right") return "R";
			else if (wd === "RESIGNS" || wd === "resigns" ||
				wd === "SURRENDERS" || wd === "surrenders")
			{
				return "RESIGNS";
			}
			else if (wd === "move(s)!" || wd === "move(s)" || wd === "moves!" ||
				wd === "moves" || wd === "move!" || wd === "move")
			{
				return "MS";
			}
			else if (wd === "at:" || wd === "AT:" || wd === "AT" || wd === "at")
			{
				return "";
			}
			else if (ChessPiece.cc.isANumber(wd)) return wd;
			else
			{
				console.log("wd = " + wd);
				console.log("NOT SURE WHAT TO DO HERE!");
				return "";
			}
		}
	}
	//converts the location to string loc
	static getShortHandMoves(mvs)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvs)) return mvs;
		else
		{
			let nwmvs = [];
			for (let c = 0; c < mvs.length; c++)
			{
				let oldmv = "" + mvs[c];
				let nwmv = "";
				let si = 0;
				let addstraight = false;
				for (let i = 0; i < oldmv.length; i++)
				{
					if (oldmv.charAt(i) === ' ' || i + 1 === oldmv.length)
					{
						if (addstraight)
						{
							//console.log("HANDLE ADD STRAIGHT HERE:");
							if (i + 1 === oldmv.length) nwmv += "" + oldmv.substring(si + 1);
							else nwmv += "" + oldmv.substring(si + 1, i);
							addstraight = false;
						}
						else
						{
							if (i + 1 === oldmv.length)
							{
								nwmv += "" + ChessPiece.getShortHandNotationForWord(
									oldmv.substring(si));
							}
							else
							{
								nwmv += "" + ChessPiece.getShortHandNotationForWord(
									oldmv.substring(si, i));
							}
						}
						si = i + 1;
					}
					else if (0 < i && (oldmv.charAt(i) === 'a' ||  oldmv.charAt(i) === 'A') &&
						(oldmv.charAt(i + 1) === 't' || oldmv.charAt(i + 1) === 'T') &&
						oldmv.charAt(i + 2) === ':' && oldmv.charAt(i + 3) === ' ' &&
						oldmv.charAt(i + 4) !== '(')
					{
						si = i + 3;
						addstraight = true;
						i = i + 4;
						//console.log("AT: FOUND!");
						//console.log("si = " + si);
					}
					else if (0 < i && oldmv.charAt(i - 1) === ' ' && (oldmv.charAt(i) === 't' ||
						oldmv.charAt(i) === 't') && (oldmv.charAt(i + 1) === 'o' ||
						oldmv.charAt(i + 1) === 'O') && oldmv.charAt(i + 2) === ':' &&
						oldmv.charAt(i + 3) === ' ' && oldmv.charAt(i + 4) !== '(')
					{
						si = i + 3;
						addstraight = true;
						i = i + 4;
						//console.log("TO: FOUND!");
						//console.log("si = " + si);
						nwmv += "TO";
					}
					else if (0 < i && oldmv.charAt(i) === '(')
					{
						if (oldmv.charAt(i + 1) === 's');
						else
						{
							let cpi = -1;
							for (let k = i + 1; k < oldmv.length; k++)
							{
								if (oldmv.charAt(k) === ')')
								{
									cpi = k;
									break;
								}
								//else;//do nothing
							}
							if (cpi < 0 || cpi < i + 1 || oldmv.length - 1 < cpi)
							{
								ChessPiece.cc.logAndThrowNewError("ILLEGAL INDEX (" + cpi +
									") FOUND AND USED FOR THE CLOSING PARENTHESIS INDEX!");
							}
							//else;//do nothing
							let myr = -1;
							let myc = -1;
							//get the numstartindex and numendindex
							//console.log("oldmv = " + oldmv);
							//console.log("oldmv.substring(" + i + ", " + cpi + ") = " +
							//oldmv.substring(i, cpi));
							
							let snumsieis = ChessPiece.getNumStartAndEndIndexs(
								oldmv.substring(i, cpi), i);
							//console.log("snumsieis[0] = " + snumsieis[0]);
							//console.log("snumsieis[1] = " + snumsieis[1]);
							
							myr = Number(oldmv.substring(snumsieis[0],
								snumsieis[1] + 1));
							let enumsieis = ChessPiece.getNumStartAndEndIndexs(
								oldmv.substring(snumsieis[1] + 1, cpi), snumsieis[1] + 1);
							//console.log("enumsieis[0] = " + enumsieis[0]);
							//console.log("enumsieis[1] = " + enumsieis[1]);
							
							myc = Number(oldmv.substring(enumsieis[0],
								enumsieis[1] + 1));
							//console.log("myr = " + myr);
							//console.log("myc = " + myc);
							
							nwmv += ChessPiece.convertRowColToStringLoc(myr, myc,
								ChessPiece.WHITE_MOVES_DOWN_RANKS);
							i = cpi;
							si = cpi + 1;
						}
					}
					//else;//do nothing
				}//end of i for loop
				console.log("oldmv = " + oldmv);
				console.log("nwmv = " + nwmv);
				nwmvs.push("" + nwmv);
			}//end of c for loop
			return nwmvs;
		}
	}
	
	static convertShortHandMoveToLongVersion(mv)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mv)) 
		{
			ChessPiece.cc.logAndThrowNewError("mv must not be empty or null!");
		}
		//else;//do nothing
		
		console.log("mv = " + mv);
		
		let nwmv = "";
		if (mv.charAt(0) === '-') nwmv += "DELETE ";
		else if (mv.charAt(0) === '+') nwmv += "CREATE ";
		else if (mv.charAt(0) === 'W') nwmv += "WHITE ";
		else if (mv.charAt(0) === 'B') nwmv += "BLACK ";
		else if (mv.charAt(0) === 'T') nwmv += "TURN ";
		else if (mv.charAt(0) === 'S') nwmv += "SET ";
		else if (mv.indexOf("UNDO") === 0)
		{
			let retstr = "UNDO " + ChessPiece.convertShortHandMoveToLongVersion(mv.substring(4));
			console.log("nwmv = " + retstr);
			return retstr;
		}
		else ChessPiece.cc.logAndThrowNewError("ILLEGAL STARTING CHARACTER FOR THE MOVE!");
		//console.log("OLD nwmv = " + nwmv);
		
		let shtp = null;
		let ei = -1;
		let usetpat = true;
		if (mv.charAt(0) === '-' || mv.charAt(0) === '+' || mv.charAt(0) === 'T' ||
			mv.charAt(0) === 'S')
		{
			//next will be color
			if (mv.charAt(1) === 'W') nwmv += "WHITE ";
			else if (mv.charAt(1) === 'B') nwmv += "BLACK ";
			else ChessPiece.cc.logAndThrowNewError("ILLEGAL SECOND CHARACTER FOR THE MOVE!");
			
			if (mv.charAt(0) === 'S') usetpat = false;
			else
			{
				if (mv.charAt(2) === 'L' || mv.charAt(2) === 'R')
				{
					ei = 5;
					if (mv.charAt(2) === 'L') nwmv += "LEFT ";
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
			if (mv.charAt(1) === 'L' || mv.charAt(1) === 'R')
			{
				ei = 4;
				if (mv.charAt(1) === 'L') nwmv += "LEFT ";
				else nwmv += "RIGHT ";
			}
			else ei = 3;
			shtp = mv.substring(ei - 2, ei);
		}
		if (mv.length === 5)
		{
			nwmv += ChessPiece.getLongHandType(shtp) + mv.substring(ei);
			//System.out.print("FINAL ");
			console.log("nwmv = " + nwmv);
			return "" + nwmv;
		}
		else if (usetpat)
		{
			nwmv += ChessPiece.getLongHandType(shtp) + " at: " + mv.substring(ei, ei + 2) + " ";
		}
		else nwmv += " WANTS TIE: " + mv.charAt(mv.length - 1);
		//console.log("NEW nwmv = " + nwmv);
		if (usetpat)
		{
			//console.log("mv.charAt(ei + 2=" + (ei + 2) + ") = " + mv.charAt(ei + 2));
			//console.log("mv.substring(ei + 6) = " + mv.substring(ei + 6));
			
			//mv.substring(ei + 2, ei + 4)
			if (mv.charAt(ei + 2) === 'T') nwmv += "to: " + mv.substring(ei + 4);
			else if (mv.charAt(ei + 2) === 'W')
			{
				nwmv += "with " + mv.substring(ei + 3, mv.length - 2) + " move(s)!";
			}
			else if (mv.charAt(ei + 2) === 'I')
			{
				nwmv += "into: " + ChessPiece.getLongHandType(mv.substring(ei + 6)); 
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("ILLEGAL CHARACTER FOUND AT POSITION " +
					"FAILED TO CONVERT SHORT HAND MOVE TO LONG HAND VERSION!");
			}
		}
		//else;//do nothing for set tie command
		
		//let mystr = "FINAL ";
		console.log("nwmv = " + nwmv);//mystr + 
		return "" + nwmv;
	}
	static convertAllShortHandMovesToLongVersion(mvs)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvs)) return mvs;
		else return mvs.map((mv) => ChessPiece.convertShortHandMoveToLongVersion(mv));
	}
	
	
	//GEN-MOVETO METHODS
	
	//INDIVIDUAL MOVE TO COMMANDS (MOVETO, CASTLING, PAWNING, CREATE OR DELETE, HINTS,
	//PROMOTION, RESIGNATION, TIEDESIRE)
	
	//CMD_TYPE COLOR TYPE at: LOC_STRING with NUM move(s)!
	static genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c, mvscnt, usecreate, useshort)
	{
		ChessPiece.cc.letMustBeAnInteger(mvscnt, "mvscnt");
		ChessPiece.cc.letMustBeAnInteger(r, "r");
		ChessPiece.cc.letMustBeAnInteger(c, "c");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");
		ChessPiece.cc.letMustBeBoolean(usecreate, "usecreate");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");
		
		const bgstr = ((usecreate) ? ((useshort) ? "+" : "CREATE ") :
			((useshort) ? "-" : "DELETE "));
		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		const mytp = ((useshort) ? ChessPiece.getShortHandType(tp) : "" + tp + " at: ");
		const mymvscntstr = ((useshort) ? "W" + mvscnt + "MS" : " with " + mvscnt + " move(s)!");
		let cmd = "" + bgstr + myclr + mytp + ChessPiece.convertRowColToStringLoc(r, c,
			ChessPiece.WHITE_MOVES_DOWN_RANKS) + mymvscntstr;
		return cmd;
	}
	static genLongOrShortHandCreateCommand(clr, tp, r, c, mvscnt, useshort)
	{
		return ChessPiece.genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c, mvscnt,
			true, useshort);
	}
	static genLongOrShortHandDeleteCommand(cp, errmsg, throwerr, useshort)
	{
		ChessPiece.cc.letMustBeBoolean(throwerr, "throwerr");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");

		if (ChessPiece.cc.isItemNullOrUndefined(cp))
		{
			if (throwerr)
			{
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(errmsg))
				{
					ChessPiece.cc.logAndThrowNewError("the piece must not be null!");
				}
				else ChessPiece.cc.logAndThrowNewError(errmsg);
			}
			else return null;
		}
		else
		{
			return ChessPiece.genLongOrShortHandDeleteOrCreateCommand(cp.getColor(), cp.getType(),
				cp.getRow(), cp.getCol(), cp.getMoveCount(), false, useshort);
		}
	}
	
	//COLOR TYPE at: START_LOC_STRING to: END_LOC_STRING
	static genLongOrShortHandMoveCommandOnlyString(clr, tp, cr, mcc, nr, nc, usedir,
		useleft, useshort)
	{
		ChessPiece.cc.letMustBeAnInteger(cr, "cr");
		ChessPiece.cc.letMustBeAnInteger(mcc, "mcc");
		ChessPiece.cc.letMustBeAnInteger(nr, "nr");
		ChessPiece.cc.letMustBeAnInteger(nc, "nc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");
		ChessPiece.cc.letMustBeBoolean(usedir, "usedir");
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");
		
		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		const mytp = ((useshort) ? ChessPiece.getShortHandType(tp) : "" + tp + " at: ");
		const dirstr = ((useleft) ? ((useshort) ? "L" : "LEFT ") : ((useshort) ? "R" : "RIGHT "));
		const dirpart = ((usedir) ? dirstr : "");
		const transolocstr = ((useshort) ? "TO" : " to: ");
		let cmd = "" + myclr + dirpart + mytp +
			ChessPiece.convertRowColToStringLoc(cr, mcc, ChessPiece.WHITE_MOVES_DOWN_RANKS) +
			transolocstr +
			ChessPiece.convertRowColToStringLoc(nr, nc, ChessPiece.WHITE_MOVES_DOWN_RANKS);
		return cmd;
	}
	static genLongOrShortHandMoveCommandOnlyStringMain(cp, nr, nc, usedir, useleft, errmsg,
		throwerr, useshort)
	{
		ChessPiece.cc.letMustBeAnInteger(nr, "nr");
		ChessPiece.cc.letMustBeAnInteger(nc, "nc");
		ChessPiece.cc.letMustBeBoolean(usedir, "usedir");
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");
		ChessPiece.cc.letMustBeBoolean(throwerr, "throwerr");

		if (ChessPiece.cc.isItemNullOrUndefined(cp))
		{
			if (throwerr)
			{
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(errmsg))
				{
					ChessPiece.cc.logAndThrowNewError("the chess piece must not be null!");
				}
				else ChessPiece.cc.logAndThrowNewError(errmsg);
			}
			else return null;
		}
		else
		{
			return ChessPiece.genLongOrShortHandMoveCommandOnlyString(cp.getColor(), cp.getType(),
				cp.getRow(), cp.getCol(), nr, nc, usedir, useleft, useshort);
		}
	}
	
	//TURN PAWN at: LOC_STRING into: NEW_TYPE
	static genLongOrShortHandPawnPromotionCommand(clr, nr, nc, ptpval, useshort)
	{
		ChessPiece.cc.letMustBeAnInteger(nr, "nr");
		ChessPiece.cc.letMustBeAnInteger(nc, "nc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");
		
		let myvptps = ["QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"];
		let myctpval = null;
		if (ChessPiece.itemIsOnGivenList(ptpval, myvptps))
		{
			if (ptpval === "ROOK") myctpval = "CASTLE";
			else myctpval = "" + ptpval;
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("CANNOT PROMOTE A PAWN TO GIVEN TYPE (" +
				ptpval + ")!");
		}

		const fpart = ((useshort) ? "T" : "TURN ");
		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		const mytp = ((useshort) ? "PN" : "PAWN at: ");
		const lpart = ((useshort) ? "INTO" : " into: ");
		let propwncmd = fpart + myclr + mytp + ChessPiece.convertRowColToStringLoc(nr, nc,
			ChessPiece.WHITE_MOVES_DOWN_RANKS) + lpart + myctpval;
		return propwncmd;
	}
	
	//COLOR HINTS
	//COLOR TYPE at: LOC_STRING HINTS
	static genLongOrShortHandHintsCommandForPieceOrSide(clr, tp, cr, cc, useside, useshort)
	{
		ChessPiece.cc.letMustBeAnInteger(cr, "cr");
		ChessPiece.cc.letMustBeAnInteger(cc, "cc");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");
		ChessPiece.cc.letMustBeBoolean(useside, "useside");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");

		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		const myhtsstr = ((useshort) ? "HINTS" : " HINTS");
		let cmd = null;
		if (useside) cmd = "" + myclr + myhtsstr;
		else
		{
			const mytp = ((useshort) ? ChessPiece.getShortHandType(tp) : "" + tp + " at: ");
			cmd = "" + myclr + mytp + ChessPiece.convertRowColToStringLoc(cr, cc,
				ChessPiece.WHITE_MOVES_DOWN_RANKS) + myhtsstr;
		}
		return cmd;
	}
	
	//COLOR RESIGNS
	static genLongOrShortHandResignCommand(clr, useshort)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");

		//WHITE RESIGNS
		//BLACK RESIGNS
		//WRESIGNS
		//BRESIGNS
		//0123456789012
		//0         1
		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		return "" + myclr + "RESIGNS";
		//return "" + myclr + "SURRENDERS";
	}
	
	//SET COLOR WANTS TIE: VALUE
	static genLongOrShortHandTieDesireCommand(clr, val, useshort)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeBoolean(val, "val");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");

		const myclr = ((useshort) ? ChessPiece.getShortHandColor(clr) : "" + clr + " ");
		const fpart = ((useshort) ? "S" : "SET ");
		const myboolval = ((val) ? "1" : "0");
		const midstr = ((useshort) ? "WT" : "WANTS TIE: ");
		return "" + fpart + myclr + midstr + myboolval;
	}
	
	//DELETE OTHER_COLOR PAWN at: LOC_STRING with NUM move(s)!
	//COLOR DIR_STRING PAWN at: START_LOC_STRING to: END_LOC_STRING
	static genPawningMoveToCommand(clr, crval, ccval, nrval, ncval, gid, ignorelist=null,
		addpcs=null, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(crval, "crval");
		ChessPiece.cc.letMustBeAnInteger(ccval, "ccval");
		ChessPiece.cc.letMustBeAnInteger(nrval, "nrval");
		ChessPiece.cc.letMustBeAnInteger(ncval, "ncval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		
		//PAWNING NOTATION
		//WHITE LEFT PAWN at: current_loc to: next_loc
		//-BPN??W?MVS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
		//WLPNB4TOA3 (DISPLAY TO THE USER)
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let mpc = ChessPiece.getPieceAt(crval, ccval, allpcs);
		const useleft = (ncval < ccval);
		
		//make sure we can do this otherwise error out
		if (mpc.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
		else
		{
			ChessPiece.cc.logAndThrowNewError("" + mpc + " CANNOT MOVE TO " +
				ChessPiece.getLocString(nrval, ncval) + "!");
		}

		//if command involves adding or removing a piece we need to include that here...
		let epc = mpc.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
		const useshort = false;
		let delcmd = ChessPiece.genLongOrShortHandDeleteCommand(epc,
			"the enemy pawn must not be null!", true, useshort);
		let cmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, "PAWN", crval, ccval,
			nrval, ncval, true, useleft, useshort);
		console.log("cmd = " + cmd);
		return ChessPiece.getShortHandMoves(["" + delcmd, "" + cmd]);//new String[2];
	}
	
	//COLOR DIR_STRING CASTLE:
	//COLOR CASTLE at: START_LOC_STRING to: END_LOC_STRING
	//COLOR KING at: START_LOC_STRING to: END_LOC_STRING
	static genCastlingMoveToCommand(clr, useleft, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");

		//WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
		//WLCE: (DISPLAY TO USER ONLY)
		//WCEA8TOD8
		//WKGE8TOC8
		
		const dirstr = ((useleft) ? "LEFT" : "RIGHT");
		if (ChessPiece.canSideCastleLeftOrRight(useleft, clr, gid, ignorelist, addpcs));
		else ChessPiece.cc.logAndThrowNewError("" + clr + " CANNOT CASTLE " + dirstr + "!");
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let mkg = ChessPiece.getCurrentSideKing(clr, allpcs);
		const ncol = ((useleft) ? 0 : 7);
		let clcp = ChessPiece.getPieceAt(mkg.getRow(), ncol, allpcs);
		let ncloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, clr,
			gid, ignorelist, addpcs);
		const useshort = false;
		let ccmvcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, "CASTLE",
			clcp.getRow(), clcp.getCol(), ncloc[0], ncloc[1], false, false, useshort);
			//usedir, useleft, useshort
		console.log("ccmvcmd = " + ccmvcmd);
		let nkgloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, clr,
			gid, ignorelist, addpcs);
		let kgmvcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, "KING",
			mkg.getRow(), mkg.getCol(), nkgloc[0], nkgloc[1], false, false, useshort);
			//usedir, useleft, useshort
		console.log("kgmvcmd = " + kgmvcmd);
		let mvcmd = ["" + clr + " " + dirstr + " CASTLE:", "" + ccmvcmd, "" + kgmvcmd];
		return ChessPiece.getShortHandMoves(mvcmd);//new String[3];
	}
	
	
	//MAIN HINTS METHODS SIMILAR TO GEN MOVE TO
	
	//result array will only have one item on it
	static genHintsCommandForPiece(clr, tp, crval, ccval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeAnInteger(crval, "crval");
		ChessPiece.cc.letMustBeAnInteger(ccval, "ccval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");

		//HINTS NOTATION:
		//COLOR TYPE at: STRINGLOC HINTS
		//WPNA5HINTS
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let mpc = ChessPiece.getPieceAt(crval, ccval, allpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(mpc))
		{
			ChessPiece.cc.logAndThrowNewError("there must be a piece at the location!");
		}
		else
		{
			if (mpc.getColor() === clr && mpc.getType() === tp);
			else
			{
				ChessPiece.cc.logAndThrowNewError("piece obtained does not match the color " +
					"and-or the type!");
			}
		}
		let cmd = ChessPiece.genLongOrShortHandHintsCommandForPieceOrSide(clr, tp, crval, ccval,
			false, false);
		console.log("cmd = " + cmd);
		return ChessPiece.getShortHandMoves(["" + cmd]);//new String[1];
	}
	static genHintsCommandForPieceMain(clr, tp, loc, gid, ignorelist=null, addpcs=null)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(loc) || loc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess " +
				"piece location!");
		}
		else
		{
			return ChessPiece.genHintsCommandForPiece(clr, tp, loc[0], loc[1], gid,
				ignorelist, addpcs);
		}
	}
	static genHintsCommandForGivenPiece(cp, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(cp, "cp");

		return ChessPiece.genHintsCommandForPiece(cp.getColor(), cp.getType(), cp.getRow(),
			cp.getCol(), cp.getGameID(), ignorelist, addpcs);
	}
	genHintsCommandForPiece(ignorelist=null, addpcs=null)
	{
		return ChessPiece.genHintsCommandForPiece(this, ignorelist, addpcs);
	}
	
	//result array will only have one item on it
	static genHintsCommandForSide(clr)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");

		let cmd = ChessPiece.genLongOrShortHandHintsCommandForPieceOrSide(clr, null, -1, -1,
			true, false);
		console.log("cmd = " + cmd);
		return ChessPiece.getShortHandMoves(["" + cmd]);//new String[1];
	}
	static genHintsCommandForWhite()
	{
		return ChessPiece.genHintsCommandForSide("WHITE");
	}
	static genHintsCommandForBlack()
	{
		return ChessPiece.genHintsCommandForSide("BLACK");
	}
	genHintsCommandForSide()
	{
		return ChessPiece.genHintsCommandForSide(this.getColor());
	}
	
	//result array will only have one item on it
	static getFullResignationCommand(clr)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");

		let cmd = ChessPiece.genLongOrShortHandResignCommand(clr, false);
		console.log("cmd = " + cmd);
		return ChessPiece.getShortHandMoves(["" + cmd]);//new String[1];
	}
	
	//result array will only have one item on it
	static getFullTieCommand(clr, val, useshort)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeBoolean(val, "tieval");
		ChessPiece.cc.letMustBeBoolean(useshort, "useshort");

		let cmd = ChessPiece.genLongOrShortHandTieDesireCommand(clr, val, useshort);
		console.log("cmd = " + cmd);
		return ChessPiece.getShortHandMoves(["" + cmd]);//new String[1];
	}
	
	
	//COMMAND TYPE METHODS
	
	static getTypeOfMoveCommand(usrcmd)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(usrcmd) || usrcmd.length < 2)
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
		}
		//else;//do nothing
		if (usrcmd.charAt(0) === '+') return "CREATE";
		else if (usrcmd.charAt(0) === '-') return "DELETE";
		else if (usrcmd.charAt(0) === 'S') return "TIEDESIRE";
		else if (0 < usrcmd.indexOf("RESIGNS") && usrcmd.indexOf("RESIGNS") < usrcmd.length &&
			(usrcmd.length === 8 || usrcmd.length === 13))
		{
			return "RESIGN";
		}
		else if (usrcmd.charAt(1) === 'L' || usrcmd.charAt(1) === 'R')
		{
			if (usrcmd.charAt(2) === 'P') return "PAWNING";
			else return "CASTLEING";
		}
		else if (usrcmd.charAt(0) === 'T') return "PROMOTION";
		else if (usrcmd.indexOf("TO") === 5 || usrcmd.indexOf("TO") === 3) return "MOVE";
		else if (usrcmd.indexOf("HINTS") === 5 || usrcmd.indexOf("HINTS") === 1) return "HINTS";
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
		}
	}
	
	static getOverallTypeOfCommand(mycmd)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(mycmd, "mycmd");

		let tps = mycmd.map(mcmd => ChessPiece.getTypeOfMoveCommand(mcmd));
		//new String[mycmd.length];
		const mysmtps = ["CASTLEING", "PAWNING", "PROMOTION", "HINTS", "RESIGN", "TIEDESIRE"];
		for (let x = 0; x < mycmd.length; x++)
		{
			if (ChessPiece.itemIsOnGivenList(tps[x], mysmtps)) return "" + tps[x];
			//else;//do nothing
		}
		for (let x = 0; x < mycmd.length; x++)
		{
			if (tps[x] === "MOVE") return "" + tps[x];
			//else;//do nothing
		}
		if (tps.length === 1) return "" + tps[0];
		else ChessPiece.cc.logAndThrowNewError("ILLEGAL COMMAND TYPE FOUND AND USED HERE!");
	}
	
	static getMoveCommandTypes()
	{
		return ["MOVE", "CASTLEING", "PAWNING", "PROMOTION"];
	}
	static isCommandTypeAMoveCommand(cmdtp)
	{
		return ChessPiece.itemIsOnGivenList(cmdtp, ChessPiece.getMoveCommandTypes());
	}
	
	static getSideColorOrTypesForMoves(mymvs, usecolor)
	{
		ChessPiece.cc.letMustBeBoolean(usecolor, "usecolor");
		
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
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mymvs)) return null;
		else
		{
			console.log("mymvs = ", mymvs);

			let myclrs = [];//new String[mymvs.length];
			let mytps = [];//new String[mymvs.length];
			for (let n = 0; n < mymvs.length; n++)
			{
				mytps.push(null);
				myclrs.push(null);
				console.log("mymvs[" + n + "] = ", mymvs[n]);

				if (ChessPiece.cc.isStringEmptyNullOrUndefined(mymvs[n]))
				{
					continue;
				}
				//else;//do nothing

				let mytpsforcmd = mymvs[n].map((mvftp) => ChessPiece.getTypeOfMoveCommand(mvftp));
				//let mytpsforcmd = new String[mymvs[n].length];
				let addedtp = false;
				let pci = -1;
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(mytpsforcmd) ||
					3 < mytpsforcmd.length)
				{
					ChessPiece.cc.logAndThrowNewError("the type was an illegal length!");
				}
				else
				{
					if (mytpsforcmd.length === 1)
					{
						mytps[n] = "" + mytpsforcmd[0];
						pci = 0;
						addedtp = true;
					}
					else
					{
						for (let x = 0; x < mytpsforcmd.length; x++)
						{
							if (mytpsforcmd[x] === "PAWNING" || mytpsforcmd[x] === "CASTLEING" ||
								mytpsforcmd[x] === "HINTS")
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
					//GIVEN TYPES OF STEPS FOR ONE MOVE COMMAND: DELETE MOVE PROMOTE ->
					//WHAT IS THE OVERALL TYPE?
					//IT WILL NEVER BE DELETE. WE WILL USE PROMOTION OVER MOVE.
					for (let x = 0; x < mytpsforcmd.length; x++)
					{
						//console.log("mytpsforcmd[" + x + "] = " + mytpsforcmd[x]);
						if (mytpsforcmd[x] === "PROMOTION")
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
							if (mytpsforcmd[x] === "MOVE")
							{
								mytps[n] = "MOVE";
								addedtp = true;
								mvi = x;
								break;
							}
							//else;//do nothing
						}
						
						if (addedtp);
						else
						{
							ChessPiece.cc.logAndThrowNewError("AN INVALID TYPE OR INVALID " +
								"COMMAND WAS FOUND HERE!");
						}
					}
				}
				
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(mytps[n]))
				{
					ChessPiece.cc.logAndThrowNewError("the type must have already been set!");
				}
				else
				{
					//console.log("mytps[" + n + "] = " + mytps[n]);
					let clrzeroimytps = ["CASTLEING", "PAWNING", "HINTS", "MOVE", "RESIGN"];
					let clrci = -1;
					if (ChessPiece.itemIsOnGivenList(mytps[n], clrzeroimytps)) clrci = 0;
					else clrci = 1;//promotion
					myclrs[n] = ChessPiece.getLongHandColor("" + mymvs[n][mvi].charAt(clrci));
					//console.log("myclrs[" + n + "] = " + myclrs[n]);
				}
			}//end of n for loop
			return ((usecolor) ? myclrs : mytps);
		}
	}
	static getSideColorsForMoves(mymvs)
	{
		return ChessPiece.getSideColorOrTypesForMoves(mymvs, true);
	}
	static getSideTypesForMoves(mymvs)
	{
		return ChessPiece.getSideColorOrTypesForMoves(mymvs, false);
	}
	
	
	//MAIN GEN MOVE TO COMMAND METHODS
	
	static genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist=null,
		addpcs=null, ptpval="QUEEN", usecslingasmv=false, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(crval, "crval");
		ChessPiece.cc.letMustBeAnInteger(ccval, "ccval");
		ChessPiece.cc.letMustBeAnInteger(nrval, "nrval");
		ChessPiece.cc.letMustBeAnInteger(ncval, "ncval");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clr, "clr");
		ChessPiece.cc.letMustBeDefinedAndNotNull(tp, "tp");
		ChessPiece.cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");
		ChessPiece.cc.letMustBeBoolean(usecslingasmv, "usecslingasmv");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");

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
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		let mpc = ChessPiece.getPieceAt(crval, ccval, allpcs);
		if (ChessPiece.cc.isItemNullOrUndefined(mpc))
		{
			ChessPiece.cc.logAndThrowNewError("there must be a piece at the location!");
		}
		//cannot handle special moves if called with certain pieces it might recognize a
		//special move is possible
		//to detect a special move, we need to get the generic move set, and the full move set,
		//the difference is the special set
		if (mpc.canMoveTo(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
		{
			if ((mpc.getType() === "CASTLE" && usecslingasmv) ||
				mpc.isMoveToASpecialMove(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
			{
				console.log("MOVE IS A SPECIAL MOVE!");
				if (mpc.getType() === "KING" || (mpc.getType() === "CASTLE" &&
					usecslingasmv))
				{
					console.log("WE ARE CASTLING!");
					
					let useleft = false;
					if (mpc.getType() === "KING") useleft = (ncval < ccval);
					else
					{
						//(mpc.getType() === "CASTLE" && usecslingasmv)
						//we called it on a castle and told it we want to castle
						//there are two castles for each side
						//if the castle is left of the king it will be left
						//if the castle is right of the king it will be right
						let mkg = mpc.getMySideKing();
						useleft = (mpc.getCol() < mkg.getCol());
					}
					console.log("useleft = " + useleft);
					
					return ChessPiece.genCastlingMoveToCommand(clr, useleft, gid, ignorelist,
						addpcs);
				}
				else if (mpc.getType() === "PAWN")
				{
					return ChessPiece.genPawningMoveToCommand(clr, crval, ccval, nrval,
						ncval, gid, ignorelist, addpcs, bpassimnxtmv);
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("THIS PIECE TYPE (" + mpc.getType() +
						") HAS NO SPECIAL MOVES!");
				}
			}
			//else;//do nothing safe to proceed
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("" + mpc + " CANNOT MOVE TO " +
				ChessPiece.getLocString(nrval, ncval) + "!");
		}
		let canpropawn = ChessPiece.canPawnBePromotedAt(nrval, ncval, mpc.getColor(),
			mpc.getType());
		console.log("canpropawn = " + canpropawn);
		
		//if command involves adding or removing a piece we need to include that here...
		let ecp = ChessPiece.getPieceAt(nrval, ncval, allpcs);
		let usedelcmd = true;
		const useshort = false;
		let delcmd = ChessPiece.genLongOrShortHandDeleteCommand(ecp, null, false, useshort);
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(delcmd)) usedelcmd = false;
		//else;//do nothing
		let cmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(clr, tp, crval, ccval,
			nrval, ncval, false, false, useshort);
		console.log("cmd = " + cmd);
		
		const mxcnt = ((usedelcmd) ? ((canpropawn) ? 3 : 2) : ((canpropawn) ? 2 : 1));
		let mvcmd = [];//new String[mxcnt];
		let propwncmd = null;
		if (canpropawn)
		{
			propwncmd = ChessPiece.genLongOrShortHandPawnPromotionCommand(mpc.getColor(), nrval,
				ncval, ptpval, useshort);
		}
		//else;//do nothing
		if (usedelcmd)
		{
			mvcmd.push("" + delcmd);
			mvcmd.push("" + cmd);
			if (canpropawn) mvcmd.push("" + propwncmd);
			//else;//do nothing
		}
		else
		{
			mvcmd.push("" + cmd);
			if (canpropawn) mvcmd.push("" + propwncmd);
			//else;//do nothing
		}
		if (mvcmd.length === mxcnt);
		else ChessPiece.cc.logAndThrowNewError("mvcmd does not have the correct size!");
		return ChessPiece.getShortHandMoves(mvcmd);
		//return ChessPiece.convertAllShortHandMovesToLongVersion(
		//	ChessPiece.getShortHandMoves(mvcmd));
	}
	static genMoveToCommandMain(clr, tp, cloc, nloc, gid,
		ignorelist=null, addpcs=null, ptpval="QUEEN", usecslingasmv=false, bpassimnxtmv=false)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(cloc) || cloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the current chess piece " +
				"location!");
		}
		//else;//do nothing
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(nloc) || nloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess piece " +
				"location!");
		}
		//else;//do nothing
		
		return ChessPiece.genMoveToCommand(clr, tp, cloc[0], cloc[1], nloc[0], nloc[1], gid,
			ignorelist, addpcs, ptpval, usecslingasmv, bpassimnxtmv);
	}
	static genMoveToCommandVIACP(cp, nrval, ncval, gid, ignorelist=null, addpcs=null,
		ptpval="QUEEN", usecslingasmv=false, bpassimnxtmv=false)
	{
		if (ChessPiece.cc.isItemNullOrUndefined(cp))
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the current chess piece " +
				"location and the new location!");
		}
		else
		{
			return ChessPiece.genMoveToCommand(cp.getColor(), cp.getType(), cp.getRow(),
				cp.getCol(), nrval, ncval, gid, ignorelist, addpcs, ptpval, usecslingasmv,
				bpassimnxtmv);
		}
	}
	static genMoveToCommandMainVIACP(cp, nloc, gid, ignorelist=null, addpcs=null, ptpval="QUEEN",
		usecslingasmv=false, bpassimnxtmv=false)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(nloc) || nloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess piece " +
				"location!");
		}
		else
		{
			return ChessPiece.genMoveToCommandVIACP(cp, nloc[0], nloc[1], gid, ignorelist,
				addpcs, ptpval, usecslingasmv, bpassimnxtmv);
		}
	}
	static genMoveToCommandNoListsVIACP(cp, nloc, gid, ptpval="QUEEN",
		usecslingasmv=false, bpassimnxtmv=false)
	{
		return ChessPiece.genMoveToCommandMainVIACP(cp, nloc, gid, null, null, ptpval,
			usecslingasmv, bpassimnxtmv);
	}
	static genMoveToCommandNoListsMainVIACP(cp, nloc, gid, usecslingasmv=false,
		bpassimnxtmv=false)
	{
		return ChessPiece.genMoveToCommandNoListsVIACP(cp, nloc, gid, null, null, "QUEEN",
			usecslingasmv, bpassimnxtmv);
	} 
	//non-static version convenience method
	genMoveToCommandFromMe(nloc, ignorelist=null, addpcs=null, ptpval="QUEEN",
		usecslingasmv=false, bpassimnxtmv=false)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(nloc) || nloc.length != 2)
		{
			ChessPiece.cc.logAndThrowNewError("You need to provide the next chess piece " +
				"location!");
		}
		else
		{
			return ChessPiece.genMoveToCommandMainVIACP(this, nloc, this.getGameID(), ignorelist,
				addpcs, ptpval, usecslingasmv, bpassimnxtmv);
		}
	}
	genMoveToCommandFromMeVIALocNoLists(nloc, ptpval="QUEEN", usecslingasmv=false,
		bpassimnxtmv=false)
	{
		return this.genMoveToCommandFromMe(nloc, null, null, ptpval, usecslingasmv,
			bpassimnxtmv);
	}
	genMoveToCommandFromMeVIALocNoListsMain(nloc, usecslingasmv=false, bpassimnxtmv=false)
	{
		return this.genMoveToCommandFromMeVIALocNoLists(nloc, "QUEEN", usecslingasmv,
			bpassimnxtmv);
	}
	genMoveToCommandFromMeMain(nrval, ncval, ignorelist=null, addpcs=null, ptpval="QUEEN",
		usecslingasmv=false, bpassimnxtmv=false)
	{
		return ChessPiece.genMoveToCommandVIACP(this, nrval, ncval, this.getGameID(), ignorelist,
			addpcs, ptpval, usecslingasmv, bpassimnxtmv);
	}
	genMoveToCommandFromMeNoLists(nrval, ncval, ptpval="QUEEN", usecslingasmv=false,
		bpassimnxtmv=false)
	{
		return this.genMoveToCommandFromMeMain(nrval, ncval, null, null, ptpval,
			usecslingasmv, bpassimnxtmv);
	}
	genMoveToCommandFromMeNoListsMain(nrval, ncval, usecslingasmv=false, bpassimnxtmv=false)
	{
		return this.genMoveToCommandFromMeNoLists(nrval, ncval, "QUEEN", usecslingasmv,
			bpassimnxtmv);
	}

	
	//UNDO OR REDO COMMANDS
	
	static genUndoMoveToCommandForMoveCommand(mvcmdonly, redoit)
	{
		ChessPiece.cc.letMustBeBoolean(redoit, "redoit");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmdonly) ||
			mvcmdonly.length < 9 || 10 < mvcmdonly.length)
		{
			ChessPiece.cc.logAndThrowNewError("illegal move or pawning command found and " +
				"used here!");
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
		if (mvcmdonly.charAt(1) === 'L' || mvcmdonly.charAt(1) === 'R') si = 4;//handle pawning
		else si = 3;//handle normal moveto
		let myretstr = ((redoit) ? "" : "UNDO");
		myretstr += mvcmdonly.substring(0, si) + mvcmdonly.substring(si + 4) +
			mvcmdonly.substring(si + 2, si + 4) + mvcmdonly.substring(si, si + 2);
		return myretstr;
	}
	
	static genUndoMoveToCommandForCreateDeleteCommand(cdelmvcmdonly)
	{
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(cdelmvcmdonly) ||
			cdelmvcmdonly.length < 10 || 12 < cdelmvcmdonly.length)
		{
			console.log("cdelmvcmdonly = " + cdelmvcmdonly);
			ChessPiece.cc.logAndThrowNewError("illegal create or delete command found and " +
				"used here!");
		}
		//else;//do nothing
		
		if (cdelmvcmdonly.charAt(0) === '+' || cdelmvcmdonly.charAt(0) === '-')
		{
			//EXPECTED FORMAT FOR A DELETE OR CREATE COMMAND:
			//-BPWN??W?MVS
			//+BPWN??W?MVS
			//-BPNA6W2MS
			//0123456789
			const mc = ((cdelmvcmdonly.charAt(0) === '+') ? "-" : "+");
			return "" + mc + cdelmvcmdonly.substring(1);
		}
		else
		{
			console.log("cdelmvcmdonly = " + cdelmvcmdonly);
			ChessPiece.cc.logAndThrowNewError("illegal create or delete command found and " +
				"used here!");
		}
	}
	
	static genUndoMoveToCommandForPromotionCommand(promvcmdonly, redoit)
	{
		ChessPiece.cc.letMustBeBoolean(redoit, "redoit");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(promvcmdonly) || promvcmdonly.length != 12)
		{
			console.log("promvcmdonly = " + promvcmdonly);
			if (ChessPiece.cc.isItemNullOrUndefined(promvcmdonly));
			else console.log("promvcmdonly.length = " + promvcmdonly.length);
			ChessPiece.cc.logAndThrowNewError("illegal promotion command found and used here!");
		}
		//else;//do nothing
		
		//promotion
		//TWPNA1INTOQN
		//012345678901
		//0         1
		let myretstr = ((redoit) ? "" : "UNDO");
		myretstr += promvcmdonly.substring(0, 2) + promvcmdonly.substring(10) +
			promvcmdonly.substring(4, 10) + promvcmdonly.substring(2, 4);
		return myretstr;
	}
	
	static genUndoMoveToCommandForResignationCommand(mvcmdonly, redoit)
	{
		ChessPiece.cc.letMustBeBoolean(redoit, "redoit");
		ChessPiece.cc.letMustBeDefinedAndNotNull(mvcmdonly, "mvcmdonly");
		
		return ((redoit) ? "" + mvcmdonly : "UNDO" + mvcmdonly);
	}
	
	static genUndoMoveToCommandForTieDesireCommand(mvcmdonly, redoit)
	{
		ChessPiece.cc.letMustBeBoolean(redoit, "redoit");
		ChessPiece.cc.letMustBeDefinedAndNotNull(mvcmdonly, "mvcmdonly");
		
		let fpart = mvcmdonly.substring(0, mvcmdonly.length - 1);
		let valstr = null;
		if (mvcmdonly.charAt(mvcmdonly.length - 1) === '0') valstr = "1";
		else if (mvcmdonly.charAt(mvcmdonly.length - 1) === '1') valstr = "0";
		else ChessPiece.cc.logAndThrowNewError("invalid value found and used here!");
		return fpart + valstr;
	}
	
	//MAIN UNDO COMMAND METHODS
	
	static genUndoMoveToShortHandCommand(mvcmd, redoit=false, remundo=false)
	{
		ChessPiece.cc.letMustBeBoolean(redoit, "redoit");
		ChessPiece.cc.letMustBeBoolean(remundo, "remundo");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmd)) return null;
		
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
		//UNDOWKGE8TOC8 (decrements the move count for the king only because we only
		//incremented that for the king)
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
		
		let undomvs = [];//new String[mvcmd.length];
		for (let x = 0; x < mvcmd.length; x++) console.log("mvcmd[" + x + "] = " + mvcmd[x]);
		if (redoit && remundo)
		{
			for (let x = 0; x < mvcmd.length; x++)
			{
				if (mvcmd[x].indexOf("UNDO") === 0) undomvs.push(mvcmd[x].substring(4));
				else undomvs.push("" + mvcmd[x]);
			}
			return ChessPiece.genUndoMoveToShortHandCommand(undomvs, redoit, false);
		}
		//else;//do nothing
		if (mvcmd.length === 3)
		{
			//castling or capture and promotion
			if (mvcmd[0] === "WLCE:" || mvcmd[0] === "WRCE:" ||
				mvcmd[0] === "BLCE:" || mvcmd[0] === "BRCE:")
			{
				//castling
				for (let x = 0; x < mvcmd.length; x++)
				{
					if (x === 0)
					{
						if (redoit) undomvs.push("" + mvcmd[x]);
						else undomvs.push("UNDO" + mvcmd[x]);
					}
					else
					{
						undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[x],
							redoit));
					}
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
					undomvs.push(ChessPiece.genUndoMoveToCommandForCreateDeleteCommand(mvcmd[2]));
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForPromotionCommand(mvcmd[0],
						redoit));
				}
				else
				{
					//undoit demote move back uncapture order is used
					undomvs.push(ChessPiece.genUndoMoveToCommandForPromotionCommand(mvcmd[2],
						redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]));
				}
			}
		}
		else if (mvcmd.length === 2)
		{
			//move and promote or
			//some sort of capture was involved
			//swap the order
			const sai = ((redoit) ? 1 : 0);
			if (mvcmd[sai].charAt(0) === '+' || mvcmd[sai].charAt(0) === '-')
			{
				if (redoit)
				{
					undomvs.push(ChessPiece.genUndoMoveToCommandForCreateDeleteCommand(mvcmd[1]));
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit));
				}
				else
				{
					//undoit
					//capture
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]));
				}
			}
			else
			{
				if (redoit)
				{
					//move and promote order is used
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[1], redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForPromotionCommand(mvcmd[0],
						redoit));
				}
				else
				{
					//undoit
					//move and promote -> demote then move back order is used
					undomvs.push(ChessPiece.genUndoMoveToCommandForPromotionCommand(mvcmd[1],
						redoit));
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit));
				}
			}
		}
		else if (mvcmd.length === 1)
		{
			if (mvcmd[0].charAt(0) === '+' || mvcmd[0].charAt(0) === '-')
			{
				undomvs.push(ChessPiece.genUndoMoveToCommandForCreateDeleteCommand(mvcmd[0]));
			}
			else if (mvcmd[0].charAt(0) === 'T')
			{
				undomvs.push(ChessPiece.genUndoMoveToCommandForPromotionCommand(
					mvcmd[0], redoit));
			}
			else
			{
				//add undo in front of it for starters
				//it will most likely be a move to command
				//might be pawning or changing types
				let cmdtp = ChessPiece.getTypeOfMoveCommand(mvcmd[0]);
				if (cmdtp === "RESIGN")
				{
					undomvs.push(ChessPiece.genUndoMoveToCommandForResignationCommand(mvcmd[0],
						redoit));
				}
				else if (cmdtp === "TIEDESIRE")
				{
					undomvs.push(ChessPiece.genUndoMoveToCommandForTieDesireCommand(mvcmd[0],
						redoit));
				}
				else
				{
					undomvs.push(ChessPiece.genUndoMoveToCommandForMoveCommand(mvcmd[0], redoit));
				}
			}
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("illegal number of commands found and used " +
				"here! Everything must be executed as one command!");
		}
		for (let x = 0; x < undomvs.length; x++)
		{
			console.log("undomvs[" + x + "] = " + undomvs[x]);
		}
		if (undomvs.length === mvcmd.length) return undomvs;
		else ChessPiece.cc.logAndThrowNewError("undomvs does not have the correct size!");
	}
	static genUndoMoveToLongHandCommand(mvcmd, redoit=false, remundo=false)
	{
		return ChessPiece.convertAllShortHandMovesToLongVersion(
			ChessPiece.genUndoMoveToShortHandCommand(ChessPiece.getShortHandMoves(mvcmd),
				redoit, remundo));
	}
	//redo calls undo
	static genRedoMoveToLongHandCommand(mvcmd)
	{
		return ChessPiece.genUndoMoveToLongHandCommand(mvcmd, true, true);
	}
	static genRedoMoveToShortHandCommand(mvcmd)
	{
		return ChessPiece.genUndoMoveToShortHandCommand(mvcmd, true, true);
	}
	
	
	//GEN FULL MOVE COMMAND FROM DISPLAYED COMMAND METHODS
	
	//TAKES A SIMPLIFIED VERSION OF THE COMMAND AND FULLY EXPANDS IT TO INCLUDE ALL THE STEPS
	//RETURNS SHORTHAND VERSION ONLY
	
	//ONLY CONVERTS COMMANDS IN SHORT HAND NOTATION
	static genFullMoveCommandFromDisplayedCommand(usrcmd, gid, ptpval="QUEEN", ignorelist=null,
		addpcs=null, iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(usrcmd, "usrcmd");
		ChessPiece.cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		
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
		if (usrcmd === "UNDO")
		{
			//get the unofficial move
			//if unofficial move is empty we want to take the last official move and
			//make it unofficial
			//then take the unofficial move and generate the command to undo it...
			//then we need to generate the full undo commands
			//let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
			return ChessPiece.getGameVIAGID(gid).genCommandToUndoLastMadeMove();
		}
		else if (usrcmd === "REDO")
		{
			return ChessPiece.getGameVIAGID(gid).genCommandToRedoLastUndoneMove();
		}
		//else;//do nothing safe to proceed
		
		let cmdtp = ChessPiece.getTypeOfMoveCommand(usrcmd);
		console.log("cmdtp = " + cmdtp);
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		if (cmdtp === "HINTS" || cmdtp === "CREATE" || cmdtp === "DELETE" ||
			cmdtp === "PROMOTION")
		{
			let si = -1;
			let ei = -1;
			let resstr = [];//new String[1];
			if (cmdtp === "HINTS")
			{
				if (usrcmd.length === 6)
				{
					resstr.push("" + usrcmd);
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
			
			let slocstr = usrcmd.substring(si, ei);
			console.log("OLD slocstr = " + slocstr);
			
			let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
			console.log("sloc[0] = " + sloc[0]);
			console.log("sloc[1] = " + sloc[1]);
			
			slocstr = ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
			console.log("NEW slocstr = " + slocstr);
			
			let nwusrcmd = usrcmd.substring(0, si) + slocstr + usrcmd.substring(ei);
			console.log("nwusrcmd = " + nwusrcmd);
			
			resstr.push("" + nwusrcmd);
			console.log("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp === "RESIGN")
		{
			let resstr = ["" + usrcmd];// new String[1];
			console.log("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp === "PAWNING")
		{
			let myclr = "" + usrcmd.charAt(0);
			let fullclr = ChessPiece.getLongHandColor(myclr);
			const useleft = (usrcmd.charAt(1) === 'L');
			let slocstr = usrcmd.substring(4, 6);
			let sloc = null;
			let nwusrcmd = null;
			console.log("OLD slocstr = " + slocstr);
			
			//BLPNB5TOA6
			//BLPNTOA6
			//0123456789
			
			if (usrcmd.indexOf("TO") === 4)
			{
				//need to get the starting location
				let elocstr = usrcmd.substring(6);
				//calculate sloc from eloc;
				let eloc = ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown);
				console.log("myclr = " + myclr);
				console.log("mytp = PAWN");
				console.log("elocstr = " + elocstr);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				
				sloc = ChessPiece.getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr,
					"PAWN", gid, ignorelist, addpcs, false, bpassimnxtmv);
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(sloc))
				{
					ChessPiece.cc.logAndThrowNewError("THERE MUST BE A STARTING LOCATION " +
						"IN ORDER FOR PAWN TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
					ChessPiece.WHITE_MOVES_DOWN_RANKS);
				console.log("NEW slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 4) + slocstr + usrcmd.substring(4, 6) + 
					ChessPiece.convertRowColToStringLoc(eloc[0], eloc[1],
						ChessPiece.WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			else sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
			console.log("sloc[0] = " + sloc[0]);
			console.log("sloc[1] = " + sloc[1]);
			
			let cp = ChessPiece.getPieceAt(sloc[0], sloc[1], allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp))
			{
				ChessPiece.cc.logAndThrowNewError("the current pawn must not be null!");
			}
			else
			{
				if (cp.getType() === "PAWN" && cp.getColor() === fullclr);
				else
				{
					ChessPiece.cc.logAndThrowNewError("the current pawn was not of the " +
						"correct type and color!");
				}
			}
			
			if (cp.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
			else ChessPiece.cc.logAndThrowNewError("you cannot pawn!");
			
			let ep = cp.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
			if (ChessPiece.cc.isItemNullOrUndefined(ep))
			{
				ChessPiece.cc.logAndThrowNewError("the enemy pawn must not be null!");
			}
			else
			{
				if (ep.getType() === "PAWN" &&
					ep.getColor() === ChessPiece.getOppositeColor(fullclr))
				{
					//do nothing
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("the enemy pawn was not of the correct " +
						"type and color!");
				}
			}
			
			let delcmd = ChessPiece.genLongOrShortHandDeleteCommand(ep,
				"the enemy pawn must not be null!", true, true);
			let resstr = [];//new String[2];
			resstr.push("" + delcmd);
			if (ChessPiece.cc.isStringEmptyNullOrUndefined(nwusrcmd)) resstr.push("" + usrcmd);
			else resstr.push("" + nwusrcmd);
			console.log("resstr[0] = " + resstr[0]);
			console.log("resstr[1] = " + resstr[1]);
			return resstr;
		}
		else if (cmdtp === "CASTLEING")
		{
			let resstr = [];//new String[3];
			resstr.push("" + usrcmd);
			//need to generate the two move to commands
			let myclr = "" + usrcmd.charAt(0);
			let fullclr = ChessPiece.getLongHandColor(myclr);
			const useleft = (usrcmd.charAt(1) === 'L');
			const mccol = ((useleft) ? 0 : 7);
			let mkg = ChessPiece.getCurrentSideKing(fullclr, allpcs);
			if (ChessPiece.canSideCastleLeftOrRight(useleft, fullclr, gid, ignorelist, addpcs));
			else ChessPiece.cc.logAndThrowNewError("CANNOT CASTLE!");
			
			if (mkg.getCol() === 4 && (mkg.getRow() === 7 || mkg.getRow() === 0));
			else
			{
				ChessPiece.cc.logAndThrowNewError("CANNOT CASTLE! KING IS NOT AT THE CORRECT " +
					"POSITION!");
			}
			let ncsloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false,
				fullclr, gid, ignorelist, addpcs);
			//console.log("ncsloc[0] = " + ncsloc[0]);
			//console.log("ncsloc[1] = " + ncsloc[1]);
			let cslcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyString(fullclr, "CASTLE",
				mkg.getRow(), mccol, ncsloc[0], ncsloc[1], false, false, true);
			let nkgloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true,
				fullclr, gid, ignorelist, addpcs);
			//console.log("nkgloc[0] = " + nkgloc[0]);
			//console.log("nkgloc[1] = " + nkgloc[1]);
			let kgcmd = ChessPiece.genLongOrShortHandMoveCommandOnlyStringMain(mkg, nkgloc[0],
				nkgloc[1], false, false, "THE KING MUST NOT BE NULL!", true, true);
			resstr.push("" + cslcmd);
			resstr.push("" + kgcmd);
			console.log("resstr[0] = " + resstr[0]);
			console.log("resstr[1] = " + resstr[1]);
			console.log("resstr[2] = " + resstr[2]);
			return resstr;
		}
		else if (cmdtp === "MOVE")
		{
			//need to determine if the move is actually a special move
			//need to determine if the move results in a capture
			//need to determine if the move results in a pawn getting promoted
			
			//if type is not a pawn, then no promotion
			//see if it is a pawn and the move is a special move
			//-if so, then it is pawning...
			//-if it is pawning convert it to pawning format and return that result instead
			//-need to insert the direction in between the color and the rest of the move to
			//--command
			
			//static ChessPiece.canPawnBePromotedAt(let nrval, let ncval, String clrval,
			//	String tpval)
			//non-static ChessPiece.isMoveToASpecialMove(let nrval, let ncval,
			//	int[][] ignorelist, ArrayList<ChessPiece> addpcs)
			//if type is king, and we can determine that the move is a special move,
			//then convert it to castling notation
			
			let myclr = "" + usrcmd.charAt(0);
			let mytp = usrcmd.substring(1, 3);
			let fullclr = ChessPiece.getLongHandColor(myclr);
			let slocstr = null;
			let elocstr = null;
			let nwusrcmd = null;
			let sloc = null;
			let eloc = null;
			let esi = -1;
			if (usrcmd.indexOf("TO") === 3)
			{
				elocstr = usrcmd.substring(5);
				//calculate sloc from eloc;
				eloc = ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown);
				console.log("myclr = " + myclr);
				console.log("mytp = " + mytp);
				console.log("elocstr = " + elocstr);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				//console.log("ignorelist = " , ignorelist);
				//console.log("addpcs = " , addpcs);

				sloc = ChessPiece.getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr,
					ChessPiece.getLongHandType(mytp), gid, ignorelist, addpcs, false,
						bpassimnxtmv);
				
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(sloc))
				{
					ChessPiece.cc.logAndThrowNewError("THERE MUST BE A STARTING LOCATION IN " +
						"ORDER FOR " + ChessPiece.getLongHandType(mytp) + " TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
					ChessPiece.WHITE_MOVES_DOWN_RANKS);
				console.log("slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 3) + slocstr + usrcmd.substring(3, 5) +
					ChessPiece.convertRowColToStringLoc(eloc[0], eloc[1],
						ChessPiece.WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			else
			{
				slocstr = usrcmd.substring(3, 5);
				elocstr = usrcmd.substring(7);
				console.log("slocstr = " + slocstr);
				console.log("elocstr = " + elocstr);
				
				eloc = ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown);
				sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
				console.log("sloc[0] = " + sloc[0]);
				console.log("sloc[1] = " + sloc[1]);
				console.log("eloc[0] = " + eloc[0]);
				console.log("eloc[1] = " + eloc[1]);
				
				nwusrcmd = usrcmd.substring(0, 3) +
					ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
						ChessPiece.WHITE_MOVES_DOWN_RANKS) +
					usrcmd.substring(5, 7) +
					ChessPiece.convertRowColToStringLoc(eloc[0], eloc[1],
						ChessPiece.WHITE_MOVES_DOWN_RANKS);
				console.log("nwusrcmd = " + nwusrcmd);
			}
			
			//console.log("gid = " + gid);
			
			let cp = ChessPiece.getPieceAt(sloc[0], sloc[1], allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(cp))
			{
				ChessPiece.cc.logAndThrowNewError("the current piece must not be null!");
			}
			else
			{
				if (cp.getType() === ChessPiece.getLongHandType(mytp) &&
					cp.getColor() === fullclr)
				{
					//do nothing
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("the current piece was not of the " +
						"correct type and color!");
				}
			}
			
			if (cp.isMoveToASpecialMove(eloc[0], eloc[1], ignorelist, addpcs, bpassimnxtmv))
			{
				//determine if it is castling or pawning
				//need the direction
				//then can generate the correct command
				//then call this method with the correct command
				const usecsling = (cp.getType() === "KING");
				const useleft = (eloc[1] < sloc[1]);
				const dirstr = ((useleft) ? "L" : "R");
				const nwcmd = ((usecsling) ? "" + myclr + dirstr + "CE:" :
					"" + myclr + dirstr + usrcmd.substring(1));
				return ChessPiece.genFullMoveCommandFromDisplayedCommand(nwcmd, gid, ptpval,
					ignorelist, addpcs, iswhitedown, bpassimnxtmv);
			}
			//else;//do nothing safe to proceed
			
			let canpropawn = ChessPiece.canPawnBePromotedAt(eloc[0], eloc[1], fullclr,
				cp.getType());
			let propawncmd = null;
			if (canpropawn)
			{
				//TBPNH8INTOQN
				
				const myvptps = ["QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"];
				let myctpval = null;
				if (ChessPiece.itemIsOnGivenList(ptpval, myvptps))
				{
					if (ptpval === "ROOK") myctpval = "CASTLE";
					else myctpval = "" + ptpval;
					myctpval = ChessPiece.getShortHandType(myctpval);
				}
				else
				{
					const myovptps = ["QN", "BP", "CE", "KT"];
					if (ChessPiece.itemIsOnGivenList(ptpval, myovptps)) myctpval = "" + ptpval;
					else
					{
						ChessPiece.cc.logAndThrowNewError("CANNOT PROMOTE A PAWN TO GIVEN " +
							"TYPE (" + ptpval + ")!");
					}
				}
				
				propawncmd = "T" + usrcmd.substring(0, 3) +
					ChessPiece.convertRowColToStringLoc(eloc[0], eloc[1],
						ChessPiece.WHITE_MOVES_DOWN_RANKS) + "INTO" + myctpval;
				console.log("propawncmd = " + propawncmd);
			}
			//else;//do nothing
			
			//if command involves adding or removing a piece we need to include that here...
			let ecp = ChessPiece.getPieceAt(eloc[0], eloc[1], allpcs);
			let delcmd = null;
			let usedelcmd = true;
			if (ChessPiece.cc.isItemNullOrUndefined(ecp)) usedelcmd = false;
			else
			{
				if (ecp.getColor() === ChessPiece.getOppositeColor(cp.getColor()));
				else
				{
					ChessPiece.cc.logAndThrowNewError("enemy piece must be different than " +
						"our color!");
				}

				delcmd = ChessPiece.genLongOrShortHandDeleteCommand(ecp,
					"the enemy piece must not be null!", true, true);
				console.log("delcmd = " + delcmd);
			}
			
			let mxsz = 1;
			if (usedelcmd) mxsz++;
			if (canpropawn) mxsz++;
			let resstr = [];//new String[mxsz];
			if (usedelcmd)
			{
				resstr.push("" + delcmd);
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(nwusrcmd))
				{
					resstr.push("" + usrcmd);
				}
				else resstr.push("" + nwusrcmd);
				if (canpropawn) resstr.push("" + propawncmd);
			}
			else
			{
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(nwusrcmd))
				{
					resstr.push("" + usrcmd);
				}
				else resstr.push("" + nwusrcmd);
				if (canpropawn) resstr.push("" + propawncmd);
			}
			for (let x = 0; x < mxsz; x++) console.log("resstr[" + x + "] = " + resstr[x]);
			return resstr;
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
		}
	}
	static genFullMoveCommandFromDisplayedCommandMain(usrcmd, gid, ptpval="QUEEN",
		iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, bpassimnxtmv=false)
	{
		return ChessPiece.genFullMoveCommandFromDisplayedCommand(usrcmd, gid, ptpval, null, null,
			iswhitedown, bpassimnxtmv);
	}
	genFullMoveCommandFromDisplayedCommandFromMe(usrcmd, ptpval="QUEEN")
	{
		return ChessPiece.genFullMoveCommandFromDisplayedCommand(usrcmd, this.getGameID(),
			ptpval, null, null, ChessPiece.WHITE_MOVES_DOWN_RANKS, false);
	}
	
	
	static getNewIgnoreListFromCommand(mvcmds, iswhitedown)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmds)) return null;
		else
		{
			let tpcmds = [];//new String[mvcmds.length];
			let numskp = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				tpcmds.push(ChessPiece.getTypeOfMoveCommand(mvcmds[x]));
				if (tpcmds[x] === "HINTS" || tpcmds[x] === "CASTLEING" ||
					tpcmds[x] === "TIEDESIRE" || tpcmds[x] === "RESIGN")
				{
					numskp++;
				}
				//else;//do nothing
			}
			let ignorelist = [];//new int[mvcmds.length - numskp][2];
			let igi = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				let slocstr = null;
				if (tpcmds[x] === "CREATE" || tpcmds[x] === "DELETE")
				{
					//-BPN??W?MS
					//+BPN??W?MS
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
				}
				else if (tpcmds[x] === "PAWNING")
				{
					//PAWNING NOTATION
					//WLPNB4TOA3
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
				}
				else if (tpcmds[x] === "MOVE")
				{
					//MOVE NOTATION
					//WPNB4TOA3
					//012345678
					slocstr = mvcmds[x].substring(3, 5);
				}
				else if (tpcmds[x] === "PROMOTION")
				{
					//PROMOTION NOTATION:
					//TBPNH8INTOQN
					//012345678901
					//0         1
					slocstr = mvcmds[x].substring(4, 6);
				}
				//else;//do nothing
				
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(slocstr));
				else
				{
					let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
					ignorelist.push([sloc[0], sloc[1]]);
					//ignorelist[igi][0] = sloc[0];
					//ignorelist[igi][1] = sloc[1];
					igi++;
				}
			}//end of second x for loop
			if (igi === ignorelist.length && ignorelist.length === mvcmds.length - numskp)
			{
				return ignorelist;
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("illegal number of ignore locs found and " +
					"used here!");
			}
		}
	}
	
	static getNewAddPiecesListFromCommand(mvcmds, oldaddpcs=null, gid, iswhitedown)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmds)) return oldaddpcs;
		else
		{
			let tpcmds = [];//new String[mvcmds.length];
			let numskp = 0;
			for (let x = 0; x < mvcmds.length; x++)
			{
				tpcmds.push(ChessPiece.getTypeOfMoveCommand(mvcmds[x]));
				if (tpcmds[x] === "HINTS" || tpcmds[x] === "CASTLEING" ||
					tpcmds[x] === "TIEDESIRE" || tpcmds[x] === "RESIGN")
				{
					numskp++;
				}
				//else;//do nothing
			}
			
			let addpcs = null;
			let keepit = null;
			let numoldaddpcs = ChessPiece.getNumItemsInList(oldaddpcs);
			if (numoldaddpcs < 1);
			else
			{
				keepit = [];//new let[numoldaddpcs];
				for (let x = 0; x < numoldaddpcs; x++) keepit.push(true);
			}
			
			for (let x = 0; x < mvcmds.length; x++)
			{
				let slocstr = null;
				let elocstr = null;
				if (tpcmds[x] === "DELETE")
				{
					//-BPN??W?MS
					//+BPN??W?MS
					//0123456789
					slocstr = mvcmds[x].substring(4, 6);
					let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
					let fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (let p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs[p].getRow() === sloc[0] &&
								oldaddpcs[p].getCol() === sloc[1])
							{
								fndit = true;
								keepit[p] = false;
								break;
							}
							//else;//do nothing
						}
					}
				}
				else if (tpcmds[x] === "PAWNING" || tpcmds[x] === "MOVE")
				{
					let si = -1;
					if (tpcmds[x] === "PAWNING")
					{
						//PAWNING NOTATION
						//WLPNB4TOA3
						//0123456789
						slocstr = mvcmds[x].substring(4, 6);
						elocstr = mvcmds[x].substring(8);
						si = 2;
					}
					else if (tpcmds[x] === "MOVE")
					{
						//MOVE NOTATION
						//WPNB4TOA3
						//012345678
						slocstr = mvcmds[x].substring(3, 5);
						elocstr = mvcmds[x].substring(7);
						si = 1;
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("THE TYPE MUST BE MOVE OR PAWNING, " +
							"BUT NOW IT IS NOT!");
					}

					let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
					let eloc = ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown);
					//if old piece was on the add list, setLoc to eloc
					//else add it at that loc with at least 2 moves
					
					let fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (let p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs[p].getRow() === sloc[0] &&
								oldaddpcs[p].getCol() === sloc[1])
							{
								fndit = true;
								oldaddpcs[p].setLoc(eloc[0], eloc[1], true);
								//oldaddpcs[p].incrementMoveCount();
								//not sure if we want to do this or not
								break;
							}
							//else;//do nothing
						}
					}
					if (fndit);
					else
					{
						let clrval = ChessPiece.getLongHandColor("" + mvcmds[x].charAt(0));
						let ntpstr = ChessPiece.getLongHandType(mvcmds[x].substring(si, si + 2));
						if (ChessPiece.cc.isItemNullOrUndefined(addpcs)) addpcs = [];
						//new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.push(new ChessPiece(ntpstr, clrval, eloc[0], eloc[1], gid, 1,
							false));
					}
				}
				else if (tpcmds[x] === "PROMOTION" || tpcmds[x] === "CREATE")
				{
					//PROMOTION NOTATION:
					//TBPNH8INTOQN
					//012345678901
					//0         1
					slocstr = mvcmds[x].substring(4, 6);
					let ntpstr = ChessPiece.getLongHandType(mvcmds[x].substring(10));
					let clrval = ChessPiece.getLongHandColor("" + mvcmds[x].charAt(1));
					let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
					//PROMOTION if our piece is on the addlist already, just call setType()
					//if not create the new piece use 1 for the default moves made
					//unless provided
					let initmvcnt = -1;
					let addit = true;
					if (tpcmds[x] === "CREATE")
					{
						let mymvcntstr = mvcmds[x].substring(7, mvcmds[x].indexOf("MS"));
						initmvcnt = Number(mymvcntstr);
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
								if (oldaddpcs[p].getRow() === sloc[0] &&
									oldaddpcs[p].getCol() === sloc[1])
								{
									fndit = true;
									oldaddpcs[p].setType(ntpstr);
									initmvcnt = oldaddpcs[p].getMoveCount();
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
						if (ChessPiece.cc.isItemNullOrUndefined(addpcs)) addpcs = [];
						//new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.push(new ChessPiece(ntpstr, clrval, sloc[0], sloc[1], gid,
							initmvcnt, false));
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
						if (ChessPiece.cc.isItemNullOrUndefined(addpcs)) addpcs = [];
						//new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.push(oldaddpcs[x]);
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
	static genFullMoveCommands(mvcmds, gid, promotps=null,
		iswhitedown, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");

		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmds)) return null;
		
		let myfullcmds = [];//new String[mvcmds.length][];
		let ptpvali = 0;
		let ptpval = "QUEEN";
		let ignorelist = null;
		let addpcs = null;
		for (let x = 0; x < mvcmds.length; x++)
		{
			let canpropawn = false;
			//WCEA5TOA6
			//WCETOA6
			//012345678
			//CTPSS--EE
			ptpval = "QUEEN";
			let clrval = ChessPiece.getLongHandColor("" + mvcmds[x].charAt(0));
			if (mvcmds[x].charAt(1) === 'L' || mvcmds[x].charAt(1) === 'R');
			else
			{
				let cmdtp = ChessPiece.getTypeOfMoveCommand(mvcmds[x]);
				console.log("mvcmds[" + x + "] = " + mvcmds[x]);
				console.log("cmdtp = " + cmdtp);
				
				if (cmdtp === "MOVE")
				{
					let tpval = ChessPiece.getLongHandType(mvcmds[x].substring(1, 3));
					let esi = -1;
					if (mvcmds[x].charAt(3) === 'T') esi = 5;
					else esi = 7;
					let eloc = ChessPiece.convertStringLocToRowCol(mvcmds[x].substring(esi),
						iswhitedown);
					canpropawn = ChessPiece.canPawnBePromotedAt(eloc[0], eloc[1], clrval, tpval);
				}
				//else;//do nothing
			}
			if (canpropawn)
			{
				if (ChessPiece.cc.isStringEmptyNullOrUndefined(promotps));
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
			myfullcmds.push(ChessPiece.genFullMoveCommandFromDisplayedCommand(mvcmds[x], gid,
				ptpval, ignorelist, addpcs, iswhitedown, bpassimnxtmv));
			
			//generate the new ignorelist taking into account the new commands without
			//actually making the moves
			//if you want to get rid of the piece, you could just ignore it and make
			//sure it is not on the add list
			//-if it is on the add list, then remove it.
			//to move a piece to a new location: ignore current loc, then add the piece
			//to the add list at the new loc
			//-if piece is already on the add list, then just set its location to
			//the new location
			
			//ignorelist = new int[1][2];
			for (let p = 0; p < myfullcmds[x].length; p++)
			{
				console.log("myfullcmds[" + x + "][" + p + "] = " + myfullcmds[x][p]);
			}
			ChessPiece.printLocsArray(ignorelist, "OLD ignorelist");
			
			//if the location gets converted then that flips the iswhitedown variable
			//if the location does not get converted then the iswhitedown variable stays the same
			
			let noloccnv = (iswhitedown === ChessPiece.WHITE_MOVES_DOWN_RANKS);
			//if true, no conversion took place
			//if false, the conversion already took place
			console.log("iswhitedown = " + iswhitedown);
			console.log("ChessPiece.WHITE_MOVES_DOWN_RANKS = " +
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
			console.log("noloccnv = " + noloccnv);
			
			const nwiswhitedown = ((noloccnv) ? iswhitedown : !iswhitedown);
			console.log("nwiswhitedown = " + nwiswhitedown);
			
			let nwiglist = ChessPiece.getNewIgnoreListFromCommand(myfullcmds[x], nwiswhitedown);
			
			ChessPiece.printPiecesList(addpcs, false, "OLD ");
			ChessPiece.printLocsArray(nwiglist, "nwiglist");
			
			addpcs = ChessPiece.getNewAddPiecesListFromCommand(myfullcmds[x], addpcs, gid,
				nwiswhitedown);
			
			ChessPiece.printPiecesList(addpcs, false, "NEW ");
			
			ignorelist = ChessPiece.combineIgnoreLists(ignorelist, nwiglist);
			ChessPiece.printLocsArray(ignorelist, "NEW ignorelist");
		}
		if (myfullcmds.length === mvcmds.length) return myfullcmds;
		else ChessPiece.cc.logAndThrowNewError("myfullcmds does not have the correct size!");
	}
	
	//this converts the locations from the full move commands given to this if needed
	//this does not verify if the commands are legal and are ASSUMED TO BE LEGAL
	//all commands must be in SHORT HAND NOTATION
	static convertAllLocationsForFullMoveCommands(mvcmds, iswhitedown)
	{
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		
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
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmds)) return null;
		else
		{
			//if we do not need a conversion return the input unchanged
			//else make the changes below
			if (iswhitedown === ChessPiece.WHITE_MOVES_DOWN_RANKS) return mvcmds;
			//else;//do nothing
			
			let nwmvcmds = [];//new String[mvcmds.length][];
			//for (let n = 0; n < mvcmds.length; n++)
			//{
			//	for (let x = 0; x < mvcmds[n].length; x++)
			//	{
			//		console.log("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
			//	}
			//}
			//console.log("");
			
			for (let n = 0; n < mvcmds.length; n++)
			{
				let cmdtps = [];//new String[mvcmds[n].length];
				let resstr = [];//new String[mvcmds[n].length];
				for (let x = 0; x < mvcmds[n].length; x++)
				{
					cmdtps.push(ChessPiece.getTypeOfMoveCommand(mvcmds[n][x]));
					console.log("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
					console.log("cmdtps[" + x + "] = " + cmdtps[x]);
					
					if (cmdtps[x] === "HINTS" || cmdtps[x] === "CREATE" ||
						cmdtps[x] === "DELETE" || cmdtps[x] === "PROMOTION")
					{
						let si = -1;
						let ei = -1;
						if (cmdtps[x] === "HINTS")
						{
							if (mvcmds[n][x].length === 6)
							{
								resstr.push("" + mvcmds[n][x]);
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
						
						let slocstr = mvcmds[n][x].substring(si, ei);
						console.log("OLD slocstr = " + slocstr);
						
						let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
						console.log("sloc[0] = " + sloc[0]);
						console.log("sloc[1] = " + sloc[1]);
						
						slocstr = ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
							ChessPiece.WHITE_MOVES_DOWN_RANKS);
						console.log("NEW slocstr = " + slocstr);
						
						let nwusrcmd = mvcmds[n][x].substring(0, si) + slocstr +
							mvcmds[n][x].substring(ei);
						console.log("nwusrcmd = " + nwusrcmd);
						
						resstr.push("" + nwusrcmd);
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else if (cmdtps[x] === "CASTLEING" || cmdtps[x] === "TIEDESIRE" ||
						cmdtps[x] === "RESIGN")
					{
						//CASTLING NOTATION:
						//WLCE:
						resstr.push("" + mvcmds[n][x]);
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else if (cmdtps[x] === "PAWNING" || cmdtps[x] === "MOVE")
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
						if (cmdtps[x] === "PAWNING") ssi = 4;
						else ssi = 3;
						sei = ssi + 2;
						esi = sei + 2;
						console.log("ssi = " + ssi);
						console.log("sei = " + sei);
						console.log("esi = " + esi);
						
						let slocstr = mvcmds[n][x].substring(ssi, sei);
						let elocstr = mvcmds[n][x].substring(esi);
						console.log("OLD slocstr = " + slocstr);
						console.log("OLD elocstr = " + elocstr);
						
						let sloc = ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown);
						let eloc = ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown);
						console.log("sloc[0] = " + sloc[0]);
						console.log("sloc[1] = " + sloc[1]);
						
						console.log("eloc[0] = " + eloc[0]);
						console.log("eloc[1] = " + eloc[1]);
						
						slocstr = ChessPiece.convertRowColToStringLoc(sloc[0], sloc[1],
							ChessPiece.WHITE_MOVES_DOWN_RANKS);
						console.log("NEW slocstr = " + slocstr);
						
						elocstr = ChessPiece.convertRowColToStringLoc(eloc[0], eloc[1],
							ChessPiece.WHITE_MOVES_DOWN_RANKS);
						console.log("NEW elocstr = " + elocstr);
						
						let nwusrcmd = mvcmds[n][x].substring(0, ssi) + slocstr +
							mvcmds[n][x].substring(sei, esi) + elocstr;
						console.log("nwusrcmd = " + nwusrcmd);
						
						resstr.push("" + nwusrcmd);
						console.log("resstr[" + x + "] = " + resstr[x]);
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("ILLEGAL COMMAND TYPE (" + cmdtps[x] +
							") FOUND AND USED HERE!");
					}
				}//end of x for loop
				nwmvcmds.push(resstr);
			}//end of n for loop
			console.log("");
			
			//console.log("NEW COMMANDS:");
			//for (let n = 0; n < nwmvcmds.length; n++)
			//{
			//	for (let x = 0; x < nwmvcmds[n].length; x++)
			//	{
			//		console.log("nwmvcmds[" + n + "][" + x + "] = " + nwmvcmds[n][x]);
			//	}
			//}
			//console.log("");
			if (nwmvcmds.length === mvcmds.length) return nwmvcmds;
			else ChessPiece.cc.logAndThrowNewError("nwmvcmds does not have the correct size!");
		}
	}
	
	
	//THE EXECUTOR EXECUTES THE COMMANDS GENERATED ABOVE
	
	//EXECUTES THE COMMANDS ABOVE ON THE LOCAL BOARD ONLY
	//ONLY EXECUTES COMMANDS IN SHORT HAND NOTATION
	///*
	static makeLocalShortHandMove(mvcmd, gid, isuser, isundo=false,
		iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial=false)
	{
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeBoolean(isundo, "isundo");
		ChessPiece.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		ChessPiece.cc.letMustBeBoolean(isuser, "isuser");
		ChessPiece.cc.letMustBeBoolean(isofficial, "isofficial");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(mvcmd)) return;
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
		//UNDOWKGE8TOC8 (decrements the move count for the king only because we only
		//incremented that for the king)
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
		
		console.log("");
		console.log("BEGIN EXECUTING THE MOVE COMMAND NOW:");
		console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
		for (let x = 0; x < mvcmd.length; x++) console.log("mvcmd[" + x + "] = " + mvcmd[x]);
		console.log("");
		console.log("isundo = " + isundo);
		console.log("isuser = " + isuser);
		
		const mypcsclr = ChessPiece.getGameVIAGID(gid).getMyColor();
		console.log("mypcsclr = " + mypcsclr);
		console.log("");
		
		if (isundo)
		{
			let nwmvs = [];//new String[mvcmd.length];
			let fndundo = false;
			for (let x = 0; x < mvcmd.length; x++)
			{
				if (mvcmd[x].indexOf("UNDO") === 0)
				{
					nwmvs.push(mvcmd[x].substring(4));
					if (fndundo);
					else fndundo = true;
				}
				else nwmvs.push("" + mvcmd[x]);
			}
			console.log("fndundo = " + fndundo);
			
			if (fndundo)
			{
				//clear the unofficial move
				if (isofficial);
				else ChessPiece.getGameVIAGID(gid).setUnofficialMove(null);
				
				ChessPiece.makeLocalShortHandMove(nwmvs, gid, isuser, isundo, iswhitedown,
					isofficial);
				
				//add the move to the last undone move...
				//do we add the generated undo move OR do we add the move we are undoing?
				//the generated move comes into this and yes it can be reversed to get the
				//current one.
				//add the move we are undoing...
				let oldmvwithundo = ChessPiece.genUndoMoveToShortHandCommand(nwmvs, true, false);
				//redoit, remundo
				if (ChessPiece.cc.isItemNullOrUndefined(oldmvwithundo))
				{
					if (ChessPiece.cc.isItemNullOrUndefined(mvcmd));
					else
					{
						ChessPiece.cc.logAndThrowNewError("old move is not the required length!");
					}
				}
				else
				{
					if (oldmvwithundo.length === mvcmd.length);
					else
					{
						ChessPiece.cc.logAndThrowNewError("old move is not the required length!");
					}
				}
				let oldmv = [];//new String[mvcmd.length];
				for (let x = 0; x < oldmvwithundo.length; x++)
				{
					if (oldmvwithundo[x].indexOf("UNDO") === 0)
					{
						oldmv.push(oldmvwithundo[x].substring(4));
					}
					else oldmv.push("" + oldmvwithundo[x]);
					console.log("oldmv[" + x + "] = " + oldmv[x]);
				}
				if (isofficial);
				else ChessPiece.getGameVIAGID(gid).setLastUndoneMove(oldmv);
				return;
			}
			//else;//do nothing safe to proceed below
		}
		else
		{
			//set this as the new unofficial move
			if (isofficial);
			else ChessPiece.getGameVIAGID(gid).setUnofficialMove(mvcmd);
		}
		
		let tpcmds = [];//new String[mvcmd.length];
		let usecastling = false;
		let usepawning = false;
		let usehintsforside = false;
		let pci = -1;
		for (let x = 0; x < mvcmd.length; x++)
		{
			if (mvcmd[x].charAt(0) === '+') tpcmds.push("CREATE");
			else if (mvcmd[x].charAt(0) === '-') tpcmds.push("DELETE");
			else if (0 < mvcmd[x].indexOf("RESIGNS") &&
				mvcmd[x].indexOf("RESIGNS") < mvcmd[x].length &&
				(mvcmd[x].length === 8 || mvcmd[x].length === 13))
			{
				tpcmds.push("RESIGN");//?
			}
			else if (mvcmd[x].charAt(0) === 'S') tpcmds.push("TIEDESIRE");
			else if (mvcmd[x].charAt(1) === 'L' || mvcmd[x].charAt(1) === 'R')
			{
				if (mvcmd[x].charAt(2) === 'P')
				{
					tpcmds.push("PAWNING");
					usepawning = true;
					pci = x;
				}
				else
				{
					tpcmds.push("CASTLEING");
					usecastling = true;
					pci = x;
				}
			}
			else if (mvcmd[x].charAt(0) === 'T') tpcmds.push("PROMOTION");
			else if (mvcmd[x].indexOf("TO") === 5) tpcmds.push("MOVE");
			else if (mvcmd[x].indexOf("HINTS") === 5 || mvcmd[x].indexOf("HINTS") === 1)
			{
				tpcmds.push("HINTS");
				usehintsforside = (mvcmd[x].indexOf("HINTS") === 1);
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND FOR COMMAND (" +
					mvcmd[x] + ")!");
			}
			console.log("tpcmds[" + x + "] = " + tpcmds[x]);
		}//end of x for loop
		console.log("usecastling = " + usecastling);
		console.log("usepawning = " + usepawning);
		console.log("usehintsforside = " + usehintsforside);
		
		if (usecastling || usepawning)
		{
			if (pci < 0 || mvcmd.length - 1 < pci)
			{
				ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOR PCI BECAUSE WE ARE " +
					"CASTLEING OR PAWNING!");
			}
			//else;//do nothing
		}
		else
		{
			if (pci < 0 || mvcmd.length - 1 < pci);
			else
			{
				ChessPiece.cc.logAndThrowNewError("ILLEGAL VALUE FOR PCI BECAUSE WE ARE " +
					"CASTLEING OR PAWNING!");
			}
		}
		
		//do nothing just proceed can move all of the pieces
		if (isundo || !isuser || mypcsclr === "BOTH");
		else
		{
			let tempmvs = [mvcmd];//new String[1][];
			let mycmdclr = ChessPiece.getSideColorsForMoves(tempmvs)[0];
			console.log("mypcsclr = " + mypcsclr);
			console.log("mycmdclr = " + mycmdclr);
			
			ChessPiece.colorIsValid(mycmdclr);
			ChessPiece.colorIsValid(mypcsclr);
			
			//if piece color is the same as the main command color
			if (mypcsclr === mycmdclr && (mycmdclr === "WHITE" ||
				mycmdclr === "BLACK"))
			{
				//do nothing
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("NOT ALLOWED TO MOVE THIS PIECE OR ILLEGAL " +
					"PIECES COLOR OBTAINED!");
			}
		}
		
		//get the direction
		let useleftforcandp = false;
		if (usecastling || usepawning) useleftforcandp = (mvcmd[pci].charAt(1) === 'L');
		//else;//do nothing
		console.log("useleftforcandp = " + useleftforcandp);
		
		let mpclist = ChessPiece.getAllPiecesWithGameID(gid);
		if (usecastling || usepawning)
		{
			if (usepawning)
			{
				//needs to be called on the pawn
				//extract the location of that pawn
				//get the piece
				let pn = ChessPiece.getPieceAtMain(ChessPiece.convertStringLocToRowCol(
					mvcmd[pci].substring(4, 6), iswhitedown), mpclist);
				if (ChessPiece.cc.isItemNullOrUndefined(pn))
				{
					ChessPiece.cc.logAndThrowNewError("THE PAWN MUST NOT BE NULL!");
				}
				else
				{
					if (isundo)
					{
						pn.setLocMain(ChessPiece.convertStringLocToRowCol(mvcmd[pci].substring(8),
							iswhitedown));
						pn.decrementMoveCount();
						console.log("MOVED THE PAWN BACK!");
						let cp = ChessPiece.makeNewChessPiece(
							ChessPiece.getLongHandType(mvcmd[pci + 1].substring(2, 4)),
							ChessPiece.getLongHandColor("" + mvcmd[pci + 1].charAt(1)),
							ChessPiece.convertStringLocToRowCol(mvcmd[pci + 1].substring(4, 6),
								iswhitedown), gid,
							Number(mvcmd[pci + 1].substring(7,
								mvcmd[pci + 1].indexOf("MS"))), true);
						//console.log(cp);
						console.log("CREATED: " + cp.toString() + "!");
						let prevrw = -1;
						if (cp.getColor() === "WHITE") prevrw = 6;
						else prevrw = 1;
						let mymvcmd = ChessPiece.getShortHandColor(cp.getColor()) +
							ChessPiece.getShortHandType(cp.getType()) +
							ChessPiece.convertRowColToStringLoc(prevrw, cp.getCol(),
								ChessPiece.WHITE_MOVES_DOWN_RANKS) + "TO" +
							ChessPiece.convertRowColToStringLoc(cp.getRow(), cp.getCol(),
								ChessPiece.WHITE_MOVES_DOWN_RANKS);
						console.log("UNDOPAWNING: mymvcmd = " + mymvcmd);
						ChessPiece.getGameVIAGID(gid).setLastSetLocMove(mymvcmd);
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
					let mkg = ChessPiece.getCurrentSideKing(ChessPiece.getLongHandColor("" +
						mvcmd[pci].charAt(0)), mpclist);
					if (ChessPiece.cc.isItemNullOrUndefined(mkg))
					{
						ChessPiece.cc.logAndThrowNewError("the king must be found!");
					}
					//else;//do nothing
					let skgloc = ChessPiece.convertStringLocToRowCol(
						mvcmd[pci + 2].substring(3, 5), iswhitedown);
					if (mkg.getRow() === skgloc[0] && mkg.getCol() === skgloc[1]);
					else
					{
						ChessPiece.cc.logAndThrowNewError("Our king should be at the " +
							"starting location, but it was not!");
					}
					mkg.setLocMain(ChessPiece.convertStringLocToRowCol(
						mvcmd[pci + 2].substring(7), iswhitedown));
					mkg.decrementMoveCount();
					console.log("MOVED THE KING BACK!");
					let mcsl = ChessPiece.getPieceAtMain(
						ChessPiece.convertStringLocToRowCol(mvcmd[pci + 1].substring(3, 5),
						iswhitedown), mpclist);
					if (ChessPiece.cc.isItemNullOrUndefined(mcsl))
					{
						ChessPiece.cc.logAndThrowNewError("Since we just moved it the piece " +
							"must exist, but now it does not!");
					}
					//else;//do nothing
					if ((mcsl.getType() === "CASTLE" || mcsl.getType() === "ROOK") &&
						mcsl.getColor() === mkg.getColor())
					{
						//do nothing valid
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("Since we just moved it, it must be " +
							"at that given location and must be type and color of piece that " +
							"we are looking for, but it was not!");
					}
					mcsl.setLocMain(ChessPiece.convertStringLocToRowCol(
						mvcmd[pci + 1].substring(7), iswhitedown));
					console.log("MOVED THE CASTLE BACK!");
				}
				else
				{
					ChessPiece.sideCastleLeftOrRight(ChessPiece.getLongHandColor("" +
						mvcmd[pci].charAt(0)), useleftforcandp, gid);
				}
			}
			console.log("DONE MAKING THE FULL MOVE!");
			return;
		}
		//else;//do nothing proceed below
		
		//now the order matters
		for (let x = 0; x < mvcmd.length; x++)
		{
			if (tpcmds[x] === "CREATE")
			{
				let cp = ChessPiece.makeNewChessPiece(
					ChessPiece.getLongHandType(mvcmd[x].substring(2, 4)),
					ChessPiece.getLongHandColor("" + mvcmd[x].charAt(1)),
					ChessPiece.convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown),
					gid, Number(mvcmd[x].substring(7, mvcmd[x].indexOf("MS"))), true);
				//need to update the piece list...
				console.log("TOTAL PIECES: " + mpclist.length);
				
				mpclist = ChessPiece.getAllPiecesWithGameID(gid);
				
				console.log("TOTAL PIECES: " + mpclist.length);
				console.log("CREATED: " + cp.toString() + "!");
			}
			else if (tpcmds[x] === "DELETE")
			{
				//extract the location
				ChessPiece.removePieceAtMain(ChessPiece.convertStringLocToRowCol(
					mvcmd[x].substring(4, 6), iswhitedown), gid);
				
				//need to update the piece list...
				console.log("TOTAL PIECES: " + mpclist.length);
				
				mpclist = ChessPiece.getAllPiecesWithGameID(gid);
				
				console.log("TOTAL PIECES: " + mpclist.length);
				console.log("DELETED THE PIECE!");
			}
			else if (tpcmds[x] === "PROMOTION")
			{
				console.log("mvcmd[" + x + "] = " + mvcmd[x]);
				console.log("slocstr = mvcmd[" + x + "].substring(4, 6) = " +
					mvcmd[x].substring(4, 6));
				console.log("iswhitedown = " + iswhitedown);
				
				let pn = ChessPiece.getPieceAtMain(ChessPiece.convertStringLocToRowCol(
					mvcmd[x].substring(4, 6), iswhitedown), mpclist);
				console.log("pn = ", pn);
				
				if (ChessPiece.cc.isItemNullOrUndefined(pn))
				{
					ChessPiece.cc.logAndThrowNewError("THE PAWN MUST NOT BE NULL!");
				}
				else
				{
					if (isundo)
					{
						if (pn.getColor() === ChessPiece.getLongHandColor("" +
							mvcmd[x].charAt(1)) && pn.getType() === ChessPiece.getLongHandType(
								mvcmd[x].substring(2, 4)))
						{
							//do nothing this is the piece at the expected location
						}
						else
						{
							ChessPiece.cc.logAndThrowNewError("Since we just moved this " +
								"piece, this must be the same color and type at the expected " +
								"location, but it was not!");
						}
						
						if (ChessPiece.getLongHandType(mvcmd[x].substring(10)) === "PAWN");
						else
						{
							ChessPiece.cc.logAndThrowNewError("THE NEW TYPE MUST BE PAWN " +
								"FOR DEMOTION, BUT IT WAS NOT!");
						}

						pn.setType("PAWN");
						console.log("DEMOTED BACK TO PAWN!");
					}
					else
					{
						pn.promotePawnTo(ChessPiece.getLongHandType(mvcmd[x].substring(10)));
						console.log("PROMOTED THE PAWN!");
					}
				}
			}
			else if (tpcmds[x] === "MOVE")
			{
				let cp = ChessPiece.getPieceAtMain(ChessPiece.convertStringLocToRowCol(
					mvcmd[x].substring(3, 5), iswhitedown), mpclist);
				console.log("cp = ", cp);
				
				if (ChessPiece.cc.isItemNullOrUndefined(cp))
				{
					ChessPiece.cc.logAndThrowNewError("THE PIECE MUST NOT BE NULL!");
				}
				//else;//do nothing
				if (cp.getType() === ChessPiece.getLongHandType(mvcmd[x].substring(1, 3)) &&
					cp.getColor() === ChessPiece.getLongHandColor("" + mvcmd[x].charAt(0)))
				{
					cp.setLocMain(ChessPiece.convertStringLocToRowCol(mvcmd[x].substring(7),
						iswhitedown));
					if (isundo) cp.decrementMoveCount();
					else cp.incrementMoveCount();
					console.log("MOVED THE PIECE TO THE NEW LOCATION!");
				}
				else
				{
					ChessPiece.cc.logAndThrowNewError("THE PIECE WE ARE MOVING MUST BE THE " +
						"SAME TYPE AND COLOR!");
				}
			}
			else if (tpcmds[x] === "HINTS")//NEEDS MODIFIED 7-1-2024
			{
				if (usehintsforside)
				{
					let mycpcs = ChessPiece.filterListByColor(mpclist,
						ChessPiece.getLongHandColor("" + mvcmd[x].charAt(0)));
					//console.log("mycpcs = ", mycpcs);
					let numpcs = ChessPiece.getNumItemsInList(mycpcs);
					if (numpcs < 1)
					{
						ChessPiece.cc.logAndThrowNewError("there must be at least a king on " +
							"the pieces list!");
					}
					else
					{
						console.log("ALL THE HINTS ARE:");
						for (let p = 0; p < numpcs; p++)
						{
							let mypcmvlocs = mycpcs[p].getPieceCanMoveToLocs();
							console.log("");
							console.log("HINTS ARE:");
							console.log(mycpcs[p].toString() + " CAN MOVE TO:");
							ChessPiece.printLocsArray(mypcmvlocs, "mypcmvlocs", mycpcs[p]);
							console.log("DONE SHOWING HINTS FOR THE PIECE # " + (p + 1) + "/" +
								numpcs + "!");
						}
						console.log("DONE SHOWING ALL THE HINTS!");
						console.log("");
					}
				}
				else
				{
					let cp = ChessPiece.getPieceAtMain(ChessPiece.convertStringLocToRowCol(
						mvcmd[x].substring(3, 5), iswhitedown), mpclist);
					if (ChessPiece.cc.isItemNullOrUndefined(cp))
					{
						ChessPiece.cc.logAndThrowNewError("THE PIECE MUST NOT BE NULL!");
					}
					//else;//do nothing
					if (cp.getType() === ChessPiece.getLongHandType(mvcmd[x].substring(1, 3)) &&
						cp.getColor() === ChessPiece.getLongHandColor("" + mvcmd[x].charAt(0)))
					{
						let mvlocs = cp.getPieceCanMoveToLocs();
						console.log("");
						console.log("HINTS ARE:");
						console.log(cp.toString() + " CAN MOVE TO:");
						ChessPiece.printLocsArray(mvlocs, "mvlocs", cp);
						console.log("DONE SHOWING THE HINTS!");
						console.log("");
					}
					else
					{
						ChessPiece.cc.logAndThrowNewError("THE PIECE WE ARE MOVING MUST BE " +
							"THE SAME TYPE AND COLOR!");
					}
				}
			}
			else if (tpcmds[x] === "TIEDESIRE")
			{
				let mybool = false;
				if (mvcmd[x].charAt(mvcmd[x].length - 1) === '0') mybool = false;
				else mybool = true;
				ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
				ChessPiece.getGameVIAGID(gid).setColorWantsADraw(ChessPiece.getLongHandColor("" +
					mvcmd[x].charAt(1)), mybool);
			}
			else if (tpcmds[x] === "RESIGN")
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
					else ChessPiece.getGameVIAGID(gid).setLastUndoneMove(null);
					
					if (isofficial);
					else ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
					ChessPiece.getGameVIAGID(gid).setColorResigns(ChessPiece.getLongHandColor("" +
						mvcmd[x].charAt(0)), true);
					if (x + 1 < mvcmd.length)
					{
						ChessPiece.cc.logAndThrowNewError("RESIGNING MUST BE THE LAST COMMAND!");
					}
					//else;//do nothing
				}
			}
			else
			{
				ChessPiece.cc.logAndThrowNewError("ILLEGAL TYPE FOUND FOR COMMAND (" +
					mvcmd[x] + ")!");
			}
		}//end of x for loop
		console.log("DONE MAKING THE FULL MOVE!");
		console.log("");
	}
	static makeLocalLongHandMove(mvcmd, gid, isuser, isundo=false,
		iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial=false)
	{
		ChessPiece.makeLocalShortHandMove(ChessPiece.getShortHandMoves(mvcmd), gid, isuser,
			isundo, iswhitedown, isofficial);
	}
	static makeLocalMove(mvcmd, gid, isuser, isshorthand=true, isundo=false, 
		iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial=false)
	{
		console.log("CALLING SHORT OR LONG HAND MOVE with: iswhitedown = " + iswhitedown);
		ChessPiece.cc.letMustBeBoolean(isshorthand, "isshorthand");
		if (isshorthand)
		{
			ChessPiece.makeLocalShortHandMove(mvcmd, gid, isuser, isundo,
				iswhitedown, isofficial);
		}
		else
		{
			ChessPiece.makeLocalLongHandMove(mvcmd, gid, isuser, isundo, iswhitedown, isofficial);
		}
	}
	static makeLocalMoveMain(mvcmd, gid, isuser, isundo=false, 
		iswhitedown=ChessPiece.WHITE_MOVES_DOWN_RANKS, isofficial=false)
	{
		ChessPiece.makeLocalMove(mvcmd, gid, isuser, true, isundo, iswhitedown, isofficial);
	}
	//*/
	
	//PAWN SPECIAL METHODS
	
	//PAWN PROMOTION METHODS
	
	static canPawnBePromotedAt(nrval, ncval, clrval, tpval)
	{
		ChessPiece.cc.letMustBeAnInteger(nrval, "nrval");
		ChessPiece.cc.letMustBeAnInteger(ncval, "ncval");
		
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(tpval)) return false;
		if (ChessPiece.cc.isStringEmptyNullOrUndefined(clrval)) return false;
		if (ChessPiece.isvalidrorc(nrval) && ChessPiece.isvalidrorc(ncval));
		else return false;
		if (tpval === "PAWN")
		{
			if ((nrval === 0 && clrval === "WHITE") ||
				(nrval === 7 && clrval === "BLACK"))
			{
				return true;
			}
			//else console.log("THIS PAWN HAS NOT REACHED THE CORRECT ROW FOR ITS COLOR!");
		}
		//else console.log("THIS PIECE MUST BE A PAWN!");
		return false;
	}
	canPawnBePromoted()
	{
		return ChessPiece.canPawnBePromotedAt(this.getRow(), this.getCol(), this.getColor(),
			this.getType());
	}
	static canPawnForSideBePromoted(clrval, allpcs)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		let pwnsclr = ChessPiece.getAllPawnsOfColor(clrval, allpcs);
		if (ChessPiece.getNumItemsInList(pwnsclr) < 1);
		else
		{
			for (let x = 0; x < pwnsclr.length; x++)
			{
				if (pwnsclr[x].canPawnBePromoted()) return true;
			}
		}
		return false;
	}
	static canPawnForSideBePromotedMain(clrval, gid)
	{
		return ChessPiece.canPawnForSideBePromoted(clrval,
			ChessPiece.getAllPiecesWithGameID(gid));
	}
	
	promotePawnTo(nwtype)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(nwtype, "nwtype");

		if (this.canPawnBePromoted())
		{
			if (nwtype === "PAWN" || nwtype === "KING")
			{
				ChessPiece.cc.logAndThrowNewError("CANNOT PROMOTE A PAWN TO A PAWN OR A KING!");
			}
			else this.setType(nwtype);
		}
		else ChessPiece.cc.logAndThrowNewError("CANNOT PROMOTE THE PAWN!");
	}
	
	
	//PAWNING METHODS
	
	//CAN PAWN METHODS
	
	canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");
		
		//if no pawns for one side -> false
		let wpns = ChessPiece.getAllPawnsOfColor("WHITE", allpcs);
		let bpns = ChessPiece.getAllPawnsOfColor("BLACK", allpcs);
		if (ChessPiece.getNumItemsInList(wpns) < 1 || ChessPiece.getNumItemsInList(bpns) < 1)
		{
			//console.log("ONE SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON " +
			//	"EACH SIDE NEAR EACH OTHER TO BE ABLE TO PAWN!");
			return false;
		}
		//else;//do nothing
		
		if (this.getType() === "PAWN")
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
			
			if (((this.getRow() === 3) && this.getColor() === "WHITE") ||
				((this.getRow() === 4) && this.getColor() === "BLACK"))
			{
				//we are on the row so it might be an option
			}
			else
			{
				//console.log("OUR SIDE PIECE IS NOT ON THE APPROPRIATE ROW TO BE ABLE TO PAWN!");
				return false;
			}
			
			const lc = ((useleft) ? this.getCol() - 1 : this.getCol() + 1);
			if (ChessPiece.isvalidrorc(lc));
			else
			{
				//console.log("THE LOCATION " + ChessPiece.getLocString(this.getRow(), lc) +
				//	" HAS AN INVALID COLUMN!");
				return false;
			}
			
			let ep = ChessPiece.getPieceAt(this.getRow(), lc, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(ep))
			{
				//console.log("allpcs = ", allpcs);
				//console.log("THE LOCATION " + ChessPiece.getLocString(this.getRow(), lc) +
				//	" IS EMPTY!");
				return false;
			}
			else
			{
				//console.log(ep);
				//console.log(ep.movecount);
				if (ep.getType() === "PAWN");
				else
				{
					console.log("THIS IS NOT A PAWN!");
					return false;
				}
				if (ep.getColor() === this.getColor())
				{
					console.log("THIS IS YOUR PAWN!");
					return false;
				}
				//else;//do nothing this is an enemy pawn
				if (ep.movecount === 1);
				else
				{
					console.log("THIS IS NOT THE FIRST MOVE OF THE ENEMY PAWN!");
					return false;
				}
				
				if (bpassimnxtmv);
				else
				{
					let lstsetlocmv = this.getGame().getLastSetLocMove();
					//WPN??TO??
					//012345678
					//if enemy piece is now at that destination location
					//then we can say that we just moved it there...
					//otherwise it is not the immediate next move, so cannot pawn
					let lstmvdestlocstr = lstsetlocmv.substring(7);
					let lstdestlocarr = ChessPiece.convertStringLocToRowCol(lstmvdestlocstr,
						ChessPiece.WHITE_MOVES_DOWN_RANKS);
					if (ep.getRow() === lstdestlocarr[0] && ep.getCol() === lstdestlocarr[1]);
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
				
				//if we pawn left, and are white then getRow() is 3 and new row is 2,
				//new col is getCol() - 1
				//if we pawn left, and are black then getRow() is 4 and new row is 5,
				//new col is getCol() - 1
				//if we pawn right, and are white then getRow() is 3 and new row is 2,
				//new col is getCol() + 1
				//if we pawn right, and are black then getRow() is 4 and new row is 5,
				//new col is getCol() + 1
				//we ignore the enemy pawn entirely, we also ignore us, we add us at our
				//new location
				//then we ask if this puts our king into check
				//we need to know our kings location
				let mkg = ChessPiece.getCurrentSideKingMain(this.getColor(), this.getGameID());
				ChessPiece.cc.letMustBeDefinedAndNotNull(mkg, "mkg");
				
				let ignorelist = [];
				ignorelist.push([this.getRow(), this.getCol()]);
				ignorelist.push([this.getRow(), lc]);
				
				let nr = -1;
				if (this.getColor() === "WHITE") nr = 2;
				else if (this.getColor() === "BLACK") nr = 5;
				else
				{
					ChessPiece.cc.logAndThrowNewError("PIECE FOUND WITH AN ILLEGAL COLOR " +
						"FOUND AND USED HERE!");
				}
				const nc = ((useleft) ? this.getCol() - 1 : this.getCol() + 1);
				
				let addpcs = [];
				addpcs.push(ChessPiece.makeNewChessPieceRCLocMain("PAWN", this.getColor(), nr, nc,
					mkg.getGameID(), false));
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
	canPawnLeftOrRightMain(useleft)
	{
		return this.canPawnLeftOrRight(useleft, this.getAllPiecesWithGameID(this.getGameID()));
	}
	canPawnLeftMain(allpcs, bpassimnxtmv=false)
	{
		return this.canPawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	canPawnLeft()
	{
		return this.canPawnLeftMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	canPawnRightMain(allpcs, bpassimnxtmv=false)
	{
		return this.canPawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	canPawnRight()
	{
		return this.canPawnRightMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	canPawnMain(allpcs, bpassimnxtmv=false)
	{
		return (this.canPawnLeftMain(allpcs, bpassimnxtmv) ||
			this.canPawnRightMain(allpcs, bpassimnxtmv));
	}
	canPawn()
	{
		return this.canPawnMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	static canSidePawn(clrval, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		
		//get all the pawns for our color
		//then call the canPawnLeft() or canPawnRight()
		//if true, then return true
		//if none are true, or no pawns return false
		
		let pns = ChessPiece.getAllPawnsOfColor(clrval, allpcs);
		console.log("pns = ", pns);
		
		if (ChessPiece.getNumItemsInList(pns) < 1)
		{
			console.log("THIS SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON EACH " +
				"SIDE NEAR EACH OTHER TO BE ABLE TO PAWN!");
			return false;
		}
		else
		{
			for (let x = 0; x < pns.length; x++)
			{
				if (pns[x].canPawnMain(allpcs, bpassimnxtmv)) return true;
			}
			
			console.log("NO PAWN CAN PAWN ON THIS SIDE!");
			return false;
		}
	}
	static canSidePawnMain(clrval, gid, bpassimnxtmv=false)
	{
		return ChessPiece.canSidePawn(clrval,
			ChessPiece.getAllPiecesWithGameID(gid), bpassimnxtmv);
	}
	
	//GET ENEMY PAWN FOR PAWNING
	
	getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");

		if (this.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			const lc = ((useleft) ? this.getCol() - 1 : this.getCol() + 1);
			if (ChessPiece.isvalidrorc(lc));
			else
			{
				ChessPiece.cc.logAndThrowNewError("we can pawn, so there must be an enemy, " +
					"but col is invalid!");
			}
			return ChessPiece.getPieceAt(this.getRow(), lc, allpcs);
		}
		else return null;
	}
	getEnemyPawnForLeftPawningMain(allpcs, bpassimnxtmv=false)
	{
		return this.getEnemyPawnForLeftOrRightPawning(true, allpcs, bpassimnxtmv);
	}
	getEnemyPawnForRightPawningMain(allpcs, bpassimnxtmv=false)
	{
		return this.getEnemyPawnForLeftOrRightPawning(false, allpcs, bpassimnxtmv);
	}
	getEnemyPawnForLeftPawning()
	{
		return this.getEnemyPawnForLeftPawningMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	getEnemyPawnForRightPawning()
	{
		return this.getEnemyPawnForRightPawningMain(
			this.getAllPiecesWithGameID(this.getGameID()));
	}
	
	//GET ENEMY PAWN LOCATION FOR PAWNING
	
	getEnemyPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");
		
		let ep = this.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
		if (ChessPiece.cc.isItemNullOrUndefined(ep)) return null;
		else return [ep.getRow(), ep.getCol()];
	}
	getEnemyPawnLeftLocationMain(allpcs, bpassimnxtmv=false)
	{
		return this.getEnemyPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	getEnemyPawnRightLocationMain(allpcs, bpassimnxtmv=false)
	{
		return this.getEnemyPawnLeftOrRightLocation(false, allpcs, bpassimnxtmv);
	}
	getEnemyPawnLeftLocation()
	{
		return this.getEnemyPawnLeftLocationMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	getEnemyPawnRightLocation()
	{
		return this.getEnemyPawnRightLocationMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	
	//NEW PAWN LOCATION AFTER PAWNING FOR OUR PAWN
	
	getPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");

		if (this.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			let nr = -1;
			if (this.getColor() === "WHITE") nr = 2;
			else if (this.getColor() === "BLACK") nr = 5;
			else
			{
				ChessPiece.cc.logAndThrowNewError("PIECE FOUND WITH AN ILLEGAL COLOR FOUND " +
					"AND USED HERE!");
			}
			const nc = ((useleft) ? this.getCol() - 1 : this.getCol() + 1);
			if (ChessPiece.isvalidrorc(nr) && ChessPiece.isvalidrorc(nc));
			else
			{
				ChessPiece.cc.logAndThrowNewError("SR AND SC MUST BE VALID BECAUSE WE CAN PAWN!");
			}
			return [nr, nc];
		}
		else return null;
	}
	getPawnLeftLocationMain(allpcs, bpassimnxtmv=false)
	{
		return this.getPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	getPawnRightLocationMain(allpcs, bpassimnxtmv=false)
	{
		return this.getPawnLeftOrRightLocation(false, allpcs, bpassimnxtmv);
	}
	getPawnLeftLocation()
	{
		return this.getPawnLeftLocationMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	getPawnRightLocation()
	{
		return this.getPawnRightLocationMain(this.getAllPiecesWithGameID(this.getGameID()));
	}
	
	
	//THIS MAKES THE MOVE, IT INCREMENTS THE MOVE COUNT FOR THE SURVIVING PAWN AND REMOVES THE
	//OTHER ONE ON THIS BOARD ONLY
	//THIS MUST BE CALLED ON THE PAWN THAT CAN PAWN
	pawnLeftOrRight(useleft, allpcs, bpassimnxtmv=false)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(bpassimnxtmv, "bpassimnxtmv");
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");

		if (this.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			let eploc = this.getEnemyPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv);
			ChessPiece.removePieceAt(eploc[0], eploc[1], this.getGameID());
			let npnloc = this.getPawnLeftOrRightLocation(useleft, allpcs, bpassimnxtmv);
			this.setLoc(npnloc[0], npnloc[1]);
			this.incrementMoveCount();
		}
		else
		{
			ChessPiece.cc.logAndThrowNewError("CANNOT PAWN " + (useleft ? "LEFT": "RIGHT") + "!");
		}
	}
	pawnLeftMain(allpcs, bpassimnxtmv=false)
	{
		this.pawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	pawnLeft()
	{
		this.pawnLeftMain(this.getAllPiecesWithGameID(this.getGameID()), false);
	}
	pawnRightMain(allpcs, bpassimnxtmv=false)
	{
		this.pawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	pawnRight()
	{
		this.pawnRightMain(this.getAllPiecesWithGameID(this.getGameID()), false);
	}
	
	
	//CASTLING METHODS
	
	//CAN CASTLE METHODS
	
	static canSideCastleLeftOrRight(useleft, clrval, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		if (ChessPiece.itemIsOnGivenList(clrval, ChessPiece.validColors));
		else
		{
			ChessPiece.cc.logAndThrowNewError("ILLEGAL COLOR (" + clrval +
				") FOUND AND USED HERE!");
		}
		if (gid < 1) ChessPiece.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
		ChessPiece.cc.letMustBeDefinedAndNotNull(allpcs, "allpcs");
		
		let mkg = ChessPiece.getCurrentSideKing(clrval, allpcs);
		ChessPiece.cc.letMustBeDefinedAndNotNull(mkg, "mkg");

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
			if (mkg.getCol() === 4 && ((mkg.getColor() === "WHITE" && mkg.getRow() === 7) ||
				(mkg.getColor() === "BLACK" && mkg.getRow() === 0)))
			{
				//the king is at its starting location
			}
			else
			{
				//console.log("THE KING MUST BE AT ITS STARTING LOCATION!");
				return false;
			}
			
			const mccol = ((useleft) ? 0: 7);
			const mcrw = ((mkg.getColor() === "WHITE") ? 7: 0);
			let mc = ChessPiece.getPieceAt(mcrw, mccol, allpcs);
			if (ChessPiece.cc.isItemNullOrUndefined(mc)) return false;
			else
			{
				if (mc.getType() === "CASTLE" || mc.getType() === "ROOK")
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
			//king on col 4
			//if using left, castle on col 0; else castle on col 7
			const sccol = ((useleft) ? mccol : 4);
			const cmx = ((useleft) ? 4 : mccol);
			for (let c = sccol + 1; c < cmx; c++)
			{
				if (ChessPiece.cc.isItemNullOrUndefined(ChessPiece.getPieceAt(mcrw, c, allpcs)));
				else
				{
					//console.log("THE SQUARES ARE NOT EMPTY!");
					return false;
				}
			}
			
			
			//need to know if there are any enemy pieces attacking the locations
			for (let c = sccol + 1; c < cmx; c++)
			{
				let epcs = ChessPiece.getEnemyPiecesGuardingLocation(mcrw, c,
					mkg.getGameID(), mkg.getColor(), ignorelist, addpcs);
				if (ChessPiece.getNumItemsInList(epcs) < 1);
				else
				{
					//console.log("THERE IS AT LEAST ONE ENEMY PIECE ABLE TO ATTACK ONE OF " +
					//	"THESE LOCATIONS DIRECTLY!");
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
	static canSideCastleLeftOrRightMain(useleft, clrval, gid)
	{
		return ChessPiece.canSideCastleLeftOrRight(useleft, clrval, gid, null, null);
	}
	static canSideCastleLeft(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.canSideCastleLeftOrRight(true, clrval, gid, ignorelist, addpcs);
	}
	static canSideCastleRight(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.canSideCastleLeftOrRight(false, clrval, gid, ignorelist, addpcs);
	}
	static canSideCastle(clrval, gid, ignorelist=null, addpcs=null)
	{
		return (ChessPiece.canSideCastleLeft(clrval, gid, ignorelist, addpcs) ||
			ChessPiece.canSideCastleRight(clrval, gid, ignorelist, addpcs));
	}
	//non-static version convenience methods
	canCastleLeftOrRight(useleft)
	{
		if (this.getType() === "CASTLE" || this.getType() === "ROOK" ||
			this.getType() === "KING")
		{
			//do nothing
		}
		else
		{
			console.log("YOU MUST BE A CASTLE OR A KING TO CASTLE!");
			return false;
		}
		
		return this.canSideCastleLeftOrRight(useleft, this.getColor(), this.getGameID());
	}
	canCastleLeft()
	{
		return this.canCastleLeftOrRight(true);
	}
	canCastleRight()
	{
		return this.canCastleLeftOrRight(false);
	}
	canCastle()
	{
		return (this.canCastleLeft() || this.canCastleRight());
	}
	
	//NEW CASTLE OR KING LOCATION METHODS
	
	//returns an array with 2 integers both will be invalid if cannot castle that direction
	static getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, usekg, clrval, gid,
		ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeBoolean(usekg, "usekg");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		let myretarr = [-1, -1];
		if (ChessPiece.canSideCastleLeftOrRight(useleft, clrval, gid, ignorelist, addpcs))
		{
			const cdiff = ((usekg) ? 0 : ((useleft) ? 1 : -1));
			const kdiff = ((useleft) ? -2 : 2);
			let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
			myretarr[0] = ChessPiece.getCurrentSideKing(clrval, allpcs).getRow();
			myretarr[1] = 4 + kdiff + cdiff;
		}
		//else;//do nothing
		return myretarr;
	}
	static getRightCastleSideNewKingLocMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(false, true, clrval, gid,
			ignorelist, addpcs);
	}
	static getRightCastleSideNewCastleLocMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(false, false, clrval, gid,
			ignorelist, addpcs);
	}
	static getLeftCastleSideNewKingLocMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(true, true, clrval, gid,
			ignorelist, addpcs);
	}
	static getLeftCastleSideNewCastleLocMain(clrval, gid, ignorelist=null, addpcs=null)
	{
		return ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(true, false, clrval, gid,
			ignorelist, addpcs);
	}
	//non-static version convenience methods
	getLeftOrRightCastleNewCastleOrKingLoc(useleft, usekg)
	{
		return this.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, usekg,
			this.getColor(), this.getGameID());
	}
	getRightCastleNewKingLoc()
	{
		return this.getRightCastleSideNewKingLocMain(this.getColor(), this.getGameID());
	}
	getRightCastleNewCastleLoc()
	{
		return this.getRightCastleSideNewCastleLocMain(this.getColor(), this.getGameID());
	}
	getLeftCastleNewKingLoc()
	{
		return this.getLeftCastleSideNewKingLocMain(this.getColor(), this.getGameID());
	}
	getLeftCastleNewCastleLoc()
	{
		return this.getLeftCastleSideNewCastleLocMain(this.getColor(), this.getGameID());
	}
	
	
	//THIS MAKES THE MOVE, AND INCREMENTS THE MOVE COUNT FOR THE KING FOR THE SIDE WHO
	//DID IT ON THIS SIDE OF THE BOARD
	static sideCastleLeftOrRight(clrval, useleft, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.cc.letMustBeBoolean(useleft, "useleft");
		ChessPiece.cc.letMustBeAnInteger(gid, "gid");
		ChessPiece.cc.letMustBeDefinedAndNotNull(clrval, "clrval");

		if (ChessPiece.canSideCastleLeftOrRight(useleft, clrval, gid, ignorelist, addpcs))
		{
			let allpcs = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
			let mkg = ChessPiece.getCurrentSideKing(clrval, allpcs);
			const oc = ((useleft) ? 0: 7);
			let csl = ChessPiece.getPieceAt(mkg.getRow(), oc, allpcs);
			let nwkgloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true,
				clrval, gid, ignorelist, addpcs);
			let nwcsloc = ChessPiece.getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false,
				clrval, gid, ignorelist, addpcs);
			mkg.setLoc(nwkgloc[0], nwkgloc[1]);
			csl.setLoc(nwcsloc[0], nwcsloc[1]);
			mkg.incrementMoveCount();
		}
		else ChessPiece.cc.logAndThrowNewError("" + clrval + " CANNOT CASTLE!");
	}
	static whiteCastleLeftOrRight(useleft, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.sideCastleLeftOrRight("WHITE", useleft, gid, ignorelist, addpcs);
	}
	static whiteCastleLeft(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.whiteCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	static whiteCastleRight(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.whiteCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	static blackCastleLeftOrRight(useleft, gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.sideCastleLeftOrRight("BLACK", useleft, gid, ignorelist, addpcs);
	}
	static blackCastleLeft(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.blackCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	static blackCastleRight(gid, ignorelist=null, addpcs=null)
	{
		ChessPiece.blackCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	
	
	//GENERIC TO STRING METHOD FOR THE PIECE
	
	toString()
	{
		return "<ChessPiece of Type: " + this.getType() + " and Color: " + this.getColor() +
			" at: " + ChessPiece.getLocString(this.getRow(), this.getCol()) + " of Gender: " +
				this.convertGenderValueToString() + " with TotalMoveCount: " +
				this.getMoveCount() + " on Game ID: " + this.getGameID() + ">";
	}
}

export default ChessPiece;
