import React from "react";
import { Route, Redirect } from "react-router-dom";
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
            return (<Route key={myrt} exact path={myrt}><Redirect to={mstrrtpth} /></Route>);
        });
    }
}

function MyRoute({path, paths, children})
{
    return (<><Route exact path={path}>{children}</Route>
        {addOtherRouteNamesForRoute(paths, path)}</>);
}

export { MyRoute, addOtherRouteNamesForRoute };
