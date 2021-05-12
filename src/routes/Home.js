import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/home/CreateLmitte';
import LoadingBar from 'components/LoadingBar';
import { useUserContext } from 'Context';
import 'scss/home.scss';

const Home = () => {
    const user = useUserContext();
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
        <div className="home wrap">
            <div className="userForm">
                <div className="myInfo">
                    <figure>
                        <img src={user.photoURL} alt="my profile" width="100"/>
                    </figure>
                    <p>{user.displayName}</p>
                </div>
                <CreateLmitte />
            </div>
            {lmittes.length !== 0 && <LoadingBar loadingOn={lmittes}/>}
            <ul className="lmittes">
                {lmittes.map(lmitte => <li key={lmitte.id}>
                    <Lmitte lmitteObj={lmitte} />
                </li>)}
            </ul>
        </div>
    );   
}

export default React.memo(Home);