from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import expression

from config import db, bcrypt, metadata

class GenerateSerializableRulesClass:
    def combineLists(self, lista, listb):
        cmbserializelist = ["" + item for item in lista];
        for item in listb:
            cmbserializelist.append(item);
        return cmbserializelist;

    def combineThreeLists(self, lista, listb, listc):
        cmblistab = self.combineLists(lista, listb);
        return self.combineLists(cmblistab, listc);

    def prependStringToListItems(self, mstr, mlist):
        return ["" + mstr + item for item in mlist];

    def getSafeListForClassName(self, clsnm):
        if (clsnm == "User"): return ["id", "name"];#, "access_level"
        elif (clsnm == "Moves"): return ["id", "text"];
        elif (clsnm == "Games"):
            return ["id", "playera_won", "playera_resigned", "playerb_resigned", "tied",
                    "completed", "playerb_won", "playera_id", "playerb_id"];#"can_be_started", 
        elif (clsnm == "GameMoves"): return ["number", "game_id", "move_id"];
        elif (clsnm == "Players"): return ["id", "color", "defers", "game_id"];
        elif (clsnm == "UserPlayers"): return ["user_id", "player_id"];
        #not needed below
        elif (clsnm == "Show"): return ["id", "name", "description", "owner_id"];
        elif (clsnm == "Episode"):
            return ["id", "name", "description", "season_number", "episode_number", "show_id"];
        elif (clsnm == "Toy"): return ["id", "name", "description", "price", "toy_number"];
        elif (clsnm == "UserEpisodes"): return [];
        elif (clsnm == "UserToy"): return ["quantity"];
        else:
            raise ValueError(f"clsnm {clsnm} must be User, Show, Episode, Toy, " +
                             "UserEpisodes, or UserToy, but it was not!");
    
    def genUnSafeListForClassName(self, clsnm):
        #safe lists needed to generate the unsafe lists
        epsafelist = self.getSafeListForClassName("Episode");
        tsafelist = self.getSafeListForClassName("Toy");
        swsafelist = self.getSafeListForClassName("Show");
        usrsafelist = self.getSafeListForClassName("User");
        gmssafelist = self.getSafeListForClassName("Games");
        mvssafelist = self.getSafeListForClassName("Moves");
        plyrssafelist = self.getSafeListForClassName("Players");
        #unsafe lists
        #games unsafe list
        gmsunsafelistwiths = self.prependStringToListItems("games.", gmssafelist);
        gmsunsafelistnos = self.prependStringToListItems("game.", gmssafelist);
        #moves unsafe list
        mvsunsafelistwiths = self.prependStringToListItems("moves.", mvssafelist);
        mvsunsafelistnos = self.prependStringToListItems("moves.", mvssafelist);
        #players unsafe list
        plyrsunsafelistwiths = self.prependStringToListItems("players.", plyrssafelist);
        plyrsunsafelistnos = self.prependStringToListItems("player.", plyrssafelist);
        #user unsafe lists
        usrunsafelistwiths = self.prependStringToListItems("users.", usrsafelist);
        usrunsafelistnos = self.prependStringToListItems("user.", usrsafelist);
        
        #not needed below
        #show unsafe lists
        swunsafelist = self.prependStringToListItems("show.", swsafelist);
        #episode unsafe lists
        epunsafelistwiths = self.prependStringToListItems("episodes.", epsafelist);
        epunsafelistnos = self.prependStringToListItems("episode.", epsafelist);
        #toy unsafe lists
        tunsafelistwiths = self.prependStringToListItems("toys.", tsafelist);
        tunsafelistnos = self.prependStringToListItems("toy.", tsafelist);
        
        #get the return list here
        if (clsnm == "User"):
            swlist = self.prependStringToListItems("episodes.", swunsafelist);
            return self.combineThreeLists(epunsafelistwiths, swlist, tunsafelistwiths);
        elif (clsnm == "Moves"):
            return gmsunsafelistwiths;#games
        elif (clsnm == "Players"):
            return self.combineLists(usrunsafelistnos, gmsunsafelistnos);#user, game
        elif (clsnm == "GameMoves"):
            return self.combineLists(gmsunsafelistnos, mvsunsafelistnos);#game, move
        elif (clsnm == "UserPlayers"):
            return self.combineLists(usrunsafelistnos, plyrsunsafelistnos);#user, player
        elif (clsnm == "Games"):
            plyraunsafelist = self.prependStringToListItems("playera.", plyrssafelist);
            plyrbunsafelist = self.prependStringToListItems("playerb.", plyrssafelist);
            return self.combineThreeLists(plyraunsafelist, plyrbunsafelist, mvsunsafelistwiths);
            #playera, playerb, moves
        #elif (clsnm == ?):
        #    return self.combineLists(?, ?);#?
        #not needed below
        elif (clsnm == "Show"):
            usrlist = self.prependStringToListItems("owner.", usrsafelist);
            return self.combineThreeLists(epunsafelistwiths, tunsafelistwiths, usrlist);
        elif (clsnm == "Episode" or clsnm == "Toy"):
            return self.combineLists(swunsafelist, usrunsafelistwiths);
        elif (clsnm == "UserEpisodes"):
            swlist = self.prependStringToListItems("episode.", swunsafelist);
            return self.combineThreeLists(usrunsafelistnos, epunsafelistnos, swlist);
        elif (clsnm == "UserToy"):
            swlist = self.prependStringToListItems("toy.", swunsafelist);
            return self.combineThreeLists(usrunsafelistnos, tunsafelistnos, swlist);
        else:
            raise ValueError(f"clsnm {clsnm} must be User, Show, Episode, Toy, " +
                             "UserEpisodes, or UserToy, but it was not!");
    
    def getUnOrSafeListForClassName(self, clsnm, usesafe=True):
        if (usesafe == True or usesafe == False): pass;
        else: raise ValueError("usesafe must be a boolean variable with a boolean value!");
        if (usesafe): return self.getSafeListForClassName(clsnm);
        else: return self.genUnSafeListForClassName(clsnm);

