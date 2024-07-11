import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, Link, useParams } from "react-router-dom";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function Navbar(props) {
    let params = useParams();
    console.log("NAVBAR params = ", params);

    const cc = new CommonClass();
    const { user, setUser } = useContext(UserContext);
    const simpusrobj = cc.getSimplifiedUserObj(user);
    console.log("NAVBAR simpusrobj = ", simpusrobj);

    cc.letMustBeDefinedAndNotNull(simpusrobj, "simpusrobj");

    let mysid = "";
    let safetousesid = false;
    if (cc.isInteger(params.showid))
    {
      mysid = "" + params.showid;
      safetousesid = true;
    }
    else mysid = ":showid";
    console.log("NAVBAR: safetousesid = " + safetousesid);

    const notloggedin = !simpusrobj["instatus"];
    const alv = simpusrobj["access_level"];
    const nocreateaccess = (alv !== 2);
    const username = simpusrobj["username"];

    return (<div className="navbarcls">
        <div className="homelinkcls"><Link to="/">Home</Link></div>
        <div className="showslinkcls"><Link to="/rules">Rules</Link></div>
        {(notloggedin || nocreateaccess) ? null :
          <Link className={"horizontal-gradient"} exact="true" to="/shows/new">New Show</Link>}
        <div className="epslinkcls">
          <Link to={"/shows/" + mysid + "/episodes"}>Episodes</Link>
        </div>
        {(notloggedin || nocreateaccess) ? null :
          <Link className={"horizontal-gradient"} to={"/shows/" + mysid + "/episodes/new"}>
            New Episode</Link>}
        <div className="toyslinkcls"><Link to="/stats">Stats</Link></div>
        {(notloggedin || nocreateaccess) ? null :
          ((safetousesid) ? <Link className={"horizontal-gradient"}
            to={"/shows/" + mysid + "/toys/new"}>New Toy</Link>:
          <Link className={"horizontal-gradient"} exact="true" to="/toys/new">New Toy</Link>)}
        <div className="toysforshowlinkcls">
          <Link to={"/shows/" + mysid + "/toys"}>Toys For Show</Link>
        </div>
        {(notloggedin) ? null : <><div className="mytoyslinkcls">
          <Link to="/my-toys">My Toys</Link></div>
          <div className="myepslinkcls"><Link to="/my-episodes">My Episodes</Link></div></>}
        {(notloggedin) ? <><div className="loginlinkcls"><Link to="/login">Login</Link></div>
        <div className="signuplinkcls"><Link to="/signup">Signup</Link></div></> :
        <div className="logoutlinkcls"><Link to="/logout">Logout</Link></div>}
        <div className="prefslinkcls"><Link to="/preferences">
            <div id="username">Preferences: {username}</div>
        </Link></div>
    </div>);
}

export default Navbar;
