import React from "react";
import CommonClass from "./commonclass";

function MyImageComponent({type, color, url=null})
{
    let cc = new CommonClass();
    if (cc.isStringEmptyNullOrUndefined(type) || cc.isStringEmptyNullOrUndefined(color))
    {
        this.cc.logAndThrowNewError("type and color must be defined, and not null, and not empty!");
    }
    else
    {
        let mysrc = null;
        if (cc.isStringEmptyNullOrUndefined(url)) mysrc = "./" + type + ".png";
        else mysrc = "" + url;
        
        //https://bdwm.be/css-change-a-transparent-png-to-any-color-you-want/
        return (<div className="png-container"><img src={mysrc}
            style={{filter: "drop-shadow(0px 100px 0px " + color + ")",
                transform: "translateY(-100px)"}} alt={"" + color + " " + type + " image"} />
        </div>);
    }
}

export default MyImageComponent;
