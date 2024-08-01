#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Show, Episode, Toy, UserToy, UserEpisodes, Players, Games, GameMoves, UserPlayers, Moves

# Views go here!
#anyone (not just users, not needed to be logged in) needs to know what:
#shows, episodes, and toys we sell
#anyone should be able to create an account for the site
#a user needs to be able to login and logout
#a user should be allowed to delete their account
#a user should be allowed to change their password
#a user should be allowed to change their username
#a user should be allowed to change their access level (upgrade or downgrade)
#a user should be allowed to get rid of their account
#a user should be allowed to purchase toys, and watch episodes from shows
#a user should be allowed to list the toys, episodes, and shows they have watched
#a user should be allowed to create or delete shows, episodes, and toys
#(if they have that access level)
#a user should be able to change their watch history
#a user should be able to get rid of purchased toys (sell, donate, or throw them out)

class Commonalities:
    useaccslv = True;

    def getValidClassList(self):
        return [User, Show, Episode, Toy, UserToy, UserEpisodes, Players, Games, GameMoves,
                UserPlayers, Moves];

    def isClsValid(self, cls):
        if (cls == None): return False;
        else: return (cls in self.getValidClassList());

    def getTypeStringForClass(self, cls):
        if (cls == None): raise ValueError("the class must not be null and None!");
        else:
            if (self.isClsValid(cls)): return "" + cls.class_name_string;
            else:
                raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getAllOfTypeFromDB(self, cls, retall=True, usrid=0):
        if (retall == True or retall == False): pass;
        else: raise ValueError("retall must be a booleanv value for the variable!");
        if (self.isClsValid(cls)):
            if (retall): return cls.query.all();
            if (cls == UserToy or cls == UserEpisodes or UserPlayers):
                if (usrid == None or type(usrid) != int):
                    raise ValueError("usrid must be a number!");
                else: return cls.query.filter_by(user_id=usrid).all();
            else: return cls.query.all();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getSerializedItem(self, cls, item, numlisttype=3):
        if (item == None): raise ValueError("the item object must not be null or None!");
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (self.isClsValid(cls)):
            if (cls == Games):
                mydictitem = None;
                if (numlisttype == 1): mydictitem = item.to_dict(only=cls.safeserializelist);
                elif (numlisttype == 2): mydictitem = item.to_dict(only=cls.unsafelist);
                elif (numlisttype == 3): mydictitem = item.to_dict(only=cls.full_list);
                else:
                    raise ValueError("numlisttype must be 1 (safe), 2 (unsafe), " +
                                    "or 3 (full) only!");
                mydictitem["can_be_started"] = item.can_be_started();
                mydictitem["playerb_won"] = item.playerb_won();
                #print(f"mydictitem = {mydictitem}");
                return mydictitem;
            else:
                if (numlisttype == 1): return item.to_dict(only=cls.safeserializelist);
                elif (numlisttype == 2): return item.to_dict(only=cls.unsafelist);
                elif (numlisttype == 3): return item.to_dict(only=cls.full_list);
                else:
                    raise ValueError("numlisttype must be 1 (safe), 2 (unsafe), " +
                                    "or 3 (full) only!");
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def getSerializedItemOnly(self, item, numlisttype=3):
        if (item == None): raise ValueError("the item object must not be null or None!");
        elif (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        else: return self.getSerializedItem(type(item), item, numlisttype);

    def getAllOfTypeAndSerializeThem(self, cls, numlisttype=3, retall=True, usrid=0):
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        return [self.getSerializedItem(cls, item, numlisttype)
                for item in self.getAllOfTypeFromDB(cls, retall, usrid)];

    def getItemByID(self, id, cls, usrid=0):
        if (id == None or cls == None or usrid == None):
            raise ValueError("id, usrid and cls must not be null or None!");
        elif (type(id) != int): raise ValueError("id must be an integer!");
        elif (type(usrid) != int): raise ValueError("usrid must be an integer!");
        elif (self.isClsValid(cls)):
            if (cls == UserToy or cls == UserEpisodes or cls == UserPlayers or cls == GameMoves):
                if (cls == UserToy):
                    print(f"usrid = {usrid}");
                    print(f"toy_id = {id}");
                    return cls.query.filter_by(user_id=usrid, toy_id=id).first();
                elif (cls == UserEpisodes):
                    return cls.query.filter_by(user_id=usrid, episode_id=id).first();
                elif (cls == UserPlayers):
                    return cls.query.filter_by(user_id=usrid, player_id=id).first();
                elif (cls == GameMoves):
                    return cls.query.filter_by(game_id=id).all();
                else:
                    raise ValueError("the class was UserToy or UserEpisdes, but now it " +
                                     "is not!");
            else: return cls.query.filter_by(id=id).first();
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");

    def takeItemAndReturnResponse(self, item, cls, numlisttype=3, id=0):
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (id == None or type(id) != int):
            raise ValueError("id must be a number!");
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            if (cls == GameMoves): errmsg += " not found!";
            else: errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        else: return self.getSerializedItem(cls, item, numlisttype), 200;

    def getItemByIDAndReturnResponse(self, id, cls, numlisttype=3, usrid=0):
        item = self.getItemByID(id, cls, usrid);
        return self.takeItemAndReturnResponse(id, item, cls, numlisttype);

    def isLoggedIn(self, msess):
        if (msess == None): raise ValueError("the session object must be defined!");
        mkys = msess.keys();
        if ("user_id" in mkys): pass;
        else: return False;
        if (type(msess["user_id"]) == int): pass;
        else: raise ValueError("the user_id in the session object must be an integer!");
        if (msess["user_id"] < 1): return False;
        else: return True;
    
    def getUserFromTheSession(self, msess):
        if (self.isLoggedIn(msess)): return self.getItemByID(msess["user_id"], User);
        else: return None;

    def getUserFromTheSessionAndReturnResponse(self, msess, numlisttype=3):
        if (self.isLoggedIn(msess)):
            return self.getItemByIDAndReturnResponse(msess["user_id"], User, numlisttype);
        else: return {"error": "401 error no users logged in!"}, 401;

    def isAuthorized(self, msess):
        usrobj = self.getUserFromTheSession(msess);
        if (usrobj == None): return False;
        else: return (usrobj.access_level == 2);

    def makeSureAuthorized(self, msess):
        if (msess == None): raise ValueError("the session object must be defined!");
        isallowed = False;
        try:
           isallowed = self.isAuthorized(msess);
        except Exception as ex:
            if (ex.message == "User not found with that ID!"):
                errmsg = "404 and 500 error: User not found with that ID ";
                errmsg += f"{msess['user_id']}!\n";
                errmsg += "The user ID was from the session object. At one point it was ";
                errmsg += "valid, but now it is not!\n It seems the user was deleted, but ";
                errmsg += "the ID was not removed from the session object!\n";
                return {"error": errmsg}, 500;
            else: raise ex;
        if (isallowed): return {"message": "authorized"}, 200;
        else:
            errmsg = "401 error you are not allowed to do that. You must be logged in and ";
            errmsg += "have creation/deletion access!";
            return {"error": errmsg}, 401;

    def userIsShowOwner(self, cls, msess, item):
        fully_authorized = False;
        if (item == None): return {"message": "authorized"}, 200;
        if (cls == Show or cls == Episode or cls == Toy):
            usrobj = self.getUserFromTheSession(msess);
            if (usrobj == None):
                errmsg = "401 error you are not allowed to do that. You must be ";
                errmsg += "logged in and have creation/deletion access!";
                return {"error": errmsg}, 401;
            else:
                if (cls == Show):
                    #print(item);
                    #print(usrobj);
                    #print(f"item.owner_id = {item.owner_id}");
                    #print(f"usrobj.id = {usrobj.id}");
                    if (item.owner_id == usrobj.id): fully_authorized = True;
                else:
                    if (item.show == None):
                        sw = Show.query.filter_by(id=item.show_id).first();
                        if (sw.owner_id == usrobj.id): fully_authorized = True;
                    else:
                        if (item.show.owner_id == usrobj.id): fully_authorized = True;
            if (fully_authorized): return {"message": "authorized"}, 200;
            else:
                errmsg = "401 error you are not allowed to do that. You must be ";
                errmsg += "logged in and have creation/deletion access! ";
                errmsg += "You must be the show owner to add/remove toys, or episodes!";
                return {"error": errmsg}, 401;
        else: return {"message": "authorized"}, 200;

    def getDataObjectFromRequest(self, rqst):
        if (rqst == None): raise ValueError("the request object must be defined!");
        rfm = rqst.form;
        rjson = rqst.get_json();
        dataobj = None;
        if (rfm == None or len(rfm) < 1): dataobj = rjson;
        elif (rjson == None or len(rjson) < 1): dataobj = rfm;
        else:
            raise ValueError("the form data and the json data were both empty, but " +
                             "should not have been empty!");
        return dataobj;

    #currently uses: session, data, then param
    #what if we want it to use: session, param, data
    #what if we want it to use data, session, param
    #what if we want it to use data, param, session
    #what if we want it to use param, session, data
    #what if we want it to use param, data, session
    def getUserIDFrom(self, msess, dataobj, param):
        notsession = (msess == None);
        notdata = (dataobj == None);
        if (notsession): pass;
        else:
            if ("user_id" in msess.keys()):
                if (msess["user_id"] == 0): notsession = True;
                else: return msess["user_id"];
            else: notsession = True;
        if (notdata): pass;
        else:
            if ("user_id" in dataobj.keys()):
                if (dataobj["user_id"] == 0): notdata = True;
                else: return dataobj["user_id"];
            else: notdata = True;
        return param;

    def getShowIDFrom(self, dataobj, param):
        notdata = (dataobj == None);
        if (notdata): pass;
        else:
            if ("show_id" in dataobj.keys()):
                if (dataobj["show_id"] == 0): notdata = True;
                else: return dataobj["show_id"];
            else: notdata = True;
        return param;

    def getGameMovesItem(self, rqst):
        dataobj = self.getDataObjectFromRequest(rqst);
        print(dataobj);
        return GameMoves.query.filter_by(game_id=dataobj["game_id"], move_id=dataobj["move_id"],
                                         number=dataobj["number"]).first();

    def addOrUpdateItemOnDBAndReturnResponse(self, id, cls, rqst, msess, useadd, showid=0,
                                             numlisttype=3, usrid=0):
        #for the generic post
        #we also get the old data object from the db (only difference from patch)
        #we get the data from the request
        #either form OR json (FRONT-END WILL ONLY GIVE JSON DATA)
        #then we need to validate said data...
        #then we need to add it to the db
        #db.session.add(nwobj);
        #db.session.commit();
        #then we need to return a response
        #return cm.getSerializedItem(Episode, nwobj, numlisttype), 201;
        if (numlisttype == None or type(numlisttype) != int):
            raise ValueError("numlisttype must be a number!");
        if (showid == None or type(showid) != int):
            raise ValueError("showid must be a number!");
        if (id == None or type(id) != int): raise ValueError("id must be a number!");
        if (usrid == None or type(usrid) != int): raise ValueError("usrid must be a number!");
        if (useadd == True or useadd == False): pass;
        else: raise ValueError("useadd must be a boolean value!");
        if (msess == None): raise ValueError("the session object must be defined!");
        if (rqst == None): raise ValueError("the request object must be defined!");
        print(f"useadd = {useadd}");
        print(cls);

        dataobj = self.getDataObjectFromRequest(rqst);
        print(dataobj);

        item = None;
        if (useadd): pass;
        else:
            if (cls == UserToy): itemusrid = dataobj["user_id"];
            else: itemusrid = usrid;
            print(f"itemusrid = {itemusrid}");
            
            if (cls == GameMoves): item = self.getGameMovesItem(rqst);
            else: item = self.getItemByID(id, cls, itemusrid);
            print(item);
            
            if (item == None):
                errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
                errmsg += f", with id {id} not found!";
                return {"error": errmsg}, 404;
        
        if (self.isClsValid(cls)):
            try:
                cls.getValidator().enableValidator();
                bypassfinalcheck = False;
                if (useadd):
                    print("DOING POST HERE!");
                    if (cls == User):
                        if (self.useaccslv):
                            item = cls(name=dataobj["username"],
                                    access_level=dataobj["access_level"]);
                        else: item = cls(name=dataobj["username"]);
                        item.password_hash = dataobj["password"];
                    elif (cls == Players):
                        item = cls(color=dataobj["color"], defers=dataobj["defers"],
                                   game_id=dataobj["game_id"]);
                    elif (cls == UserPlayers):
                        item = cls(user_id=msess["user_id"], player_id=dataobj["player_id"]);
                    elif (cls == Moves):
                        item = cls(contents=dataobj["contents"]);
                    elif (cls == Games):
                        item = cls(playera_won=dataobj["playera_won"],
                                   playera_resigned=dataobj["playera_resigned"],
                                   playerb_resigned=dataobj["playerb_resigned"],
                                   tied=dataobj["tied"], completed=dataobj["completed"],
                                   playera_id=dataobj["playera_id"],
                                   playerb_id=dataobj["playerb_id"]);
                    elif (cls == GameMoves):
                        item = cls(game_id=dataobj["game_id"], move_id=dataobj["move_id"],
                                   number=dataobj["number"]);
                    elif (cls == Show):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                owner_id=msess["user_id"]);
                    elif (cls == Episode):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                season_number=dataobj["season_number"],
                                episode_number=dataobj["episode_number"], show_id=showid);
                        #print(item);
                        myresitem = item.makeSureUniqueShowIDEpnumAndSeasonNumPresent();
                        #print(myresitem);
                    elif (cls == Toy):
                        item = cls(name=dataobj["name"], description=dataobj["description"],
                                price=dataobj["price"], toy_number=dataobj["toy_number"],
                                show_id=self.getShowIDFrom(dataobj, showid));
                        #show-id comes in the dataobj object: dataobj["show_id"]
                        #show-id comes in as a parameter: showid
                        #print(item);
                        myresitem = item.makeSureUniqueShowIDAndToyNumPresent();
                        #print(myresitem);
                    elif (cls == UserEpisodes):
                        #user-id comes in the session object: msess["user_id"]
                        #user-id comes in the dataobj object: dataobj["user_id"]
                        #user-id comes in as a parameter: usrid 
                        item = cls(user_id=self.getUserIDFrom(msess, dataobj, usrid),
                                   episode_id=dataobj["episode_id"]);
                    elif (cls == UserToy):
                        item = cls(user_id=dataobj["user_id"],
                                   toy_id=dataobj["toy_id"], quantity=dataobj["quantity"]);
                    else:
                        raise ValueError("the class must be one of the following: " +
                                        f"{self.getValidClassList()}!");
                    print(f"NEW item = {item}");
                    resobj = self.userIsShowOwner(cls, msess, item);
                    if (resobj[1] == 200): pass;
                    else: return resobj;
                else:
                    print("DOING PATCH HERE!");
                    resobj = self.userIsShowOwner(cls, msess, item);
                    if (resobj[1] == 200): pass;
                    else: return resobj;
                    #oldswid = -1;
                    print(f"item = {item}");
                    print(f"dataobj = {dataobj}");
                    if (cls == Episode or cls == Toy):
                        cv = cls.getValidator();
                        myresitem = cv.genDictItemForIsUniqueCols(item, dataobj, cls);

                    for attr in dataobj:
                        mky = '';
                        if (cls == User):
                            if (attr == "username"): mky = 'name';
                            elif (attr == "password"): mky = 'password_hash';
                            else: mky = '' + attr;
                        else: mky = '' + attr;
                        #print(f"key = {mky}");
                        #print(f"value = {dataobj[attr]}");
                        #print("CHECKING TO SEE IF THE USER IS THE SHOW OWNER DURING PATCH!");
                        resobj = self.userIsShowOwner(cls, msess, item);
                        if (resobj[1] == 200): pass;
                        else: return resobj;
                        #if (mky == "owner_id"): oldswid = item.owner_id;
                        setattr(item, mky, dataobj[attr]);
                    print(f"NEW item = {item}");
                    #print(f"oldswid = {oldswid}");
                    bypassfinalcheck = True;
                print(f"FINAL item = {item}");
                print(f"bypassfinalcheck = {bypassfinalcheck}");
                if (bypassfinalcheck): pass;
                else:
                    print("CHECKING TO SEE IF THE USER IS THE SHOW OWNER AFTER PATCH!");
                    resobj = self.userIsShowOwner(cls, msess, item);
                    if (resobj[1] == 200): pass;
                    else: return resobj;
                if (useadd):
                    if (cls == Episode):
                        #print(item);
                        myresitem = item.makeSureUniqueShowIDEpnumAndSeasonNumPresent();
                        #print(myresitem);
                    elif (cls == Toy):
                        #print(item);
                        myresitem = item.makeSureUniqueShowIDAndToyNumPresent();
                        #print(myresitem);
                db.session.add(item);
                db.session.commit();
            except Exception as ex:
                print(ex);
                errmsg = "422 error invalid data used to ";
                errmsg += f"{('create' if useadd else 'update')}";
                errmsg += f" item of type {self.getTypeStringForClass(cls)}!";
                return {"error": errmsg}, 422;
        else:
            raise ValueError("the class must be one of the following: " +
                             f"{self.getValidClassList()}!");
        statuscode = 0;
        if (useadd): statuscode = 201;
        else: statuscode = 200;
        return self.getSerializedItem(cls, item, numlisttype), statuscode;

    def addItemToDBAndReturnResponse(self, cls, rqst, msess, showid=0, numlisttype=3, usrid=0):
        return self.addOrUpdateItemOnDBAndReturnResponse(0, cls, rqst, msess, True, showid,
                                                         numlisttype, usrid);

    def updateItemOnDBAndReturnResponse(self, id, cls, rqst, msess,
                                        showid=0, numlisttype=3, usrid=0):
        return self.addOrUpdateItemOnDBAndReturnResponse(id, cls, rqst, msess, False, showid,
                                                         numlisttype, usrid);

    def removeItemGivenItemFromDBAndReturnResponse(self, id, cls, item, msess):
        #for the generic delete
        #grab it by its id
        #then remove it from the db
        #db.session.delete(obj);
        #db.session.commit();
        #then return a successful response
        errmsg = "";
        #print("INSIDE DELETE():");
        #print(item);
        if (item == None):
            errmsg = f"404 error item of type {self.getTypeStringForClass(cls)}";
            if (cls == GameMoves): errmsg += " not found!";
            else: errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        else:
            resobj = self.userIsShowOwner(cls, msess, item);
            if (resobj[1] == 200): pass;
            else: return resobj;
        db.session.delete(item);
        db.session.commit();
        msg = f"200 successfully deleted item of type {self.getTypeStringForClass(cls)}";
        if (cls == GameMoves): msg += "!";
        else: msg += f" with id {id}!";
        return {"message": msg}, 200;

    def removeItemGivenItemOnlyFromDBAndReturnResponse(self, item, msess):
        if (item == None): return {"error": "404 error item must not be null or None"}, 404;
        else:
            return self.removeItemGivenItemFromDBAndReturnResponse(item.id, type(item),
                                                                   item, msess);

    def removeItemFromDBAndReturnResponse(self, id, cls, msess, usrid=0):
        #print(f"usrid = {usrid}");
        #print(f"id = {id}");
        #print("NOW CALLING GET ITEM BY ID():");
        item = self.getItemByID(id, cls, usrid);
        #print(item);
        return self.removeItemGivenItemFromDBAndReturnResponse(id, cls, item, msess);

    def postOrPatchAndReturnResponse(self, cls, rqst, msess, useadd, showid=0, id=0,
                                     numlisttype=3, usrid=0):
        resobj = self.makeSureAuthorized(msess);#returns a tuple for the response
        if (resobj[1] == 200):
            return self.addOrUpdateItemOnDBAndReturnResponse(id, cls, rqst, msess, useadd,
                                                             showid, numlisttype, usrid);
        else: return resobj;

    def completeDeleteItemFromDBAndReturnResponse(self, id, cls, msess, usrid=0):
        resobj = cm.makeSureAuthorized(msess);#returns a tuple for the response
        if (resobj[1] == 200):
            return cm.removeItemFromDBAndReturnResponse(id, cls, msess, usrid);
        else: return resobj;

