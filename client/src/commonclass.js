class CommonClass{
    isItemNullOrUndefined(val)
    {
        return (val === undefined || val === null);
    }

    isStringEmptyNullOrUndefined(stra)
    {
        return (this.isItemNullOrUndefined(stra) || stra.length < 1);
    }
    
    logAndThrowNewError(errmsg)
    {
        console.error(errmsg);
        throw new Error(errmsg);
    }

    letMustBeDefinedAndNotNull(val, vnm="varnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "varnm";
        else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val))
        {
            this.logAndThrowNewError("" + varnm + " must be a defined variable!");
        }
    }

    letMustBeBoolean(val, vnm="boolvarnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "boolvarnm";
        else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val))
        {
            this.logAndThrowNewError("" + varnm + " must be a defined boolean variable!");
        }
        else
        {
            if (val === true || val === false);
            else this.logAndThrowNewError("" + varnm + " must be a defined boolean variable!");
        }
    }

    isNumberOrInteger(val, useint=false)//, vnm="numvarnm"
    {
        this.letMustBeBoolean(useint, "useint");
        
        //let varnm = "";
        //if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "numvarnm";
        //else varnm = "" + vnm;
        if (this.isItemNullOrUndefined(val)) return false;
        else
        {
            if (isNaN(val)) return false;
            else
            {
                try
                {
                    let num = Number(val);
                    if (useint) return (num == parseInt(val));
                    else return true;
                }
                catch(ex)
                {
                    return false;
                }
            }
        }
    }
    isInteger(val)//, vnm="numvarnm"
    {
        return this.isNumberOrInteger(val, true);//, vnm
    }
    isNumber(val)//, vnm="numvarnm"
    {
        return this.isNumberOrInteger(val, false);//, vnm
    }

    isDigit(wd)
	{
		if (this.isStringEmptyNullOrUndefined(wd) || wd.length != 1) return false;
        //else;//do nothing
		
		const dgts = "0123456789";
		for (let di = 0; di < dgts.length; di++)
		{
			if (wd.charAt(0) === dgts.charAt(di)) return true;
			//else;//do nothing
		}
		return false;
	}

    isANumber(wd)
	{
		if (this.isStringEmptyNullOrUndefined(wd)) return false;
		else
		{
			for (let i = 0; i < wd.length; i++)
			{
				if (this.isDigit("" + wd.charAt(i)));
				else return false;
			}
			return true;
		}
	}

    letMustBeANumber(val, vnm="numvarnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "numvarnm";
        else varnm = "" + vnm;
        if (this.isNumber(val));
        else this.logAndThrowNewError("" + varnm + " must be a number, but it was not!");
    }

    letMustBeAnInteger(val, vnm="numvarnm")
    {
        let varnm = "";
        if (this.isStringEmptyNullOrUndefined(vnm)) varnm = "numvarnm";
        else varnm = "" + vnm;
        if (this.isInteger(val));
        else this.logAndThrowNewError("" + varnm + " must be an integer, but it was not!");
    }

    isStringAOnStringBList(stra, mstrs)
    {
        if (this.isStringEmptyNullOrUndefined(mstrs)) return false;
        else
        {
            for (let n = 0; n < mstrs.length; n++)
            {
                if (this.isItemNullOrUndefined(mstrs[n]))
                {
                    if (this.isItemNullOrUndefined(stra)) return true;
                }
                else
                {
                    if (this.isItemNullOrUndefined(stra));
                    else if (stra === mstrs[n]) return true;
                }
            }

            return false;
        }
    }

    countNumberOfACharInString(mchar, stra)
    {
        if (this.isStringEmptyNullOrUndefined(stra)) return 0;
        else if (this.isItemNullOrUndefined(mchar)) return 0;
        else
        {
            let numc = 0;
            for (let n = 0; n < stra.length; n++) if (stra.charAt(n) === mchar) numc++;
            return numc;
        }
    }
    getTypeErrorMsgFromList(vtypes)
    {
        //add a comma and a space after each item
        //include or just before the last item

        if (this.isStringEmptyNullOrUndefined(vtypes))
        {
            return "there are no valid types!";
        }
        //else;//do nothing

        let retstr = "";
        vtypes.forEach((item, index) => {
            if (this.isStringEmptyNullOrUndefined(item))
            {
                this.logAndThrowNewError("the type name must not be empty, null, or undefined!");
            }
            else
            {
                if (vtypes.length === 1 || index === 0) retstr += "" + item;
                else
                {
                    if (index + 1 < vtypes.length) retstr += ", " + item;
                    else if (index + 1 === vtypes.length) retstr += ", or " + item;
                    else this.logAndThrowNewError("illegal index found and used here!");
                }
            }
        });
        //console.log("typenm must be " + retstr + ", but it was not!");
        return "typenm must be " + retstr + ", but it was not!";
    }

    addItemToBeginningOfList(myotds, usemytd, pusemy)
    {
        this.letMustBeDefinedAndNotNull(myotds, "myotds");
        this.letMustBeBoolean(pusemy, "pusemy");

        let mytds = null;
        if (pusemy)
        {
            this.letMustBeDefinedAndNotNull(usemytd, "usemytd");

            mytds = [usemytd];
            myotds.forEach((item) => {
                mytds.push(item);
            });
        }
        else mytds = myotds;
        return mytds;
    }

    getBGColorToBeUsed(err, typenm)
    {
        this.letMustBeBoolean(err, "err");
        this.letMustBeDefinedAndNotNull(typenm, "typenm");

        let mybgcolor = "";
        if (err) mybgcolor = "red";
        else
        {
            if (typenm === "Episode") mybgcolor = "cyan";
            else if (typenm === "Toy") mybgcolor = "orange";
            else if (typenm === "Show") mybgcolor = "yellow";

            else if (typenm === "Rules") mybgcolor = "yellow";
            else if (typenm === "Ranks" || typenm === "Stats" || typenm === "Statistics")
            {
                mybgcolor = "orange";
            }
            else if (typenm === "GameBoard") mybgcolor = "orange";
            else if (typenm === "GameList") mybgcolor = "lime";
            else if (typenm === "SignUp") mybgcolor = "yellow";
            else if (typenm === "Login") mybgcolor = "lime";
            else if (typenm === "Preferences") mybgcolor = "pink";
            else
            {
                this.logAndThrowNewError(this.getTypeErrorMsgFromList(["Ranks", "Stats",
                    "Statistics", "GameList", "GameBoard", "Episode", "Toy", "Show", "SignUp",
                    "Login", "Preferences"]));
                //this.logAndThrowNewError("typenm must be Episode, Toy, Show, or SignUp, " +
                //  "Login, or Preferences but it was not!");
            }
        }
        return mybgcolor;
    }

    genOptionListFromArray(vals, dispvals=null)
    {
        if (this.isStringEmptyNullOrUndefined(vals)) return null;
        else
        {
            if (this.isStringEmptyNullOrUndefined(dispvals));
            else
            {
                if (dispvals.length === vals.length);
                else
                {
                    this.logAndThrowNewError("the display vals and the values must " +
                        "be the same length, but they were not!");
                }
            }

            return vals.map((myval, index) => {
                let mydispval = null;
                if (this.isStringEmptyNullOrUndefined(dispvals)) mydispval = "" + myval;
                else mydispval = dispvals[index];
                return (<option key={myval} value={myval}>{mydispval}</option>)});
        }
    }

    getSimplifiedUserObj(muser)
    {
        let musrnm = "";
        let lgi = false;
        let alv = 0;
        let pswd = "";
        let usrid = -1;
        if (muser === undefined || muser === null) musrnm = "not logged in";
        else
        {
            musrnm = muser.name;
            alv = muser.access_level;
            lgi = true;
            usrid = muser.id;
            pswd = muser.password;
        }

        return {"id": usrid, "username": musrnm, "access_level": alv, "instatus": lgi,
            "password": pswd};
    }
    
    isUpperCase(c)
    {
        if (this.isStringEmptyNullOrUndefined(c)) return false;
        else return (c.toUpperCase() === c);
    }

    isLowerCase(c)
    {
        if (this.isStringEmptyNullOrUndefined(c)) return false;
        else return (c.toLowerCase() === c);
    }

    titleCase(wd)
    {
        //uppercase first letter of each word
        //look for next space
        //everything before next space is lowercase except starting letters...

        let myretwd = "";
        if (this.isItemNullOrUndefined(wd)) return null;
        else if (wd.length < 1) return "";
        else if (wd.length === 1)
        {
            if (this.isUpperCase(wd.charAt(0))) return "" + wd;
            else return wd.toUpperCase();
        } 
        else
        {
            let startwd = true;
            for (let i = 0; i < wd.length; i++)
            {
                if (startwd)
                {
                    if (this.isUpperCase(wd.charAt(i))) myretwd += "" + wd.charAt(i);
                    else myretwd += ("" + wd.charAt(i)).toUpperCase();
                    startwd = false;
                }
                else
                {
                    if (wd.charAt(i) === " ")
                    {
                        myretwd += " ";
                        startwd = true;
                    }
                    else
                    {
                        if (this.isLowerCase(wd.charAt(i))) myretwd += "" + wd.charAt(i);
                        else myretwd += ("" + wd.charAt(i)).toLowerCase();
                    }
                }
            }
        }
        return myretwd;
    }

    //PROBABLY WILL NEVER USE ANYTHING BELOW THIS LINE

    getAndGenInitDataObjectForType(typenm)
    {
        this.letMustBeDefinedAndNotNull(typenm, "typenm");

        if (typenm === "Episode")
        {
            return {"description": "description",
                "name": "loading...",
                "season_number": -1,
                "episode_number": -1,
                "showname": "Show Name",
                "watched": false,
                "showid": -1,
                "showownerid": -1,
                "id": -1
            };
        }
        else if (typenm === "Toy")
        {
            return {"description": "description",
                "name": "loading...",
                "showname": "Show Name",
                "price": -1,
                "showid": -1,
                "showownerid": -1,
                "id": -1
            };
        }
        else if (typenm === "Show")
        {
            return {"description": "description",
                "name": "loading...",
                "numseasons": -1,
                "numepisodesperseason": -1,
                "totalepisodes": -1,
                "showid": -1,
                "owner_id": -1,
                "id": -1
            };
        }
        else this.logAndThrowNewError("typenm must be Episode, Toy, or Show, but it was not!");
    }

    //if dataobj is null or undefined it returns a default object
    //instead of null or throwing an error
    getAndGenSeasonsInfoObject(dataobj)
    {
        console.log("dataobj = ", dataobj);
        if (this.isItemNullOrUndefined(dataobj))
        {
            return {"numseasons": -1,
                "totalepisodes": -1,
                "numepisodesperseason": -1
            };
        }
        //else;//do nothing
        
        let teps = -1;
        if (this.isItemNullOrUndefined(dataobj.episodes)) teps = 0;
        else teps = dataobj.episodes.length;
        //console.log("teps = " + teps);
        
        let numseasons = -1;
        if (teps === 0) numseasons = 0;
        else if (teps > 0)
        {
            if (this.isItemNullOrUndefined(dataobj.episodes))
            {
                this.logAndThrowNewError("the teps was more than zero, but there are no " +
                    "episodes in the object, so it should have been zero!");
            }
            //else;//do nothing

            let mymaxsnum = 0;
            let mymaxsnumi = -1;
            for (let n = 0; n < dataobj.episodes.length; n++)
            {
                let cepsnnum = dataobj.episodes[n].season_number;
                if (mymaxsnumi < 0)
                {
                    mymaxsnum = cepsnnum;
                    mymaxsnumi = n;
                }
                else
                {
                    if (mymaxsnum < cepsnnum)
                    {
                        mymaxsnum = cepsnnum;
                        mymaxsnumi = n;
                    }
                    //else;//do nothing
                }
            }//end of n for loop
            //console.log("mymaxsnum = " + mymaxsnum);
            //console.log("mymaxsnumi = " + mymaxsnumi);

            if (mymaxsnumi < 0 || mymaxsnum < 1)
            {
                this.logAndThrowNewError("the teps was more than zero, but there were either " +
                    "no eps in the object OR there was no valid season number on any " +
                    "of the episodes. The season number must be greater than zero!");
            }
            else numseasons = mymaxsnum;
        }
        else this.logAndThrowNewError("teps must be a positive or zero integer!");
        //console.log("numseasons = " + numseasons);

        let rmndr = -1;
        let numepsperseason = -1;
        if (numseasons === 0)
        {
            if (teps === 0)
            {
                rmndr = 0;
                numepsperseason = 0;
            }
            else this.logAndThrowNewError("if numseasons is zero, then teps must also be zero!");
        }
        else
        {
            rmndr = (teps % numseasons);
            numepsperseason = (teps / numseasons);
        }
        //console.log("numepsperseason = " + numepsperseason);
        //console.log("rmndr = " + rmndr);

        let fnumepsperseason = -1;
        if (rmndr === 0) fnumepsperseason = numepsperseason;
        else fnumepsperseason = Math.round(numepsperseason);
        //round up if it is bigger, round down if smaller
        //console.log("fnumepsperseason = " + fnumepsperseason);
        
        let mysnsobj = {"numseasons": numseasons,
            "totalepisodes": teps,
            "numepisodesperseason": fnumepsperseason
        };
        console.log("mysnsobj = ", mysnsobj);
        
        return mysnsobj;
    }

    getAcceptedNamesForNumEpisodesPerSeason()
    {
        return ["~ Total Episodes/Season", "Approximate Total Episodes/Season",
            "Approximate Total Episodes Per Season", "Rough Total Episodes Per Season",
            "Rough Total Episodes/Season", "Rough Total Episodes /Season",
            "Rough Total Episodes/ Season", "Rough Total Episodes / Season",
            "Approximate Total Episodes /Season", "Approximate Total Episodes/ Season",
            "Approximate Total Episodes / Season", "~ Total Episodes /Season",
            "~ Total Episodes/ Season", "~ Total Episodes / Season"];
    }

    getCSSClassNameForHeader(hstr, usecntr=false)
    {
        this.letMustBeDefinedAndNotNull(hstr, "hstr");
        this.letMustBeBoolean(usecntr, "usecntr");
        
        let mycntrtxtnm = "";
        if (usecntr) mycntrtxtnm = "align";

        if (hstr === "Season #") return "seasnum" + mycntrtxtnm;
        else if (hstr === "Episode #") return "epnum" + mycntrtxtnm;
        else if (hstr === "Price" || hstr === "Quantity") return "epnum" + mycntrtxtnm;
        else if (hstr === "# Of Episodes") return "seasnum" + mycntrtxtnm;
        else if (hstr === "# Of Seasons") return "seasnum" + mycntrtxtnm;
        else if (this.isStringAOnStringBList(hstr,
            this.getAcceptedNamesForNumEpisodesPerSeason()))
        {
            return "seasnum" + mycntrtxtnm;
        }
        else if (0 <= hstr.indexOf("Name") && hstr.indexOf("Name") < hstr.length)
        {
            return "namecol";
        }
        else return "border";
    }

    getHeadersForType(typenm, useindivdisp=false)
    {
        this.letMustBeBoolean(useindivdisp, "useindivdisp");
        this.letMustBeDefinedAndNotNull(typenm, "typenm");

        let hlist = null;
        if (typenm === "Episode")
        {
            console.log("useindivdisp = " + useindivdisp);

            let shortephlist = ["Name", "Season #", "Episode #", "Watch Link", "Description"];
            let longephlist = ["Show Name", "Name", "Season #", "Episode #", "Watch Link",
                "Description"];
            if (useindivdisp) return longephlist;
            else return shortephlist;
        }
        else if (typenm === "Toy")
        {
            let indvdisplist = ["Show Name", "Name", "Price", "Quantity", "Description"];
            let nonindvlist = ["Name", "Show Name", "Price", "Description"];
            if (useindivdisp) return indvdisplist;
            else return nonindvlist;
        }
        else if (typenm === "Show")
        {
            hlist = ["Name", "# Of Seasons", "# Of Episodes", "~ Total Episodes/Season",
                "Episodes Link", "Toys Link", "Description"];
        }
        else this.logAndThrowNewError(this.getTypeErrorMsgFromList(["Episode", "Toy", "Show"]));
        //else this.logAndThrowNewError("typenm must be Episode, Toy, or Show, but it was not!");
        return hlist;
    }
    isHeaderCentered(hstr)
    {
        //for episodes the headers are:
        //episode name
        //season number (center)
        //episode number (center)
        //watch link
        //description

        //for shows the headers are:
        //name
        //total seasons (center)
        //total episodes (center)
        //~ total episodes/season (center)
        //episodes link
        //description

        //for toys the headers are:
        //name
        //showname
        //price (center)
            //description

        let centeredheaders = ["Season #", "Episode #", "Price", "# Of Episodes",
            "# Of Seasons", "# Of Episodes", "~ Total Episodes/Season"];
        this.letMustBeDefinedAndNotNull(hstr, "hstr");
        for (let n = 0; n < centeredheaders.length; n++)
        {
            if (hstr === centeredheaders[n]) return true;
        }
        return false;
    }
    getAreHeadersForTypeCentered(myhlist = this.getHeadersForType())
    {
        if (myhlist === undefined || myhlist === null) return null;
        else return myhlist.map((item) => this.isHeaderCentered(item));
    }

    getTheDataKeyNameFromString(mstr,
        epspersnnameslist=this.getAcceptedNamesForNumEpisodesPerSeason())
    {
        let myoepsnameslist = null;
        if (epspersnnameslist === undefined || epspersnnameslist === null ||
            epspersnnameslist.length < 10)
        {
            myoepsnameslist = this.getAcceptedNamesForNumEpisodesPerSeason();
        }
        else myoepsnameslist = epspersnnameslist;
        //console.log("myoepsnameslist = ", myoepsnameslist);

        let mky = "";
        if (mstr === "Show Name") mky = "showname";
        else if (mstr === "Season #") mky = "season_number";
        else if (mstr === "Episode #") mky = "episode_number";
        else if (mstr === "# Of Episodes") mky = "totalepisodes";
        else if (mstr === "# Of Seasons") mky = "numseasons";
        else if (this.isStringAOnStringBList(mstr, myoepsnameslist))
        {
            mky = "numepisodesperseason";
        }
        else if (mstr === "Watch Link" || mstr === "Episodes Link" || mstr === "Toys Link");
        else mky = "" + mstr.toLowerCase();
        return mky;
    }
}

export default CommonClass;
