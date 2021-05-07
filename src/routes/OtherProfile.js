import { dbService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Lmitte from 'components/Lmitte';
import LoadingBar from 'components/LoadingBar';
import { useUserData } from 'Context';

const OtherProfile = () => {
    let { userId } = useParams();
    const [userLmittes, setUserLmittes] = useState([]);
    const userFile = useUserData();
    const [thisUser, setThisUser] = useState({});
    const getThisUser = useCallback(async () => {
        const userInfo = await userFile(userId);
        setThisUser(userInfo.data);
    },[userId, userFile]);
    useEffect(() => {
        getThisUser();
    }, [getThisUser]);

    const getYourLmittes =  useCallback(async () => {
        const lmittes = await dbService.collection('lmittes').where('creatorId', '==', userId).orderBy('createdAt', 'desc').get();
        const userLmitte =  lmittes.docs.map(doc => ({...doc.data(), id: doc.id}));
        setUserLmittes(userLmitte);
    }, [userId]); 
   useEffect(() => {
        getYourLmittes();
        return () => {
            setUserLmittes([]);
        }
   }, [getYourLmittes]);

    return <>
        <div className="myProfile">
            <img src={thisUser.photoURL} alt="" width="100" />
            <h3>{thisUser.username}</h3>
            <p>{thisUser.userIntro}</p>
        </div>
        <LoadingBar loadingOn={userLmittes} />
        <ul>
            {userLmittes.map(lmitte => {
                return(
                    <li key={lmitte.id}>
                        <Lmitte lmitteObj={lmitte} />
                    </li>
                ); 
            })}
        </ul>
    </>
}

export default React.memo(OtherProfile);