import React from 'react';
import { authService} from 'myBase';
import { useHistory } from 'react-router';
import { useUserContext } from 'Context';
import {Link} from 'react-router-dom';
import logo from 'img/logo_clean.png';

function Navigation() {
    const user = useUserContext();
    const history = useHistory();
    const onLogOutClick = () => {
        const letOut = window.confirm('Do you want really to leave Lmitter?');
        if(letOut){
            authService.signOut();
            history.push('/');
        }
    };

    return (<header>
        <div className="wrap">
            <h1><Link to="/"><img src={logo} alt="logo"/><span>lmitter</span></Link></h1>
            <nav>
                <ul>
                    <li><Link to="/profile">{user.displayName}'s Profile</Link></li>
                    <li><button onClick={onLogOutClick}>Log Out</button></li>
                </ul>
            </nav>
        </div>
    </header>);
}

export default Navigation;