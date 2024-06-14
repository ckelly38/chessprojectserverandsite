import React from "react";

function GameList({props})
{
    //need to get the list of games
    let games = null;
    let usedummydata = true;
    if (usedummydata)
    {
        games = new Array();
        games.push({id: 1, username: "me", color: null, defers: true, ipaddress: "127.0.0.1"});
        games.push({id: 2, username: "op", color: "WHITE", defers: false, ipaddress: "127.0.0.1"});
        games.push({id: 3, username: "me", color: "BLACK", defers: false, ipaddress: "127.0.0.1"});
    }
    else
    {
        //not sure what to do here at the moment
        //actually fetch the data from the server
        //but we do not have the server set up at all yet
    }

    let myrws = null;
    if (games === null || games === undefined || games.length < 1);
    else
    {
        myrws = games.map((game) => {
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

    return (<div>
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
    </div>);
}

export default GameList;
