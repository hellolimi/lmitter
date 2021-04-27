import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authSerive } from 'myBase';
import logo from 'img/logo512.png';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authSerive.onAuthStateChanged((user) => {
      if(user){
        let proPhoto;
        if(user.photoURL){
          proPhoto = user.photoURL;
        }else{
          proPhoto = logo;
        }
        setUserObj({
          displayName : user.displayName,
          uid: user.uid,
          photoURL: proPhoto,
          updateProfile: (args) => user.updateProfile(args),
        });
      }else{
        setUserObj(null);
      }
      setInit(true);
    });
    return () => {
      setUserObj(null);
    }
  }, []);
  const refreshUser = () => {
    
    const user = authSerive.currentUser;
    
    setUserObj({
      displayName : user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) => user.updateProfile(args)
    });
  }
  return <>
    {init?<AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser} />:"Initializing"}
    <footer>&copy; {new Date().getFullYear()} Lmitter</footer>
  </>
}

export default App;
