import { useUserContext, useRefreshUser } from 'Context';
import { dbService, storageService } from 'myBase';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function UpdateMe() {
    const user = useUserContext();
    const refreshUser = useRefreshUser();
    const [update, setUpdate]  = useState(false);
    
    const [newProfile, setNewProfile] = useState({
        newName : user.displayName,
        newPhoto : ''
    });
    const {newName, newPhoto} = newProfile;

    const onToggle = () => {
        setUpdate(prev => !prev);
    }
    const onChangeName = e => {
        const {value} = e.target;
        setNewProfile({...newProfile, newName : value});
    }
    const onFileChange = e => {
        const {files} = e.target;
        const theFile = files[0];
        if(theFile){
            const reader = new FileReader();
            reader.readAsDataURL(theFile);
            reader.onloadend = (finishedEvent) => {
                const {result} = finishedEvent.currentTarget;
                setNewProfile({...newProfile, newPhoto: result});
            }
        }
    }
    const onClearPhoto = () => {
        setNewProfile({...newProfile, newPhoto: ''});
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        const ref = await dbService.collection('users').where('userId', '==', user.uid).get();
        const docId = ref.docs[0].id;
        
        if(user.displayName !== newName){
            await user.updateProfile({
                displayName : newName
            });
            await dbService.doc(`users/${docId}`).update({
                username: newName
            });
        }
        if(newPhoto.length > 0){
            const allPhotos = await storageService.ref(`profile/${user.uid}`).listAll();
            allPhotos.items.map(item => item.delete());
           
            const fileReference = storageService.ref().child(`profile/${user.uid}/${uuidv4()}`);
            const response = await fileReference.putString(newPhoto, 'data_url');
            const fileUrl = await response.ref.getDownloadURL();
            await user.updateProfile({
                photoURL: fileUrl
            });
            await dbService.doc(`users/${docId}`).update({
                photoURL: fileUrl
            });
        }
        refreshUser();
        setUpdate(false);
    }
    return (
        <>
            <button type="button" onClick={onToggle}>Update</button>
            {update&&
            <form onSubmit={onSubmit}>
                <input type="file" accept="image/*" onChange={onFileChange} />
                {newPhoto.length>0&&<img src={newPhoto} alt="" width="100" />}
                <button type="button" onClick={onClearPhoto}>Clear Photo</button>
                <input type="text" placeholder="Set your nickname" value={newName} onChange={onChangeName} />
                <button type="submit">Update Profile</button>
            </form>
            }
        </>
    );
}

export default UpdateMe;