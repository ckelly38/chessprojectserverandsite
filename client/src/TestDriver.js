/**
 * @(#)ChessBoardPieceClass.java
 *
 * ChessBoardPieceClass application
 *
 * @author 
 * @version 1.00 2024/4/22
 */

//import java.util.ArrayList;
import CommonClass from "./commonclass";
import ChessGame from "./ChessGame";
import ChessPiece from "./ChessPiece";
class TestDriver {
    cc = new CommonClass();
	static main(args) {
    	
    	// TODO, add your application code
    	console.log("Hello World!");
    	let gid = 1;
    	let game = new ChessGame(1, "WHITE");
    	//let og = new ChessGame(1);//error
    	//let mog = new ChessGame(2, "WHITE");
    	//testPawnPromotionViaStepingForwardThroughGame(2);
    	//testMovingPiecesAmbiguityViaStepingForwardThroughGame(2);
    	//testCastlingViaStepingForwardThroughGame(2);
    	//testPawningViaStepingForwardThroughGame(2);
    	//testColorsForMovesAlternateViaStepingForwardThroughGame(2);
    	//testOtherColorsAlternateViaStepingForwardThroughGame(2);
    	//testFourMoveCheckMateBlackViaStepingForwardThroughGame(2);
    	//testResignationViaStepingForwardThroughGame(2);//error
    	
    	ChessPiece.setUpBoard(gid);
    	console.log("DONE SETTING UP THE BOARD!");
    	//ArrayList<ChessPiece> mycps = ChessPiece.cps;
    	//for (int c = 0; c < mycps.length; c++) console.log(mycps.get(c));
    	ChessPiece.printBoard(gid);
    	console.log(ChessPiece.isBoardValid(gid));
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	let wqn = ChessPiece.getPieceAt(7, 3, gid);
    	let bqn = ChessPiece.getPieceAt(0, 3, gid);
    	console.log(wkg);
    	console.log(bkg);
    	console.log(wqn);
    	console.log(bqn);
    	let item = ChessPiece.getPieceAt(4, 0, gid);
    	console.log("ITEM AT (4, 0) IS: " + item);
    	console.log();
    	
    	this.testGetPiecesGuardingLocation(gid);
    	this.setUpFutureCheck(gid);
    	
    	console.log("WHITE CAN CASTLE: " + ChessPiece.canSideCastle("WHITE", gid));
    	console.log("BLACK CAN CASTLE: " + ChessPiece.canSideCastle("BLACK", gid));
    	console.log();
    	
    	//console.log(ChessPiece.getColorOfLoc(7, 7));
    	
    	//this.setUpBoardTestIsEmptyMoveToLocsWithoutMovingThere(gid);
    	//if (true) return;
    	
    	//this.getAndPrintAllPiecesGenders();
    	//this.testConvertingLocations();
    	//this.testCanMoveToLocs(gid, null, null);
    	
    	//this.testResignation(gid);
    	//this.testPawning(gid, true);
    	//this.setUpBoardForPawnPromotion(gid, true);
    	this.setUpBoardForCastlingWhiteRight(gid, true);
    	//this.setUpBoardWithKnightCheckingKing(gid, true);
    	//CHECKMATE TESTS
    	//this.setUpBoardWithFourMoveCheckMate(gid, true);
    	//this.setUpBoardWithTwoMoveCheckMateBlack(gid, true);
    	//this.setUpBoardWithTwoMoveCheckMateWhite(gid, true);
    	//this.setUpBoardCheckmateKingBishopVSameDiffColorSquares(gid);//no moving there
    	//this.setUpBoardWhiteCheckmateAfterManyMoves(gid);//no moving there
    	//STALEMATE TESTS
    	//this.setUpBoardWithKingVKingAndStuckPawnsWithoutMovingThere(gid);
    	//this.setUpBoardWithBlockedPawnsAndBishops(gid);//no moving there
    	//this.setUpBoardWhiteStalemateAfterManyMoves(gid);//no moving there
    	//this.setUpBoardWhiteStalemateKingAndQueenVsKing(gid);
    	//AUTO STALEMATES (ALL WITHOUT MOVING THERE)
    	//this.setUpBoardWithKingAndBishopsVKingBishops(gid, 1, 1);
    	//this.setUpBoardWithKingAndBishopsVKingBishops(gid, 0, 1);
    	//this.setUpBoardWithKingAndBishopsVKingBishops(gid, 1, 0);
    	//this.setUpBoardWithKingVKingOnlyWithoutMovingThere(gid);
    	//also produces king vs king board
		//this.setUpBoardWithKingAndBishopsVKingBishops(gid, 0, 0);
    	//this.setUpBoardWithKingAndKnightVKing(gid);
    	//
    	//NOT A STALEMATE BECAUSE BISHOPS ARE ON DIFFERENT COLOR SQUARES
    	//setUpBoardWithKingAndBishopsVKingBishops(gid, 1, 1, false);
		//true passed in produces a stalemate
    	
    	//console.log();
    	//console.log("AFTER SPECIAL TESTS!");
    	
    	
    	//let wpn = ChessPiece.getPieceAt(6, 0, gid);
    	//let mymv = wpn.genMoveToCommand(4, 0);
    	//let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	//let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMove(mymv, gid, false);
    	//wpn.setLoc(4, 0);
    	//ChessPiece.printBoard(gid);
    	//ChessPiece.makeLocalMove(myunmv, gid, true);
    	//ChessPiece.printBoard(gid);
    	//wpn.setLoc(4, 0);
    	//ChessPiece.printBoard(gid);
    	//ChessPiece bpn = ChessPiece.getPieceAt(1, 1, gid);
    	//bpn.genMoveToCommand(3, 1);
    	//bpn.setLoc(3, 1);
    	//ChessPiece.printBoard(gid);
    	//wpn.genMoveToCommand(3, 1);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.removePieceAt(3, 1, gid);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//wpn.setLoc(3, 1);
    	//ChessPiece.printBoard(gid);
    	//ChessPiece obpn = ChessPiece.getPieceAt(1, 0, gid);
    	//obpn.genMoveToCommand(3, 0);
    	//obpn.setLoc(3, 0);
    	//obpn.setMoveCount(1);
    	//console.log("OTHER BLACK PAWN MOVE COUNT: " + obpn.getMoveCount());
    	//ChessPiece.printBoard(gid);
    	//wpn.genMoveToCommand(2, 0);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.removePieceAt(3, 0, gid);
    	//wpn.setLoc(2, 0);
    	//wpn.pawnLeft();
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.printBoard(gid);
    }
    
    //TEST SOME BASIC METHODS
    
    static getAndPrintAllPiecesGenders(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	let mycps = ChessPiece.getAllPiecesWithGameID(gid);
    	for (let c = 0; c < mycps.length; c++)
    	{
    		let cp = mycps.get(c);
    		console.log("THE GENDER OF THE " + cp.getColor() + " " + cp.getType() + " AT: " +
    			cp.getLocString() + " IS: " + cp.convertGenderValueToString() +
				" WITH GAME ID: " + cp.getGameID());
    	}
    	console.log("mycps.length = " + mycps.length);
    }
    
    static getAndPrintWhereAllThePiecesAre(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		let mycps = ChessPiece.getAllPiecesWithGameID(gid);
    	for (let c = 0; c < mycps.length; c++) console.log(mycps.get(c));
    	console.log("mycps.length = " + mycps.length);
    }
    
