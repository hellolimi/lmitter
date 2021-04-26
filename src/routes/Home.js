import React, { useEffect, useState } from 'react';
import { dbService } from 'myBase';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/CreateLmitte';

const Home = ({userObj}) => {
    const [lmittes, setLmittes] = useState([]);
    
    useEffect(() => {
        dbService.collection('lmittes').onSnapshot(snapshot => {
            const LmitteArray = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setLmittes(LmitteArray);
        });
    }, []);

    return(
        <>
            <CreateLmitte userObj={userObj} />
            <ul>
                {lmittes.map(lmitte => <Lmitte key={lmitte.id} lmitteObj={lmitte} isOwner={lmitte.creatorId === userObj.uid} />)}
            </ul>
        </>
    );   
}

export default Home;