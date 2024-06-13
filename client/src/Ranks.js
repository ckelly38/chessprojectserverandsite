import React from "react";

function Ranks(props)
{
    //need to get the list of games
    let games = null;
    let usedummydata = true;
    if (usedummydata)
    {
        games = new Array();
        games.push({id: 1, username: "me", wins: 3, losses: 1, forfeits: 0, ties: 6});
        games.push({id: 2, username: "op", wins: 2, losses: 2, forfeits: 1, ties: 6});
        games.push({id: 3, username: "tu", wins: 1, losses: 3, forfeits: 2, ties: 0});
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
        let fftscntaswn = false;
        myrws = games.map((muser, index) => {
            let wtotal = muser.wins + muser.ties;
            let mtotal = muser.losses + muser.forfeits + wtotal;
            if (fftscntaswn)
            {
                wtotal += muser.forfeits;
                mtotal -= muser.forfeits;
            }
            //else;//do nothing
            return (<tr key={"user" + muser.id}>
                <td key={"user" + muser.id + "index"}>{(index + 1)}</td>
                <td key={"user" + muser.id + "username"}>{muser.username}</td>
                <td key={"user" + muser.id + "wins"}>{muser.wins}</td>
                <td key={"user" + muser.id + "losses"}>{muser.losses}</td>
                <td key={"user" + muser.id + "forfeits"}>{muser.forfeits}</td>
                <td key={"user" + muser.id + "ties"}>{muser.ties}</td>
                <td key={"user" + muser.id + "total"}>{mtotal}</td>
                <td key={"user" + muser.id + "percent"}>
                    {((mtotal === 0 || wtotal === 0) ? 0 : (wtotal/mtotal)*100) + "%"}</td>
            </tr>);
        });
    }

    return (<div>
        <table style={{marginLeft: 10, marginBottom: 10}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>USERNAME</th>
                    <th>WINS</th>
                    <th>LOSSES</th>
                    <th>FORFEITS</th>
                    <th>TIES</th>
                    <th>TOTAL</th>
                    <th>PERCENT</th>
                </tr>
            </thead>
            <tbody>
                {myrws}
            </tbody>
        </table>
    </div>);
}

export default Ranks;
