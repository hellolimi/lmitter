import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/CreateLmitte';
import LoadingBar from 'components/LoadingBar';

const Home = ({userObj}) => {
    const [lmittes, setLmittes] = useState([]);
    const getLmittes = useCallback(() => {
        dbService.collection('lmittes').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            const LmitteArray = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setLmittes(LmitteArray);
        });
    }, []);
    useEffect(() => {
        getLmittes();
        return () => {
            setLmittes([]);
        }
    }, [getLmittes]);

    return(
        <>
            <CreateLmitte userObj={userObj} />
            <LoadingBar loadingOn={lmittes}/>
            <ul>
                {lmittes.map(lmitte => <Lmitte key={lmitte.id} lmitteObj={lmitte} isOwner={lmitte.creatorId === userObj.uid} />)}
            </ul>
        </>
    );   
}

export default React.memo(Home);