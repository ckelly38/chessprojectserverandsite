
import java.util.ArrayList;
class ChessPiece {
	private static String[] validTypes = {"PAWN", "CASTLE", "KNIGHT", "BISHOP", "QUEEN", "KING", "ROOK"};
	private static String[] validColors = {"WHITE", "BLACK"};
	public static String[][] clrs = getSquareColors();
	public static final int ROWCOLMIN = 0;
	public static final int ROWCOLMAX = 7;
	public static final boolean WHITE_MOVES_DOWN_RANKS = false;
	public static ArrayList<ChessPiece> cps = new ArrayList<ChessPiece>();
	//only one copy so will cause a problem with multiple games
	private String type = "";
	private String color = "";
	private int row = -1;
	private int col = -1;
	private int gameID = -1;
	private int movecount = 0;
	private boolean isfirstmove = true;
	
	public ChessPiece(String tp, String clr, int r, int c, int gid, int initmvcnt, boolean addit)
	{
		if (tp == null || clr == null) throw new IllegalStateException("the given type and color must not be null!");
		setRow(r);
		setCol(c);
		setType(tp.toUpperCase());
		setColor(clr.toUpperCase());
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		else this.gameID = gid;
		if (addit) cps.add(this);
		if (initmvcnt < 1);
		else
		{
			this.movecount = initmvcnt;
			isfirstmove = false;
		}
	}
	public ChessPiece(String tp, String clr, int r, int c, int gid, boolean addit)
	{
		this(tp, clr, r, c, gid, 0, addit);
	}
	public ChessPiece(String tp, String clr, int r, int c, int gid)
	{
		this(tp, clr, r, c, gid, 0, true);
	}
	public ChessPiece(String tp, String clr, int[] loc, int gid, boolean addit)
	{
		this(tp, clr, loc[0], loc[1], gid, 0, addit);
	}
	public ChessPiece(String tp, String clr, int[] loc, int gid)
	{
		this(tp, clr, loc[0], loc[1], gid, 0, true);
	}
	public ChessPiece(String tp, String clr, int[] loc, int gid, int initmvcnt, boolean addit)
	{
		this(tp, clr, loc[0], loc[1], gid, initmvcnt, addit);
	}
	public ChessPiece(String tp, String clr, int r, int c, int gid, int initmvcnt)
	{
		this(tp, clr, r, c, gid, initmvcnt, true);
	}
	
	
	public int getGameID()
	{
		return 0 + this.gameID;
	}
	
	public static ChessGame getGame(int gid)
	{
		return ChessGame.getGame(gid);
	}
	public ChessGame getGame()
	{
		return getGame(getGameID());
	}
	
	public static String getSideTurnFromGame(int gid)
	{
		return getGame(gid).getSideTurn();
	}
	public String getSideTurnFromGame()
	{
		return getSideTurnFromGame(getGameID());
	}
	
	//NORMAL BOARD SETUP METHOD
    
    public static void setUpBoard(int gid, boolean pawnsonly)
    {
    	if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing safe to proceed
    	
    	//white pawns on row 6 cols 0 through 7
    	//black pawns on row 1 cols 0 through 7
    	for (int x = 0; x < 2; x++)
    	{
    		int r = -1;
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
    		for (int c = 0; c < 8; c++)
	    	{
	    		ChessPiece cp = new ChessPiece("PAWN", clr, r, c, gid);
	    		//cps.add(cp);
	    	}
	    	if (pawnsonly);
	    	else
	    	{
	    		int orw = -1;
		    	if (clr.equals("WHITE")) orw = 7;
		    	else orw = 0;
		    	String[] mvtypes = ChessPiece.getValidTypes();
		    	for (int k = 0; k < mvtypes.length; k++)
		    	{
		    		if (mvtypes[k].equals("PAWN") || mvtypes[k].equals("ROOK")) continue;
		    		else
		    		{
		    			System.out.println("mvtypes[" + k + "] = " + mvtypes[k]);
		    			boolean uselft = true;
		    			for (int i = 0; i < 2; i++)
		    			{
		    				if (i == 0);
		    				else uselft = false;
		    				int nwcl = ChessPiece.getSetUpColForType(mvtypes[k], uselft);
		    				//System.out.println("i = " + i);
		    				//System.out.println("CREATED NEW PIECE AT (" + orw + ", " + nwcl + ")");
		    				ChessPiece ocp = new ChessPiece(mvtypes[k], clr, orw, nwcl, gid);
		    				//cps.add(ocp);
		    				if (mvtypes[k].equals("KING") || mvtypes[k].equals("QUEEN")) break;
		    			}//end of i for loop
		    		}
		    	}//end of k for loop
	    	}
    	}//end of x for loop
    }
	public static void setUpBoard(int gid)
	{
		setUpBoard(gid, false);
	}
	
	public static void clearBoard(int gid)
	{
		ArrayList<ChessPiece> allpcs = getAllPiecesWithGameID(gid);
		int numpcs = getNumItemsInList(allpcs);
		if (numpcs < 1);
		else
		{
			for (int x = 0; x < allpcs.size(); x++)
			{
				removePieceAt(allpcs.get(x).getRow(), allpcs.get(x).getCol(), gid, true);
			}
			for (int x = 0; x < allpcs.size(); x++) allpcs.set(x, null);
			allpcs.clear();
			allpcs = null;
		}
	}
	
	public static void setUpBoard(int gid, ArrayList<ChessPiece> addpcs)
	{
		//clear the old board
		//now make copies of those add pcs
		//this is the new board
		int numpcs = getNumItemsInList(addpcs);
		if (numpcs < 1);//do nothing
		else
		{
			clearBoard(gid);
			
			ArrayList<ChessPiece> mylist = new ArrayList<ChessPiece>();
			for (int x = 0; x < numpcs; x++)
			{
				mylist.add(new ChessPiece(addpcs.get(x).getType(), addpcs.get(x).getColor(),
					addpcs.get(x).getRow(), addpcs.get(x).getCol(), gid, addpcs.get(x).getMoveCount(), true));
			}
		}
	}
	
	//PRINT BOARD METHODS
    
    public static void printBoard(ArrayList<ChessPiece> mycps)
    {
    	//for (int c = 0; c < mycps.size(); c++) System.out.println(mycps.get(c));
    	System.out.println("mycps.size() = " + mycps.size());
    	String myabt = "ABCDEFGH";
    	for (int c = 0; c < 8; c++) System.out.print("  " + c + " ");
    	System.out.println(" (cols)");
    	for (int c = 0; c < 8; c++) System.out.print("  " + myabt.charAt(c) + " ");
    	System.out.println("|RK|RW");
    	for (int r = 0; r < 8; r++)
    	{
    		for (int c = 0; c < 8; c++)
    		{
    			System.out.print("|");
    			boolean fndit = false;
    			for (int x = 0; x < mycps.size(); x++)
    			{
    				if (mycps.get(x).getRow() == r && mycps.get(x).getCol() == c)
    				{
    					//first letter of color, first letter of type, last letter of type
    					String mtp = "" + mycps.get(x).getType();
    					String mclr = "" + mycps.get(x).getColor();
    					System.out.print("" + mclr.charAt(0) + mtp.charAt(0) + mtp.charAt(mtp.length() - 1));
    					fndit = true;
    					break;
    				}
    				//else;//do nothing
    			}
    			if (fndit);
    			else System.out.print("---");
    		}
    		if (ChessPiece.WHITE_MOVES_DOWN_RANKS) System.out.println("| " + (r + 1) + "| " + r);
    		else System.out.println("| " + (8 - r) + "| " + r);
    	}
    }
    public static void printBoard(int gid)
    {
    	if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		else printBoard(ChessPiece.getAllPiecesWithGameID(gid));
    }
	public void printBoard()
	{
		printBoard(getGameID());
	}
	
	
	//GET ALL PIECES OF A GAME
	
	public static ArrayList<ChessPiece> getAllPiecesWithGameID(int val)
	{
		if (val < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		else
		{
			ArrayList<ChessPiece> mycps = null;
			if (getNumItemsInList(cps) < 1) return null;
			//else;//do nothing
			for (int x = 0; x < cps.size(); x++)
			{
				if (cps.get(x).getGameID() == val)
				{
					if (mycps == null) mycps = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					mycps.add(cps.get(x));
				}
				//else;//do nothing
			}
			return mycps;
		}
	}
	public ArrayList<ChessPiece> getAllPiecesWithGameID()
	{
		return getAllPiecesWithGameID(getGameID());
	}
	
	
	//NOTE: VALID COLORS LIST DOES NOT INCLUDE BOTH
	public static String[] getValidTypesOrColors(boolean useclrs)
	{
		String[] marr = null;
		if (useclrs) marr = validColors;
		else marr = validTypes;
		final int maxitems = marr.length;
		String[] nwarr = new String[maxitems];
		for (int i = 0; i < maxitems; i++) nwarr[i] = "" + marr[i];
		return nwarr;
	}
	public static String[] getValidTypes()
	{
		return getValidTypesOrColors(false);
	}
	public static String[] getValidColors()
	{
		return getValidTypesOrColors(true);
	}
	
	public static int getSetUpColForType(String val, boolean uselft)
	{
		if (val == null) throw new IllegalStateException("null not allowed for the type of chess piece!");
		
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
		else throw new IllegalStateException("PAWNS ARE FOUND ON ALL COLS!");
	}
	
	public static boolean isGenderKnownForPiece(String tp)
	{
		if (itemIsOnGivenList(tp, validTypes));
		else throw new IllegalStateException("tp (" + tp + ") is not a valid chess piece type!");
		
		if (tp.equals("PAWN")) return false;//pawns are either
		else return true;
	}
	public boolean isGenderKnownForPiece()
	{
		return isGenderKnownForPiece(getType());
	}
	//false for female, true for male, ILLEGALSTATE for PAWNS
	public static boolean getGenderForPiece(String tp)
	{
		if (isGenderKnownForPiece(tp))
		{
			//return the answer
			if (tp.equals("QUEEN")) return false;
			else return true;
		}
		else throw new IllegalStateException("PAWNS ARE CAPABLE OF BOTH GENDERS SO GENDER IS UNKNOWN!");
	}
	public boolean getGenderForPiece()
	{
		return getGenderForPiece(getType());
	}
	public String convertGenderValueToString()
	{
		if (isGenderKnownForPiece())
		{
			if (getGenderForPiece()) return "MALE";
			else return "FEMALE";
		}
		else return "UNKNOWN";
	}
	
	//GET TYPE AND COLOR METHODS
	
	private void setTypeOrColor(String val, boolean useclr)
	{
		String[] marr = null;
		if (useclr) marr = validColors;
		else marr = validTypes;
		if (itemIsOnGivenList(val, marr))
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
			throw new IllegalStateException("ILLEGAL " + mitemstr + " (" + val + ") FOUND AND USED HERE!");
		}
	}
	private void setType(String val)
	{
		setTypeOrColor(val, false);
	}
	private void setColor(String val)
	{
		setTypeOrColor(val, true);
	}
	public String getTypeOrColor(boolean useclr)
	{
		if (useclr) return "" + this.color;
		else return "" + this.type;
	}
	public String getType()
	{
		return getTypeOrColor(false);
	}
	public String getColor()
	{
		return getTypeOrColor(true);
	}
	public static String getLongHandType(String tpval)
	{
		if (tpval == null || tpval.length() != 2) throw new IllegalStateException("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		else if (tpval.equals("KG")) return "KING";
		else if (tpval.equals("KT")) return "KNIGHT";
		else if (tpval.equals("CE")) return "CASTLE";
		else if (tpval.equals("QN")) return "QUEEN";
		else if (tpval.equals("BP")) return "BISHOP";
		else if (tpval.equals("PN")) return "PAWN";
		else throw new IllegalStateException("ILLEGAL SHORT HAND TYPE (" + tpval + ") FOUND!");
	}
	public static String getShortHandType(String tpval)
	{
		if (tpval == null || tpval.length() < 1) throw new IllegalStateException("NULL OR EMPTY TYPE NOT ALLOWED HERE!");
		else if (itemIsOnGivenList(tpval, validTypes))
		{
			if (tpval.equals("ROOK")) return "CE";
			else return "" + tpval.charAt(0) + tpval.charAt(tpval.length() - 1);
		}
		else throw new IllegalStateException("INVALID TYPE (" + tpval + ") FOUND HERE!");
	}
	public String getShortHandType()
	{
		return getShortHandType(getType());
	}
	//NOTE: DOES NOT INCLUDE BOTH
	public static String getShortHandColor(String clrval)
	{
		if (clrval == null || clrval.length() < 1) throw new IllegalStateException("NULL OR EMPTY COLOR NOT ALLOWED HERE!");
		else if (itemIsOnGivenList(clrval, validColors)) return "" + clrval.charAt(0);
		else throw new IllegalStateException("INVALID COLOR (" + clrval + ") FOUND HERE!");
	}
	public String getShortHandColor()
	{
		return getShortHandColor(getColor());
	}
	public static String getLongHandColor(String clrval)
	{
		if (clrval == null || clrval.length() != 1) throw new IllegalStateException("THE COLOR MUST NOT BE NULL!");
		else if (clrval.equals("W")) return "WHITE";
		else if (clrval.equals("B")) return "BLACK";
		else throw new IllegalStateException("INVALID COLOR (" + clrval + ") FOUND AND USED HERE!");
	}
	//NOTE: DOES NOT INCLUDE BOTH
	public static String getOppositeColor(String clrval)
	{
		if (clrval == null) throw new IllegalStateException("THE COLOR MUST NOT BE NULL!");
		else if (clrval.equals("WHITE")) return "BLACK";
		else if (clrval.equals("BLACK")) return "WHITE";
		else throw new IllegalStateException("INVALID COLOR (" + clrval + ") FOUND AND USED HERE!");
	}
	//throws an exception if the the colors are not valid
	//allows both by default
	public static void colorIsValid(String clrval, boolean allowbth)
	{
		if (clrval == null || clrval.length() != 5) throw new IllegalStateException("INVALID LENGTH FOR THE COLOR!");
		else
		{
			if (clrval.equals("WHITE") || clrval.equals("BLACK") || (allowbth && clrval.equals("BOTH")));
			else throw new IllegalStateException("INVALID COLOR!");
		}
	}
	public static void colorIsValid(String clrval)
	{
		colorIsValid(clrval, true);
	}
	
	
	//MOVE COUNT METHODS
	
	private void incrementMoveCount()
	{
		this.movecount = this.movecount + 1;
	}
	private void decrementMoveCount()
	{
		if (0 < this.movecount) this.movecount = this.movecount - 1;
	}
	public int getMoveCount()
	{
		return this.movecount;
	}
	public void setMoveCount(int val)
	{
		if (val < 0) throw new IllegalStateException("illegal value found and used for the move count!");
		this.movecount = val;
	}
	
	public static boolean itemIsOnGivenList(String val, String[] arr)
	{
		if (arr == null || arr.length < 1) return false;
		for (int i = 0; i < arr.length; i++)
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
			//System.out.println("OLD ARRAY:");
			//for (int r = 0; r < myarr.length; r++)
			//{
			//	for (int c = 0; c < myarr[0].length; c++)
			//	{
			//		System.out.println("myarr[" + r + "][" + c + "] = " + myarr[r][c]);
			//	}
			//}
			
			//System.out.println("OLD DIMENSIONS: myarr.length = " + myarr.length);
			//System.out.println("myarr[0].length = " + myarr[0].length);
			
			int[][] resarr = new int[myarr[0].length][myarr.length];
			//System.out.println("NEW DIMENTIONS: resarr.length = " + resarr.length);
			//System.out.println("resarr[0].length = " + resarr[0].length);
			
			for (int r = 0; r < myarr.length; r++)
			{
				for (int c = 0; c < myarr[0].length; c++) resarr[c][r] = myarr[r][c];
			}
			
			//System.out.println("NEW ARRAY:");
			//for (int r = 0; r < resarr.length; r++)
			//{
			//	for (int c = 0; c < resarr[0].length; c++)
			//	{
			//		System.out.println("resarr[" + r + "][" + c + "] = " + resarr[r][c]);
			//	}
			//}
			//throw new IllegalStateException("NEED TO CHECK IF THIS WORKS!");
			return resarr;
		}
	}
	
	
	//METHODS FOR GETTING NUM ITEMS IN LIST
	
	public static int getNumItemsInList(ArrayList mylist)
	{
		if (mylist == null) return 0;
		else return mylist.size();
	}
	public static int getNumItemsInList(Object[] arr)
	{
		if (arr == null) return 0;
		else return arr.length;
	}
	public static int getNumItemsInList(int[] arr)
	{
		if (arr == null) return 0;
		else return arr.length;
	}
	public static int getNumItemsInList(double[] arr)
	{
		if (arr == null) return 0;
		else return arr.length;
	}
	public static int getNumItemsInList(float[] arr)
	{
		if (arr == null) return 0;
		else return arr.length;
	}
	public static int getNumItemsInList(long[] arr)
	{
		if (arr == null) return 0;
		else return arr.length;
	}
	
	
	//SOME LOCATION METHODS
	
	public static boolean isvalidrorc(int val)
	{
		if (val < ChessPiece.ROWCOLMIN || ChessPiece.ROWCOLMAX < val) return false;
		else return true;
	}
	private void setRowOrCol(int val, boolean usecol)
	{
		if (isvalidrorc(val))
		{
			if (usecol) this.col = val;
			else this.row = val;
		}
		else throw new IllegalStateException("the value (" + val + ") for the row or column is invalid!");
	}
	private void setCol(int val)
	{
		setRowOrCol(val, true);
	}
	private void setRow(int val)
	{
		setRowOrCol(val, false);
	}
	
	public static String getLocString(int rval, int cval)
	{
		return "(row: " + rval + ", col: " + cval + ")";
	}
	public static String getLocString(int[] loc)
	{
		if (loc == null) return null;
		else if (loc.length != 2) throw new IllegalStateException("illegal loc found and used here!");
		else return getLocString(loc[0], loc[1]);
	}
	public String getLocString()
	{
		return getLocString(getRow(), getCol());
	}
	
