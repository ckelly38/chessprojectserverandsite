import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, Link, useParams, useHistory, Redirect } from "react-router-dom";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function Home(props) {
    let cc = new CommonClass();
    const { user, setUser } = useContext(UserContext);
    const simpusrobj = cc.getSimplifiedUserObj(user);
    cc.letMustBeDefinedAndNotNull(simpusrobj);
    
    const logoutcautionmsg = "reloading the page, navigating to /login, or sometimes " +
        "modifying urls can log you out.";
    const vwfpartmsg = "You can view the ";
    const lgiactionsmsg = "If you are logged in:";
    const lvtwomsg = "If you have the appropriate access level (2) and if you own the " +
        "show: then ";
    let welcomemsg = "";
    if (simpusrobj.instatus)
    {
        welcomemsg = "Welcome " + simpusrobj.username + ". Your ID# is " +
            simpusrobj.id + ".";
    }
    else welcomemsg = "You are not logged in!";
    const warnfpart = "Beware User, it is possible ";
    const warnmsgmidpart = "(when switching between tabs faster and faster) ";
    const warnmsglpart = "to get the website to crash! That is on you!";
    const ownshowmsg = "NOTE: To own a show, you can create it or have the current owner " +
        "set you as the new owner.";
    const errmsgwarning = "NOTE: If you see a red background and it is not the normal " +
        "background color, then an error occured and you should probably look at the " +
        "browser console to figure out what the error is. To do that right-click on " +
        "the page and click inspect, then click console.";
    const dispmsg = "displayed to other users!";

    return (<div><h1>Home</h1><h2>{welcomemsg}</h2>
        <p>Dear User, simply <b>{logoutcautionmsg}</b> So be careful.</p>
        <p>This is a normal Chess App with a lot of features.</p>
        <p>The normal flow of this App is as follows:</p>
        <ol>
            <li>Whether logged in or not, you can still view the Rules and see Statistics information.</li>
            <p>Caution: Viewing the <Link to="/rules">Rules</Link> or <Link to="/stats">Stats</Link> information when a game is incomplete on the Play Game Screen and navigating to those <b>will result in the game being inaccessible.</b></p>
            <li>You <Link to="/login">Login</Link> if you have not already</li>
            <li>You either Create A <Link to="/custom">Custom Game</Link>, or Load a <Link to="/my-completed-games">Completed Game</Link> or just <Link to="/join">Join A Game</Link></li>
            <li>After Creating A Custom Game, you can Join it!</li>
            <ul>
                <li>NOTE: On the Join A Game screen, you have the option to create a new normal Game, which after created can be joined.</li>
                <li>NOTE: On the Join A Game screen, you can play a game against yourself and have 2 boards open or just one.</li>
            </ul>
            <li>Loading A Completed Game will advance you straight into it!</li>
            <li>After Joining A Game and submitting the form where 2 players have joined it,
                the Game opens on the Play Game screen</li>
            <li>On the Play Game screen you have serveral different options you can do:
                <ul>
                    <li>You can get hints for your side or your opponent's side</li>
                    <li>You can get hints for any piece for your side or your opponent's side</li>
                    <li>You can castle</li>
                    <li>You can pawn</li>
                    <li>You can select a color piece at a location and where to move it to (and what to promote it to if the Pawn can be promoted)!</li>
                    <li>You can resign</li>
                    <li>You can click a piece that you want to move and click an empty location and the drop downs will be populated for you!</li>
                    <li>If you want to capture a piece, click the piece you want to capture, then click swap locs button, then select the piece you want to move, the drop downs will be populated for you.</li>
                    <li>You can undo/step back a move, until you advance the turn. Once you advance turns, you took your finger off the piece.</li>
                    <li>You can redo/step forward a move, until you advance the turn. "" dito ""</li>
                    <li>To make a move, that is what the execute and execute and advance buttons are for.</li>
                </ul>
            </li>
            <li>When the game is over, on the Play Game screen, you can see what moves were made during that game (by using the step forward and step backwards, but you cannot make different moves, you can see what your options were (to some extent)).</li>
            <li>OR you can create a new game or join another game of some sort VIA join game page.</li>
        </ol>
        <p>KNOWN ISSUE: You cannot resume a game. If a game gets interrupted for some reason, or due to navigating away, it is impossible to access it.</p>
        <p>KNOWN ISSUE: You cannot view the moves list durring or after game play.</p>
        <p>KNOWN ISSUE: You cannot play against the computer.</p>
        <p>KNOWN ISSUE: There is currently no Android App.</p>
        </div>);
}

export default Home;
