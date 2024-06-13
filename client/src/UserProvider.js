//https://medium.com/@anna-cole/a-beginners-guide-on-how-to-implement-context-in-a-react-application-for-better-state-management-06e52897715d
import React, {useState, createContext} from "react";

const UserContext = createContext();

function UserProvider({children})
{
    const [user, setUser] = useState(null);

    //need to get the current user

    return (<UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>);
}

export { UserContext, UserProvider };
