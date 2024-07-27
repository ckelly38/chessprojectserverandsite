import React, { useState, useEffect } from "react";
import CommonClass from "./commonclass";
import ChessPiece from "./ChessPiece";

function Ranks(props)
{
    let cc = new CommonClass();

    function getMySortByString(mynm, myval)
    {
        cc.letMustBeDefinedAndNotNull(mynm, "mynm");
        if (cc.isInteger(myval));
        else cc.logAndThrowNewError("myval (" + myval + ") must be an integer, but it was not!");
        let myfpartstr = null;
        if (myval === 0) myfpartstr = ": OFF";
        else if (myval === 1) myfpartstr = ": ^";
        else myfpartstr = ": v";
        return mynm + " " + myfpartstr;
    }

    function getNextVal(myval, mxval=2)
    {
        if (cc.isInteger(myval));
        else cc.logAndThrowNewError("myval (" + myval + ") must be an integer, but it was not!");
        if (cc.isInteger(mxval));
        else cc.logAndThrowNewError("mxval (" + mxval + ") must be an integer, but it was not!");
        if (myval === mxval) return 0;
        else return myval + 1;
    }

    function compareStrings(a, b)
    {
        if (cc.isItemNullOrUndefined(a))
        {
            if (cc.isItemNullOrUndefined(b)) return 0;
            else return -1;
        }
        else
        {
            if (cc.isItemNullOrUndefined(b)) return 1;
            else return a.localeCompare(b);
        }
    }
    function compareStringsWithKey(key, a, b)
    {
        //console.log("a = ", a);
        //console.log("b = ", b);
        //console.log("key = ", key);
        if (cc.isStringEmptyNullOrUndefined(key)) return compareStrings(a, b);
        else return compareStrings(a[key], b[key]);
    }
    function compareUsernames(a, b)
    {
        return compareStringsWithKey("username", a, b);
    }

    function compareNumbers(a, b)
    {
        //if (a < b) return -1;
        //else if (a === b) return 0;
        //else return 1;
        return a - b;
    }
    function compareNumbersWithKey(key, a, b)
    {
        //console.log("a = ", a);
        //console.log("b = ", b);
        //console.log("key = ", key);
        if (cc.isStringEmptyNullOrUndefined(key)) return compareNumbers(a, b);
        else return compareNumbers(a[key], b[key]);
    }
    function compareWinNumbers(a, b)
    {
        return compareNumbersWithKey("wins", a, b);
    }
    function compareLoseNumbers(a, b)
    {
        return compareNumbersWithKey("losses", a, b);
    }
    function compareForfeitNumbers(a, b)
    {
        return compareNumbersWithKey("forfeits", a, b);
    }
    function compareTieNumbers(a, b)
    {
        return compareNumbersWithKey("ties", a, b);
    }
    function compareTotalNumbers(a, b)
    {
        return compareNumbersWithKey("total", a, b);
    }
    function compareWinPercentNumbers(a, b)
    {
        return compareNumbersWithKey("winpercent", a, b);
    }

    function myDeepCopyObj(myobjarr)
    {
        if (cc.isItemNullOrUndefined(myobjarr)) return null;
        else
        {
            return myobjarr.map((muser) => {
                return {
                    id: muser.id,
                    username: muser.username,
                    wins: muser.wins,
                    losses: muser.losses,
                    ties: muser.ties,
                    forfeits: muser.forfeits,
                    total: muser.total,
                    winpercent: muser.winpercent
                }
            });
        }
    }


    let usedummydata = false;
    let [errormsg, setErrorMessage] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [initdata, setInitData] = useState(null);
    let [sortbyusernames, setSortByUsernames] = useState(0);
    let [sortbyties, setSortByTies] = useState(0);
    let [sortbywins, setSortByWins] = useState(1);
    let [sortbylosses, setSortByLosses] = useState(0);
    let [sortbyforfeits, setSortByForfeits] = useState(0);
    let [sortbytotal, setSortByTotal] = useState(0);
    let [sortbywinpercent, setSortByWinPercent] = useState(0);

    useEffect(() => {
        if (usedummydata)
        {
            let userstats = [];
            userstats.push({id: 1, username: "me", wins: 3, losses: 1, forfeits: 0, ties: 6});
            userstats.push({id: 2, username: "op", wins: 2, losses: 2, forfeits: 1, ties: 6});
            userstats.push({id: 3, username: "tu", wins: 1, losses: 3, forfeits: 2, ties: 0});
            setInitData(userstats);
            setLoaded(true);
        }
        else
        {
            //not sure what to do here at the moment
            //actually fetch the data from the server
            //but we do not have the server set up at all yet
            fetch("/stats").then((res) => res.json()).then((mdata) => {
                setInitData(mdata);
                setErrorMessage("");
                setLoaded(true);
            }).catch((merr) => {
                console.error("There was a problem getting the data from the server!");
                console.error(merr);
                let usemyasyncdataset = false;
                if (usemyasyncdataset)
                {
                    let data = [];
                    data.push({id: 1, username: "me", wins: 3, losses: 1, forfeits: 0, ties: 6});
                    data.push({id: 2, username: "op", wins: 2, losses: 2, forfeits: 1, ties: 6});
                    data.push({id: 3, username: "error", wins: 1, losses: 3,
                        forfeits: 2, ties: 0});
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
    
    //console.log("initdata = ", initdata);
    //console.log("errormsg = " + errormsg);
    //console.log("loaded = " + loaded);

    if (loaded);
    else return (<div>Loading...</div>);
    
    //console.log("sortbyusernames = " + sortbyusernames);
    //console.log("sortbyties = " + sortbyties);
    //console.log("sortbywins = " + sortbywins);
    //console.log("sortbylosses = " + sortbylosses);
    //console.log("sortbyforfeits = " + sortbyforfeits);
    //console.log("sortbytotal = " + sortbytotal);
    //console.log("sortbywinpercent = " + sortbywinpercent);

    let myrws = null;
    let mws = 0;
    let mls = 0;
    let mts = 0;
    let mfs = 0;
    let mtt = 0;
    let usettlrw = true;
    let fftscntaswn = false;
    let mytstdata = null;
    if (cc.isStringEmptyNullOrUndefined(initdata));
    else
    {
        mytstdata = initdata.map((muser) => {
            let wtotal = muser.wins + muser.ties;
            let mtotal = muser.losses + muser.forfeits + wtotal;
            if (fftscntaswn)
            {
                wtotal += muser.forfeits;
                mtotal -= muser.forfeits;
            }
            //else;//do nothing
            mws += muser.wins;
            mls += muser.losses;
            mts += muser.ties;
            mfs += muser.forfeits;
            mtt += mtotal;
            //console.log(Object.keys(muser));
            let useid = (ChessPiece.itemIsOnGivenList("id", Object.keys(muser)));
            let idkey = (useid ? "id": "userid");
            return {
                id: muser[idkey],
                username: muser.username,
                wins: muser.wins,
                losses: muser.losses,
                ties: muser.ties,
                forfeits: muser.forfeits,
                total: mtotal,
                winpercent: ((mtotal === 0 || wtotal === 0) ? 0 : (wtotal/mtotal)*100)
            };
        });
    }

    let myretlistdata = null;
    if (cc.isStringEmptyNullOrUndefined(mytstdata));
    else
    {
        let mysrtedcpy = myDeepCopyObj(mytstdata);
        //console.log("COPY MADE BEFORE SORTING!");

        //console.log(mysrtedcpy.sort(compareNumbersWithKey.bind(this, "wins")));
        
        if (sortbywins === 1 || sortbywins === 2) mysrtedcpy.sort(compareWinNumbers);
        else if (sortbylosses === 1 || sortbylosses === 2) mysrtedcpy.sort(compareLoseNumbers);
        else if (sortbyforfeits === 1 || sortbyforfeits === 2)
        {
            mysrtedcpy.sort(compareForfeitNumbers);
        }
        else if (sortbyties === 1 || sortbyties === 2) mysrtedcpy.sort(compareTieNumbers);
        else if (sortbytotal === 1 || sortbytotal === 2) mysrtedcpy.sort(compareTotalNumbers);
        else if (sortbywinpercent === 1 || sortbywinpercent === 2)
        {
            mysrtedcpy.sort(compareWinPercentNumbers);
        }
        else if (sortbyusernames === 1 || sortbyusernames === 2) mysrtedcpy.sort(compareUsernames);
        //else if (?) mysrtedcpy.sort(compareNumbers);
        else mysrtedcpy.sort();
        
        //console.log("COPY AFTER SORTING: mysrtedcpy = ", mysrtedcpy);

        if (sortbywins === 1 || sortbylosses === 1 || sortbyforfeits === 1 || sortbyties === 1 ||
            sortbytotal === 1 || sortbywinpercent === 1 || sortbyusernames === 1)
        {
            let myrevsrtedcpy = myDeepCopyObj(mysrtedcpy).reverse();//[...mysrtedcpy]
            //console.log("myrevsrtedcpy = ", myrevsrtedcpy);
            //console.log("called reverse!");
            //cc.logAndThrowNewError("NEED TO MAKE SURE THE LIST ACTUALLY REVERSED!");

            myretlistdata = myDeepCopyObj(myrevsrtedcpy);
        }
        else myretlistdata = myDeepCopyObj(mysrtedcpy);
    }
    //console.log("FINAL myretlistdata = ", myretlistdata);

    if (cc.isStringEmptyNullOrUndefined(myretlistdata))
    {
        if (usettlrw) myrws = [];
        //else;//do nothing
    }
    else
    {
        myrws = myretlistdata.map((muser, index) => {
            let basekynm = "user" + muser.id;
            return (<tr key={basekynm}>
                <td key={basekynm + "index"}>{(index + 1)}</td>
                <td key={basekynm + "username"}>{muser.username}</td>
                <td key={basekynm + "wins"}>{muser.wins}</td>
                <td key={basekynm + "losses"}>{muser.losses}</td>
                <td key={basekynm + "forfeits"}>{muser.forfeits}</td>
                <td key={basekynm + "ties"}>{muser.ties}</td>
                <td key={basekynm + "total"}>{muser.total}</td>
                <td key={basekynm + "percent"}>{muser.winpercent + "%"}</td>
            </tr>);
        });
    }
    if (usettlrw)
    {
        myrws.push((<tr key={"total"}>
            <td key={"totalindex"}><b> </b></td>
            <td key={"totalusername"}><b>Total</b></td>
            <td key={"totalwins"}><b>{mws}</b></td>
            <td key={"totallosses"}><b>{mls}</b></td>
            <td key={"totalforfeits"}><b>{mfs}</b></td>
            <td key={"totalties"}><b>{mts}</b></td>
            <td key={"totaltotal"}><b>{mtt}</b></td>
            <td key={"totalpercent"}><b>{"N/A%"}</b></td>
        </tr>));
    }
    //else;//do nothing

    //when we click wins, losses, ties, total, or percent most to least or least to most
    //we sort by wins, then losses, then ties, then total then percent
    //each username will be unique

    //we will only sort by one column, click the button off -> most -> least -> off
    //when no sorting original data ordering will be used (server returns in order of most wins).
    //, marginTop: 10
    const iserr = !(cc.isStringEmptyNullOrUndefined(errormsg));
    return (<div style={{marginLeft: 10, paddingTop: 1,
        backgroundColor: cc.getBGColorToBeUsed(iserr, "Ranks")}}>
        <h2>Ranks Page:</h2>
        <table style={{marginLeft: 10, marginBottom: 10}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th><button onClick={
                        (event) => setSortByUsernames(getNextVal(sortbyusernames))}>
                        {getMySortByString("USERNAME", sortbyusernames)}</button></th>
                    <th><button onClick={(event) => setSortByWins(getNextVal(sortbywins))}>
                        {getMySortByString("WINS", sortbywins)}</button></th>
                    <th><button onClick={(event) => setSortByLosses(getNextVal(sortbylosses))}>
                        {getMySortByString("LOSSES", sortbylosses)}</button></th>
                    <th><button onClick={
                        (event) => setSortByForfeits(getNextVal(sortbyforfeits))}>
                        {getMySortByString("FORFEITS", sortbyforfeits)}</button></th>
                    <th><button onClick={(event) => setSortByTies(getNextVal(sortbyties))}>
                        {getMySortByString("TIES", sortbyties)}</button></th>
                    <th><button onClick={(event) => setSortByTotal(getNextVal(sortbytotal))}>
                        {getMySortByString("TOTAL", sortbytotal)}</button></th>
                    <th><button onClick={
                        (event) => setSortByWinPercent(getNextVal(sortbywinpercent))}>
                        {getMySortByString("PERCENT WON", sortbywinpercent)}</button></th>
                </tr>
            </thead>
            <tbody>
                {myrws}
            </tbody>
        </table>
        <p>Total Games Played: {(mtt / 2)}</p>
        {iserr ? <p>{errormsg}</p>: null}
        <p>NOTE: FORFEITS count as a {fftscntaswn ? "win" : "loss"}!</p>
    </div>);
}

export default Ranks;
