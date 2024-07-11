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
    static cc = new CommonClass();
	static main(args) {
    	
    	// TODO, add your application code
    	console.log("Hello World!");
    	let gid = 1;
    	let game = ChessGame.makeNewChessGameFromColor(1, "WHITE");
    	//let og = ChessGame.makeNewChessGameFromGID(1);//error
    	//let mog = ChessGame.makeNewChessGameFromColor(2, "WHITE");
    	//debugger;

		//TestDriver.testPawnPromotionViaStepingForwardThroughGame(2);
    	//TestDriver.testMovingPiecesAmbiguityViaStepingForwardThroughGame(2);//error
    	//TestDriver.testCastlingViaStepingForwardThroughGame(2);
    	//TestDriver.testPawningViaStepingForwardThroughGame(2);
    	//TestDriver.testColorsForMovesAlternateViaStepingForwardThroughGame(2);
    	//TestDriver.testOtherColorsAlternateViaStepingForwardThroughGame(2);//error
    	//TestDriver.testFourMoveCheckMateBlackViaStepingForwardThroughGame(2);
    	//TestDriver.testResignationViaStepingForwardThroughGame(2);//error
    	
    	ChessPiece.setUpBoard(gid);
    	console.log("DONE SETTING UP THE BOARD!");
    	let mycps = ChessPiece.cps;
    	for (let c = 0; c < mycps.length; c++) console.log(mycps[c]);
    	ChessPiece.printBoardViaGameID(gid);
    	console.log(ChessPiece.isBoardValidMain(gid));
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
		console.log(wkg);

    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
		console.log(bkg);

    	let wqn = ChessPiece.getPieceAtVIAGID(7, 3, gid);
		console.log(wqn);

    	let bqn = ChessPiece.getPieceAtVIAGID(0, 3, gid);
    	console.log(bqn);
    	
		let item = ChessPiece.getPieceAtVIAGID(4, 0, gid);
    	console.log("ITEM AT (4, 0) IS: ", item);
    	console.log("");
    	
    	TestDriver.testGetPiecesGuardingLocation(gid);
    	TestDriver.setUpFutureCheck(gid);
    	
    	console.log("WHITE CAN CASTLE: " + ChessPiece.canSideCastle("WHITE", gid));
    	console.log("BLACK CAN CASTLE: " + ChessPiece.canSideCastle("BLACK", gid));
    	console.log("");
    	
    	//console.log(ChessPiece.getColorOfLoc(7, 7));
    	
    	//TestDriver.setUpBoardTestIsEmptyMoveToLocsWithoutMovingThere(gid);
    	//if (true) return;
    	
    	//TestDriver.getAndPrintAllPiecesGenders(gid);
		//TestDriver.testConvertingLocations();
		//TestDriver.testCanMoveToLocsWithDefaults(gid, null, null);
    	
    	//TestDriver.testResignation(gid);
    	//TestDriver.testPawning(gid, false);
    	//TestDriver.setUpBoardForPawnPromotionMain(gid, false);
    	//TestDriver.setUpBoardForCastlingWhiteRightMain(gid, false);
    	//TestDriver.setUpBoardWithKnightCheckingKingMain(gid, false);
    	//CHECKMATE TESTS
    	//TestDriver.setUpBoardWithFourMoveCheckMateMain(gid, false);
    	//TestDriver.setUpBoardWithTwoMoveCheckMateBlackMain(gid, false);
    	//TestDriver.setUpBoardWithTwoMoveCheckMateWhiteMain(gid, false);
    	//TestDriver.setUpBoardCheckmateKingBishopVSameDiffColorSquares(gid);//no moving there
    	//TestDriver.setUpBoardWhiteCheckmateAfterManyMoves(gid);//no moving there
    	//STALEMATE TESTS
    	//TestDriver.setUpBoardWithKingVKingAndStuckPawnsWithoutMovingThere(gid);
    	//TestDriver.setUpBoardWithBlockedPawnsAndBishops(gid);//no moving there
    	//TestDriver.setUpBoardWhiteStalemateAfterManyMoves(gid);//no moving there
    	//TestDriver.setUpBoardWhiteStalemateKingAndQueenVsKing(gid);
    	//AUTO STALEMATES (ALL WITHOUT MOVING THERE)
    	//TestDriver.setUpBoardWithKingAndBishopsVKingBishopsMain(gid, 1, 1);
    	//TestDriver.setUpBoardWithKingAndBishopsVKingBishopsMain(gid, 0, 1);
    	//TestDriver.setUpBoardWithKingAndBishopsVKingBishopsMain(gid, 1, 0);
    	//TestDriver.setUpBoardWithKingVKingOnlyWithoutMovingThere(gid);
    	//also produces king vs king board
		//TestDriver.setUpBoardWithKingAndBishopsVKingBishopsMain(gid, 0, 0);
    	//TestDriver.setUpBoardWithKingAndKnightVKing(gid);
    	//
    	//NOT A STALEMATE BECAUSE BISHOPS ARE ON DIFFERENT COLOR SQUARES
    	//TestDriver.setUpBoardWithKingAndBishopsVKingBishops(gid, 1, 1, false);
		//true passed in produces a stalemate
    	
    	console.log("");
    	console.log("AFTER SPECIAL TESTS!");
    	
    	
		//let isuser = false;
    	//let wpn = ChessPiece.getPieceAtVIAGID(6, 0, gid);
    	//let mymv = wpn.genMoveToCommandFromMeMain(4, 0);
    	//let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	//let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false);
    	//wpn.setLoc(4, 0);
    	//ChessPiece.printBoardViaGameID(gid);
    	//ChessPiece.makeLocalMoveMain(myunmv, gid, isuser, true);//mvcmd, gid, isuser, isundo
    	//ChessPiece.printBoardViaGameID(gid);
    	//wpn.setLoc(4, 0);
    	//ChessPiece.printBoardViaGameID(gid);
    	//ChessPiece bpn = ChessPiece.getPieceAtVIAGID(1, 1, gid);
    	//bpn.genMoveToCommandFromMeMain(3, 1);
    	//bpn.setLoc(3, 1);
    	//ChessPiece.printBoardViaGameID(gid);
    	//wpn.genMoveToCommandFromMeMain(3, 1);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.removePieceAt(3, 1, gid);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//wpn.setLoc(3, 1);
    	//ChessPiece.printBoardViaGameID(gid);
    	//ChessPiece obpn = ChessPiece.getPieceAtVIAGID(1, 0, gid);
    	//obpn.genMoveToCommandFromMeMain(3, 0);
    	//obpn.setLoc(3, 0);
    	//obpn.setMoveCount(1);
    	//console.log("OTHER BLACK PAWN MOVE COUNT: " + obpn.getMoveCount());
    	//ChessPiece.printBoardViaGameID(gid);
    	//wpn.genMoveToCommandFromMeMain(2, 0);
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.removePieceAt(3, 0, gid);
    	//wpn.setLoc(2, 0);
    	//wpn.pawnLeft();
    	//console.log("TOTAL PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	//ChessPiece.printBoardViaGameID(gid);
    }
    
    //TEST SOME BASIC METHODS
    
    static getAndPrintAllPiecesGenders(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	let mycps = ChessPiece.getAllPiecesWithGameID(gid);
    	for (let c = 0; c < mycps.length; c++)
    	{
    		let cp = mycps[c];
    		console.log("THE GENDER OF THE " + cp.getColor() + " " + cp.getType() + " AT: " +
    			cp.getMyLocString() + " IS: " + cp.convertGenderValueToString() +
				" WITH GAME ID: " + cp.getGameID());
    	}
    	console.log("mycps.length = " + mycps.length);
    }
    
    static getAndPrintWhereAllThePiecesAre(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("H8", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("B8", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("C6", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("E5", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	console.log(ChessPiece.convertRowColToStringLocMain(
			ChessPiece.convertStringLocToRowCol("D3", iswhitedown),
    		ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	const runillegaltests = false;
		if (runillegaltests)
		{
			console.log(ChessPiece.convertRowColToStringLocMain(
				ChessPiece.convertStringLocToRowCol("X9", iswhitedown),
				ChessPiece.WHITE_MOVES_DOWN_RANKS));
			console.log(ChessPiece.convertRowColToStringLocMain(
				ChessPiece.convertStringLocToRowCol("A9", iswhitedown),
				ChessPiece.WHITE_MOVES_DOWN_RANKS));
		}
		//else;//do nothing
    }
    
    static testGetPiecesGuardingLocation(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	const iswhitedown = true;
    	//console.log(ChessPiece.getPiecesGuardingLocation(6, 0));
    	//console.log("");
    	//console.log(ChessPiece.getPiecesGuardingLocation(7, 4));
    	//console.log("");
    	console.log("GETTING ENEMY PIECES GUARDING LOCATION (7, 4) " +
    		ChessPiece.convertRowColToStringLoc(7, 4, ChessPiece.WHITE_MOVES_DOWN_RANKS) +
			" NOW:");
    	console.log(ChessPiece.getEnemyPiecesGuardingLocationUseCPColor(7, 4, gid));
    	
    	console.log("GETTING ALL PIECES GUARDING LOCATION (6, 7) " +
    		ChessPiece.convertRowColToStringLoc(6, 7, ChessPiece.WHITE_MOVES_DOWN_RANKS) +
			" NOW:");
    	let nloc = ChessPiece.convertStringLocToRowCol("H5", iswhitedown);
		console.log("nloc = ", nloc);

    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(ChessPiece.makeNewChessPieceMain("QUEEN", "BLACK", nloc, gid, false));
		console.log(addpcs);
    	//let ignorelist = null;
    	console.log("NORMAL RESULTS WITHOUT ADDING ANY PIECES OR EXCLUDING ANY:");
    	let nrmlcps = ChessPiece.getPiecesGuardingLocation(6, 7, gid, null, null);
		//ignorelist, addpcs
    	console.log(nrmlcps);
    	console.log("");
    	console.log("RESULTS WITH THE ADDITION OF A BLACK QUEEN AT (" + nloc[0] + ", " +
			nloc[1] + "):");
    	let nrmlwithaddpcs = ChessPiece.getPiecesGuardingLocation(6, 7, gid, null, addpcs);
			//ignorelist, addpcs
    	console.log(nrmlwithaddpcs);
    	console.log("");
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
    		console.log("addpcs = ", addpcs);
    		let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    		//console.log(nwpcslist);
    		ChessPiece.printBoard(nwpcslist);
    		//console.log(ChessPiece.isBoardValid(nwpcslist));
    		console.log("DONE TESTING PRINT NEW SETUP BOARD!");
    	}
    	//else;//do nothing
    	
    	ChessPiece.printBoardViaGameID(gid);
    	//not true for all test cases, but must be true for this case
    	if (nrmlcps.length + 1 === nrmlwithaddpcs.length);
    	else TestDriver.cc.logAndThrowNewError("ADDING A QUEEN TEST FAILED!");
    	if (runigpwntst)
    	{
    		if (nrmlcps.length === nopwnwithaddpcs.length);
    		else TestDriver.cc.logAndThrowNewError("IGNORING A PAWN TEST FAILED!");
    	}
    	//else;//do nothing
    	console.log(ChessPiece.isBoardValidMain(gid));
    }
    
    static setUpBoardTestIsEmptyMoveToLocsWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	const iswhitedown = true;
    	let ignorelist = [];//new int[2][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("H2", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("H7", iswhitedown));
    	//add list is null
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, null, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a piece
		//can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, null));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, null));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: ",
			ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist, null));
    	console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	console.log("");
    	
    	//returns false because there is a piece there on the normal board
    	console.log("IS (row: 1, col: 7) EMPTY: " + ChessPiece.isLocationEmptyVIAGID(1, 7, gid,
			ignorelist, null));
    	console.log("IS (row: 1, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(1, 7, nwpcslist));
    	console.log("IS (row: 6, col: 7) EMPTY: " + ChessPiece.isLocationEmptyVIAGID(6, 7, gid,
			ignorelist, null));
    	console.log("IS (row: 6, col: 7) EMPTY: " + ChessPiece.isLocationEmpty(6, 7, nwpcslist));
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, null);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, null);
    	TestDriver.testCastleCanMoveToLocs(gid, 7, 7, "WHITE", ignorelist, null);
    	TestDriver.testCastleCanMoveToLocs(gid, 0, 7, "BLACK", ignorelist, null);
    }
    
    
    //STEP FORWARD AND BACKWARD THROUGH A GAME TESTS
    
    static testStepForwardAndBackwardThroughAGame(tstmvs, gid, isdone)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(isdone, "isdone");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		console.log("");
    	console.log("INSIDE OF TEST STEP FORWARD AND BACKWARD THROUGH A GAME():");
    	console.log("");
    	if (TestDriver.cc.isItemNullOrUndefined(tstmvs)) console.log("tstmvs = null!");
    	else if (tstmvs.length < 1) console.log("tstmvs is empty!");
    	else
    	{
    		console.log("tstmvs.length = " + tstmvs.length);
    		for (let x = 0; x < tstmvs.length; x++)
    		{
    			if (TestDriver.cc.isStringEmptyNullOrUndefined(tstmvs[x]))
				{
					console.log("tstmvs[" + x + "] = null!");
				}
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
    		//ChessPiece.printBoardViaGameID(gid);
    		og.stepBackward();
    		ChessPiece.printBoardViaGameID(gid);
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
    	console.log("");
    	console.log("BOARD FOR GAME WITH ID " + gid + ":");
    	ChessPiece.printBoardViaGameID(gid);
    	console.log(og.getSideTurn(tstmvs, false) + "'S TURN NOW!");
    	console.log("");
    }
    
    static testFourMoveCheckMateBlackViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		ChessPiece.setUpBoard(gid);
    	ChessPiece.printBoardViaGameID(gid);
    	const iswhitedown = true;
    	const bpassimnxtmv = true;
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.convertAllLocationsForFullMoveCommands(
				TestDriver.getFourMoveCheckMateBlackMoves(), iswhitedown), gid, true);
    }
    
    static testColorsForMovesAlternateViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	if (onlymvwhite === onlymvblack)
    	{
    		if (onlymvwhite)
			{
				TestDriver.cc.logAndThrowNewError("you are only moving white or only " +
					"moving black, but not both!");
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
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true), gid,
			false);
    }
    
    static testOtherColorsAlternateViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true),
			gid, false);
    }
    
    static testPawnPromotionViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, promotps, iswhitedown, true),
			gid, false);
    }
    
    static testMovingPiecesAmbiguityViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
		
		const iswhitedown = true;
    	const addambigcmd = true;//if true causes error
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
    	ChessPiece.printBoardViaGameID(gid);
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testCastlingViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	ChessPiece.printBoardViaGameID(gid);
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testPawningViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	ChessPiece.printBoardViaGameID(gid);
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    static testResignationViaStepingForwardThroughGame(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	ChessPiece.printBoardViaGameID(gid);
    	TestDriver.testStepForwardAndBackwardThroughAGame(
    		ChessPiece.genFullMoveCommands(myunoffmvs, gid, null, iswhitedown, true), gid, false);
    }
    
    
    //TEST MOVE TO LOCS METHODS
    
    static testPieceCanMoveToLocs(gid, rval, cval, clrval, tpval, locsarrnm,
    	ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(rval, "rval");
		TestDriver.cc.letMustBeAnInteger(cval, "cval");
		TestDriver.cc.letMustBeDefinedAndNotNull(clrval, "clrval");
		TestDriver.cc.letMustBeDefinedAndNotNull(tpval, "tpval");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
		//else;//do nothing
    	
    	console.log("");
    	//console.log("CALLING " + clrval + " " + tpval +
		//	" CAN MOVE TO LOCS WITH STARTING LOCATION " +
    	//	ChessPiece.getLocStringAndConvertIt(rval, cval) + "!");
    	let locs = ChessPiece.getPieceCanMoveToLocsMain(rval, cval, clrval, tpval, gid,
			ignorelist, addpcs);
    	console.log("RESULTS " + clrval + " " + tpval +
			" CAN MOVE TO LOCS WITH STARTING LOCATION " +
    		ChessPiece.getLocStringAndConvertIt(rval, cval) + "!");
    	ChessPiece.printLocsArray(locs, locsarrnm,
			ChessPiece.getPieceAtVIAGID(rval, cval, gid, ignorelist, addpcs));
    }
    static testKingCanMoveToLocs(gid, kgr, kgc, kgclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(kgr, "kgr");
		TestDriver.cc.letMustBeAnInteger(kgc, "kgc");
		TestDriver.cc.letMustBeDefinedAndNotNull(kgclr, "kgclr");

		TestDriver.testPieceCanMoveToLocs(gid, kgr, kgc, kgclr, "KING", "initkgcanmvlocs",
			ignorelist, addpcs);
    }
    static testKnightCanMoveToLocs(gid, ktr, ktc, ktclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(ktr, "ktr");
		TestDriver.cc.letMustBeAnInteger(ktc, "ktc");
		TestDriver.cc.letMustBeDefinedAndNotNull(ktclr, "ktclr");

		TestDriver.testPieceCanMoveToLocs(gid, ktr, ktc, ktclr, "KNIGHT", "initktcanmvlocs",
			ignorelist, addpcs);
    }
    static testQueenCanMoveToLocs(gid, qr, qc, qclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(qr, "qr");
		TestDriver.cc.letMustBeAnInteger(qc, "qc");
		TestDriver.cc.letMustBeDefinedAndNotNull(qclr, "qclr");

		TestDriver.testPieceCanMoveToLocs(gid, qr, qc, qclr, "QUEEN", "initqncanmvlocs",
			ignorelist, addpcs);
    }
    static testBishopCanMoveToLocs(gid, br, bc, bclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(br, "br");
		TestDriver.cc.letMustBeAnInteger(bc, "bc");
		TestDriver.cc.letMustBeDefinedAndNotNull(bclr, "bclr");

		TestDriver.testPieceCanMoveToLocs(gid, br, bc, bclr, "BISHOP", "initbpcanmvlocs",
			ignorelist, addpcs);
    }
    static testCastleCanMoveToLocs(gid, cr, mcc, cclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(cr, "cr");
		TestDriver.cc.letMustBeAnInteger(mcc, "mcc");
		TestDriver.cc.letMustBeDefinedAndNotNull(cclr, "cclr");

		TestDriver.testPieceCanMoveToLocs(gid, cr, mcc, cclr, "CASTLE", "initclcanmvlocs",
			ignorelist, addpcs);
    }
    static testPawnCanMoveToLocs(gid, pr, pc, pclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(pr, "pr");
		TestDriver.cc.letMustBeAnInteger(pc, "pc");
		TestDriver.cc.letMustBeDefinedAndNotNull(pclr, "pclr");

		TestDriver.testPieceCanMoveToLocs(gid, pr, pc, pclr, "PAWN", "initpwncanmvlocs",
			ignorelist, addpcs);
    }
    
    //calls the above methods once for each type of piece
    static testCanMoveToLocs(gid, kgr, kgc, kgclr, ktr, ktc, ktclr,
    	cr, cc, cclr, br, bc, bclr, pr, pc, pclr, qr, qc, qclr,
    	ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");

		TestDriver.testKingCanMoveToLocs(gid, kgr, kgc, kgclr, ignorelist, addpcs);
    	TestDriver.testQueenCanMoveToLocs(gid, qr, qc, qclr, ignorelist, addpcs);
    	TestDriver.testBishopCanMoveToLocs(gid, br, bc, bclr, ignorelist, addpcs);
    	TestDriver.testCastleCanMoveToLocs(gid, cr, cc, cclr, ignorelist, addpcs);
    	TestDriver.testKnightCanMoveToLocs(gid, ktr, ktc, ktclr, ignorelist, addpcs);
    	TestDriver.testPawnCanMoveToLocs(gid, pr, pc, pclr, ignorelist, addpcs);
    }
    //loc lists in the order of: king, knight, castle (rook), bishop, pawn, queen
    static testCanMoveToLocsFromLocsAndColors(gid, kgloc, kgclr, ktloc, ktclr,
    	cloc, cclr, bloc, bclr, ploc, pclr, qloc, qclr, ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");

		TestDriver.testCanMoveToLocs(gid, kgloc[0], kgloc[1], kgclr, ktloc[0], ktloc[1],
			ktclr, cloc[0], cloc[1], cclr, bloc[0], bloc[1], bclr, ploc[0], ploc[1], pclr,
			qloc[0], qloc[1], qclr, ignorelist, addpcs);
    }
    //pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    static testCanMoveToLocsFromLocAndColorLists(gid, pcslocs, psclrs,
		ignorelist=null, addpcs=null)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeDefinedAndNotNull(pcslocs, "pcslocs");
		TestDriver.cc.letMustBeDefinedAndNotNull(psclrs, "psclrs");

		TestDriver.testCanMoveToLocs(gid, pcslocs[0][0], pcslocs[0][1], psclrs[0], pcslocs[1][0],
			pcslocs[1][1], psclrs[1], pcslocs[2][0], pcslocs[2][1], psclrs[2], pcslocs[3][0],
			pcslocs[3][1], psclrs[3], pcslocs[4][0], pcslocs[4][1], psclrs[4], pcslocs[5][0],
			pcslocs[5][1], psclrs[5], ignorelist, addpcs);
    }
    static testCanMoveToLocsWithDefaults(gid, ignorelist=null, addpcs=null)
    {
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 6, 4, "WHITE", 7, 3, "WHITE", ignorelist, addpcs);
    }
    
    
    //DRIVER MAKE MOVE
    
    static driverMakeMove(cp, elocstr, iswhitedown, isuser, ptpval="QUEEN")
    {
    	TestDriver.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		TestDriver.cc.letMustBeBoolean(isuser, "isuser");
		TestDriver.cc.letMustBeDefinedAndNotNull(cp, "cp");
		TestDriver.cc.letMustBeDefinedAndNotNull(elocstr, "elocstr");
		TestDriver.cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");

		ChessPiece.makeLocalShortHandMove(
    		cp.genMoveToCommandFromMeVIALocNoLists(
				ChessPiece.convertStringLocToRowCol(elocstr, iswhitedown), ptpval),
			cp.getGameID(), isuser, false, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	cp.getGame().makeUnofficialMoveOfficial();
    }
    static driverMakeMoveNoUser(cp, elocstr, iswhitedown, ptpval="QUEEN")
    {
    	TestDriver.driverMakeMove(cp, elocstr, iswhitedown,
			cp.getGame().doesColorMatchMyColor(cp.getColor()), ptpval);
    }
    static driverMakeMoveNoPiece(gid, slocstr, elocstr, iswhitedown, isuser, ptpval="QUEEN")
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(iswhitedown, "iswhitedown");
		TestDriver.cc.letMustBeBoolean(isuser, "isuser");
		TestDriver.cc.letMustBeDefinedAndNotNull(slocstr, "slocstr");
		TestDriver.cc.letMustBeDefinedAndNotNull(elocstr, "elocstr");
		TestDriver.cc.letMustBeDefinedAndNotNull(ptpval, "ptpval");

		let cp = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol(slocstr, iswhitedown), gid);
    	TestDriver.driverMakeMove(cp, elocstr, iswhitedown, isuser, ptpval);
    }
    static driverMakeMoveNoUserPiece(gid, slocstr, elocstr, iswhitedown, ptpval="QUEEN")
    {
    	let cp = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol(slocstr,
			iswhitedown), gid);
    	TestDriver.driverMakeMoveNoUser(cp, elocstr, iswhitedown, ptpval);
    }
    
    
    //SET UP BOARD METHODS
    
    static testResignation(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN E7 -> E6; WQN D8 -> H4; OWPN A7 -> A5;
		//BPN F2 -> F3; BLACK RESIGNS; BPN A2 -> A3;
		
		const iswhitedown = true;
		let isuser = false;
    	let wpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("E7", iswhitedown), gid);
    	TestDriver.driverMakeMove(wpn, "E6", iswhitedown, isuser);
    	
    	let bpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("F2", iswhitedown), gid);
    	TestDriver.driverMakeMove(bpn, "F3", iswhitedown, isuser);
    	
    	let wqn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("D8", iswhitedown), gid);
    	TestDriver.driverMakeMove(wqn, "H4", iswhitedown, isuser);
    	ChessPiece.printBoardViaGameID(gid);
    	
    	let rsgmv = ChessPiece.getFullResignationCommand("BLACK");
    	ChessPiece.makeLocalShortHandMove(rsgmv, gid, isuser, false,
			ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	
    	let tstcrash = false;
    	if (tstcrash)
    	{
    		let owpn = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("A7",
				iswhitedown), gid);
	    	TestDriver.driverMakeMove(owpn, "A5", iswhitedown, isuser);
	    	
	    	let obpn = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("A2",
				iswhitedown), gid);
	    	TestDriver.driverMakeMove(obpn, "A3", iswhitedown, isuser);
    	}
    	else
    	{
    		ChessPiece.getGameVIAGID(gid).stepBackward();
    		ChessPiece.getGameVIAGID(gid).stepBackward();
    		ChessPiece.printBoardViaGameID(gid);
    		ChessPiece.getGameVIAGID(gid).stepForward();
    		ChessPiece.printBoardViaGameID(gid);
    	}
    }
    
    //SET UP BOARD PAWN PROMOTION
    
    static setUpBoardForPawnPromotion(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//GOAL: PROMOTE WHITE PAWN TO SOMETHING?
    	//WPN AT A7 -> A5 -> B4 -> B3 -> B2 -> A1;
    	//BPN AT B2 -> B4; OBPN AT H2 -> H4 -> H5 -> H6;
    	const iswhitedown = true;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("A7", iswhitedown), gid);
    	TestDriver.driverMakeMove(wpn, "A5", iswhitedown, isuser);
    	//wpn.genMoveToCommandFromMe(ChessPiece.convertStringLocToRowCol("A5", iswhitedown));
    	//wpn.setLocMain(ChessPiece.convertStringLocToRowCol("A5", iswhitedown));
    	//wpn.setMoveCount(wpn.getMoveCount() + 1);
    	let bpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("B2", iswhitedown), gid);
    	TestDriver.driverMakeMove(bpn, "B4", iswhitedown, isuser);
    	
    	ChessPiece.printBoardViaGameID(gid);
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	TestDriver.driverMakeMove(wpn, "B4", iswhitedown, isuser);
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	ChessPiece.printBoardViaGameID(gid);
    	console.log(ChessPiece.isBoardValidMain(gid));
    	
    	let obpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("H2", iswhitedown), gid);
    	TestDriver.driverMakeMove(obpn, "H4", iswhitedown, isuser);
    	TestDriver.driverMakeMove(wpn, "B3", iswhitedown, isuser);
    	TestDriver.driverMakeMove(obpn, "H5", iswhitedown, isuser);
    	TestDriver.driverMakeMove(wpn, "B2", iswhitedown, isuser);
    	TestDriver.driverMakeMove(obpn, "H6", iswhitedown, isuser);
    	
    	let tstmovandpromote = false;
    	let mymvploc = null;
    	if (tstmovandpromote)
    	{
    		mymvploc = "B1";
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.removePieceAtMain(ChessPiece.convertStringLocToRowCol(mymvploc,
				iswhitedown), gid);
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	}
    	else mymvploc = "A1";
    	
    	ChessPiece.printBoardViaGameID(gid);
    	let mymv = wpn.genMoveToCommandFromMeVIALocNoLists(
			ChessPiece.convertStringLocToRowCol(mymvploc, iswhitedown), "QUEEN");
    	
    	console.log("");
    	console.log("INITIAL MOVE COMMAND NOW!");
    	for (let x = 0; x < mymv.length; x++) console.log("mymv[" + x + "] = " + mymv[x]);
    	console.log("");
    	
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMoveMain(wpn.genHintsCommandForSide(), gid, isuser, false,
		//	ChessPiece.WHITE_MOVES_DOWN_RANKS);//mvcmd, gid, isuser, isundo, iswhitedown
    	
    	let tstlclmv = true;
    	if (tstlclmv)
    	{
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		let myscmd = "WPNB2TO" + mymvploc;
    		let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(myscmd, gid,
				"QUEEN", iswhitedown, false);
    		
    		console.log("");
    		console.log("INITIAL FULL MOVE!");
    		for (let x = 0; x < fullmv.length; x++)
			{
				console.log("fullmv[" + x + "] = " + fullmv[x]);
			}
			console.log("**ChessPiece.WHITE_MOVES_DOWN_RANKS = " +
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		console.log("");
			
			ChessPiece.makeLocalMoveMain(fullmv, gid, isuser, false,
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		//ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false,
			//	ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoardViaGameID(gid);
    	}
    	//else;//do nothing
    	
    	let stoptest = false;
    	if (stoptest) TestDriver.cc.logAndThrowNewError("UNDO GEN PROMOTE PAWN COMMAND FAILED!");
    	
    	if (tstlclmv)
    	{
    		console.log("WHITE CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromotedMain("WHITE", gid));
	    	console.log("BLACK CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromotedMain("BLACK", gid));
	    	
	    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
    		ChessPiece.makeLocalMoveMain(myunmv, gid, isuser, true,
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoardViaGameID(gid);
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		
    		ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false,
				ChessPiece.WHITE_MOVES_DOWN_RANKS);
    		ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    		
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    		ChessPiece.printBoardViaGameID(gid);
    	}
    	else
    	{
    		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    	
	    	ChessPiece.removePieceAtMain(ChessPiece.convertStringLocToRowCol("A1", iswhitedown),
				gid);
	    	
	    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    	
	    	wpn.setLocMain(ChessPiece.convertStringLocToRowCol("A1", iswhitedown));
	    	wpn.setMoveCount(wpn.getMoveCount() + 1);
	    	
	    	//test pawn promotion methods here
	    	ChessPiece.printBoardViaGameID(gid);
	    	console.log("WHITE CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromotedMain("WHITE", gid));
	    	console.log("BLACK CAN PROMOTE A PAWN: " +
				ChessPiece.canPawnForSideBePromotedMain("BLACK", gid));
	    	wpn.promotePawnTo("QUEEN");
	    	console.log(wpn);
	    	ChessPiece.printBoardViaGameID(gid);
    	}
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	TestDriver.driverMakeMove(obpn, "G7", iswhitedown, isuser);
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	TestDriver.driverMakeMove(wpn, "B1", iswhitedown, isuser);
    	ChessPiece.printBoardViaGameID(gid);
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	TestDriver.driverMakeMove(obpn, "H8", iswhitedown, isuser, "QUEEN");
    	
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
    	
    	//test pawn promotion methods here
    	ChessPiece.printBoardViaGameID(gid);
    	console.log("WHITE CAN PROMOTE A PAWN: " +
			ChessPiece.canPawnForSideBePromotedMain("WHITE", gid));
    	console.log("BLACK CAN PROMOTE A PAWN: " +
			ChessPiece.canPawnForSideBePromotedMain("BLACK", gid));
    	//obpn.promotePawnTo("QUEEN");
    	console.log(obpn);
    	ChessPiece.printBoardViaGameID(gid);
    }
    static setUpBoardForPawnPromotionWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let wpn = ChessPiece.makeNewChessPiece("PAWN", "WHITE",
    		ChessPiece.convertStringLocToRowCol("A1", iswhitedown), gid, 5, false);
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("H6", iswhitedown), gid, 3, false));
    	addpcs.push(wpn);
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
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
    	let bpn = ChessPiece.makeNewChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("H8", iswhitedown), gid, 5, false);
    	nwaddpcs.push(bpn);
    	nwaddpcs.push(ChessPiece.makeNewChessPiece("QUEEN", "WHITE",
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
    	TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 0, "WHITE", 0, 2,
			"BLACK", 1, 2, "BLACK", 7, 7, "BLACK",
    		ChessPiece.combineIgnoreLists(nwiglist, ignorelist),
			ChessPiece.combineTwoPieceLists(nwaddpcs, addpcs));
    }
    static setUpBoardForPawnPromotionMain(gid, movethere)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) TestDriver.setUpBoardForPawnPromotion(gid);
    	else TestDriver.setUpBoardForPawnPromotionWithoutMovingThere(gid);
    }
    
    //SET UP BOARD PAWNING
    
    static setUpBoardForPawning(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//BPN AT B2 -> B4 -> B5; WPN AT A7 -> A5; WKT AT G8 -> H6 -> F5
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("G8", iswhitedown), gid);
    	TestDriver.driverMakeMove(wkt, "H6", iswhitedown, isuser);
    	//ChessPiece.makeLocalShortHandMove(
    	//	wkt.genMoveToCommandFromMe(ChessPiece.convertStringLocToRowCol("H6", iswhitedown)),
		//	gid, isuser, false, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	//wkt.getGame(gid).makeUnofficialMoveOfficial();
    	
    	let bpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("B2", iswhitedown), gid);
    	TestDriver.driverMakeMove(bpn, "B4", iswhitedown, isuser);
    	TestDriver.driverMakeMove(wkt, "F5", iswhitedown, isuser);
    	TestDriver.driverMakeMove(bpn, "B5", iswhitedown, isuser);
    	
    	let wpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("A7", iswhitedown), gid);
    	TestDriver.driverMakeMove(wpn, "A5", iswhitedown, isuser);
    	
    	ChessPiece.printBoardViaGameID(gid);
		//now test pawning methods here
    	console.log("WHITE CAN PAWN: " + ChessPiece.canSidePawnMain("WHITE", gid));
    	console.log("BLACK CAN PAWN: " + ChessPiece.canSidePawnMain("BLACK", gid));
    	let mymv = bpn.genMoveToCommandFromMe(
			ChessPiece.convertStringLocToRowCol("A6", iswhitedown));
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMoveMain(bpn.genHintsCommandForSide(), gid, isuser, false);
		//mvcmd, gid, isuser, isundo
    	let stoptest = false;
    	if (stoptest) TestDriver.cc.logAndThrowNewError("UNDO GEN PAWN COMMAND FAILED!");
    	let scmd = "BLPNB5TOA6";
    	let oscmd = "BPNB5TOA6";
    	let myscmd = oscmd;//scmd
    	let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(myscmd, gid, "QUEEN",
			iswhitedown, false);
    	ChessPiece.makeLocalMoveMain(fullmv, gid, isuser, false, iswhitedown);
		//mvcmd, gid, isuser, isundo, iswhitedown
    	//ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false);//mvcmd, gid, isuser, isundo
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	//bpn.pawnLeft();
    	ChessPiece.printBoardViaGameID(gid);
		ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMoveMain(myunmv, gid, isuser, true, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	ChessPiece.printBoardViaGameID(gid);
    	
    	ChessPiece.getGameVIAGID(gid).setUnofficialMove(mymv);
    	console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    
		bpn.pawnLeft();
    	
		console.log("TOTAL NUMBER OF PIECES: " + ChessPiece.getNumItemsInList(ChessPiece.cps));
	    
		ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    }
    static testPawningWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let bpn = ChessPiece.makeNewChessPiece("PAWN", "BLACK",
    		ChessPiece.convertStringLocToRowCol("B5", iswhitedown), gid, 2, false);
    	addpcs.push(bpn);
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("F5", iswhitedown), gid, 2, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//call canPawnLeft on Black Pawn
    	console.log("WHITE CAN PAWN: " + ChessPiece.canSidePawn("WHITE", nwpcslist, true));
		console.log("BLACK CAN PAWN: " + ChessPiece.canSidePawn("BLACK", nwpcslist, true));
    	let bpwncanmvlocs = ChessPiece.getPieceCanMoveToLocsMain(bpn.getRow(), bpn.getCol(),
			"BLACK", "PAWN", gid, ignorelist, addpcs);
    	ChessPiece.printLocsArray(bpwncanmvlocs, "bpwncanmvlocs");
    	console.log("BLACK CAN PAWN LEFT: " + bpn.canPawnLeft(nwpcslist));
    	console.log("BLACK CAN PAWN RIGHT: " + bpn.canPawnRight(nwpcslist));
    	let bplftloc = bpn.getPawnLeftLocation(nwpcslist, true);
    	let bprgtloc = bpn.getPawnRightLocation(nwpcslist, true);
    	if (TestDriver.cc.isStringEmptyNullOrUndefined(bplftloc))
		{
			console.log("BLACK PAWNING MOVE TO LEFT LOCATION: null");
		}
    	else
    	{
    		console.log("BLACK PAWNING MOVE TO LEFT LOCATION: " +
				ChessPiece.getLocStringMain(bplftloc) + " IS: " +
    			ChessPiece.convertRowColToStringLocMain(bplftloc,
					ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	}
    	if (TestDriver.cc.isStringEmptyNullOrUndefined(bprgtloc))
		{
			console.log("BLACK PAWNING MOVE TO RIGHT LOCATION: null");
		}
    	else
    	{
    		console.log("BLACK PAWNING MOVE TO RIGHT LOCATION: " +
				ChessPiece.getLocStringMain(bprgtloc) + " IS: " +
    			ChessPiece.convertRowColToStringLocMain(bprgtloc,
					ChessPiece.WHITE_MOVES_DOWN_RANKS));
    	}
    	console.log("BLACK ENEMY PAWN FOR LEFT PAWNING: ",
			bpn.getEnemyPawnForLeftPawning(nwpcslist, true));
    	console.log("BLACK ENEMY PAWN FOR RIGHT PAWNING: ",
			bpn.getEnemyPawnForRightPawning(nwpcslist, true));
    	if (TestDriver.cc.isStringEmptyNullOrUndefined(bplftloc))
		{
			console.log("BLACK PAWN CAN MOVE TO THE LEFT PAWNING LOCATION: false");
		}
		else
    	{
    		console.log("BLACK PAWN CAN MOVE TO THE LEFT PAWNING LOCATION: " +
    			bpn.canMoveTo(bplftloc[0], bplftloc[1], ignorelist, addpcs, true));
    	}
    	if (TestDriver.cc.isStringEmptyNullOrUndefined(bprgtloc))
		{
			console.log("BLACK PAWN CAN MOVE TO THE RIGHT PAWNING LOCATION: false");
		}
		else
    	{
    		console.log("BLACK PAWN CAN MOVE TO THE RIGHT PAWNING LOCATION: " +
    			bpn.canMoveTo(bprgtloc[0], bprgtloc[1], ignorelist, addpcs, true));
    	}
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 4, 5, "WHITE", 7, 7, "WHITE", 0, 2,
			"BLACK", 4, 1, "BLACK", 0, 3, "BLACK", ignorelist, addpcs);
    }
    static testPawning(gid, movethere)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) TestDriver.setUpBoardForPawning(gid);
    	else TestDriver.testPawningWithoutMovingThere(gid);
    }
    
    //SET UP BOARD CASTLING
    
    static setUpBoardForCastlingWhiteRight(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//WKT AT G8 -> H6; WPN AT E7 -> E6; WBP AT F8 -> C5
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("G8", iswhitedown), gid);
    	TestDriver.driverMakeMove(wkt, "H6", iswhitedown, isuser);
    	//wkt.genMoveToCommandFromMe(ChessPiece.convertStringLocToRowCol("H6", iswhitedown));
    	//wkt.setLocMain(ChessPiece.convertStringLocToRowCol("H6", iswhitedown));
    	//wkt.setMoveCount(wkt.getMoveCount() + 1);
    	
		let bpn = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("A2",
			iswhitedown), gid);
    	TestDriver.driverMakeMove(bpn, "A4", iswhitedown, isuser);
    	
    	let wpn = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("E7",
			iswhitedown), gid);
    	TestDriver.driverMakeMove(wpn, "E6", iswhitedown, isuser);
    	TestDriver.driverMakeMove(bpn, "A5", iswhitedown, isuser);
    	
    	let wbp = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("F8",
			iswhitedown), gid);
    	TestDriver.driverMakeMove(wbp, "C5", iswhitedown, isuser);
    	
    	let obpn = ChessPiece.getPieceAtVIAGIDMain(ChessPiece.convertStringLocToRowCol("G2",
			iswhitedown), gid);
    	TestDriver.driverMakeMove(obpn, "G4", iswhitedown, isuser);
    	
    	//actually test the castling information here now...
    	console.log("WHITE CAN CASTLE: " + ChessPiece.canSideCastle("WHITE", gid));
    	console.log("BLACK CAN CASTLE: " + ChessPiece.canSideCastle("BLACK", gid));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    	ChessPiece.printBoardViaGameID(gid);
		let mymv = ChessPiece.genCastlingMoveToCommand("WHITE", false, gid, null, null);
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	//ChessPiece.makeLocalMoveMain(wpn.genHintsCommandForSide(), gid, isuser, false);
		//mvcmd, gid, isuser, isundo
    	let stoptest = false;
    	if (stoptest) TestDriver.cc.logAndThrowNewError("UNDO GEN CASTLING COMMAND FAILED!");
    	let scmd = "WRCE:";
    	let oscmd = "WKGE8TOG8";
    	let myscmd = oscmd;//scmd
    	let fullmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain(myscmd, gid,
			"QUEEN", iswhitedown, false);
		ChessPiece.makeLocalMoveMain(fullmv, gid, isuser, false, iswhitedown);
		//mvcmd, gid, isundo, iswhitedown, isuser
    	//ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false, iswhitedown);
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	//ChessPiece.whiteCastleRight(gid, null, null);
		//move count will be automatically incremented in this method
    	ChessPiece.printBoardViaGameID(gid);
    	ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMoveMain(myunmv, gid, isuser, true, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	
    	ChessPiece.printBoardViaGameID(gid);
    	ChessPiece.getGameVIAGID(gid).setUnofficialMove(mymv);
    	ChessPiece.whiteCastleRight(gid, null, null);
		//move count will be automatically incremented in this method
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    }
    static setUpBoardForCastlingWhiteRightWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("G4", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("H6", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("BISHOP", "WHITE",
			ChessPiece.convertStringLocToRowCol("C5", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
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
    	TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 5, 7, "WHITE", 7, 7, "WHITE", 4, 2,
			"WHITE", 6, 1, "WHITE", 7, 3, "WHITE", ignorelist, addpcs);
    }
    static setUpBoardForCastlingWhiteRightMain(gid, movethere)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(movethere, "movethere")
		if (movethere) TestDriver.setUpBoardForCastlingWhiteRight(gid);
    	else TestDriver.setUpBoardForCastlingWhiteRightWithoutMovingThere(gid);
    }
    
    //SETUP BOARD CHECK
    
    static setUpBoardWithKnightCheckingKing(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//White Knight at B8 -> C6 -> E5 -> (F3 OR D3)
    	const iswhitedown = true;
    	let isuser = false;
    	let wkt = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("B8", iswhitedown), gid);
    	let mymv = wkt.genMoveToCommandFromMe(
			ChessPiece.convertStringLocToRowCol("C6", iswhitedown));
		let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
		//wkt.setLocMain(ChessPiece.convertStringLocToRowCol("C6", iswhitedown));
    	//wkt.setMoveCount(wkt.getMoveCount() + 1);
    	ChessPiece.makeLocalMoveMain(mymv, gid, isuser, false, ChessPiece.WHITE_MOVES_DOWN_RANKS);
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	
    	let bpn = ChessPiece.getPieceAtVIAGIDMain(
			ChessPiece.convertStringLocToRowCol("A2", iswhitedown), gid);
    	TestDriver.driverMakeMove(bpn, "A4", iswhitedown, isuser);
    	TestDriver.driverMakeMove(wkt, "E5", iswhitedown, isuser);
    	TestDriver.driverMakeMove(bpn, "A5", iswhitedown, isuser);
    	TestDriver.driverMakeMove(wkt, "F3", iswhitedown, isuser);
    	ChessPiece.printBoardViaGameID(gid);
    	//now test check and figure out how to get out of it
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithKnightCheckingKingWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	//White Knight at B8 -> C6 -> E5 -> (F3 OR D3)
    	//ignore knight at B8; add it at F3 OR D3;
    	//ignore pawn at A2; add it at A5;
    	const iswhitedown = true;
    	let ignorelist = [];//new int[2][2];
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("B8", iswhitedown));
    	ignorelist.push(ChessPiece.convertStringLocToRowCol("A2", iswhitedown));
    	let addpcs = [];//new ArrayList<ChessPiece>();
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 2, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("KNIGHT", "WHITE",
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown), gid, 3, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
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
    	TestDriver.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 0, "BLACK", 7, 2,
			"WHITE", 1, 6, "BLACK", 0, 3, "BLACK", ignorelist, addpcs);
    }
    static setUpBoardWithKnightCheckingKingMain(gid, movethere)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) TestDriver.setUpBoardWithKnightCheckingKing(gid);
    	else TestDriver.setUpBoardWithKnightCheckingKingWithoutMovingThere(gid);
    }
    
    //black queen checks white king
    static setUpFutureCheck(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
    	
    	//now set up future check scenario
    	const iswhitedown = true;
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	let wqn = ChessPiece.getPieceAtVIAGID(7, 3, gid);
    	let bqn = ChessPiece.getPieceAtVIAGID(0, 3, gid);
    	let addpcs = [];//new ArrayList<ChessPiece>();
		addpcs.push(ChessPiece.makeNewChessPieceMain("QUEEN", "BLACK",
			ChessPiece.convertStringLocToRowCol("H5", iswhitedown), gid, false));
		console.log("addpcs = ", addpcs);

		let ignorelist = [[6, 5]];//new int[1][2];
    	let gwklocs = ChessPiece.getPiecesGuardingLocation(7, 4, gid, ignorelist, addpcs);
    	console.log("gwklocs = ", gwklocs);
		
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	console.log("");
    	
    	console.log("ACCORDING TO THE FUTURE BOARD:");
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE QUEEN IS IN CHECK: " + wqn.inCheck(ignorelist, addpcs));
    	console.log("BLACK QUEEN IS IN CHECK: " + bqn.inCheck(ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	console.log("");
    	
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 6, 6, "WHITE", 4, 7, "BLACK", ignorelist, addpcs);
    	console.log("");
    	//console.log(ChessPiece.getCountsForEachPieceTypeForASide(ChessPiece.getPieceTypes(
    	//			ChessPiece.filterListByColor(nwpcslist, "BLACK"))));
    	//let tstpctps = ["KING", "CASTLE", "CASTLE", "CASTLE", "CASTLE", "CASTLE",
		//	"CASTLE", "CASTLE", "CASTLE", "CASTLE", "CASTLE", "QUEEN", "QUEEN"];
    	//console.log(ChessPiece.getCountsForEachPieceTypeForASide(tstpctps));
    	//console.log(ChessPiece.isBoardValid(nwpcslist));
    	
    	ChessPiece.printBoardViaGameID(gid);
    	console.log("");
    	
    	console.log("ACCORDING TO THE ACTUAL BOARD:");
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE QUEEN IS IN CHECK: " + wqn.inCheck());
    	console.log("BLACK QUEEN IS IN CHECK: " + bqn.inCheck());
    	console.log("");
    	//console.log(ChessPiece.getPiecesGuardingLocation(2, 2));
    	//console.log("");
    }
    
    //SETUP BOARD CHECKMATE
    
    static setUpBoardWithFourMoveCheckMate(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN AT E7 -> E6; WBP AT F8 -> C5; WQN AT D8 -> F6 -> F2
		//BPN AT A2 -> A4 -> A5 -> A6
    	
    	let iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAtVIAGID(6, 4, gid);//E7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommandFromMeMain(5, 4), gid, isuser, false,
			iswhitedown);//E6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAtVIAGID(1, 0, gid);//A2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommandFromMeMain(3, 0), gid, isuser, false,
			iswhitedown);//A4
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    	let wqn = ChessPiece.getPieceAtVIAGID(7, 3, gid);//D8
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommandFromMeMain(5, 5), gid, isuser, false,
			iswhitedown);//F6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommandFromMeMain(4, 0), gid, isuser, false,
			iswhitedown);//A5
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let wbp = ChessPiece.getPieceAtVIAGID(7, 5, gid);//F8
    	ChessPiece.makeLocalShortHandMove(wbp.genMoveToCommandFromMeMain(4, 2), gid, isuser, false,
			iswhitedown);//C5
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommandFromMeMain(5, 0), gid, isuser, false,
			iswhitedown);//A6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommandFromMeMain(1, 5), gid, isuser, false,
			iswhitedown);//F2
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithFourMoveCheckMateWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	addpcs.push(ChessPiece.makeNewChessPiece("BISHOP", "WHITE",
			ChessPiece.convertStringLocToRowCol("C5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("QUEEN", "WHITE",
			ChessPiece.convertStringLocToRowCol("F2", iswhitedown), gid, 2, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("A6", iswhitedown), gid, 3, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 7, "BLACK", 0, 5,
			"BLACK", 1, 4, "BLACK", 1, 5, "WHITE", ignorelist, addpcs);
    }
    static setUpBoardWithFourMoveCheckMateMain(gid, movethere)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeBoolean(movethere, "movethere");
		if (movethere) TestDriver.setUpBoardWithFourMoveCheckMate(gid);
    	else TestDriver.setUpBoardWithFourMoveCheckMateWithoutMovingThere(gid);
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
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
    	const iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAtVIAGID(6, 4, gid);//E7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommandFromMeMain(5, 4), gid, isuser, false,
			iswhitedown);//E6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAtVIAGID(1, 5, gid);//F2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommandFromMeMain(2, 5), gid, isuser, false,
			iswhitedown);//F3
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let owpn = ChessPiece.getPieceAtVIAGID(6, 0, gid);//A7
    	ChessPiece.makeLocalShortHandMove(owpn.genMoveToCommandFromMeMain(5, 0), gid, isuser,
			false, iswhitedown);//A6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let obpn = ChessPiece.getPieceAtVIAGID(1, 6, gid);//G2
    	ChessPiece.makeLocalShortHandMove(obpn.genMoveToCommandFromMeMain(3, 6), gid, isuser,
			false, iswhitedown);//G4
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	//ChessPiece.printBoardViaGameID(gid);
    	let wqn = ChessPiece.getPieceAtVIAGID(7, 3, gid);//D8
    	ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommandFromMeMain(3, 7), gid, isuser, false,
			iswhitedown);//H4
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithTwoMoveCheckMateBlackWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("E6", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("A5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("QUEEN", "WHITE",
			ChessPiece.convertStringLocToRowCol("H4", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("F3", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("G4", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.testCanMoveToLocs(gid, 0, 4, "BLACK", 0, 6, "BLACK", 0, 7, "BLACK", 0, 5,
			"BLACK", 1, 4, "BLACK", 3, 7, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWithTwoMoveCheckMateWhite(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing
		
		//WPN AT F7 -> F6; OWPN AT G7 -> G5;
    	//BPN AT E2 -> E3; BQN AT D1 -> H5
    	
    	const iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wpn = ChessPiece.getPieceAtVIAGID(6, 5, gid);//F7
    	ChessPiece.makeLocalShortHandMove(wpn.genMoveToCommandFromMeMain(5, 5), gid, isuser, false,
			iswhitedown);//F6
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let bpn = ChessPiece.getPieceAtVIAGID(1, 4, gid);//E2
    	ChessPiece.makeLocalShortHandMove(bpn.genMoveToCommandFromMeMain(2, 4), gid, isuser, false,
			iswhitedown);//E3
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let owpn = ChessPiece.getPieceAtVIAGID(6, 6, gid);//G7
    	ChessPiece.makeLocalShortHandMove(owpn.genMoveToCommandFromMeMain(4, 6), gid, isuser,
			false, iswhitedown);//G5
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	let bqn = ChessPiece.getPieceAtVIAGID(0, 3, gid);//D1
    	ChessPiece.makeLocalShortHandMove(bqn.genMoveToCommandFromMeMain(4, 7), gid, isuser, false,
			iswhitedown);//H5
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    }
    static setUpBoardWithTwoMoveCheckMateWhiteWithoutMovingThere(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("F6", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "WHITE",
			ChessPiece.convertStringLocToRowCol("G5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("QUEEN", "BLACK",
			ChessPiece.convertStringLocToRowCol("H5", iswhitedown), gid, 1, false));
    	addpcs.push(ChessPiece.makeNewChessPiece("PAWN", "BLACK",
			ChessPiece.convertStringLocToRowCol("E3", iswhitedown), gid, 1, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test check mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " +
			ChessPiece.inCheckmateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " +
			ChessPiece.inCheckmateBlack(gid, ignorelist, addpcs));
    	//pcslocs in the order of: king, knight, castle (rook), bishop, pawn, queen
    	TestDriver.testCanMoveToLocs(gid, 7, 4, "WHITE", 7, 6, "WHITE", 7, 7, "WHITE", 7, 5,
			"WHITE", 7, 4, "WHITE", 4, 7, "BLACK", ignorelist, addpcs);
    }
    //calls the above two move checkmate methods
    static setUpBoardWithTwoMoveCheckMateMain(gid, usewhite, movethere)
    {
    	if (usewhite)
    	{
    		if (movethere) TestDriver.setUpBoardWithTwoMoveCheckMateWhite(gid);
    		else TestDriver.setUpBoardWithTwoMoveCheckMateWhiteWithoutMovingThere(gid);
    	}
    	else
    	{
    		if (movethere) TestDriver.setUpBoardWithTwoMoveCheckMateBlack(gid);
    		else TestDriver.setUpBoardWithTwoMoveCheckMateBlackWithoutMovingThere(gid);
    	}
    }
    static setUpBoardWithTwoMoveCheckMateWhiteMain(gid, movethere)
    {
    	TestDriver.setUpBoardWithTwoMoveCheckMateMain(gid, true, movethere);
    }
    static setUpBoardWithTwoMoveCheckMateBlackMain(gid, movethere)
    {
    	TestDriver.setUpBoardWithTwoMoveCheckMateMain(gid, false, movethere);
    }
    
    static setUpBoardCheckmateKingBishopVSameDiffColorSquares(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 1, 2, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 0, "BLACK", ignorelist, addpcs);
    	TestDriver.testBishopCanMoveToLocs(gid, 1, 0, "BLACK", ignorelist, addpcs);
    	TestDriver.testBishopCanMoveToLocs(gid, 2, 2, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWhiteCheckmateAfterManyMoves(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	addpcs.push(new ChessPiece("CASTLE", "BLACK", 7, 4, gid, 3, false));
    	addpcs.push(new ChessPiece("QUEEN", "BLACK", 5, 0, gid, 2, false));
    	//print the board first
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("FREE PIECES: ", ChessPiece.getPiecesThatAreFreeToMove(gid,
			ignorelist, addpcs));
    	//console.log("IS AUTO-STALEMATE: " + ChessPiece.isAutoStalemate(nwpcslist));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, ignorelist, addpcs));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, ignorelist, addpcs));
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid,
			ignorelist, addpcs));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid,
			ignorelist, addpcs));
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 0, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 6, "BLACK", ignorelist, addpcs);
    	//TestDriver.testBishopCanMoveToLocs(gid, r, c, "BLACK", ignorelist, addpcs);
    	//TestDriver.testBishopCanMoveToLocs(gid, r, c, "WHITE", ignorelist, addpcs);
    }
    
    //SETUP BOARD STALEMATE
    
    static setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, addstuckpawns)
    {
    	TestDriver.cc.letMustBeBoolean(addstuckpawns, "addstuckpawns");
		TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    				else
					{
						TestDriver.cc.logAndThrowNewError("Illegal postion for BLACK row " +
							"of pawns!");
    				}
				}
    			else
    			{
    				npcclr = "WHITE";
    				if (rsi === 3) initmvcnt = 1;
    				else if (rsi === 2) initmvcnt = 2;
    				else if (rsi === 4) initmvcnt = 1;
    				else if (rsi === 5) initmvcnt = 0;
    				else if (rsi === 1) initmvcnt = 3;
    				else
					{
						TestDriver.cc.logAndThrowNewError("Illegal postion for WHITE row " +
							"of pawns!");
    				}
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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, addpcs);
    	if (addstuckpawns)
    	{
    		let ccl = -1;
    		if (csi === 0)
    		{
    			if (incbyval === 2 || incbyval === 1) ccl = 4;
    			else ccl = 3;
    		}
    		else if (csi === 1)
    		{
    			if (incbyval === 1) ccl = 4;
    			else if (incbyval === 3) ccl = 4;
    			else ccl = 3;
    		}
    		//else;//do nothing not a stalemate
    		TestDriver.testPawnCanMoveToLocs(gid, 3, ccl, "BLACK", ignorelist, addpcs);
    		TestDriver.testPawnCanMoveToLocs(gid, 4, ccl, "WHITE", ignorelist, addpcs);
    	}
    	//else;//do nothing
    }
    static setUpBoardWithKingVKingAndStuckPawnsWithoutMovingThere(gid)
    {
    	TestDriver.setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, true);
    }
    static setUpBoardWithKingVKingOnlyWithoutMovingThere(gid)
    {
    	TestDriver.setUpBoardWithKingVKingBlockedPawnsWithoutMoving(gid, false);
    }
    
    static setUpBoardWithKingAndBishopsVKingBishops(gid, numbkbps, numwtbps, usesmt)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		TestDriver.cc.letMustBeAnInteger(numbkbps, "numbkbps");
		TestDriver.cc.letMustBeAnInteger(numwtbps, "numwtbps");
		TestDriver.cc.letMustBeBoolean(usesmt, "usesmt");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	else if ((0 < numbkbps || numbkbps === 0) && (numbkbps < 8 || numbkbps === 8));
		else
		{
			TestDriver.cc.logAndThrowNewError("illegal number of black bishops found and " +
				"used here!");
		}
		if ((0 < numwtbps || numwtbps === 0) && (numwtbps < 8 || numwtbps === 8));
		else
		{
			TestDriver.cc.logAndThrowNewError("illegal number of white bishops found and " +
				"used here!");
		}

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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: ", ChessPiece.getPiecesThatAreFreeToMove(gid, ignorelist,
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, addpcs);
    	//TestDriver.testBishopCanMoveToLocs(gid, int br, int bc, String bclr, ignorelist, addpcs);
    }
    static setUpBoardWithKingAndBishopsVKingBishopsMain(gid, numbkbps, numwtbps)
    {
    	TestDriver.setUpBoardWithKingAndBishopsVKingBishops(gid, numbkbps, numwtbps, true);
    }
    
    static setUpBoardWithBlockedPawnsAndBishops(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: ", ChessPiece.getPiecesThatAreFreeToMove(gid,
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 7, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 7, "BLACK", ignorelist, addpcs);
    	TestDriver.testBishopCanMoveToLocs(gid, 3, 1, "WHITE", ignorelist, addpcs);
    	TestDriver.testBishopCanMoveToLocs(gid, 7, 5, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWithKingAndKnightVKing(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, null, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, null));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, null));
    	console.log("ALL BISHOPS ON SAME COLOR SQUARES: " +
			ChessPiece.areAllBishopsOnSameColorSquare(nwpcslist));
    	console.log("FREE PIECES: ",
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 4, "WHITE", ignorelist, null);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 4, "BLACK", ignorelist, null);
    	TestDriver.testKnightCanMoveToLocs(gid, 7, 6, "WHITE", ignorelist, null);
    }
    
    static setUpBoardWhiteStalemateAfterManyMoves(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
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
    	let nwpcslist = ChessPiece.combineBoardAddAndIgnoreListsMain(ignorelist, addpcs, gid);
    	//console.log(nwpcslist);
    	ChessPiece.printBoard(nwpcslist);
    	//test stale mate and check detection here and methods determinging where a
		//piece can move to
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck(ignorelist, addpcs));
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck(ignorelist, addpcs));
    	console.log("FREE PIECES: ",
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
    	
    	TestDriver.testKingCanMoveToLocs(gid, 7, 0, "WHITE", ignorelist, addpcs);
    	TestDriver.testKingCanMoveToLocs(gid, 0, 6, "BLACK", ignorelist, addpcs);
    	//TestDriver.testBishopCanMoveToLocs(gid, r, c, "BLACK", ignorelist, addpcs);
    	//TestDriver.testBishopCanMoveToLocs(gid, r, c, "WHITE", ignorelist, addpcs);
    }
    
    static setUpBoardWhiteStalemateKingAndQueenVsKing(gid)
    {
    	TestDriver.cc.letMustBeAnInteger(gid, "gid");
		if (gid < 1) TestDriver.cc.logAndThrowNewError("GAME ID must be at least 1!");
    	//else;//do nothing

		//black king on a corner
    	//white king diagnal 2 spots away from it
    	//white queen needs to move to a position
    	let mypcs = [];//new ArrayList<ChessPiece>();
    	mypcs.push(new ChessPiece("KING", "BLACK", 7, 0, gid, 10, false));
    	mypcs.push(new ChessPiece("KING", "WHITE", 5, 2, gid, 10, false));
    	mypcs.push(new ChessPiece("QUEEN", "WHITE", 6, 3, gid, 10, false));
    	ChessPiece.setUpBoardFromList(gid, mypcs);
    	ChessPiece.printBoardViaGameID(gid);
    	//now program the move(s)
    	let iswhitedown = ChessPiece.WHITE_MOVES_DOWN_RANKS;
    	let isuser = false;
    	let wqn = ChessPiece.getPieceAtVIAGID(6, 3, gid);//D7
    	
    	let mymv = wqn.genMoveToCommandFromMeMain(6, 2);
    	let myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
    	//let myounmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain("UNDO", gid);
		//error no move to pull from
    	let myredmv = ChessPiece.genRedoMoveToShortHandCommand(myunmv);
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//ChessPiece.convertAllShortHandMovesToLongVersion(myounmv);//error no move to pull from
    	ChessPiece.convertAllShortHandMovesToLongVersion(myredmv);
    	
    	ChessPiece.makeLocalShortHandMove(mymv, gid, isuser, false, iswhitedown);//C7
    	//ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommandFromMeMain(6, 1), gid, isuser,
		//	false, iswhitedown);//B7
    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.printBoardViaGameID(gid);
    	//now print the results of stalemate and checkmate
    	let wkg = ChessPiece.getCurrentSideKingMain("WHITE", gid);
    	let bkg = ChessPiece.getCurrentSideKingMain("BLACK", gid);
    	console.log("WHITE KING IS IN CHECK: " + wkg.inCheck());
    	console.log("BLACK KING IS IN CHECK: " + bkg.inCheck());
    	console.log("WHITE IS IN CHECKMATE: " + ChessPiece.inCheckmateWhite(gid, null, null));
    	console.log("BLACK IS IN CHECKMATE: " + ChessPiece.inCheckmateBlack(gid, null, null));
    	console.log("WHITE IN STALEMATE: " + ChessPiece.isStalemateWhite(gid, null, null));
    	console.log("BLACK IN STALEMATE: " + ChessPiece.isStalemateBlack(gid, null, null));
    	//undo it
    	let myounmv = ChessPiece.genFullMoveCommandFromDisplayedCommandMain("UNDO", gid);
    	//console.log("MY UNDO MOVE:");
    	ChessPiece.convertAllShortHandMovesToLongVersion(myunmv);
    	//console.log("MY O UNDO MOVE:");
    	ChessPiece.convertAllShortHandMovesToLongVersion(myounmv);
    	
    	ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
    	ChessPiece.makeLocalMoveMain(myunmv, gid, isuser, true, iswhitedown);
    	//ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    	ChessPiece.getGameVIAGID(gid).clearUnofficialMove();
    	ChessPiece.printBoardViaGameID(gid);
    	console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
    	
    	let dodrawtests = true;
    	let tstdrawcmd = true;
    	if (tstdrawcmd && dodrawtests)
    	{
    		ChessPiece.makeLocalMoveMain(
    			ChessPiece.getFullTieCommand("BLACK", true, false), gid, isuser, false,
					iswhitedown);
    	}
    	//else;//do nothing
    	
    	let tstrdoundocmds = true;
    	if (tstrdoundocmds)
    	{
    		console.log("");
    		console.log("TEST REDO COMMAND:");
			ChessPiece.makeLocalMove(
				ChessPiece.getGameVIAGID(gid).genCommandToRedoLastUndoneMove(), gid, isuser);
	    	ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
	    	ChessPiece.getGameVIAGID(gid).setLastUndoneMove(null);
	    	ChessPiece.printBoardViaGameID(gid);
	    	console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
	    	console.log("");
	    	
	    	console.log("TEST UNDO COMMAND:");
	    	ChessPiece.getGameVIAGID(gid).makeLastOfficialMoveUnofficial();
	    	ChessPiece.makeLocalMoveMain(
				ChessPiece.getGameVIAGID(gid).genCommandToUndoLastMadeMove(),
				gid, isuser, true, iswhitedown);
	    	//ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
	    	ChessPiece.getGameVIAGID(gid).clearUnofficialMove();
	    	ChessPiece.printBoardViaGameID(gid);
	    	console.log("");
    	}
    	//else;//do nothing
    	console.log(ChessPiece.getGameVIAGID(gid).getSideTurn() + "'S TURN!");
    	
    	let otstdrawcmd = true;
    	if (otstdrawcmd && dodrawtests)
    	{
    		ChessPiece.makeLocalMoveMain(
    			ChessPiece.getFullTieCommand("WHITE", true, false), gid, isuser, false,
					iswhitedown);
    	}
    	else
    	{
    		//make the other move
    		ChessPiece.makeLocalShortHandMove(wqn.genMoveToCommandFromMeMain(6, 1), gid, isuser,
				false, iswhitedown);//B7
    		ChessPiece.getGameVIAGID(gid).makeUnofficialMoveOfficial();
    		ChessPiece.printBoardViaGameID(gid);
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
