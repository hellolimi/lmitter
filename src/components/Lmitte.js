import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { dbService, storageService } from 'myBase';
import { useUserContext, useUserData } from 'Context';
import SocialBlock from 'components/home/SocialBlock';

const Lmitte = ({lmitteObj}) => {
    const user = useUserContext();
    const userFile = useUserData();
    const [newLmitte, setNewLmitte] = useState(lmitteObj.text);
    const [creator, setCreator] = useState({});
    const isCreator = useMemo(() => {
        return Boolean(user.uid === lmitteObj.creatorId);
    }, [user.uid, lmitteObj.creatorId]);

    const [toggle, setToggle] = useState({
        edit : false,
        option : false
    });
    const {edit, option} = toggle;
    
    const getCreator = useCallback( async () => {
        const userInfo = await userFile(lmitteObj.creatorId);
        setCreator(userInfo.data);
    },[lmitteObj.creatorId, userFile]);
    
    useEffect(() => {
        getCreator();
        return () => {
            setCreator({});
        }
    }, [getCreator]);

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

    const onToggle = e => {
        const {name} = e.target;
        setToggle(prev => ({...prev, [name]:!prev[name]}));
    }
    const onEditCancel = () => {
        setToggle(prev => !prev);
    }
    const onChange = useCallback(e => {
        const {value} = e.target;
        setNewLmitte(value);
    }, []);
    const onSubmit = async (e) => {
        e.preventDefault();
        await dbService.doc(`lmittes/${lmitteObj.id}`).update({
            text: newLmitte
        });
        setToggle(prev => !prev);
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
    
    return(<>
        <div className="creatorInfo">
            <div className="left">
                <Link to={isCreator?'/profile':`/profile/${lmitteObj.creatorId}`} className="creator">
                    <figure>
                        <img src={creator.photoURL} alt="profile" width="50"/>
                    </figure>
                    <span>{creator.username}</span>
                </Link>
                <span className="date">{timeView}</span>
            </div>
            <div className="right">
                {isCreator&&<>
                    <button name="option" onClick={onToggle}>• • •</button>
                    {option&&<ul>
                        <li><button name="edit" onClick={onToggle}>edit</button></li>
                        <li><button onClick={onDeleteClick}>delete</button></li>
                    </ul>}   
                </>}
            </div>
        </div>
        {edit?<>
                {isCreator&&<>
                    <form onSubmit={onSubmit} className="editForm">
                        <input type="text" placeholder="Edit your lmitte!" value ={newLmitte} required onChange={onChange} />
                        <div>
                            <button type="submit">Update Lmitte</button>
                            <button type="button" onClick={onEditCancel}>Cancel</button>
                        </div>
                    </form>
                </>}
            </>:
            <>
                {lmitteObj.text&&<p className="lmitteText">{lmitteObj.text}</p>}
                {lmitteObj.fileUrl && <img src={lmitteObj.fileUrl} alt="" />}
                <SocialBlock lmitteObj={lmitteObj} />
        </>}
    </>);
}

export default React.memo(Lmitte);