genlists = GenerateSerializableRulesClass();

class MyValidator:
    disablevalidator = False;

    def disableValidator(self):
        self.disablevalidator = True;
    
    def enableValidator(self):
        self.disablevalidator = False;
    
    def isenabled(self): return (not(self.disablevalidator));

    def stringHasAtMinimumXChars(self, mstr, x):
        if (x == None or type(x) != int): raise ValueError("x must be a number");
        elif (x < 0): raise ValueError("the minimum allowed for x is zero!");
        if (self.disablevalidator): return True;
        if (x < 1): return True;
        else:
            if (mstr == None): return False;
            else: return (not(len(mstr) < x));

    #no max is anything less than 0
    def stringHasAtMaximumXChars(self, mstr, x):
        if (x == None or type(x) != int): raise ValueError("x must be a number");
        elif (x < 0): return True;
        if (self.disablevalidator): return True;
        if (x < 1):
            if (mstr == None or len(mstr) < 1): return True;
            else: return False;
        else:
            if (mstr == None): return False;
            else: return (not(x < len(mstr)));

    def stringHasAtMinimumXAndAtMaximumYChars(self, mstr, x, y):
        return (self.stringHasAtMinimumXChars(mstr, x) and
            self.stringHasAtMaximumXChars(mstr, y));

    def isstringnotblank(self, val, typestr):
        vlen = self.stringHasAtMinimumXChars(val, 1);
        if (vlen): return val;
        else: raise ValueError(f"{typestr} must not be blank!");

    def isnamevalid(self, val, typestr, cls):
        self.isstringnotblank(val, typestr);
        unms = [usr.name for usr in cls.query.all()];
        if (val in unms): raise ValueError(f"{typestr} must be unique!");
        else: return val;

    def genColStringWithAndBeforeLastItem(self, cols):
        mystr = "";
        for n in range(len(cols)):
            if (n + 1 < len(cols)):
                if (n == 0): mystr += "" + cols[n];
                else: mystr += ", " + cols[n];
            else: mystr += ", and " + cols[n];
        return mystr;

    def isuniquecols(self, item, cls, cols):
        if (item == None): raise ValueError("item must not be None or null!");
        if (cls == None): raise ValueError("cls must not be None or null!");
        if (cols == None): return item;
        print(item);
        #print incoming data
        for mky in cols: print(f"{mky} = {item[mky]}");
        alldbitems = [mdbitem.to_dict() for mdbitem in cls.query.all()];
        for dbitem in alldbitems: print(dbitem);
        for dbitem in alldbitems:
            itemisamatch = True;
            for mky in cols:
                if (dbitem[mky] == item[mky]): pass;
                else:
                    itemisamatch = False;
                    break;
            if (itemisamatch):
                raise ValueError("the " + self.genColStringWithAndBeforeLastItem(cols) +
                                 " were already found on the DB! They must be unique!");                  
        return item;

    def genDictItemWithNewDataObjAndReturnIsUniqueCols(self, item, nvalobj, cls):
        if (item == None): raise ValueError("item must not be None or null!");
        if (cls == None): raise ValueError("cls must not be None or null!");
        myitemdict = item.to_dict();
        print(f"OLD myitemdict = {myitemdict}");
        for mky in nvalobj: myitemdict[mky] = nvalobj[mky];
        print(f"NEW myitemdict = {myitemdict}");
        cols = None;
        if (cls == Episode): cols = ["episode_number", "season_number", "show_id"];
        elif (cls == Toy): cols = ["toy_number", "show_id"];
        else: raise ValueError("cls must be Episode or Toy, but it was not!");
        return self.isuniquecols(myitemdict, cls, cols);
    
    def genDictItemForIsUniqueCols(self, item, nvalobj, cls):
        return self.genDictItemWithNewDataObjAndReturnIsUniqueCols(item, nvalobj, cls);

