import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Navigation from 'components/Navigation';
import Profile from 'routes/Profile';

const AppRouter = ({isLoggedIn}) => {
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
                            <Profile />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                    :
                    <>
                        <Route exact path="/">
                        <Auth />
                        </Route>
                        <Redirect from="*" to="/" />
                    </>
                }
            </Switch>
        </Router>
    );
}

export default AppRouter;