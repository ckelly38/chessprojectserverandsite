import React from "react";
import CommonClass from "./commonclass";

function MyImageComponent({type, color})
{
    let cc = new CommonClass();
    if (cc.isStringEmptyNullOrUndefined(type) || cc.isStringEmptyNullOrUndefined(color))
    {
        throw new Error("type and color must be defined, and not null, and not empty!");
    }
    else
    {
        //https://bdwm.be/css-change-a-transparent-png-to-any-color-you-want/
        return (<div className="png-container"><img src={"./" + type + ".png"}
            style={{filter: "drop-shadow(0px 100px 0px " + color + ")",
                transform: "translateY(-100px)"}} />
        </div>);
    }
}

export default MyImageComponent;