mv = MyValidator();

# Models go here!
class User(db.Model, SerializerMixin):
    __tablename__ = "users";

    __table_args__ = (db.CheckConstraint("length(name) >= 1"),);
    #db.CheckConstraint("access_level == 1 OR access_level == 2")
    
    class_name_string = "User";

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    name = db.Column(db.String, unique=True, nullable=False);
    _password_hash = db.Column(db.String);
    #access_level = db.Column(db.Integer, default=1);
    #every user has edit access (they can change their own toys)
    #when access_level is 2 (they can create or delete their own toys)
    
    #safeserializelist = ["id", "name", "access_level"];
    safeserializelist = genlists.getUnOrSafeListForClassName("User", True);
    unsafelist = genlists.getUnOrSafeListForClassName("User", False);
    #unsafelist = ["episodes.id", "episodes.name", "episodes.description",
    #              "episodes.show.id", "episodes.show.name", "episodes.show.description",
    #              "toys.id", "toys.name", "toys.description"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    

    #serialize_rules = ("-episodes.user", "-toys.user", "-user_toys.user",
    #                   "-user_toys.toy.users", "-episodes.show.owner",
    #                   "-toys.user_toys.user", "-toys.user_toys.toy.users",
    #                   "-episodes.show.toys.user_toys.user",
    #                   "-episodes.show.toys.user_toys.toy.users",
    #                   "-episodes.show.toys.users", "-episodes.show.toys.show");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);


    #other stuff after that
    userplayers = db.relationship("UserPlayers", back_populates="user",
                                cascade="all, delete-orphan");
    players = db.relationship("Players", secondary="user_players", back_populates="user");

    episodes = db.relationship("Episode", secondary="user_episodes", back_populates="users");
    toys = db.relationship("Toy", secondary="user_toys", back_populates="users");
    user_toys = db.relationship("UserToy", back_populates="user",
                                cascade="all, delete-orphan");

    @hybrid_property
    def password_hash(self):
        raise AttributeError("not allowed to view the password hashes from an outside class!");

    @password_hash.setter
    def password_hash(self, val):
        print("SETTING A NEW PASSWORD:");
        print(f"val = {val}");
        phsh = bcrypt.generate_password_hash(val.encode("utf-8"));
        self._password_hash = phsh.decode("utf-8");
    
    def authenticate(self, val):
        return bcrypt.check_password_hash(self._password_hash, val.encode("utf-8"));

    #validation code
    @classmethod
    def getValidator(cls): return mv;

    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isnamevalid(val, "username", User);

    #@validates("access_level")
    #def isaccesslevelvalid(self, key, val):
    #    if (val == 1 or val == 2): return val;
    #    else: raise ValueError("invalid value found and used here for access_level!");

    #def getEpisodeIds(self):
    #    return [ep.id for ep in self.episodes];

    def __repr__(self):
        mystr = f"<User id={self.id}, name={self.name}";
        #mystr += f", access-level={self.access_level}, ";
        #mystr += f"episode_ids={self.getEpisodeIds()}";
        mystr += ">";
        return mystr;

