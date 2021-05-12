import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import LoadingBar from 'components/LoadingBar';
import MyInfo from 'components/profile/MyInfo';
import { useUserContext } from 'Context';
import Lmitte from 'components/Lmitte';
import CreateLmitte from 'components/home/CreateLmitte';
 
const Profile = () => {
    const user = useUserContext();
    const [myLmittes, setMyLmittes] = useState([]);
        
    const getMyLmittes = useCallback(async () => {
        dbService.collection('lmittes').where('creatorId', '==', user.uid).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            const myLmitte = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
            setMyLmittes(myLmitte);
        });
    }, [user.uid]); 

   useEffect(() => {
    getMyLmittes();
        return () => {
            setMyLmittes([]);
        }
   }, [getMyLmittes]);

    return <div className="myProfile wrap">
        <MyInfo />
        <CreateLmitte />
        <LoadingBar loadingOn={myLmittes}/>
        <ul className="lmittes">
            {myLmittes.map(myLmitte => {
                return(
                    <li key={myLmitte.id} >
                        <Lmitte lmitteObj={myLmitte} />
                    </li>
                ); 
            })}
        </ul>
    </div>
}

export default React.memo(Profile);