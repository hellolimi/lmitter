import React, {useEffect, useState} from 'react';
import AppRouter from 'components/Router';
import { UserProvider } from 'Context';
import { authService } from 'myBase';
import 'scss/common.scss';
import LoadingBar from './LoadingBar';

function App() {
  const [init, setInit] = useState();
  useEffect(() => {
    document.title = 'lmitter | Social Waves';
    authService.onAuthStateChanged(() => setInit(true));
  }, []);

  return (
    <div className="bodyWrap">
      <UserProvider>
        {init?<AppRouter />:<div className="initFalse">
            <LoadingBar loadingOn="keep"/>
            </div>}
        <footer>&copy; 2021 Lmitter</footer>
      </UserProvider>
    </div>
  );
}

export default React.memo(App);