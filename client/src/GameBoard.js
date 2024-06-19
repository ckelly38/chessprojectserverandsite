import React from "react";
import CommonClass from "./commonclass";

function GameBoard(props)
{
    let cc = new CommonClass();

    //const iserr = !(cc.isStringEmptyNullOrUndefined(errormsg));
    //{iserr ? <p>{errormsg}</p>: null}
    //backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")
    //console.log("backgroundColor: " + cc.getBGColorToBeUsed(false, "GameBoard"));
    
    function generateTableRows(whitemovesdownranks, lsqrclr, dsqrclr)
    {
        let myrws = [];
        let uselightclr = true;
        for (let r = 0; r < 8; r++)
        {
            let mycolsonrw = [];
            if (r % 2 === 0) uselightclr = true;
            else uselightclr = false;
            for (let c = 0; c < 8 + 2; c++)
            {
                let mysqrclr = null;
                if (uselightclr) mysqrclr = "" + lsqrclr;
                else mysqrclr = "" + dsqrclr;
                if (c < 8)
                {
                    mycolsonrw.push(<td key={"(" + r + ", " + c + ")"}
                        style={{backgroundColor: mysqrclr, height: 60, width: 60}}>
                            {c}</td>);//need to replace this
                    uselightclr = !uselightclr;
                }
                else if (c === 8)
                {
                    let myrnk = -1;
                    if (whitemovesdownranks) myrnk = r + 1;
                    else myrnk = 8 - r;
                    mycolsonrw.push(<td key={"rank" + myrnk}>{myrnk}</td>);
                }
                else if (c === 9) mycolsonrw.push(<td key={"rval" + r}>{r}</td>);
                else throw new Error("illegal value found and used here for c!");
            }
            myrws.push(<tr key={"rowid" + r}>{mycolsonrw}</tr>);
        }
        return myrws;
    }

    let iscompleted = false;
    let currentsideisincheck = true;
    let acurrentsidequeenisincheck = false;
    let iswhiteturn = false;
    let playertwousrnm = "tu";
    let playeroneusrnm = "me";
    let playeronecolor = "WHITE";
    let playertwocolor = "BLACK";
    let playeronerank = -1;
    let playertworank = -1;
    return (<div style={{marginLeft: 10,
        backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")}}>
        <h2>Play Game:</h2>
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>0<br />A</th>
                    <th>1<br />B</th>
                    <th>2<br />C</th>
                    <th>3<br />D</th>
                    <th>4<br />E</th>
                    <th>5<br />F</th>
                    <th>6<br />G</th>
                    <th>7<br />H</th>
                    <th>(COLS)<br />RANK</th>
                    <th>ROW</th>
                </tr>
            </thead>
            <tbody>
                {generateTableRows(true, "orange", "black")}
            </tbody>
        </table>
        
        <div>Check Status: {currentsideisincheck ? (<b>You're in Check!</b>): "No!"}<br />
        Queen WARNING: {acurrentsidequeenisincheck ? "You're Queen is in Check!": "No!"}</div>
        
        <button>{"< " + (iscompleted ? "Previous": "Undo") + " Move"}</button>
        <button>{"> " + (iscompleted ? "Next": "Redo") + " Move"}</button>
        <button>{(iswhiteturn ? "Black": "White") + "'s Turn!"}</button>
        
        <table style={{marginLeft: 10, marginBottom: 10, marginTop: 10}}>
            <thead>
                <tr>
                    <th>PLAYER 1: {playeronecolor}</th>
                    <th>PLAYER 2: {playertwocolor}</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>USERNAME: {playeroneusrnm}</td><td>USERNAME: {playertwousrnm}</td></tr>
                <tr><td>RANK # {playeronerank}</td><td>RANK # {playertworank}</td></tr>
            </tbody>
        </table>
    </div>);
}

export default GameBoard;
