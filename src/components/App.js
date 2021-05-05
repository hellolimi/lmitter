import React from 'react';
import AppRouter from 'components/Router';
import 'scss/common.scss';
import { UserProvider } from 'Context';

function App() {

  return (
    <UserProvider>
      <AppRouter />
      <footer>&copy; {new Date().getFullYear()} Lmitter</footer>
    </UserProvider>
  );
}

export default App;