import { dbService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import LoadingBar from 'components/LoadingBar';
import MyInfo from 'components/profile/MyInfo';
import { useUserContext } from 'Context';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/home/CreateLmitte';
 
const Profile = () => {
    const user = useUserContext();
    const [myLmittes, setMyLmittes] = useState([]);
        
    const getMyLmittes = useCallback(async () => {
        const lmittes = await dbService.collection('lmittes').where('creatorId', '==', user.uid).orderBy('createdAt', 'desc').get();
        const myLmitte =  lmittes.docs.map(doc => ({...doc.data(), id: doc.id}));
        setMyLmittes(myLmitte);
    }, [user.uid]); 

   useEffect(() => {
    getMyLmittes();
        return () => {
            setMyLmittes([]);
        }
   }, [getMyLmittes]);

    return <>
        <MyInfo />
        <CreateLmitte />
        <LoadingBar loadingOn={myLmittes}/>
        <ul>
            {myLmittes.map(myLmitte => {
                return(
                    <li key={myLmitte.id} >
                        <Lmitte lmitteObj={myLmitte} />
                    </li>
                ); 
            })}
        </ul>
    </>
}

export default React.memo(Profile);