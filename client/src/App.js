import logo from './logo.svg';
import './App.css';
import React, { useContext } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Navbar from "./Navbar";
import Logout from "./Logout";
import SignUpLoginPreferences from "./SignUpLoginPreferences";
import Home from "./Home";
import MyRules from "./MyRules";
import GameList from "./GameList";
import Ranks from "./Ranks";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function App() {
  const cc = new CommonClass();
  const loginprefsetctypenmerrmsg = cc.getTypeErrorMsgFromList(
    ["SignUp", "Login", "Logout", "Preferences"]);
  const { user, setUser } = useContext(UserContext);
    
  function getSimplifiedUserObj(muser)
  {
    let musrnm = "";
    let lgi = false;
    let alv = 0;
    let pswd = "";
    let usrid = -1;
    if (muser === undefined || muser === null) musrnm = "not logged in";
    else
    {
      musrnm = muser.name;
      alv = muser.access_level;
      lgi = true;
      usrid = muser.id;
      pswd = muser.password;
    }

    return {"id": usrid, "username": musrnm, "access_level": alv, "instatus": lgi,
      "password": pswd};
  }

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

    const mysimpusrobj = getSimplifiedUserObj(user);
    const nvbar = (<Navbar simpusrobj={mysimpusrobj} />);
    const reditem = (<Redirect to={(useloginredulr ? "/login": "/")} />);
    const sprefsitem = (<SignUpLoginPreferences typenm={typenm} setuser={setUser}
        simpusrobj={mysimpusrobj} />);
    const lgoutitem = (<Logout setuser={setUser} />);
    
    if (redonin === mysimpusrobj.instatus) return reditem;
    else return (<>{nvbar}{(typenm === "Logout") ? lgoutitem: sprefsitem}</>);
  }

  //className="App", className="App-header", className="App-logo", className="App-link"
  //<img src={logo} className="App-logo" alt="logo" />
  return (
    <div>
      <Switch>
      <Route exact path="/">
        <Navbar simpusrobj={getSimplifiedUserObj(user)} />
        <Home simpusrobj={getSimplifiedUserObj(user)} />
      </Route>
      <Route exact path="/rules">
        <Navbar simpusrobj={getSimplifiedUserObj(user)} />
        <MyRules />
      </Route>
      <Route exact path="/preferences" render={(props) => 
        makeLoginPrefsItem(false, true, "Preferences")} />
      <Route exact path="/login" render={(props) =>
        makeLoginPrefsItem(true, false, "Login")} />
      <Route exact path="/logout" render={(props) =>
        makeLoginPrefsItem(false, false, "Logout")} />
      <Route exact path="/signup" render={(props) =>
        makeLoginPrefsItem(true, false, "SignUp")} />
      <Route path="*"><Redirect to="/" /></Route>
      </Switch>
      <GameList />
      <Ranks />
    </div>
  );
}

export default App;
