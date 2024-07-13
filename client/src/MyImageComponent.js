import React from "react";
import CommonClass from "./commonclass";
//import logo from './logo.svg';
//import BishopImg from './Bishop.png';
//import CastleImg from './Castle.png';
//import KnightImg from './Knight.png';
//import QueenImg from './Queen.png';
//import KingImg from './King.png';
//import PawnImg from './Pawn.png';

function MyImageComponent({type, color, url=null})
{
    let cc = new CommonClass();
    if (cc.isStringEmptyNullOrUndefined(type) || cc.isStringEmptyNullOrUndefined(color))
    {
        cc.logAndThrowNewError("type and color must be defined, and not null, and not empty!");
    }
    else
    {
        let mysrc = null;
        if (cc.isStringEmptyNullOrUndefined(url)) mysrc = "" + type + ".png";//"./"
        else mysrc = "" + url;
        //console.log("mysrc = " + mysrc);

        //<img src={logo} className="App-logo" alt="logo" />
        
        //https://bdwm.be/css-change-a-transparent-png-to-any-color-you-want/
        return (<div className="png-container"><img src={mysrc}
            style={{filter: "drop-shadow(0px 100px 0px " + color + ")",
                transform: "translateY(-100px)"}} alt={"" + color + " " + type + " image"} />
        </div>);
    }
}

export default MyImageComponent;
