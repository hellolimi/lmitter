import { authService, firebaseInstance, dbService } from 'myBase';
import React, { useState } from 'react';
import AuthForm from 'components/auth/AuthForm';
import JoinForm from 'components/auth/JoinForm';
import logo from 'img/logo_clean.png';

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
        await authService.signInWithPopup(provider);
        authService.onAuthStateChanged((user) => {
            if(user){
                dbService.collection('users').where('userId', '==', user.uid).onSnapshot(snapshot => {
                    if(snapshot.docs.length === 0){
                         const newUser = {
                             date : user.metadata.creationTime,
                             email : user.email,
                             username : user.displayName,
                             userId : user.uid,
                             photoURL : user.photoURL
                         }
                         dbService.collection(`users`).add(newUser);
                    }
                 });   
            }
        });
    }

    return <>
    <div className="accountForm">
        <h1>
            <img src={logo} alt="logo"/>
            <div>
                <span>lmitter</span>
                <p>Get on Our Social Waves</p>
            </div>
        </h1>
        {newAccount?<JoinForm />:<AuthForm />}
        <span onClick={toggleAccount}>{newAccount?"Sign in":"Create Account"}</span>
        <button name="googgle" onClick={onSocialClick} >Continue with Google</button>
        <button name="github" onClick={onSocialClick} >Continue with Github</button>
    </div>  
    </>;
}

export default Auth