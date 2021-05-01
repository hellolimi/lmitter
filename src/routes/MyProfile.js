import { authSerive, dbService, storageService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';
import LoadingBar from 'components/LoadingBar';
 
const Profile = ( {refreshUser, userObj} ) => {
    const [myLmittes, setMyLmittes] = useState([]);
    const [newProfile, setNewProfile] = useState({
        newName : userObj.displayName,
        newPhoto : ''
    });
    const {newName, newPhoto} = newProfile;

    const [update, setUpdate]  = useState(false);

    const history = useHistory();
    const onLogOutClick = () => {
        authSerive.signOut();
        history.push('/');
    };
    const onToggle = useCallback(() => {
        setUpdate(prev => !prev);
    }, []);
    const onChangeName = e => {
        const {value} = e.target;
        setNewProfile({...newProfile, newName : value});
    }
    const onFileChange = e => {
        const {files} = e.target;
        const theFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(theFile);
        reader.onloadend = (finishedEvent) => {
            const {result} = finishedEvent.currentTarget;
            setNewProfile({...newProfile, newPhoto: result});
        }
    }
    const onClearPhoto = () => {
        setNewProfile({...newProfile, newPhoto: ''});
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        let updateList;
        dbService.collection('lmittes').where('creatorId', '==', userObj.uid).onSnapshot(snapshot => {
            updateList = snapshot.docs.map(doc => doc.id);
        });
        
        if(userObj.displayName !== newName){
            await userObj.updateProfile({
                displayName : newName
            });
            for(var i in updateList){
                await dbService.doc(`lmittes/${updateList[i]}`).update({
                    creator: newName
                });
            }
        }
        if(newPhoto.length > 0){
            const allPhotos = await storageService.ref(`profile/${userObj.uid}`).listAll();
            allPhotos.items.map(item => item.delete());
           
            const fileReference = storageService.ref().child(`profile/${userObj.uid}/${uuidv4()}`);
            const response = await fileReference.putString(newPhoto, 'data_url');
            const fileUrl = await response.ref.getDownloadURL();
            await userObj.updateProfile({
                photoURL: fileUrl
            });
            for(var j in updateList){
                await dbService.doc(`lmittes/${updateList[j]}`).update({
                    creatorPhoto: fileUrl
                });
            }
        }

        refreshUser();
        setUpdate(false);
    }
    const getMyLmittes =  useCallback(async () => {
        const lmittes = await dbService.collection('lmittes').where('creatorId', '==', userObj.uid).orderBy('createdAt', 'desc').get();
        const myLmitte =  lmittes.docs.map(doc => ({...doc.data(), id: doc.id}));
        setMyLmittes(myLmitte);
    }, [userObj.uid]); 

   useEffect(() => {
        getMyLmittes();
        return () => {
            setMyLmittes([]);
        }
   }, [getMyLmittes]);

    return <>
        <div className="myProfile">
            <img src={userObj.photoURL} alt="" width="100" />
            <h3>{userObj.displayName}</h3>
            <LoadingBar loadingOn={userObj}/> 
            <button type="button" onClick={onToggle}>Update</button>
            {update&&<>
                <form onSubmit={onSubmit}>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                    {newPhoto.length>0&&<img src={newPhoto} alt="" width="100" />}
                    <button type="button" onClick={onClearPhoto}>Clear Photo</button>
                    <input type="text" placeholder="Set your nickname" value={newName} onChange={onChangeName} />
                    <button type="submit">Update Profile</button>
                </form>
            </>}
        </div>
        <LoadingBar loadingOn={myLmittes}/>
        <ul>
            {myLmittes.map(myLmitte => {
                return(
                    <li key={myLmitte.id} >
                        {myLmitte.fileUrl.length>0&&<img src={myLmitte.fileUrl} alt="" width="200" />}
                        <h4>{myLmitte.text}</h4>
                        <span className="date">{myLmitte.date}</span>
                    </li>
                ); 
            })}
        </ul>
        <button onClick={onLogOutClick}>Log Out</button>
    </>
}

export default React.memo(Profile);