class Players(db.Model, SerializerMixin):
    __tablename__ = "players";

    class_name_string = "Players";

    id = db.Column(db.Integer, primary_key=True);
    color = db.Column(db.String, nullable=False);
    defers = db.Column(db.Boolean, default=False, nullable=False);
    game_id = db.Column(db.Integer, db.ForeignKey("games.id", use_alter=True), default=0);

    game = db.relationship("Games", foreign_keys=[game_id]);
    userplayers = db.relationship("UserPlayers", back_populates="player",
                                cascade="all, delete-orphan");
    user = db.relationship("User", secondary="user_players", back_populates="players");

    safeserializelist = genlists.getUnOrSafeListForClassName("Players", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Players", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    serialize_only = tuple(safeserializelist);

    def setGameID(self, val):
        if (type(val) == int):
            if (val < 0): raise ValueError("value must be at least zero (0), but it was not!");
            else: self.game_id = val;
        else: raise ValueError("GameID must be an integer!");

    def __repr__(self):
        mystr = f"<Player id={self.id}, color={self.color}, defers={self.defers}, ";
        mystr += f"game_id={self.game_id}>";
        return mystr;

class UserPlayers(db.Model, SerializerMixin):
    __tablename__ = "user_players";

    class_name_string = "UserPlayers";

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True);
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), primary_key=True);
    
    user = db.relationship("User");
    player = db.relationship("Players");

    safeserializelist = genlists.getUnOrSafeListForClassName("UserPlayers", True);
    unsafelist = genlists.getUnOrSafeListForClassName("UserPlayers", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    serialize_only = tuple(safeserializelist);

    def __repr__(self):
        mystr = f"<UserPlayer user_id={self.user_id}, player_id={self.player_id}>";
        return mystr;

class Moves(db.Model, SerializerMixin):
    __tablename__ = "moves";

    __table_args__ = (db.CheckConstraint("length(contents) >= 3"),);
    #db.CheckConstraint("access_level == 1 OR access_level == 2")

    class_name_string = "Moves";

    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    contents = db.Column(db.String, unique=True, nullable=False);

    gamemoves = db.relationship("GameMoves", back_populates="move",
                                cascade="all, delete-orphan");
    games = db.relationship("Games", secondary="game_moves", back_populates="moves");
    

    safeserializelist = genlists.getUnOrSafeListForClassName("Moves", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Moves", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    serialize_only = tuple(safeserializelist);

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("contents")
    def ismovetextvalid(self, key, val):
        if (mv.stringHasAtMinimumXChars(val, 3)): return val;
        else: raise ValueError("the string must have at minimum 3 characters, but it did not!");

    def __repr__(self):
        mystr = f"<Move id={self.id}, contents={self.contents}>";
        return mystr;

class Games(db.Model, SerializerMixin):
    __tablename__ = "games";

    #__table_args__ = (db.CheckConstraint("length(name) >= 1"),);
    #db.CheckConstraint("access_level == 1 OR access_level == 2")

    class_name_string = "Games";

    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    playera_won = db.Column(db.Boolean, default=False, nullable=False);
    playera_resigned = db.Column(db.Boolean, default=False, nullable=False);
    playerb_resigned = db.Column(db.Boolean, default=False, nullable=False);
    tied = db.Column(db.Boolean, default=False, nullable=False);
    completed = db.Column(db.Boolean, default=False, nullable=False);
    
    playera_id = db.Column(db.Integer, db.ForeignKey("players.id", use_alter=True),
                           nullable=True, default=0);
    playerb_id = db.Column(db.Integer, db.ForeignKey("players.id", use_alter=True),
                           nullable=True, default=0);
    
    def setPlayerID(self, val, usea):
        if (type(usea) == bool): pass;
        else: raise ValueError("usea must be a boolean value, but it was not!");
        if (type(val) == int):
            if (val < 0): raise ValueError("value must be at least zero (0), but it was not!");
            else:
                if (usea): self.playera_id = val;
                else: self.playerb_id = val;
        else: raise ValueError("PlayerID must be an integer!");

    def setPlayerAID(self, val):
        self.setPlayerID(val, True);
    
    def setPlayerBID(self, val):
        self.setPlayerID(val, False);

    #unsafelist stuff below
    playera = db.relationship("Players", foreign_keys=[playera_id]);
    playerb = db.relationship("Players", foreign_keys=[playerb_id]);
    gamemoves = db.relationship("GameMoves", back_populates="game",
                                cascade="all, delete-orphan");
    moves = db.relationship("Moves", secondary="game_moves", back_populates="games");

    #does not need to be serialized
    def can_be_started(self, isondb=True):
        if (isondb): return not((self.playera_id < 1) or (self.playerb_id < 1));
        else: return False;

    def playerb_won(self):
        if (self.playera_won or self.playerb_resigned or self.tied): return False;
        else:
            if (self.playera_resigned or self.completed): return True;
            else: return False;

    safeserializelist = genlists.getUnOrSafeListForClassName("Games", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Games", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    serialize_only = tuple(safeserializelist);

    def __repr__(self, isondb=True):
        mystr = f"<Games id={self.id}, playera_won={self.playera_won}, ";
        mystr += f"playera_resigned={self.playera_resigned}, ";
        mystr += f"playerb_resigned={self.playerb_resigned}, ";
        mystr += f"tied={self.tied}, completed={self.completed}, ";
        mystr += f"playera_id={self.playera_id}, playerb_id={self.playerb_id}, ";
        mystr += f"playerb_won={self.playerb_won()}, can_be_started={self.can_be_started(isondb)}>";
        return mystr;

class GameMoves(db.Model, SerializerMixin):
    __tablename__ = "game_moves";

    #__table_args__ = (db.CheckConstraint("length(name) >= 1"),);
    #db.CheckConstraint("access_level == 1 OR access_level == 2")

    class_name_string = "GameMoves";

    game_id = db.Column(db.Integer, db.ForeignKey("games.id"), primary_key=True);
    move_id = db.Column(db.Integer, db.ForeignKey("moves.id"), primary_key=True);
    number = db.Column(db.Integer, default=0);

    game = db.relationship("Games");
    move = db.relationship("Moves");

    safeserializelist = genlists.getUnOrSafeListForClassName("GameMoves", True);
    unsafelist = genlists.getUnOrSafeListForClassName("GameMoves", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    serialize_only = tuple(safeserializelist);

    def __repr__(self):
        mystr = f"<GameMoves game_id={self.game_id}, move_id={self.move_id}, ";
        mystr += f"number={self.number}>";
        return mystr;

#NOT NEEDED BELOW THIS POINT 7-20-2024


class Show(db.Model, SerializerMixin):
    __tablename__ = "shows";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"));

    class_name_string = "Show";

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    name = db.Column(db.String, unique=True, nullable=False);
    description = db.Column(db.String, nullable=False);

    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), default=0);

    #serialize_rules = ("-episodes.show", "-owner.episodes.show", "-toys.show",
    #                   "-toys.user_toys.toy.show", "-users.episodes.show",
    #                   "-users.user_toys.toy.show");
    #safeserializelist = ["id", "name", "description"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Show", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Show", False);
    #unsafelist = ["episodes.id", "episodes.name", "episodes.description", "toys.id",
    #              "toys.name", "toys.description", "owner.id", "owner.name",
    #              "owner.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    #serialize_only = ("id", "name", "description", "episodes.id", "episodes.name",
    #                  "episodes.description", "toys.id", "toys.name", "toys.description",
    #                  "owner.id", "owner.name", "owner.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    episodes = db.relationship("Episode", back_populates="show", cascade="all, delete-orphan");
    owner = db.relationship("User");
    toys = db.relationship("Toy", back_populates="show", cascade="all, delete-orphan");

    #validation code
    @classmethod
    def getValidator(cls): return mv;

    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isnamevalid(val, "show name", Show);
    
    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "show description");

    def getEpisodeIds(self):
        return [ep.id for ep in self.episodes];

    def __repr__(self):
        mystr = f"<Show id={self.id}, owner-id={self.owner_id}, ";
        mystr += f"name={self.name}, description={self.description}, ";
        mystr += f"owner={self.owner}, episode_ids={self.getEpisodeIds()}>";
        return mystr;

class Episode(db.Model, SerializerMixin):
    __tablename__ = "episodes";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"),
                     db.CheckConstraint("season_number >= 1"),
                     db.CheckConstraint("episode_number >= 1"),
                     db.UniqueConstraint("episode_number", "season_number", "show_id",
                                         name="unique_showid_epnumsnnumcombo"));
    
    class_name_string = "Episode";

    #if I want to use postgressql and deploy using render change this to SERIAL
    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    season_number = db.Column(db.Integer, default=1);
    episode_number = db.Column(db.Integer, default=1);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));

    #safeserializelist = ["id", "name", "description", "season_number", "episode_number"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Episode", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Episode", False);
    #unsafelist = ["show.id", "show.name", "show.description", "users.id", "users.name",
    #              "users.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    #serialize_rules = ("-show.episodes", "-users.episodes");
    #serialize_only = ("id", "name", "description", "season_number", "episode_number",
    #                  "show.id", "show.name", "show.description", "users.id", "users.name",
    #                  "users.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    users = db.relationship("User", secondary="user_episodes", back_populates="episodes");
    show = db.relationship("Show", back_populates="episodes");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isstringnotblank(val, "episode name");

    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "episode description");

    def makeSureUniqueShowIDEpnumAndSeasonNumPresent(self):
        #print(self);
        item = mv.isuniquecols(self.to_dict(), Episode,
                               ["episode_number", "season_number", "show_id"]);
        if (item == None): raise ValueError("item must not be none!");
        else: return self;

    def getUserIds(self):
        return [usr.id for usr in self.users];

    def __repr__(self):
        mystr = f"<Episode id={self.id}, show-id={self.show_id}, ";
        mystr += f"season_number={self.season_number}, episode_number={self.episode_number}, ";
        mystr += f"name={self.name}, description={self.description}, ";
        mystr += f"userids={self.getUserIds()}>";
        return mystr;

