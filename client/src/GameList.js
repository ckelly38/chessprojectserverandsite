import React, { useState, useEffect, createContext } from "react";
import { useHistory } from "react-router-dom";
import CommonClass from "./commonclass";

function GameList({props})
{
    //need to get the list of games
    let games = null;
    let usedummydata = false;
    let cc = new CommonClass();
    let [errormsg, setErrorMessage] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [initdata, setInitData] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (usedummydata)
        {
            games = new Array();
            games.push({id: 1, username: "me", color: null, defers: true,
                ipaddress: "127.0.0.1"});
            games.push({id: 2, username: "op", color: "WHITE", defers: false,
                ipaddress: "127.0.0.1"});
            games.push({id: 3, username: "me", color: "BLACK", defers: false,
                ipaddress: "127.0.0.1"});
            setInitData(games);
            setLoaded(true);
        }
        else
        {
            //not sure what to do here at the moment
            //actually fetch the data from the server
            //but we do not have the server set up at all yet

            fetch("/games_to_join").then((res) => res.json()).then((mdata) => {
                setInitData(mdata);
                setErrorMessage("");
                setLoaded(true);
            }).catch((merr) => {
                console.error("There was a problem getting the data from the server!");
                console.error(merr);
                let usemyasyncdataset = true;
                if (usemyasyncdataset)
                {
                    let data = [];
                    data.push({id: 1, username: "me", color: null, defers: true,
                        ipaddress: "127.0.0.1"});
                    data.push({id: 2, username: "op", color: "WHITE", defers: false,
                        ipaddress: "127.0.0.1"});
                    data.push({id: 3, username: "me", color: "BLACK", defers: false,
                        ipaddress: "127.0.0.1"});
                    //console.log("data = ", data);
                    setInitData(data);
                    setErrorMessage("");
                }
                else
                {
                    setInitData(null);
                    setErrorMessage("There was a problem getting the data from the server! " +
                        merr);
                }
                setLoaded(true);
            });
        }
    }, [usedummydata]);

    //console.log("loaded = " + loaded);
    //console.log("initdata = ", initdata);

    if (loaded);
    else return (<div>Loading...</div>);

    let myrws = null;
    if (cc.isStringEmptyNullOrUndefined(initdata));
    else
    {
        myrws = initdata.map((game) => {
            return (<tr key={"game" + game.id}>
                <td key={"game" + game.id + "id"}>{game.id}</td>
                <td key={"game" + game.id + "username"}>{game.username}</td>
                <td key={"game" + game.id + "color"}>{game.color}</td>
                <td key={"game" + game.id + "defers"}>{game.defers ? "Yes": "No"}</td>
                <td key={"game" + game.id + "ipaddress"}>{game.ipaddress}</td>
                <td key={"game" + game.id + "join"}>
                    <button type="button" onClick={null}>Join</button></td>
            </tr>);
        });
    }

    const iserr = !cc.isStringEmptyNullOrUndefined(errormsg);
    return (<div style={{backgroundColor: cc.getBGColorToBeUsed(iserr, "GameList")}}>
        <h2>Join A Game Page:</h2>
        {/*<form onSubmit={formik.handleSubmit}>
            <label id="usernamelbl" htmlFor="myusername">Username: </label>
            <input id="myusername" type="text" name="username" value={formik.values.username}
                placeholder="Enter your username" autoComplete="username"
                onChange={formik.handleChange} />
            <p> {formik.errors.username}</p>
            <label id="passwordlbl" htmlFor="mypassword">Password: </label>
            <input id="mypassword" type={swpswrd ? "text": "password"} name="password"
                value={formik.values.password} placeholder="Enter your password"
                autoComplete="current-password" onChange={formik.handleChange} />
            <button type="button" onClick={(event) => setShowPassword(!swpswrd)}>
                {(swpswrd ? "Hide": "Show") + " Password"}</button>
            <p> {formik.errors.password}</p>
            {useprefsorsignupschema ? <><label id="myacslvlbl" htmlFor="myacslv">
                Access Level: </label>
            <input id="myacslv" type="number" step={1} name="access_level" placeholder={0}
                onChange={formik.handleChange} value={formik.values.access_level} />
            <p> {formik.errors.access_level}</p></>: null}
            <button type="submit">{mybtnnm}</button>
            <button type="button"  style={{marginLeft: "5px"}}
                onClick={(event) => history.push("/")}>Cancel</button>
            {(typenm === "Preferences") ?
                <button onClick={unsubscribeMe} style={{marginLeft: "50px"}}>
                    Remove My Account</button>: null}
        </form>*/}
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>GAME ID #</th>
                    <th>PlAYER 1: USERNAME</th>
                    <th>COLOR</th>
                    <th>DEFERS</th>
                    <th>IP Address</th>
                    <th>Join</th>
                </tr>
            </thead>
            <tbody>
                {myrws}
            </tbody>
        </table>
        {iserr ? <p>{errormsg}</p>: null}
        <button onClick={null}>Create A Game</button>
        <button onClick={(event) => history.push("/")}>Back</button>
    </div>);
}

export default GameList;
