import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/CreateLmitte';
import 'scss/home.scss';

const Home = ({userObj}) => {
    const [lmittes, setLmittes] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        setTimeout(() => {setLoading(false);}, 1000);
        return () => {
            setLoading(true);
        }
    }, [lmittes]);

    return(
        <>
            <CreateLmitte userObj={userObj} />
            {loading&&<div className="loading">
                <div className="loading">
                    <svg>
                        <defs>
                            <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stop-color="#ff7bac"/>
                            <stop offset="100%" stop-color="#06a3c4"/>
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="10" stroke="url(#linear)" />
                    </svg>
                </div>
            </div>}
            <ul>
                {lmittes.map(lmitte => <Lmitte key={lmitte.id} lmitteObj={lmitte} isOwner={lmitte.creatorId === userObj.uid} />)}
            </ul>
        </>
    );   
}

export default React.memo(Home);