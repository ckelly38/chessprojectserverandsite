//import logo from './logo.svg';
import './App.css';
import React, { useState, useContext } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { MyRoute, getRoutesList, addOtherRouteNamesForRoute } from "./MyRoute";
import { UserContext } from "./UserProvider";
import Navbar from "./Navbar";
import Logout from "./Logout";
import SignUpLoginPreferences from "./SignUpLoginPreferences";
import Home from "./Home";
import MyRules from "./MyRules";
import GameList from "./GameList";
import GameBoard from "./GameBoard";
import Ranks from "./Ranks";
import NewPiece from "./NewPiece";
import PieceListForm from "./PieceListForm";
import CommonClass from "./commonclass";
import ChessGame from "./ChessGame";
//import TestDriver from './TestDriver';

function App() {
  const cc = new CommonClass();
  const loginprefsetctypenmerrmsg = cc.getTypeErrorMsgFromList(
    ["SignUp", "Login", "Logout", "Preferences"]);
  const { user, setUser } = useContext(UserContext);
  const history = useHistory();
    
  function makeLoginPrefsItem(redonin, useloginredulr, typenm)
  {
    cc.letMustBeBoolean(redonin, "redonin");
    cc.letMustBeBoolean(useloginredulr, "useloginredulr");
    cc.letMustBeDefinedAndNotNull(typenm, "typenm");
    
    if (typenm === "SignUp" || typenm === "Login" || typenm === "Logout" ||
      typenm === "Preferences")
    {
      //do nothing
    }
    else this.cc.logAndThrowNewError(loginprefsetctypenmerrmsg);

    const mysimpusrobj = cc.getSimplifiedUserObj(user);
    const nvbar = (<Navbar />);//simpusrobj={mysimpusrobj}
    const reditem = (<Redirect to={(useloginredulr ? "/login": "/")} />);
    const sprefsitem = (<SignUpLoginPreferences typenm={typenm} />);//setuser={setUser}
    //simpusrobj={mysimpusrobj}
    const lgoutitem = (<Logout />);//setuser={setUser}
    
    if (redonin === mysimpusrobj.instatus) return reditem;
    else return (<>{nvbar}{(typenm === "Logout") ? lgoutitem: sprefsitem}</>);
  }

  const [mypieces, setMyPieces] = useState([{row: 0,
    col: 0,
    color: "WHITE",
    type: "KING",
    move_count: 0,
    arrindx: 0,
    id: "pid0"
  }, {row: 0,
    col: 0,
    color: "BLACK",
    type: "KING",
    move_count: 0,
    arrindx: 1,
    id: "pid1"
  }]);
  //console.log("mypieces = ", mypieces);

  const [mvslist, setMovesList] = useState([{
    dir: "LEFT",
    piece_type: "KING",
    piece_color: "WHITE",
    piece_move_count: 0,
    wants_tie: 0,
    promo_piece_type: "QUEEN",
    start_row: 0,
    end_row: 0,
    start_col: 0,
    end_col: 0,
    cmd_type: "MOVE",
    arrindx: 0,
    id: "mv0"
  }]);
  
  function addMove()
  {
    const mvslen = (cc.isStringEmptyNullOrUndefined(mvslist) ? 0 : mvslist.length);
    const genidstr = "mv" + mvslen;

    let nwmv = {
      dir: "LEFT",
      piece_type: "QUEEN",
      piece_color: "WHITE",
      piece_move_count: 0,
      wants_tie: 0,
      promo_piece_type: "QUEEN",
      start_row: 0,
      end_row: 0,
      start_col: 0,
      end_col: 0,
      cmd_type: "MOVE",
      arrindx: mvslen,
      id: genidstr
    };

    setMovesList([...mvslist, nwmv]);
  }
  
  function removeMove(mid)
  {
    console.log("INSIDE removeMove()!");
    console.log("mid = " + mid);
    
    //mvslist === null || mvslist === undefined || mvslist.length < 1 
    if (cc.isStringEmptyNullOrUndefined(mvslist))
      {
          this.cc.logAndThrowNewError("either illegal id (" + mid +
              ") or array was empty when not supposed to!");
      }
      //else;//do nothing
    
    //generate the new list with the item removed
    
    //A: remove the end move each time... and disable all of the other remove buttons
    //after each remove one must be enabled unless there are none OR
    //B: we would remove this one except when we remove this one, we need to make sure the
    //colors alternate
    //REMOVE FROM BOTTOM WILL BE BEST

    let nwmvs = mvslist.filter((mpc) => {
        if (mpc.id === mid) return false;
        else return true;
    });
    console.log("REMPC: nwmvs = ", nwmvs);

    //then set it
    setMovesList(nwmvs);
  }

  function getPcs()
  {
      console.log("GETPCS: mypieces = ", mypieces);
      return mypieces;
  }

  function remPiece(mid)
  {
      console.log("INSIDE remPiece!");
      //console.log("REMPC indx = " + indx);
      console.log("REMPC: mpcs = ", getPcs());
      console.log("mid = " + mid);
      
      //getPcs() === null || getPcs() === undefined || getPcs().length < 1 
      if (cc.isStringEmptyNullOrUndefined(getPcs()))
      {
          this.cc.logAndThrowNewError("either illegal id (" + mid +
              ") or array was empty when not supposed to!");
      }
      //else;//do nothing

      let mynwpcs = getPcs().filter((mpc, index) => {
          console.log("REMPC: filter index = " + index);
          if (mpc.id === mid) return false;
          else return true;
      });
      console.log("REMPC: mynwpcs = ", mynwpcs);
      
      setMyPieces(mynwpcs);
  }
  
  /*
  function addPiece()
  {
      //let mynwpcs = [...mypieces];
      let lenpcs = mypieces.length;
      console.log("ADDPC: OLD mypieces = ", mypieces);
      
      //formik={formik} //DO NOT STORE REACT ELEMENTS IN STATE, REACT DOES NOT LIKE THIS!!!
      //IT WILL BITE YOU IN THE BUTT WHEN YOU GO TO REMOVE THEM BECAUSE THE FIRST ONE WILL NOT
      //IT WILL ALSO CAUSE UNSTABLE OR INCONSISTENT STATE AND WILL ALWAYS CLEAR IT
      let mpc = (<NewPiece key={"pid" + lenpcs} id={"pid" + lenpcs} mid={"pid" + lenpcs}
      arrindx={lenpcs}
      rempiece={remPiece} />);//.bind(this, "pid" + lenpcs)

      //mynwpcs.push(mpc);
      //console.log("ADDPC: mynwpcs = ", mynwpcs);
      
      setMyPieces([...mypieces, mpc]);
      //setMyPieces(mynwpcs);
      //setMyPieces(() => {
      //    console.log("ADDPC: mynwpcs = ", mynwpcs);
      //    return mynwpcs;
      //});
      //console.log("ADDPC: NEW mypieces = ", mypieces);
  }
  */

  function addPiece()
  {
    const mpclen = (cc.isStringEmptyNullOrUndefined(mypieces) ? 0 : mypieces.length);
    const genidstr = "pid" + mpclen;
    let mynwpc = {row: 0,
      col: 0,
      color: "WHITE",
      type: "QUEEN",
      move_count: 0,
      arrindx: mpclen,
      id: genidstr
    };

    setMyPieces([...mypieces, mynwpc]);
  }
  
  //className="App", className="App-header", className="App-logo", className="App-link"
  //<img src={logo} className="App-logo" alt="logo" />
  //NOTE: ALL ROUTES IN THE MYROUTE COMPONENT ARE EXACT
  //NOTE: IF YOU ADD THE * WILD-CARD ROUTE TO THE LIST IT WILL PUT IT IN THAT ORDER
  //-IF THAT IS NOT LAST IN THE LIST AND NOT THE LAST ROUTE,
  //-THE REST OF YOUR ROUTING WILL BE IGNORED!
  //NOTE: THE SWITCH COMPONENT WILL ONLY RENDER ROUTE COMPONENTS AND ANYTHING THAT EXTENDS IT ONLY
  //simpusrobj={cc.getSimplifiedUserObj(user)}
  //console.log("mypieces = ", mypieces);

  //TestDriver.main(null);
  //let gid = 1;
  const [thegame, setTheGame] = useState(null);

  function setGameAndAdvance(ng)
  {
    console.log("APP: ng = ", ng);
    setTheGame(ng);
    return (<Redirect to="/play" />);
  }

  console.log("APP: thegame = ", thegame);

  return (<div>
      <Switch>
        {getRoutesList("/", ["/home"], [
          <Navbar key={"nvbarforhome"} />,
          <Home key={"homeforhome"} />])}
        {getRoutesList("/stats", ["/ranks", "/statistics"], [
          <Navbar key={"nvbarforstats"} />,
          <Ranks key={"ranksforstats"} />])}
        {getRoutesList("/join", ["/join_games"], [
          <Navbar key={"nvbarforjoin"} />,
          <GameList key={"gamelistforjoin"} setgame={setGameAndAdvance} />
        ])}
        <Route exact path="/rules">
          <Navbar />
          <MyRules />
        </Route>
        <Route exact path="/play">
          <Navbar />
          <GameBoard srvrgame={thegame} />
        </Route>
        <Route exact path="/preferences" render={(props) => 
          makeLoginPrefsItem(false, true, "Preferences")} />
        {addOtherRouteNamesForRoute(["/prefs", "/settings"], "/preferences")}
        <Route exact path="/login" render={(props) =>
          makeLoginPrefsItem(true, false, "Login")} />
        <Route exact path="/logout" render={(props) =>
          makeLoginPrefsItem(false, false, "Logout")} />
        <Route exact path="/signup" render={(props) =>
          makeLoginPrefsItem(true, false, "SignUp")} />
        <Route exact path="/custom">
          <Navbar />
          <PieceListForm addpiece={addPiece} mpcs={mypieces} rempiece={remPiece}
          getpcs={getPcs} setpcs={setMyPieces} mvs={mvslist} setmvs={setMovesList}
          addmv={addMove} remmv={removeMove} />
        </Route>
        <Route exact path="/redirectme" render={(props) => {
          console.log("history = ", history);
          return history.goBack();
          //THIS HELPS TRIGGER A RERENDER WITHOUT SETTING UNNECESSARY STATE
          //OUTSIDE OF THE COMPONENT
        }} />
        <Route path="*"><Redirect to="/" /></Route>
      </Switch>
    </div>);
}

export default App;
