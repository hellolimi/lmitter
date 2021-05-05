import React, { useEffect, useState, createContext, useContext } from "react";
import { authService } from "myBase";

const UserContext = createContext();
const RefreshUser = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

  useEffect(() => {
    authService.onAuthStateChanged(user => {
        if(user){
            setUser({
                displayName : user.displayName,
                uid: user.uid,
                photoURL: user.photoURL,
                updateProfile: (args) => user.updateProfile(args)
              });
        }else{
            setUser({});
        } 
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUser({
      displayName : user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) => user.updateProfile(args)
    });
  }

  return (
    <UserContext.Provider value={user}>
        <RefreshUser.Provider value={refreshUser}>
            {children}
        </RefreshUser.Provider>  
    </UserContext.Provider>
  );
};

export function useUserContext(){
    const context = useContext(UserContext);
    if(!context){
        throw new Error('Can not find userContext');
    }
    return context;
}

export function useRefreshUser(){
    const context = useContext(RefreshUser);
    if(!context){
        throw new Error('Can not find resfreshUser function');
    }
    return context;
}