    static testConvertingLocations()
    {
    	const iswhitedown = true;
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("H8", iswhitedown));//7,7
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("B8", iswhitedown));//7,1
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("C6", iswhitedown));//5,2
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("E5", iswhitedown));//4,4
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("F3", iswhitedown));//2,5
    	ChessPiece.printOneDIntArray(ChessPiece.convertStringLocToRowCol("D3", iswhitedown));//2,3
    	console.log(ChessPiece.convertRowColToStringLoc(7, 7, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(7, 1, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(5, 2, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(4, 4, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(2, 5, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(2, 3, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("H8", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("B8", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("C6", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("E5", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("D3", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("X9", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLoc(
			ChessPiece.convertStringLocToRowCol("A9", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    }
    
    static testGetPiecesGuardingLocation(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	const iswhitedown = true;
    	//console.log(ChessPiece.getPiecesGuardingLocation(6, 0));
    	//console.log();
    	//console.log(ChessPiece.getPiecesGuardingLocation(7, 4));
    	//console.log();
    	console.log("GETTING ENEMY PIECES GUARDING LOCATION (7, 4) " +
    		ChessPiece.convertRowColToStringLoc(7, 4, ChessPiece.WHITE_MOVES_DOWN_RANKS) +
			" NOW:");
    	console.log(ChessPiece.getEnemyPiecesGuardingLocation(7, 4, gid, null));
    	
    	console.log("GETTING ALL PIECES GUARDING LOCATION (6, 7) " +
    		ChessPiece.convertRowColToStringLoc(6, 7, ChessPiece.WHITE_MOVES_DOWN_RANKS) +
			" NOW:");
    	let nloc = ChessPiece.convertStringLocToRowCol("H5", iswhitedown);
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("QUEEN", "BLACK", nloc, gid, false));
    	//let ignorelist = null;
    	console.log("NORMAL RESULTS WITHOUT ADDING ANY PIECES OR EXCLUDING ANY:");
    	let nrmlcps = ChessPiece.getPiecesGuardingLocation(6, 7, gid, null, null);
		//ignorelist, addpcs
    	console.log(nrmlcps);
    	console.log();
    	console.log("RESULTS WITH THE ADDITION OF A BLACK QUEEN AT (" + nloc[0] + ", " +
			nloc[1] + "):");
    	let nrmlwithaddpcs = ChessPiece.getPiecesGuardingLocation(6, 7, gid, null, addpcs);
    	//ignorelist, addpcs
    	console.log(nrmlwithaddpcs);
    	console.log();
    	let runigpwntst = true;
    	if (runigpwntst)
    	{
    		console.log("RESULTS WITH IGNORING PAWN AT (6, 7), BUT INCLUDING BLACK QUEEN AT (" +
				nloc[0] + ", " + nloc[1] + "):");
    	}
    	let ignorelist = [[6, 7]];//new int[1][2];//(6, 5)
    	//let myintarr = [];//new int[2];
    	//console.log(ChessPiece.getNumItemsInList(myintarr));
    	let nopwnwithaddpcs = null;
    	if (runigpwntst)
    	{
    		nopwnwithaddpcs = ChessPiece.getPiecesGuardingLocation(6, 7, gid, ignorelist, addpcs);
			//7,4
    		console.log(nopwnwithaddpcs);
    		//now filter the list...
    		//console.log(ChessPiece.filterListByColor(nopwnwithaddpcs, "BLACK"));
    		//if more than zero, piece would be in check under certain setup
    		console.log("addpcs = " + addpcs);
    		let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    		//console.log(nwpcslist);
    		ChessPiece.printBoard(nwpcslist);
    		//console.log(ChessPiece.isBoardValid(nwpcslist));
    		console.log("DONE TESTING PRINT NEW SETUP BOARD!");
    	}
    	//else;//do nothing
    	
    	ChessPiece.printBoard(gid);
    	//not true for all test cases, but must be true for this case
    	if (nrmlcps.length + 1 === nrmlwithaddpcs.length);
    	else throw new Error("ADDING A QUEEN TEST FAILED!");
    	if (runigpwntst)
    	{
    		if (nrmlcps.length === nopwnwithaddpcs.length);
    		else throw new Error("IGNORING A PAWN TEST FAILED!");
    	}
    	//else;//do nothing
    	console.log(ChessPiece.isBoardValid(gid));
    }
    
    static setUpBoardTestIsEmptyMoveToLocsWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	const iswhitedown = true;
    	let ignorelist = [];//new int[2][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("H2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("H7", iswhitedown));
    	//add list is null
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, null, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a piece
		//can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, null));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, null));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: " +
			ChessPiece.getPiecesThatAreFreeToMove(ignorelist, null, gid));
    	console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	console.log();
    	
    	//returns false because there is a piece there on the normal board
    	console.log("IS (row: 1, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(1, 7, gid,
			ignorelist, null));
    	console.log("IS (row: 1, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(1, 7, nwpcslist));
    	console.log("IS (row: 6, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(6, 7, gid,
			ignorelist, null));
    	console.log("IS (row: 6, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(6, 7, nwpcslist));
    	
    	testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, null);
    	testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, null);
    	testCastleCanMoveToLocs(gid, 7, 7, "WHITE", ignorelist, null);
    	testCastleCanMoveToLocs(gid, 0, 7, "BLACK", ignorelist, null);
    }
    
    
    //STEP FORWARD AND BACKWARD THROUGH A GAME TESTS
    
    static testStepForwardAndBackwardThroughAGame(tstmvs, gid, isdone)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(isdone, "isdone");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		console.log();
    	console.log("INSIDE OF TEST STEP FORWARD AND BACKWARD THROUGH A GAME():");
    	console.log();
    	if (cc.isItemNullOrUndefined(tstmvs)) console.log("tstmvs = null!");
    	else if (tstmvs.length < 1) console.log("tstmvs is empty!");
    	else
    	{
    		console.log("tstmvs.length = " + tstmvs.length);
    		for (let x = 0; x < tstmvs.length; x++)
    		{
    			if (tstmvs[x] == null) console.log("tstmvs[" + x + "] = null!");
    			else if (tstmvs[x].length < 1) console.log("tstmvs[" + x + "] is empty!");
    			else
    			{
    				console.log("tstmvs[" + x + "].length = " + tstmvs[x].length);
    				for (let p = 0; p < tstmvs[x].length; p++)
    				{
    					console.log("tstmvs[" + x + "][" + p + "] = " + tstmvs[x][p]);
    				}
    			}
    		}
    	}
    	
    	let og = new ChessGame(gid, tstmvs, isdone, "BOTH");
    	//ChessPiece.setUpBoard(gid);
    	//og.stepBackward();//error
    	if (isdone)
    	{
    		og.stepForward();
    		//ChessPiece.printBoard(gid);
    		og.stepBackward();
    		ChessPiece.printBoard(gid);
    	}
    	//else;//do nothing will error out
    	//og.stepForward();
    	//og.stepForward();
    	//og.stepForward();
    	//og.stepForward();
    	//og.stepForward();
    	//og.stepForward();
    	//og.stepForward();//error
    	og.makeAllGivenOfficialMoves();
    	console.log();
    	console.log("BOARD FOR GAME WITH ID " + gid + ":");
    	ChessPiece.printBoard(gid);
    	console.log(og.getSideTurn(tstmvs, false) + "'S TURN NOW!");
    	console.log();
    }
    
    static testFourMoveCheckMateBlackViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoard(gid);
    	const iswhitedown = true;
    	const bpassimnxtmv = true;
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.convertAllLocationsForFullMoveCommands(
				this.getFourMoveCheckMateBlackMoves(), iswhitedown), gid, true);
    }
    
    static testColorsForMovesAlternateViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let onlymvwhite = false;
    	let onlymvblack = false;
    	let mymvs = [];//new String[11];
    	mymvs.push("WPNA7TOA5");
    	mymvs.push("BPNB2TOB4");
    	mymvs.push("WPNA5TOB4");
    	mymvs.push("BPNH2TOH4");
    	mymvs.push("WPNB4TOB3");
    	mymvs.push("BPNH4TOH5");
    	mymvs.push("WPNB3TOB2");
    	mymvs.push("BPNH5TOH6");
    	mymvs.push("WPNB2HINTS");
    	mymvs.push("WPNB2TOA1");
    	mymvs.push("WHINTS");
    	let numwmvs = 7;
    	let numbmvs = mymvs.length - numwmvs;
    	let mxmvs = -1;
    	if (onlymvwhite == onlymvblack)
    	{
    		if (onlymvwhite)
			{
				throw new Error("you are only moving white or only moving black, but not both!");
			}
			else mxmvs = mymvs.length;
    	}
    	else
    	{
    		if (onlymvwhite) mxmvs = numwmvs;
    		else mxmvs = numbmvs;
    	}
    	
    	let myunoffmvs = [];//new String[mxmvs];
    	if (mxmvs === mymvs.length)
		{
			for (let x = 0; x < mymvs.length; x++) myunoffmvs.push(mymvs[x]);
		}
    	else
    	{
    		const xsi = ((onlymvwhite) ? 0 : 1);
    		let mvi = 0;
    		for (let x = xsi; x < mymvs.length; x += 2)
    		{
    			if (mvi < mxmvs);
    			else break;
    			
    			myunoffmvs[mvi] = mymvs[x];
    			mvi++;
    			if (7 < x)
    			{
    				if (onlymvwhite) x--;
    				else break;
    			}
    			//else;//do nothing
    		}
    	}
    	let promotps = ["CASTLE", "BISHOP"];//new String[2];
    	ChessPiece.setUpBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true), gid,
			false);
    }
    
    static testOtherColorsAlternateViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let myunoffmvs = [];//new String[8];
    	myunoffmvs.push("WPNA7TOA5");
    	myunoffmvs.push("BPNB2TOB4");
    	myunoffmvs.push("WPNA5TOB4");
    	myunoffmvs.push("BPNH2TOH4");
    	myunoffmvs.push("WPNB4TOB3");
    	myunoffmvs.push("BPNH4TOH5");
    	myunoffmvs.push("WHINTS");
    	myunoffmvs.push("BPNH5TOH6");//errors out because white did not move
    	let promotps = ["CASTLE", "BISHOP"];//new String[2];
    	ChessPiece.setUpBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true),
			gid, false);
    }
    
    static testPawnPromotionViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let myunoffmvs = [];//new String[9];
    	myunoffmvs.push("WPNA7TOA5");
    	myunoffmvs.push("BPNB2TOB4");
    	myunoffmvs.push("WPNA5TOB4");
    	myunoffmvs.push("BPNH2TOH4");
    	myunoffmvs.push("WPNB4TOB3");
    	myunoffmvs.push("BPNH4TOH5");
    	myunoffmvs.push("WPNB3TOB2");
    	myunoffmvs.push("BPNH5TOH6");
    	myunoffmvs.push("WPNB2TOA1");
    	let promotps = ["CASTLE", "BISHOP"];//new String[2];
    	ChessPiece.setUpBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true),
			gid, false);
    }
    
    static testMovingPiecesAmbiguityViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let addambigcmd = false;
		const mxsz = ((addambigcmd) ? 8 : 7);
    	let myunoffmvs = [];//new String[mxsz];
    	myunoffmvs.push("WKTTOH6");
    	myunoffmvs.push("BPNTOA4");
    	myunoffmvs.push("WPNTOB5");
    	myunoffmvs.push("BPNTOH4");
    	myunoffmvs.push("WPNTOA4");
    	myunoffmvs.push("BCETOA3");
    	myunoffmvs.push("WPNTOG5");
    	if (addambigcmd) myunoffmvs.push("BCETOH3");//command should be ambiguous
    	//else;//do nothing
    	ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testCastlingViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let myunoffmvs = [];//new String[7];
    	myunoffmvs.push("WKTTOH6");
    	myunoffmvs.push("BPNTOA4");
    	myunoffmvs.push("WPNTOG5");
    	myunoffmvs.push("BPNTOH4");
    	myunoffmvs.push("WBPTOG7");
    	myunoffmvs.push("BCETOA3");
    	myunoffmvs.push("WKGTOG8");
    	ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testPawningViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let myunoffmvs = [];//new String[6];
    	myunoffmvs.push("WKTTOH6");
    	myunoffmvs.push("BPNTOB4");
    	myunoffmvs.push("WPNTOG5");
    	myunoffmvs.push("BPNTOB5");
    	myunoffmvs.push("WPNTOA5");
    	myunoffmvs.push("BPNTOA6");
    	ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testResignationViaStepingForwardThroughGame(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	let myunoffmvs = [];//new String[5];
    	myunoffmvs.push("WPNTOE6");
    	myunoffmvs.push("BPNTOF3");
    	myunoffmvs.push("WQNTOH4");
    	myunoffmvs.push("BRESIGNS");
    	myunoffmvs.push("WPNTOA5");//error
    	//myunoffmvs.push("BPNTOA3");
    	ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoard(gid);
    	testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    
    //TEST MOVE TO LOCS METHODS
    
    static testPieceCanMoveToLocs(gid, rval, cval, clrval, tpval, locsarrnm,
    	ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(rval, "rval");
		cc.letMustBeAnInteger(cval, "cval");
		cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		cc.letMustBeDefinedAndNotNull(tpval, "tpval");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	console.log();
    	//console.log("CALLING " + clrval + " " + tpval +
		//	" CAN MOVE TO LOCS WITH STARTING LOCATION " +
    	//	ChessPiece.getLocStringAndConvertIt(rval, cval) + "!");
    	let locs = ChessPiece.getPieceCanMoveToLocs(rval, cval, clrval, tpval, gid,
			ignorelist, addpcs);
    	console.log("RESULTS " + clrval + " " + tpval +
			" CAN MOVE TO LOCS WITH STARTING LOCATION " +
    		ChessPiece.getLocStringAndConvertIt(rval, cval) + "!");
    	ChessPiece.printLocsArray(locs, locsarrnm);
    }
    static testKingCanMoveToLocs(gid, kgr, kgc, kgclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(kgr, "kgr");
		cc.letMustBeAnInteger(kgc, "kgc");
		cc.letMustBeDefinedAndNotNull(kgclr, "kgclr");

		this.testPieceCanMoveToLocs(gid, kgr, kgc, kgclr, "KING", "initkgcanmvlocs",
			ignorelist, addpcs);
    }
    static testKnightCanMoveToLocs(gid, ktr, ktc, ktclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(ktr, "ktr");
		cc.letMustBeAnInteger(ktc, "ktc");
		cc.letMustBeDefinedAndNotNull(ktclr, "ktclr");

		this.testPieceCanMoveToLocs(gid, ktr, ktc, ktclr, "KNIGHT", "initktcanmvlocs",
			ignorelist, addpcs);
    }
    static testQueenCanMoveToLocs(gid, qr, qc, qclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(qr, "qr");
		cc.letMustBeAnInteger(qc, "qc");
		cc.letMustBeDefinedAndNotNull(qclr, "qclr");

		this.testPieceCanMoveToLocs(gid, qr, qc, qclr, "QUEEN", "initqncanmvlocs",
			ignorelist, addpcs);
    }
    static testBishopCanMoveToLocs(gid, br, bc, bclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(br, "br");
		cc.letMustBeAnInteger(bc, "bc");
		cc.letMustBeDefinedAndNotNull(bclr, "bclr");

		this.testPieceCanMoveToLocs(gid, br, bc, bclr, "BISHOP", "initbpcanmvlocs", ignorelist, addpcs);
    }
    static testCastleCanMoveToLocs(gid, cr, mcc, cclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(cr, "cr");
		cc.letMustBeAnInteger(mcc, "mcc");
		cc.letMustBeDefinedAndNotNull(cclr, "cclr");

		this.testPieceCanMoveToLocs(gid, cr, mcc, cclr, "CASTLE", "initclcanmvlocs",
			ignorelist, addpcs);
    }
    static testPawnCanMoveToLocs(gid, pr, pc, pclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(pr, "pr");
		cc.letMustBeAnInteger(pc, "pc");
		cc.letMustBeDefinedAndNotNull(pclr, "pclr");

		this.testPieceCanMoveToLocs(gid, pr, pc, pclr, "PAWN", "initpwncanmvlocs",
			ignorelist, addpcs);
    }
    
    //calls the above methods once for each type of piece
    static testCanMoveToLocs(gid, kgr, kgc, kgclr, ktr, ktc, ktclr,
    	cr, cc, cclr, br, bc, bclr, pr, pc, pclr, qr, qc, qclr,
    	ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");

		this.testKingCanMoveToLocs(gid, kgr, kgc, kgclr, ignorelist, addpcs);
    	this.testQueenCanMoveToLocs(gid, qr, qc, qclr, ignorelist, addpcs);
    	this.testBishopCanMoveToLocs(gid, br, bc, bclr, ignorelist, addpcs);
    	this.testCastleCanMoveToLocs(gid, cr, cc, cclr, ignorelist, addpcs);
    	this.testKnightCanMoveToLocs(gid, ktr, ktc, ktclr, ignorelist, addpcs);
    	this.testPawnCanMoveToLocs(gid, pr, pc, pclr, ignorelist, addpcs);
    }
    //loc lists in the order of: king, knight, castle (rook), bishop, pawn, queen
    static testCanMoveToLocs(gid, kgloc, kgclr, ktloc, ktclr,
    	cloc, cclr, bloc, bclr, ploc, pclr, qloc, qclr, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");

		this.testCanMoveToLocs(gid, kgloc[0], kgloc[1], kgclr, ktloc[0], ktloc[1],
			ktclr, cloc[0], cloc[1], cclr, bloc[0], bloc[1], bclr, ploc[0], ploc[1], pclr,
			qloc[0], qloc[1], qclr, ignorelist, addpcs);
    }
    //pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    static testCanMoveToLocs(gid, pcslocs, psclrs, ignorelist=null, addpcs=null)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeDefinedAndNotNull(pcslocs, "pcslocs");
		cc.letMustBeDefinedAndNotNull(psclrs, "psclrs");

		this.testCanMoveToLocs(gid, pcslocs[0][0], pcslocs[0][1], psclrs[0], pcslocs[1][0],
			pcslocs[1][1], psclrs[1], pcslocs[2][0], pcslocs[2][1], psclrs[2], pcslocs[3][0],
			pcslocs[3][1], psclrs[3], pcslocs[4][0], pcslocs[4][1], psclrs[4], pcslocs[5][0],
			pcslocs[5][1], psclrs[5], ignorelist, addpcs);
    }
    static testCanMoveToLocs(gid, ignorelist=null, addpcs=null)
    {
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	cc.letMustBeAnInteger(gid, "gid");
		this.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 6, 4, "WHITE", 7, 3, "WHITE", ignorelist, addpcs);
    }
    
    
    //DRIVER MAKE MOVE
    
    static driverMakeMove(cp, elocstr, iswhitedown, isuser, ptpval="QUEEN")
    {
    	cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		cc.letMustBeBoolean(isuser, "isuser");
		cc.letMustBeDefinedAndNotNull(cp, "cp");
		cc.letMustBeDefinedAndNotNull(elocstr, "elocstr");
		cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");

		ChessPiece.makeLocalShortHandMove(
    		cp.genMoveToCommand(ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown),
				ptpval), cp.getGameID(), false, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	cp.getGame().makeUnofficialMoveOfficial();
    }
    static driverMakeMove(cp, elocstr, iswhitedown, isuser)
    {
    	this.driverMakeMove(cp, elocstr, iswhitedown, isuser, "QUEEN");
    }
    static driverMakeMove(cp, elocstr, iswhitedown, ptpval="QUEEN")
    {
    	this.driverMakeMove(cp, elocstr, iswhitedown,
			cp.getGame().doesColorMatchMyColor(cp.getColor()), ptpval);
    }
    static driverMakeMove(cp, elocstr, iswhitedown)
    {
    	this.driverMakeMove(cp, elocstr, iswhitedown, "QUEEN");
    }
    static driverMakeMove(gid, slocstr, elocstr, iswhitedown, isuser, ptpval="QUEEN")
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		cc.letMustBeBoolean(isuser, "isuser");
		cc.letMustBeDefinedAndNotNull(cp, "cp");
		cc.letMustBeDefinedAndNotNull(slocstr, "slocstr");
		cc.letMustBeDefinedAndNotNull(elocstr, "elocstr");
		cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");

		let cp = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown),
			gid);
    	this.driverMakeMove(cp, elocstr, iswhitedown, isuser, ptpval);
    }
    static driverMakeMove(gid, slocstr, elocstr, iswhitedown, ptpval="QUEEN")
    {
    	let cp = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol(slocstr,
			iswhitedown), gid);
    	this.driverMakeMove(cp, elocstr, iswhitedown, ptpval);
    }
    static driverMakeMove(gid, slocstr, elocstr, iswhitedown, isuser)
    {
    	this.driverMakeMove(gid, slocstr, elocstr, iswhitedown, isuser, "QUEEN");
    }
    
    
    //SET UP BOARD METHODS
    
    static testResignation(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN E7 -> E6; WQN D8 -> H4; OWPN A7 -> A5;
		//BPN F2 -> F3; BLACK RESIGNS; BPN A2 -> A3;
		
		const iswhitedown = true;
		let isuser = false;
    	let wpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("E7", iswhitedown),
			gid);
    	this.driverMakeMove(wpn, "E6", iswhitedown, isuser);
    	
    	let bpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("F2", iswhitedown),
			gid);
    	this.driverMakeMove(bpn, "F3", iswhitedown, isuser);
    	
    	let wqn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("D8", iswhitedown),
			gid);
    	this.driverMakeMove(wqn, "H4", iswhitedown, isuser);
    	ChessPiece.printBoard(gid);
    	
    	let rsgmv = ChessPiece.getFullResignationCommand("BLACK");
    	ChessPiece.makeLocalShortHandMove(rsgmv, gid, false,
			ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	
    	let tstcrash = false;
    	if (tstcrash)
    	{
    		let owpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A7",
				iswhitedown), gid);
	    	this.driverMakeMove(owpn, "A5", iswhitedown, isuser);
	    	
	    	let obpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A2",
				iswhitedown), gid);
	    	this.driverMakeMove(obpn, "A3", iswhitedown, isuser);
    	}
    	else
    	{
    		ChessPiece.getGame(gid).stepBackward();
    		ChessPiece.getGame(gid).stepBackward();
    		ChessPiece.printBoard(gid);
    		ChessPiece.getGame(gid).stepForward();
    		ChessPiece.printBoard(gid);
    	}
    }
    
    //SET UP BOARD PAWN PROMOTION
    
    static setUpBoardForPawnPromotion(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//GOAL: PROMOTE WHITE PAWN TO SOMETHING?
    	//WPN AT A7 -> A5 -> B4 -> B3 -> B2 -> A1;
    	//BPN AT B2 -> B4; OBPN AT H2 -> H4 -> H5 -> H6;
    	const iswhitedown = true;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A7", iswhitedown),
			gid);
    	this.driverMakeMove(wpn, "A5", iswhitedown, isuser);
    	//wpn.genMoveToCommand(ChessPiece.convertStringLocToRowCol("A5", iswhitedown));
    	//wpn.setLoc(ChessPiece.convertStringLocToRowCol("A5", iswhitedown));
    	//wpn.setMoveCount(wpn.getMoveCount() + 1);
    	let bpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("B2", iswhitedown),
			gid);
    	this.driverMakeMove(bpn, "B4", iswhitedown, isuser);
    	
    	ChessPiece.printBoard(gid);
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	this.driverMakeMove(wpn, "B4", iswhitedown, isuser);
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	ChessPiece.printBoard(gid);
    	console.log(ChessPiece.isBoardValid(gid));
    	
    	let obpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("H2", iswhitedown),
			gid);
    	this.driverMakeMove(obpn, "H4", iswhitedown, isuser);
    	this.driverMakeMove(wpn, "B3", iswhitedown, isuser);
    	this.driverMakeMove(obpn, "H5", iswhitedown, isuser);
    	this.driverMakeMove(wpn, "B2", iswhitedown, isuser);
    	this.driverMakeMove(obpn, "H6", iswhitedown, isuser);
    	
    	let tstmovandpromote = false;
    	let mymvploc = null;
    	if (tstmovandpromote)
    	{
    		mymvploc = "B1";
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.removePieceAt(ChessPiece.convertStringLocToRowCol(mymvploc, iswhitedown),
				gid);
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	}
    	else mymvploc = "A1";
    	
    	ChessPiece.printBoard(gid);
    	let mymv = wpn.genMoveToCommand(ChessPiece.convertStringLocToRowCol(mymvploc,
			iswhitedown), "QUEEN");
    	
    	console.log();
    	console.log("INITIAL MOVE COMMAND NOW!");
    	for (let x = 0; x < mymv.length; x++) console.log("mymv[" + x + "] = " + mymv[x]);
    	console.log();
    	
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMove(wpn.genHintsCommandForSide(), gid, false,
		//	ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	
    	let tstlclmv = true;
    	if (tstlclmv)
    	{
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		let myscmd = "WPNB2TO" + mymvploc;
    		let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommand(myscmd, gid,
				"QUEEN", iswhitedown, false);
    		
    		console.log();
    		console.log("INITIAL FULL MOVE!");
    		for (let x = 0; x < fullmv.length; x++)
			{
				console.log("fullmv[" + x + "] = " + fullmv[x]);
			}
			console.log("**ChessPiece.WHITE_MOVES_DOWN_RANKS = " +
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		console.log();
    		
    		ChessPiece.makeLocalMove(fullmv, gid, false,
				ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    		//ChessPiece.makeLocalMove(mymv, gid, false,
			//	ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    		ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoard(gid);
    	}
    	//else;//do nothing
    	
    	let stoptest = false;
    	if (stoptest) throw new Error("UNDO GEN PROMOTE PAWN COMMAND FAILED!");
    	
    	if (tstlclmv)
    	{
    		console.log("WHITE CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromoted("WHITE", gid));
	    	console.log("BLACK CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromoted("BLACK", gid));
	    	
	    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		ChessPiece.getGame(gid).makeLastOfficialMoveUnofficial();
    		ChessPiece.makeLocalMove(myunmv, gid, true, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoard(gid);
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		ChessPiece.makeLocalMove(mymv, gid, false, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    		ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoard(gid);
    	}
    	else
    	{
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    	
	    	ChessPiece.removePieceAt(ChessPiece.convertStringLocToRowCol("A1", iswhitedown), gid);
	    	
	    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    	
	    	wpn.setLoc(ChessPiece.convertStringLocToRowCol("A1", iswhitedown));
	    	wpn.setMoveCount(wpn.getMoveCount() + 1);
	    	
	    	//test pawn promotion methods here
	    	ChessPiece.printBoard(gid);
	    	console.log("WHITE CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromoted("WHITE", gid));
	    	console.log("BLACK CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromoted("BLACK", gid));
	    	wpn.promotePawnTo("QUEEN");
	    	console.log(wpn);
	    	ChessPiece.printBoard(gid);
    	}
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	this.driverMakeMove(obpn, "G7", iswhitedown, isuser);
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	this.driverMakeMove(wpn, "B1", iswhitedown, isuser);
    	ChessPiece.printBoard(gid);
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	this.driverMakeMove(obpn, "H8", iswhitedown, isuser, "QUEEN");
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	//test pawn promotion methods here
    	ChessPiece.printBoard(gid);
    	console.log("WHITE CAN PROMOTE A PAWN: " +
			ChessPiece.canPawnForSideBePromoted("WHITE", gid));
    	console.log("BLACK CAN PROMOTE A PAWN: " +
			ChessPiece.canPawnForSideBePromoted("BLACK", gid));
    	//obpn.promotePawnTo("QUEEN");
    	console.log(obpn);
    	ChessPiece.printBoard(gid);
    }
    static setUpBoardForPawnPromotionWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//ignore white pawn at A7; add it at A1 (5 moves)
    	//ignore black castle at A1
    	//ignore black pawn at B2
    	//ignore black pawn at H2; add it at H6 (3 moves)
    	
    	const iswhitedown = true;
    	let ignorelist = [];//new int[4][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("H2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("B2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A1", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let wpn = new ChessPiece("PAWN", "WHITE",
    		ChessPiece.convertStringLocToRowCol("A1", iswhitedown), gid, 5, false);
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("H6", iswhitedown), gid, 3, false));
    	addpcs.push(wpn);
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test promotion methods here...
    	console.log("A WHITE PAWN CAN BE PROMOTED: " +
			ChessPiece.canPawnForSideBePromoted("WHITE", nwpcslist));
    	console.log("A BLACK PAWN CAN BE PROMOTED: " +
			ChessPiece.canPawnForSideBePromoted("BLACK", nwpcslist));
    	wpn.promotePawnTo("QUEEN");
    	console.log(wpn);
    	ChessPiece.printBoard(nwpcslist);
    	//black pawn at H6 -> G7 -> H8;
    	//WQN AT A1 -> B1;
    	let nwiglist = [];//new int[5][2];
    	nwiglist.push(ChessPiece.convertStringLocToRowCol("G7", iswhitedown));
    	nwiglist.push(ChessPiece.convertStringLocToRowCol("H8", iswhitedown));
    	nwiglist.push(ChessPiece.convertStringLocToRowCol("H6", iswhitedown));
    	nwiglist.push(ChessPiece.convertStringLocToRowCol("B1", iswhitedown));
    	nwiglist.push(ChessPiece.convertStringLocToRowCol("A1", iswhitedown));
    	let nwaddpcs = [];//new ArrayList<ChessPiece>();
    	let bpn = new ChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("H8", iswhitedown), gid, 5, false);
    	nwaddpcs.push(bpn);
    	nwaddpcs.push(new ChessPiece("QUEEN", "WHITE",
    		ChessPiece.convertStringLocToRowCol("B1", iswhitedown), gid, 6, false));
    	let myonwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(nwiglist, nwaddpcs, nwpcslist);
    	ChessPiece.printBoard(myonwpcslist);
    	console.log("A WHITE PAWN CAN BE PROMOTED: " +
			ChessPiece.canPawnForSideBePromoted("WHITE", myonwpcslist));
    	console.log("A BLACK PAWN CAN BE PROMOTED: " +
			ChessPiece.canPawnForSideBePromoted("BLACK", myonwpcslist));
    	bpn.promotePawnTo("QUEEN");
    	console.log(bpn);
    	ChessPiece.printBoard(myonwpcslist);
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 0, "WHITE", 0, 2, "BLACK", 1, 2, "BLACK", 7, 7, "BLACK",
    		ChessPiece.combineIgnoreLists(nwiglist, ignorelist), ChessPiece.combineTwoPieceLists(nwaddpcs, addpcs));
    }
    static setUpBoardForPawnPromotion(gid, movethere)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) this.setUpBoardForPawnPromotion(gid);
    	else this.setUpBoardForPawnPromotionWithoutMovingThere(gid);
    }
    
    //SET UP BOARD PAWNING
    
    static setUpBoardForPawning(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//BPN AT B2 -> B4 -> B5; WPN AT A7 -> A5; WKT AT G8 -> H6 -> F5
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("G8", iswhitedown),
			gid);
    	this.driverMakeMove(wkt, "H6", iswhitedown, isuser);
    	//ChessPiece.makeLocalShortHandMove(
    	//	wkt.genMoveToCommand(ChessPiece.convertStringLocToRowCol("H6", iswhitedown)),
		//	gid, false, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	//wkt.getGame(gid).makeUnofficialMoveOfficial();
    	
    	let bpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("B2", iswhitedown),
			gid);
    	this.driverMakeMove(bpn, "B4", iswhitedown, isuser);
    	this.driverMakeMove(wkt, "F5", iswhitedown, isuser);
    	this.driverMakeMove(bpn, "B5", iswhitedown, isuser);
    	
    	let wpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A7", iswhitedown),
			gid);
    	this.driverMakeMove(wpn, "A5", iswhitedown, isuser);
    	
    	ChessPiece.printBoard(gid);
    	//now test pawning methods here
    	console.log("WHITE CAN PAWN: " + ChessPiece.canSidePawn("WHITE", gid));
    	console.log("BLACK CAN PAWN: " + ChessPiece.canSidePawn("BLACK", gid));
    	let mymv = bpn.genMoveToCommand(ChessPiece.convertStringLocToRowCol("A6", iswhitedown));
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMove(bpn.genHintsCommandForSide(), gid, false);
    	let stoptest = false;
    	if (stoptest) throw new Error("UNDO GEN PAWN COMMAND FAILED!");
    	let scmd = "BLPNB5TOA6";
    	let oscmd = "BPNB5TOA6";
    	let myscmd = oscmd;//scmd
    	let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommand(myscmd, gid, "QUEEN",
			iswhitedown, false);
    	ChessPiece.makeLocalMove(fullmv, gid, false, iswhitedown, isuser);
    	//ChessPiece.makeLocalMove(mymv, gid, false);
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	//bpn.pawnLeft();
    	ChessPiece.printBoard(gid);
    	ChessPiece.getGame(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMove(myunmv, gid, true, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	ChessPiece.printBoard(gid);
    	
    	ChessPiece.getGame(gid).setUnofficialMove(mymv);
    	bpn.pawnLeft();
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	
    	ChessPiece.printBoard(gid);
    }
    static testPawningWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//ignore knight at G8; add it at F5
    	//ignore pawn at A7; add it at A5
    	//ignore pawn at B2; add it at B5
    	const iswhitedown = true;
    	let ignorelist = [];//new int[3][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("G8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("B2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let bpn = new ChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("B5", iswhitedown), gid, 2, false);
    	addpcs.push(bpn);
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("F5", iswhitedown), gid, 2, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//call canPawnLeft on Black Pawn
    	console.log("WHITE CAN PAWN: " + ChessPiece.canSidePawn("WHITE", nwpcslist));
    	console.log("BLACK CAN PAWN: " + ChessPiece.canSidePawn("BLACK", nwpcslist));
    	let bpwncanmvlocs = ChessPiece.getPieceCanMoveToLocs(bpn.getRow(), bpn.getCol(),
			"BLACK", "PAWN", gid, ignorelist, addpcs);
    	ChessPiece.printLocsArray(bpwncanmvlocs, "bpwncanmvlocs");
    	console.log("BLACK CAN PAWN LEFT: " + bpn.canPawnLeft(nwpcslist));
    	console.log("BLACK CAN PAWN RIGHT: " + bpn.canPawnRight(nwpcslist));
    	let bplftloc = bpn.getPawnLeftLocation(nwpcslist);
    	let bprgtloc = bpn.getPawnRightLocation(nwpcslist);
    	if (bplftloc == null) console.log("BLACK PAWNING MOVE TO LEFT LOCATION: null");
    	else
    	{
    		console.log("BLACK PAWNING MOVE TO LEFT LOCATION: " +
				ChessPiece.getLocString(bplftloc) + " IS: " +
    			ChessPiece.convertRowColToStringLoc(bplftloc, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	}
    	if (bprgtloc == null) console.log("BLACK PAWNING MOVE TO RIGHT LOCATION: null");
    	else
    	{
    		console.log("BLACK PAWNING MOVE TO RIGHT LOCATION: " +
				ChessPiece.getLocString(bprgtloc) + " IS: " +
    			ChessPiece.convertRowColToStringLoc(bprgtloc, ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	}
    	console.log("BLACK ENEMY PAWN FOR LEFT PAWNING: " +
			bpn.getEnemyPawnForLeftPawning(nwpcslist));
    	console.log("BLACK ENEMY PAWN FOR RIGHT PAWNING: " +
			bpn.getEnemyPawnForRightPawning(nwpcslist));
    	if (bplftloc == null)
		{
			console.log("BLACK PAWN CAN MOVE TO THE LEFT PAWNING LOCATION: false");
		}
		else
    	{
    		console.log("BLACK PAWN CAN MOVE TO THE LEFT PAWNING LOCATION: " +
    			bpn.canMoveTo(bplftloc[0], bplftloc[1], ignorelist, addpcs, false));
    	}
    	if (bprgtloc == null)
		{
			console.log("BLACK PAWN CAN MOVE TO THE RIGHT PAWNING LOCATION: false");
		}
		else
    	{
    		console.log("BLACK PAWN CAN MOVE TO THE RIGHT PAWNING LOCATION: " +
    			bpn.canMoveTo(bprgtloc[0], bprgtloc[1], ignorelist, addpcs, false));
    	}
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 7, 4, "WHITE", 4, 5, "WHITE", 7, 7, "WHITE", 0, 2,
			"BLACK", 4, 1, "BLACK", 0, 3, "BLACK", ignorelist, addpcs);
    }
    static testPawning(gid, movethere)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) this.setUpBoardForPawning(gid);
    	else this.testPawningWithoutMovingThere(gid);
    }
    
    //SET UP BOARD CASTLING
    
    static setUpBoardForCastlingWhiteRight(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//WKT AT G8 -> H6; WPN AT E7 -> E6; WBP AT F8 -> C5
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("G8", iswhitedown),
			gid);
    	this.driverMakeMove(wkt, "H6", iswhitedown, isuser);
    	//wkt.genMoveToCommand(ChessPiece.convertStringLocToRowCol("H6", iswhitedown));
    	//wkt.setLoc(ChessPiece.convertStringLocToRowCol("H6", iswhitedown));
    	//wkt.setMoveCount(wkt.getMoveCount() + 1);
    	
    	let bpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A2",
			iswhitedown), gid);
    	this.driverMakeMove(bpn, "A4", iswhitedown, isuser);
    	
    	let wpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("E7",
			iswhitedown), gid);
    	this.driverMakeMove(wpn, "E6", iswhitedown, isuser);
    	this.driverMakeMove(bpn, "A5", iswhitedown, isuser);
    	
    	let wbp = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("F8",
			iswhitedown), gid);
    	this.driverMakeMove(wbp, "C5", iswhitedown, isuser);
    	
    	let obpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("G2",
			iswhitedown), gid);
    	this.driverMakeMove(obpn, "G4", iswhitedown, isuser);
    	
    	//actually test the castling information here now...
    	console.log("WHITE CAN CASTLE: " + ChessPiece.canSideCastle("WHITE", gid));
    	console.log("BLACK CAN CASTLE: " + ChessPiece.canSideCastle("BLACK", gid));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    	ChessPiece.printBoard(gid);
    	let mymv = ChessPiece.genCastlingMoveToCommand("WHITE", false, gid, null, null);
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMove(wpn.genHintsCommandForSide(), gid, false);
    	let stoptest = false;
    	if (stoptest) throw new Error("UNDO GEN CASTLING COMMAND FAILED!");
    	let scmd = "WRCE:";
    	let oscmd = "WKGE8TOG8";
    	let myscmd = oscmd;//scmd
    	let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommand(myscmd, gid,
			"QUEEN", iswhitedown, false);
    	ChessPiece.makeLocalMove(fullmv, gid, false, iswhitedown, isuser);
    	//ChessPiece.makeLocalMove(mymv, gid, false, iswhitedown, isuser);
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	//ChessPiece.whiteCastleRight(gid, null, null);
		//move count will be automatically incremented in this method
    	ChessPiece.printBoard(gid);
    	
    	ChessPiece.getGame(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMove(myunmv, gid, true, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	
    	ChessPiece.printBoard(gid);
    	ChessPiece.getGame(gid).setUnofficialMove(mymv);
    	ChessPiece.whiteCastleRight(gid, null, null);
		//move count will be automatically incremented in this method
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    }
    static setUpBoardForCastlingWhiteRightWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//WKT AT G8 -> H6; WPN AT E7 -> E6; WBP AT F8 -> C5
    	//BPN AT A2 -> A4 -> A5; BPN AT G2 -> G4
    	const iswhitedown = true;
    	let ignorelist = [];//new int[5][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("G8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("E7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("F8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("G2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("G4", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("H6", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("BISHOP", "WHITE",
			ChessPiece.convertStringLocToRowCol("C5", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//actually test the castling information here now...
    	console.log("WHITE CAN CASTLE: " +
			ChessPiece.canSideCastle("WHITE", gid, ignorelist, addpcs));
    	console.log("BLACK CAN CASTLE: " +
			ChessPiece.canSideCastle("BLACK", gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 7, 4, "WHITE", 5, 7, "WHITE", 7, 7, "WHITE", 4, 2,
			"WHITE", 6, 1, "WHITE", 7, 3, "WHITE", ignorelist, addpcs);
    }
    static setUpBoardForCastlingWhiteRight(gid, movethere)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(movethere, "movethere")
		if (movethere) this.setUpBoardForCastlingWhiteRight(gid);
    	else this.setUpBoardForCastlingWhiteRightWithoutMovingThere(gid);
    }
    
    //SETUP BOARD CHECK
    
    static setUpBoardWithKnightCheckingKing(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//White Knight at B8 -> C6 -> E5 -> (F3 OR D3)
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("B8", iswhitedown),
			gid);
    	let mymv = wkt.genMoveToCommand(ChessPiece.convertStringLocToRowCol("C6", iswhitedown));
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	//wkt.setLoc(ChessPiece.convertStringLocToRowCol("C6", iswhitedown));
    	//wkt.setMoveCount(wkt.getMoveCount() + 1);
    	ChessPiece.makeLocalMove(mymv, gid, false, ChessPiece.WHITE_MOVES_DOWN_RANKS, isuser);
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	
    	let bpn = ChessPiece.getPieceAt(ChessPiece.convertStringLocToRowCol("A2", iswhitedown),
			gid);
    	this.driverMakeMove(bpn, "A4", iswhitedown, isuser);
    	this.driverMakeMove(wkt, "E5", iswhitedown, isuser);
    	this.driverMakeMove(bpn, "A5", iswhitedown, isuser);
    	this.driverMakeMove(wkt, "F3", iswhitedown, isuser);
    	ChessPiece.printBoard(gid);
    	//now test check and figure out how to get out of it
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithKnightCheckingKingWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//White Knight at B8 -> C6 -> E5 -> (F3 OR D3)
    	//ignore knight at B8; add it at F3 OR D3;
    	//ignore pawn at A2; add it at A5;
    	const iswhitedown = true;
    	let ignorelist = [];//new int[2][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("B8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 2, false));
    	addpcs.push(new ChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown), gid, 3, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//now test check and figure out how to get out of it
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", nwpcslist);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", nwpcslist);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 0, "BLACK", 7, 2,
			"WHITE", 1, 6, "BLACK", 0, 3, "BLACK", ignorelist, addpcs);
    }
    static setUpBoardWithKnightCheckingKing(gid, movethere)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) this.setUpBoardWithKnightCheckingKing(gid);
    	else this.setUpBoardWithKnightCheckingKingWithoutMovingThere(gid);
    }
    
    //black queen checks white king
    static setUpFutureCheck(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//now set up future check scenario
    	const iswhitedown = true;
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	let wqn = ChessPiece.getPieceAt(7, 3, gid);
    	let bqn = ChessPiece.getPieceAt(0, 3, gid);
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("QUEEN", "BLACK",
			ChessPiece.convertStringLocToRowCol("H5", iswhitedown), gid, false));
    	let ignorelist = [[6, 5]];//new int[1][2];
    	let gwklocs = ChessPiece.getPiecesGuardingLocation(7, 4, gid, ignorelist, addpcs);
    	console.log("addpcs = " + addpcs);
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	console.log();
    	
    	console.log("ACCORDING TO THE FUTURE BOARD:");
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE QUEEN IS IN CHECK: " + wqn.inCheck(ignorelist, addpcs));
    	console.log("BLACK QUEEN IS IN CHECK: " + bqn.inCheck(ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	console.log();
    	
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 6, 6, "WHITE", 4, 7, "BLACK", ignorelist, addpcs);
    	console.log();
    	//console.log(ChessPiece.getCountsForEachPieceTypeForASide(ChessPiece.getPieceTypes(
    	//			ChessPiece.filterListByColor(nwpcslist, "BLACK"))));
    	//let tstpctps = ["KING", "CASTLE", "CASTLE", "CASTLE", "CASTLE", "CASTLE",
		//	"CASTLE", "CASTLE", "CASTLE", "CASTLE", "CASTLE", "QUEEN", "QUEEN"];
    	//console.log(ChessPiece.getCountsForEachPieceTypeForASide(tstpctps));
    	//console.log(ChessPiece.isBoardValid(nwpcslist));
    	
    	ChessPiece.printBoard(gid);
    	console.log();
    	
    	console.log("ACCORDING TO THE ACTUAL BOARD:");
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE QUEEN IS IN CHECK: " + wqn.inCheck());
    	console.log("BLACK QUEEN IS IN CHECK: " + bqn.inCheck());
    	console.log();
    	//console.log(ChessPiece.getPiecesGuardingLocation(2, 2));
    	//console.log();
    }
    
    //SETUP BOARD CHECKMATE
    
    static setUpBoardWithFourMoveCheckMate(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN AT E7 -> E6; WBP AT F8 -> C5; WQN AT D8 -> F6 -> F2
		//BPN AT A2 -> A4 -> A5 -> A6
    	
    	let iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAt(6, 4, gid);//E7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommand(5, 4), gid, false, iswhitedown,
			isuser);//E6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAt(1, 0, gid);//A2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommand(3, 0), gid, false, iswhitedown,
			isuser);//A4
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    	let wqn = ChessPiece.getPieceAt(7, 3, gid);//D8
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommand(5, 5), gid, false, iswhitedown,
			isuser);//F6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommand(4, 0), gid, false, iswhitedown,
			isuser);//A5
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let wbp = ChessPiece.getPieceAt(7, 5, gid);//F8
    	ChessPiece.makeLocalShortHandMove(wbp.genMoveToCommand(4, 2), gid, false, iswhitedown,
			isuser);//C5
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommand(5, 0), gid, false, iswhitedown,
			isuser);//A6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommand(1, 5), gid, false, iswhitedown,
			isuser);//F2
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithFourMoveCheckMateWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//ignore queen at D8; add it at F2
    	//ignore pawn at E7; add it at E6
    	//ignore bishop at F8; add it at C5
    	//ignore pawn at A2; add it at A6
    	const iswhitedown = true;
    	let ignorelist = [];//new int[4][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("F8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("E7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("D8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("BISHOP", "WHITE",
			ChessPiece.convertStringLocToRowCol("C5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("QUEEN", "WHITE",
			ChessPiece.convertStringLocToRowCol("F2", iswhitedown), gid, 2, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A6", iswhitedown), gid, 3, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 7, "BLACK", 0, 5, "BLACK", 1, 4, "BLACK", 1, 5, "WHITE",
    		ignorelist, addpcs);
    }
    static setUpBoardWithFourMoveCheckMate(gid, movethere)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) this.setUpBoardWithFourMoveCheckMate(gid);
    	else this.setUpBoardWithFourMoveCheckMateWithoutMovingThere(gid);
    }
    
    static getFourMoveCheckMateBlackMoves()
    {
    	let tstmvs = [];//new String[7][];
    	tstmvs.push(["WPNE7TOE6"]);//new String[1];
    	//tstmvs[0][0] = "WPNE7TOE6";
    	tstmvs.push(["BPNA2TOA4"]);//new String[1];
    	//tstmvs[1][0] = "BPNA2TOA4";
    	tstmvs.push(["WQND8TOF6"]);//new String[1];
    	//tstmvs[2][0] = "WQND8TOF6";
    	tstmvs.push(["BPNA4TOA5"]);//new String[1];
    	//tstmvs[3][0] = "BPNA4TOA5";
    	tstmvs.push(["WBPF8TOC5"]);//new String[1];
    	//tstmvs[4][0] = "WBPF8TOC5";
    	tstmvs.push(["BPNA5TOA6"]);//new String[1];
    	//tstmvs[5][0] = "BPNA5TOA6";
    	tstmvs.push(["-BPNF2W0MS", "WQNF6TOF2"]);//new String[2];
    	//tstmvs[6][0] = "-BPNF2W0MS";
    	//tstmvs[6][1] = "WQNF6TOF2";
    	return tstmvs;
    }
    
    static setUpBoardWithTwoMoveCheckMateBlack(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	const iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAt(6, 4, gid);//E7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommand(5, 4), gid, false, iswhitedown,
			isuser);//E6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAt(1, 5, gid);//F2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommand(2, 5), gid, false, iswhitedown,
			isuser);//F3
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let owpn = ChessPiece.getPieceAt(6, 0, gid);//A7
    	ChessPiece.makeLocalShortHandMove(owpn.genMoveToCommand(5, 0), gid, false, iswhitedown,
			isuser);//A6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let obpn = ChessPiece.getPieceAt(1, 6, gid);//G2
    	ChessPiece.makeLocalShortHandMove(obpn.genMoveToCommand(3, 6), gid, false, iswhitedown,
			isuser);//G4
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	//ChessPiece.printBoard(gid);
    	let wqn = ChessPiece.getPieceAt(7, 3, gid);//D8
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommand(3, 7), gid, false, iswhitedown,
			isuser);//H4
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithTwoMoveCheckMateBlackWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//BPN AT F2 -> F3; OBPN AT G2 -> G4;
		//WPN AT E7 -> E6; WQN AT D8 -> H4; OWPN AT A7 -> A5;
		
		const iswhitedown = true;
		let ignorelist = [];//new int[5][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("F2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("E7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("D8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("G2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("QUEEN", "WHITE",
			ChessPiece.convertStringLocToRowCol("H4", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("G4", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 7, "BLACK", 0, 5,
			"BLACK", 1, 4, "BLACK", 3, 7, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWithTwoMoveCheckMateWhite(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN AT F7 -> F6; OWPN AT G7 -> G5;
    	//BPN AT E2 -> E3; BQN AT D1 -> H5
    	
    	const iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAt(6, 5, gid);//F7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommand(5, 5), gid, false, iswhitedown,
			isuser);//F6
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAt(1, 4, gid);//E2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommand(2, 4), gid, false, iswhitedown,
			isuser);//E3
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let owpn = ChessPiece.getPieceAt(6, 6, gid);//G7
    	ChessPiece.makeLocalShortHandMove(owpn.genMoveToCommand(4, 6), gid, false, iswhitedown,
			isuser);//G5
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	let bqn = ChessPiece.getPieceAt(0, 3, gid);//D1
    	ChessPiece.makeLocalShortHandMove(bqn.genMoveToCommand(4, 7), gid, false, iswhitedown,
			isuser);//H5
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithTwoMoveCheckMateWhiteWithoutMovingThere(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//WPN AT F7 -> F6; OWPN AT G7 -> G5;
    	//BPN AT E2 -> E3; BQN AT D1 -> H5
    	
    	const iswhitedown = true;
    	let ignorelist = [];//new int[4][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("E2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("F7", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("D1", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("G7", iswhitedown));
    	let addpcs = [];
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("F6", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("G5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("QUEEN", "BLACK",
			ChessPiece.convertStringLocToRowCol("H5", iswhitedown), gid, 1, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("E3", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	this.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 7, 4, "WHITE", 4, 7, "BLACK", ignorelist, addpcs);
    }
    //calls the above two move checkmate methods
    static setUpBoardWithTwoMoveCheckMate(gid, usewhite, movethere)
    {
    	if (usewhite)
    	{
    		if (movethere) this.setUpBoardWithTwoMoveCheckMateWhite(gid);
    		else this.setUpBoardWithTwoMoveCheckMateWhiteWithoutMovingThere(gid);
    	}
    	else
    	{
    		if (movethere) this.setUpBoardWithTwoMoveCheckMateBlack(gid);
    		else this.setUpBoardWithTwoMoveCheckMateBlackWithoutMovingThere(gid);
    	}
    }
    static setUpBoardWithTwoMoveCheckMateWhite(gid, movethere)
    {
    	this.setUpBoardWithTwoMoveCheckMate(gid, true, movethere);
    }
    static setUpBoardWithTwoMoveCheckMateBlack(gid, movethere)
    {
    	this.setUpBoardWithTwoMoveCheckMate(gid, false, movethere);
    }
    
    static setUpBoardCheckmateKingBishopVSameDiffColorSquares(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//ignore everything except the kings
    	//then add a bunch of blocked pawns that cannot move
    	let ignorelist = [];//new int[32][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			//if (c === 4 && (r === 0 || r === 7));
    			//else
    			//{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			//}
    		}
    		if (r === 1) r = 5;
    	}
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(new ChessPiece("BISHOP", "BLACK", 1, 0, gid, 5, false));
    	addpcs.push(new ChessPiece("BISHOP", "WHITE", 2, 2, gid, 5, false));
    	let bkg = new ChessPiece("KING", "BLACK", 0, 0, gid, 5, false);
    	addpcs.push(bkg);
    	let wkg = new ChessPiece("KING", "WHITE", 1, 2, gid, 5, false);
    	addpcs.push(wkg);
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid,
			ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid,
			ignorelist, addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 1, 2, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 0, "BLACK", ignorelist, addpcs);
    	this.testBishopCanMoveToLocs(gid, 1, 0, "BLACK", ignorelist, addpcs);
    	this.testBishopCanMoveToLocs(gid, 2, 2, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWhiteCheckmateAfterManyMoves(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//ignore all pieces except white pawn at 6, 0 A6
    	let ignorelist = [];//new int[31][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			//if (c === 4 && (r === 0 || r === 7));
    			if (r === 6 && c === 0);//keep the white pawn
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r == 1) r = 5;
    	}
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let bkg = new ChessPiece("KING", "BLACK", 0, 6, gid, 3, false);
    	addpcs.push(bkg);
    	let wkg = new ChessPiece("KING", "WHITE", 7, 0, gid, 4, false);
    	addpcs.push(wkg);
    	addpcs.push(new ChessPiece("CASTLE", "BLACK", 0, 1, gid, 1, false));
    	addpcs.push(new ChessPiece("CASTLE", "BLACK", 7, 4, gid, 3, false));
    	addpcs.push(new ChessPiece("QUEEN", "BLACK", 5, 0, gid, 2, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("FREE PIECES: " + ChessPiece.getPiecesThatAreFreeToMove(gid,
			ignorelist, addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid,
			ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid,
			ignorelist, addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 7, 0, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 6, "BLACK", ignorelist, addpcs);
    	//this.testBishopCanMoveToLocs(gid, r, c, "BLACK", ignorelist, addpcs);
    	//this.testBishopCanMoveToLocs(gid, r, c, "WHITE", ignorelist, addpcs);
    }
    
    //SETUP BOARD STALEMATE
    
    static setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, addstuckpawns)
    {
    	cc.letMustBeBoolean(addstuckpawns, "addstuckpawns");
		cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//ignore everything except the kings
    	//then add a bunch of blocked pawns that cannot move
    	let ignorelist = [];//new int[30][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			if (c === 4 && (r === 0 || r === 7));
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r === 1) r = 5;
    	}
    	let addpcs = null;
    	let incbyval = 2;//change this for the spacing of the pawns, must be 2 or 3 for stalemate
    	let csi = 0;//change where the pawns start colum
    	let rsi = 3;//change where the pawns start row
    	if (addstuckpawns)
    	{
    		addpcs = [];//new ArrayList<ChessPiece>();
    		for (let r = rsi; r < rsi + 2 && r < 8; r++)
    		{
    			let npcclr = "";
    			let initmvcnt = 1;
    			if (r === rsi)
    			{
    				npcclr = "BLACK";
    				if (rsi === 3) initmvcnt = 1;
    				else if (rsi === 2) initmvcnt = 1;
    				else if (rsi === 4) initmvcnt = 2;
    				else if (rsi === 5) initmvcnt = 3;
    				else if (rsi === 1) initmvcnt = 0;
    				else throw new Error("Illegal postion for BLACK row of pawns!");
    			}
    			else
    			{
    				npcclr = "WHITE";
    				if (rsi === 3) initmvcnt = 1;
    				else if (rsi === 2) initmvcnt = 2;
    				else if (rsi === 4) initmvcnt = 1;
    				else if (rsi === 5) initmvcnt = 0;
    				else if (rsi === 1) initmvcnt = 3;
    				else throw new Error("Illegal postion for WHITE row of pawns!");
    			}
    			//if c increments by 3, 2 stalemate, but if not game is not over
    			//if colors of the kings are swapped, game is not over
    			for (let c = csi; c < 8; c += incbyval)
    			{
    				addpcs.push(new ChessPiece("PAWN", "" + npcclr, r, c, gid, initmvcnt, false));
    			}
    		}
    	}
    	//else;//do nothing
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	//console.log("WHITE HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesWhiteHaveNoLegalMoves(gid, ignorelist, addpcs));
    	//console.log("BLACK HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesBlackHaveNoLegalMoves(gid, ignorelist, addpcs));
    	//ChessPiece.printLocsArray(ChessPiece.getAllLocsThatCanBeReachedByPiece(wkg.getRow(),
		//	wkg.getCol(), "KING", "WHITE",
    	//	gid, ignorelist, addpcs), "wkingpossiblecanmovetolocs");
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid,
			ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid,
			ignorelist, addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, addpcs);
    	if (addstuckpawns)
    	{
    		let ccl = -1;
    		if (csi == 0)
    		{
    			if (incbyval === 2 || incbyval === 1) ccl = 4;
    			else ccl = 3;
    		}
    		else if (csi == 1)
    		{
    			if (incbyval === 1) ccl = 4;
    			else if (incbyval === 3) ccl = 4;
    			else ccl = 3;
    		}
    		//else;//do nothing not a stalemate
    		this.testPawnCanMoveToLocs(gid, 3, ccl, "BLACK", ignorelist, addpcs);
    		this.testPawnCanMoveToLocs(gid, 4, ccl, "WHITE", ignorelist, addpcs);
    	}
    	//else;//do nothing
    }
    static setUpBoardWithKingVKingAndStuckPawnsWithoutMovingThere(gid)
    {
    	this.setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, true);
    }
    static setUpBoardWithKingVKingOnlyWithoutMovingThere(gid)
    {
    	this.setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, false);
    }
    
    static setUpBoardWithKingAndBishopsVKingBishops(gid, numbkbps, numwtbps, usesmt)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		cc.letMustBeAnInteger(numbkbps, "numbkbps");
		cc.letMustBeAnInteger(numwtbps, "numwtbps");
		cc.letMustBeBoolean(usesmt, "usesmt");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	else if ((0 < numbkbps || numbkbps === 0) && (numbkbps < 8 || numbkbps === 8));
		else throw new Error("illegal number of black bishops found and used here!");
		if ((0 < numwtbps || numwtbps === 0) && (numwtbps < 8 || numwtbps === 8));
		else throw new Error("illegal number of white bishops found and used here!");
		
		//ignore everything except the kings
    	//then add a bunch of blocked pawns that cannot move
    	let ignorelist = [];//new int[30][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			if (c === 4 && (r === 0 || r === 7));
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r === 1) r = 5;
    	}
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let r = 0;
    	let c = 0;
    	for (let x = 0; x < numbkbps; x++)
    	{
    		r = x;
    		c = x;
    		addpcs.push(new ChessPiece("BISHOP", "BLACK", r, c, gid, 5, false));
    	}
    	r = 0;
    	c = 0;
    	let csi = 6;
    	if (usesmt) csi = 6;
    	else csi = 7;
    	for (let x = 0; x < numwtbps; x++)
    	{
    		r = x;
    		c = csi - x;
    		if (r === c)
    		{
    			x--;
    			continue;
    		}
    		else addpcs.push(new ChessPiece("BISHOP", "WHITE", r, c, gid, 5, false));
    	}
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: " + ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist,
			addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	//console.log("WHITE HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesWhiteHaveNoLegalMoves(gid, ignorelist, addpcs));
    	//console.log("BLACK HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesBlackHaveNoLegalMoves(gid, ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, ignorelist,
			addpcs));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, ignorelist,
			addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, addpcs);
    	//this.testBishopCanMoveToLocs(gid, int br, int bc, String bclr, ignorelist, addpcs);
    }
    static setUpBoardWithKingAndBishopsVKingBishops(gid, numbkbps, numwtbps)
    {
    	this.setUpBoardWithKingAndBishopsVKingBishops(gid, numbkbps, numwtbps, true);
    }
    
    static setUpBoardWithBlockedPawnsAndBishops(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//ignore everything except the kings
    	//then add a bunch of blocked pawns that cannot move
    	let ignorelist = [];//new int[30][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			//if (c === 4 && (r === 0 || r === 7));//keep the kings
    			if ((r === 1 || r === 6) && (c === 4 || c === 6));//keep 2 black and white pawns
    			else if ((r === 0 || r === 7) && c === 5);//keep a black and a white bishop
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r === 1) r = 5;
    	}
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let bkg = new ChessPiece("KING", "BLACK", 0, 7, gid, 5, false);
    	let wkg = new ChessPiece("KING", "WHITE", 7, 7, gid, 5, false);
    	addpcs.push(bkg);
    	addpcs.push(wkg);
    	addpcs.push(new ChessPiece("PAWN", "BLACK", 5, 4, gid, 5, false));
    	addpcs.push(new ChessPiece("PAWN", "BLACK", 5, 6, gid, 5, false));
    	addpcs.push(new ChessPiece("PAWN", "WHITE", 2, 4, gid, 5, false));
    	addpcs.push(new ChessPiece("PAWN", "WHITE", 2, 6, gid, 5, false));
    	addpcs.push(new ChessPiece("BISHOP", "WHITE", 3, 1, gid, 5, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: " + ChessPiece.getPiecesThatAreFreeToMove(gid,
			ignorelist, addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	//console.log("WHITE HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesWhiteHaveNoLegalMoves(gid, ignorelist, addpcs));
    	//console.log("BLACK HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesBlackHaveNoLegalMoves(gid, ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 7, 7, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 7, "BLACK", ignorelist, addpcs);
    	this.testBishopCanMoveToLocs(gid, 3, 1, "WHITE", ignorelist, addpcs);
    	this.testBishopCanMoveToLocs(gid, 7, 5, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWithKingAndKnightVKing(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//ignore everything except the kings
    	//then add a bunch of blocked pawns that cannot move
    	let ignorelist = [];//new int[30][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			if (c === 4 && (r === 0 || r === 7));//keep kings
    			else if (c === 6 && r === 7);//keep a knight
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r === 1) r = 5;
    	}
    	//do not need to add any pieces
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, null, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, null));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, null));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: " +
			ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist, null));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	//console.log("WHITE HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesWhiteHaveNoLegalMoves(ignorelist, null, gid));
    	//console.log("BLACK HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesBlackHaveNoLegalMoves(ignorelist, null, gid));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, null));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, null));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, null));
    	
    	this.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, null);
    	this.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, null);
    	this.testKnightCanMoveToLocs(gid, 7, 6, "WHITE", ignorelist, null);
    }
    
    static setUpBoardWhiteStalemateAfterManyMoves(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//ignore all pieces except white pawn at 6, 0 A6
    	let ignorelist = [];//new int[31][2];
    	let ili = 0;
    	for (let r = 0; r < 8; r++)
    	{
    		for (let c = 0; c < 8; c++)
    		{
    			//if (c === 4 && (r === 0 || r === 7));
    			if (r === 6 && c === 0);//keep the white pawn
    			else
    			{
    				ignorelist.push([r, c]);
					//ignorelist[ili][0] = r;
    				//ignorelist[ili][1] = c;
    				ili++;
    			}
    		}
    		if (r === 1) r = 5;
    	}
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	let bkg = new ChessPiece("KING", "BLACK", 0, 6, gid, 3, false);
    	addpcs.push(bkg);
    	let wkg = new ChessPiece("KING", "WHITE", 7, 0, gid, 4, false);
    	addpcs.push(wkg);
    	addpcs.push(new ChessPiece("CASTLE", "BLACK", 0, 1, gid, 1, false));
    	addpcs.push(new ChessPiece("QUEEN", "BLACK", 5, 0, gid, 2, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("FREE PIECES: " +
			ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist, addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	//console.log("WHITE HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesWhiteHaveNoLegalMoves(gid, ignorelist, addpcs));
    	//console.log("BLACK HAS NO LEGAL MOVES IT CAN MAKE: " +
    	//	ChessPiece.doesBlackHaveNoLegalMoves(gid, ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	
    	this.testKingCanMoveToLocs(gid, 7, 0, "WHITE", ignorelist, addpcs);
    	this.testKingCanMoveToLocs(gid, 0, 6, "BLACK", ignorelist, addpcs);
    	//this.testBishopCanMoveToLocs(gid, r, c, "BLACK", ignorelist, addpcs);
    	//this.testBishopCanMoveToLocs(gid, r, c, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWhiteStalemateKingAndQueenVsKing(gid)
    {
    	cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) throw new Error("GAME ID must be at least 1!");
    	//else;//do nothing

		//black king on a corner
    	//white king diagnal 2 spots away from it
    	//white queen needs to move to a position
    	let mypcs = [];//new ArrayList<ChessPiece>();
    	mypcs.push(new ChessPiece("KING", "BLACK", 7, 0, gid, 10, false));
    	mypcs.push(new ChessPiece("KING", "WHITE", 5, 2, gid, 10, false));
    	mypcs.push(new ChessPiece("QUEEN", "WHITE", 6, 3, gid, 10, false));
    	ChessPiece.setUpBoard(gid, mypcs);
    	ChessPiece.printBoard(gid);
    	//now program the move(s)
    	let iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wqn = ChessPiece.getPieceAt(6, 3, gid);//D7
    	
    	let mymv = wqn.genMoveToCommand(6, 2);
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	//let myounmv = ChessPiece.genFullMoveCommandFromDisplayedCommand("UNDO", gid);
		//error no move to pull from
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myounmv);//error no move to pull from
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	
    	ChessPiece.makeLocalShortHandMove(mymv, gid, false, iswhitedown, isuser);//C7
    	//ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommand(6, 1), gid, false, iswhitedown);
		//B7
    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoard(gid);
    	//now print the results of stalemate and checkmate
    	let wkg = ChessPiece.getCurrentSideKing("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKing("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	//undo it
    	let myounmv = ChessPiece.genFullMoveCommandFromDisplayedCommand("UNDO", gid);
    	//console.log("MY UNDO MOVE:");
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//console.log("MY O UNDO MOVE:");
    	ChessPiece.convertAllShortHandMovesToLongVersion(myounmv);
    	
    	ChessPiece.getGame(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMove(myunmv, gid, true, iswhitedown, isuser);
    	//ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    	ChessPiece.getGame(gid).clearUnofficialMove();
    	ChessPiece.printBoard(gid);
    	console.log(ChessPiece.getGame(gid).getSideTurn() + "'S TURN!");
    	
    	let dodrawtests = true;
    	let tstdrawcmd = true;
    	if (tstdrawcmd && dodrawtests)
    	{
    		ChessPiece.makeLocalMove(
    			ChessPiece.getFullTieCommand("BLACK", true, false), gid, false, iswhitedown,
				isuser);
    	}
    	//else;//do nothing
    	
    	let tstrdoundocmds = true;
    	if (tstrdoundocmds)
    	{
    		console.log();
    		console.log("TEST REDO COMMAND:");
    		ChessPiece.makeLocalMove(ChessPiece.getGame(gid).genCommandToRedoLastUndoneMove(),
				gid, isuser);
	    	ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
	    	ChessPiece.getGame(gid).setLastUndoneMove(null);
	    	ChessPiece.printBoard(gid);
	    	console.log(ChessPiece.getGame(gid).getSideTurn() + "'S TURN!");
	    	console.log();
	    	
	    	console.log("TEST UNDO COMMAND:");
	    	ChessPiece.getGame(gid).makeLastOfficialMoveUnofficial();
	    	ChessPiece.makeLocalMove(ChessPiece.getGame(gid).genCommandToUndoLastMadeMove(),
				gid, true, iswhitedown, isuser);
	    	//ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
	    	ChessPiece.getGame(gid).clearUnofficialMove();
	    	ChessPiece.printBoard(gid);
	    	console.log();
    	}
    	//else;//do nothing
    	console.log(ChessPiece.getGame(gid).getSideTurn() + "'S TURN!");
    	
    	let otstdrawcmd = true;
    	if (otstdrawcmd && dodrawtests)
    	{
    		ChessPiece.makeLocalMove(
    			ChessPiece.getFullTieCommand("WHITE", true, false), gid, false,
				iswhitedown, isuser);
    	}
    	else
    	{
    		//make the other move
    		ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommand(6, 1), gid, false,
				iswhitedown, isuser);//B7
    		ChessPiece.getGame(gid).makeUnofficialMoveOfficial();
    		ChessPiece.printBoard(gid);
    	}
    	//check the results
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    }
}

export default TestDriver;
