import React, {useState} from 'react';
import {authSerive, storageService} from 'myBase';

function AccountForm({refreshUser}) {
    const initialInputs = {
        username: '',
        email:'',
        password:''
    };

    const [inputs, setInput] = useState(initialInputs);
    const [error, setError] = useState('');

    const {username, email, password} = inputs;
    const onChange = (e) => {
        const {name, value} = e.target;
        setInput({...inputs, [name] : value});
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        const logoRef = await storageService.ref(`logo/`).listAll();
        const logo = await logoRef.items[0].getDownloadURL();
        try{
            await authSerive.createUserWithEmailAndPassword( email,  password );
            authSerive.onAuthStateChanged((user) => {
                if (user) {
                    user.updateProfile({ 
                        displayName: username,
                        photoURL: logo
                    });
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
                <input type="submit" value="Create Account" />
                <span>{error}</span>
            </form>
        </div>
    );
}

export default AccountForm;