class Toy(db.Model, SerializerMixin):
    __tablename__ = "toys";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("length(description) >= 1"),
                     db.CheckConstraint("length(name) >= 1"),
                     db.CheckConstraint("price >= 0"),
                     db.CheckConstraint("toy_number >= 1"),
                     db.UniqueConstraint("toy_number", "show_id",
                                         name="unique_showid_toynumcombo"));

    class_name_string = "Toy";

    #if I want to use postgressql and deploy using render change this to SERIAL
    #https://stackoverflow.com/questions/10059345/sqlalchemy-unique-across-multiple-columns
    #above link is for UniqueConstraint method call
    id = db.Column(db.Integer, primary_key=True, autoincrement=True);
    price = db.Column(db.Float, default=1);
    name = db.Column(db.String, nullable=False);
    description = db.Column(db.String, nullable=False);
    
    show_id = db.Column(db.Integer, db.ForeignKey("shows.id"));
    toy_number = db.Column(db.Integer);
    
    #safeserializelist = ["id", "name", "description", "price", "toy_number"];
    safeserializelist = genlists.getUnOrSafeListForClassName("Toy", True);
    unsafelist = genlists.getUnOrSafeListForClassName("Toy", False);
    #unsafelist = ["show.id", "show.name", "show.description", "users.id", "users.name",
    #              "users.access_level"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);

    #serialize_rules = ("-show.toys", "-user_toys.toy", "-users.toys",
    #                   "-users.episodes.show.toys", "-users.user_toys.toy");
    #serialize_only = ("id", "name", "description", "price", "show.id", "show.name",
    #                  "show.description", "users.id", "users.name", "users.access_level");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    show = db.relationship("Show", back_populates="toys");
    users = db.relationship("User", secondary="user_toys", back_populates="toys");
    user_toys = db.relationship("UserToy", back_populates="toy",
                                cascade="all, delete-orphan");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("name")
    def isnamevalid(self, key, val):
        return mv.isstringnotblank(val, "toy name");
    
    @validates("price")
    def ispricevalid(self, key, val):
        if (val == None or (type(val) != float and type(val) != int)):
            raise ValueError("the value for the price must be a number!");
        else:
            if (val < 0): raise ValueError("the price cannot be negative!");
            else: return val;

    @validates("description")
    def isdescriptionvalid(self, key, val):
        return mv.isstringnotblank(val, "toy description");

    def makeSureUniqueShowIDAndToyNumPresent(self):
        #print(self);
        item = mv.isuniquecols(self.to_dict(), Toy,
                               ["toy_number", "show_id"]);
        if (item == None): raise ValueError("item must not be none!");
        else: return self;

    def __repr__(self):
        mystr = f"<Toy id={self.id}, show-id={self.show_id}, price={self.price}, ";
        mystr += f"name={self.name}, description={self.description}>";
        return mystr;

