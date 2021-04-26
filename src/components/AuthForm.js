import React, {useState} from 'react';
import {authSerive} from 'myBase';

function AuthForm({newAccount}) {
    const initialInputs = {
        email:'',
        password:''
    };

    const [inputs, setInput] = useState(initialInputs);
    const [error, setError] = useState('');

    const {email, password} = inputs;
    const onChange = (e) => {
        const {name, value} = e.target;

        setInput({...inputs, [name] : value});
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        try{
            if(newAccount){
                //create account
                await authSerive.createUserWithEmailAndPassword( email,  password );
            }else{
                //log in
                await authSerive.signInWithEmailAndPassword( email,  password );
            }
        }catch(error){
            setError(error.message);
        }
    } 
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" value={email} required onChange={onChange} />
                <input name="password" type="password" placeholder="Password" value={password} required onChange={onChange} />
                <input type="submit" value={newAccount?"Create Account":"Log In"} />
                {error}
            </form>
        </div>
    );
}

export default AuthForm;