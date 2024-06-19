import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import CommonClass from "./commonclass";

let cc = new CommonClass();
function addOtherRouteNamesForRoute(myrts, mstrrtpth)
{
    if (cc.isStringEmptyNullOrUndefined(myrts) ||
        cc.isStringEmptyNullOrUndefined(mstrrtpth))
    {
        return null;
    }
    else
    {
        return myrts.map((myrt) => {
            return (<Route key={myrt} exact path={myrt}>
                <Redirect key={myrt + "redto" + mstrrtpth} to={mstrrtpth} /></Route>);
        });
    }
}

function getRoutesList(path, paths, children)
{
    let myrts = [];
    let orts = addOtherRouteNamesForRoute(paths, path);
    if (cc.isStringEmptyNullOrUndefined(orts));
    else for (let n = 0; n < orts.length; n++) myrts.push(orts[n]);
    myrts.push(<Route key={path} exact path={path}>{children}</Route>);
    console.log("myrts = ", myrts);
    return myrts;
}

function MyRoute({path, paths, children})
{
    return (<>{getRoutesList(path, paths, children)}</>);
}

export { MyRoute, getRoutesList, addOtherRouteNamesForRoute };
