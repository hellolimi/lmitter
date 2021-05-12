import { useUserContext, useRefreshUser, useUserData } from 'Context';
import { dbService, storageService } from 'myBase';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoadingBar from 'components/LoadingBar';
import photoIcon from 'img/photo_icon.png';

function MyInfo() {
    const user = useUserContext();
    const {displayName, photoURL} = user;
    const userFile = useUserData();
    const refreshUser = useRefreshUser();
    const [update, setUpdate]  = useState(false);
    const [myData, setMydata] = useState({
        myPhoto: '',
        myIntro : '',
        docId : ''
    });
    const {myPhoto, myIntro, docId} = myData;
    const [inputs, setInputs] = useState({
        newName : user.displayName,
        newPhoto : '',
        newIntro : '',
    });
    const {newName, newPhoto, newIntro} = inputs;
    const photoInput = useRef();
    const top = useRef();

    const getMyData = useCallback(async() => {
        const myData = await userFile(user.uid);
        const {data, id} = myData;
        setMydata({myPhoto:data.photoURL, myIntro:data.userIntro, docId:id});
        setInputs(prev => ({...prev, newIntro: data.userIntro}));
    }, [user.uid, userFile]);
    useEffect(() => {
        getMyData();
        return () => {
            setMydata({});
        }
    }, [getMyData]);

    const onToggle = () => {
        setUpdate(prev => !prev);
    }
    const onChangeInput = useCallback(e => {
        const {value, name} = e.target;
        setInputs(prev => ({...prev, [name]:value}));
    }, []);
    const onFileChange = e => {
        const {files} = e.target;
        const theFile = files[0];
        if(theFile){
            const reader = new FileReader();
            reader.readAsDataURL(theFile);
            reader.onloadend = (finishedEvent) => {
                const {result} = finishedEvent.currentTarget;
                setInputs({...inputs, newPhoto: result});
            }
        }
    }
    const onClearPhoto = () => {
        setInputs(prev => ({...prev, newPhoto: ''}));
        photoInput.current.value = '';
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        top.current.scrollIntoView();
        if(displayName !== newName && newName !== ''){
            await user.updateProfile({
                displayName : newName
            });
            await dbService.doc(`users/${docId}`).update({
                username: newName
            });
        }
        if( myIntro !== newIntro && newIntro !== ''){
            await dbService.doc(`users/${docId}`).update({
                userIntro: newIntro
            });
        }
        if(newPhoto){
            setMydata(({...myData, myPhoto: null}));
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
        setUpdate(false); 
        setInputs(prev => ({...prev, newPhoto: ''}));
        refreshUser();
    }

    const loadingOn = [myPhoto, user, myIntro];
    return (
        <>
            <div className="userInfo" ref={top}>
                {myPhoto?<img src={photoURL} alt="" width="100" />:<LoadingBar loadingOn="keep" />}
                <h3>{displayName}</h3>
                <p>{myIntro}</p>
                <LoadingBar loadingOn={loadingOn}/> 
            </div>
            <button type="button" onClick={onToggle}>Update</button>
            {update&&
            <form onSubmit={onSubmit} className="updateForm">
                <fieldset className="updatePhoto">
                    <input id="photo" type="file" accept="image/*" onChange={onFileChange} ref={photoInput} />
                    {newPhoto?
                        <div>
                            <img src={newPhoto} alt="upload file" />
                            <button onClick={onClearPhoto}>Clear Image</button>
                        </div>:
                        <label htmlFor="photo">
                            <img src={photoIcon} alt="icon" />
                            <span>Change my photo...</span>
                        </label>
                    }
                </fieldset>
                <fieldset className="updateMyInfo">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="newName" placeholder="Enter your nickname" value={newName} onChange={onChangeInput} maxLength="10" />
                    <label htmlFor="intro">Intro</label>
                    <input id="intro" type="text" name="newIntro" placeholder="Enter your introduction" value={newIntro} onChange={onChangeInput} maxLength="100" />
                </fieldset>
                <button type="submit">Update Profile</button>
            </form>
            }
        </>
    );
}

export default React.memo(MyInfo);