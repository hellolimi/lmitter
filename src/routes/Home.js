import React, { useState } from 'react';

const Home = () => {
    const [lmitte, setLmitte] = useState('');

    const onSubmit= e => {
        e.preventDefault();
    }
    const onChange = e => {
        const {value} = e.target;
        setLmitte(value);
    }
    return(
        <>
            <form onSubmit={onSubmit}>
                <input value={lmitte} type="text" placeholder="What's on your mind?" onChange={onChange} />
                <input type="submit" value="Lmitte" />
            </form>
        </>
    );
    
}

export default Home;