import { authService, dbService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import LoadingBar from 'components/LoadingBar';
import UpdateMe from 'components/profile/UpdateMe';
import { useUserContext } from 'Context';
import Lmitte from 'components/Lmitte';
 
const Profile = () => {
    const user = useUserContext();

    const [myLmittes, setMyLmittes] = useState([]);

    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push('/');
    };

    const getMyLmittes =  useCallback(async () => {
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
        <div className="myProfile">
            <img src={user.photoURL} alt="" width="100" />
            <h3>{user.displayName}</h3>
            <LoadingBar loadingOn={user}/> 
            <UpdateMe />
        </div>
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
        <button onClick={onLogOutClick}>Log Out</button>
    </>
}

export default React.memo(Profile);