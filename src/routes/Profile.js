import { authSerive, dbService, storageService } from 'myBase';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router';

const Profile = ( {refreshUser, userObj} ) => {
    const [myLmittes, setMyLmittes] = useState([]);

    const [newNickname, setNewNickname] = useState(userObj.displayName);
    const [newPhoto, setNewPhoto] = useState();

    const [update, setUpdate]  = useState(false);

    const history = useHistory();
    const onLogOutClick = () => {
        authSerive.signOut();
        history.push('/');
    };
    const onToggle = () => {
        setUpdate(prev => !prev);
    }
    const onChangeName = e => {
        const {value} = e.target;
        setNewNickname(value);
    }
    const onFileChange = e => {
        const {files} = e.target;
        const theFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(theFile);
        reader.onloadend = (finishedEvent) => {
            const {result} = finishedEvent.currentTarget;
            setNewPhoto(result);
        }
    }
    const onClearPhoto = () => {
        setNewPhoto(null);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if(userObj.displayName !== newNickname){
            await userObj.updateProfile({
                displayName : newNickname
            });
        }
        if(newPhoto){
            const allPhotos = await storageService.ref(`profile/${userObj.uid}`).listAll();
            await allPhotos.items.map(item => item.delete());
           
            const fileReference = storageService.ref().child(`profile/${userObj.uid}/${uuidv4()}`);
            const response = await fileReference.putString(newPhoto, 'data_url');
            const fileUrl = await response.ref.getDownloadURL();
            await userObj.updateProfile({
                photoURL: fileUrl
            });
        }
        refreshUser();
        setUpdate(false);
    }
    const getMyLmittes = async () => {
        const lmittes = await dbService.collection('lmittes').where('creatorId', '==', userObj.uid).orderBy('createdAt').get();
        const myLmitte =  lmittes.docs.map(doc => ({...doc.data(), id: doc.id}));
        setMyLmittes(myLmitte);
    }
    useEffect(() => {
        getMyLmittes();
    }, []);

    return <>
        <div className="myProfile">
            <img src={userObj.photoURL} alt="" width="100" />
            <h3>{userObj.displayName}</h3>
            <button type="button" onClick={onToggle}>Update</button>
            {update&&<>
                <form onSubmit={onSubmit}>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                    {newPhoto&&<img src={newPhoto} alt="" width="100" />}
                    <button type="button" onClick={onClearPhoto}>Clear Photo</button>
                    <input type="text" placeholder="Set your nickname" value={newNickname} onChange={onChangeName} />
                    <button type="submit">Update Profile</button>
                </form>
            </>}
        </div>
        <ul>
            {myLmittes.map(myLmitte => {
                return(
                    <li key={myLmitte.id} >
                        <h4>{myLmitte.text}</h4>
                        <img src={myLmitte.fileUrl} alt="" width="200" />
                    </li>
                ); 
            })}
        </ul>
        <button onClick={onLogOutClick}>Log Out</button>
    </>
}

export default Profile;