cm = Commonalities();

#what happens on signup?
#the user enters their desired username, password, and other information
#the request will hold this information in either the form or JSON
#then we need to create the new user (POST)
#the user_id will be added to the session object
#then a successful response will be returned

class Signup(Resource):
    def post(self):
        res = cm.addItemToDBAndReturnResponse(User, request, session, 0, 3);
        #print(res);
        if (res[1] in [200, 201]): session["user_id"] = res[0]["id"];
        return res; 

api.add_resource(Signup, "/signup");

#what happens on login?
#the user enters their username and password
#the request will hold this information in either the form or JSON (PATCH)
#the user_id will be added to the session object
#then a successful response will be returned

class Login(Resource):
    def patch(self):
        dataobj = cm.getDataObjectFromRequest(request);
        usr = User.query.filter_by(name=dataobj["username"]).first();
        badusrnm = True;
        err = (usr == None);
        if (err): pass;
        else:
            if (usr.authenticate(dataobj["password"])):
                session["user_id"] = usr.id;
                return cm.getSerializedItem(User, usr, 3), 200;
            else: badusrnm = False;
        errmsg = f"401 error invalid {('username' if badusrnm else 'password')} given!";
        return {"error": errmsg}, 401;

api.add_resource(Login, "/login");

#what happens on logout?
#sees if a valid user is logged in and if so
#removes the user_id from the session object
#returns a sucessful response
#if not, then returns an error, but the user is already logged out...

