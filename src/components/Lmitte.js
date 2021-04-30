import React, { useState } from 'react';
import { dbService, storageService } from 'myBase';
import { Link } from 'react-router-dom';

const Lmitte = ({lmitteObj, isOwner}) => {
    const [edit, setEdit] = useState(false);
    const [newLmitte, setNewLmitte] = useState(lmitteObj.text);

    let TIME = Date.now();
    let timeView;
    let passedTime = (TIME - lmitteObj.createdAt)/1000;
    if(passedTime < 60 ){
        timeView = 'now';
    }else if(Math.floor(passedTime) === 60){
        timeView = '1 minute ago'
    }else if(Math.floor(passedTime) < 60 * 60){
        timeView = `${Math.floor(passedTime / 60)} mintues ago`
    }else if(Math.floor(passedTime) === 60 * 60){
        timeView = '1 hour ago'
    }
    else if(Math.floor(passedTime) < 24 * 60 * 60){
        timeView =`${Math.floor(passedTime / 60 / 60)} hours ago`
    }else{
        timeView = `${lmitteObj.date}`
    }

    const toggleEdit = () => setEdit(prev => !prev);
    const onChange = e => {
        const {value} = e.target;
        setNewLmitte(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`lmittes/${lmitteObj.id}`).update({
            text: newLmitte
        });
        setEdit(false);
    }
    const onDeleteClick = async () => {
        const ok = window.confirm('Do you really want to delete this lmitte?');
        if(ok){
           if(lmitteObj.fileUrl !== ''){
            await storageService.refFromURL(lmitteObj.fileUrl).delete(); 
           }
           await dbService.doc(`lmittes/${lmitteObj.id}`).delete();
        }
    }

    return(
        <li>
            {edit?<>
                    {isOwner&&<>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit your lmitte!" value ={newLmitte} required onChange={onChange} />
                            <button type="submit">Update Lmitte</button>
                        </form>
                        <button type="button" onClick={toggleEdit}>Cancel</button>
                    </>}
                </>:
                <>
                    <img src={lmitteObj.creatorPhoto} alt="profile" width="50"/>
                    <span>{lmitteObj.creator}</span>
                    <h4>{lmitteObj.text}</h4>
                    {lmitteObj.fileUrl && <img src={lmitteObj.fileUrl} width="100px" alt="" />}
                    <span className="date">{timeView}</span>
                    {isOwner&&<>
                            <button onClick={toggleEdit}>edit</button>
                            <button onClick={onDeleteClick}>delete</button>
                    </>}
            </>}
        </li>
    );
}

export default Lmitte;