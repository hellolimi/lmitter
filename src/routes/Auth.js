import { authSerive } from 'myBase';
import React, { useState } from 'react';

const Auth = () => {
    const initialInputs = {
        email:'',
        password:''
    };

    const [inputs, setInput] = useState(initialInputs);
    const [newAccount, setNewaccount] = useState(true);
    const [error, setError] = useState('');

    const {email, password} = inputs;
    const onChange = (e) => {
        const {name, value} = e.target;

        setInput({...inputs, [name] : value});
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            let data;
            if(newAccount){
                //create account
                data = await authSerive.createUserWithEmailAndPassword( email,  password );
            }else{
                //log in
                data = await authSerive.signInWithEmailAndPassword( email,  password );
            }
            console.log(data);
        }catch(error){
            setError(error.message);
        }
    } 

    const toggleAccount = () => setNewaccount(prev => !prev);

    return <>
    <div>
        <form onSubmit={onSubmit}>
            <input name="email" type="text" placeholder="Email" value={email} required onChange={onChange} />
            <input name="password" type="password" placeholder="Password" value={password} required onChange={onChange} />
            <input type="submit" value={newAccount?"Create Account":"Log In"} />
            {error}
        </form>
        <span onClick={toggleAccount}>{newAccount?"Sign in":"Create Account"}</span>
        <button>Continue with Google</button>
        <button>Continue with Github</button>
    </div>  
    </>;
}

export default Auth