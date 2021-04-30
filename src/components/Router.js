import React from 'react';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Navigation from 'components/Navigation';
import MyProfile from 'routes/MyProfile';
import OtherProfile from 'routes/OtherProfile';

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {

    return (
        <Router>
            <Switch>
                {isLoggedIn?
                    <>
                        <Navigation userObj={userObj} />
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <MyProfile userObj={userObj} refreshUser={refreshUser} />
                        </Route>
                        <Route path={`/profile/:userName/:userId`}>
                            <OtherProfile />
                        </Route>
                    </>
                    :
                    <>
                        <Route exact path="/">
                            <Auth refreshUser={refreshUser} />
                        </Route>
                    </>
                }
            </Switch>
        </Router>
    );
}

export default AppRouter;