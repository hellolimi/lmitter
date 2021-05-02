import React, { useState } from 'react';
import { dbService, storageService } from 'myBase';
import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite, MdChatBubbleOutline } from "react-icons/md";

const Lmitte = ({lmitteObj, userUid}) => {
    const [edit, setEdit] = useState(false);
    const [newLmitte, setNewLmitte] = useState(lmitteObj.text);

    const [like, setLike] = useState(false);
    const [comment, setComment] = useState(false);
    const [input, setInput] = useState();
    const [comId, setComId] = useState(0);

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
    const { likedId, comments } = lmitteObj;
    const onLike = async (e) => {
        e.preventDefault();
        setLike(prev => !prev);
        if(like){
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.concat(userUid)
            })
        }else{
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.filter(id => id !== userUid)
            })
        }
    }
    const commentToggle = () => {
        setComment(prev => !prev);
    }
    const onChangeComment = e => {
        const {value} = e.target;
        setInput(value);
    }
    const onSubmitComment = async (e) => {
        e.preventDefault();
        const aComment = {
            text: input,
            creatorId : userUid,
            id : comId
        }
        await dbService.doc(`lmittes/${lmitteObj.id}`).update({
            comments : comments.concat(aComment)
        })
        setComId(prev => prev++);
    }
    return(
        <li>
            {edit?<>
                    {userUid === lmitteObj.creatorId&&<>
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Edit your lmitte!" value ={newLmitte} required onChange={onChange} />
                            <button type="submit">Update Lmitte</button>
                        </form>
                        <button type="button" onClick={toggleEdit}>Cancel</button>
                    </>}
                </>:
                <>
                    <Link to={`/profile/${lmitteObj.creator}/${lmitteObj.creatorId}`}>
                        <div className="creator">
                            <img src={lmitteObj.creatorPhoto} alt="profile" width="50"/>
                            <span>{lmitteObj.creator}</span>
                        </div>
                    </Link>
                    <h4>{lmitteObj.text}</h4>
                    {lmitteObj.fileUrl && <img src={lmitteObj.fileUrl} width="100px" alt="" />}
                    <span className="date">{timeView}</span>
                    {userUid === lmitteObj.creatorId&&<>
                            <button onClick={toggleEdit}>edit</button>
                            <button onClick={onDeleteClick}>delete</button>
                    </>}
                    <button onClick={onLike}>{like?<MdFavorite />:<MdFavoriteBorder />}</button>
                    <span>{comments.length}</span><button onClick={commentToggle}><MdChatBubbleOutline /></button>
                    {comment&&<>
                        <form onSubmit={onSubmitComment}>
                            <input type="text" placeholder="Leave your comment" onChange={onChangeComment} />
                            <button>comment</button>
                        </form>
                        {comments.length>0&&<ul className="comment">
                            {comments.map(comment => <li key={comId}>{comment.text}</li>)}
                        </ul>}
                    </>}
            </>}
        </li>
    );
}

export default Lmitte;