class Logout(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        session["user_id"] = 0;
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return {"message": "successfully logged out!"}, 200;

api.add_resource(Logout, "/logout");

#what happens on preferences?
#all users must be logged in to view this
#this gets the given user's information (GET)
#only accessible once logged in

class MyUser(Resource):
    def get(self):
        return cm.getUserFromTheSessionAndReturnResponse(session, 3);

    def patch(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.updateItemOnDBAndReturnResponse(usr.id, User, request, session, 0, 3);

api.add_resource(MyUser, "/preferences");

#what happens on unsubscribe?
#all users must be logged in to view this
#deletes the user from the list of users and removes all of their information from the DB
#removes the user_id from the session object
#returns a sucessful response (DELETE)

class Unsubscribe(Resource):
    def delete(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemGivenItemFromDBAndReturnResponse(usr.id, User, usr, session);

api.add_resource(Unsubscribe, "/unsubscribe");


#NEED TO BE ABLE TO CREATE A NEW GAME, GET A GAME, UPDATE THE GAME, PLAY THE GAME, GET STATISTICS

class GamesToJoin(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        gmsazero = Games.query.filter_by(playera_id=0).all();
        gmsbzero = Games.query.filter_by(playerb_id=0).all();
        allgms = [g for g in gmsazero];
        for g in gmsbzero:
            addit = True;
            for og in allgms:
                if (og.id == g.id):
                    addit = False;
                    break;
            if (addit): allgms.append(g);
        return [cm.getSerializedItemOnly(item, 3) for item in allgms], 200;

api.add_resource(GamesToJoin, "/games_to_join");


class AllPlayers(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(Players, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(Players, request, session, 0, 3, usr.id);

api.add_resource(AllPlayers, "/players");

class AllPlayersByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, Players, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, Players, request, session, 0, 3, usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, Players, session, usr.id);

api.add_resource(AllPlayersByID, "/players/<int:id>");

class CreateGameAndPlayer(Resource):
    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            dataobj = cm.getDataObjectFromRequest(request);
            print(dataobj);
            
            plyra = None;
            myg = None;
            usrplyr = None;
            try:
                plyra = Players(color=dataobj["color"], defers=dataobj["defers"], game_id=0);
                db.session.add(plyra);
                db.session.commit();
            except Exception as ex:
                print(ex);
                #db.session.rollback();
                errmsg = "422 error invalid data used to create item of type ";
                errmsg += f"{cm.getTypeStringForClass(Players)}!";
                return {"error": errmsg}, 422;
            try:
                myg = Games(playera_won=False, playera_resigned=False, playerb_resigned=False,
                            tied=False, completed=False, playera_id=0, playerb_id=0);
                db.session.add(myg);
                db.session.commit();
                myg.setPlayerAID(plyra.id);
                plyra.setGameID(myg.id);
            except Exception as ex:
                print(ex);
                #db.session.rollback();
                errmsg = "422 error invalid data used to create item of type ";
                errmsg += f"{cm.getTypeStringForClass(Games)}!";
                return {"error": errmsg}, 422;
            try:
                usrplyr = UserPlayers(user_id=usr.id, player_id=plyra.id);
                db.session.add(usrplyr);
                db.session.commit();
            except Exception as ex:
                print(ex);
                #db.session.rollback();
                #db.session.rollback();
                errmsg = "422 error invalid data used to create item of type ";
                errmsg += f"{cm.getTypeStringForClass(UserPlayers)}!";
                return {"error": errmsg}, 422;
            #print(f"plyra = {plyra}");
            #print("");
            #print(f"myg = {myg}");
            #print("");
            #print(f"usrplyr = {usrplyr}");
            #print("");
            #print(f"plyra.to_dict() = {cm.getSerializedItem(Players, plyra, 3)}");
            #print("");
            #print(f"myg.to_dict() = {cm.getSerializedItem(Games, myg, 3)}");
            #print("");
            #print(f"usrplyr.to_dict() = {cm.getSerializedItem(UserPlayers, usrplyr, 3)}");
            #print("");
            return {"game": cm.getSerializedItem(Games, myg, 3),
                    "user_player": cm.getSerializedItem(UserPlayers, usrplyr, 3)}, 200;

api.add_resource(CreateGameAndPlayer, "/new_game_with_playera");

class JoinGame(Resource):
    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            gm = cm.getItemByID(id, Games, usr.id);
            print(f"gm = {gm}");
            if (gm == None):
                errmsg = f"404 error invalid id {id} used to get the Game!";
                return {"error": errmsg}, 404;
            
            useplyraid = False;
            useplyrbid = False;
            if (gm.playera_id == 0): useplyraid = True;
            elif (gm.playerb_id == 0): useplyrbid = True;
            else:
                print("422 error no available player ids for game!");
                errmsg = f"422 error invalid id {id} for game to join, no available player IDS!";
                return {"error": errmsg}, 422;

            dataobj = cm.getDataObjectFromRequest(request);
            print(dataobj);

            usrplyr = None;
            plyra = None;
            try:
                plyra = Players(color=dataobj["color"], defers=dataobj["defers"], game_id=gm.id);
                db.session.add(plyra);
                db.session.commit();
            except Exception as ex:
                print(ex);
                errmsg = "422 error invalid data used to create item of type ";
                errmsg += f"{cm.getTypeStringForClass(Players)}!";
                return {"error": errmsg}, 422;
            
            if (useplyraid): gm.setPlayerAID(plyra.id);
            elif (useplyrbid): gm.setPlayerBID(plyra.id);
            else:
                errmsg = f"422 error invalid id {id} for game to join, no available player IDS!";
                return {"error": errmsg}, 422;
            try:
                usrplyr = UserPlayers(user_id=usr.id, player_id=plyra.id);
                db.session.add(usrplyr);
                db.session.commit();
            except Exception as ex:
                print(ex);
                #db.session.rollback();
                errmsg = "422 error invalid data used to create item of type ";
                errmsg += f"{cm.getTypeStringForClass(UserPlayers)}!";
                return {"error": errmsg}, 422;
            
            if (gm.can_be_started()):
                print(f"plyra = {plyra}");
                print("");
                print(f"gm = {gm}");
                print("");
                print(f"usrplyr = {usrplyr}");
                print("");
                print(f"plyra.to_dict() = {cm.getSerializedItem(Players, plyra, 3)}");
                print("");
                print(f"gm.to_dict() = {cm.getSerializedItem(Games, gm, 3)}");
                print("");
                print(f"usrplyr.to_dict() = {cm.getSerializedItem(UserPlayers, usrplyr, 3)}");
                print("");
                swapids = False;
                sameclrs = False;
                kickbout = True;
                if (gm.playera.defers == gm.playerb.defers):
                    if (gm.playera.defers):
                        #both defer (ideal)
                        #a is white b is black; no switch required.
                        swapids = False;
                    else:
                        #both do not defer
                        if (gm.playera.color == gm.playerb.color):
                            #they chose the same color a gets it and b gets kicked out
                            sameclrs = True;
                            if (gm.playera.color == "WHITE"): swapids = False;
                            else: swapids = True;
                            kickbout = not(swapids);
                        else:
                            #they chose opposite colors and want them (ideal)
                            if (gm.playera.color == "WHITE"): swapids = False;
                            else: swapids = True;
                else:
                    #deferal status is different (ideal)
                    if (gm.playera.defers):
                        if (gm.playerb.color == "BLACK"): swapids = False;
                        else: swapids = True;
                    else:
                        #player a gets their color and b gets the opposite (ideal)
                        if (gm.playera.color == "WHITE"): swapids = False;
                        else: swapids = True;
                print(f"swapids = {swapids}");
                print(f"sameclrs = {sameclrs}");
                print(f"kickbout = {kickbout}");
                #do the IDS swap first
                if (swapids):
                    tempaid = gm.playera.id;
                    gm.setPlayerAID(gm.playerb.id);
                    gm.setPlayerBID(tempaid);
                if (sameclrs):
                    if (kickbout): gm.setPlayerBID(0);
                    else: gm.setPlayerAID(0);
                try:
                    db.session.add(gm);
                    db.session.commit();
                except Exception as ex:
                    print(ex);
                    errmsg = "422 error invalid player ids data used to create item of type ";
                    errmsg += f"{cm.getTypeStringForClass(Games)}!";
                    return {"error": errmsg}, 422;
            
            print(f"plyra = {plyra}");
            print("");
            print(f"gm = {gm}");
            print("");
            print(f"usrplyr = {usrplyr}");
            print("");
            print(f"plyra.to_dict() = {cm.getSerializedItem(Players, plyra, 3)}");
            print("");
            print(f"gm.to_dict() = {cm.getSerializedItem(Games, gm, 3)}");
            print("");
            print(f"usrplyr.to_dict() = {cm.getSerializedItem(UserPlayers, usrplyr, 3)}");
            print("");
            return {"game": cm.getSerializedItem(Games, gm, 3),
                    "user_player": cm.getSerializedItem(UserPlayers, usrplyr, 3)}, 200;

api.add_resource(JoinGame, "/join_game/<int:id>");

class AllMoves(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(Moves, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(Moves, request, session, 0, 3, usr.id);

api.add_resource(AllMoves, "/moves");

class AllMovesByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, Moves, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, Moves, request, session, 0, 3, usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, Moves, session, usr.id);

api.add_resource(AllMovesByID, "/moves/<int:id>");


class AllGameMoves(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(GameMoves, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(GameMoves, request, session, 0, 3, usr.id);

api.add_resource(AllGameMoves, "/game-moves");

class GetAllMovesForAGame(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, GameMoves, 3, usr.id);

api.add_resource(GetAllMovesForAGame, "/all-moves-for-game/<int:id>");#id is gameid

#HOW TO UPDATE, GET OR REMOVE A GAME MOVE?
#IN ORDER TO GET JUST ONE: WE NEED THE GAME ID, THE MOVE ID, AND THE NUMBER IN THE GAME
class AllGameMovesByID(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            item = cm.getGameMovesItem(request);
            return cm.takeItemAndReturnResponse(item, GameMoves, 3, 0);

    def patch(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(0, GameMoves, request, session, 0, 3,
                                                      usr.id);

    def delete(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            item = cm.getGameMovesItem(request);
            return cm.removeItemGivenItemFromDBAndReturnResponse(0, GameMoves, item, session);

api.add_resource(AllGameMovesByID, "/update-game-moves");


class AllGames(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(Games, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(Games, request, session, 0, 3, usr.id);

api.add_resource(AllGames, "/games");

class AllGamesByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, Games, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, Games, request, session, 0, 3, usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, Games, session, usr.id);

api.add_resource(AllGamesByID, "/games/<int:id>");


class GetStats(Resource):
    def get(self):
        #[{userid: 1, username: "me", wins: 3, losses: 1, forfeits: 0, ties: 6},
        #{userid: 1, username: "me", wins: 3, losses: 1, forfeits: 0, ties: 6}]
        # USER INFO                | COMPLETED GAMES COMPRESSED INTO THIS STUFF
        #allcompletegames = Games.query.filter_by(completed=True).all();
        #all completed games gives me access to which player lost or won or if it is a tie
        #or which player resigned
        #it does not give me access to the username or id
        #we are doing this for all users
        #User has players, players has a list of games...
        
        gameone = {"id": 1, "playera_won": True, "playera_resigned": False,
                   "playerb_resigned": False, "tied": False, "completed": True,
                   "playera_id": 1, "playerb_id": 2};
        gametwo = {"id": 2, "playera_won": False, "playera_resigned": True,
                   "playerb_resigned": False, "tied": False, "completed": True,
                   "playera_id": 5, "playerb_id": 4};
        gamefour = {"id": 4, "playera_won": False, "playera_resigned": False,
                   "playerb_resigned": False, "tied": False, "completed": True,
                   "playera_id": 7, "playerb_id": 3};
        gamefive = {"id": 5, "playera_won": True, "playera_resigned": False,
                   "playerb_resigned": False, "tied": False, "completed": True,
                   "playera_id": 9, "playerb_id": 6};
        gamethree = {"id": 3, "playera_won": True, "playera_resigned": False,
                   "playerb_resigned": True, "tied": False, "completed": True,
                   "playera_id": 8, "playerb_id": 10};
        #wins gameone, wins gametwo ff, loses gamefour
        meplayers = [{"id": 1, "color": "WHITE", "defers": False, "game_id": 1, "game": gameone},
                     {"id": 4, "color": "BLACK", "defers": False, "game_id": 2, "game": gametwo},
                     {"id": 7, "color": "WHITE", "defers": True, "game_id": 4, "game": gamefour}];
        #loses gameone, forfeits gametwo, wins gamefive
        tuplayers = [{"id": 2, "color": "BLACK", "defers": False, "game_id": 1, "game": gameone},
                     {"id": 5, "color": "WHITE", "defers": False, "game_id": 2, "game": gametwo},
                     {"id": 9, "color": "WHITE", "defers": True, "game_id": 5, "game": gamefive}];
        otherplayers = [{"id": 3, "color": "BLACK", "defers": False, "game_id": 4,
                         "game": gamefour},#wins gamefour
                        {"id": 6, "color": "BLACK", "defers": True, "game_id": 5,
                         "game": gamefive},#loses gamefive,
                        {"id": 8, "color": "WHITE", "defers": False, "game_id": 3,
                         "game": gamethree},
                        {"id": 10, "color": "BLACK", "defers": False, "game_id": 3,
                         "game": gamethree}];#wins and loses gamethree,
        myusrs = [{"username": "me", "password": "iRock", "id": 1, "players": meplayers},
                  {"username": "tu", "password": "isuck", "id": 2, "players": tuplayers},
                  {"username": "other", "password": "isucktoo", "id": 3, "players": otherplayers}];
        
        
        usedummydata = False;
        allusers = None;
        if (usedummydata): pass;
        else: allusers = User.query.all();#[{username, password, id, players...}]
        
        #players = [{id, color, defers, game_id, game}]
        
        #allplayersforusers = [usr.players for usr in allusers];
        
        #[[playerobj, ...], [playerobj, ...], ...]
        
        #allplayeridsforusers = [p.id for p in allplayersforusers];#[[0, 1, ...], [4, ...], ...]
        #gamesforusrplayers = [p.game for p in allplayersforusers];#[[gameobj, ...], ...]
        
        #games [{id, playera_won, playera_resigned, playerb_resigned, tied, completed,
        # playera_id, playerb_id}]
        
        #allcompletedgamesforallusers = [p.game for p in allplayersforusers if p.game.completed];
        #print(allcompletedgamesforallusers);
        
        #from the list above, we know the user has one of its players in the game
        #we do not know which one it is one or both
        #from the player IDs we can figure it out
        #if game.playera_id === usr.players.id THIS PLAYER IS THE USER
        #if game.playerb_id === usr.players.id THIS PLAYER IS THE USER
        #for each game, we need to know if the playera_id IS THE USER and playerb_id IS THE USER
        

        #USERNAME    | ID NUMBERS | GAME IDS  |Wins|Loss|Forfeits|Ties|
        #otherplayers| 3, 6, 8, 10| 3, 3, 4, 5| 2  | 1  |   1    |  0 |
        #tuplayers   | 2, 5, 9    | 1, 2, 5   | 1  | 1  |   1    |  0 |
        #meplayers   | 1, 4, 7    | 1, 2, 4   | 2  | 1  |   0    |  0 |
        
        statsarr = [];
        myusrsarr = None;
        if (usedummydata): myusrsarr = myusrs;
        else: myusrsarr = allusers;
        for usr in myusrsarr:
            #print(f"usr = {usr}");

            cusrplayers = None;
            cusrplyrids = None;
            cgamesusrplyers = None;
            if (usedummydata):
                cusrplayers = usr["players"];#cusrplayers = usr.players;
                cusrplyrids = [p["id"] for p in cusrplayers];
                cgamesusrplyers = [p["game"] for p in cusrplayers];
            else:
                cusrplayers = usr.players;
                cusrplyrids = [p.id for p in cusrplayers];
                cgamesusrplyers = [p.game for p in cusrplayers];
            #usrisplyraingames = [(g["playera_id"] == mid) for g in cgamesusrplyers
            #                     for mid in cusrplyrids];
            #usrisplyrbingames = [(g["playerb_id"] == mid) for g in cgamesusrplyers
            #                     for mid in cusrplyrids];
            usrisplyraingames = [];
            usrisplyrbingames = [];
            useallgames = True;
            for n in range(0, 2):
                plridkeystr = ("playera_id" if (n == 0) else "playerb_id");
                #print(f"plridkeystr = {plridkeystr}");
                for g in cgamesusrplyers:
                    gdone = False;
                    if (usedummydata): gdone = g["completed"];
                    else: gdone = g.completed;

                    if (useallgames or gdone):
                        playerisusr = False;
                        for mid in cusrplyrids:
                            #print(f"mid = {mid}");
                            gplyrid = -1;
                            if (usedummydata):
                                #print(g[plridkeystr]);
                                gplyrid = g[plridkeystr];
                            else:
                                if (plridkeystr == "playera_id"): gplyrid = g.playera_id;
                                elif (plridkeystr == "playerb_id"): gplyrid = g.playerb_id;
                                else:
                                    raise ValueError("invalid value for the PLAYER ID " +
                                                     "KEY STRING!");
                            if (gplyrid == mid):
                                #print("FOUND IT");
                                playerisusr = True;
                                break;
                        #print(f"playerisusr = {playerisusr}");
                        if (n == 0): usrisplyraingames.append(playerisusr);
                        else: usrisplyrbingames.append(playerisusr);
            
            #print(f"cusrplayers = {cusrplayers}");
            #print(f"cusrplyrids = {cusrplyrids}");
            #print(f"cgamesusrplyers = {cgamesusrplyers}");
            #print(f"usrisplyraingames = {usrisplyraingames}");
            #print(f"usrisplyrbingames = {usrisplyrbingames}");
            
            #stalemate or draw (tie)
            #checkmate or got put in checkmate (win or loss)
            #do the resignings count as a win for other side or not?

            awins = 0;
            afts = 0;
            aties = 0;
            aloss = 0;
            bwins = 0;
            bfts = 0;
            bties = 0;
            bloss = 0;
            usrfts = 0;
            usrwins = 0;
            usrties = 0;
            usrloss = 0;
            usedgids = [];
            icgms = 0;
            nonungms = 0;
            for n in range(0, len(cgamesusrplyers)):
                g = cgamesusrplyers[n];
                print(g);
                gid = -1;
                if (usedummydata): gid = g['id'];
                else: gid = g.id;
                #print(f"GAME ID = {gid}");
                #print(f"usedgids = {usedgids}");
                if (gid in usedgids):
                    #print("ALREADY COUNTED THIS GAME!");
                    nonungms += 1;
                    continue;
                else: usedgids.append(gid);
                #print(g);
                gdone = False;
                if (usedummydata): gdone = g["completed"];
                else: gdone = g.completed;
                
                if (gdone):
                    gtied = False;
                    if (usedummydata): gtied = g["tied"];
                    else: gtied = g.tied;
                    gawon = False;
                    if (usedummydata): gawon = g["playera_won"];
                    else: gawon = g.playera_won;
                    garesigned = False;
                    if (usedummydata): garesigned = g["playera_resigned"];
                    else: garesigned = g.playera_resigned;
                    gbresigned = False;
                    if (usedummydata): gbresigned = g["playerb_resigned"];
                    else: gbresigned = g.playerb_resigned;
                    if (gtied):
                        aties += 1;
                        bties += 1;
                        usrties += 1;
                    
                    if (gawon and not(garesigned)):
                        awins += 1;
                        bloss += 1;

                    if (garesigned): afts += 1;
                    if (gbresigned): bfts += 1;

                    if (not(gtied) and not(gbresigned) and not(garesigned)):
                        aloss += 1;
                        bwins += 1;

                    if usrisplyraingames[n]:
                        #print("USER IS PLAYER A!");
                        if (garesigned):
                            #print("USER FORFEITED!");
                            usrfts += 1;
                        
                        if (gawon and not(garesigned)):
                            #print("USER WON!");
                            usrwins += 1;

                        if (not(gtied) and not(garesigned) and not(gawon)):
                            #print("USER LOST!");
                            usrloss += 1;#garesigned or
                    
                    if usrisplyrbingames[n]:
                        #print("USER IS PLAYER B!");
                        if (gbresigned):
                            #print("USER FORFEITED!");
                            usrfts += 1;
                        
                        if (gawon and not(gbresigned)):
                            #print("USER LOST!");
                            usrloss += 1;

                        if (not(gtied) and not(gbresigned) and
                            not(gawon)):
                            #print("USER WON!");
                            usrwins += 1;
                else: icgms += 1;
                        

            #print(f"awins = {awins}");
            #print(f"afts = {afts}");
            #print(f"aties = {aties}");
            #print(f"aloss = {aloss}");
            #print(f"bwins = {bwins}");
            #print(f"bfts = {bfts}");
            #print(f"bties = {bties}");
            #print(f"bloss = {bloss}");

            #print(f"usrties = {usrties}");
            #print(f"usrfts = {usrfts}");
            #print(f"usrwins = {usrwins}");
            #print(f"usrloss = {usrloss}");
            #print(f"icgms = {icgms}");
            #print(f"nonungms = {nonungms}");

            if (bwins == aloss and aties == bties and bloss == awins): pass;
            else:
                raise ValueError("the bwins must be the same as aloss and vise-versus " +
                                 "and the number or ties should be the same, but were not!");
            
            #print(f"len(cgamesusrplyers) = {len(cgamesusrplyers)}");
            if ((usrties + usrfts + usrwins + usrloss == len(cgamesusrplyers)) or
                (icgms + nonungms == len(cgamesusrplyers))):
                pass;
            else:
                raise ValueError("the total must add up to the number of non-unique games, " +
                    "but it did not!");
            
            usrid = -1;
            usrname = None;
            if (usedummydata):
                usrid = usr["id"];
                usrname = usr["username"];
            else:
                usrid = usr.id;
                usrname = usr.name;
            
            resobj = {"userid": usrid, "username": usrname, "wins": usrwins,
                "losses": usrloss, "forfeits": usrfts, "ties": usrties};
            statsarr.append(resobj);
        
        #print(f"statsarr = {statsarr}");

        if (len(statsarr) == len(myusrsarr)): pass;
        else:
            raise ValueError("the resultant array must be the same size as the " +
                "users array, but it was not!");

        return statsarr, 200;

api.add_resource(GetStats, "/stats");


#STUFF BELOW THIS LINE NOT NEEDED 7-19-2024



#what happens on watchlist?
#all users must be logged in to view this
#this gets a list of all of the episodes that the user has watched
#a user is also allowed to add items to this list
#a user is also allowed to remove items from this list

class MyEpisodes(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(UserEpisodes, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.addItemToDBAndReturnResponse(UserEpisodes, request, session, 0, 3,
                                                   usr.id);

api.add_resource(MyEpisodes, "/my-watchlist", "/my-episodes");

class MyEpisodesByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, UserEpisodes, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, UserEpisodes, request, session, 0, 3,
                                                      usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, UserEpisodes, session, usr.id);

api.add_resource(MyEpisodesByID, "/my-watchlist/<int:id>", "/my-episodes/<int:id>");

#what happens on my-toys?
#all users must be logged in to view this
#this gets a list of all of the toys that a user has purchased
#a user is allowed to sell or get rid of purchased toys
#a user is allowed to add more items to this list OR
#buy more of one item already bought

class MyToys(Resource):
    def get(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getAllOfTypeAndSerializeThem(UserToy, 3, False, usr.id);

    def post(self):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.addItemToDBAndReturnResponse(UserToy, request, session, 0, 3, usr.id);

api.add_resource(MyToys, "/my-toys");

class MyToysByID(Resource):
    def get(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.getItemByIDAndReturnResponse(id, UserToy, 3, usr.id);

    def patch(self, id):
        usr = cm.getUserFromTheSession(session);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else:
            return cm.updateItemOnDBAndReturnResponse(id, UserToy, request, session, 0, 3,
                                                      usr.id);

    def delete(self, id):
        usr = cm.getUserFromTheSession(session);
        #print("BEGIN DELETE MY TOY:");
        #print(f"id of the item to remove = {id}");
        #print(usr);
        if (usr == None): return {"error": "401 error no users logged in!"}, 401;
        else: return cm.removeItemFromDBAndReturnResponse(id, UserToy, session, usr.id);

api.add_resource(MyToysByID, "/my-toys/<int:id>");

class AllPurchasedToysData(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(UserToy, 3, True, 0);

api.add_resource(AllPurchasedToysData, "/all-user-toy-data");

class Episodes(Resource):
    def get(self, showid):
        #get all episodes, then if they have a certain show id add them to the list
        #then serialize said items on the list
        #then return it
        #return cm.getAllOfTypeAndSerializeThem(Episode, numlisttype), 200;
        return [cm.getSerializedItem(Episode, item, 3)
                for item in cm.getAllOfTypeFromDB(Episode) if item.show_id == showid], 200;
        #sw = cm.getItemByID(showid, Show, 0);
        #if (sw == None):
        #    return {"error": f"404 error show with id {showid} not found!"}, 404;
        #else: return [cm.getSerializedItem(Episode, ep, 3) for ep in sw.episodes], 200;

    def post(self, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Episode, request, session, True,
                                               showid, 0, 3);
        
api.add_resource(Episodes, "/shows/<int:showid>/episodes");

#SHOWID AND ID MUST SOMEHOW CORRESPOND
#WHAT IT SHOULD BE IS SHOWID AND EPNUM NOT ID
#/shows/SHOWID(1)/episodes/EPNUM(2) works, BUT WE NEED TO TRANSLATE IT TO THE ID
#WE WANT TO FIND THE ITEM WHERE BOTH OF THOSE ARE THE CASE
class EpisodesByID(Resource):
    def getIDForTheEpisode(self, showid, epnum):
        myep = Episode.query.filter_by(show_id=showid, episode_number=epnum).first();
        if (myep == None): return -1;
        else: return myep.id;

    def get(self, showid, epnum):
        id = self.getIDForTheEpisode(showid, epnum);
        return cm.getItemByIDAndReturnResponse(id, Episode, 3);

    def patch(self, epnum, showid):
        #you must be logged in first and be authorized
        id = self.getIDForTheEpisode(showid, epnum);
        return cm.postOrPatchAndReturnResponse(Episode, request, session, False,
                                               showid, id, 3);

    def delete(self, showid, epnum):
        #you must be logged in first and be authorized
        id = self.getIDForTheEpisode(showid, epnum);
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Episode, session);

api.add_resource(EpisodesByID, "/shows/<int:showid>/episodes/<int:epnum>");

class OtherEpisodesByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Episode, 3);

    def patch(self, id):
        item = cm.getItemByID(id, Episode, cm.getUserIDFrom(session, None, 0));
        if (item == None):
            errmsg = f"404 error item of type {cm.getTypeStringForClass(Episode)}";
            errmsg += f", with id {id} not found!";
            return {"error": errmsg}, 404;
        else:
            return cm.postOrPatchAndReturnResponse(Episode, request, session, False,
                                               item.show.id, id, 3);

    def delete(self, id):
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Episode, session);

api.add_resource(OtherEpisodesByID, "/episodes_by_ID/<int:id>");

class Shows(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Show, 3), 200;

    def post(self):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Show, request, session, True, 0, 0, 3);

api.add_resource(Shows, "/shows");

class ShowsById(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Show, 3);

    def patch(self, id):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Show, request, session, False, id, id, 3);

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Show, session);

api.add_resource(ShowsById, "/shows/<int:id>");

class CheapToys(Resource):
    def get(self):
        #get all the toys
        #check if the price is less than 10
        #then add it
        mtys = Toy.query.filter(Toy.price <= 10).all();
        return [mty.to_dict(Toy.full_list) for mty in mtys], 200;

api.add_resource(CheapToys, "/cheaptoys");

class Toys(Resource):
    def get(self):
        return cm.getAllOfTypeAndSerializeThem(Toy, 3), 200;

    def post(self):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, True, 0, 0, 3);

api.add_resource(Toys, "/toys");

class ToysByID(Resource):
    def get(self, id):
        return cm.getItemByIDAndReturnResponse(id, Toy, 3);

    def patch(self, id):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, False, 0, id, 3);

    def delete(self, id):
        #you must be logged in first and be authorized
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Toy, session);

api.add_resource(ToysByID, "/toys/<int:id>");

class ToysForShow(Resource):
    def get(self, showid):
        return [cm.getSerializedItem(Toy, item, 3)
                for item in cm.getAllOfTypeFromDB(Toy) if item.show_id == showid], 200;
        #sw = cm.getItemByID(showid, Show, 0);
        #if (sw == None): return {"error": f"404 error show with id {showid} not found!"}, 404;
        #else: return [cm.getSerializedItem(Toy, ty, 3) for ty in sw.toys], 200;

    def post(self, showid):
        #you must be logged in first and be authorized
        return cm.postOrPatchAndReturnResponse(Toy, request, session, True, showid, 0, 3);

api.add_resource(ToysForShow, "/shows/<int:showid>/toys");

#WRONG SHOWID AND ID MUST SOMEHOW CORRESPOND
#WHAT IT SHOULD BE IS SHOWID AND TOYNUM NOT ID
#/shows/SHOWID(1)/toys/TOYNUM(2) works, BUT WE NEED TO TRANSLATE IT TO THE ID
#WE WANT TO FIND THE ITEM WHERE BOTH OF THOSE ARE THE CASE
class ToysForShowByID(Resource):
    def getIDForTheToy(self, showid, toynum):
        myty = Toy.query.filter_by(show_id=showid, toy_number=toynum).first();
        if (myty == None): return -1;
        else: return myty.id;

    def get(self, toynum, showid):
        id = self.getIDForTheToy(showid, toynum);
        return cm.getItemByIDAndReturnResponse(id, Toy, 3);

    def patch(self, toynum, showid):
        #you must be logged in first and be authorized
        id = self.getIDForTheToy(showid, toynum);
        return cm.postOrPatchAndReturnResponse(Toy, request, session, False, showid, id, 3);

    def delete(self, toynum, showid):
        #you must be logged in first and be authorized
        id = self.getIDForTheToy(showid, toynum);
        return cm.completeDeleteItemFromDBAndReturnResponse(id, Toy, session);

api.add_resource(ToysForShowByID, "/shows/<int:showid>/toys/<int:toynum>");


#THIS STUFF IS ALWAYS NEEDED

@app.route('/')
def index():
    return '<h1>Project Server</h1>'


if __name__ == '__main__':
    app.run(port=5555, debug=True)

