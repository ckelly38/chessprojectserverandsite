import React from "react";
import CommonClass from "./commonclass";

function GameBoard(props)
{
    let cc = new CommonClass();

    //const iserr = !(cc.isStringEmptyNullOrUndefined(errormsg));
    //{iserr ? <p>{errormsg}</p>: null}
    //backgroundColor: cc.getBGColorToBeUsed(false, "GameBoard")
    console.log("backgroundColor: " + cc.getBGColorToBeUsed(false, "GameBoard"));
    
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
                        style={{backgroundColor: mysqrclr}}>{c}</td>);//need to replace this
                    uselightclr = !uselightclr;
                }
                else if (c === 8)
                {
                    let myrnk = -1;
                    if (whitemovesdownranks) myrnk = r + 1;
                    else myrnk = 8 - r;
                    mycolsonrw.push(<td>{myrnk}</td>);
                }
                else if (c === 9) mycolsonrw.push(<td>{r}</td>);
                else throw new Error("illegal value found and used here for c!");
            }
            myrws.push(<tr>{mycolsonrw}</tr>);
        }
        return myrws;
    }

    return (<div style={{marginLeft: 10}}>
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
    </div>);
}

export default GameBoard;
