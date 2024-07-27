import React, { useState, useEffect, useContext } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function GameList(props)
{
    //need to get the list of games
    let usedummydata = false;
    let useips = false;
    let cc = new CommonClass();
    const { user, setUser } = useContext(UserContext);
    const simpusrobj = cc.getSimplifiedUserObj(user);
    let [errormsg, setErrorMessage] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [initdata, setInitData] = useState(null);
    let [showcreategameform, setShowCreateGameForm] = useState(false);
    const history = useHistory();

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
                setInitData(mdata);
                setErrorMessage("");
                setLoaded(true);
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

    //console.log("loaded = " + loaded);
    //console.log("initdata = ", initdata);

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

            //need to post the new data to the server
            //we may need to get some unique identifiable information for the device
            setLoaded(false);

            let myconfigobj = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(mynwvalsobj)
            };
            //fetch("/url", myconfigobj).then((res) => res.json()).then((mdata) => {
            //    console.log("mdata = ", mdata);
                let mdata = null;
                let mynwdata = initdata.map((mobj) => mobj);
                let usetstdata = true;
                if (usetstdata) mynwdata.push(mynwvalsobj);
                else mynwdata.push(mdata);
                setInitData(mynwdata);
                setLoaded(true);
            //}).catch((merr) => {
            //    console.error("There was a problem updating the server!");
            //    console.error(merr);
            //    setErrorMessage("There was a problem getting the data from the server! " +
            //        merr);
            //    setLoaded(true);
            //});

            console.error("NOT DONE YET WITH SUBMITTING THE GAME!");
        },
    });

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
                {useips ? <td key={"game" + game.id + "ipaddress"}>{game.ipaddress}</td>: null}
                <td key={"game" + game.id + "join"}>
                    {(simpusrobj.instatus || tstmode) ?
                        <button type="button" onClick={null}>Join</button>:
                    (<button onClick={(event) => (<Redirect to="/login" />)}>
            You Need To Login To Join A Game</button>)}
                </td>
            </tr>);
        });
    }

    const iserr = !cc.isStringEmptyNullOrUndefined(errormsg);
    return (<div style={{paddingTop: 1,
        backgroundColor: cc.getBGColorToBeUsed(iserr, "GameList")}}>
        <h2>Join A Game Page:</h2>
        {showcreategameform ? (<form onSubmit={formik.handleSubmit} style={{marginLeft: 10}}>
            <h3>Create A Game Here:</h3>
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
            <><button onClick={(event) => setShowCreateGameForm(!showcreategameform)}>
            Create A Game</button>
            <button onClick={(event) => history.push("/custom")}>Custom Game</button>
            </>): (<button onClick={(event) => (<Redirect to="/login" />)}>
            You Need To Login To Create A Game</button>)}
        <button onClick={(event) => history.push("/")}>Back</button>
    </div>);
}

export default GameList;
