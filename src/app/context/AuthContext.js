import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {auth} from "./FirebaseConfig"



const UserContext = createContext();

// Step 2: Create a data provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState();

    const getUserData = async() => {

        onAuthStateChanged(auth, (userdata) => {
            if (userdata) {
                setUser({
                    loggedin: true,
                    data: userdata
                });
            } else {
                setUser({
                    loggedin: false,
                    data: null
                });
            }
        });
    }

    useEffect(() => {
        getUserData();
    }, []);

    const updateUser = (newData) => {
        setUser(newData);
    };

    return (
        <UserContext.Provider value={{ user, updateUser }}>
        {children}
        </UserContext.Provider>
    );
};

// Step 3: Custom hook to consume the context
export const useUser = () => useContext(UserContext);