	public int getRowOrCol(boolean usecol)
	{
		if (usecol) return this.col;
		else return this.row;
	}
	public int getRow()
	{
		return getRowOrCol(false);
	}
	public int getCol()
	{
		return getRowOrCol(true);
	}
	public int[] getLoc()
	{
		int[] loc = new int[2];
		loc[0] = getRow();
		loc[1] = getCol();
		return loc;
	}
	//by default set the move
	public void setLoc(int rval, int cval, boolean skipsetmv)
	{
		boolean terr = false;
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
					System.out.println("SETLOC: mymvcmd = " + mymvcmd);
					getGame().setLastSetLocMove(mymvcmd);
					//System.out.println("SETLOC: mymvcmd = " + getGame().getLastSetLocMove());
				}
				setRow(rval);
				setCol(cval);
			//}
			//else terr = true;
		}
		else terr = true;
		if (terr) throw new IllegalStateException("cannot move to new location " + getLocString(rval, cval) + "!");
	}
	public void setLoc(int rval, int cval)
	{
		setLoc(rval, cval, false);
	}
	public void setLoc(int[] loc, boolean skipsetmv)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else setLoc(loc[0], loc[1], skipsetmv);
	}
	public void setLoc(int[] loc)
	{
		setLoc(loc, false);
	}
	
	public static void printSquareColors()
	{
		String myabt = "ABCDEFGH";
		for (int r = 0; r < 8; r++)
		{
			if (r == 0)
			{
				for (int c = 0; c < 8; c++) System.out.print("  " + myabt.charAt(c) + "   ");
				System.out.println();
			}
			for (int c = 0; c < 8; c++) System.out.print(clrs[r][c] + " ");
			System.out.println((r + 1));
		}
	}
	public static String[][] getSquareColors()
	{
		//D1 is BLACK; D8 is WHITE; H8 is WHITE
		clrs = new String[8][8];
		for (int r = 0; r < 8; r++)
		{
			String sclr = null;
			if (r % 2 == 0) sclr = "WHITE";
			else sclr = "BLACK";
			for (int c = 0; c < 8; c++)
			{
				if (c%2 == 0) clrs[r][c] = "" + sclr;
				else clrs[r][c] = getOppositeColor(sclr);
				//System.out.println("clrs[" + r + "][" + c + "] = " + clrs[r][c]);
			}
		}
		
		//printSquareColors();
		return clrs;
	}
	public static String getColorOfLoc(int rval, int cval)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be at least 0 and less than 8!");
		
		return "" + clrs[rval][cval];
	}
	public static String getColorOfLoc(ChessPiece cp)
	{
		if (cp == null) throw new IllegalStateException("cp is not allowed to be null!");
		else return getColorOfLoc(cp.getRow(), cp.getCol());
	}
	
	//CONVERT LOCS METHODS
	
	public static boolean locStringIsInCorrectFormat(String mlocstr)
	{
		if (mlocstr == null) throw new IllegalStateException("the locstring must not be null!");
		else
		{
			if (mlocstr.length() == 2);
			else throw new IllegalStateException("the locstring must be length 2!");
		}
		
		String abet = "ABCDEFGH";
		boolean fndltr = false;
		int ltri = -1;
		for (int i = 0; i < abet.length(); i++)
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
			throw new IllegalStateException("the locstr is in the wrong format! A letter must be first! " +
				"If a letter is actually first, then it is illegal! If it is legal, then it is not capitalized!");
		}
		
		String dgts = "0123456789";
		boolean fnddgt = false;
		//allow only 1 through 8 inclusive
		for (int i = 1; i < dgts.length() - 1; i++)
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
			throw new IllegalStateException("the locstr is in the wrong format! A digit must be last! " +
				"If a digit is actually last, then it is illegal!");
		}
		return true;
	}
	
	public static String convertWhiteDownRanksLocToWhiteUpRanksLocString(String dstr)
	{
		locStringIsInCorrectFormat(dstr);
		
		//column stays the same
		return "" + dstr.charAt(0) + (8 - Integer.parseInt("" + dstr.charAt(1)) + 1);
	}
	public static String convertWhiteUpRanksLocToWhiteDownRanksLocString(String ustr)
	{
		locStringIsInCorrectFormat(ustr);
		
		//column stays the same
		return "" + ustr.charAt(0) + (Integer.parseInt("" + ustr.charAt(1)) + 8 - 1);
	}
	public static String convertWhiteDownOrUpRanksLocToOther(String mstr, boolean iswhitedown)
	{
		if (iswhitedown) return convertWhiteDownRanksLocToWhiteUpRanksLocString(mstr);
		else return convertWhiteUpRanksLocToWhiteDownRanksLocString(mstr);
	}
	
	//iswhitedown (means does white move down ranks) (what white was doing when the given location string was generated)
	//this will convert the location string if iswhitedown is not the same as WHITE_MOVES_DOWN_RANKS
	public static int[] convertStringLocToRowCol(String mlocstr, boolean iswhitedown)
	{
		locStringIsInCorrectFormat(mlocstr);
		if (iswhitedown == WHITE_MOVES_DOWN_RANKS);
		else return convertStringLocToRowCol(convertWhiteDownOrUpRanksLocToOther(mlocstr, iswhitedown), !iswhitedown);	
		
		String abet = "ABCDEFGH";
		boolean fndltr = false;
		int ltri = -1;
		for (int i = 0; i < abet.length(); i++)
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
			throw new IllegalStateException("the locstr is in the wrong format! A letter must be first! " +
				"If a letter is actually first, then it is illegal! If it is legal, then it is not capitalized!");
		}
		
		String dgts = "0123456789";
		int[] myloc = new int[2];
		myloc[1] = Integer.parseInt("" + dgts.charAt(ltri));//letter is column
		if (WHITE_MOVES_DOWN_RANKS) myloc[0] = Integer.parseInt("" + mlocstr.charAt(1)) - 1;//number is row
		else myloc[0] = 8 - Integer.parseInt("" + mlocstr.charAt(1));//number is row
		
		if (isvalidrorc(myloc[0]) && isvalidrorc(myloc[1]));
		else throw new IllegalStateException("CONVERSION ERROR! FINAL R AND C ARE NOT VALID!");
		return myloc;
	}
	
	//retwhitedown is WHITE_MOVES_DOWN_RANKS by default
	public static String convertRowColToStringLoc(int rval, int cval, boolean retwhitedown)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("R OR C MUST BE VALID!");
		
		String abet = "ABCDEFGH";
		if (retwhitedown) return "" + abet.charAt(cval) + "" + (rval + 1);
		else return "" + abet.charAt(cval) + "" + (8 - rval);
	}
	public static String convertRowColToStringLoc(int rval, int cval)
	{
		return convertRowColToStringLoc(rval, cval, WHITE_MOVES_DOWN_RANKS);
	}
	public static String convertRowColToStringLoc(int[] mloc, boolean retwhitedown)
	{
		if (mloc == null || mloc.length != 2) throw new IllegalStateException("the loc array must have two integers on it!");
		else return convertRowColToStringLoc(mloc[0], mloc[1], retwhitedown);
	}
	public static String convertRowColToStringLoc(int[] mloc)
	{
		return convertRowColToStringLoc(mloc, WHITE_MOVES_DOWN_RANKS);
	}
	
	//if not valid, it just prints it out and does not convert it
	//uses WHITE_MOVES_DOWN_RANKS value
	public static String getLocStringAndConvertIt(int rval, int cval)
	{
		String lstr = getLocString(rval, cval);
		if (isvalidrorc(rval) && isvalidrorc(cval))
		{
			return "" + lstr + " " + convertRowColToStringLoc(rval, cval, WHITE_MOVES_DOWN_RANKS);
		}
		else return lstr;
	}
	public static String getLocStringAndConvertIt(int[] mloc)
	{
		if (mloc == null || mloc.length != 2) throw new IllegalStateException("the loc array must have two integers on it!");
		else return getLocStringAndConvertIt(mloc[0], mloc[1]);
	}
	
	public static int[][] getLocsFromPieceList(ArrayList<ChessPiece> allpcs)
	{
		int mxitems = getNumItemsInList(allpcs); 
		if (mxitems < 1) return null;
		else
		{
			int[][] locs = new int[mxitems][2];
			for (int x = 0; x < mxitems; x++)
			{
				locs[x][0] = allpcs.get(x).getRow();
				locs[x][1] = allpcs.get(x).getCol();
			}
			return locs;
		}
	}
	
	public static void printLocsArray(int[][] locs, String arrnm, ChessPiece cp)
    {
    	if (arrnm == null || arrnm.length() < 1)
    	{
    		printLocsArray(locs, "locs");
    		return;
    	}
    	//else;//do nothing
    	
    	if (locs == null) System.out.println("" + arrnm + " = null");
    	else if (locs.length < 1) System.out.println("" + arrnm + " is empty!");
    	else
    	{
    		System.out.println("" + arrnm + ".length = " + locs.length);
    		boolean iscloc = false;
	    	for (int x = 0; x < locs.length; x++)
	    	{
	    		if (cp == null);
	    		else iscloc = (cp.getRow() == locs[x][0] && cp.getCol() == locs[x][1]);
	    		String msg = "" + getLocStringAndConvertIt(locs[x][0], locs[x][1]);
	    		if (iscloc) msg += " (you are here)";
	    		else
	    		{
	    			if (cp == null);
	    			else
	    			{
	    				if (cp.getType().equals("PAWN"))
		    			{
		    				if (canPawnBePromotedAt(locs[x][0], locs[x][1], cp.getColor(), cp.getType()))
		    				{
		    					msg += " (promotion)";
		    				}
		    				else if (cp.isMoveToASpecialMove(locs[x][0], locs[x][1], null, null, false))
		    				{
		    					msg += " (pawning)";
		    				}
		    				//else;//do nothing
		    			}
		    			else if (cp.getType().equals("KING"))
		    			{
		    				if (cp.isMoveToASpecialMove(locs[x][0], locs[x][1], null, null, false))
		    				{
		    					msg += " (castleing)";
		    				}
		    				//else;//do nothing
		    			}
		    			//else;//do nothing
	    			}
	    		}
	    		System.out.println(msg);
	    	}
    	}
    }
    public static void printLocsArray(int[][] locs, String arrnm)
    {
    	printLocsArray(locs, arrnm, null);
    }
    public static void printLocsArray(int[][] locs)
    {
    	printLocsArray(locs, "locs");
    }
	
	public static void printOneDIntArray(int[] arr)
	{
		if (arr == null) System.out.println("arr = null!");
		else if (arr.length < 1) System.out.println("arr is empty!");
		else
		{
			for (int i = 0; i < arr.length; i++)
			{
				System.out.println("arr[" + i + "] = " + arr[i]);
			}
		}
		System.out.println();
	}
	
	public static void printPiecesList(ArrayList<ChessPiece> pcs, boolean onelineonly, String bfrmsg)
	{
		if (bfrmsg == null)
		{
			printPiecesList(pcs, onelineonly, "");
			return;
		}
		//else;//do nothing
		
		if (onelineonly) System.out.println(bfrmsg + "pcs = " + pcs);
		else
		{
			int numpcs = getNumItemsInList(pcs);
			if (pcs == null || numpcs < 1) System.out.println(bfrmsg + "pcs is null or empty!");
			else
			{
				System.out.println(bfrmsg + "pcs has " + numpcs + " item(s) on it!");
				for (int p = 0; p < numpcs; p++) System.out.println("pcs.get(" + p + ") = " + pcs.get(p));
			}
		}
	}
	
	
	//METHODS TO GENERATE THE NEW BOARD LIST FROM A LIST OF CHANGES TO THE OLD BOARD
	
	public static ArrayList<ChessPiece> combineBoardAndIgnoreLists(int[][] ignorelist, ArrayList<ChessPiece> boardlist)
	{
		if (boardlist == null || boardlist.size() < 1) return boardlist;
		if (ignorelist == null || ignorelist.length < 1) return boardlist;
		//both not empty
		ArrayList<ChessPiece> retlist = null;
		for (int x = 0; x < boardlist.size(); x++)
		{
			boolean addit = true;
			for (int r = 0; r < ignorelist.length; r++)
			{
				if (boardlist.get(x).getRow() == ignorelist[r][0] && boardlist.get(x).getCol() == ignorelist[r][1])
				{
					addit = false;
					break;
				}
				//else;//do nothing
			}
			if (addit)
			{
				if (retlist == null) retlist = new ArrayList<ChessPiece>();
				//else;//do nothing
				retlist.add(boardlist.get(x));
			}
			//else;//do nothing
		}
		return retlist;
	}
	public static ArrayList<ChessPiece> combineBoardAndIgnoreLists(int[][] ignorelist, int gid)
	{
		return combineBoardAndIgnoreLists(ignorelist, getAllPiecesWithGameID(gid));
	}
	
	public static ArrayList<ChessPiece> combineBoardAddAndIgnoreLists(int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		ArrayList<ChessPiece> boardlist)
	{
		//we prioritize the: addlist > ignorelist > boardlist
		//initially start with the add list
		//then if on the add list and ignore list, ignore what is already accounted for, keep what needs to be kept
		//then determine what we can keep on the last one and that is it...
		//then return result.
		ArrayList<ChessPiece> retlist = null;
		if (getNumItemsInList(addpcs) < 1);
		else
		{
			retlist = new ArrayList<ChessPiece>();
			for (int x = 0; x < addpcs.size(); x++) retlist.add(addpcs.get(x));
		}
		//System.out.println("NEW retlist = " + retlist);
		
		if (getNumItemsInList(addpcs) < 1) retlist = combineBoardAndIgnoreLists(ignorelist, boardlist);
		else
		{
			//System.out.println("RETLIST IS NOT EMPTY!");
			//generate the new ignore list
			//then get the result and add all of that to the retlist
			if (ignorelist == null || ignorelist.length < 1)
			{
				//System.out.println("IGNORELIST IS EMPTY OR NULL!");
				//need to combine board and add list here
				for (int x = 0; x < boardlist.size(); x++)
				{
					boolean addit = true;
					if (retlist == null) retlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					for (int r = 0; r < retlist.size(); r++)
					{
						if (boardlist.get(x).getRow() == retlist.get(r).getRow() &&
							boardlist.get(x).getCol() == retlist.get(r).getCol())
						{
							addit = false;
							break;
						}
						//else;//do nothing
					}
					if (addit) retlist.add(boardlist.get(x));
				}
			}
			else
			{
				//System.out.println("IGNORELIST IS NOT EMPTY!");
				//boolean[] keeploc = new boolean[ignorelist.length];
				//int numrm = 0;
				//for (int x = 0; x < ignorelist.length; x++)
				//{
					//this gets the ignorelist loc
					//now get the other loc to compare it to
				//	keeploc[x] = true;
				//	for (int i = 0; i < retlist.size(); i++)
				//	{
				//		if (retlist.get(i).getRow() == ignorelist[x][0] && retlist.get(i).getCol() == ignorelist[x][1])
				//		{
				//			//do not keep this on the ignore list
				//			//System.out.println("REMOVING THIS LOCATION FROM THE IGNORE LIST!");
				//			//System.out.println("ignorelist[" + x + "][0] = " + ignorelist[x][0]);
				//			//System.out.println("ignorelist[" + x + "][1] = " + ignorelist[x][1]);
				//			keeploc[x] = false;
				//			numrm++;
				//			break;
				//		}
				//		//else;//do nothing
				//	}
				//}
				//System.out.println("numrm = " + numrm);
				
				ArrayList<ChessPiece> bdiglist = null;
				//if (numrm < 0) throw new IllegalStateException("numrm must be at least zero!");
				//else if (numrm < 1) bdiglist = combineBoardAndIgnoreLists(ignorelist, boardlist);
				//else
				//{
					//int[][] nwiglist = new int[ignorelist.length - numrm][2];
					//int nwigli = 0;
					//for (int x = 0; x < ignorelist.length; x++)
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
					bdiglist = combineBoardAndIgnoreLists(ignorelist, boardlist);//nwiglist
				//}
				if (getNumItemsInList(bdiglist) < 1);
				else for (int x = 0; x < bdiglist.size(); x++) retlist.add(bdiglist.get(x));
			}
		}
		//System.out.println("FINAL retlist = " + retlist);
		return retlist;
	}
	public static ArrayList<ChessPiece> combineBoardAddAndIgnoreLists(int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		int gid)
	{
		return combineBoardAddAndIgnoreLists(ignorelist, addpcs, getAllPiecesWithGameID(gid));
	}
	
	//merges the two lists
	public static int[][] combineIgnoreLists(int[][] ilista, int[][] ilistb)
	{
		if (ilista == null || ilista.length < 1) return ilistb;
		else if (ilistb == null || ilistb.length < 1) return ilista;
		else
		{
			int[][] midreslist = new int[ilista.length + ilistb.length][2];
			for (int x = 0; x < midreslist.length; x++)
			{
				midreslist[x][0] = -1;
				midreslist[x][1] = -1;
			}
			int midreslisti = 0;
			for (int x = 0; x < ilista.length; x++)
			{
				midreslist[midreslisti][0] = ilista[x][0];
				midreslist[midreslisti][1] = ilista[x][1];
				midreslisti++;
			}
			for (int x = 0; x < ilistb.length; x++)
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
			for (int x = 0; x < midreslisti; x++)
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
			for (int x = 0; x < lista.size(); x++)
			{
				boolean addit = false;
				for (int p = 0; p < alocs.size(); p++)
				{
					if ((alocs.get(p).getRow() == lista.get(x).getRow()) &&
						(alocs.get(p).getCol() == lista.get(x).getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.add(lista.get(x));
				//else;//do nothing
			}
			for (int x = 0; x < listb.size(); x++)
			{
				boolean addit = false;
				for (int p = 0; p < alocs.size(); p++)
				{
					if ((alocs.get(p).getRow() == listb.get(x).getRow()) &&
						(alocs.get(p).getCol() == listb.get(x).getCol()))
					{
						addit = false;
						break;
					}
					//else;//do nothing
				}
				if (addit) alocs.add(listb.get(x));
				//else;//do nothing
			}
			return alocs;
		}
	}
	
	
	//GET PIECE AT AND IS LOCATION EMPTY METHODS
	
	public static ChessPiece getPieceAt(int rval, int cval, ArrayList<ChessPiece> mpclist)
	{
		if (mpclist == null || mpclist.size() < 1);
		else
		{
			for (int x = 0; x < mpclist.size(); x++)
			{
				if (mpclist.get(x).getRow() == rval && mpclist.get(x).getCol() == cval) return mpclist.get(x);
			}
		}
		//System.out.println("NO ITEMS FOUND AT: " + getLocString(rval, cval) + "!");
		return null;
	}
	public static ChessPiece getPieceAt(int[] loc, ArrayList<ChessPiece> mpclist)
	{
		if (loc == null || loc.length != 2) throw new IllegalStateException("the loc array must have two integers on it!");
		else return getPieceAt(loc[0], loc[1], mpclist);
	}
	public static ChessPiece getPieceAt(int rval, int cval, int gid)
	{
		return getPieceAt(rval, cval, getAllPiecesWithGameID(gid));
	}
	public static ChessPiece getPieceAt(int[] mloc, int gid)
	{
		if (mloc == null || mloc.length != 2) throw new IllegalStateException("the loc array must have two integers on it!");
		else return getPieceAt(mloc[0], mloc[1], gid);
	}
	public ChessPiece getPieceAt(int rval, int cval)
	{
		return getPieceAt(rval, cval, getAllPiecesWithGameID());
	}
	public ChessPiece getPieceAt(int[] mloc)
	{
		if (mloc == null || mloc.length != 2) throw new IllegalStateException("the loc array must have two integers on it!");
		else return getPieceAt(mloc[0], mloc[1]);
	}
	
	public static boolean isLocationEmpty(int rval, int cval, ArrayList<ChessPiece> mpclist)
	{
		ChessPiece cp = getPieceAt(rval, cval, mpclist);
		return (cp == null);
	}
	public static boolean isLocationEmpty(int rval, int cval, int gid)
	{
		ChessPiece cp = getPieceAt(rval, cval, gid);
		return (cp == null);
	}
	//prioritize addpcs list above board list
	public static boolean isLocationEmpty(int rval, int cval, int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (isLocationEmpty(rval, cval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid))) return true;
		else return false;
	}
	public static boolean isLocationEmpty(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocationEmpty(loc[0], loc[1], gid);
	}
	public boolean isLocationEmpty(int rval, int cval)
	{
		return isLocationEmpty(rval, cval, getGameID());
	}
	public boolean isLocationEmpty(int[] loc)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocationEmpty(loc[0], loc[1], getGameID());
	}
	
	//FILTER METHODS BY COLOR, TYPE, OR BOTH
	
	public static ArrayList<ChessPiece> filterListByColor(ArrayList<ChessPiece> mylist, String clrval)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new IllegalStateException("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> myretlist = null;
		if (mylist == null || mylist.size() < 1) return null;
		else
		{
			for (int x = 0; x < mylist.size(); x++)
			{
				if (mylist.get(x).getColor().equals(clrval))
				{
					if (myretlist == null) myretlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					myretlist.add(mylist.get(x));
				}
			}
			return myretlist;
		}
	}
	
	public static ArrayList<ChessPiece> filterListByType(ArrayList<ChessPiece> mylist, String typeval)
	{
		if (itemIsOnGivenList(typeval, validTypes));
		else throw new IllegalStateException("ILLEGAL TYPE (" + typeval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> myretlist = null;
		if (mylist == null || mylist.size() < 1) return null;
		else
		{
			for (int x = 0; x < mylist.size(); x++)
			{
				if (mylist.get(x).getType().equals(typeval))
				{
					if (myretlist == null) myretlist = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					myretlist.add(mylist.get(x));
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
	public static ArrayList<ChessPiece> filterListByColorAndType(String typeval, String clrval, int gid)
	{
		return filterListByColorAndType(typeval, clrval, getAllPiecesWithGameID(gid));
	}
	
	//GET CURRENT SIDE PIECES
	
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(allpcs, clrval);
	}
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		return getCurrentSidePieces(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static ArrayList<ChessPiece> getCurrentSidePieces(String clrval, int gid)
	{
		return getCurrentSidePieces(clrval, getAllPiecesWithGameID(gid));
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getCurrentSidePieces(getOppositeColor(clrval), allpcs);
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		return getOpposingSidePieces(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static ArrayList<ChessPiece> getOpposingSidePieces(String clrval, int gid)
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
	public static ArrayList<ChessPiece> getAllOfType(String typeval, int gid)
	{
		return getAllOfType(typeval, getAllPiecesWithGameID(gid));
	}
	
	
	public static ArrayList<ChessPiece> getAllKings(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("KING", allpcs);
	}
	public static ArrayList<ChessPiece> getAllKings(int gid)
	{
		return getAllKings(getAllPiecesWithGameID(gid));//return getAllOfType("KING", gid);
	}
	public static ArrayList<ChessPiece> getAllCastles(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("CASTLE", allpcs);
	}
	public static ArrayList<ChessPiece> getAllCastles(int gid)
	{
		return getAllCastles(getAllPiecesWithGameID(gid));//return getAllOfType("CASTLE", gid);
	}
	public static ArrayList<ChessPiece> getAllRooks(ArrayList<ChessPiece> allpcs)
	{
		return getAllCastles(allpcs);
	}
	public static ArrayList<ChessPiece> getAllRooks(int gid)
	{
		return getAllCastles(gid);
	}
	public static ArrayList<ChessPiece> getAllQueens(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("QUEEN", allpcs);
	}
	public static ArrayList<ChessPiece> getAllQueens(int gid)
	{
		return getAllQueens(getAllPiecesWithGameID(gid));//return getAllOfType("QUEEN", gid);
	}
	public static ArrayList<ChessPiece> getAllKnights(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("KNIGHT", allpcs);
	}
	public static ArrayList<ChessPiece> getAllKnights(int gid)
	{
		return getAllKnights(getAllPiecesWithGameID(gid));//return getAllOfType("KNIGHT", gid);
	}
	public static ArrayList<ChessPiece> getAllBishops(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("BISHOP", allpcs);
	}
	public static ArrayList<ChessPiece> getAllBishops(int gid)
	{
		return getAllBishops(getAllPiecesWithGameID(gid));//return getAllOfType("BISHOP", gid);
	}
	public static ArrayList<ChessPiece> getAllPawns(ArrayList<ChessPiece> allpcs)
	{
		return getAllOfType("PAWN", allpcs);
	}
	public static ArrayList<ChessPiece> getAllPawns(int gid)
	{
		return getAllPawns(getAllPiecesWithGameID(gid));//return getAllOfType("PAWN", gid);
	}
	
	
	public static ArrayList<ChessPiece> getAllKnightsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllKnights(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllKnightsOfColor(String clrval, int gid)
	{
		return getAllKnightsOfColor(clrval, getAllKnights(gid));
	}
	public static ArrayList<ChessPiece> getAllKingsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllKings(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllKingsOfColor(String clrval, int gid)
	{
		return getAllKingsOfColor(clrval, getAllKings(gid));
	}
	public static ArrayList<ChessPiece> getAllCastlesOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllCastles(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllCastlesOfColor(String clrval, int gid)
	{
		return getAllCastlesOfColor(clrval, getAllCastles(gid));
	}
	public static ArrayList<ChessPiece> getAllRooksOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getAllCastlesOfColor(clrval, allpcs);
	}
	public static ArrayList<ChessPiece> getAllRooksOfColor(String clrval, int gid)
	{
		return getAllCastlesOfColor(clrval, gid);
	}
	public static ArrayList<ChessPiece> getAllQueensOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllQueens(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllQueensOfColor(String clrval, int gid)
	{
		return getAllQueensOfColor(clrval, getAllQueens(gid));
	}
	public static ArrayList<ChessPiece> getAllBishopsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllBishops(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllBishopsOfColor(String clrval, int gid)
	{
		return getAllBishopsOfColor(clrval, getAllBishops(gid));
	}
	public static ArrayList<ChessPiece> getAllPawnsOfColor(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return filterListByColor(getAllPawns(allpcs), clrval);
	}
	public static ArrayList<ChessPiece> getAllPawnsOfColor(String clrval, int gid)
	{
		return getAllPawnsOfColor(clrval, getAllPawns(gid));
	}
	
	
	//GET CURRENT SIDE KING
	
	public static ChessPiece getCurrentSideKing(String clrval, ArrayList<ChessPiece> allpcs)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new IllegalStateException("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		
		ArrayList<ChessPiece> mysidepieces = getCurrentSidePieces(clrval, allpcs);
		if (mysidepieces == null || mysidepieces.size() < 1) return null;
		else
		{
			for (int x = 0; x < mysidepieces.size(); x++)
			{
				if (mysidepieces.get(x).getType().equals("KING")) return mysidepieces.get(x);
			}
			return null;
		}
	}
	public static ChessPiece getCurrentSideKing(String clrval, int gid)
	{
		return getCurrentSideKing(clrval, getAllPiecesWithGameID(gid));
	}
	public static ChessPiece getOppositeSideKing(String clrval, ArrayList<ChessPiece> allpcs)
	{
		return getCurrentSideKing(getOppositeColor(clrval), allpcs);
	}
	public static ChessPiece getOppositeSideKing(String clrval, int gid)
	{
		return getOppositeSideKing(clrval, getAllPiecesWithGameID(gid));
	}
	public ChessPiece getMySideKing()
	{
		if (getType().equals("KING")) return this;
		else return getCurrentSideKing(getColor(), getGameID());
	}
	
	
	//IS BOARD VALID METHODS
	
	public static int getCountForPieceTypeForASide(int[] pccnts, String tpval)
	{
		if (tpval == null || tpval.length() < 1) throw new IllegalStateException("illegal type found and used here!");
		//else;//do nothing
		if (pccnts == null || pccnts.length == 0) return 0;
		else if (pccnts.length != 6) throw new IllegalStateException("illegal counts found and used here!");
		//else;//do nothing
		
		String[] mytps = {"KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"};//ROOK
		int tpi = -1;
		for (int i = 0; i < mytps.length; i++)
		{
			boolean fndit = false;
			if ((mytps[i].equals("CASTLE") && tpval.equals("ROOK")) || (mytps[i].equals(tpval))) fndit = true;
			//else;//do nothing
			
			if (fndit)
			{
				tpi = i;
				break;
			}
			//else;//do nothing
		}
		if (tpi < 0 || mytps.length - 1 < tpi) throw new IllegalStateException("illegal type found and used here!");
		//else;//do nothing
		if (pccnts[tpi] < 0 || 10 < pccnts[tpi]) throw new IllegalStateException("illegal count found and used here!");
		else return pccnts[tpi];
	}
	
	public static int[] getCountsForEachPieceTypeForASide(String[] pcstpcs)
	{
		if (pcstpcs == null) throw new IllegalStateException("there must be pieces on the list!");
		//else;//do nothing
		
		//king, queen, castle (rook), bishop, knight, pawn
		int[] pccnts = new int[6];
		String[] mytps = {"KING", "QUEEN", "CASTLE", "BISHOP", "KNIGHT", "PAWN"};//ROOK
		int[] maxallowed = {1, 9, 10, 10, 10, 8};
		int[] startamt = {1, 1, 2, 2, 2, 8};
		for (int ci = 0; ci < 6; ci++)
		{
			pccnts[ci] = 0;
			for (int x = 0; x < pcstpcs.length; x++)
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
				throw new IllegalStateException("illegal number of pieces found on the board!");
			}
			//else;//do nothing
			if (ci == 0)
			{
				if (pccnts[ci] == maxallowed[ci]);
				else throw new IllegalStateException("illegal number of kings found on the board!");
			}
			//else;//do nothing
		}
		//make sure the board is valid
		int ttl = 0;
		for (int ci = 0; ci < 6; ci++) ttl += pccnts[ci];
		if (ttl < 1 || 16 < ttl)
		{
			throw new IllegalStateException("illegal total number of side pieces (" + ttl + ") found on the board!");
		}
		//else;//do nothing
		int[] diffstart = new int[6];
		//actual amount - start amount; diff < 0 when actual < start; 0 < diff when start < actual
		for (int ci = 0; ci < 6; ci++) diffstart[ci] = pccnts[ci] - startamt[ci];
		int numusdpns = 0;
		for (int ci = 0; ci < 6; ci++)
		{
			if (diffstart[ci] < -8 || 8 < diffstart[ci])
			{
				throw new IllegalStateException("illegal diff (" + diffstart[ci] + ") found and used here!");
			}
			//else;//do nothing
			if (ci == 0)
			{
				if (diffstart[ci] == 0);
				else throw new IllegalStateException("illegal number of kings found on the board!");
			}
			else
			{
				if (0 < diffstart[ci]) numusdpns += diffstart[ci];
				//else;//do nothing
			}
		}
		//System.out.println("numusdpns = " + numusdpns);
		//System.out.println("pccnts[" + 5 + "] = " + pccnts[5]);
		if (numusdpns + pccnts[5] < 0 || 8 < numusdpns + pccnts[5])
		{
			throw new IllegalStateException("illegal number of used pawns pieces (" + numusdpns +
				") with " + pccnts[5] + " pawn(s) found on the board!");
		}
		//else;//do nothing
		return pccnts;
	}
	
	public static String[] getPieceTypes(ArrayList<ChessPiece> allpcs)
	{
		if (allpcs == null) return null;
		else
		{
			String[] wpcstps = new String[allpcs.size()];
			for (int x = 0; x < wpcstps.length; x++) wpcstps[x] = allpcs.get(x).getType();
    		return wpcstps;
		}
	}
	
	public static boolean isThereTwoPiecesAtOneLocation(ArrayList<ChessPiece> allpcs)
	{
		int numallpcs = getNumItemsInList(allpcs);
		if (numallpcs < 2) return false;
		else
		{
			int[][] allocs = getLocsFromPieceList(allpcs);
			for (int x = 0; x < allocs.length; x++)
			{
				for (int c = x + 1; c < allocs.length; c++)
				{
					if (allocs[x][0] == allocs[c][0] &&
						allocs[x][1] == allocs[c][1])
					{
						System.out.println(allpcs.get(x));
						System.out.println(allpcs.get(c));
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
	public static boolean isBoardValid(ArrayList<ChessPiece> allpcs)
	{
		//each side must have at most 16 pieces total one of which must be a king
		//there are only 8 pawns so at most 8 pawns plus one of each
		//the most we can have of any one piece excluding kings and pawns is 9
		//at most 1 king, 8 pawns, 9 of the others per side.
		//if we have 9 of one we will have no pawns.
		
		if (isThereTwoPiecesAtOneLocation(allpcs))
		{
			throw new IllegalStateException("THERE ARE TWO PIECES AT A LOCATION!");
		}
		//else;//do nothing
		
		//the # of pawns on the board will be minus one for every one more of another type.
		ArrayList<ChessPiece> wpcs = filterListByColor(allpcs, "WHITE");
		ArrayList<ChessPiece> bpcs = filterListByColor(allpcs, "BLACK");
		String[] wpcstps = getPieceTypes(wpcs);
		String[] bpcstps = getPieceTypes(bpcs);
		try
		{
			int[] wpctpscnts = getCountsForEachPieceTypeForASide(wpcstps);
		}
		catch(Exception ex)
		{
			throw new IllegalStateException("ILLEGAL NUMBER OF WHITE PIECES FOUND ON THE BOARD!", ex);
		}
		try
		{
			int[] bpctpscnts = getCountsForEachPieceTypeForASide(bpcstps);
		}
		catch(Exception ex)
		{
			throw new IllegalStateException("ILLEGAL NUMBER OF BLACK PIECES FOUND ON THE BOARD!", ex);
		}
		return true;
	}
	public static boolean isBoardValid(int gid)
	{
		return isBoardValid(getAllPiecesWithGameID(gid));
	}
	
	
	//HOW TO REMOVE PIECES?
	//WE NEED TO REMOVE THEM FROM THE LIST OF PIECES.
	//WE NEED TO MAKE THEIR REFERENCES BE NULL.
	public static void removePieceAt(int rval, int cval, int gid, boolean clearboardcalled)
	{
		if (clearboardcalled);
		else isBoardValid(gid);
		int numpcs = getNumItemsInList(cps);
		if (numpcs < 1);
		else
		{
			for (int x = 0; x < numpcs; x++)
			{
				if (cps.get(x).getRow() == rval && cps.get(x).getCol() == cval && cps.get(x).getGameID() == gid)
				{
					System.out.println("REMOVED " + cps.get(x));
					cps.remove(cps.get(x));
					numpcs--;
					x--;
				}
				//else;//do nothing
			}
		}
	}
	public static void removePieceAt(int rval, int cval, int gid)
	{
		removePieceAt(rval, cval, gid, false);
	}
	public static void removePieceAt(int[] loc, int gid, boolean clearboardcalled)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else removePieceAt(loc[0], loc[1], gid, clearboardcalled);
	}
	public static void removePieceAt(int[] loc, int gid)
	{
		removePieceAt(loc, gid, false);
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
	//HINTS COMMANDS DO NOT NEED TO BE STORED, BECAUSE THEY ARE EXECUTE ONLY, YOU CANNOT UNDO HINT COMMANDS
	
	
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
	
	public static void advanceTurnIfPossible(String sidemoved, int gid, boolean undoifincheck,
		boolean isuser, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//make sure the side that just moved is not in check
		//if they are in check and it can be undone undo it
		//if they choose surrender, ends the game
		//check to see if it is checkmate
		
		//NUM OFFICIAL MOVES WILL BE AT LEAST ONE!
		getGame(gid).makeUnofficialMoveOfficial();
		
		if (isSideInCheck(sidemoved, ignorelist, addpcs, gid))
		{
			if (undoifincheck)
			{
				System.out.println(getGame(gid).getSideTurn() + "'S TURN BEFORE UNDO!");
				
				//force the undo command on the last made move
				//undo it
		    	String[] myounmv = genFullMoveCommandFromDisplayedCommand("UNDO", gid);
		    	//System.out.println("MY UNDO MOVE:");
		    	convertAllShortHandMovesToLongVersion(myounmv);
		    	
		    	getGame(gid).makeLastOfficialMoveUnofficial();
		    	
		    	makeLocalMove(myounmv, gid, true, WHITE_MOVES_DOWN_RANKS, isuser);
		    	printBoard(gid);
		    	System.out.println(getGame(gid).getSideTurn() + "'S TURN!");
				
				//then done with this method for the moment so return
				System.out.println("UNDID THE MOVE, NOT READY TO ADVANCE TURNS YET!");
				//return;
			}
			else
			{
				//surrender unless checkmate
				if (inCheckmate(sidemoved, ignorelist, addpcs, gid))
				{
					getGame(gid).setColorWins(getOppositeColor(sidemoved), true);
				}
				else getGame(gid).setColorResigns(sidemoved, true);
			}
		}
		else
		{
			//if is checkmate -> end the game instead
			//if is stalemate -> end the game instead
			//else just advance the turn -> not over
			
			if (inCheckmate(getOppositeColor(sidemoved), ignorelist, addpcs, gid))
			{
				getGame(gid).setColorWins(sidemoved, true);
			}
			else
			{
				if (isStalemate(sidemoved, ignorelist, addpcs, gid))
				{
					getGame(gid).setIsTied(true);
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
					if (!isuser || getGame(gid).getMyColor().equals("BOTH"));
					else
					{
						//send commands...
					}
					System.out.println(getGame(gid).getSideTurn() + "'S TURN!");
				}
			}
		}
	}
	public static void advanceTurnIfPossible(String sidemoved, int gid, boolean undoifincheck,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		advanceTurnIfPossible(sidemoved, gid, undoifincheck,
			getGame(gid).doesColorMatchMyColor(sidemoved), ignorelist, addpcs);
	}
	public static void advanceTurnIfPossible(String sidemoved, int gid, boolean undoifincheck, boolean isuser)
	{
		advanceTurnIfPossible(sidemoved, gid, undoifincheck, isuser, null, null);
	}
	public static void advanceTurnIfPossible(String sidemoved, int gid, boolean isuser)
	{
		advanceTurnIfPossible(sidemoved, gid, true, isuser);
	}
	public static void advanceTurnIfPossible(String sidemoved, int gid)
	{
		advanceTurnIfPossible(sidemoved, gid, true, getGame(gid).doesColorMatchMyColor(sidemoved));
	}
	public static void advanceTurnIfPossible(int gid, boolean isuser)
	{
		//get the color of the unofficial move before it is official
		String[] myoffmvcp = getGame(gid).genCopyOfUnofficialMove();
		String[][] mymvscp = new String[1][];
		mymvscp[0] = myoffmvcp;
		String[] clrsmvs = getSideColorsForMoves(mymvscp);
		advanceTurnIfPossible(clrsmvs[0], gid, isuser);
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
	
	private static int[][] getAllPossibleKnightMoveToLocs(int rval, int cval)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		
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
	private static int[][] getAllPossibleKnightMoveToLocs(int[] loc)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getAllPossibleKnightMoveToLocs(loc[0], loc[1]);
	}
	
	
	//IF THE ALL PIECES LIST IS EMPTY RETURNS FALSE.
	public static boolean isPieceAtLocationOnAListOfTypes(int rval, int cval, String[] mtypes, ArrayList<ChessPiece> allpcs)
	{
		//System.out.println("INSIDE OF IS PIECE AT LOCATION ON A LIST OF TYPES WITH LOCATION: " +
		//	getLocString(rval, cval));
		//System.out.println("allpcs = " + allpcs);
		//System.out.print("mtypes = [");
		//for (int x = 0; x < mtypes.length; x++)
		//{
		//	System.out.print('"' + mtypes[x] + '"');
		//	if (x + 1 < mtypes.length) System.out.print(", ");
		//}
		//System.out.println("]");
		
		if (getNumItemsInList(allpcs) < 1);//no items on the add pieces list
		else
		{
			//System.out.println("INSIDE ELSE STATEMENT!");
			for (int x = 0; x < allpcs.size(); x++)
			{
				//System.out.println("x = " + x);
				//System.out.println("allpcs.get(" + x + ") = " + allpcs.get(x));
				//System.out.println("row = " + allpcs.get(x).getRow());
				//System.out.println("col = " + allpcs.get(x).getCol());
				if (allpcs.get(x).getRow() == rval && allpcs.get(x).getCol() == cval)
				{
					if (itemIsOnGivenList(allpcs.get(x).getType(), mtypes)) return true;
					else return false;
				}
				//else;//do nothing
			}
		}
		//System.out.println("DID NOT FIND IT!");
		return false;
	}
	//combines with the current board list prioritizes: boardlist < ignorelist < addpcs. 
	public static boolean isPieceAtLocationOnAListOfTypes(int rval, int cval, int gid, String[] mtypes,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return isPieceAtLocationOnAListOfTypes(rval, cval, mtypes, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static boolean isPieceAtLocationOnAListOfTypes(int rval, int cval, int gid, String[] mtypes,
		int[][] ignorelist)
	{
		return isPieceAtLocationOnAListOfTypes(rval, cval, gid, mtypes, ignorelist, null);
	}
	public static boolean isPieceAtLocationOnAListOfTypes(int[] loc, int gid, String[] mtypes,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else
		{
			return isPieceAtLocationOnAListOfTypes(loc[0], loc[1], mtypes,
				combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		}
	}
	public static boolean isPieceAtLocationOnAListOfTypes(int[] loc, int gid, String[] mtypes,
		int[][] ignorelist)
	{
		return isPieceAtLocationOnAListOfTypes(loc, gid, mtypes, ignorelist, null);
	}
	public static boolean isPieceAtLocationOnAListOfTypes(int rval, int cval, int gid, String[] mtypes)
	{
		return isPieceAtLocationOnAListOfTypes(rval, cval, gid, mtypes, null);
	}
	public static boolean isPieceAtLocationOnAListOfTypes(int[] loc, int gid, String[] mtypes)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isPieceAtLocationOnAListOfTypes(loc[0], loc[1], gid, mtypes);
	}
	
	
	//this checks the diagnals for a Bishop a Pawn or a Queen the first one it finds starting at rval cval it will return true
	//that means if you call this on a Bishop, Pawn, or Queen it will return true immediately
	//it will not be conclusive as to if it is protected by one.
	public static boolean isSameDiagnalLocationGuarded(int rval, int cval, int gid)
	{
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
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
		String[] myvtps = {"BISHOP", "PAWN", "QUEEN", "KING"};
		for (int x = 0; x < 4; x++)
		{
			int r = rval;
			int c = cval;
			while (isvalidrorc(r) && isvalidrorc(c))
			{
				if (isPieceAtLocationOnAListOfTypes(r, c, gid, myvtps)) return true;
				else
				{
					if (isLocationEmpty(r, c, gid));
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
				else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		
		return false;
	}
	public static boolean isSameDiagnalLocationGuarded(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isSameDiagnalLocationGuarded(loc[0], loc[1], gid);
	}
	
	//this checks the rows or columns for a CASTLE, ROOK, QUEEN, OR KING and returns true on the first one found
	//this will return true immediately if called on one of the above.
	public static boolean isSameRowOrSameColLocationGuarded(int rval, int cval, int gid)
	{
		//row or col is the same
		//assume if we run into a piece other than a castle or a queen
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		//move along the row starting at cval
		//move along the col starting at row
		//go up
		//go down
		//go left to right
		String[] myvtps = {"CASTLE", "ROOK", "QUEEN", "KING"};
		for (int r = rval; r < 8; r++)
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
		for (int r = rval; ((r == 0 || 0 < r) && r < 8); r--)
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
		for (int c = cval; c < 8; c++)
		{
			if (isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps)) return true;
			else
			{
				if (isLocationEmpty(rval, c, gid));
				else
				{
					if (c == cval);
					else break;
				}
			}
		}
		for (int c = cval; ((c == 0 || 0 < c) && c < 8); c--)
		{
			if (isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps)) return true;
			else
			{
				if (isLocationEmpty(rval, c, gid));
				else
				{
					if (c == cval);
					else break;
				}
			}
		}
		return false;
	}
	public static boolean isSameRowOrSameColLocationGuarded(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isSameRowOrSameColLocationGuarded(loc[0], loc[1], gid);
	}
	
	public static boolean isLocationGuardedByAKnight(int rval, int cval, int gid)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] pklocs = getAllPossibleKnightMoveToLocs(rval, cval);
		
		String[] mvtps = {"KNIGHT"};
		for (int x = 0; x < 8; x++)
		{
			if (isvalidrorc(pklocs[x][0]) && isvalidrorc(pklocs[x][1]))
			{
				if (isPieceAtLocationOnAListOfTypes(pklocs[x][0], pklocs[x][1], gid, mvtps)) return true;
			}
			//else;//do nothing
		}
		return false;
	}
	public static boolean isLocationGuardedByAKnight(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocationGuardedByAKnight(loc[0], loc[1], gid);
	}
	//this piece will not be a KNIGHT, but it checks for the others
	public static boolean isLocationGuardedByAnythingOtherThanAKnight(int rval, int cval, int gid)
	{
		return (isSameRowOrSameColLocationGuarded(rval, cval, gid) || isSameDiagnalLocationGuarded(rval, cval, gid));
	}
	public static boolean isLocationGuardedByAnythingOtherThanAKnight(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocationGuardedByAnythingOtherThanAKnight(loc[0], loc[1], gid);
	}
	//this hints as to a possibility of the location being directly attacked by something unless you call it on a piece
	public static boolean isLocationGuarded(int rval, int cval, int gid)
	{
		return (isLocationGuardedByAnythingOtherThanAKnight(rval, cval, gid) || isLocationGuardedByAKnight(rval, cval, gid));
	}
	public static boolean isLocationGuarded(int[] loc, int gid)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocationGuarded(loc[0], loc[1], gid);
	}
	
	
	
	//IS A LOC ON A LIST OF LOCS
	
	public static boolean isLocOnListOfLocs(int rval, int cval, int[][] loclist)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		
		if (loclist == null || loclist.length < 1) return false;
		else if (loclist[0] == null || loclist[0].length != 2) return false;
		else
		{
			for (int x = 0; x < loclist.length; x++)
			{
				if (loclist[x][0] == rval && loclist[x][1] == cval) return true;
			}
			return false;
		}
	}
	public static boolean isLocOnListOfLocs(int[] loc, int[][] loclist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return isLocOnListOfLocs(loc[0], loc[1], loclist);
	}
	
	
	public static boolean[] getLocOnIgnoreListAndValidTypeData(int rval, int cval, int gid, String[] myvtps,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		boolean loconiglist = false;
		boolean pcatloconiglist = false;
		boolean isvpctpeoniglist = false;
		if (isLocOnListOfLocs(rval, cval, ignorelist))
		{
			//is there a piece on the add list that matches the loc?
			loconiglist = true;
			ChessPiece cp = getPieceAt(rval, cval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			if (cp == null);
			else
			{
				pcatloconiglist = true;
				isvpctpeoniglist = itemIsOnGivenList(cp.getType(), myvtps);
			}
		}
		//else;//do nothing safe to proceed
		
		boolean[] rvals = {loconiglist, pcatloconiglist, isvpctpeoniglist};
		return rvals;
	}
	
	
	//DETECTS PIECES DIRECTLY ABLE TO ATTACK OR MOVE TO A LOCATION METHODS
	
	//LOCATIONS GUARDED BY KNIGHT METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int rval, int cval, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] pklocs = getAllPossibleKnightMoveToLocs(rval, cval);
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		String[] mvtps = {"KNIGHT"};
		ArrayList<ChessPiece> gpcs = null;
		if (isvalidrorc(rval) && isvalidrorc(cval))
		{
			boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(rval, cval, gid, mvtps, ignorelist, addpcs);
			boolean loconiglist = logonigvtpdtalist[0];
			boolean pcatloconiglist = logonigvtpdtalist[1];
			boolean isvpctpeoniglist = logonigvtpdtalist[2];
			
			boolean exitif = false;
			if (loconiglist)
			{
				if (pcatloconiglist);
				else exitif = true;
			}
			//else;//do nothing
			
			if (exitif);
			else
			{
				if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
					(!loconiglist && isPieceAtLocationOnAListOfTypes(rval, cval, gid, mvtps, ignorelist, addpcs)))
				{
					if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					gpcs.add(getPieceAt(rval, cval, allpcs));
				}
				//else;//do nothing
			}
		}
		//else;//do nothing
		
		for (int x = 0; x < 8; x++)
		{
			if (isvalidrorc(pklocs[x][0]) && isvalidrorc(pklocs[x][1]))
			{
				boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(pklocs[x][0], pklocs[x][1], gid, mvtps,
					ignorelist, addpcs);
				boolean loconiglist = logonigvtpdtalist[0];
				boolean pcatloconiglist = logonigvtpdtalist[1];
				boolean isvpctpeoniglist = logonigvtpdtalist[2];
				//System.out.println("loconiglist = " + loconiglist);
				//System.out.println("pcatloconiglist = " + pcatloconiglist);
				//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
				if (loconiglist && !pcatloconiglist) continue;
				//else;//do nothing safe to proceed
				
				if (loconiglist)
				{
					if (pcatloconiglist);
					else
					{
						throw new IllegalStateException("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
							"SO SHOULD NOT HAVE MADE IT HERE!");
					}
				}
				//else;//do nothing
				
				if ((loconiglist && pcatloconiglist && isvpctpeoniglist) || (!loconiglist &&
					isPieceAtLocationOnAListOfTypes(pklocs[x][0], pklocs[x][1], gid, mvtps, ignorelist, addpcs)))
				{
					if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					//System.out.println("ADD PIECE AT THIS LOCATION:");
					//System.out.println("pklocs[" + x + "][0] = " + pklocs[x][0]);
					//System.out.println("pklocs[" + x + "][1] = " + pklocs[x][1]);
					
					gpcs.add(getPieceAt(pklocs[x][0], pklocs[x][1], allpcs));
				}
				//else;//do nothing
			}
			//else;//do nothing
		}
		return gpcs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int loc[], int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocationByAKnight(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int rval, int cval, int gid,
		int[][] ignorelist)
	{
		return getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int loc[], int gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocationByAKnight(loc[0], loc[1], gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int rval, int cval, int gid)
	{
		return getPiecesGuardingLocationByAKnight(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationByAKnight(int[] loc, int gid)
	{
		return getPiecesGuardingLocationByAKnight(loc, gid, null);
	}
	
	
	//if no piece -> not added; if there is a piece and it is not on our list of types -> add it;
	//if there is a piece and it is on our list of types and if the diff is more than one -> not added;
	//if there is a piece and it is on our list of types and its diff is less than or equal to 1 ->
	//-> if piece is not a pawn -> add it;
	//-> if piece is a pawn and it moved forward 1 -> add it; otherwise -> not added 
	private static boolean getCanAddPieceToGList(ChessPiece cp, String[] myvtps, int srval, int scval,
		boolean initaddit, boolean usecdiff)
	{
		//System.out.println("cp = " + cp);
		//System.out.println("srval = " + srval);
		//System.out.println("scval = " + scval);
		//if (myvtps == null || myvtps.length < 1) System.out.println("myvtps is null or empty!");
		//else
		//{
		//	System.out.println("myvtps.length = " + myvtps.length);
		//	for (int x = 0; x < myvtps.length; x++) System.out.println(myvtps[x]);
		//}
		boolean addit = initaddit; 
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
					int cdiff = 0;
					if (cp.getCol() - scval < 0) cdiff = scval - cp.getCol();
					else cdiff = cp.getCol() - scval;
					if (1 < cdiff) addit = false;
				}
				else
				{
					int rdiff = 0;
					if (cp.getRow() - srval < 0) rdiff = srval - cp.getRow();
					else rdiff = cp.getRow() - srval;
					if (1 < rdiff) addit = false;
				}
				
				
				if (addit)
				{
					//System.out.println("DIFF NOT TOO BIG!");
					if (cp.getType().equals("PAWN"))
					{
						//System.out.println("THIS IS A PAWN!");
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
								//System.out.println("PAWN NOT MOVING IN THE CORRECT DIRECTION!");
							}
						}
					}
					//else System.out.println("NOT A PAWN!");
				}
				else
				{
					//System.out.println("DIFF TOO BIG!");
					return false;
				}
			}
			else return true;
			return addit;
		}
	}
	private static boolean getCanAddPieceToGList(ChessPiece cp, String[] myvtps, int[] sloc,
		boolean initaddit, boolean usecdiff)
	{
		if (sloc == null || sloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the current chess piece location!");
		}
		else return getCanAddPieceToGList(cp, myvtps, sloc[0], sloc[1], initaddit, usecdiff);
	}
	private static boolean getCanAddPieceToGList(int rval, int cval, String[] myvtps, int srval, int scval,
		boolean initaddit, boolean usecdiff, int gid)
	{
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		else return getCanAddPieceToGList(getPieceAt(rval, cval, gid), myvtps, srval, scval, initaddit, usecdiff);
	}
	private static boolean getCanAddPieceToGList(int[] nloc, String[] myvtps, int[] sloc,
		boolean initaddit, boolean usecdiff, int gid)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		if (sloc == null || sloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the current chess piece location!");
		}
		//else;//do nothing
		return getCanAddPieceToGList(nloc[0], nloc[1], myvtps, sloc[0], sloc[1], initaddit, usecdiff, gid);
	}
	
	
	//LOCATIONS GUARDED BY BISHOP (OR QUEEN) METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int rval, int cval, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
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
		String[] myvtps = {"BISHOP", "PAWN", "QUEEN", "KING"};
		ArrayList<ChessPiece> gpcs = null;
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		for (int x = 0; x < 4; x++)
		{
			//System.out.println("x = " + x);
			
			int r = rval;
			int c = cval;
			while (isvalidrorc(r) && isvalidrorc(c))
			{
				//System.out.println("r = " + r);
				//System.out.println("c = " + c);
				boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(r, c, gid, myvtps, ignorelist, addpcs);
				boolean loconiglist = logonigvtpdtalist[0];
				boolean pcatloconiglist = logonigvtpdtalist[1];
				boolean isvpctpeoniglist = logonigvtpdtalist[2];
				//System.out.println("loconiglist = " + loconiglist);
				//System.out.println("pcatloconiglist = " + pcatloconiglist);
				//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
				boolean inconly = (loconiglist && !pcatloconiglist);
				//System.out.println("inconly = " + inconly);
				
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
					boolean locntempty = true;
					if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
						(!loconiglist && isPieceAtLocationOnAListOfTypes(r, c, gid, myvtps, ignorelist, addpcs)))
					{
						boolean addit = true;
						if (c == cval && r == rval)
						{
							if (x == 0) addit = true;
							else addit = false;
						}
						else addit = true;
						
						//the piece is on our list of types, but it may not be able to attack the location
						//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
						String[] rstps = {"PAWN", "KING"};
						ChessPiece cp = getPieceAt(r, c, allpcs);
						//System.out.println("FINAL cp = " + cp);
						addit = getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
						//System.out.println("addit = " + addit);
						
						if (addit)
						{
							if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
							//else;//do nothing
							
							gpcs.add(cp);
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
							if (isLocationEmpty(r, c, gid, ignorelist, addpcs)) locntempty = false;
							//else;//do nothing proceed below to handle exiting the loop
						}
					}
					//System.out.println("locntempty = " + locntempty);
					if (locntempty)
					{
						if (r == rval && c == cval);
						else break;
					}
					//else;//do nothing
				}
				
				
				//increment the variables
				//System.out.println("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//System.out.println("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//System.out.println("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//System.out.println("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//System.out.println("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		
		return gpcs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int rval, int cval, int gid,
		int[][] ignorelist)
	{
		return getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocationOnSameDiagnal(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, int gid, int[][] ignorelist)
	{
		return getPiecesGuardingLocationOnSameDiagnal(loc, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int rval, int cval, int gid)
	{
		return getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameDiagnal(int[] loc, int gid)
	{
		return getPiecesGuardingLocationOnSameDiagnal(loc, gid, null);
	}
	
	//LOCATIONS GUARDED BY CASTLE (OR QUEEN) METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int rval, int cval, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else throw new IllegalStateException("rval and cval must be valid!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		//System.out.println("INSIDE GET PIECES GUARDING LOCATION ON SAME ROW OR COL() WITH LOCATION: " +
		//	getLocString(rval, cval));
		//System.out.println("gid = " + gid);
		//System.out.println("addpcs = " + addpcs);
		//if (ignorelist == null) System.out.println("ignorelist = null!");
		//else
		//{
		//	if (ignorelist.length < 1) System.out.println("ignorelist is empty!");
		//	else
		//	{
		//		for (int x = 0; x < ignorelist.length; x++)
		//		{
		//			for (int c = 0; c < ignorelist[x].length; c++)
		//			{
		//				System.out.println("ignorelist[" + x + "][" + c + "] = " + ignorelist[x][c]);
		//			}
		//		}
		//	}
		//}
		
		
		//move along the row starting at cval
		//move along the col starting at row
		//go up
		//go down
		//go left to right
		String[] myvtps = {"CASTLE", "ROOK", "QUEEN", "KING"};
		ArrayList<ChessPiece> gpcs = null;
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		for (int r = rval; r < 8; r++)
		{
			//System.out.println("INC r = " + r);
			boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(r, cval, gid, myvtps, ignorelist, addpcs);
			boolean loconiglist = logonigvtpdtalist[0];
			boolean pcatloconiglist = logonigvtpdtalist[1];
			boolean isvpctpeoniglist = logonigvtpdtalist[2];
			//System.out.println("loconiglist = " + loconiglist);
			//System.out.println("pcatloconiglist = " + pcatloconiglist);
			//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new IllegalStateException("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			boolean locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps, ignorelist, addpcs)))
			{
				//System.out.println("INSIDE IF STATEMENT!");
				
				//the piece is on our list of types, but it may not be able to attack the location
				//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
				ChessPiece cp = getPieceAt(r, cval, allpcs);
				//System.out.println("FINAL cp = " + cp);
				boolean addit = true;
				String[] rstps = {"KING"};
				addit = getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
				
				if (addit)
				{
					if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					gpcs.add(cp);
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
				//System.out.println("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (isLocationEmpty(r, cval, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//System.out.println("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r == rval);
				else break;
			}
			//else;//do nothing
		}
		for (int r = rval; ((r == 0 || 0 < r) && r < 8); r--)
		{
			//System.out.println("DEC r = " + r);
			boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(r, cval, gid, myvtps, ignorelist, addpcs);
			boolean loconiglist = logonigvtpdtalist[0];
			boolean pcatloconiglist = logonigvtpdtalist[1];
			boolean isvpctpeoniglist = logonigvtpdtalist[2];
			//System.out.println("loconiglist = " + loconiglist);
			//System.out.println("pcatloconiglist = " + pcatloconiglist);
			//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new IllegalStateException("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			boolean locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && isPieceAtLocationOnAListOfTypes(r, cval, gid, myvtps, ignorelist, addpcs)))
			{
				//System.out.println("INSIDE IF STATEMENT!");
				if (r == rval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					ChessPiece cp = getPieceAt(r, cval, allpcs);
					//System.out.println("FINAL cp = " + cp);
					boolean addit = true;
					String[] rstps = {"KING"};
					addit = getCanAddPieceToGList(cp, rstps, rval, cval, addit, false);
					
					if (addit)
					{
						if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						
						gpcs.add(cp);
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
				//System.out.println("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (isLocationEmpty(r, cval, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//System.out.println("locntempty = " + locntempty);
			if (locntempty)
			{
				if (r == rval);
				else break;
			}
			//else;//do nothing
		}
		for (int c = cval; c < 8; c++)
		{
			//System.out.println("INC c = " + c);
			boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(rval, c, gid, myvtps, ignorelist, addpcs);
			boolean loconiglist = logonigvtpdtalist[0];
			boolean pcatloconiglist = logonigvtpdtalist[1];
			boolean isvpctpeoniglist = logonigvtpdtalist[2];
			//System.out.println("loconiglist = " + loconiglist);
			//System.out.println("pcatloconiglist = " + pcatloconiglist);
			//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new IllegalStateException("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			boolean locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps, ignorelist, addpcs)))
			{
				//System.out.println("INSIDE IF STATEMENT!");
				if (c == cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					ChessPiece cp = getPieceAt(rval, c, allpcs);
					//System.out.println("FINAL cp = " + cp);
					boolean addit = true;
					String[] rstps = {"KING"};
					addit = getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						
						gpcs.add(cp);
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
				//System.out.println("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (isLocationEmpty(rval, c, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing proceed below to handle exiting the loop
				}
			}
			//System.out.println("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c == cval);
				else break;
			}
			//else;//do nothing
		}
		for (int c = cval; ((c == 0 || 0 < c) && c < 8); c--)
		{
			//System.out.println("DEC c = " + c);
			boolean[] logonigvtpdtalist = getLocOnIgnoreListAndValidTypeData(rval, c, gid, myvtps, ignorelist, addpcs);
			boolean loconiglist = logonigvtpdtalist[0];
			boolean pcatloconiglist = logonigvtpdtalist[1];
			boolean isvpctpeoniglist = logonigvtpdtalist[2];
			//System.out.println("loconiglist = " + loconiglist);
			//System.out.println("pcatloconiglist = " + pcatloconiglist);
			//System.out.println("isvpctpeoniglist = " + isvpctpeoniglist);
			if (loconiglist && !pcatloconiglist) continue;
			//else;//do nothing safe to proceed
			
			if (loconiglist)
			{
				if (pcatloconiglist);
				else
				{
					throw new IllegalStateException("WE ARE AT AN IGNORE LIST SPOT, BUT THERE IS NO PIECE THERE, " +
						"SO SHOULD NOT HAVE MADE IT HERE!");
				}
			}
			//else;//do nothing
			
			boolean locntempty = true;
			if ((loconiglist && pcatloconiglist && isvpctpeoniglist) ||
				(!loconiglist && isPieceAtLocationOnAListOfTypes(rval, c, gid, myvtps, ignorelist, addpcs)))
			{
				//System.out.println("INSIDE IF STATEMENT!");
				if (c == cval);
				else
				{
					//the piece is on our list of types, but it may not be able to attack the location
					//if it is a king or pawn and distance in magnitude is more than 1, not a threat.
					ChessPiece cp = getPieceAt(rval, c, allpcs);
					//System.out.println("FINAL cp = " + cp);
					boolean addit = true;
					String[] rstps = {"KING"};
					addit = getCanAddPieceToGList(cp, rstps, rval, cval, addit, true);
					
					if (addit)
					{
						if (gpcs == null) gpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						
						gpcs.add(cp);
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
				//System.out.println("INSIDE ELSE STATEMENT!");
				if (loconiglist);//the location is not empty
				else
				{
					if (isLocationEmpty(rval, c, gid, ignorelist, addpcs)) locntempty = false;
					//else;//do nothing
				}
			}
			//System.out.println("OUTSIDE OF IF-ELSE STATEMENT");
			//System.out.println("locntempty = " + locntempty);
			if (locntempty)
			{
				if (c == cval);
				else break;
			}
			//else;//do nothing
		}
		//System.out.println("OUTSIDE OF FINAL FOR LOOP STATEMENT");
		return gpcs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocationOnSameRowOrCol(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, int gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocationOnSameRowOrCol(loc[0], loc[1], gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int rval, int cval, int gid,
		int[][] ignorelist)
	{
		return getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int rval, int cval, int gid)
	{
		return getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocationOnSameRowOrCol(int[] loc, int gid)
	{
		return getPiecesGuardingLocationOnSameRowOrCol(loc, gid, null);
	}
	
	
	//MAIN GET PIECES GUARDING LOCATION METHODS
	
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int rval, int cval, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		//System.out.println("INSIDE GET PIECES GUARDING LOCATION: " + getLocString(rval, cval));
		//System.out.println("gid = " + gid);
		//System.out.println("addpcs = " + addpcs);
		//printLocsArray(ignorelist, "ignorelist");
		ArrayList<ChessPiece> rclocs = getPiecesGuardingLocationOnSameRowOrCol(rval, cval, gid, ignorelist, addpcs);
		//System.out.println("rclocs = " + rclocs);
		ArrayList<ChessPiece> dlocs = getPiecesGuardingLocationOnSameDiagnal(rval, cval, gid, ignorelist, addpcs);
		//System.out.println("dlocs = " + dlocs);
		ArrayList<ChessPiece> klocs = getPiecesGuardingLocationByAKnight(rval, cval, gid, ignorelist, addpcs);
		//System.out.println("THE LOC: " + getLocString(rval, cval));
		//System.out.println("rclocs = " + rclocs);
		//System.out.println("dlocs = " + dlocs);
		//System.out.println("klocs = " + klocs);
		
		ArrayList<ChessPiece> alocs = null;
		if (0 < getNumItemsInList(rclocs))
		{
			alocs = new ArrayList<ChessPiece>();
			for (int x = 0; x < rclocs.size(); x++) alocs.add(rclocs.get(x));
		}
		//else;//do nothing
		if (0 < getNumItemsInList(dlocs))
		{
			if (alocs == null) alocs = new ArrayList<ChessPiece>();
			//else;//do nothing
			
			for (int x = 0; x < dlocs.size(); x++)
			{
				boolean addit = true;
				for (int r = 0; r < alocs.size(); r++)
				{
					if (dlocs.get(x).getRow() == alocs.get(r).getRow() &&
						dlocs.get(x).getCol() == alocs.get(r).getCol())
					{
						addit = false;
						break;
					}
				}
				if (addit) alocs.add(dlocs.get(x));
			}
		}
		//else;//do nothing
		if (0 < getNumItemsInList(klocs))
		{
			if (alocs == null) alocs = new ArrayList<ChessPiece>();
			//else;//do nothing
			
			for (int x = 0; x < klocs.size(); x++)
			{
				boolean addit = true;
				for (int r = 0; r < alocs.size(); r++)
				{
					if (klocs.get(x).getRow() == alocs.get(r).getRow() &&
						klocs.get(x).getCol() == alocs.get(r).getCol())
					{
						addit = false;
						break;
					}
				}
				if (addit) alocs.add(klocs.get(x));
			}
		}
		//else;//do nothing
		return alocs;
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, int gid, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int rval, int cval, int gid, int[][] ignorelist)
	{
		return getPiecesGuardingLocation(rval, cval, gid, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int rval, int cval, int gid)
	{
		return getPiecesGuardingLocation(rval, cval, gid, null);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, int gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	public static ArrayList<ChessPiece> getPiecesGuardingLocation(int[] loc, int gid)
	{
		return getPiecesGuardingLocation(loc, gid, null);
	}
	
	
	//THE CURRENT SIDE PIECES GUARDING THE LOCATION METHODS
	
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int rval, int cval, int gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (clrval == null) return null;
		else return filterListByColor(getPiecesGuardingLocation(rval, cval, gid, ignorelist, addpcs), clrval);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, int gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getSidePiecesGuardingLocation(loc[0], loc[1], gid, clrval, ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int rval, int cval, int gid, String clrval,
		int[][] ignorelist)
	{
		return getSidePiecesGuardingLocation(rval, cval, gid, clrval, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, int gid, String clrval, int[][] ignorelist)
	{
		return getSidePiecesGuardingLocation(loc, gid, clrval, ignorelist, null);	
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocationNoList(int rval, int cval, int gid, String clrval)
	{
		return getSidePiecesGuardingLocation(rval, cval, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocationNoList(int[] loc, int gid, String clrval)
	{
		return getSidePiecesGuardingLocation(loc, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int rval, int cval, int gid, int[][] ignorelist)
	{
		ChessPiece cp = getPieceAt(rval, cval, gid);
		if (cp == null) return null;
		else return getSidePiecesGuardingLocation(rval, cval, gid, cp.getColor(), ignorelist);
	}
	public static ArrayList<ChessPiece> getSidePiecesGuardingLocation(int[] loc, int gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getSidePiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	
	
	//THE ENEMY PIECES GUARDING THE LOCATION METHODS
	
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int rval, int cval, int gid, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return getSidePiecesGuardingLocation(rval, cval, gid, getOppositeColor(clrval), ignorelist, addpcs);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int rval, int cval, int gid, String clrval,
		int[][] ignorelist)
	{
		return getEnemyPiecesGuardingLocation(rval, cval, gid, clrval, ignorelist, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocationNoList(int rval, int cval, int gid, String clrval)
	{
		return getEnemyPiecesGuardingLocation(rval, cval, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int[] loc, int gid, String clrval,
		int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getEnemyPiecesGuardingLocation(loc[0], loc[1], gid, clrval, ignorelist);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocationNoList(int[] loc, int gid, String clrval)
	{
		return getEnemyPiecesGuardingLocation(loc, gid, clrval, null);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int rval, int cval, int gid, int[][] ignorelist)
	{
		ChessPiece cp = getPieceAt(rval, cval, gid);
		if (cp == null) return null;
		else return getSidePiecesGuardingLocation(rval, cval, gid, getOppositeColor(cp.getColor()), ignorelist);
	}
	public static ArrayList<ChessPiece> getEnemyPiecesGuardingLocation(int[] loc, int gid, int[][] ignorelist)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the chess piece location!");
		}
		else return getEnemyPiecesGuardingLocation(loc[0], loc[1], gid, ignorelist);
	}
	
	
	
	//CHECK METHODS
	
	//can I be directly attacked by the opposing side?
	public boolean inCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//can I be directly attacked by the opposing side?
		ArrayList<ChessPiece> epcs = getEnemyPiecesGuardingLocation(getRow(), getCol(), getGameID(), getColor(),
			ignorelist, addpcs);
		//System.out.println("epcs = " + epcs);
		if (getNumItemsInList(epcs) < 1) return false;
		else return true;
	}
	public boolean inCheck()
	{
		return inCheck(null, null);
	}
	
	public boolean isMySideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//get my king
		//then ask can I be directly attacked by the opposing side?
		//if yes you are in check
		return getMySideKing().inCheck(ignorelist, addpcs);
	}
	public boolean isMySideInCheck()
	{
		return isMySideInCheck(null, null);
	}
	
	//this gets the king with the specified color and then calls inCheck on it
	public static boolean isSideInCheck(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		ChessPiece mkg = getCurrentSideKing(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new IllegalStateException("the king must be found!");
		else return mkg.inCheck(ignorelist, addpcs);
	}
	public static boolean isSideInCheck(String clrval, int gid)
	{
		return isSideInCheck(clrval, null, null, gid);
	}
	
	//checks to see if a side is in check and checks the given color first, if no color provided it starts with white
	//it will also check black; white then black or black then white
	public static boolean isASideInCheck(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return (isSideInCheck(clrval, ignorelist, addpcs, gid) ||
			isSideInCheck(getOppositeColor(clrval), ignorelist, addpcs, gid));
	}
	public static boolean isASideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isASideInCheck("WHITE", ignorelist, addpcs, gid);
	}
	
	
	//CAN A GIVEN TYPE OF PIECE FOR A SIDE BE DIRECTLY ATTACKED
	
	//asks if a certain color and kind of piece can be directly attacked
	public static boolean isAtLeastOnePieceOfTypeForSideInCheck(String typeval, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		ArrayList<ChessPiece> myclrpcs = filterListByColorAndType(typeval, clrval,
			combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		int nummypcs = getNumItemsInList(myclrpcs);
		if (nummypcs < 1);
		else
		{
			for (int x = 0; x < nummypcs; x++)
			{
				if (myclrpcs.get(x).inCheck(ignorelist, addpcs)) return true;
				//else;//do nothing
			}
		}
		return false;
	}
	public static boolean isAtLeastOneQueenForSideInCheck(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAtLeastOnePieceOfTypeForSideInCheck("QUEEN", clrval, ignorelist, addpcs, gid);
	}
	public static boolean isAtLeastOneWhitePieceOfTypeInCheck(String typeval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAtLeastOnePieceOfTypeForSideInCheck(typeval, "WHITE", ignorelist, addpcs, gid);
	}
	public static boolean isAtLeastOneWhiteQueenInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAtLeastOneWhitePieceOfTypeInCheck("QUEEN", ignorelist, addpcs, gid);
	}
	public static boolean isAtLeastOneBlackPieceOfTypeInCheck(String typeval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAtLeastOnePieceOfTypeForSideInCheck(typeval, "BLACK", ignorelist, addpcs, gid);
	}
	public static boolean isAtLeastOneBlackQueenInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAtLeastOneBlackPieceOfTypeInCheck("QUEEN", ignorelist, addpcs, gid);
	}
	public boolean isAQueenForMySideInCheck(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return isAtLeastOneQueenForSideInCheck(getColor(), ignorelist, addpcs, getGameID());
	}
	public boolean isAQueenForMySideInCheck()
	{
		return isAQueenForMySideInCheck(null, null);
	}
	
	
	//GET CAN MOVE TO LOCATIONS METHODS
	
	public static boolean canAddThisMoveToLoc(int sr, int sc, int nr, int nc, String myclr, String mytpval,
		int[][] oignorelist, ArrayList<ChessPiece> oaddpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		ArrayList<ChessPiece> initbdpcs = combineBoardAddAndIgnoreLists(oignorelist, oaddpcs, gid);
		ChessPiece cp = getPieceAt(nr, nc, initbdpcs);
		//System.out.println("cp = " + cp);
		
		boolean addit = true;
		if (cp == null);
		else
		{
			if (cp.getColor().equals(myclr))
			{
				if (sr == cp.getRow() && sc == cp.getCol());
				else addit = false;
			}
			//else;//do nothing
		}
		//System.out.println("OLD addit = " + addit);
		
		if (mytpval == null) throw new IllegalStateException("mytpval must not be null!");
		else if (mytpval.equals("PAWN"))
		{
			if (nr != sr && nc != sc)
			{
				//System.out.println("PAWN IS MOVING DIAGNAL!");
				
				int rdiff = sr - nr;
				int cdiff = sc - nc;
				if (rdiff < 1) rdiff *= -1;
				if (cdiff < 1) cdiff *= -1;
				if (1 < rdiff || 1 < cdiff) addit = false;
				else if (rdiff == 1 && cdiff == 1)
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
				//System.out.println("PAWN IS MOVING FORWARD!");
				
				int rdiff = sr - nr;
				if (rdiff < 1) rdiff *= -1;
				//System.out.println("rdiff = " + rdiff);
				
				if (rdiff == 2)
				{
					int dirfact = 0;
					if (myclr == null) throw new IllegalStateException("color must not be null!");
					if (myclr.equals("WHITE")) dirfact = -1;
					else if (myclr.equals("BLACK")) dirfact = 1;
					else throw new IllegalStateException("illegal color (" + myclr + ") found and used here");
					//System.out.println("PAWN dirfact = " + dirfact);
					//System.out.println("initbdpcs = " + initbdpcs);
						
					ChessPiece ocp = getPieceAt(sr + dirfact, nc, initbdpcs);
					//System.out.println("ocp = " + ocp);
					
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
		//System.out.println("NEW addit = " + addit);
		
		if (addit)
		{
			//need to know if ignoring piece at sr and sc and putting a castle/queen piece at this location
			//puts my king in check
			//if it puts my king in check -> do not add it
			//else add it
			
			int[][] ilista = new int[1][2];
			ilista[0][0] = sr;
			ilista[0][1] = sc;
			int[][] ignorelist = combineIgnoreLists(ilista, oignorelist);
			
			ArrayList<ChessPiece> addpcs = new ArrayList<ChessPiece>();
			addpcs.add(new ChessPiece(mytpval, myclr, nr, nc, gid, false));
			if (getNumItemsInList(oaddpcs) < 1);
			else
			{
				for (int x = 0; x < oaddpcs.size(); x++)
				{
					boolean addpctoit = true;
					for (int c = 0; c < addpcs.size(); c++)
					{
						if (oaddpcs.get(x).getRow() == addpcs.get(c).getRow() &&
							oaddpcs.get(x).getCol() == addpcs.get(c).getCol())
						{
							addpctoit = false;
							break;
						}
						//else;//do nothing
					}
					if (addpctoit) addpcs.add(oaddpcs.get(x));
					//else;//do nothing
				}
			}
			ChessPiece mkg = getCurrentSideKing(myclr, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//System.out.println("mkg = " + mkg);
			//System.out.println("addpcs = " + addpcs);
			//printLocsArray(ignorelist, "ignorelist");
			if (mkg == null) throw new IllegalStateException("our king must be on the board, but it was not found!");
			else
			{
				if (mkg.inCheck(ignorelist, addpcs)) addit = false;
				//else;//do nothing
			}
		}
		//else;//do nothing
		//System.out.println("FINAL addit = " + addit);
		return addit;
	}
	
	public static int[][] getBishopCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] keeplist = new int[16][2];
		for (int x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		keeplist[0][0] = sr;
		keeplist[0][1] = sc;
		int kli = 1;
		
		for (int x = 0; x < 4; x++)
		{
			//System.out.println("x = " + x);
			
			int r = sr;
			int c = sc;
			while (isvalidrorc(r) && isvalidrorc(c))
			{
				//System.out.println("r = " + r);
				//System.out.println("c = " + c);
				if (canAddThisMoveToLoc(sr, sc, r, c, myclr, "BISHOP", ignorelist, addpcs, gid))
				{
					//System.out.println("KEEP THIS LOCATION!");
					//need to make sure we are not adding a duplicate loc to the list...
					if (isLocOnListOfLocs(r, c, keeplist));
					else
					{
						keeplist[kli][0] = r;
						keeplist[kli][1] = c;
						kli++;
					}
				}
				//else;//do nothing
				ChessPiece cp = getPieceAt(r, c, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
				//System.out.println("cp = " + cp);
				if (cp == null);
				else
				{
					if (r == sr && c == sc);
					else break;
				}
				
				//increment the variables
				//System.out.println("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//System.out.println("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//System.out.println("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//System.out.println("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//System.out.println("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
			}//end of while loop
		}//end of x for loop
		//copy keeplist to rlist
		int[][] rlist = new int[kli][2];
		for (int x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	//NOTE: this does not take into account castling
	public static int[][] getCastleCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
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
		for (int x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		keeplist[0][0] = sr;
		keeplist[0][1] = sc;
		int kli = 1;
		for (int r = sr; r < 8; r++)
		{
			//System.out.println("r = " + r);
			//System.out.println("c = " + sc);
			if (r == sr) continue;
			//else;//do nothing
			
			if (canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//System.out.println("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = getPieceAt(r, sc, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//System.out.println("cp = " + cp);
			if (cp == null);
			else break;
		}
		for (int r = sr; (0 < r || r == 0 && r < 8); r--)
		{
			//System.out.println("r = " + r);
			//System.out.println("c = " + sc);
			if (r == sr) continue;
			//else;//do nothing
			
			if (canAddThisMoveToLoc(sr, sc, r, sc, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//System.out.println("ADD LOCATION!");
				keeplist[kli][0] = r;
				keeplist[kli][1] = sc;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = getPieceAt(r, sc, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//System.out.println("cp = " + cp);
			if (cp == null);
			else break;
		}
		//row stays the same
		for (int c = sc; c < 8; c++)
		{
			//System.out.println("r = " + sr);
			//System.out.println("c = " + c);
			if (c == sc) continue;
			//else;//do nothing
			
			if (canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//System.out.println("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = getPieceAt(sr, c, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//System.out.println("cp = " + cp);
			if (cp == null);
			else break;
		}
		for (int c = sc; (0 < c || c == 0 && c < 8); c--)
		{
			//System.out.println("r = " + sr);
			//System.out.println("c = " + c);
			if (c == sc) continue;
			//else;//do nothing
			
			if (canAddThisMoveToLoc(sr, sc, sr, c, myclr, "CASTLE", ignorelist, addpcs, gid))
			{
				//System.out.println("ADD LOCATION!");
				keeplist[kli][0] = sr;
				keeplist[kli][1] = c;
				kli++;
			}
			//else;//do nothing
			ChessPiece cp = getPieceAt(sr, c, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
			//System.out.println("cp = " + cp);
			if (cp == null);
			else break;
		}
		//copy keeplist to rlist
		int[][] rlist = new int[kli][2];
		for (int x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	public static int[][] getQueenCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		//combines the two above
		int[][] bmlocs = getBishopCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		int[][] cmlocs = getCastleCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		if (bmlocs == null || bmlocs.length < 1) return cmlocs;
		else if (cmlocs == null || cmlocs.length < 1) return bmlocs;
		else
		{
			//both are non null;
			int[][] reslocs = new int[bmlocs.length + cmlocs.length][2];
			int resi = 0;
			for (int r = 0; r < bmlocs.length; r++)
			{
				reslocs[resi] = bmlocs[r];
				resi++;
			}
			for (int r = 0; r < cmlocs.length; r++)
			{
				if (isLocOnListOfLocs(cmlocs[r], reslocs));
				else
				{
					reslocs[resi] = cmlocs[r];
					resi++;
				}
			}
			int[][] myretlist = new int[resi][2];
			for (int x = 0; x < resi; x++)
			{
				myretlist[x][0] = reslocs[x][0];
				myretlist[x][1] = reslocs[x][1];
			}
			return myretlist;
		}
	}
	//NOTE: this does not take into account pawning
	public static int[][] getPawnCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		int dirfact = 0;
		if (myclr == null) throw new IllegalStateException("color must not be null!");
		if (myclr.equals("WHITE")) dirfact = -1;
		else if (myclr.equals("BLACK")) dirfact = 1;
		else throw new IllegalStateException("illegal color (" + myclr + ") found and used here");
		//System.out.println("PAWN dirfact = " + dirfact);
		
		//can only move forward one or two spaces on the first turn otherwise forward one only
		//exception is attacking or pawning
		
		//if has not moved can move forward 2 spots or 1 spot
		//otherwise can only move forward 1 spot unless can kill a piece only attacks diagnal
		boolean canmvfwdtwo = ((sr == 6 && myclr.equals("WHITE")) || (sr == 1 && myclr.equals("BLACK")));
		//System.out.println("PAWN canmvfwdtwo = " + canmvfwdtwo);
		
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
		boolean[] isvloc = new boolean[tplocs.length];
		int numv = 1;
		isvloc[0] = true;
		//System.out.println("STARTING LOCATION: " + getLocString(sr, sc) + ": " + convertRowColToStringLoc(sr, sc));
		
		for (int x = 1; x < tplocs.length; x++)
    	{
    		isvloc[x] = (isvalidrorc(tplocs[x][0]) && isvalidrorc(tplocs[x][1]));
    		//System.out.println("CURRENT LOC " + getLocString(tplocs[x][0], tplocs[x][1]));
    		//System.out.println("OLD isvloc[" + x + "] = " + isvloc[x]);
    		
    		if (isvloc[x])
    		{
    			//the loc is valid, but now see if moving there moves our king to check or
    			//see if we can even move there in the first place
    			if (canAddThisMoveToLoc(sr, sc, tplocs[x][0], tplocs[x][1], myclr, "PAWN", ignorelist, addpcs, gid))
				{
					//System.out.println("VALID LOC " + getLocString(tplocs[x][0], tplocs[x][1]) + ": " +
	    			//	convertRowColToStringLoc(tplocs[x]));
					isvloc[x] = true;
				}
				else isvloc[x] = false;
				//System.out.println("NEW isvloc[" + x + "] = " + isvloc[x]);
	    	}
	    	//else;//do nothing
	    	//System.out.println("FINAL isvloc[" + x + "] = " + isvloc[x]);
    		
    		if (isvloc[x]) numv++;
    		//else;//do nothing
    	}
    	int[][] rlist = new int[numv][2];
    	int vki = 0;
    	for (int x = 0; x < tplocs.length; x++)
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
	public static int[][] getKnightCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		int[][] pktlocs = getAllPossibleKnightMoveToLocs(sr, sc);
		//if (pktlocs == null) System.out.println("pktlocs = null");
    	//else if (pktlocs.length < 1) System.out.println("pktlocs is empty!");
    	//else
    	//{
    	//	System.out.println("pktlocs.length = " + pktlocs.length);
	    //	for (int x = 0; x < pktlocs.length; x++)
	    //	{
	    //		System.out.println(getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//System.out.println(getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	convertRowColToStringLoc(pktlocs[x]));
	    //	}
    	//}
    	//System.out.println("STARTING LOCATION: " + getLocString(sr, sc) + ": " + convertRowColToStringLoc(sr, sc));
    	
    	if (pktlocs == null || pktlocs.length < 1)
    	{
    		int[][] rlist = new int[1][2];
    		rlist[0][0] = sr;
    		rlist[0][1] = sc;
    		return rlist;
    	}
		else
		{
			boolean[] isvloc = new boolean[pktlocs.length];
			int numv = 0;
			for (int x = 0; x < pktlocs.length; x++)
	    	{
	    		isvloc[x] = (isvalidrorc(pktlocs[x][0]) && isvalidrorc(pktlocs[x][1]));
	    		if (isvloc[x])
	    		{
	    			//the loc is valid, but now see if moving there moves our king to check or
	    			//see if we can even move there in the first place
	    			if (canAddThisMoveToLoc(sr, sc, pktlocs[x][0], pktlocs[x][1], myclr, "KNIGHT", ignorelist, addpcs, gid))
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
	    	int vpki = 1;
	    	for (int x = 0; x < pktlocs.length; x++)
	    	{
	    		if (isvloc[x])
	    		{
	    			vpktlocs[vpki][0] = pktlocs[x][0];
	    			vpktlocs[vpki][1] = pktlocs[x][1];
	    			//System.out.println("VALID LOC " + getLocString(vpktlocs[vpki][0], vpktlocs[vpki][1]) + ": " +
	    			//	convertRowColToStringLoc(vpktlocs[vpki]));
	    			vpki++;
	    		}
	    		//else;//do nothing
	    	}
	    	return vpktlocs;
		}
	}
	//NOTE: this does not take into account castling
	public static int[][] getKingCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (isvalidrorc(sr) && isvalidrorc(sc));
		else throw new IllegalStateException("SR AND SC MUST BE VALID!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		//can move one square in any direction
		//exception is castling
		
		//rdiff and cdiff must be at most 1 at minimum 0 zero
		int[][] keeplist = new int[9][2];
		int kli = 0;
		for (int x = 0; x < keeplist.length; x++)
		{
			keeplist[x][0] = -1;
			keeplist[x][1] = -1;
		}
		//System.out.println("sr = " + sr);
		//System.out.println("sc = " + sc);
		int sri = -1;
		if (0 < sr) sri = sr - 1;
		else if (0 == sr) sri = 0;
		else throw new IllegalStateException("negative values not allowed for sr!");
		int sci = -1;
		if (0 < sc) sci = sc - 1;
		else if (0 == sc) sci = 0;
		else throw new IllegalStateException("negative values not allowed for sc!");
		//System.out.println("sri = " + sri);
		//System.out.println("sci = " + sci);
		for (int r = sri; ((0 < r || r == 0) && r < 8) && r < sr + 2; r++)
		{
			for (int c = sci; ((0 < c || c == 0) && c < 8) && c < sc + 2; c++)
			{
				//System.out.println("r = " + r);
				//System.out.println("c = " + c);
				if (canAddThisMoveToLoc(sr, sc, r, c, myclr, "KING", ignorelist, addpcs, gid))//(r == sr && c == sc) || 
				{
					//System.out.println("ADD LOCATION!");
					//if (isLocOnListOfLocs(r, c, keeplist));
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
		for (int x = 0; x < kli; x++)
		{
			rlist[x][0] = keeplist[x][0];
			rlist[x][1] = keeplist[x][1];
		}
		return rlist;
	}
	
	//THIS TAKES INTO ACCOUNT PAWNING TOO; IF NOT CALLED ON A PAWN WITH THE SAME COLOR JUST RETURNS ABOVE
	public static int[][] getAllPawnCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean bpassimnxtmv)
	{
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = getPieceAt(sr, sc, allpcs);
		int[][] pcmlocs = getPawnCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
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
				int numaddlocs = 0;
				boolean addpleft = false;
				if (pleftloc == null);
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				boolean addpright = false;
				if (prightloc == null);
				else
				{
					numaddlocs++;
					addpleft = true;
				}
				//System.out.println("addpleft = " + addpleft);
				//System.out.println("addpright = " + addpright);
				int[][] locs = null;
				if (pcmlocs == null) locs = null;
				else
				{
					locs = new int[numaddlocs + pcmlocs.length][2];
					for (int x = 0; x < pcmlocs.length; x++)
					{
						locs[x][0] = pcmlocs[x][0];
						locs[x][1] = pcmlocs[x][1];
					}
					int lci = pcmlocs.length;
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
					else throw new IllegalStateException("locs does not have the correct size!");
				}
				return locs;
			}
			else return pcmlocs;
		}
	}
	
	//THIS TAKES INTO ACCOUNT CASTLEING FOR KING ONLY; IF NOT CALLED ON A KING WITH THE SAME COLOR JUST RETURNS ABOVE
	public static int[][] getAllKingCanMoveToLocs(int sr, int sc, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		int[][] kcmvlocs = getKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = getPieceAt(sr, sc, allpcs);
		if (cp == null) return kcmvlocs;
		else
		{
			if (cp.getColor().equals(myclr));
			else return kcmvlocs;
			
			if (cp.getType().equals("KING"))
			{
				//now we can see if we can castle easily now
				//System.out.println("SEES IF WE CAN CASTLE:");
				boolean ccleft = canSideCastleLeft(myclr, ignorelist, addpcs, gid);
				boolean ccright = canSideCastleRight(myclr, ignorelist, addpcs, gid);
				//System.out.println("ccleft = " + ccleft);
				//System.out.println("ccright = " + ccright);
				int[] clftloc = null;
				int[] crgtloc = null;
				int numadd = 0;
				if (ccleft)
				{
					clftloc = getLeftCastleSideNewKingLoc(myclr, ignorelist, addpcs, gid);
					numadd++;
					//System.out.println("clftloc[0] = " + clftloc[0]);
					//System.out.println("clftloc[1] = " + clftloc[1]);
				}
				if (ccright)
				{
					crgtloc = getRightCastleSideNewKingLoc(myclr, ignorelist, addpcs, gid);
					numadd++;
					//System.out.println("crgtloc[0] = " + crgtloc[0]);
					//System.out.println("crgtloc[1] = " + crgtloc[1]);
				}
				//System.out.println("numadd = " + numadd);
				if (numadd < 1) return kcmvlocs;
				else if (2 < numadd) throw new IllegalStateException("numadd is an invalid value!");
				//else;//do nothing
				if (kcmvlocs == null) return null;
				else
				{
					int[][] locs = new int[kcmvlocs.length + numadd][2];
					int lci = kcmvlocs.length;
					for (int x = 0; x < kcmvlocs.length; x++)
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
	public static int[][] getPieceCanMoveToLocs(int sr, int sc, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean nocsling, boolean bpassimnxtmv)
	{
		if (mytpval == null) throw new IllegalStateException("mytpval must not be null!");
		else
		{
			if (mytpval.equals("BISHOP")) return getBishopCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else if (mytpval.equals("CASTLE") || mytpval.equals("ROOK"))
			{
				return getCastleCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			}
			else if (mytpval.equals("QUEEN")) return getQueenCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else if (mytpval.equals("PAWN"))
			{
				return getAllPawnCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid, bpassimnxtmv);
			}
			else if (mytpval.equals("KING"))
			{
				if (nocsling) return getKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
				else return getAllKingCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			}
			else if (mytpval.equals("KNIGHT")) return getKnightCanMoveToLocs(sr, sc, myclr, ignorelist, addpcs, gid);
			else throw new IllegalStateException("illegal value found and used here for mytpval (" + mytpval + ")!");
		}
	}
	public static int[][] getPieceCanMoveToLocs(int sr, int sc, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return getPieceCanMoveToLocs(sr, sc, myclr, mytpval, ignorelist, addpcs, gid, false, false);
	}
	public int[][] getPieceCanMoveToLocs(int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		boolean nocsling, boolean bpassimnxtmv)
	{
		return getPieceCanMoveToLocs(getRow(), getCol(), getColor(), getType(), ignorelist, addpcs, getGameID(),
			nocsling, bpassimnxtmv);
	}
	public int[][] getPieceCanMoveToLocs(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return getPieceCanMoveToLocs(ignorelist, addpcs, false, false);
	}
	public int[][] getPieceCanMoveToLocs()
	{
		return getPieceCanMoveToLocs(null, null);
	}
	
	
	//GET PIECE STARTING LOCATION FROM GIVEN DESIRED ENDING LOCATION FOR A DESIRED BOARD
	
	//this is given an end location and determines the starting location of the piece
	//if more than one piece can move there the starting location is ambigious and will throw an error
	//if no piece can move there it returns null
	//it is done differently depending on the type of piece, how a king does it is different than how a knight does it
	public static int[] getStartLocForBishopThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean useqn)
	{
		//moves on a diagnal must be free
		int[] tlloc = null;
		int[] trloc = null;
		int[] blloc = null;
		int[] brloc = null;
		for (int x = 0; x < 4; x++)
		{
			//System.out.println("x = " + x);
			
			int r = er;
			int c = ec;
			while (isvalidrorc(r) && isvalidrorc(c))
			{
				//System.out.println("r = " + r);
				//System.out.println("c = " + c);
				
				ChessPiece cp = getPieceAt(r, c, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
				//System.out.println("cp = " + cp);
				
				if (cp == null);
				else
				{
					//System.out.println("useqn = " + useqn);
					
					if (((!useqn && cp.getType().equals("BISHOP")) || (useqn && cp.getType().equals("QUEEN"))) &&
						cp.getColor().equals(myclr))
					{
						//found one
						//System.out.println("KEEP IT!");
						if (x == 0)
						{
							brloc = new int[2];
							brloc[0] = r;
							brloc[1] = c;
						}
						else if (x == 1)
						{
							if (brloc == null);
							else throw new IllegalStateException("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							tlloc = new int[2];
							tlloc[0] = r;
							tlloc[1] = c;
						}
						else if (x == 2)
						{
							if (brloc == null && tlloc == null);
							else throw new IllegalStateException("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							trloc = new int[2];
							trloc[0] = r;
							trloc[1] = c;
						}
						else if (x == 3)
						{
							if (brloc == null && tlloc == null && trloc == null);
							else throw new IllegalStateException("FOUND MORE THAN ONE BISHOP OR QUEEN!");
							blloc = new int[2];
							blloc[0] = r;
							blloc[1] = c;
						}
						else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
					}
					//else;//do nothing
					break;
				}
				
				//increment the variables
				//System.out.println("x = " + x);
				if (x == 0)
				{
					//go towards bottom right
					//System.out.println("TOWARDS BOTTOM RIGHT!");
					r++;
					c++;
				}
				else if (x == 1)
				{
					//go towards top left
					//System.out.println("TOWARDS TOP LEFT!");
					r--;
					c--;
				}
				else if (x == 2)
				{
					//go towards top right
					//System.out.println("TOWARDS TOP RIGHT!");
					r--;
					c++;
				}
				else if (x == 3)
				{
					//go towards bottom left
					//System.out.println("TOWARDS BOTTOM LEFT!");
					r++;
					c--;
				}
				else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR INDEX X!");
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
	public static int[] getStartLocForCastleThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean useqn)
	{
		//the castle or rook or queen must be unobstructed
		//move on the same row changing the colums OR move on the colum changing the row
		int[] rincloc = null;
		int[] rdecloc = null;
		int[] cincloc = null;
		int[] cdecloc = null;
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		for (int r = er; r < 8; r++)
		{
			ChessPiece cp = getPieceAt(r, ec, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					System.out.println("KEEP IT!");
					System.out.println("locr = " + r);
					System.out.println("locc = " + ec);
					//not sure how to prevent ambiguity error
					rincloc = new int[2];
					rincloc[0] = r;
					rincloc[1] = ec;
				}
				//else;//do nothing
				break;
			}
		}
		for (int r = er; -1 < r && r < 8; r--)
		{
			ChessPiece cp = getPieceAt(r, ec, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					System.out.println("KEEP IT!");
					System.out.println("locr = " + r);
					System.out.println("locc = " + ec);
					//not sure how to prevent ambiguity error
					rdecloc = new int[2];
					rdecloc[0] = r;
					rdecloc[1] = ec;
					if (rincloc == null);
					else throw new IllegalStateException("FOUND MORE THAN ONE CASTLE OR QUEEN!");
				}
				//else;//do nothing
				break;
			}
		}
		for (int c = ec; c < 8; c++)
		{
			ChessPiece cp = getPieceAt(er, c, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					System.out.println("KEEP IT!");
					System.out.println("locr = " + er);
					System.out.println("locc = " + c);
					//not sure how to prevent ambiguity error
					cincloc = new int[2];
					cincloc[0] = er;
					cincloc[1] = c;
					if (rincloc == null && rdecloc == null);
					else throw new IllegalStateException("FOUND MORE THAN ONE CASTLE OR QUEEN!");
				}
				//else;//do nothing
				break;
			}
		}
		for (int c = ec; -1 < c && c < 8; c--)
		{
			ChessPiece cp = getPieceAt(er, c, allpcs);
			if (cp == null);
			else
			{
				if (((useqn && cp.getType().equals("QUEEN")) ||
					(!useqn && (cp.getType().equals("CASTLE") || cp.getType().equals("ROOK")))) &&
					cp.getColor().equals(myclr))
				{
					System.out.println("KEEP IT!");
					System.out.println("locr = " + er);
					System.out.println("locc = " + c);
					//not sure how to prevent ambiguity error
					cdecloc = new int[2];
					cdecloc[0] = er;
					cdecloc[1] = c;
					if (rincloc == null && rdecloc == null && cincloc == null);
					else throw new IllegalStateException("FOUND MORE THAN ONE CASTLE OR QUEEN!");
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
	public static int[] getStartLocForQueenThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		int[] bsloc = getStartLocForBishopThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, true);
		int[] csloc = getStartLocForCastleThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, true);
		if (bsloc == null || !(isvalidrorc(bsloc[0]) && isvalidrorc(bsloc[1]))) return csloc;
		else
		{
			if (csloc == null || !(isvalidrorc(csloc[0]) && isvalidrorc(csloc[1]))) return bsloc;
			else throw new IllegalStateException("FOUND MORE THAN ONE QUEEN!");
		}
	}
	public static int[] getStartLocForKnightThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		//we can use the all possible knight locs and provied the ending location to get the starting location
		//if it is ambiguous, throw an error that it was ambiguous!
		
		int[][] pktlocs = getAllPossibleKnightMoveToLocs(er, ec);
		//if (pktlocs == null) System.out.println("pktlocs = null");
    	//else if (pktlocs.length < 1) System.out.println("pktlocs is empty!");
    	//else
    	//{
    	//	System.out.println("pktlocs.length = " + pktlocs.length);
	    //	for (int x = 0; x < pktlocs.length; x++)
	    //	{
	    //		System.out.println(getLocString(pktlocs[x][0], pktlocs[x][1]));
	    //		//System.out.println(getLocString(pktlocs[x][0], pktlocs[x][1]) + ": " +
	    //		//	convertRowColToStringLoc(pktlocs[x]));
	    //	}
    	//}
    	//System.out.println("STARTING LOCATION: " + getLocString(sr, sc) + ": " + convertRowColToStringLoc(sr, sc));
    	
    	if (pktlocs == null || pktlocs.length < 1)
    	{
    		//check our location if not there return null
    		//ChessPiece cp = getPieceAt(er, ec, ArrayList<ChessPiece> mpclist);
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
    		boolean[] keepit = new boolean[pktlocs.length];
    		for (int x = 0; x < pktlocs.length; x++) keepit[x] = false;
    		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
    		for (int x = 0; x < pktlocs.length; x++)
    		{
    			//check our location for the current piece type and color
    			System.out.println("pktlocs[" + x + "][0] = " + pktlocs[x][0]);
    			System.out.println("pktlocs[" + x + "][1] = " + pktlocs[x][1]);
    			ChessPiece cp = getPieceAt(pktlocs[x][0], pktlocs[x][1], allpcs);
    			if (cp == null);
    			else
    			{
    				if (cp.getType().equals("KNIGHT") && cp.getColor().equals(myclr))
    				{
    					System.out.println("KEEP IT!");
    					//found one
    					keepit[x] = true;
    					for (int c = 0; c < x; c++)
    					{
    						if (keepit[c]) throw new IllegalStateException("FOUND MORE THAN ONE KNIGHT!");
    						//else;//do nothing
    					}
    				}
    				//else;//do nothing
    			}
    		}//end of x for loop
    		for (int x = 0; x < pktlocs.length; x++)
    		{
    			if (keepit[x]) return pktlocs[x];
    			//else;//do nothing
    		}
    	}
    	return null;
	}
	public static int[] getStartLocForKingThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean nocsling)
	{
		ChessPiece mkg = getCurrentSideKing(myclr, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new IllegalStateException("OUR SIDE KING MUST NOT BE NULL!");
		//else;//do nothing
		
		int[][] mkgmvlocs = getPieceCanMoveToLocs(mkg.getRow(), mkg.getCol(), myclr, "KING",
			ignorelist, addpcs, gid, nocsling, false);
		if (mkgmvlocs == null || mkgmvlocs.length < 1) return null;//king cannot move there
		else
		{
			for (int x = 0; x < mkgmvlocs.length; x++)
			{
				if (mkgmvlocs[x][0] == er && mkgmvlocs[x][1] == ec)
				{
					System.out.println("KEEP IT");
					System.out.println("locr = " + mkg.getRow());
					System.out.println("locc = " + mkg.getCol());
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
	public static int[] getStartLocForPawnThatCanMoveTo(int er, int ec, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean bpassimnxtmv)
	{
		//it seems the best way is to get all the pawns for the color and then see where they can move to
		//if there is only one that can move to our ending location great, else error or none.
		
		ArrayList<ChessPiece> mypwns = getAllPawnsOfColor(myclr, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		//System.out.println("mypwns = " + mypwns);
		int numpwns = getNumItemsInList(mypwns);
		if (numpwns < 1) return null;
		else
		{
			boolean fndit = false;
			int[] ploc = null;
			for (int p = 0; p < numpwns; p++)
			{
				int[][] pwnmvlocs = mypwns.get(p).getPieceCanMoveToLocs(ignorelist, addpcs, true, bpassimnxtmv);
				if (pwnmvlocs == null || pwnmvlocs.length < 1);
				else
				{
					//System.out.println("THIS HAS MOVE LOCS: mypwns.get(" + p + ") = " + mypwns.get(p));
					for (int x = 0; x < pwnmvlocs.length; x++)
					{
						//System.out.println("pwnmvlocs[" + x + "][0] = " + pwnmvlocs[x][0]);
						//System.out.println("pwnmvlocs[" + x + "][1] = " + pwnmvlocs[x][1]);
						if (pwnmvlocs[x][0] == er && pwnmvlocs[x][1] == ec)
						{
							System.out.println("KEEP IT!");
							System.out.println("locr = " + mypwns.get(p).getRow());
							System.out.println("locc = " + mypwns.get(p).getCol());
							if (fndit) throw new IllegalStateException("FOUND MORE THAN ONE PAWN!");
							else
							{
								fndit = true;
								ploc = new int[2];
								ploc[0] = mypwns.get(p).getRow();
								ploc[1] = mypwns.get(p).getCol();
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
	public static int[] getStartLocForPieceThatCanMoveTo(int er, int ec, String myclr, String mytpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, boolean nocsling, boolean bpassimnxtmv)
	{
		if (mytpval == null || mytpval.length() < 1)
		{
			throw new IllegalStateException("INVALID TYPE (NULL OR EMPTY) FOUND AND USED HERE!");
		}
		else if (mytpval.equals("CASTLE") || mytpval.equals("ROOK"))
		{
			return getStartLocForCastleThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, false);
		}
		else if (mytpval.equals("KING"))
		{
			return getStartLocForKingThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, nocsling);
		}
		else if (mytpval.equals("KNIGHT"))
		{
			return getStartLocForKnightThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid);
		}
		else if (mytpval.equals("PAWN"))
		{
			return getStartLocForPawnThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, bpassimnxtmv);
		}
		else if (mytpval.equals("QUEEN"))
		{
			return getStartLocForQueenThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid);
		}
		else if (mytpval.equals("BISHOP"))
		{
			return getStartLocForBishopThatCanMoveTo(er, ec, myclr, ignorelist, addpcs, gid, false);
		}
		else throw new IllegalStateException("INVALID TYPE (" + mytpval + ") FOUND AND USED HERE!");
	}
	
	
	//ARE PIECES FREE TO MOVE AROUND
	
	//asks can piece at loc move around to another location other than the current location
	//if no piece is at the loc returns false
	public static boolean isPieceAtLocFreeToMoveAround(int sr, int sc, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid, boolean nocsling, boolean bpassimnxtmv)
	{
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece cp = getPieceAt(sr, sc, allpcs);
		//System.out.println("sr = " + sr);
		//System.out.println("sc = " + sc);
		//System.out.println("cp = " + cp);
		if (cp == null) return false;
		else
		{
			int[][] mvlocs = getPieceCanMoveToLocs(sr, sc, cp.getColor(), cp.getType(), ignorelist, addpcs, gid,
				nocsling, bpassimnxtmv);
			if (mvlocs == null || mvlocs.length < 1)
			{
				//System.out.println("MOVELOCS IS EMPTY!");
				return false;
			}
			else
			{
				//System.out.println("mvlocs.length = " + mvlocs.length);
				if (mvlocs.length == 1)
				{
					//System.out.println("mvlocs[0][0] = " + mvlocs[0][0]);
					//System.out.println("mvlocs[0][1] = " + mvlocs[0][1]);
					if (mvlocs[0][0] == sr && mvlocs[0][1] == sc) return false;
					//else;//do nothing
				}
				//else
				//{
					//for (int x = 0; x < mvlocs.length; x++)
					//{
					//	System.out.println("mvlocs[" + x + "][0] = " + mvlocs[x][0]);
					//	System.out.println("mvlocs[" + x + "][1] = " + mvlocs[x][1]);
					//}
				//}
				return true;
			}
		}
	}
	public static boolean isPieceAtLocFreeToMoveAround(int sr, int sc, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return isPieceAtLocFreeToMoveAround(sr, sc, ignorelist, addpcs, gid, false, false);
	}
	
	public static ArrayList<ChessPiece> getPiecesThatAreFreeToMove(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid, boolean nocsling, boolean bpassimnxtmv)
	{
		//they can move to a location other than the current location it is on
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		if (getNumItemsInList(allpcs) < 1) return null;
		else
		{
			ArrayList<ChessPiece> fpcs = null;
			for (int x = 0; x < allpcs.size(); x++)
			{
				if (isPieceAtLocFreeToMoveAround(allpcs.get(x).getRow(), allpcs.get(x).getCol(),
					ignorelist, addpcs, gid, nocsling, bpassimnxtmv))
				{
					//add to list
					
					if (fpcs == null) fpcs = new ArrayList<ChessPiece>();
					//else;//do nothing
					
					fpcs.add(allpcs.get(x));
				}
				//else;//do nothing
			}
			return fpcs;
		}
	}
	public static ArrayList<ChessPiece> getPiecesThatAreFreeToMove(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, false, false);
	}
	
	
	//WHERE ALL CAN A SIDE REACH METHODS
	
	public static int[][] getPieceMoveToLocsForLocs(int[][] smvlocs, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (smvlocs == null || smvlocs.length < 1) return null;
		
		//for each location on the smvlocs list get the moveto locs and combine them all then return the list
		int[][][] tempmvlocs = new int[smvlocs.length][2][];
		int numadded = 0;
		for (int x = 0; x < smvlocs.length; x++)
		{
			int[][] mvlocs = getPieceCanMoveToLocs(smvlocs[x][0], smvlocs[x][1], myclr, mytpval,
				ignorelist, addpcs, gid, true, false);
			if (mvlocs == null || mvlocs.length < 1) tempmvlocs[x] = null;
			else
			{
				tempmvlocs[x][0] = new int[mvlocs.length];
				tempmvlocs[x][1] = new int[mvlocs.length];
				for (int c = 0; c < mvlocs.length; c++)
				{
					//System.out.println("mvlocs[" + c + "][0] = " + mvlocs[c][0]);
					//System.out.println("mvlocs[" + c + "][1] = " + mvlocs[c][1]);
					tempmvlocs[x][0][c] = mvlocs[c][0];
					tempmvlocs[x][1][c] = mvlocs[c][1];
				}
				numadded += mvlocs.length;
			}
		}
		
		int[][] rmvlocs = new int[numadded][2];
		for (int x = 0; x < numadded; x++)
		{
			rmvlocs[x][0] = -1;
			rmvlocs[x][1] = -1;
		}
		int mvi = 0;
		for (int x = 0; x < smvlocs.length; x++)
		{
			if (tempmvlocs[x] == null);
			else
			{
				for (int c = 0; c < tempmvlocs[x][0].length; c++)
				{
					if (isLocOnListOfLocs(tempmvlocs[x][0][c], tempmvlocs[x][1][c], rmvlocs));
					else
					{
						rmvlocs[mvi][0] = tempmvlocs[x][0][c];
						rmvlocs[mvi][1] = tempmvlocs[x][1][c];
						mvi++;
					}
				}
			}
		}
		//System.out.println("mvi = " + mvi);
		
		int[][] rlistmvlocs = new int[mvi][2];
		for (int x = 0; x < mvi; x++)
		{
			rlistmvlocs[x][0] = rmvlocs[x][0];
			rlistmvlocs[x][1] = rmvlocs[x][1];
		}
		//printLocsArray(rlistmvlocs, "rlistmvlocs");
		return rlistmvlocs;
	}
	
	public static int[][] getAllLocsThatCanBeReachedByPiece(int sr, int sc, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid, int[][] vlocs)
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
			
		int[][] mvlocs = getPieceCanMoveToLocs(sr, sc, myclr, mytpval, ignorelist, addpcs, gid, true, false);
		//if no mvlocs return vlist
		if (mvlocs == null || mvlocs.length < 1) return null;
		else
		{
			//if all of mvlocs are on the vlist return the vlist
			if (vlocs == null || vlocs.length < 1);
			else
			{
				boolean allonit = true;
				for (int x = 0; x < mvlocs.length; x++)
				{
					boolean fndit = false;
					for (int c = 0; c < vlocs.length; c++)
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
		int prevsz = 0;
		int[][] mymvlocs = getPieceMoveToLocsForLocs(mvlocs, mytpval, myclr, ignorelist, addpcs, gid);
		//System.out.println("INIT prevsz = " + prevsz);
		//printLocsArray(mymvlocs, "lvtwomvlocs");
		
		if (mymvlocs == null);
		else
		{
			while(prevsz < mymvlocs.length)
			{
				prevsz = mymvlocs.length;
				//System.out.println("NEW prevsz = " + prevsz);
				
				mymvlocs = getPieceMoveToLocsForLocs(mymvlocs, mytpval, myclr, ignorelist, addpcs, gid);
				//printLocsArray(mymvlocs, "mymvlocs");
			}//end of while loop
		}
		
		//System.out.println("STARTING LOCATION IS " + getLocStringAndConvertIt(sr, sc));
		//printLocsArray(mymvlocs, "FINAL mymvlocs");
		return mymvlocs;
	}
	public static int[][] getAllLocsThatCanBeReachedByPiece(int sr, int sc, String mytpval, String myclr,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return getAllLocsThatCanBeReachedByPiece(sr, sc, mytpval, myclr, ignorelist, addpcs, gid, null);
	}
	public int[][] getAllLocsThatCanBeReachedByPiece(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return getAllLocsThatCanBeReachedByPiece(getRow(), getCol(), getType(), getColor(), ignorelist, addpcs, getGameID());
	}
	
	public static int[][] getAllLocsThatCanBeReachedBySide(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		//gets all the pieces for a side...
		//get all of their move to locations for each piece
		//then save a list of all of the unique locations
		ArrayList<ChessPiece> allmypcs = getCurrentSidePieces(clrval, gid, ignorelist, addpcs);
		int numallmypcs = getNumItemsInList(allmypcs);
		if (numallmypcs < 1) throw new IllegalStateException("there must be at least a king on one side!");
		//else;//do nothing
		int[][] tmplocslist = new int[64][2];
		for (int x = 0; x < 64; x++)
		{
			tmplocslist[x][0] = -1;
			tmplocslist[x][1] = -1;
		}
		int rszi = 0;
		for (int x = 0; x < numallmypcs; x++)
		{
			int[][] pcmvlocs = allmypcs.get(x).getAllLocsThatCanBeReachedByPiece(ignorelist, addpcs);
			if (pcmvlocs == null || pcmvlocs.length < 1);
			else
			{
				//add these to the rlist
				for (int c = 0; c < pcmvlocs.length; c++)
				{
					if (isLocOnListOfLocs(pcmvlocs[c][0], pcmvlocs[c][1], tmplocslist));
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
		for (int x = 0; x < rszi; x++)
		{
			rlist[x][0] = tmplocslist[x][0];
			rlist[x][1] = tmplocslist[x][1];
		}
		return rlist;
	}
	
	
	//SPECIAL MOVES AND MAIN CAN MOVE TO METHODS
	
	
	//DOES NOT TAKE INTO ACCOUNT PAWN PROMOTION AS BEING SPECIAL
	//IF CALLED ON A CASTLE, DOES NOT CONSIDDER CASTLING
	public boolean isMoveToASpecialMove(int nrval, int ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		boolean bpassimnxtmv)
	{
		String[] tpsnospcmvs = {"QUEEN", "BISHOP", "KNIGHT", "CASTLE", "ROOK"};
		if (itemIsOnGivenList(getType(), tpsnospcmvs)) return false;
		else
		{
			int[][] allpclocs = getPieceCanMoveToLocs(getRow(), getCol(), getColor(), getType(), ignorelist, addpcs,
				getGameID(), false, bpassimnxtmv);
			int[][] normalpclocs = null;
			if (getType().equals("KING"))
			{
				normalpclocs = getKingCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
			}
			else
			{
				//pawn
				normalpclocs = getPawnCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
			}
			boolean onnrml = false;
			boolean onall = false;
			if (normalpclocs == null || normalpclocs.length < 1);
			else
			{
				for (int x = 0; x < normalpclocs.length; x++)
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
				for (int x = 0; x < allpclocs.length; x++)
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
	public boolean canMoveTo(int rval, int cval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean bpassimnxtmv)
	{
		if (isvalidrorc(rval) && isvalidrorc(cval));
		else return false;
		//use current location, piece type, if side is in check or not, and opposing piece locations
		//to determine where I can move or if I can move at all.
		
		int[][] locs = null;
		if (getType().equals("BISHOP"))
		{
			//on diagnals only
			locs = getBishopCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
		}
		else if (getType().equals("CASTLE") || getType().equals("ROOK"))
		{
			//on same row or col only
			//can castle if the other pieces between the castle and the king are not there and if not in check
			//and if neither castle nor king have moved
			locs = getCastleCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
		}
		else if (getType().equals("QUEEN"))
		{
			//diagnals and on same row or same col
			locs = getQueenCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
		}
		else if (getType().equals("KNIGHT"))
		{
			//has at most 8 possible moves
			//up or down 3 right or left 1
			//up or down 1 right or left 3
			//--*-*--
			//-*---*-
			//---x---
			//-*---*-
			//--*-*--
			locs = getKnightCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
		}
		else if (getType().equals("PAWN"))
		{
			//can only move forward or diagnal one space to attack
			//if it is the first move, can move forward two spaces
			//in passing or EN PASSANT is a form of attack
			//you can only pawn a pawn that has made its first move
			locs = getAllPawnCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID(), bpassimnxtmv);
		}
		else if (getType().equals("KING"))
		{
			//1 in any direction provided move does not put king in check
			//if in check and king cannot move without being put into check, see if another piece can block it
			//if the king cannot get out of check -> checkmate other side wins.
			//if the king cannot move, but must move -> stalemate tie.
			locs = getAllKingCanMoveToLocs(getRow(), getCol(), getColor(), ignorelist, addpcs, getGameID());
		}
		else throw new IllegalStateException("ILLEGAL TYPE FOUND AND USED HERE!");
		if (locs == null || locs.length < 1)
		{
			//System.out.println("LOCS LIST IS EMPTY!");
			return false;
		}
		else
		{
			for (int x = 0; x < locs.length; x++)
			{
				if (locs[x][0] == rval && locs[x][1] == cval) return true;
				//else;//do nothing
			}
		}
		//System.out.println("LOC " + getLocString(rval, cval) + " NOT FOUND ON THE LIST!");
		return false;
	}
	public boolean canMoveToLoc(int rval, int cval, int[][] ignorelist)
	{
		return canMoveTo(rval, cval, ignorelist, null, false);
	}
	public boolean canMoveToLoc(int rval, int cval)
	{
		return canMoveTo(rval, cval, null, null, false);
	}
	public boolean canMoveToLoc(int[] nloc)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		else return canMoveToLoc(nloc[0], nloc[1]);
	}
	
	
	//CHECKMATE METHODS
	
	//is color side in checkmate
	public static boolean inCheckmate(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		//KING MUST BE IN CHECK
		//KING CANNOT MOVE OUT OF CHECK
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY MOVING A PIECE IN FRONT OF IT
		//THE SIDE WHO'S KING IS IN CHECK CANNOT BLOCK IT BY KILLING THE PIECE(S) CHECKING THE KING
		
		ChessPiece mkg = getCurrentSideKing(clrval, combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
		if (mkg == null) throw new IllegalStateException("the king must be found!");
		//else;//do nothing
		
		//can I be directly attacked by the opposing side?
		ArrayList<ChessPiece> epcs = getEnemyPiecesGuardingLocation(mkg.getRow(), mkg.getCol(), gid, clrval,
			ignorelist, addpcs);
		//System.out.println("epcs = " + epcs);
		//is in check
		if (getNumItemsInList(epcs) < 1) return false;//not in check so not in checkmate
		//else;//do nothing my king is in check now need to determine if it is checkmate
		System.out.println("" + clrval + " KING IS IN CHECK!");
		
		//need to know if this king is free to move or rather can move somewhere other than the current location
		if (isPieceAtLocFreeToMoveAround(mkg.getRow(), mkg.getCol(), ignorelist, addpcs, gid, true, false)) return false;
		//can move out of check
		//else;//do nothing still in check
		System.out.println("" + clrval + " KING CANNOT MOVE OUT OF CHECK!");
		
		//can check be blocked
		//does side have no legal moves
		//if there is a legal move other than staying where we are, then it blocks check somehow
		
		ArrayList<ChessPiece> fpcs = getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false);
		//System.out.println("fpcs = " + fpcs);
		
		ArrayList<ChessPiece> myclrfpcs = filterListByColor(fpcs, clrval);
		//System.out.println("myclrfpcs = " + myclrfpcs);
		
		if (getNumItemsInList(myclrfpcs) < 1)
		{
			System.out.println("" + clrval + " HAS NO FREE PIECES! IT CANNOT BLOCK CHECK! IT IS CHECKMATE! " +
				getOppositeColor(clrval) + " WINS!");
			return true;
		}
		//else;//do nothing might be able to block check
		
		for (int x = 0; x < myclrfpcs.size(); x++)
		{
			//System.out.println("myclrfpcs.get(" + x + ") = " + myclrfpcs.get(x));
			
			int[][] pcmvlocs = getPieceCanMoveToLocs(myclrfpcs.get(x).getRow(), myclrfpcs.get(x).getCol(), clrval,
				myclrfpcs.get(x).getType(), ignorelist, addpcs, gid, true, false);
			//printLocsArray(pcmvlocs, "pcmvlocs");
			
			//determine where the piece can move to block check... if it indeed does block check
			if (myclrfpcs.get(x).getType().equals("KING"))
			{
				throw new IllegalStateException("the king cannot move out of check, now it says it can!");
			}
			else
			{
				if (1 < pcmvlocs.length)
				{
					System.out.println("AT LEAST ONE PIECE ON THE " + clrval + " SIDE CAN BLOCK CHECK!");
					return false;
				}
				//else;//do nothing
			}
		}//end of x for loop
		
		System.out.println("" + clrval + " CANNOT BLOCK CHECK WITH ITS FREE PIECES! IT IS CHECKMATE! " +
			getOppositeColor(clrval) + " WINS!");
		return true;
	}
	//is white in checkmate
	public static boolean inCheckmateWhite(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return inCheckmate("WHITE", ignorelist, addpcs, gid);
	}
	//is black in checkmate
	public static boolean inCheckmateBlack(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return inCheckmate("BLACK", ignorelist, addpcs, gid);
	}
	
	
	//STALEMATE METHODS
	
	//returns true if less than 2 pieces of that type are on the board
	public static boolean areAllOfTypeOnSameColorSquare(String typeval, ArrayList<ChessPiece> allpcs)
	{
		ArrayList<ChessPiece> bps = getAllOfType(typeval, allpcs);
		if (getNumItemsInList(bps) < 2) return true;
		else
		{
			String myfbpclr = getColorOfLoc(bps.get(0));
			for (int x = 1; x < bps.size(); x++)
			{
				if (getColorOfLoc(bps.get(x)).equals(myfbpclr));
				else return false;
			}
			return true;
		}
	}
	
	public static boolean areAllBishopsOnSameColorSquare(ArrayList<ChessPiece> allpcs)
	{
		return areAllOfTypeOnSameColorSquare("BISHOP", allpcs);
	}
	public static boolean areAllBishopsOnSameColorSquare(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return areAllBishopsOnSameColorSquare(combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	public static boolean areAllBishopsOnSameColorSquare(int gid)
	{
		return areAllBishopsOnSameColorSquare(getAllPiecesWithGameID(gid));
	}
	public boolean areAllBishopsOnSameColorSquare()
	{
		return areAllBishopsOnSameColorSquare(getGameID());
	}
	
	public static boolean isAutoStalemate(ArrayList<ChessPiece> allpcs)
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
		
		ArrayList<ChessPiece> wpcs = getCurrentSidePieces("WHITE", allpcs);
		ArrayList<ChessPiece> bpcs = getCurrentSidePieces("BLACK", allpcs);
		String[] wpcstps = getPieceTypes(wpcs);
		String[] bpcstps = getPieceTypes(bpcs);
		//king, queen, castle (rook), bishop, knight, pawn
		int[] wpccnts = getCountsForEachPieceTypeForASide(wpcstps);
		int[] bpccnts = getCountsForEachPieceTypeForASide(bpcstps);
		int numwkgs = getCountForPieceTypeForASide(wpccnts, "KING");
		int numbkgs = getCountForPieceTypeForASide(bpccnts, "KING");
		int numwbps = getCountForPieceTypeForASide(wpccnts, "BISHOP");
		int numbbps = getCountForPieceTypeForASide(bpccnts, "BISHOP");
		int numwcs = getCountForPieceTypeForASide(wpccnts, "CASTLE");
		int numbcs = getCountForPieceTypeForASide(bpccnts, "CASTLE");
		int numwqs = getCountForPieceTypeForASide(wpccnts, "QUEEN");
		int numbqs = getCountForPieceTypeForASide(bpccnts, "QUEEN");
		int numwkts = getCountForPieceTypeForASide(wpccnts, "KNIGHT");
		int numbkts = getCountForPieceTypeForASide(bpccnts, "KNIGHT");
		int numwps = getCountForPieceTypeForASide(wpccnts, "PAWN");
		int numbps = getCountForPieceTypeForASide(bpccnts, "PAWN");
		if (numwkgs == 1 && numbkgs == 1);
		else throw new IllegalStateException("invalid number of kings on the board!");
		//if there is a castle, a pawn, or a queen on the board: not an automatic stalemate
		if (0 < numwqs || 0 < numbqs || 0 < numwps || 0 < numbps || 0 < numwcs || 0 < numbcs) return false;
		//else;//do nothing this might be an automatic stalemate
		//is king vs king -> yes
		boolean kgvskg = (numwkgs == 1 && numbkgs == 1 && numwbps < 1 && numbbps < 1 && numwcs < 1 && numbcs < 1 &&
			numwqs < 1 && numbqs < 1 && numwkts < 1 && numbkts < 1 && numwps < 1 && numbps < 1);
		if (kgvskg) return true;
		//is king vs king and knight -> yes
		boolean kgvskgandkt = (numwkgs == 1 && numbkgs == 1 && ((numwkts == 1 && numbkts < 1) ||
			(numbkts == 1 && numwkts < 1)) && numwps < 1 && numbps < 1 && numwqs < 1 && numbqs < 1 && numwbps < 1 &&
			numbbps < 1 && numwcs < 1 && numbcs < 1);
		if (kgvskgandkt) return true;
		//king and any number of bishops vs king and any number of bishops provided all bishops are on same color square
		boolean kgsandbps = (numwkgs == 1 && numbkgs == 1 && numwcs < 1 && numbcs < 1 && numwqs < 1 && numbqs < 1 &&
			numwps < 1 && numbps < 1 && numwkts < 1 && numbkts < 1);
		if (kgsandbps && areAllBishopsOnSameColorSquare(allpcs)) return true;
		else return false;
	}
	public static boolean isAutoStalemate(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isAutoStalemate(combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid));
	}
	
	//can an entire side not move
	public static boolean doesSideHaveNoLegalMoves(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		ArrayList<ChessPiece> fpcs = getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false);
		//System.out.println("fpcs = " + fpcs);
		
		ArrayList<ChessPiece> myclrfpcs = filterListByColor(fpcs, clrval);
		//System.out.println("myclrfpcs = " + myclrfpcs);
		
		if (getNumItemsInList(myclrfpcs) < 1)
		{
			System.out.println("" + clrval + " HAS NO FREE PIECES! IT HAS NO LEGAL MOVES IT CAN MAKE! STALEMATE!");
			return true;
		}
		else return false;
	}
	public static boolean doesWhiteHaveNoLegalMoves(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return doesSideHaveNoLegalMoves("WHITE", ignorelist, addpcs, gid);
	}
	public static boolean doesBlackHaveNoLegalMoves(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return doesSideHaveNoLegalMoves("BLACK", ignorelist, addpcs, gid);
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
	public static boolean canSideCaptureAPieceIfEnemyStaysSame(String sideclrtomv, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		//if we can move to an enemy piece's square then yes a capture is possible
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible and not a stalemate.
		
		ArrayList<ChessPiece> myfpcs = filterListByColor(
			getPiecesThatAreFreeToMove(ignorelist, addpcs, gid, true, false), sideclrtomv);
		int numfpcs = getNumItemsInList(myfpcs);
		if (numfpcs < 1)
		{
			//System.out.println("sideclrtomv = " + sideclrtomv);
			//throw new IllegalStateException("the side has legal moves, that means that there is at least one piece " +
			//	"that is free, but none were found!");
			return false;
		}
		//else;//do nothing
		
		ArrayList<ChessPiece> allepcs = getOpposingSidePieces(sideclrtomv, gid, ignorelist, addpcs);
		int[][] epclocs = getLocsFromPieceList(allepcs);
		//printLocsArray(epclocs, "epclocs");
		//System.out.println();
		//System.out.println("MY SIDE PIECES CAN MOVE TO:");
		for (int x = 0; x < numfpcs; x++)
		{
			int[][] allpossiblemvlocsforpc = myfpcs.get(x).getAllLocsThatCanBeReachedByPiece(ignorelist, addpcs);
			//System.out.println("myfpcs.get(" + x + ") = " + myfpcs.get(x));
			//printLocsArray(allpossiblemvlocsforpc, "allpossiblemvlocsforpc");
			if (allpossiblemvlocsforpc == null || allpossiblemvlocsforpc.length < 2)
			{
				throw new IllegalStateException("the piece was free meaning it has more than one location " +
					"it can move to, but now it claims it cannot move!");
			}
			else
			{
				for (int r = 0; r < allpossiblemvlocsforpc.length; r++)
				{
					for (int c = 0; c < epclocs.length; c++)
					{
						if (allpossiblemvlocsforpc[r][0] == epclocs[c][0] &&
							allpossiblemvlocsforpc[r][0] == epclocs[c][1])
						{
							//it is possible to kill an enemy piece, therefore not a stalemate
							//System.out.println("A MATCH IS FOUND!");
							return true;
						}
						//else;//do nothing
					}//end of c for loop
				}//end of r for loop
			}
		}//end of x for loop
		//System.out.println("NO MATCHES FOUND!");
		return false;
	}
	
	//this asks is a capture possible starting with the given color, then it uses the opposite color
	//white is passed in by default for the color, so white then black or black then white
	public static boolean canASideCaptureAPieceIfEnemyStaysSame(String sideclrtomv, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return (canSideCaptureAPieceIfEnemyStaysSame(sideclrtomv, ignorelist, addpcs, gid) ||
			canSideCaptureAPieceIfEnemyStaysSame(getOppositeColor(sideclrtomv), ignorelist, addpcs, gid));
	}
	public static boolean canASideCaptureAPieceIfEnemyStaysSame(int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return canASideCaptureAPieceIfEnemyStaysSame("WHITE", ignorelist, addpcs, gid);
	}
	
	//this asks is it possible for both sides to move to a common location (this assumes that both sides move)
	public static boolean isACapturePossible(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		int[][] wmvlocs = getAllLocsThatCanBeReachedBySide("WHITE", ignorelist, addpcs, gid);
		//printLocsArray(wmvlocs, "wmvlocs");
		int[][] bmvlocs = getAllLocsThatCanBeReachedBySide("BLACK", ignorelist, addpcs, gid);
		//printLocsArray(bmvlocs, "bmvlocs");
		if (wmvlocs == null || wmvlocs.length < 1 || bmvlocs == null || bmvlocs.length < 1) return true;//not sure
		//else;//do nothing
		for (int x = 0; x < wmvlocs.length; x++)
		{
			for (int c = 0; c < bmvlocs.length; c++)
			{
				if (wmvlocs[x][0] == bmvlocs[c][0] &&
					wmvlocs[x][1] == bmvlocs[c][1])
				{
					//System.out.println("THE FIRST CAPTURE LOC FOUND IS: " +
					//	getLocStringAndConvertIt(wmvlocs[x][0], wmvlocs[x][1]));
					return true;
				}
				//else;//do nothing
			}
		}
		return false;
	}
	
	
	//MAIN STALEMATE METHODS
	
	//is stalemate side's color's turn to move
	public static boolean isStalemate(String sideclrtomv, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		//checks to see if both sides are in check starting with the color given then it will check the opposite color
		if (isASideInCheck(sideclrtomv, ignorelist, addpcs, gid))
		{
			System.out.println("ONE SIDE IS IN CHECK! SO NO STALEMATE!");
			return false;
		}
		//else;//do nothing
		System.out.println("NO SIDE IS IN CHECK!");
		
		if (isAutoStalemate(ignorelist, addpcs, gid) ||
			doesSideHaveNoLegalMoves(sideclrtomv, ignorelist, addpcs, gid))
		{
			System.out.println("EITHER THERE ARE NOT ENOUGH PIECES OR THE SIDE WHO IS SUPPOSED TO MOVE CANNOT! " +
				"SO STALEMATE!");
			return true;
		}
		//else;//do nothing
		System.out.println("THERE ARE ENOUGH PIECES ON THE BOARD! A CAPTURE MIGHT BE POSSIBLE!");
		
		//if it is not possible to make a capture, then the game cannot end in checkmate -> yes it is a stalemate
		//we need to take our free pieces for a side and see if they can make a capture
		//we can do this by checking where each piece can possibly move to
		//if enemy pieces reside at at least one location a capture is possible and not a stalemate.
		
		boolean cppossiblebmvs = isACapturePossible(ignorelist, addpcs, gid);
		//System.out.println("IS A CAPTURE POSSIBLE: " + cppossiblebmvs);
		
		if (cppossiblebmvs || canASideCaptureAPieceIfEnemyStaysSame(sideclrtomv, ignorelist, addpcs, gid))
		{
			System.out.println("IT IS POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE!");
			
			//IF THIS IS THE LAST MOVE IN A COMPLETED GAME AND THE GAME ENDED IN A TIE OR DRAW THEN -> yes
			//OTHERWISE -> no
			//System.out.println("getGame(gid).isCompleted() = " + getGame(gid).isCompleted());
			//System.out.println("getGame(gid).isTied() = " + getGame(gid).isTied());
			//System.out.println("getGame(gid).isLastMove() = " + getGame(gid).isLastMove());
			
			if (getGame(gid).isCompleted() && getGame(gid).isTied() && getGame(gid).isLastMove()) return true;
			else return false;
		}
		else
		{
			System.out.println("IT IS NOT POSSIBLE FOR ONE SIDE TO MAKE A CAPTURE SO STALEMATE!");
			return true;//cannot capture an enemy piece -> stalemate
		}
	}
	public static boolean isStalemateWhite(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isStalemate("WHITE", ignorelist, addpcs, gid);
	}
	public static boolean isStalemateBlack(int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return isStalemate("BLACK", ignorelist, addpcs, gid);
	}
	
	
	//SERVER METHODS
	
	public static boolean isDigit(String wd)
	{
		if (wd == null || wd.length() != 1) return false;
		
		String dgts = "0123456789";
		boolean isdgt = false;
		for (int di = 0; di < dgts.length(); di++)
		{
			if (wd.charAt(0) == dgts.charAt(di))
			{
				return true;
			}
			//else;//do nothing
		}
		return false;
	}
	
	//numei is inclusive
	public static int[] getNumStartAndEndIndexs(String wd, int offset)
	{
		if (offset < 0) throw new IllegalStateException("offset MUST BE AT LEAST ZERO (0)!");
		//else;//do nothing
		int numsi = -1;
		int numei = -1;
		int[] res = new int[2];
		res[0] = -1;
		res[1] = -1;
		for (int i = 0; i < wd.length(); i++)
		{
			if (isDigit("" + wd.charAt(i)))
			{
				numsi = i;
				break;
			}
			//else;//do nothing
		}
		if (numsi < 0 || wd.length() - 1 < numsi) return res;
		for (int i = numsi; i < wd.length(); i++)
		{
			if (isDigit("" + wd.charAt(i)))
			{
				if (i + 1 < wd.length());
				else if (i + 1 == wd.length())
				{
					numei = wd.length() - 1;
					break;
				}
				else throw new IllegalStateException("ILLEGAL VALUE FOUND AND USED HERE FOR DIGIT INDEX I!");
			}
			else
			{
				numei = i - 1;
				break;
			}
		}
		if (numei < 0 || numei < numsi || wd.length() - 1 < numei)
		{
			throw new IllegalStateException("END NUMBER INDEX NOT SET CORRECTLY!");
		}
		//else;//do nothing
		res[0] = numsi + offset;
		res[1] = numei + offset;
		return res;
	}
	
	public static boolean isANumber(String wd)
	{
		if (wd == null || wd.length() < 1) return false;
		else
		{
			for (int i = 0; i < wd.length(); i++)
			{
				if (isDigit("" + wd.charAt(i)));
				else return false;
			}
			return true;
		}
	}
	
	public static String getShortHandNotationForWord(String wd)
	{
		if (wd == null || wd.length() < 1) return wd;
		else
		{
			String[] myspcs = {" ", "\t", "\n"};
			for (int i = 0; i < wd.length(); i++)
			{
				if (itemIsOnGivenList("" + wd.charAt(i), myspcs))
				{
					throw new IllegalStateException("THE WORD (" + wd +
						") MUST NOT HAVE SPACING CHARACTERS ON IT, BUT IT DID!");
				}
				//else;//do nothing
			}
			if (wd.equals("CREATE")) return "+";
			else if (wd.equals("DELETE")) return "-";
			else if (wd.equals("HINTS")) return "HINTS";
			else if (itemIsOnGivenList(wd, validTypes)) return getShortHandType(wd);
			else if (itemIsOnGivenList(wd, validColors)) return getShortHandColor(wd);
			else if (itemIsOnGivenList(wd.substring(0, wd.length() - 1), validTypes))
			{
				return getShortHandType(wd.substring(0, wd.length() - 1)) + wd.charAt(wd.length() - 1);
			}
			else if (itemIsOnGivenList(wd.substring(0, wd.length() - 1), validColors))
			{
				return getShortHandColor(wd.substring(0, wd.length() - 1)) + wd.charAt(wd.length() - 1);
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
			else if (isANumber(wd)) return wd;
			else
			{
				System.out.println("wd = " + wd);
				System.out.println("NOT SURE WHAT TO DO HERE!");
				return "";
			}
		}
	}
	//converts the location to string loc
	public static String[] getShortHandMoves(String[] mvs)
	{
		if (mvs == null || mvs.length < 1) return mvs;
		else
		{
			String[] nwmvs = new String[mvs.length];
			for (int c = 0; c < mvs.length; c++)
			{
				String oldmv = "" + mvs[c];
				String nwmv = "";
				int si = 0;
				boolean addstraight = false;
				for (int i = 0; i < oldmv.length(); i++)
				{
					if (oldmv.charAt(i) == ' ' || i + 1 == oldmv.length())
					{
						if (addstraight)
						{
							//System.out.println("HANDLE ADD STRAIGHT HERE:");
							if (i + 1 == oldmv.length()) nwmv += "" + oldmv.substring(si + 1);
							else nwmv += "" + oldmv.substring(si + 1, i);
							addstraight = false;
						}
						else
						{
							if (i + 1 == oldmv.length()) nwmv += "" + getShortHandNotationForWord(oldmv.substring(si));
							else nwmv += "" + getShortHandNotationForWord(oldmv.substring(si, i));
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
						//System.out.println("AT: FOUND!");
						//System.out.println("si = " + si);
					}
					else if (0 < i && oldmv.charAt(i - 1) == ' ' && (oldmv.charAt(i) == 't' ||  oldmv.charAt(i) == 't') &&
						(oldmv.charAt(i + 1) == 'o' || oldmv.charAt(i + 1) == 'O') && oldmv.charAt(i + 2) == ':' &&
						oldmv.charAt(i + 3) == ' ' && oldmv.charAt(i + 4) != '(')
					{
						si = i + 3;
						addstraight = true;
						i = i + 4;
						//System.out.println("TO: FOUND!");
						//System.out.println("si = " + si);
						nwmv += "TO";
					}
					else if (0 < i && oldmv.charAt(i) == '(')
					{
						if (oldmv.charAt(i + 1) == 's');
						else
						{
							int cpi = -1;
							for (int k = i + 1; k < oldmv.length(); k++)
							{
								if (oldmv.charAt(k) == ')')
								{
									cpi = k;
									break;
								}
								//else;//do nothing
							}
							if (cpi < 0 || cpi < i + 1 || oldmv.length() - 1 < cpi)
							{
								throw new IllegalStateException("ILLEGAL INDEX (" + cpi +
									") FOUND AND USED FOR THE CLOSING PARENTHESIS INDEX!");
							}
							//else;//do nothing
							int myr = -1;
							int myc = -1;
							//get the numstartindex and numendindex
							//System.out.println("oldmv = " + oldmv);
							//System.out.println("oldmv.substring(" + i + ", " + cpi + ") = " + oldmv.substring(i, cpi));
							
							int[] snumsieis = getNumStartAndEndIndexs(oldmv.substring(i, cpi), i);
							//System.out.println("snumsieis[0] = " + snumsieis[0]);
							//System.out.println("snumsieis[1] = " + snumsieis[1]);
							
							myr = Integer.parseInt(oldmv.substring(snumsieis[0], snumsieis[1] + 1));
							int[] enumsieis = getNumStartAndEndIndexs(oldmv.substring(snumsieis[1] + 1, cpi),
								snumsieis[1] + 1);
							//System.out.println("enumsieis[0] = " + enumsieis[0]);
							//System.out.println("enumsieis[1] = " + enumsieis[1]);
							
							myc = Integer.parseInt(oldmv.substring(enumsieis[0], enumsieis[1] + 1));
							//System.out.println("myr = " + myr);
							//System.out.println("myc = " + myc);
							
							nwmv += convertRowColToStringLoc(myr, myc, WHITE_MOVES_DOWN_RANKS);
							i = cpi;
							si = cpi + 1;
						}
					}
					//else;//do nothing
				}//end of i for loop
				System.out.println("oldmv = " + oldmv);
				System.out.println("nwmv = " + nwmv);
				nwmvs[c] = "" + nwmv;
			}//end of c for loop
			return nwmvs;
		}
	}
	
	public static String convertShortHandMoveToLongVersion(String mv)
	{
		if (mv == null || mv.length() < 1) throw new IllegalStateException("mv must not be empty or null!");
		//else;//do nothing
		
		System.out.println("mv = " + mv);
		
		String nwmv = "";
		if (mv.charAt(0) == '-') nwmv += "DELETE ";
		else if (mv.charAt(0) == '+') nwmv += "CREATE ";
		else if (mv.charAt(0) == 'W') nwmv += "WHITE ";
		else if (mv.charAt(0) == 'B') nwmv += "BLACK ";
		else if (mv.charAt(0) == 'T') nwmv += "TURN ";
		else if (mv.charAt(0) == 'S') nwmv += "SET ";
		else if (mv.indexOf("UNDO") == 0)
		{
			String retstr = "UNDO " + convertShortHandMoveToLongVersion(mv.substring(4));
			System.out.println("nwmv = " + retstr);
			return retstr;
		}
		else throw new IllegalStateException("ILLEGAL STARTING CHARACTER FOR THE MOVE!");
		//System.out.println("OLD nwmv = " + nwmv);
		
		String shtp = null;
		int ei = -1;
		boolean usetpat = true;
		if (mv.charAt(0) == '-' || mv.charAt(0) == '+' || mv.charAt(0) == 'T' || mv.charAt(0) == 'S')
		{
			//next will be color
			if (mv.charAt(1) == 'W') nwmv += "WHITE ";
			else if (mv.charAt(1) == 'B') nwmv += "BLACK ";
			else throw new IllegalStateException("ILLEGAL SECOND CHARACTER FOR THE MOVE!");
			
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
		if (mv.length() == 5)
		{
			nwmv += getLongHandType(shtp) + mv.substring(ei);
			//System.out.print("FINAL ");
			System.out.println("nwmv = " + nwmv);
			return "" + nwmv;
		}
		else if (usetpat) nwmv += getLongHandType(shtp) + " at: " + mv.substring(ei, ei + 2) + " ";
		else nwmv += " WANTS TIE: " + mv.charAt(mv.length() - 1);
		//System.out.println("NEW nwmv = " + nwmv);
		if (usetpat)
		{
			//System.out.println("mv.charAt(ei + 2=" + (ei + 2) + ") = " + mv.charAt(ei + 2));
			//System.out.println("mv.substring(ei + 6) = " + mv.substring(ei + 6));
			
			//mv.substring(ei + 2, ei + 4)
			if (mv.charAt(ei + 2) == 'T') nwmv += "to: " + mv.substring(ei + 4);
			else if (mv.charAt(ei + 2) == 'W') nwmv += "with " + mv.substring(ei + 3, mv.length() - 2) + " move(s)!";
			else if (mv.charAt(ei + 2) == 'I') nwmv += "into: " + getLongHandType(mv.substring(ei + 6)); 
			else
			{
				throw new IllegalStateException("ILLEGAL CHARACTER FOUND AT POSITION FAILED TO CONVERT SHORT HAND " +
					"MOVE TO LONG HAND VERSION!");
			}
		}
		//else;//do nothing for set tie command
		
		//System.out.print("FINAL ");
		System.out.println("nwmv = " + nwmv);
		return "" + nwmv;
	}
	public static String[] convertAllShortHandMovesToLongVersion(String[] mvs)
	{
		if (mvs == null || mvs.length < 1) return mvs;
		else
		{
			String[] nwmvs = new String[mvs.length];
			for (int x = 0; x < mvs.length; x++)
			{
				nwmvs[x] = convertShortHandMoveToLongVersion(mvs[x]);
			}
			return nwmvs;
		}
	}
	
	
	//GEN-MOVETO METHODS
	
	//INDIVIDUAL MOVE TO COMMANDS (MOVETO, CASTLING, PAWNING, CREATE OR DELETE, HINTS, PROMOTION, RESIGNATION, TIEDESIRE)
	
	//CMD_TYPE COLOR TYPE at: LOC_STRING with NUM move(s)!
	public static String genLongOrShortHandDeleteOrCreateCommand(String clr, String tp, int r, int c, int mvscnt,
		boolean usecreate, boolean useshort)
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
		if (useshort) myclr = getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = getShortHandType(tp);
		else mytp = "" + tp + " at: ";
		String mymvscntstr = null;
		if (useshort) mymvscntstr = "W" + mvscnt + "MS";
		else mymvscntstr = " with " + mvscnt + " move(s)!";
		String cmd = "" + bgstr + myclr + mytp + convertRowColToStringLoc(r, c, WHITE_MOVES_DOWN_RANKS) + mymvscntstr;
		return cmd;
	}
	public static String genLongOrShortHandCreateCommand(String clr, String tp, int r, int c, int mvscnt, boolean useshort)
	{
		return genLongOrShortHandDeleteOrCreateCommand(clr, tp, r, c, mvscnt, true, useshort);
	}
	public static String genLongOrShortHandDeleteCommand(ChessPiece cp, String errmsg, boolean throwerr, boolean useshort)
	{
		if (cp == null)
		{
			if (throwerr)
			{
				if (errmsg == null || errmsg.length() < 1)
				{
					throw new IllegalStateException("the piece must not be null!");
				}
				else throw new IllegalStateException(errmsg);
			}
			else return null;
		}
		else
		{
			return genLongOrShortHandDeleteOrCreateCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(),
				cp.getMoveCount(), false, useshort);
		}
	}
	
	//COLOR TYPE at: START_LOC_STRING to: END_LOC_STRING
	public static String genLongOrShortHandMoveCommandOnlyString(String clr, String tp, int cr, int cc, int nr, int nc,
		boolean usedir, boolean useleft, boolean useshort)
	{
		String myclr = null;
		if (useshort) myclr = getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = getShortHandType(tp);
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
			convertRowColToStringLoc(cr, cc, WHITE_MOVES_DOWN_RANKS) + transolocstr +
			convertRowColToStringLoc(nr, nc, WHITE_MOVES_DOWN_RANKS);
		return cmd;
	}
	public static String genLongOrShortHandMoveCommandOnlyString(ChessPiece cp, int nr, int nc, boolean usedir,
		boolean useleft, String errmsg, boolean throwerr, boolean useshort)
	{
		if (cp == null)
		{
			if (throwerr)
			{
				if (errmsg == null || errmsg.length() < 1)
				{
					throw new IllegalStateException("the chess piece must not be null!");
				}
				else throw new IllegalStateException(errmsg);
			}
			else return null;
		}
		else
		{
			return genLongOrShortHandMoveCommandOnlyString(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nr, nc,
				usedir, useleft, useshort);
		}
	}
	
	//TURN PAWN at: LOC_STRING into: NEW_TYPE
	public static String genLongOrShortHandPawnPromotionCommand(String clr, int nr, int nc, String ptpval, boolean useshort)
	{
		String[] myvptps = {"QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"};
		String myctpval = null;
		if (itemIsOnGivenList(ptpval, myvptps))
		{
			if (ptpval.equals("ROOK")) myctpval = "CASTLE";
			else myctpval = "" + ptpval;
		}
		else throw new IllegalStateException("CANNOT PROMOTE A PAWN TO GIVEN TYPE (" + ptpval + ")!");
		
		String fpart = null;
		if (useshort) fpart = "T";
		else fpart = "TURN ";
		String myclr = null;
		if (useshort) myclr = getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String mytp = null;
		if (useshort) mytp = "PN";
		else mytp = "PAWN at: ";
		String lpart = null;
		if (useshort) lpart = "INTO";
		else lpart = " into: ";
		String propwncmd = fpart + myclr + mytp + convertRowColToStringLoc(nr, nc, WHITE_MOVES_DOWN_RANKS) + lpart + myctpval;
		return propwncmd;
	}
	
	//COLOR HINTS
	//COLOR TYPE at: LOC_STRING HINTS
	public static String genLongOrShortHandHintsCommandForPieceOrSide(String clr, String tp, int cr, int cc,
		boolean useside, boolean useshort)
	{
		String myclr = null;
		if (useshort) myclr = getShortHandColor(clr);
		else myclr = "" + clr + " ";
		String myhtsstr = null;
		if (useshort) myhtsstr = "HINTS";
		else myhtsstr = " HINTS";
		String cmd = null;
		if (useside) cmd = "" + myclr + myhtsstr;
		else
		{
			String mytp = null;
			if (useshort) mytp = getShortHandType(tp);
			else mytp = "" + tp + " at: ";
			cmd = "" + myclr + mytp + convertRowColToStringLoc(cr, cc, WHITE_MOVES_DOWN_RANKS) + myhtsstr;
		}
		return cmd;
	}
	
	//COLOR RESIGNS
	public static String genLongOrShortHandResignCommand(String clr, boolean useshort)
	{
		//WHITE RESIGNS
		//BLACK RESIGNS
		//WRESIGNS
		//BRESIGNS
		//0123456789012
		//0         1
		String myclr = null;
		if (useshort) myclr = getShortHandColor(clr);
		else myclr = "" + clr + " ";
		return "" + myclr + "RESIGNS";
		//return "" + myclr + "SURRENDERS";
	}
	
	//SET COLOR WANTS TIE: VALUE
	public static String genLongOrShortHandTieDesireCommand(String clr, boolean val, boolean useshort)
	{
		String myclr = null;
		if (useshort) myclr = getShortHandColor(clr);
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
	public static String[] genPawningMoveToCommand(String clr, int crval, int ccval, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean bpassimnxtmv)
	{
		//PAWNING NOTATION
		//WHITE LEFT PAWN at: current_loc to: next_loc
		//-BPN??W?MVS (CAN BE DONE AFTER, BUT SHOULD NOT BE)
		//WLPNB4TOA3 (DISPLAY TO THE USER)
		//
		
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mpc = getPieceAt(crval, ccval, allpcs);
		
		final boolean useleft = (ncval < ccval);
		
		//make sure we can do this otherwise error out
		if (mpc.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
		else throw new IllegalStateException("" + mpc + " CANNOT MOVE TO " + getLocString(nrval, ncval) + "!");
		
		//if command involves adding or removing a piece we need to include that here...
		ChessPiece epc = mpc.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
		final boolean useshort = false;
		String delcmd = genLongOrShortHandDeleteCommand(epc, "the enemy pawn must not be null!", true, useshort);
		String cmd = genLongOrShortHandMoveCommandOnlyString(clr, "PAWN", crval, ccval, nrval, ncval, true,
			useleft, useshort);
		System.out.println("cmd = " + cmd);
		String[] mvcmd = new String[2];
		mvcmd[0] = "" + delcmd;
		mvcmd[1] = "" + cmd;
		return getShortHandMoves(mvcmd);
	}
	
	//COLOR DIR_STRING CASTLE:
	//COLOR CASTLE at: START_LOC_STRING to: END_LOC_STRING
	//COLOR KING at: START_LOC_STRING to: END_LOC_STRING
	public static String[] genCastlingMoveToCommand(String clr, boolean useleft, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//WHITE LEFT CASTLE *** USE THIS NOTATION BECAUSE WE CAN GENERATE THE OTHERS
		//WLCE: (DISPLAY TO USER ONLY)
		//WCEA8TOD8
		//WKGE8TOC8
		String dirstr = null;
		if (useleft) dirstr = "LEFT";
		else dirstr = "RIGHT";
		if (canSideCastleLeftOrRight(useleft, clr, ignorelist, addpcs, gid));
		else throw new IllegalStateException("" + clr + " CANNOT CASTLE " + dirstr + "!");
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mkg = getCurrentSideKing(clr, allpcs);
		int ncol = -1;
		if (useleft) ncol = 0;
		else ncol = 7;
		ChessPiece clcp = getPieceAt(mkg.getRow(), ncol, allpcs);
		int[] ncloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, clr, ignorelist, addpcs, gid);
		final boolean useshort = false;
		String ccmvcmd = genLongOrShortHandMoveCommandOnlyString(clr, "CASTLE", clcp.getRow(), clcp.getCol(),
			ncloc[0], ncloc[1], false, false, useshort);//usedir, useleft, useshort
		System.out.println("ccmvcmd = " + ccmvcmd);
		int[] nkgloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, clr, ignorelist, addpcs, gid);
		String kgmvcmd = genLongOrShortHandMoveCommandOnlyString(clr, "KING", mkg.getRow(), mkg.getCol(),
			nkgloc[0], nkgloc[1], false, false, useshort);//usedir, useleft, useshort
		System.out.println("kgmvcmd = " + kgmvcmd);
		String[] mvcmd = new String[3];
		mvcmd[0] = "" + clr + " " + dirstr + " CASTLE:";
		mvcmd[1] = "" + ccmvcmd;
		mvcmd[2] = "" + kgmvcmd;
		return getShortHandMoves(mvcmd);
	}
	
	
	//MAIN HINT METHODS SIMILAR TO GEN MOVE TO
	
	//result array will only have one item on it
	public static String[] genHintsCommandForPiece(String clr, String tp, int crval, int ccval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		//HINTS NOTATION:
		//COLOR TYPE at: STRINGLOC HINTS
		//WPNA5HINTS
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		ChessPiece mpc = getPieceAt(crval, ccval, allpcs);
		if (mpc == null) throw new IllegalStateException("there must be a piece at the location!");
		else
		{
			if (mpc.getColor().equals(clr) && mpc.getType().equals(tp));
			else throw new IllegalStateException("piece obtained does not match the color and-or the type!");
		}
		String cmd = genLongOrShortHandHintsCommandForPieceOrSide(clr, tp, crval, ccval, false, false);
		System.out.println("cmd = " + cmd);
		String[] htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return getShortHandMoves(htscmd);
	}
	public static String[] genHintsCommandForPiece(String clr, String tp, int[] loc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (loc == null || loc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		else return genHintsCommandForPiece(clr, tp, loc[0], loc[1], gid, ignorelist, addpcs);
	}
	public static String[] genHintsCommandForPiece(ChessPiece cp, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genHintsCommandForPiece(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), cp.getGameID(),
			ignorelist, addpcs);
	}
	public String[] genHintsCommandForPiece(int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genHintsCommandForPiece(this, ignorelist, addpcs);
	}
	public String[] genHintsCommandForPiece()
	{
		return genHintsCommandForPiece(null, null);
	}
	
	//result array will only have one item on it
	public static String[] genHintsCommandForSide(String clr)
	{
		String cmd = genLongOrShortHandHintsCommandForPieceOrSide(clr, null, -1, -1, true, false);
		System.out.println("cmd = " + cmd);
		String[] htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return getShortHandMoves(htscmd);
	}
	public static String[] genHintsCommandForWhite()
	{
		return genHintsCommandForSide("WHITE");
	}
	public static String[] genHintsCommandForBlack()
	{
		return genHintsCommandForSide("BLACK");
	}
	public String[] genHintsCommandForSide()
	{
		return genHintsCommandForSide(getColor());
	}
	
	//result array will only have one item on it
	public static String[] getFullResignationCommand(String clr)
	{
		String cmd = genLongOrShortHandResignCommand(clr, false);
		System.out.println("cmd = " + cmd);
		String[] htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return getShortHandMoves(htscmd);
	}
	
	//result array will only have one item on it
	public static String[] getFullTieCommand(String clr, boolean val, boolean useshort)
	{
		String cmd = genLongOrShortHandTieDesireCommand(clr, val, useshort);
		System.out.println("cmd = " + cmd);
		String[] htscmd = new String[1];
		htscmd[0] = "" + cmd;
		return getShortHandMoves(htscmd);
	}
	
	
	//COMMAND TYPE METHODS
	
	public static String getTypeOfMoveCommand(String usrcmd)
	{
		if (usrcmd == null || usrcmd.length() < 2)
		{
			throw new IllegalStateException("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
		}
		//else;//do nothing
		if (usrcmd.charAt(0) == '+') return "CREATE";
		else if (usrcmd.charAt(0) == '-') return "DELETE";
		else if (usrcmd.charAt(0) == 'S') return "TIEDESIRE";
		else if (0 < usrcmd.indexOf("RESIGNS") && usrcmd.indexOf("RESIGNS") < usrcmd.length() &&
			(usrcmd.length() == 8 || usrcmd.length() == 13))
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
		else throw new IllegalStateException("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
	}
	
	public static String getOverallTypeOfCommand(String[] mycmd)
	{
		String[] tps = new String[mycmd.length];
		for (int x = 0; x < mycmd.length; x++) tps[x] = getTypeOfMoveCommand(mycmd[x]);
		String[] mysmtps = {"CASTLEING", "PAWNING", "PROMOTION", "HINTS", "RESIGN", "TIEDESIRE"};
		for (int x = 0; x < mycmd.length; x++)
		{
			if (itemIsOnGivenList(tps[x], mysmtps)) return "" + tps[x];
			//else;//do nothing
		}
		for (int x = 0; x < mycmd.length; x++)
		{
			if (tps[x].equals("MOVE")) return "" + tps[x];
			//else;//do nothing
		}
		if (tps.length == 1) return "" + tps[0];
		else throw new IllegalStateException("ILLEGAL COMMAND TYPE FOUND AND USED HERE!");
	}
	
	public static String[] getMoveCommandTypes()
	{
		String[] mvtps = {"MOVE", "CASTLEING", "PAWNING", "PROMOTION"};
		return mvtps;
	}
	public static boolean isCommandTypeAMoveCommand(String cmdtp)
	{
		return itemIsOnGivenList(cmdtp, getMoveCommandTypes());
	}
	
	public static String[] getSideColorOrTypesForMoves(String[][] mymvs, boolean usecolor)
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
			String[] myclrs = new String[mymvs.length];
			String[] mytps = new String[mymvs.length];
			for (int n = 0; n < mymvs.length; n++)
			{
				mytps[n] = null;
				myclrs[n] = null;
				String[] mytpsforcmd = new String[mymvs[n].length];
				for (int x = 0; x < mymvs[n].length; x++) mytpsforcmd[x] = getTypeOfMoveCommand(mymvs[n][x]);
				boolean addedtp = false;
				int pci = -1;
				if (mytpsforcmd == null || mytpsforcmd.length < 1 || 3 < mytpsforcmd.length)
				{
					throw new IllegalStateException("the type was an illegal length!");
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
						for (int x = 0; x < mytpsforcmd.length; x++)
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
				
				int mvi = -1;
				if (addedtp) mvi = pci;
				else
				{
					//GIVEN TYPES OF STEPS FOR ONE MOVE COMMAND: DELETE MOVE PROMOTE -> WHAT IS THE OVERALL TYPE?
					//IT WILL NEVER BE DELETE. WE WILL USE PROMOTION OVER MOVE.
					for (int x = 0; x < mytpsforcmd.length; x++)
					{
						//System.out.println("mytpsforcmd[" + x + "] = " + mytpsforcmd[x]);
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
						for (int x = 0; x < mytpsforcmd.length; x++)
						{
							//System.out.println("mytpsforcmd[" + x + "] = " + mytpsforcmd[x]);
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
						else throw new IllegalStateException("AN INVALID TYPE OR INVALID COMMAND WAS FOUND HERE!");
					}
				}
				
				if (mytps[n] == null || mytps[n].length() < 1)
				{
					throw new IllegalStateException("the type must have already been set!");
				}
				else
				{
					//System.out.println("mytps[" + n + "] = " + mytps[n]);
					String[] clrzeroimytps = {"CASTLEING", "PAWNING", "HINTS", "MOVE", "RESIGN"};
					int clrci = -1;
					if (itemIsOnGivenList(mytps[n], clrzeroimytps)) clrci = 0;
					else clrci = 1;//promotion
					myclrs[n] = getLongHandColor("" + mymvs[n][mvi].charAt(clrci));
					//System.out.println("myclrs[" + n + "] = " + myclrs[n]);
				}
			}//end of n for loop
			if (usecolor) return myclrs;
			else return mytps;
		}
	}
	public static String[] getSideColorsForMoves(String[][] mymvs)
	{
		return getSideColorOrTypesForMoves(mymvs, true);
	}
	public static String[] getSideTypesForMoves(String[][] mymvs)
	{
		return getSideColorOrTypesForMoves(mymvs, false);
	}
	
	
	//MAIN GEN MOVE TO COMMAND METHODS
	
	public static String[] genMoveToCommand(String clr, String tp, int crval, int ccval, int nrval, int ncval, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv, String ptpval, boolean bpassimnxtmv)
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
		if (mpc == null) throw new IllegalStateException("there must be a piece at the location!");
		//cannot handle special moves if called with certain pieces it might recognize a special move is possible
		//to detect a special move, we need to get the generic move set, and the full move set, the difference is the
		//special set
		if (mpc.canMoveTo(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
		{
			if ((mpc.getType().equals("CASTLE") && usecslingasmv) ||
				mpc.isMoveToASpecialMove(nrval, ncval, ignorelist, addpcs, bpassimnxtmv))
			{
				System.out.println("MOVE IS A SPECIAL MOVE!");
				if (mpc.getType().equals("KING") || (mpc.getType().equals("CASTLE") && usecslingasmv))
				{
					System.out.println("WE ARE CASTLING!");
					
					boolean useleft = false;
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
					System.out.println("useleft = " + useleft);
					
					return genCastlingMoveToCommand(clr, useleft, gid, ignorelist, addpcs);
				}
				else if (mpc.getType().equals("PAWN"))
				{
					return genPawningMoveToCommand(clr, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, bpassimnxtmv);
				}
				else throw new IllegalStateException("THIS PIECE TYPE (" + mpc.getType() + ") HAS NO SPECIAL MOVES!");
			}
			//else;//do nothing safe to proceed
		}
		else throw new IllegalStateException("" + mpc + " CANNOT MOVE TO " + getLocString(nrval, ncval) + "!");
		boolean canpropawn = canPawnBePromotedAt(nrval, ncval, mpc.getColor(), mpc.getType());
		System.out.println("canpropawn = " + canpropawn);
		
		//if command involves adding or removing a piece we need to include that here...
		ChessPiece ecp = getPieceAt(nrval, ncval, allpcs);
		boolean usedelcmd = true;
		final boolean useshort = false;
		String delcmd = genLongOrShortHandDeleteCommand(ecp, null, false, useshort);
		if (delcmd == null) usedelcmd = false;
		//else;//do nothing
		String cmd = genLongOrShortHandMoveCommandOnlyString(clr, tp, crval, ccval, nrval, ncval, false, false, useshort);
		System.out.println("cmd = " + cmd);
		int mxcnt = 0;
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
		String[] mvcmd = new String[mxcnt];
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
	public static String[] genMoveToCommand(String clr, String tp, int crval, int ccval, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, false, ptpval, false);
	}
	public static String[] genMoveToCommand(String clr, String tp, int crval, int ccval, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(clr, tp, crval, ccval, nrval, ncval, gid, ignorelist, addpcs, false, "QUEEN", false);
	}
	public static String[] genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv, String ptpval)
	{
		if (cloc == null || cloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the current chess piece location!");
		}
		//else;//do nothing
		if (nloc == null || nloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		
		return genMoveToCommand(clr, tp, cloc[0], cloc[1], nloc[0], nloc[1], gid, ignorelist, addpcs,
			usecslingasmv, ptpval, false);
	}
	public static String[] genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(clr, tp, cloc, nloc, gid, ignorelist, addpcs, false, ptpval);
	}
	public static String[] genMoveToCommand(String clr, String tp, int[] cloc, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(clr, tp, cloc, nloc, gid, ignorelist, addpcs, false, "QUEEN");
	}
	public static String[] genMoveToCommand(ChessPiece cp, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv, String ptpval)
	{
		if (cp == null)
		{
			throw new IllegalStateException("You need to provide the current chess piece location and the new location!");
		}
		else
		{
			return genMoveToCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nrval, ncval,
				gid, ignorelist, addpcs, usecslingasmv, ptpval, false);
		}
	}
	public static String[] genMoveToCommand(ChessPiece cp, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public static String[] genMoveToCommand(ChessPiece cp, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, false, ptpval);
	}
	public static String[] genMoveToCommand(ChessPiece cp, int nrval, int ncval,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(cp, nrval, ncval, gid, ignorelist, addpcs, false, "QUEEN");
	}
	public static String[] genMoveToCommand(ChessPiece cp, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv, String ptpval)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		//else;//do nothing
		
		if (cp == null)
		{
			throw new IllegalStateException("You need to provide the current chess piece location and the new location!");
		}
		else
		{
			return genMoveToCommand(cp.getColor(), cp.getType(), cp.getRow(), cp.getCol(), nloc[0], nloc[1],
				gid, ignorelist, addpcs, usecslingasmv, ptpval, false);
		}
	}
	public static String[] genMoveToCommand(ChessPiece cp, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public static String[] genMoveToCommand(ChessPiece cp, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, false, ptpval);
	}
	public static String[] genMoveToCommand(ChessPiece cp, int[] nloc,
		int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(cp, nloc, gid, ignorelist, addpcs, false, "QUEEN");
	}
	//non-static version convenience method
	public String[] genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		boolean usecslingasmv, String ptpval)
	{
		if (nloc == null || nloc.length != 2)
		{
			throw new IllegalStateException("You need to provide the next chess piece location!");
		}
		else return genMoveToCommand(this, nloc, getGameID(), ignorelist, addpcs, usecslingasmv, ptpval);
	}
	public String[] genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean usecslingasmv)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public String[] genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs, String ptpval)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, false, ptpval);
	}
	public String[] genMoveToCommand(int[] nloc, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(nloc, ignorelist, addpcs, false, "QUEEN");
	}
	public String[] genMoveToCommand(int[] nloc, boolean usecslingasmv, String ptpval)
	{
		return genMoveToCommand(nloc, null, null, usecslingasmv, ptpval);
	}
	public String[] genMoveToCommand(int[] nloc, boolean usecslingasmv)
	{
		return genMoveToCommand(nloc, usecslingasmv, "QUEEN");
	}
	public String[] genMoveToCommand(int[] nloc, String ptpval)
	{
		return genMoveToCommand(nloc, false, ptpval);
	}
	public String[] genMoveToCommand(int[] nloc)
	{
		return genMoveToCommand(nloc, false, "QUEEN");
	}
	public String[] genMoveToCommand(int nrval, int ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		boolean usecslingasmv, String ptpval)
	{
		return genMoveToCommand(this, nrval, ncval, getGameID(), ignorelist, addpcs, usecslingasmv, ptpval);
	}
	public String[] genMoveToCommand(int nrval, int ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs,
		boolean usecslingasmv)
	{
		return genMoveToCommand(this, nrval, ncval, getGameID(), ignorelist, addpcs, usecslingasmv, "QUEEN");
	}
	public String[] genMoveToCommand(int nrval, int ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		return genMoveToCommand(nrval, ncval, ignorelist, addpcs, false);
	}
	public String[] genMoveToCommand(int nrval, int ncval, boolean usecslingasmv)
	{
		return genMoveToCommand(nrval, ncval, null, null, usecslingasmv);
	}
	public String[] genMoveToCommand(int nrval, int ncval)
	{
		return genMoveToCommand(nrval, ncval, false);
	}
	
	
	//UNDO OR REDO COMMANDS
	
	public static String genUndoMoveToCommandForMoveCommand(String mvcmdonly, boolean redoit)
	{
		if (mvcmdonly == null || mvcmdonly.length() < 9 || 10 < mvcmdonly.length())
		{
			throw new IllegalStateException("illegal move or pawning command found and used here!");
		}
		//else;//do nothing
		
		//add undo in front of it for starters
		//it will most likely be a move to command
		//might be pawning or changing types
		
		//PAWNING NOTATION
		//WCEA5TOA6 (MOVING)
		//WLPNB4TOA3 (PAWING)
		//0123456789
		int si = -1;
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
		if (cdelmvcmdonly == null || cdelmvcmdonly.length() < 10 || 12 < cdelmvcmdonly.length())
		{
			System.out.println("cdelmvcmdonly = " + cdelmvcmdonly);
			throw new IllegalStateException("illegal create or delete command found and used here!");
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
			System.out.println("cdelmvcmdonly = " + cdelmvcmdonly);
			throw new IllegalStateException("illegal create or delete command found and used here!");
		}
	}
	
	public static String genUndoMoveToCommandForPromotionCommand(String promvcmdonly, boolean redoit)
	{
		if (promvcmdonly == null)
		
		if (promvcmdonly == null || promvcmdonly.length() != 12)
		{
			System.out.println("promvcmdonly = " + promvcmdonly);
			if (promvcmdonly == null);
			else System.out.println("promvcmdonly.length() = " + promvcmdonly.length());
			throw new IllegalStateException("illegal promotion command found and used here!");
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
	
	public static String genUndoMoveToCommandForResignationCommand(String mvcmdonly, boolean redoit)
	{
		if (redoit) return "" + mvcmdonly;
		else return "UNDO" + mvcmdonly;
	}
	
	public static String genUndoMoveToCommandForTieDesireCommand(String mvcmdonly, boolean redoit)
	{
		String fpart = mvcmdonly.substring(0, mvcmdonly.length() - 1);
		String valstr = null;
		if (mvcmdonly.charAt(mvcmdonly.length() - 1) == '0') valstr = "1";
		else if (mvcmdonly.charAt(mvcmdonly.length() - 1) == '1') valstr = "0";
		else throw new IllegalStateException("invalid value found and used here!");
		return fpart + valstr;
	}
	
	//MAIN UNDO COMMAND METHODS
	
	public static String[] genUndoMoveToShortHandCommand(String[] mvcmd, boolean redoit, boolean remundo)
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
		
		String[] undomvs = new String[mvcmd.length];
		for (int x = 0; x < mvcmd.length; x++) System.out.println("mvcmd[" + x + "] = " + mvcmd[x]);
		if (redoit && remundo)
		{
			for (int x = 0; x < mvcmd.length; x++)
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
				for (int x = 0; x < mvcmd.length; x++)
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
			int sai = -1;
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
			throw new IllegalStateException("illegal number of commands found and used here! Everything must be " +
				"executed as one command!");
		}
		for (int x = 0; x < undomvs.length; x++) System.out.println("undomvs[" + x + "] = " + undomvs[x]);
		return undomvs;
	}
	public static String[] genUndoMoveToLongHandCommand(String[] mvcmd, boolean redoit, boolean remundo)
	{
		return convertAllShortHandMovesToLongVersion(genUndoMoveToShortHandCommand(
			getShortHandMoves(mvcmd), redoit, remundo));
	}
	public static String[] genUndoMoveToShortHandCommand(String[] mvcmd)
	{
		return genUndoMoveToShortHandCommand(mvcmd, false, false);
	}
	public static String[] genUndoMoveToLongHandCommand(String[] mvcmd)
	{
		return genUndoMoveToLongHandCommand(mvcmd, false, false);
	}
	//redo calls undo
	public static String[] genRedoMoveToLongHandCommand(String[] mvcmd)
	{
		return genUndoMoveToLongHandCommand(mvcmd, true, true);
	}
	public static String[] genRedoMoveToShortHandCommand(String[] mvcmd)
	{
		return genUndoMoveToShortHandCommand(mvcmd, true, true);
	}
	
	
	//GEN FULL MOVE COMMAND FROM DISPLAYED COMMAND METHODS
	
	//TAKES A SIMPLIFIED VERSION OF THE COMMAND AND FULLY EXPANDS IT TO INCLUDE ALL THE STEPS
	//RETURNS SHORTHAND VERSION ONLY
	
	//ONLY CONVERTS COMMANDS IN SHORT HAND NOTATION
	public static String[] genFullMoveCommandFromDisplayedCommand(String usrcmd, int gid, String ptpval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, boolean iswhitedown, boolean bpassimnxtmv)
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
		
		System.out.println("usrcmd = " + usrcmd);
		if (usrcmd.equals("UNDO"))
		{
			//get the unofficial move
			//if unofficial move is empty we want to take the last official move and make it unofficial
			//then take the unofficial move and generate the command to undo it...
			//then we need to generate the full undo commands
			//String[] myunmv = ChessPiece.genUndoMoveToShortHandCommand(mymv);
			return getGame(gid).genCommandToUndoLastMadeMove();
		}
		else if (usrcmd.equals("REDO"))
		{
			return getGame(gid).genCommandToRedoLastUndoneMove();
		}
		//else;//do nothing safe to proceed
		
		String cmdtp = getTypeOfMoveCommand(usrcmd);
		System.out.println("cmdtp = " + cmdtp);
		
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		if (cmdtp.equals("HINTS") || cmdtp.equals("CREATE") || cmdtp.equals("DELETE") || cmdtp.equals("PROMOTION"))
		{
			int si = -1;
			int ei = -1;
			String[] resstr = new String[1];
			if (cmdtp.equals("HINTS"))
			{
				if (usrcmd.length() == 6)
				{
					resstr[0] = "" + usrcmd;
					System.out.println("resstr[0] = " + resstr[0]);
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
			System.out.println("si = " + si);
			System.out.println("ei = " + ei);
			
			String slocstr = usrcmd.substring(si, ei);
			String nwusrcmd = null;
			System.out.println("OLD slocstr = " + slocstr);
			
			int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
			System.out.println("sloc[0] = " + sloc[0]);
			System.out.println("sloc[1] = " + sloc[1]);
			
			slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
			System.out.println("NEW slocstr = " + slocstr);
			
			nwusrcmd = usrcmd.substring(0, si) + slocstr + usrcmd.substring(ei);
			System.out.println("nwusrcmd = " + nwusrcmd);
			
			resstr[0] = "" + nwusrcmd;
			System.out.println("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp.equals("RESIGN"))
		{
			String[] resstr = new String[1];
			resstr[0] = "" + usrcmd;
			System.out.println("resstr[0] = " + resstr[0]);
			return resstr;
		}
		else if (cmdtp.equals("PAWNING"))
		{
			String myclr = "" + usrcmd.charAt(0);
			String fullclr = getLongHandColor(myclr);
			boolean useleft = (usrcmd.charAt(1) == 'L');
			String slocstr = usrcmd.substring(4, 6);
			int[] sloc = null;
			String nwusrcmd = null;
			System.out.println("OLD slocstr = " + slocstr);
			
			//BLPNB5TOA6
			//BLPNTOA6
			//0123456789
			
			if (usrcmd.indexOf("TO") == 4)
			{
				//need to get the starting location
				String elocstr = usrcmd.substring(6);
				//calculate sloc from eloc;
				int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				System.out.println("myclr = " + myclr);
				System.out.println("mytp = PAWN");
				System.out.println("elocstr = " + elocstr);
				System.out.println("eloc[0] = " + eloc[0]);
				System.out.println("eloc[1] = " + eloc[1]);
				
				sloc = getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr, "PAWN",
					ignorelist, addpcs, gid, false, bpassimnxtmv);
				if (sloc == null)
				{
					throw new IllegalStateException("THERE MUST BE A STARTING LOCATION IN ORDER FOR PAWN TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
				System.out.println("NEW slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 4) + slocstr + usrcmd.substring(4, 6) + 
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				System.out.println("nwusrcmd = " + nwusrcmd);
			}
			else sloc = convertStringLocToRowCol(slocstr, iswhitedown);
			System.out.println("sloc[0] = " + sloc[0]);
			System.out.println("sloc[1] = " + sloc[1]);
			
			ChessPiece cp = getPieceAt(sloc[0], sloc[1], allpcs);
			if (cp == null) throw new IllegalStateException("the current pawn must not be null!");
			else
			{
				if (cp.getType().equals("PAWN") && cp.getColor().equals(fullclr));
				else throw new IllegalStateException("the current pawn was not of the correct type and color!");
			}
			
			if (cp.canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv));
			else throw new IllegalStateException("you cannot pawn!");
			
			ChessPiece ep = cp.getEnemyPawnForLeftOrRightPawning(useleft, allpcs, bpassimnxtmv);
			if (ep == null) throw new IllegalStateException("the enemy pawn must not be null!");
			else
			{
				if (ep.getType().equals("PAWN") && ep.getColor().equals(getOppositeColor(fullclr)));
				else throw new IllegalStateException("the enemy pawn was not of the correct type and color!");
			}
			
			String delcmd = genLongOrShortHandDeleteCommand(ep, "the enemy pawn must not be null!", true, true);
			String[] resstr = new String[2];
			resstr[0] = "" + delcmd;
			if (nwusrcmd == null || nwusrcmd.length() < 1) resstr[1] = "" + usrcmd;
			else resstr[1] = "" + nwusrcmd;
			System.out.println("resstr[0] = " + resstr[0]);
			System.out.println("resstr[1] = " + resstr[1]);
			return resstr;
		}
		else if (cmdtp.equals("CASTLEING"))
		{
			String[] resstr = new String[3];
			resstr[0] = "" + usrcmd;
			//need to generate the two move to commands
			String myclr = "" + usrcmd.charAt(0);
			String fullclr = getLongHandColor(myclr);
			boolean useleft = (usrcmd.charAt(1) == 'L');
			int mccol = -1;
			if (useleft) mccol = 0;
			else mccol = 7;
			ChessPiece mkg = getCurrentSideKing(fullclr, allpcs);
			if (canSideCastleLeftOrRight(useleft, fullclr, ignorelist, addpcs, gid));
			else throw new IllegalStateException("CANNOT CASTLE!");
			
			if (mkg.getCol() == 4 && (mkg.getRow() == 7 || mkg.getRow() == 0));
			else throw new IllegalStateException("CANNOT CASTLE! KING IS NOT AT THE CORRECT POSITION!");
			int[] ncsloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, fullclr, ignorelist, addpcs, gid);
			//System.out.println("ncsloc[0] = " + ncsloc[0]);
			//System.out.println("ncsloc[1] = " + ncsloc[1]);
			String cslcmd = genLongOrShortHandMoveCommandOnlyString(fullclr, "CASTLE", mkg.getRow(), mccol,
				ncsloc[0], ncsloc[1], false, false, true);
			int[] nkgloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, fullclr, ignorelist, addpcs, gid);
			//System.out.println("nkgloc[0] = " + nkgloc[0]);
			//System.out.println("nkgloc[1] = " + nkgloc[1]);
			String kgcmd = genLongOrShortHandMoveCommandOnlyString(mkg, nkgloc[0], nkgloc[1], false, false,
				"THE KING MUST NOT BE NULL!", true, true);
			resstr[1] = "" + cslcmd;
			resstr[2] = "" + kgcmd;
			System.out.println("resstr[0] = " + resstr[0]);
			System.out.println("resstr[1] = " + resstr[1]);
			System.out.println("resstr[2] = " + resstr[2]);
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
			
			//static canPawnBePromotedAt(int nrval, int ncval, String clrval, String tpval)
			//non-static isMoveToASpecialMove(int nrval, int ncval, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
			//if type is king, and we can determine that the move is a special move, then convert it to castling notation
			
			String myclr = "" + usrcmd.charAt(0);
			String mytp = usrcmd.substring(1, 3);
			String fullclr = getLongHandColor(myclr);
			String slocstr = null;
			String elocstr = null;
			String nwusrcmd = null;
			int[] sloc = null;
			int[] eloc = null;
			int esi = -1;
			if (usrcmd.indexOf("TO") == 3)
			{
				elocstr = usrcmd.substring(5);
				//calculate sloc from eloc;
				eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				System.out.println("myclr = " + myclr);
				System.out.println("mytp = " + mytp);
				System.out.println("elocstr = " + elocstr);
				System.out.println("eloc[0] = " + eloc[0]);
				System.out.println("eloc[1] = " + eloc[1]);
				sloc = getStartLocForPieceThatCanMoveTo(eloc[0], eloc[1], fullclr, getLongHandType(mytp),
					ignorelist, addpcs, gid, false, bpassimnxtmv);
				if (sloc == null)
				{
					throw new IllegalStateException("THERE MUST BE A STARTING LOCATION IN ORDER FOR " +
						getLongHandType(mytp) + " TO MOVE THERE!");
				}
				//else;//do nothing safe to proceed
				slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
				System.out.println("slocstr = " + slocstr);
				
				nwusrcmd = usrcmd.substring(0, 3) + slocstr + usrcmd.substring(3, 5) +
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				System.out.println("nwusrcmd = " + nwusrcmd);
			}
			else
			{
				slocstr = usrcmd.substring(3, 5);
				elocstr = usrcmd.substring(7);
				System.out.println("slocstr = " + slocstr);
				System.out.println("elocstr = " + elocstr);
				
				eloc = convertStringLocToRowCol(elocstr, iswhitedown);
				sloc = convertStringLocToRowCol(slocstr, iswhitedown);
				System.out.println("sloc[0] = " + sloc[0]);
				System.out.println("sloc[1] = " + sloc[1]);
				System.out.println("eloc[0] = " + eloc[0]);
				System.out.println("eloc[1] = " + eloc[1]);
				
				nwusrcmd = usrcmd.substring(0, 3) + convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS) +
					usrcmd.substring(5, 7) + convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
				System.out.println("nwusrcmd = " + nwusrcmd);
			}
			
			//System.out.println("gid = " + gid);
			
			ChessPiece cp = getPieceAt(sloc[0], sloc[1], allpcs);
			if (cp == null) throw new IllegalStateException("the current piece must not be null!");
			else
			{
				if (cp.getType().equals(getLongHandType(mytp)) && cp.getColor().equals(fullclr));
				else throw new IllegalStateException("the current piece was not of the correct type and color!");
			}
			
			if (cp.isMoveToASpecialMove(eloc[0], eloc[1], ignorelist, addpcs, bpassimnxtmv))
			{
				//determine if it is castling or pawning
				//need the direction
				//then can generate the correct command
				//then call this method with the correct command
				boolean usecsling = cp.getType().equals("KING");
				boolean useleft = (eloc[1] < sloc[1]);
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
			
			boolean canpropawn = canPawnBePromotedAt(eloc[0], eloc[1], fullclr, cp.getType());
			String propawncmd = null;
			if (canpropawn)
			{
				//TBPNH8INTOQN
				
				String[] myvptps = {"QUEEN", "BISHOP", "CASTLE", "ROOK", "KNIGHT"};
				String myctpval = null;
				if (itemIsOnGivenList(ptpval, myvptps))
				{
					if (ptpval.equals("ROOK")) myctpval = "CASTLE";
					else myctpval = "" + ptpval;
					myctpval = getShortHandType(myctpval);
				}
				else
				{
					String[] myovptps = {"QN", "BP", "CE", "KT"};
					if (itemIsOnGivenList(ptpval, myvptps)) myctpval = "" + ptpval;
					else throw new IllegalStateException("CANNOT PROMOTE A PAWN TO GIVEN TYPE (" + ptpval + ")!");
				}
				
				propawncmd = "T" + usrcmd.substring(0, 3) +
					convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS) + "INTO" + myctpval;
				System.out.println("propawncmd = " + propawncmd);
			}
			//else;//do nothing
			
			//if command involves adding or removing a piece we need to include that here...
			ChessPiece ecp = getPieceAt(eloc[0], eloc[1], allpcs);
			String delcmd = null;
			boolean usedelcmd = true;
			if (ecp == null) usedelcmd = false;
			else
			{
				if (ecp.getColor().equals(getOppositeColor(cp.getColor())));
				else throw new IllegalStateException("enemy piece must be different than our color!");
				
				delcmd = genLongOrShortHandDeleteCommand(ecp, "the enemy piece must not be null!", true, true);
				System.out.println("delcmd = " + delcmd);
			}
			
			int mxsz = 1;
			if (usedelcmd) mxsz++;
			if (canpropawn) mxsz++;
			String[] resstr = new String[mxsz];
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
			for (int x = 0; x < mxsz; x++) System.out.println("resstr[" + x + "] = " + resstr[x]);
			return resstr;
		}
		else throw new IllegalStateException("ILLEGAL TYPE FOUND FOR COMMAND (" + usrcmd + ")!");
	}
	public static String[] genFullMoveCommandFromDisplayedCommand(String usrcmd, int gid, String ptpval,
		boolean iswhitedown, boolean bpassimnxtmv)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, gid, ptpval, null, null, iswhitedown, bpassimnxtmv);
	}
	public static String[] genFullMoveCommandFromDisplayedCommand(String usrcmd, int gid)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, gid, "QUEEN", null, null, WHITE_MOVES_DOWN_RANKS, false);
	}
	public String[] genFullMoveCommandFromDisplayedCommand(String usrcmd, String ptpval)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, getGameID(), ptpval, null, null, WHITE_MOVES_DOWN_RANKS, false);
	}
	public String[] genFullMoveCommandFromDisplayedCommand(String usrcmd)
	{
		return genFullMoveCommandFromDisplayedCommand(usrcmd, "QUEEN");
	}
	
	
	public static int[][] getNewIgnoreListFromCommand(String[] mvcmds, boolean iswhitedown)
	{
		if (mvcmds == null || mvcmds.length < 1) return null;
		else
		{
			String[] tpcmds = new String[mvcmds.length];
			int numskp = 0;
			for (int x = 0; x < mvcmds.length; x++)
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
			int igi = 0;
			for (int x = 0; x < mvcmds.length; x++)
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
			else throw new IllegalStateException("illegal number of ignore locs found and used here!");
		}
	}
	
	public static ArrayList<ChessPiece> getNewAddPiecesListFromCommand(String[] mvcmds,
		ArrayList<ChessPiece> oldaddpcs, int gid, boolean iswhitedown)
	{
		if (mvcmds == null || mvcmds.length < 1) return oldaddpcs;
		else
		{
			String[] tpcmds = new String[mvcmds.length];
			int numskp = 0;
			for (int x = 0; x < mvcmds.length; x++)
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
			boolean[] keepit = null;
			int numoldaddpcs = getNumItemsInList(oldaddpcs);
			if (numoldaddpcs < 1);
			else
			{
				keepit = new boolean[numoldaddpcs];
				for (int x = 0; x < numoldaddpcs; x++) keepit[x] = true;
			}
			
			for (int x = 0; x < mvcmds.length; x++)
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
					boolean fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (int p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs.get(p).getRow() == sloc[0] &&
								oldaddpcs.get(p).getCol() == sloc[1])
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
					int si = -1;
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
					else throw new IllegalStateException("THE TYPE MUST BE MOVE OR PAWNING, BUT NOW IT IS NOT!");
					
					int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
					int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
					//if old piece was on the add list, setLoc to eloc
					//else add it at that loc with at least 2 moves
					
					boolean fndit = false;
					if (numoldaddpcs < 1);
					else
					{
						for (int p = 0; p < numoldaddpcs; p++)
						{
							if (oldaddpcs.get(p).getRow() == sloc[0] &&
								oldaddpcs.get(p).getCol() == sloc[1])
							{
								fndit = true;
								oldaddpcs.get(p).setLoc(eloc[0], eloc[1], true);
								//oldaddpcs.get(p).incrementMoveCount();//not sure if we want to do this or not
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
					int initmvcnt = -1;
					boolean addit = true;
					if (tpcmds[x].equals("CREATE"))
					{
						String mymvcntstr = mvcmds[x].substring(7, mvcmds[x].indexOf("MS"));
						initmvcnt = Integer.parseInt(mymvcntstr);
					}
					else
					{
						initmvcnt = 1;
						boolean fndit = false;
						if (numoldaddpcs < 1);
						else
						{
							for (int p = 0; p < numoldaddpcs; p++)
							{
								if (oldaddpcs.get(p).getRow() == sloc[0] &&
									oldaddpcs.get(p).getCol() == sloc[1])
								{
									fndit = true;
									oldaddpcs.get(p).setType(ntpstr);
									initmvcnt = oldaddpcs.get(p).getMoveCount();
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
				for (int x = 0; x < numoldaddpcs; x++)
				{
					if (keepit[x])
					{
						if (addpcs == null) addpcs = new ArrayList<ChessPiece>();
						//else;//do nothing
						addpcs.add(oldaddpcs.get(x));
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
	public static String[][] genFullMoveCommands(String[] mvcmds, int gid, String[] promotps,
		boolean iswhitedown, boolean bpassimnxtmv)
	{
		if (mvcmds == null || mvcmds.length < 1) return null;
		
		String[][] myfullcmds = new String[mvcmds.length][];
		int ptpvali = 0;
		String ptpval = "QUEEN";
		int[][] ignorelist = null;
		ArrayList<ChessPiece> addpcs = null;
		for (int x = 0; x < mvcmds.length; x++)
		{
			boolean canpropawn = false;
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
				System.out.println("mvcmds[" + x + "] = " + mvcmds[x]);
				System.out.println("cmdtp = " + cmdtp);
				
				if (cmdtp.equals("MOVE"))
				{
					String tpval = getLongHandType(mvcmds[x].substring(1, 3));
					int esi = -1;
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
			for (int p = 0; p < myfullcmds[x].length; p++)
			{
				System.out.println("myfullcmds[" + x + "][" + p + "] = " + myfullcmds[x][p]);
			}
			printLocsArray(ignorelist, "OLD ignorelist");
			
			//if the location gets converted then that flips the iswhitedown variable
			//if the location does not get converted then the iswhitedown variable stays the same
			
			boolean noloccnv = (iswhitedown == WHITE_MOVES_DOWN_RANKS);
			//if true, no conversion took place
			//if false, the conversion already took place
			System.out.println("iswhitedown = " + iswhitedown);
			System.out.println("WHITE_MOVES_DOWN_RANKS = " + WHITE_MOVES_DOWN_RANKS);
			System.out.println("noloccnv = " + noloccnv);
			
			boolean nwiswhitedown = false;
			if (noloccnv) nwiswhitedown = iswhitedown;
			else nwiswhitedown = !iswhitedown;
			System.out.println("nwiswhitedown = " + nwiswhitedown);
			
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
	public static String[][] convertAllLocationsForFullMoveCommands(String[][] mvcmds, boolean iswhitedown)
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
			
			String[][] nwmvcmds = new String[mvcmds.length][];
			//for (int n = 0; n < mvcmds.length; n++)
			//{
			//	for (int x = 0; x < mvcmds[n].length; x++)
			//	{
			//		System.out.println("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
			//	}
			//}
			//System.out.println();
			
			for (int n = 0; n < mvcmds.length; n++)
			{
				String[] cmdtps = new String[mvcmds[n].length];
				String[] resstr = new String[mvcmds[n].length];
				for (int x = 0; x < mvcmds[n].length; x++)
				{
					cmdtps[x] = getTypeOfMoveCommand(mvcmds[n][x]);
					System.out.println("mvcmds[" + n + "][" + x + "] = " + mvcmds[n][x]);
					System.out.println("cmdtps[" + x + "] = " + cmdtps[x]);
					
					if (cmdtps[x].equals("HINTS") || cmdtps[x].equals("CREATE") || cmdtps[x].equals("DELETE") ||
						cmdtps[x].equals("PROMOTION"))
					{
						int si = -1;
						int ei = -1;
						if (cmdtps[x].equals("HINTS"))
						{
							if (mvcmds[n][x].length() == 6)
							{
								resstr[x] = "" + mvcmds[n][x];
								System.out.println("resstr[0] = " + resstr[0]);
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
						System.out.println("si = " + si);
						System.out.println("ei = " + ei);
						
						String slocstr = mvcmds[n][x].substring(si, ei);
						String nwusrcmd = null;
						System.out.println("OLD slocstr = " + slocstr);
						
						int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
						System.out.println("sloc[0] = " + sloc[0]);
						System.out.println("sloc[1] = " + sloc[1]);
						
						slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
						System.out.println("NEW slocstr = " + slocstr);
						
						nwusrcmd = mvcmds[n][x].substring(0, si) + slocstr + mvcmds[n][x].substring(ei);
						System.out.println("nwusrcmd = " + nwusrcmd);
						
						resstr[x] = "" + nwusrcmd;
						System.out.println("resstr[" + x + "] = " + resstr[x]);
					}
					else if (cmdtps[x].equals("CASTLEING") || cmdtps[x].equals("TIEDESIRE") || cmdtps[x].equals("RESIGN"))
					{
						//CASTLING NOTATION:
						//WLCE:
						resstr[x] = "" + mvcmds[n][x];
						System.out.println("resstr[" + x + "] = " + resstr[x]);
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
						
						int ssi = -1;
						int sei = -1;
						int esi = -1;
						if (cmdtps[x].equals("PAWNING")) ssi = 4;
						else ssi = 3;
						sei = ssi + 2;
						esi = sei + 2;
						System.out.println("ssi = " + ssi);
						System.out.println("sei = " + sei);
						System.out.println("esi = " + esi);
						
						String slocstr = mvcmds[n][x].substring(ssi, sei);
						String elocstr = mvcmds[n][x].substring(esi);
						String nwusrcmd = null;
						System.out.println("OLD slocstr = " + slocstr);
						System.out.println("OLD elocstr = " + elocstr);
						
						int[] sloc = convertStringLocToRowCol(slocstr, iswhitedown);
						int[] eloc = convertStringLocToRowCol(elocstr, iswhitedown);
						System.out.println("sloc[0] = " + sloc[0]);
						System.out.println("sloc[1] = " + sloc[1]);
						
						System.out.println("eloc[0] = " + eloc[0]);
						System.out.println("eloc[1] = " + eloc[1]);
						
						slocstr = convertRowColToStringLoc(sloc[0], sloc[1], WHITE_MOVES_DOWN_RANKS);
						System.out.println("NEW slocstr = " + slocstr);
						
						elocstr = convertRowColToStringLoc(eloc[0], eloc[1], WHITE_MOVES_DOWN_RANKS);
						System.out.println("NEW elocstr = " + elocstr);
						
						nwusrcmd = mvcmds[n][x].substring(0, ssi) + slocstr + mvcmds[n][x].substring(sei, esi) +
							elocstr;
						System.out.println("nwusrcmd = " + nwusrcmd);
						
						resstr[x] = "" + nwusrcmd;
						System.out.println("resstr[" + x + "] = " + resstr[x]);
					}
					else throw new IllegalStateException("ILLEGAL COMMAND TYPE (" + cmdtps[x] + ") FOUND AND USED HERE!");
				}//end of x for loop
				nwmvcmds[n] = resstr;
			}//end of n for loop
			System.out.println();
			
			//System.out.println("NEW COMMANDS:");
			//for (int n = 0; n < nwmvcmds.length; n++)
			//{
			//	for (int x = 0; x < nwmvcmds[n].length; x++)
			//	{
			//		System.out.println("nwmvcmds[" + n + "][" + x + "] = " + nwmvcmds[n][x]);
			//	}
			//}
			//System.out.println();
			return nwmvcmds;
		}
	}
	
	
	//THE EXECUTOR EXECUTES THE COMMANDS GENERATED ABOVE
	
	//EXECUTES THE COMMANDS ABOVE ON THE LOCAL BOARD ONLY
	//ONLY EXECUTES COMMANDS IN SHORT HAND NOTATION
	///*
	public static void makeLocalShortHandMove(String[] mvcmd, int gid, boolean isundo, boolean iswhitedown, boolean isuser,
		boolean isofficial)
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
		
		System.out.println();
		System.out.println("BEGIN EXECUTING THE MOVE COMMAND NOW:");
		System.out.println(getGame(gid).getSideTurn() + "'S TURN!");
		for (int x = 0; x < mvcmd.length; x++) System.out.println("mvcmd[" + x + "] = " + mvcmd[x]);
		System.out.println();
		System.out.println("isundo = " + isundo);
		System.out.println("isuser = " + isuser);
		
		final String mypcsclr = getGame(gid).getMyColor();
		System.out.println("mypcsclr = " + mypcsclr);
		System.out.println();
		
		if (isundo)
		{
			String[] nwmvs = new String[mvcmd.length];
			boolean fndundo = false;
			for (int x = 0; x < mvcmd.length; x++)
			{
				if (mvcmd[x].indexOf("UNDO") == 0)
				{
					nwmvs[x] = mvcmd[x].substring(4);
					if (fndundo);
					else fndundo = true;
				}
				else nwmvs[x] = "" + mvcmd[x];
			}
			System.out.println("fndundo = " + fndundo);
			
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
				String[] oldmvwithundo = genUndoMoveToShortHandCommand(nwmvs, true, false);//redoit, remundo
				if (oldmvwithundo == null)
				{
					if (mvcmd == null);
					else throw new IllegalStateException("old move is not the required length!");
				}
				else
				{
					if (oldmvwithundo.length == mvcmd.length);
					else throw new IllegalStateException("old move is not the required length!");
				}
				String[] oldmv = new String[mvcmd.length];
				for (int x = 0; x < oldmvwithundo.length; x++)
				{
					if (oldmvwithundo[x].indexOf("UNDO") == 0) oldmv[x] = oldmvwithundo[x].substring(4);
					else oldmv[x] = "" + oldmvwithundo[x];
					System.out.println("oldmv[" + x + "] = " + oldmv[x]);
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
		
		String[] tpcmds = new String[mvcmd.length];
		boolean usecastling = false;
		boolean usepawning = false;
		boolean usehintsforside = false;
		int pci = -1;
		for (int x = 0; x < mvcmd.length; x++)
		{
			if (mvcmd[x].charAt(0) == '+') tpcmds[x] = "CREATE";
			else if (mvcmd[x].charAt(0) == '-') tpcmds[x] = "DELETE";
			else if (0 < mvcmd[x].indexOf("RESIGNS") && mvcmd[x].indexOf("RESIGNS") < mvcmd[x].length() &&
				(mvcmd[x].length() == 8 || mvcmd[x].length() == 13))
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
			else throw new IllegalStateException("ILLEGAL TYPE FOUND FOR COMMAND (" + mvcmd[x] + ")!");
			System.out.println("tpcmds[" + x + "] = " + tpcmds[x]);
		}//end of x for loop
		System.out.println("usecastling = " + usecastling);
		System.out.println("usepawning = " + usepawning);
		System.out.println("usehintsforside = " + usehintsforside);
		
		if (usecastling || usepawning)
		{
			if (pci < 0 || mvcmd.length - 1 < pci)
			{
				throw new IllegalStateException("ILLEGAL VALUE FOR PCI BECAUSE WE ARE CASTLEING OR PAWNING!");
			}
			//else;//do nothing
		}
		else
		{
			if (pci < 0 || mvcmd.length - 1 < pci);
			else throw new IllegalStateException("ILLEGAL VALUE FOR PCI BECAUSE WE ARE CASTLEING OR PAWNING!");
		}
		
		if (isundo || !isuser || mypcsclr.equals("BOTH"));//do nothing just proceed can move all of the pieces
		else
		{
			String[][] tempmvs = new String[1][];
			tempmvs[0] = mvcmd;
			String mycmdclr = getSideColorsForMoves(tempmvs)[0];
			System.out.println("mypcsclr = " + mypcsclr);
			System.out.println("mycmdclr = " + mycmdclr);
			
			colorIsValid(mycmdclr);
			colorIsValid(mypcsclr);
			
			//if piece color is the same as the main command color
			if (mypcsclr.equals(mycmdclr) && (mycmdclr.equals("WHITE") || mycmdclr.equals("BLACK")));
			else throw new IllegalStateException("NOT ALLOWED TO MOVE THIS PIECE OR ILLEGAL PIECES COLOR OBTAINED!");
		}
		
		//get the direction
		boolean useleftforcandp = false;
		if (usecastling || usepawning) useleftforcandp = (mvcmd[pci].charAt(1) == 'L');
		//else;//do nothing
		System.out.println("useleftforcandp = " + useleftforcandp);
		
		ArrayList<ChessPiece> mpclist = getAllPiecesWithGameID(gid);
		if (usecastling || usepawning)
		{
			if (usepawning)
			{
				//needs to be called on the pawn
				//extract the location of that pawn
				//get the piece
				ChessPiece pn = getPieceAt(convertStringLocToRowCol(mvcmd[pci].substring(4, 6), iswhitedown), mpclist);
				if (pn == null) throw new IllegalStateException("THE PAWN MUST NOT BE NULL!");
				else
				{
					if (isundo)
					{
						pn.setLoc(convertStringLocToRowCol(mvcmd[pci].substring(8), iswhitedown));
						pn.decrementMoveCount();
						System.out.println("MOVED THE PAWN BACK!");
						ChessPiece cp = new ChessPiece(getLongHandType(mvcmd[pci + 1].substring(2, 4)),
							getLongHandColor("" + mvcmd[pci + 1].charAt(1)),
							convertStringLocToRowCol(mvcmd[pci + 1].substring(4, 6), iswhitedown), gid,
							Integer.parseInt(mvcmd[pci + 1].substring(7, mvcmd[pci + 1].indexOf("MS"))), true);
						System.out.println("CREATED: " + cp + "!");
						int prevrw = -1;
						if (cp.getColor().equals("WHITE")) prevrw = 6;
						else prevrw = 1;
						String mymvcmd = getShortHandColor(cp.getColor()) + getShortHandType(cp.getType()) +
							convertRowColToStringLoc(prevrw, cp.getCol(), WHITE_MOVES_DOWN_RANKS) + "TO" +
							convertRowColToStringLoc(cp.getRow(), cp.getCol(), WHITE_MOVES_DOWN_RANKS);
						System.out.println("UNDOPAWNING: mymvcmd = " + mymvcmd);
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
					if (mkg == null) throw new IllegalStateException("the king must be found!");
					//else;//do nothing
					int[] skgloc = convertStringLocToRowCol(mvcmd[pci + 2].substring(3, 5), iswhitedown);
					if (mkg.getRow() == skgloc[0] && mkg.getCol() == skgloc[1]);
					else throw new IllegalStateException("Our king should be at the starting location, but it was not!");
					mkg.setLoc(convertStringLocToRowCol(mvcmd[pci + 2].substring(7), iswhitedown));
					mkg.decrementMoveCount();
					System.out.println("MOVED THE KING BACK!");
					ChessPiece mcsl = getPieceAt(convertStringLocToRowCol(mvcmd[pci + 1].substring(3, 5),
						iswhitedown), mpclist);
					if (mcsl == null)
					{
						throw new IllegalStateException("Since we just moved it the piece must exist, but now it does not!");
					}
					//else;//do nothing
					if ((mcsl.getType().equals("CASTLE") || mcsl.getType().equals("ROOK")) &&
						mcsl.getColor().equals(mkg.getColor()))
					{
						//do nothing valid
					}
					else
					{
						throw new IllegalStateException("Since we just moved it, it must be at that given location " +
							"and must be type and color of piece that we are looking for, but it was not!");
					}
					mcsl.setLoc(convertStringLocToRowCol(mvcmd[pci + 1].substring(7), iswhitedown));
					System.out.println("MOVED THE CASTLE BACK!");
				}
				else sideCastleLeftOrRight(getLongHandColor("" + mvcmd[pci].charAt(0)), useleftforcandp, gid);
			}
			System.out.println("DONE MAKING THE FULL MOVE!");
			return;
		}
		//else;//do nothing proceed below
		
		//now the order matters
		for (int x = 0; x < mvcmd.length; x++)
		{
			if (tpcmds[x].equals("CREATE"))
			{
				ChessPiece cp = new ChessPiece(getLongHandType(mvcmd[x].substring(2, 4)),
					getLongHandColor("" + mvcmd[x].charAt(1)),
					convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), gid,
					Integer.parseInt(mvcmd[x].substring(7, mvcmd[x].indexOf("MS"))), true);
				//need to update the piece list...
				System.out.println("TOTAL PIECES: " + mpclist.size());
				
				mpclist = getAllPiecesWithGameID(gid);
				
				System.out.println("TOTAL PIECES: " + mpclist.size());
				System.out.println("CREATED: " + cp + "!");
			}
			else if (tpcmds[x].equals("DELETE"))
			{
				//extract the location
				removePieceAt(convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), gid);
				
				//need to update the piece list...
				System.out.println("TOTAL PIECES: " + mpclist.size());
				
				mpclist = getAllPiecesWithGameID(gid);
				
				System.out.println("TOTAL PIECES: " + mpclist.size());
				System.out.println("DELETED THE PIECE!");
			}
			else if (tpcmds[x].equals("PROMOTION"))
			{
				System.out.println("mvcmd[" + x + "] = " + mvcmd[x]);
				System.out.println("slocstr = mvcmd[" + x + "].substring(4, 6) = " + mvcmd[x].substring(4, 6));
				System.out.println("iswhitedown = " + iswhitedown);
				
				ChessPiece pn = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(4, 6), iswhitedown), mpclist);
				System.out.println("pn = " + pn);
				
				if (pn == null) throw new IllegalStateException("THE PAWN MUST NOT BE NULL!");
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
							throw new IllegalStateException("Since we just moved this piece, this must be the same " +
								"color and type at the expected location, but it was not!");
						}
						
						if (getLongHandType(mvcmd[x].substring(10)).equals("PAWN"));
						else throw new IllegalStateException("THE NEW TYPE MUST BE PAWN FOR DEMOTION, BUT IT WAS NOT!");
						
						pn.setType("PAWN");
						System.out.println("DEMOTED BACK TO PAWN!");
					}
					else
					{
						pn.promotePawnTo(getLongHandType(mvcmd[x].substring(10)));
						System.out.println("PROMOTED THE PAWN!");
					}
				}
			}
			else if (tpcmds[x].equals("MOVE"))
			{
				ChessPiece cp = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(3, 5), iswhitedown), mpclist);
				System.out.println("cp = " + cp);
				
				if (cp == null) throw new IllegalStateException("THE PIECE MUST NOT BE NULL!");
				//else;//do nothing
				if (cp.getType().equals(getLongHandType(mvcmd[x].substring(1, 3))) &&
					cp.getColor().equals(getLongHandColor("" + mvcmd[x].charAt(0))))
				{
					cp.setLoc(convertStringLocToRowCol(mvcmd[x].substring(7), iswhitedown));
					if (isundo) cp.decrementMoveCount();
					else cp.incrementMoveCount();
					System.out.println("MOVED THE PIECE TO THE NEW LOCATION!");
				}
				else throw new IllegalStateException("THE PIECE WE ARE MOVING MUST BE THE SAME TYPE AND COLOR!");
			}
			else if (tpcmds[x].equals("HINTS"))
			{
				if (usehintsforside)
				{
					ArrayList<ChessPiece> mycpcs = filterListByColor(mpclist, getLongHandColor("" + mvcmd[x].charAt(0)));
					//System.out.println("mycpcs = " + mycpcs);
					int numpcs = getNumItemsInList(mycpcs);
					if (numpcs < 1) throw new IllegalStateException("there must be at least a king on the pieces list!");
					else
					{
						System.out.println("ALL THE HINTS ARE:");
						for (int p = 0; p < numpcs; p++)
						{
							int[][] mypcmvlocs = mycpcs.get(p).getPieceCanMoveToLocs();
							System.out.println();
							System.out.println("HINTS ARE:");
							System.out.println(mycpcs.get(p) + " CAN MOVE TO:");
							printLocsArray(mypcmvlocs, "mypcmvlocs", mycpcs.get(p));
							System.out.println("DONE SHOWING HINTS FOR THE PIECE # " + (p + 1) + "/" + numpcs + "!");
						}
						System.out.println("DONE SHOWING ALL THE HINTS!");
						System.out.println();
					}
				}
				else
				{
					ChessPiece cp = getPieceAt(convertStringLocToRowCol(mvcmd[x].substring(3, 5), iswhitedown), mpclist);
					if (cp == null) throw new IllegalStateException("THE PIECE MUST NOT BE NULL!");
					//else;//do nothing
					if (cp.getType().equals(getLongHandType(mvcmd[x].substring(1, 3))) &&
						cp.getColor().equals(getLongHandColor("" + mvcmd[x].charAt(0))))
					{
						int[][] mvlocs = cp.getPieceCanMoveToLocs();
						System.out.println();
						System.out.println("HINTS ARE:");
						System.out.println(cp + " CAN MOVE TO:");
						printLocsArray(mvlocs, "mvlocs", cp);
						System.out.println("DONE SHOWING THE HINTS!");
						System.out.println();
					}
					else throw new IllegalStateException("THE PIECE WE ARE MOVING MUST BE THE SAME TYPE AND COLOR!");
				}
			}
			else if (tpcmds[x].equals("TIEDESIRE"))
			{
				boolean mybool = false;
				if (mvcmd[x].charAt(mvcmd[x].length() - 1) == '0') mybool = false;
				else mybool = true;
				getGame(gid).makeUnofficialMoveOfficial();
				getGame(gid).setColorWantsADraw(getLongHandColor("" + mvcmd[x].charAt(1)), mybool);
			}
			else if (tpcmds[x].equals("RESIGN"))
			{
				if (isundo)
				{
					System.out.println("RESIGNING AUTOMATICALLY ENDS THE GAME! THE COMPLETION " +
						"OF THE GAME WILL NOT BE UNDONE! SO YOU CAN VIEW THE MOVES MADE!");
				}
				else
				{
					//clear the last undone move
					if (isundo || isofficial);
					else getGame(gid).setLastUndoneMove(null);
					
					getGame(gid).makeUnofficialMoveOfficial();
					getGame(gid).setColorResigns(getLongHandColor("" + mvcmd[x].charAt(0)), true);
					if (x + 1 < mvcmd.length) throw new IllegalStateException("RESIGNING MUST BE THE LAST COMMAND!");
					//else;//do nothing
				}
			}
			else throw new IllegalStateException("ILLEGAL TYPE FOUND FOR COMMAND (" + mvcmd[x] + ")!"); 
		}//end of x for loop
		System.out.println("DONE MAKING THE FULL MOVE!");
		System.out.println();
	}
	public static void makeLocalShortHandMove(String[] mvcmd, int gid, boolean isundo, boolean iswhitedown, boolean isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, isundo, iswhitedown, isuser, false);
	}
	public static void makeLocalShortHandMove(String[] mvcmd, int gid, boolean isundo, boolean isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, isundo, WHITE_MOVES_DOWN_RANKS, isuser);
	}
	public static void makeLocalShortHandMove(String[] mvcmd, int gid, boolean isuser)
	{
		makeLocalShortHandMove(mvcmd, gid, false, WHITE_MOVES_DOWN_RANKS, isuser, false);
	}
	public static void makeLocalLongHandMove(String[] mvcmd, int gid, boolean isundo, boolean iswhitedown, boolean isuser,
		boolean isofficial)
	{
		makeLocalShortHandMove(getShortHandMoves(mvcmd), gid, isundo, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalLongHandMove(String[] mvcmd, int gid, boolean isuser)
	{
		makeLocalLongHandMove(mvcmd, gid, false, WHITE_MOVES_DOWN_RANKS, isuser, false);
	}
	public static void makeLocalMove(String[] mvcmd, int gid, boolean isundo, boolean isshorthand, boolean iswhitedown,
		boolean isuser, boolean isofficial)
	{
		System.out.println("CALLING SHORT OR LONG HAND MOVE with: iswhitedown = " + iswhitedown);
		if (isshorthand) makeLocalShortHandMove(mvcmd, gid, isundo, iswhitedown, isuser, isofficial);
		else makeLocalLongHandMove(mvcmd, gid, isundo, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalMove(String[] mvcmd, int gid, boolean isundo, boolean iswhitedown, boolean isuser,
		boolean isofficial)
	{
		makeLocalMove(mvcmd, gid, isundo, true, iswhitedown, isuser, isofficial);
	}
	public static void makeLocalMove(String[] mvcmd, int gid, boolean isundo, boolean iswhitedown, boolean isuser)
	{
		makeLocalMove(mvcmd, gid, isundo, iswhitedown, isuser, false);
	}
	public static void makeLocalMove(String[] mvcmd, int gid, boolean isundo, boolean isuser)
	{
		makeLocalMove(mvcmd, gid, isundo, WHITE_MOVES_DOWN_RANKS, isuser);
	}
	public static void makeLocalMove(String[] mvcmd, int gid, boolean isuser)
	{
		makeLocalMove(mvcmd, gid, false, isuser);
	}
	//*/
	
	//PAWN SPECIAL METHODS
	
	//PAWN PROMOTION METHODS
	
	public static boolean canPawnBePromotedAt(int nrval, int ncval, String clrval, String tpval)
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
			//else System.out.println("THIS PAWN HAS NOT REACHED THE CORRECT ROW FOR ITS COLOR!");
		}
		//else System.out.println("THIS PIECE MUST BE A PAWN!");
		return false;
	}
	public boolean canPawnBePromoted()
	{
		return canPawnBePromotedAt(getRow(), getCol(), getColor(), getType());
	}
	public static boolean canPawnForSideBePromoted(String clrval, ArrayList<ChessPiece> allpcs)
	{
		ArrayList<ChessPiece> pwnsclr = getAllPawnsOfColor(clrval, allpcs);
		if (getNumItemsInList(pwnsclr) < 1);
		else
		{
			for (int x = 0; x < pwnsclr.size(); x++)
			{
				if (pwnsclr.get(x).canPawnBePromoted()) return true;
			}
		}
		return false;
	}
	public static boolean canPawnForSideBePromoted(String clrval, int gid)
	{
		return canPawnForSideBePromoted(clrval, getAllPiecesWithGameID(gid));
	}
	
	public void promotePawnTo(String nwtype)
	{
		if (canPawnBePromoted())
		{
			if (nwtype.equals("PAWN") || nwtype.equals("KING"))
			{
				throw new IllegalStateException("CANNOT PROMOTE A PAWN TO A PAWN OR A KING!");
			}
			else setType(nwtype);
		}
		else throw new IllegalStateException("CANNOT PROMOTE THE PAWN!");
	}
	
	
	//PAWNING METHODS
	
	//CAN PAWN METHODS
	
	public boolean canPawnLeftOrRight(boolean useleft, ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		//if no pawns for one side -> false
		ArrayList<ChessPiece> wpns = getAllPawnsOfColor("WHITE", allpcs);
		ArrayList<ChessPiece> bpns = getAllPawnsOfColor("BLACK", allpcs);
		if (getNumItemsInList(wpns) < 1 || getNumItemsInList(bpns) < 1)
		{
			//System.out.println("ONE SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON EACH SIDE NEAR " +
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
				//System.out.println("OUR SIDE PIECE IS NOT ON THE APPROPRIATE ROW TO BE ABLE TO PAWN!");
				return false;
			}
			
			int lc = -1;
			if (useleft) lc = getCol() - 1;
			else lc = getCol() + 1;
			if (isvalidrorc(lc));
			else
			{
				//System.out.println("THE LOCATION " + getLocString(getRow(), lc) + " HAS AN INVALID COLUMN!");
				return false;
			}
			
			ChessPiece ep = getPieceAt(getRow(), lc, allpcs);
			if (ep == null)
			{
				//System.out.println("THE LOCATION " + getLocString(getRow(), lc) + " IS EMPTY!");
				return false;
			}
			else
			{
				//System.out.println(ep);
				//System.out.println(ep.movecount);
				if (ep.getType().equals("PAWN"));
				else
				{
					System.out.println("THIS IS NOT A PAWN!");
					return false;
				}
				if (ep.getColor().equals(getColor()))
				{
					System.out.println("THIS IS YOUR PAWN!");
					return false;
				}
				//else;//do nothing this is an enemy pawn
				if (ep.movecount == 1);
				else
				{
					System.out.println("THIS IS NOT THE FIRST MOVE OF THE ENEMY PAWN!");
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
						System.out.println("lstsetlocmv = " + lstsetlocmv);
						System.out.println("lstmvdestlocstr = " + lstmvdestlocstr);
						System.out.println("THIS IS NOT THE IMMEDIATE NEXT MOVE, SO CANNOT PAWN!");
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
				
				int nr = -1;
				if (getColor().equals("WHITE")) nr = 2;
				else if (getColor().equals("BLACK")) nr = 5;
				else throw new IllegalStateException("PIECE FOUND WITH AN ILLEGAL COLOR FOUND AND USED HERE!");
				int nc = -1;
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
			System.out.println("ONLY PAWNS CAN PAWN!");
			return false;
		}
	}
	public boolean canPawnLeftOrRight(boolean useleft, ArrayList<ChessPiece> allpcs)
	{
		return this.canPawnLeftOrRight(useleft, allpcs, false);
	}
	public boolean canPawnLeftOrRight(boolean useleft)
	{
		return canPawnLeftOrRight(useleft, getAllPiecesWithGameID(getGameID()));
	}
	public boolean canPawnLeft(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		return canPawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	public boolean canPawnLeft(ArrayList<ChessPiece> allpcs)
	{
		return canPawnLeft(allpcs, false);
	}
	public boolean canPawnLeft()
	{
		return canPawnLeft(getAllPiecesWithGameID(getGameID()));
	}
	public boolean canPawnRight(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		return canPawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	public boolean canPawnRight(ArrayList<ChessPiece> allpcs)
	{
		return canPawnRight(allpcs, false);
	}
	public boolean canPawnRight()
	{
		return canPawnRight(getAllPiecesWithGameID(getGameID()));
	}
	public boolean canPawn(ArrayList<ChessPiece> allpcs)
	{
		return (canPawnLeft(allpcs) || canPawnRight(allpcs));
	}
	public boolean canPawn()
	{
		return canPawn(getAllPiecesWithGameID(getGameID()));
	}
	public static boolean canSidePawn(String clrval, ArrayList<ChessPiece> allpcs)
	{
		//get all the pawns for our color
		//then call the canPawnLeft() or canPawnRight()
		//if true, then return true
		//if none are true, or no pawns return false
		
		ArrayList<ChessPiece> pns = getAllPawnsOfColor(clrval, allpcs);
		//System.out.println("pns = " + pns);
		if (getNumItemsInList(pns) < 1)
		{
			System.out.println("THIS SIDE HAS NO PAWNS! THERE MUST BE AT LEAST ONE PAWN ON EACH SIDE NEAR " +
				"EACH OTHER TO BE ABLE TO PAWN!");
			return false;
		}
		else
		{
			for (int x = 0; x < pns.size(); x++)
			{
				if (pns.get(x).canPawn(allpcs)) return true;
			}
			
			System.out.println("NO PAWN CAN PAWN ON THIS SIDE!");
			return false;
		}
	}
	public static boolean canSidePawn(String clrval, int gid)
	{
		return canSidePawn(clrval, getAllPiecesWithGameID(gid));
	}
	
	//GET ENEMY PAWN FOR PAWNING
	
	public ChessPiece getEnemyPawnForLeftOrRightPawning(boolean useleft, ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		if (canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			int lc = -1;
			if (useleft) lc = getCol() - 1;
			else lc = getCol() + 1;
			if (isvalidrorc(lc));
			else throw new IllegalStateException("we can pawn, so there must be an enemy, but col is invalid!");
			
			ChessPiece ep = getPieceAt(getRow(), lc, allpcs);
			return ep;
		}
		else return null;
	}
	public ChessPiece getEnemyPawnForLeftPawning(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		return getEnemyPawnForLeftOrRightPawning(true, allpcs, bpassimnxtmv);
	}
	public ChessPiece getEnemyPawnForLeftPawning(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnForLeftPawning(allpcs, false);
	}
	public ChessPiece getEnemyPawnForRightPawning(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
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
	
	public int[] getEnemyPawnLeftOrRightLocation(boolean useleft, ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
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
	public int[] getEnemyPawnLeftLocation(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		return getEnemyPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	public int[] getEnemyPawnLeftLocation(ArrayList<ChessPiece> allpcs)
	{
		return getEnemyPawnLeftLocation(allpcs, false);
	}
	public int[] getEnemyPawnRightLocation(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
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
	
	public int[] getPawnLeftOrRightLocation(boolean useleft, ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		if (canPawnLeftOrRight(useleft, allpcs, bpassimnxtmv))
		{
			int nr = -1;
			if (getColor().equals("WHITE")) nr = 2;
			else if (getColor().equals("BLACK")) nr = 5;
			else throw new IllegalStateException("PIECE FOUND WITH AN ILLEGAL COLOR FOUND AND USED HERE!");
			int nc = -1;
			if (useleft) nc = getCol() - 1;
			else nc = getCol() + 1;
			if (isvalidrorc(nr) && isvalidrorc(nc));
			else throw new IllegalStateException("SR AND SC MUST BE VALID BECAUSE WE CAN PAWN!");
			int[] loc = new int[2];
			loc[0] = nr;
			loc[1] = nc;
			return loc;
		}
		else return null;
	}
	public int[] getPawnLeftOrRightLocation(boolean useleft, ArrayList<ChessPiece> allpcs)
	{
		return getPawnLeftOrRightLocation(useleft, allpcs, false);
	}
	public int[] getPawnLeftLocation(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		return getPawnLeftOrRightLocation(true, allpcs, bpassimnxtmv);
	}
	public int[] getPawnLeftLocation(ArrayList<ChessPiece> allpcs)
	{
		return getPawnLeftLocation(allpcs, false);
	}
	public int[] getPawnRightLocation(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
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
	public void pawnLeftOrRight(boolean useleft, ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
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
			throw new IllegalStateException("CANNOT PAWN " + dirstr + "!");
		}
	}
	public void pawnLeft(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		pawnLeftOrRight(true, allpcs, bpassimnxtmv);
	}
	public void pawnLeft()
	{
		pawnLeft(getAllPiecesWithGameID(getGameID()), false);
	}
	public void pawnRight(ArrayList<ChessPiece> allpcs, boolean bpassimnxtmv)
	{
		pawnLeftOrRight(false, allpcs, bpassimnxtmv);
	}
	public void pawnRight()
	{
		pawnRight(getAllPiecesWithGameID(getGameID()), false);
	}
	
	
	//CASTLING METHODS
	
	//CAN CASTLE METHODS
	
	public static boolean canSideCastleLeftOrRight(boolean useleft, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		if (itemIsOnGivenList(clrval, validColors));
		else throw new IllegalStateException("ILLEGAL COLOR (" + clrval + ") FOUND AND USED HERE!");
		if (gid < 1) throw new IllegalStateException("GAME ID must be at least 1!");
		//else;//do nothing
		
		ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
		
		ChessPiece mkg = getCurrentSideKing(clrval, allpcs);
		if (mkg.inCheck(ignorelist, addpcs))
		{
			//System.out.println("YOU CANNOT CASTLE OUT OF CHECK!");
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
				//System.out.println("THIS MUST BE THE FIRST MOVE FOR THE KING!");
				return false;
			}
			if (mkg.getCol() == 4 && ((mkg.getColor().equals("WHITE") && mkg.getRow() == 7) ||
				(mkg.getColor().equals("BLACK") && mkg.getRow() == 0)))
			{
				//the king is at its starting location
			}
			else
			{
				//System.out.println("THE KING MUST BE AT ITS STARTING LOCATION!");
				return false;
			}
			
			int mccol = -1;
			if (useleft) mccol = 0;
			else mccol = 7;
			int mcrw = -1;
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
						//System.out.println("THIS MUST BE THE FIRST MOVE FOR THE CASTLE!");
						return false;
					}
				}
				else
				{
					//System.out.println("THERE MUST BE A CASTLE AT ITS STARTING LOCATION!");
					return false;
				}
			}
			
			//verify that the squares between the castle and the king are empty
			int sccol = -1;
			int cmx = -1;
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
			for (int c = sccol + 1; c < cmx; c++)
			{
				if (getPieceAt(mcrw, c, allpcs) == null);
				else
				{
					//System.out.println("THE SQUARES ARE NOT EMPTY!");
					return false;
				}
			}
			
			
			//need to know if there are any enemy pieces attacking the locations
			for (int c = sccol + 1; c < cmx; c++)
			{
				ArrayList<ChessPiece> epcs = getEnemyPiecesGuardingLocation(mcrw, c, mkg.getGameID(), mkg.getColor(),
					ignorelist, addpcs);
				if (getNumItemsInList(epcs) < 1);
				else
				{
					//System.out.println("THERE IS AT LEAST ONE ENEMY PIECE ABLE TO ATTACK ONE OF THESE LOCATIONS DIRECTLY!");
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
	public static boolean canSideCastleLeftOrRight(boolean useleft, String clrval, int gid)
	{
		return canSideCastleLeftOrRight(useleft, clrval, null, null, gid);
	}
	public static boolean canSideCastleLeft(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return canSideCastleLeftOrRight(true, clrval, ignorelist, addpcs, gid);
	}
	public static boolean canSideCastleLeft(String clrval, int gid)
	{
		return canSideCastleLeftOrRight(true, clrval, gid);
	}
	public static boolean canSideCastleRight(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return canSideCastleLeftOrRight(false, clrval, ignorelist, addpcs, gid);
	}
	public static boolean canSideCastleRight(String clrval, int gid)
	{
		return canSideCastleLeftOrRight(false, clrval, gid);
	}
	public static boolean canSideCastle(String clrval, int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		return (canSideCastleLeft(clrval, ignorelist, addpcs, gid) || canSideCastleRight(clrval, ignorelist, addpcs, gid));
	}
	public static boolean canSideCastle(String clrval, int gid)
	{
		return (canSideCastleLeft(clrval, gid) || canSideCastleRight(clrval, gid));
	}
	//non-static version convenience methods
	public boolean canCastleLeftOrRight(boolean useleft)
	{
		if (getType().equals("CASTLE") || getType().equals("ROOK") || getType().equals("KING"));
		else
		{
			System.out.println("YOU MUST BE A CASTLE OR A KING TO CASTLE!");
			return false;
		}
		
		return canSideCastleLeftOrRight(useleft, getColor(), getGameID());
	}
	public boolean canCastleLeft()
	{
		return canCastleLeftOrRight(true);
	}
	public boolean canCastleRight()
	{
		return canCastleLeftOrRight(false);
	}
	public boolean canCastle()
	{
		return (canCastleLeft() || canCastleRight());
	}
	
	//NEW CASTLE OR KING LOCATION METHODS
	
	//returns an array with 2 integers both will be invalid if cannot castle that direction
	public static int[] getLeftOrRightCastleSideNewCastleOrKingLoc(boolean useleft, boolean usekg, String clrval,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs, int gid)
	{
		int[] myretarr = {-1, -1};
		if (canSideCastleLeftOrRight(useleft, clrval, ignorelist, addpcs, gid))
		{
			int cdiff = 0;
			int kdiff = 0;
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
	public static int[] getLeftOrRightCastleSideNewCastleOrKingLoc(boolean useleft, boolean usekg, String clrval, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, usekg, clrval, null, null, gid);
	}
	public static int[] getRightCastleSideNewKingLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, true, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getRightCastleSideNewCastleLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, false, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getLeftCastleSideNewKingLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, true, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getLeftCastleSideNewCastleLoc(String clrval, int[][] ignorelist,
		ArrayList<ChessPiece> addpcs, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, false, clrval, ignorelist, addpcs, gid);
	}
	public static int[] getRightCastleSideNewKingLoc(String clrval, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, true, clrval, gid);
	}
	public static int[] getRightCastleSideNewCastleLoc(String clrval, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(false, false, clrval, gid);
	}
	public static int[] getLeftCastleSideNewKingLoc(String clrval, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, true, clrval, gid);
	}
	public static int[] getLeftCastleSideNewCastleLoc(String clrval, int gid)
	{
		return getLeftOrRightCastleSideNewCastleOrKingLoc(true, false, clrval, gid);
	}
	//non-static version convenience methods
	public int[] getLeftOrRightCastleNewCastleOrKingLoc(boolean useleft, boolean usekg)
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
	public static void sideCastleLeftOrRight(String clrval, boolean useleft, int gid,
		int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		if (canSideCastleLeftOrRight(useleft, clrval, ignorelist, addpcs, gid))
		{
			ArrayList<ChessPiece> allpcs = combineBoardAddAndIgnoreLists(ignorelist, addpcs, gid);
			ChessPiece mkg = getCurrentSideKing(clrval, allpcs);
			int oc = -1;
			if (useleft) oc = 0;
			else oc = 7;
			ChessPiece csl = getPieceAt(mkg.getRow(), oc, allpcs);
			int[] nwkgloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, true, clrval, ignorelist, addpcs, gid);
			int[] nwcsloc = getLeftOrRightCastleSideNewCastleOrKingLoc(useleft, false, clrval, ignorelist, addpcs, gid);
			mkg.setLoc(nwkgloc[0], nwkgloc[1]);
			csl.setLoc(nwcsloc[0], nwcsloc[1]);
			mkg.incrementMoveCount();
		}
		else throw new IllegalStateException("" + clrval + " CANNOT CASTLE!");
	}
	public static void sideCastleLeftOrRight(String clrval, boolean useleft, int gid)
	{
		sideCastleLeftOrRight(clrval, useleft, gid, null, null);
	}
	public static void whiteCastleLeftOrRight(boolean useleft, int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		sideCastleLeftOrRight("WHITE", useleft, gid, ignorelist, addpcs);
	}
	public static void whiteCastleLeft(int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		whiteCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	public static void whiteCastleRight(int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		whiteCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	public static void whiteCastleLeft(int gid)
	{
		whiteCastleLeft(gid, null, null);
	}
	public static void whiteCastleRight(int gid)
	{
		whiteCastleRight(gid, null, null);
	}
	public static void blackCastleLeftOrRight(boolean useleft, int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		sideCastleLeftOrRight("BLACK", useleft, gid, ignorelist, addpcs);
	}
	public static void blackCastleLeft(int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		blackCastleLeftOrRight(true, gid, ignorelist, addpcs);
	}
	public static void blackCastleRight(int gid, int[][] ignorelist, ArrayList<ChessPiece> addpcs)
	{
		blackCastleLeftOrRight(false, gid, ignorelist, addpcs);
	}
	public static void blackCastleLeft(int gid)
	{
		blackCastleLeft(gid, null, null);
	}
	public static void blackCastleRight(int gid)
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
