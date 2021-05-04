import React, { useState, useCallback, useEffect } from 'react';
import { dbService } from 'myBase';
import { Link } from 'react-router-dom';
import { useUserContext } from 'Context';

function CreatorInfo({lmitteObj}) {
    const user = useUserContext();

    const [creator, setCreator] = useState({});
    const isCreator = Boolean(user.uid === lmitteObj.creatorId);
    
    const getCreator = useCallback(() => {
        dbService.collection('users').where('userId', '==', lmitteObj.creatorId).onSnapshot(snapshot => {
            const userArray = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setCreator(userArray[0]);
        });
    },[lmitteObj.creatorId]);
    useEffect(() => {
        getCreator();
        return () => {
            setCreator({});
        }
    }, [getCreator]);

    return (
        <Link to={isCreator?'/profile':`/profile/${lmitteObj.creatorId}`}>
            <div className="creator">
                <img src={creator.photoURL} alt="profile" width="50"/>
                <span>{creator.username}</span>
            </div>
        </Link>
    );
}

export default CreatorInfo;