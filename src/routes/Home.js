import { dbService } from 'myBase';
import React, { useEffect, useState } from 'react';

const Home = ({userObj}) => {
    const [lmitte, setLmitte] = useState('');
    const [lmittes, setLmittes] = useState([]);
    /* const getLmittes = async () => {
        const dbLmittes = await dbService.collection('lmittes').get();
        dbLmittes.forEach(document => {
            const lmitteObject = {
                ...document.data(),
                id: document.id
            };
            setLmittes(prev => [...prev, lmitteObject]);
        });
    } */
/*     console.log(lmittes); */
    useEffect(() => {
     /*    getLmittes(); */
        dbService.collection('lmittes').onSnapshot(snapshot => {
            const LmitteArray = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setLmittes(LmitteArray);
        });
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        await dbService.collection('lmittes').add({
            text : lmitte,
            createdAt : Date.now(),
            creatorId : userObj.uid
        });
        setLmitte('');
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
            <ul>
                {lmittes.map(lmitte => <li key={lmitte.id}>{lmitte.text}</li>)}
            </ul>
        </>
    );   
}

export default Home;