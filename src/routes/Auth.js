import { authSerive, firebaseInstance } from 'myBase';
import React, { useState } from 'react';
import AuthForm from 'components/AuthForm';

const Auth = () => {
    const [newAccount, setNewaccount] = useState(true);
 
    const toggleAccount = () => setNewaccount(prev => !prev);
    const onSocialClick = async(e) => {
        const {name} = e.target;
        let provider;
        if(name === 'googgle'){
           provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if(name === 'github'){
           provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        await authSerive.signInWithPopup(provider);
    }

    return <>
    <div>
        <AuthForm newAccount={newAccount} />
        <span onClick={toggleAccount}>{newAccount?"Sign in":"Create Account"}</span>
        <button name="googgle" onClick={onSocialClick} >Continue with Google</button>
        <button name="github" onClick={onSocialClick} >Continue with Github</button>
    </div>  
    </>;
}

export default Auth