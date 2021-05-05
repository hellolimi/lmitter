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

    let TIME = Date.now();
    let timeView;
    let passedTime = (TIME - lmitteObj.createdAt)/1000;
    if(passedTime < 60 ){
        timeView = 'now';
    }else if(Math.floor(passedTime) === 60){
        timeView = '1 minute ago'
    }else if(Math.floor(passedTime) < 60 * 60){
        timeView = `${Math.floor(passedTime / 60)} mintues ago`
    }else if(Math.floor(passedTime) === 60 * 60){
        timeView = '1 hour ago'
    }
    else if(Math.floor(passedTime) < 24 * 60 * 60){
        timeView =`${Math.floor(passedTime / 60 / 60)} hours ago`
    }else{
        timeView = `${lmitteObj.date}`
    }

    return (
        <div>
            <Link to={isCreator?'/profile':`/profile/${lmitteObj.creatorId}`}>
                <div className="creator">
                    <img src={creator.photoURL} alt="profile" width="50"/>
                    <span>{creator.username}</span>
                </div>
            </Link>
            <span className="date">{timeView}</span>
        </div>
    );
}

export default CreatorInfo;