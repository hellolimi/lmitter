import React, {useState} from 'react';
import {storageService, dbService} from 'myBase';
import { v4 as uuidv4 } from 'uuid';

function CreateLmitte({userObj}) {
    const [lmitteText, setLmitteText] = useState('');
    const [fileData, setFileData] = useState('');

    const onSubmit = async(e) => {
        e.preventDefault();
        let fileUrl = '';
        
        if(lmitteText !== '' || fileData !== ''){
            if(fileData !== ''){
                const fileReference = storageService.ref().child(`lmittes/${userObj.uid}/${uuidv4()}`);
                const response = await fileReference.putString(fileData, 'data_url');
                fileUrl = await response.ref.getDownloadURL();
            }
            const lmitte = {
                text : lmitteText,
                createdAt : Date.now(),
                creatorId : userObj.uid,
                fileUrl
            }
            await dbService.collection('lmittes').add(lmitte);
            setLmitteText('');
            setFileData('');
        }else{
            window.alert("Sorry! You can't upload an empty post!");
        }
        
    }
    const onChange = e => {
        const {value} = e.target;
        setLmitteText(value);
    }
    const onFileChange = e => {
        const {files} = e.target;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {result} = finishedEvent.currentTarget;
            setFileData(result);
        }
        reader.readAsDataURL(theFile);
    }
    const clearFileData = () => {
        setFileData('');
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={lmitteText} type="text" placeholder="What's on your mind?" onChange={onChange} />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                {fileData&& 
                    <>
                        <img src={fileData} width="50" alt="" />
                        <button onClick={clearFileData}>Clear Image</button>
                    </>
                }
                <input type="submit" value="Lmitte" />
            </form>
        </div>
    );
}

export default CreateLmitte;