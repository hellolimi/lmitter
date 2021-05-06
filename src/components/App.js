import React from 'react';
import AppRouter from 'components/Router';
import 'scss/common.scss';
import { UserProvider } from 'Context';

function App() {

  return (
    <div className="bodyWrap">
      <UserProvider>
        <AppRouter />
        <footer>&copy; {new Date().getFullYear()} Lmitter</footer>
      </UserProvider>
    </div>
  );
}

export default App;