class UserEpisodes(db.Model, SerializerMixin):
    __tablename__ = "user_episodes";

    class_name_string = "UserEpisodes";

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True);
    episode_id = db.Column(db.Integer, db.ForeignKey("episodes.id"), primary_key=True);
    
    #safeserializelist = [];
    safeserializelist = genlists.getUnOrSafeListForClassName("UserEpisodes", True);
    #User.safeserializelist prepend "user." 
    #unsafelist = ["user.id", "user.name", "user.access_level", "episode.id", "episode.name",
    #              "episode.description", "episode.show.id", "episode.show.name",
    #              "episode.show.description"];
    unsafelist = genlists.getUnOrSafeListForClassName("UserEpisodes", False);
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    
    #serialize_rules = ("-user.episodes",);
    serialize_only = ("user.id", "user.name", "user.access_level", "episode.id",
                      "episode.name", "episode.description", "episode.show.id",
                      "episode.show.name", "episode.show.description");

    #other stuff after that
    user = db.relationship("User");
    episode = db.relationship("Episode");

    @classmethod
    def getValidator(cls): return mv;

    def __repr__(self):
        return f"<UserEpisodes user_id={self.user_id}, episode_id={self.episode_id}>";

class UserToy(db.Model, SerializerMixin):
    __tablename__ = "user_toys";

    #constraints go inside the tableargs
    __table_args__ = (db.CheckConstraint("quantity >= 0"),);

    class_name_string = "UserToy";

    #if I want to use postgressql and deploy using render change this to SERIAL
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True);
    toy_id = db.Column(db.Integer, db.ForeignKey("toys.id"), primary_key=True);
    quantity = db.Column(db.Integer, default=0);

    #serialize_rules = ("-user.user_toys", "-toy.user_toys", "-user.toys.user_toys",
    #                   "-toy.users.user_toys", "-toys.user_toys", "-users.user_toys");
    #safeserializelist = ["quantity"];
    safeserializelist = genlists.getUnOrSafeListForClassName("UserToy", True);
    unsafelist = genlists.getUnOrSafeListForClassName("UserToy", False);
    #unsafelist = ["user.id", "user.name", "user.access_level", "toy.id", "toy.name",
    #              "toy.description", "toy.show.id", "toy.show.name", "toy.show.description"];
    full_list = genlists.combineLists(safeserializelist, unsafelist);
    #serialize_only = ("user.id", "user.name", "user.access_level", "toy.id", "toy.name",
    #                  "toy.description", "quantity", "toy.show.id", "toy.show.name",
    #                  "toy.show.description");
    #serialize_only = tuple(genlists.combineLists(safeserializelist, []));#unsafelist
    serialize_only = tuple(safeserializelist);

    #other stuff after that
    user = db.relationship("User", back_populates="user_toys");
    toy = db.relationship("Toy", back_populates="user_toys");

    #validation code
    @classmethod
    def getValidator(cls): return mv;
    
    @validates("quantity")
    def isquantityvalid(self, key, val):
        if (val == None or type(val) != int):
            raise ValueError("the value for the quantity must be a number!");
        else:
            if (val < 0): raise ValueError("the quantity cannot be negative!");
            else: return val;

    def __repr__(self):
        mystr = f"<UserToy user-id={self.user_id}, toy-id={self.toy_id}, ";
        mystr += f"quantity={self.quantity}>";
        return mystr;
