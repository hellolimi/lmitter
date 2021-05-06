import React, {useState} from 'react';
import {authService, dbService } from 'myBase';
import { useRefreshUser } from 'Context';
import logo from 'img/logo512.png';

function AccountForm() {
    const initialInputs = {
        username: '',
        email:'',
        password:''
    };
    const [inputs, setInput] = useState(initialInputs);
    const [error, setError] = useState('');
    const refreshUser = useRefreshUser();

    const {username, email, password} = inputs;
    const onChange = (e) => {
        const {name, value} = e.target;
        setInput({...inputs, [name] : value});
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            await authService.createUserWithEmailAndPassword( email,  password );
            authService.onAuthStateChanged((user) => {
                if (user) {
                    user.updateProfile({ 
                        displayName: username,
                        photoURL: logo
                    });
                    const newUser = {
                        date : user.metadata.creationTime,
                        email : user.email,
                        username : username,
                        userId : user.uid,
                        photoURL : logo
                    }
                    dbService.collection(`users`).add(newUser);
                }
            });
            setTimeout(refreshUser, 900);
        }catch(error){
            setError(error.message);
        }
    } 
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="username" type="text" placeholder="Your Name" value={username} required onChange={onChange} />
                <input name="email" type="text" placeholder="Email" value={email} required onChange={onChange} />
                <input name="password" type="password" placeholder="Password" value={password} required onChange={onChange} />
                <button type="submit">Create Account</button>
                <span>{error}</span>
            </form>
        </div>
    );
}

export default AccountForm;