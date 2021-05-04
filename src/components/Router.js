import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Navigation from 'components/Navigation';
import MyProfile from 'routes/MyProfile';
import OtherProfile from 'routes/OtherProfile';
import { useUserContext } from 'Context';

const AppRouter = () => {
    const user = useUserContext();
    const isLoggedIn = Boolean(user.uid);
    
    return (
        <Router>
            <Switch>
                {isLoggedIn?
                    <>
                        <Navigation />
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/profile">
                            <MyProfile />
                        </Route>
                        <Route path={`/profile/:userId`}>
                            <OtherProfile />
                        </Route>
                    </>
                    :
                    <>
                        <Route exact path="/">
                            <Auth />
                        </Route>
                    </>
                }
            </Switch>
        </Router>
    );
}

export default AppRouter;