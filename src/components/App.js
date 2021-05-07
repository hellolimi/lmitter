import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import { UserProvider } from 'Context';
import { authService } from 'myBase';
import 'scss/common.scss';

function App() {
  const [init, setInit] = useState();
  useEffect(() => {
    authService.onAuthStateChanged(() => setInit(true))
  }, []);

  return (
    <div className="bodyWrap">
      <UserProvider>
        {init?<AppRouter />:'hello!!'}
        <footer>&copy; {new Date().getFullYear()} Lmitter</footer>
      </UserProvider>
    </div>
  );
}

export default React.memo(App);