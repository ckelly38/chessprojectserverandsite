#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
#from faker import Faker

# Local imports
from app import app
from models import db, User, Games, GameMoves, Players, UserPlayers, Moves

def bulkPrintAndCommitToDB(mlst, printit=True):
    for mobj in mlst:
        if (printit): print(mobj);
        db.session.add(mobj);
        db.session.commit();

if __name__ == '__main__':
    #fake = Faker()
    #Players(id, color, defers, game_id);
    #UserPlayers(user_id, player_id);
    #Moves(id, text);
    #Games(id, playera_won, playera_resigned, playerb_resigned, tied, completed,
    # playera_id, playerb_id);
    #GameMoves(game_id, move_id, number);
    with app.app_context():
        print("Starting seed...");
        # Seed code goes here!
        print("BEGIN CLEARING DATABASE OF EXISTING DATA:");
        clrdb = True;
        if (clrdb):
            mycls = [User, Games, GameMoves, Players, UserPlayers, Moves];
            for mcls in mycls:
                mcls.query.delete();
        print("DATABASE CLEARED BEGIN CREATING DUMMY DATA!");
        User.getValidator().enableValidator();
        cn = User(id=1, name="CN");
        cn.password_hash = "cnrocks";
        print(cn);
        db.session.add(cn);
        db.session.commit();
        kdone = User(id=2, name="Me");
        kdone.password_hash = "dummyfan";
        print(kdone);
        db.session.add(kdone);
        db.session.commit();
        kdtwo = User(id=3, name="MewTwo");
        kdtwo.password_hash = "dummyfantwo";
        print(kdtwo);
        db.session.add(kdtwo);
        db.session.commit();
        print("DONE CREATING DUMMY USERS!");
        myfpr = Players(id=1, color="WHITE", defers=False);#, game_id=0
        print(myfpr);
        db.session.add(myfpr);
        db.session.commit();
        myopr = Players(id=2, color="BLACK", defers=False);#, game_id=0
        print(myopr);
        db.session.add(myopr);
        db.session.commit();
        print("DONE CREATING DUMMY PLAYERS!");
        upsone = UserPlayers(user_id=1, player_id=1);
        upstwo = UserPlayers(user_id=1, player_id=2);
        print(upsone);
        db.session.add(upsone);
        db.session.commit();
        print(upstwo);
        db.session.add(upstwo);
        db.session.commit();
        print("DONE CREATING DUMMY USER PLAYERS!");
        myg = Games(id=1, playera_won=False, playera_resigned=False, playerb_resigned=False,
                    tied=False, completed=False, playera_id=myfpr.id, playerb_id=myopr.id);
        print(myg);
        db.session.add(myg);
        db.session.commit();
        myfpr.setGameID(myg.id);
        myopr.setGameID(myg.id);
        db.session.add(myfpr);
        db.session.commit();
        db.session.add(myopr);
        db.session.commit();
        myog = Games(id=2, playera_won=False, playera_resigned=False, playerb_resigned=False,
                    tied=False, completed=False);#PROBLEM HERE
        print(myog);
        db.session.add(myog);
        db.session.commit();
        print("DONE CREATING DUMMY GAMES!");
        mvpnout = Moves(id=1, text="WPND7TOD5");#PROBLEM HERE
        print(mvpnout);
        db.session.add(mvpnout);
        db.session.commit();
        print("DONE CREATING DUMMY MOVES!");
        gmfmv = GameMoves(game_id=1, move_id=1, number=1);
        print(gmfmv);
        db.session.add(gmfmv);
        db.session.commit();
        print("DONE MAKING THE FIRST MOVE IN THE DB FOR THE GAME!");
        print("DONE SEEDING THE DATABASE!");
        print();

        #test the constraints and validations for the database here and now
        print("BEGIN CONSTRAINTS AND VALIDATIONS TESTS NOW:");
        
        for n in range(2):
            if (n == 0): User.getValidator().disableValidator();
            else: User.getValidator().enableValidator();
            if (n == 0): print("BEGIN DB CONSTRAINT TESTS NOW:");
            else: print("BEGIN DB VALIDATIONS TESTS NOW:");
            
            unitstfailed = True;
            try:
                ocn = User(id=4, name="CN");
                ocn.password_hash = "cnrocks";
                print(ocn);
                db.session.add(ocn);
                db.session.commit();
            except:
                print("USERNAME MUST BE UNIQUE: TEST PAST!");
                unitstfailed = False;
                #this needs to be called everytime to keep the initial session
                #otherwise the errors persist causing problems
                db.session.rollback();
            if (unitstfailed): raise Exception("unique constraint test failed!");

            unitstfailed = True;
            try:
                okdfr = User(id=4, name="");
                okdfr.password_hash = "cnrocks";
                print(okdfr);
                db.session.add(okdfr);
                db.session.commit();
            except:
                print("USERNAME MUST NOT BE BLANK: TEST PAST!");
                unitstfailed = False;
                db.session.rollback();
            if (unitstfailed): raise Exception("username must not be blank test failed!");

            if (n == 0): print("DONE WITH DB CONSTRAINT TESTS NOW: ALL PAST!");
            else: print("DONE WITH DB VALIDATIONS TESTS NOW: ALL PAST!");
            print("");
        User.getValidator().enableValidator();
        print("ALL CONSTRAINTS AND VALIDATIONS TESTS PAST!");
