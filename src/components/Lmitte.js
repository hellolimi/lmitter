import React, { useState } from 'react';
import { dbService, storageService } from 'myBase';
import { useUserContext } from 'Context';
import SocialBlock from 'components/home/SocialBlock';

const Lmitte = ({lmitteObj}) => {
    const user = useUserContext();
    const [edit, setEdit] = useState(false);
    const [newLmitte, setNewLmitte] = useState(lmitteObj.text);
    
    const isCreator = Boolean(lmitteObj.creatorId === user.uid);

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
        <div>
            {edit?<>
                    {isCreator&&<>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit your lmitte!" value ={newLmitte} required onChange={onChange} />
                            <button type="submit">Update Lmitte</button>
                        </form>
                        <button type="button" onClick={toggleEdit}>Cancel</button>
                    </>}
                </>:
                <>
                    <h4>{lmitteObj.text}</h4>
                    {lmitteObj.fileUrl && <img src={lmitteObj.fileUrl} width="100px" alt="" />}
                    <span className="date">{timeView}</span>
                    {isCreator&&<>
                            <button onClick={toggleEdit}>edit</button>
                            <button onClick={onDeleteClick}>delete</button>
                    </>}
                    <SocialBlock lmitteObj={lmitteObj} />
            </>}
        </div>
    );
}

export default Lmitte;