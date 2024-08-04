import React, { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function GameList({setgame})
{
    //need to get the list of games
    let usedummydata = false;
    let useips = false;
    let cc = new CommonClass();
    const { user, setUser } = useContext(UserContext);
    const simpusrobj = cc.getSimplifiedUserObj(user);
    let [errormsg, setErrorMessage] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [usecreate, setUseCreate] = useState(true);
    let [initdata, setInitData] = useState(null);
    let [mygame, setMyGame] = useState(null);
    let [userpdata, setUserPlayerData] = useState(null);
    let [showcreategameform, setShowCreateGameForm] = useState(false);
    const history = useHistory();
    cc.letMustBeDefinedAndNotNull(setgame, "setgame");

    function genDummyData(usemyips, usetwosameids)
    {
        let myitema = {id: 1, username: "me", color: null, defers: true};
        if (usemyips) myitema["ipaddress"] = "127.0.0.1";
        let myitemb = {id: 2, username: "op", color: "WHITE", defers: false};
        if (usemyips) myitemb["ipaddress"] = "127.0.0.1";
        let myitemc = null;
        if (usetwosameids)
        {
            myitemc = {id: 2, username: "op", color: "WHITE", defers: false};
        }
        else
        {
            myitemc = {id: 3, username: "me", color: "BLACK", defers: false};
        }
        if (usemyips) myitemc["ipaddress"] = "127.0.0.1";
        return [myitema, myitemb, myitemc];
    }

    let dummydata = genDummyData(useips, true);

    useEffect(() => {
        if (usedummydata)
        {
            setInitData([...dummydata]);
            setLoaded(true);
        }
        else
        {
            //not sure what to do here at the moment
            //actually fetch the data from the server
            //but we do not have the server set up at all yet

            fetch("/games_to_join").then((res) => res.json()).then((mdata) => {
                console.log("mdata = ", mdata);
                setInitData(mdata);
                fetch("/user-players").then((res) => res.json()).then((updata) => {
                    console.log("updata = ", updata);
                    setUserPlayerData(updata);
                    setErrorMessage("");
                    setLoaded(true);
                }).catch((merr) => {
                    console.error("There was a problem getting the data from the server!");
                    console.error(merr);
                    setErrorMessage("There was a problem getting the data from the server! " +
                        merr);
                    setLoaded(true);
                });
            }).catch((merr) => {
                console.error("There was a problem getting the data from the server!");
                console.error(merr);
                let usesrvrdummydata = false;
                if (usesrvrdummydata)
                {
                    let data = genDummyData(useips, false);
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

    console.log("loaded = " + loaded);
    console.log("initdata = ", initdata);

    function onJoin(game, event)
    {
        console.log("GAME TO JOIN: ", game);
        setMyGame(game);
        setUseCreate(false);
        setShowCreateGameForm(true);
    }

    //const prefsSignUpSchema = yup.object().shape({
    //    username: yup.string().required("You must enter a username!").min(1),
    //    password: yup.string().required("You must enter a password!").min(1),
    //    access_level: yup.number().positive().integer().min(1).max(2)
    //    .required("You must enter the access level!")
    //    .typeError("You must enter a positive integer that is either 1 or 2 here!"),
    //});
    //const loginSchema = yup.object().shape({
    //    username: yup.string().required("You must enter a username!").min(1),
    //    password: yup.string().required("You must enter a password!").min(1),
    //});
    //const useprefsorsignupschema = (typenm === "Preferences" || typenm === "SignUp");
    //const formSchema = (useprefsorsignupschema ? prefsSignUpSchema : loginSchema);

    function genNewGame(playera_id=0, playerb_id=0)
    {
        cc.letMustBeAnInteger(playera_id, "playera_id");
        cc.letMustBeAnInteger(playerb_id, "playerb_id");

        return { "playera_won": false,
            "playera_resigned": false,
            "playerb_resigned": false,
            "completed": false,
            "tied": false,
            "playera_id": playera_id,
            "playerb_id": playerb_id
        };
    }

    function getColorIPAndDefersFromGame(game, useipsa)
    {
        let mclr = null;
        let mdfrs = false;
        let mip = null;
        if (cc.isItemNullOrUndefined(game) || cc.isItemNullOrUndefined(game.playera))
        {
            mclr = "";
            mdfrs = true;
            mip = "127.0.0.1";
        }
        else
        {
            mclr = game.playera.color;
            mdfrs = game.playera.defers;
            if (useipsa) mip = game.playera.ipaddress;
            else mip = "127.0.0.1";
        }
        return {"mclr": mclr, "mdfrs": mdfrs, "mip": mip};
    }

    function getUserNameFromGameAndPlayerData(game, updata)
    {
        let usrnm = "";
        if (cc.isItemNullOrUndefined(game));
        else
        {
            let usepa = !(cc.isItemNullOrUndefined(game.playera));
            let usepb = !(cc.isItemNullOrUndefined(game.playerb));
            if (usepa || usepb)
            {
                for (let x = 0; x < updata.length; x++)
                {
                    if (usepa)
                    {
                        if (updata[x].player.id === game.playera.id)
                        {
                            usrnm = updata[x].user.name;
                            break;
                        }
                        //else;//do nothing
                    }
                    else// if (usepb)
                    {
                        if (updata[x].player.id === game.playerb.id)
                        {
                            usrnm = updata[x].user.name;
                            break;
                        }
                        //else;//do nothing
                    }
                }
            }
            //else;//do nothing
        }
        return usrnm;
    }

    const formSchema = yup.object().shape({
        username: yup.string().required("You must enter a username!").min(1),
        player_color: yup.string().required("You must enter a color or if you defer!"),
    });

    let tstmode = false;

    const formik = useFormik({
        initialValues: {
            username: simpusrobj.username,
            player_color: "DEFER"
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log("values: ", values);
            
            let mxgid = -1;
            if (loaded)
            {
                let mygids = initdata.map((game) => game.id);
                console.log("mygids = ", mygids);

                mxgid = Math.max(...mygids);
                if (cc.isNumber(mxgid)) mxgid += 1;
                else
                {
                    this.cc.logAndThrowNewError("the value for the maximum new game " +
                        "id must be a number!");
                }
            }
            else return;
            console.log("mxgid = " + mxgid);

            let mynwvalsobj = {id: mxgid,
                username: "" + values.username,
                color: ((values.player_color === "DEFER") ? "": "" + values.player_color),
                defers: (values.player_color === "DEFER")
            };
            if (useips) mynwvalsobj["ipaddress"] = "127.0.0.1";
            //else;//do nothing
            console.log("mynwvalsobj = ", mynwvalsobj);
            console.log("mygame = ", mygame);
            console.log("usecreate = ", usecreate);

            //need to post the new data to the server
            //we may need to get some unique identifiable information for the device
            setLoaded(false);


            //WE CAN MAKE A GAME FIRST AND THEN PATCH IT WITH PLAYER INFORMATION

            //IF USECREATE, WE WANT TO TELL THE SERVER TO MAKE A NEW PLAYER AND A NEW GAME
            //IF NOT, WE WANT TO DO SOMETHING ELSE WITH THE SERVER

            const mthdnm = (usecreate ? "POST": "PATCH");
            let mygmconfigobj = {
                method: mthdnm,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(mynwvalsobj)
            };
            if (usecreate)
            {
                fetch("/new_game_with_playera", mygmconfigobj).then((res) => res.json())
                .then((mdata) => {
                    console.log("mdata = ", mdata);
                    //game and user-player object
                    //user-player object houses a user and a player object as well as their ids
                    //user_id, player_id
                    //WHAT WE WANT username, gameid, color, defer
                    let mynwgame = {"username": mdata.user_player.user.name, "id": mdata.game.id,
                        "color": mdata.user_player.player.color,
                        "defers": mdata.user_player.player.defers};
                    setInitData([...initdata, mynwgame]);
                    setUserPlayerData([...userpdata, mdata.user_player]);
                    setLoaded(true);
                }).catch((merr) => {
                    console.error("There was a problem updating the server!");
                    console.error(merr);
                    setErrorMessage("There was a problem getting the data from the server! " +
                        merr);
                    setLoaded(true);
                });
            }
            else
            {
                fetch("/join_game/" + mygame.id, mygmconfigobj).then((res) => res.json())
                .then((mdata) => {
                    console.log("mdata = ", mdata);
                    //game and user-player object
                    //user-player object houses a user and a player object as well as their ids
                    //user_id, player_id
                    //WHAT WE WANT username, gameid, color, defer
                    //let mynwgame = {"username": mdata.user_player.user.name, "id": mygame.id,
                    //    "color": mdata.user_player.player.color,
                    //    "defers": mdata.user_player.player.defers};
                    //console.log("initdata = ", initdata);

                    setInitData(initdata.map((cgame) => {
                        //console.log("cgame = ", cgame);
                        if (cgame.id === mygame.id) return mdata.game;
                        else return cgame;
                    }));
                    setUserPlayerData([...userpdata, mdata.user_player]);
                    setMyGame(mdata.game);
                    setLoaded(true);

                    if (mdata.game.can_be_started)
                    {
                        setShowCreateGameForm(false);
                        console.log("mygame = mdata.game = ", mdata.game);
                        //console.log("playera color = " + mdata.game.playera.color);
                        //console.log("playerb color = " + mdata.game.playerb.color);
                        //console.log("playera defers = " + mdata.game.playera.defers);
                        //console.log("playerb defers = " + mdata.game.playerb.defers);
                        //console.error("NEED TO DO SOMETHING HERE...!");
                        //history.push("/play");
                        return setgame(mdata.game);
                    }
                    //else;//do nothing
                }).catch((merr) => {
                    console.error("There was a problem updating the server!");
                    console.error(merr);
                    setErrorMessage("There was a problem getting the data from the server! " +
                        merr);
                    setLoaded(true);
                });
            }
        },
    });

    if (loaded);
    else return (<div>Loading...</div>);

    let myrws = null;
    if (cc.isStringEmptyNullOrUndefined(initdata));
    else
    {
        myrws = initdata.map((game) => {
            let {mclr, mdfrs, mip} = getColorIPAndDefersFromGame(game, useips);
            if (game.can_be_started) return null;
            else
            {
                console.log("userpdata = ", userpdata);
                let usrnm = getUserNameFromGameAndPlayerData(game, userpdata);
                
                return (<tr key={"game" + game.id}>
                    <td key={"game" + game.id + "id"}>{game.id}</td>
                    <td key={"game" + game.id + "username"}>{usrnm}</td>
                    <td key={"game" + game.id + "color"}>{mclr}</td>
                    <td key={"game" + game.id + "defers"}>{mdfrs ? "Yes": "No"}</td>
                    {useips ? <td key={"game" + game.id + "ipaddress"}>{mip}</td>: null}
                    <td key={"game" + game.id + "join"}>
                        {(simpusrobj.instatus || tstmode) ?
                            <button type="button" onClick={onJoin.bind(null, game)}>Join</button>:
                        (<button onClick={(event) => (<Redirect to="/login" />)}>
                You Need To Login To Join A Game</button>)}
                    </td>
                </tr>);
            }
        });
    }

    console.log("mygame = ", mygame);

    if (cc.isItemNullOrUndefined(mygame));
    else
    {
        if (mygame.can_be_started)
        {
            console.log("CALLING PLAY GAME NOW!");
            return setgame(mygame);
        }
        //else;//do nothing
    }

    const iserr = !cc.isStringEmptyNullOrUndefined(errormsg);
    let {mclr, mdfrs, mip} = getColorIPAndDefersFromGame(mygame, useips);
    
    console.log("userpdata = ", userpdata);
    let usrnm = getUserNameFromGameAndPlayerData(mygame, userpdata);

    return (<div style={{paddingTop: 1,
        backgroundColor: cc.getBGColorToBeUsed(iserr, "GameList")}}>
        <h2>Join A Game Page:</h2>
        {showcreategameform ? (<form onSubmit={formik.handleSubmit} style={{marginLeft: 10}}>
            <h3>{usecreate ? "Create" : "Join"} A Game Here:</h3>
            <p>Username: {simpusrobj.username}</p>
            <p> {formik.errors.username}</p>
            <label id="playercolorlbl" htmlFor="player_color">Color: </label>
            <select id="player_color" name="player_color" onChange={formik.handleChange}
                value={formik.values.player_color}>
                <option value="WHITE">WHITE</option>
                <option value="BLACK">BLACK</option>
                <option value="DEFER">DEFER</option>
            </select>
            <p> {formik.errors.player_color}</p>
            {usecreate ? null: (<p>The Game you are joining has an ID: {mygame.id}
                , a username of: {usrnm}
                , and wants color: {mclr}, and is willing to defer: {mdfrs ? "Yes": "No"}.
            </p>)}
            <button type="submit">Submit</button>
        </form>) : null}
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
        </form>, marginTop: 10*/}
        <h3>Games To Join:</h3>
        <table style={{marginLeft: 10, marginBottom: 10}}>
            <thead>
                <tr>
                    <th>GAME ID #</th>
                    <th>PlAYER 1: USERNAME</th>
                    <th>COLOR</th>
                    <th>DEFERS</th>
                    {useips ? <th>IP Address</th>: null}
                    <th>Join</th>
                </tr>
            </thead>
            <tbody>
                {myrws}
            </tbody>
        </table>
        {iserr ? <p>{errormsg}</p>: null}
        {(simpusrobj.instatus || tstmode) ? (
            <><button onClick={(event) => {
                setMyGame(null);
                setUseCreate(true);
                setShowCreateGameForm(!showcreategameform);
                }}>
            Create A Game</button>
            <button onClick={(event) => history.push("/custom")}>Custom Game</button>
            </>): (<button onClick={(event) => (<Redirect to="/login" />)}>
            You Need To Login To Create A Game</button>)}
        <button onClick={(event) => history.push("/")}>Back</button>
    </div>);
}

export default GameList;
