import React, {useState} from 'react';
import {authService} from 'myBase';

function AuthForm() {
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
            await authService.signInWithEmailAndPassword( email,  password );
        }catch(error){
            setError(error.message);
        }
    } 
    return (
        <form onSubmit={onSubmit} className="loginForm">
            <input name="email" type="text" placeholder="Email" value={email} required onChange={onChange} />
            <input name="password" type="password" placeholder="Password" value={password} required onChange={onChange} />
            {error&&<span>{error}</span>}
            <button type="submit">Log In</button>
        </form>
    );
}

export default React.memo(AuthForm);