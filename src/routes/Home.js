import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/CreateLmitte';

const Home = ({userObj}) => {
    const [lmittes, setLmittes] = useState([]);
    const getLmittes = useCallback(() => {
        dbService.collection('lmittes').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            setLoading(false);
            const LmitteArray = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setLmittes(LmitteArray);
        });
    }, []);
    useEffect(() => {
        getLmittes();
        
    }, [getLmittes]);
    return(
        <>
            <CreateLmitte userObj={userObj} />
            <ul>
                {lmittes.map(lmitte => <Lmitte key={lmitte.id} lmitteObj={lmitte} isOwner={lmitte.creatorId === userObj.uid} />)}
            </ul>
        </>
    );   
}

export default React.memo(Home);