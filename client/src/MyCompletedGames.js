import React, {useState, useEffect, useContext} from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "./UserProvider";
import CommonClass from "./commonclass";

function MyCompletedGames(props)
{
    let [mycgs, setMyCGs] = useState([]);
    let [stats, setStatsInfo] = useState([]);
    let [upsdata, setUserPlayerData] = useState([]);
    let [errmsg, setErrorMessage] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let cc = new CommonClass();

    const { user, setUser } = useContext(UserContext);
    const simpusrobj = cc.getSimplifiedUserObj(user);
    console.log("simpusrobj = ", simpusrobj);

    cc.letMustBeDefinedAndNotNull(simpusrobj, "simpusrobj");
    const notloggedin = !simpusrobj["instatus"];
    const username = simpusrobj["username"];

    useEffect(() => {
        if (notloggedin) return;
        fetch("/my-completed-games").then((res) => res.json()).then((mdata) => {
            console.log("mdata = ", mdata);
            setMyCGs(mdata);
            if (cc.isStringEmptyNullOrUndefined(mdata))
            {
                setErrorMessage("");
                setLoaded(true);
            }
            else
            {
                fetch("/stats").then((res) => res.json()).then((omdata) => {
                    console.log("omdata = ", omdata);
                    setStatsInfo(omdata);
                    fetch("/user-players").then((res) => res.json()).then((mupdata) => {
                        console.log("mupdata = ", mupdata);
                        setUserPlayerData(mupdata);
                        setErrorMessage("");
                        setLoaded(true);
                    }).catch((merr) => {
                        console.error("There was a problem getting data from the server!");
                        console.error(merr);
                        setErrorMessage("Could not get the user-player information: " +
                            merr.message);
                        setLoaded(true);
                    });
                }).catch((omerr) => {
                    console.error("There was a problem getting the statistics from the server!");
                    console.error(omerr);
                    setErrorMessage("There was a problem getting the statistics" +
                        " from the server! " + omerr);
                    setLoaded(true);
                });
            }
        }).catch((merr) => {
            console.error("There was a problem getting the completed games from the server!");
            console.error(merr);
            setErrorMessage("There was a problem getting the completed games" +
                " from the server! " + merr);
            setLoaded(true);
        });
    }, []);

    if (loaded);
    else
    {
        if (notloggedin) return (<Redirect to="/login" />);
        else return (<div>Loading Completed Games Data!</div>);
    }


    function onJoin(gm, event)
    {
        console.log("gm = ", gm);
        //the game color will be BOTH
        //this is the server game that gets passed into the gameboard
        //the custom addpcs list if present will be on the first move of the game
        //mcg.moves[0] //some indicator that it is a piecelist
        //addpcs=[{type: "", color, row, col, game_id, move_count},...]
        //we need to take the string from the db and turn it into a list of objects
        //<GameBoard srvrgame={mcg} pa_id={mcg.playera_id} pb_id={mcg.playerb_id} addpcs={} />
    }


    let mydispgms = null;
    let numcgs = 0;
    if (cc.isStringEmptyNullOrUndefined(mycgs));
    else
    {
        //we want to know the two usernames 
        //we want to know who won, tie, lost, resigned
        //maybe move list
        numcgs = mycgs.length;
        mydispgms = mycgs.map((mcg) => {
            //console.log("mcg = ", mcg);
            //console.log("upsdata = ", upsdata);
            //console.log("stats = ", stats);

            let [playertwousrnm, playeroneusrnm, playeronerank, playertworank] =
                cc.getPlayersUsernamesAndRanksFromData(stats, upsdata, mcg);
            
            return (<tr key={mcg.id}>
                <td key={"gameid" + mcg.id + "ausername"}>{playeroneusrnm}</td>
                <td key={"gameid" + mcg.id + "busername"}>{playertwousrnm}</td>
                <td key={"gameid" + mcg.id + "arank"}>{playeronerank}</td>
                <td key={"gameid" + mcg.id + "brank"}>{playertworank}</td>
                <td key={"gameid" + mcg.id + "awon"}>{mcg.playera_won ? "yes": "no"}</td>
                <td key={"gameid" + mcg.id + "bwon"}>{mcg.playerb_won ? "yes": "no"}</td>
                <td key={"gameid" + mcg.id + "aresigned"}>{mcg.playera_resigned ? "yes": "no"}</td>
                <td key={"gameid" + mcg.id + "bresigned"}>{mcg.playerb_resigned ? "yes": "no"}</td>
                <td key={"gameid" + mcg.id + "tied"}>{mcg.tied ? "yes": "no"}</td>
                <td key={"joingameid" + mcg.id}>
                    <button onClick={onJoin.bind(null, mcg)}>Join</button></td>
            </tr>);
        });
    }

    const iserr = !(cc.isStringEmptyNullOrUndefined(errmsg));
    return (<div style={{backgroundColor: cc.getBGColorToBeUsed(iserr, "CompleteGames")}}>
        <h1>My Completed Games</h1>
        <p>There are {numcgs} completed Games for the user {username}!</p>
        <table>
            <thead>
                <tr>
                    <th>Player A Username</th>
                    <th>Player B Username</th>
                    <th>Player A Rank</th>
                    <th>Player B Rank</th>
                    <th>Player A Won</th>
                    <th>Player B Won</th>
                    <th>Player A Resigned</th>
                    <th>Player B Resigned</th>
                    <th>Tied</th>
                    <th>Join</th>
                </tr>
            </thead>
            <tbody>{mydispgms}</tbody>
        </table>
        {iserr ? <p>{errmsg}</p>: null}
    </div>);
}

export default MyCompletedGames;
