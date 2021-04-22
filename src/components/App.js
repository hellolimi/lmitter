import React, { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authSerive } from 'myBase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authSerive.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);
  return <>
    {init?<AppRouter isLoggedIn={isLoggedIn} />:"Initializing"}
    <footer>&copy; {new Date().getFullYear()} Lmitter</footer>
  </>
}

export default App;
