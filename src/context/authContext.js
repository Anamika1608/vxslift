import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </AppContext.Provider>
    );
}

export default function useAppContext() {
    return useContext(AppContext);
}
