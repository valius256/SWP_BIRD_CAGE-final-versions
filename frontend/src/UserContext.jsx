import React, { createContext, useState, useEffect } from 'react';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);


    useEffect(() => {
        const storedUser = sessionStorage.getItem('loginedUser');
        if (storedUser) {
            if (storedUser != 0) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};