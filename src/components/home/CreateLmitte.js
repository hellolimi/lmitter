import React, {useCallback, useRef, useState} from 'react';
import {storageService, dbService} from 'myBase';
import { v4 as uuidv4 } from 'uuid';
import { useUserContext } from 'Context';
import photoIcon from 'img/photo_icon.png';

function CreateLmitte() {
    const user = useUserContext();
    const [lmitteText, setLmitteText] = useState('');
    const [fileData, setFileData] = useState('');
    const fileInput = useRef();
    
    const onChange = useCallback(e => {
        const {value} = e.target;
        setLmitteText(prev => value);
    }, []);
    const onFileChange = useCallback(e => {
        const {files} = e.target;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {result} = finishedEvent.currentTarget;
            setFileData(result);
        }
        reader.readAsDataURL(theFile);
    }, []);
    const clearFileData = () => {
        setFileData('');
        fileInput.current.value = '';
    }
    const onSubmit = async(e) => {
        e.preventDefault();
        let fileUrl = '';
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();

        if(lmitteText !== '' || fileData !== ''){
            if(fileData !== ''){
                const fileReference = storageService.ref().child(`lmittes/${user.uid}/${uuidv4()}`);
                const response = await fileReference.putString(fileData, 'data_url');
                fileUrl = await response.ref.getDownloadURL();
            }
            const lmitte = {
                date : `${year}/${month + 1}/${date}`,
                text : lmitteText,
                createdAt : Date.now(),
                creatorId : user.uid,
                fileUrl,
                likedId : [],
                comments : []
            }
            await dbService.collection('lmittes').add(lmitte);
            setLmitteText('');
            clearFileData();
        }else{
            window.alert("Sorry! You can't upload an empty post!");
        }
    }
    return (
        <form onSubmit={onSubmit} className="lmitteForm">
            <fieldset>
                <input value={lmitteText} type="text" placeholder="What's on your mind?" onChange={onChange} />
                <input id="lmittePhoto" type="file" accept="image/*" onChange={onFileChange} ref={fileInput} />
                {fileData?
                    <div>
                        <figure>
                            <img src={fileData} alt="upload file" />
                        </figure>
                        <button onClick={clearFileData}>Clear Image</button>
                    </div>
                    :<label htmlFor="lmittePhoto">
                        <img src={photoIcon} alt="icon" />
                        <span>Add a photo...</span>
                    </label>
                }
                
            </fieldset>
            <button type="submit">Lmitte</button>
        </form>
    );
}

export default React.memo(CreateLmitte);