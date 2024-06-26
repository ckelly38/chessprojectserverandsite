import logo from './logo.svg';
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

function App() {
  const cc = new CommonClass();
  const loginprefsetctypenmerrmsg = cc.getTypeErrorMsgFromList(
    ["SignUp", "Login", "Logout", "Preferences"]);
  const { user, setUser } = useContext(UserContext);
  const [mypieces, setMyPieces] = useState([]);
  console.log("mypieces = ", mypieces);
    
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
    else throw new Error(loginprefsetctypenmerrmsg);

    const mysimpusrobj = cc.getSimplifiedUserObj(user);
    const nvbar = (<Navbar />);//simpusrobj={mysimpusrobj}
    const reditem = (<Redirect to={(useloginredulr ? "/login": "/")} />);
    const sprefsitem = (<SignUpLoginPreferences typenm={typenm} />);//setuser={setUser}
    //simpusrobj={mysimpusrobj}
    const lgoutitem = (<Logout />);//setuser={setUser}
    
    if (redonin === mysimpusrobj.instatus) return reditem;
    else return (<>{nvbar}{(typenm === "Logout") ? lgoutitem: sprefsitem}</>);
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
          throw new Error("either illegal id (" + mid +
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

  function addPiece()
  {
      //let mynwpcs = [...mypieces];
      let lenpcs = mypieces.length;
      console.log("ADDPC: OLD mypieces = ", mypieces);
      
      //formik={formik} 
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
  
  //className="App", className="App-header", className="App-logo", className="App-link"
  //<img src={logo} className="App-logo" alt="logo" />
  //NOTE: ALL ROUTES IN THE MYROUTE COMPONENT ARE EXACT
  //NOTE: IF YOU ADD THE * WILD-CARD ROUTE TO THE LIST IT WILL PUT IT IN THAT ORDER
  //-IF THAT IS NOT LAST IN THE LIST AND NOT THE LAST ROUTE,
  //-THE REST OF YOUR ROUTING WILL BE IGNORED!
  //NOTE: THE SWITCH COMPONENT WILL ONLY RENDER ROUTE COMPONENTS AND ANYTHING THAT EXTENDS IT ONLY
  //simpusrobj={cc.getSimplifiedUserObj(user)}
  console.log("mypieces = ", mypieces);
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
          <GameList key={"gamelistforjoin"} />
        ])}
        <Route exact path="/rules">
          <Navbar />
          <MyRules />
        </Route>
        <Route exact path="/play">
          <Navbar />
          <GameBoard />
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
        <Route path="*"><Redirect to="/" /></Route>
      </Switch>
      <PieceListForm addpiece={addPiece} mpcs={mypieces} />
    </div>);
}

export default App;
