import React, { useEffect, useState, createContext, useContext } from "react";
import { authService, dbService } from "myBase";

const CurrentUserContext = createContext();
const RefreshUser = createContext();
const GetUserData = createContext();

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
    return () => {
      setUser({});
    }
  }, []);

  const getUserData = async (uid) => {
    const ref = await dbService.collection('users').where('userId', '==', uid).get();
    const userInfo = {
      data : ref.docs[0].data(),
      id : ref.docs[0].id
    }
    return userInfo;
  }

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
    <CurrentUserContext.Provider value={user}>
        <RefreshUser.Provider value={refreshUser}>
          <GetUserData.Provider value={getUserData}>
            {children}
          </GetUserData.Provider>
        </RefreshUser.Provider>  
    </CurrentUserContext.Provider>
  );
};

export function useUserContext(){
    const context = useContext(CurrentUserContext);
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

export function useUserData(){
  const context = useContext(GetUserData);
  if(!context){
    throw new Error('Can not find GetUserData function');
  }
  return context;
}
