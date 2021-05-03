import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authSerive } from 'myBase';
import 'scss/common.scss';

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authSerive.onAuthStateChanged((user) => {
      if(user){
        setUserObj({
          displayName : user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) => user.updateProfile(args)
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
