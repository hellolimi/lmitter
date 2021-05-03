import React, { useState } from 'react';
import { dbService } from 'myBase';
import { MdFavoriteBorder, MdFavorite, MdChatBubbleOutline } from "react-icons/md";

function SocialBlock({lmitteObj, userUid}) {
    const [like, setLike] = useState(false);
    const [comment, setComment] = useState(false);
    const [input, setInput] = useState();
    const [comId, setComId] = useState(0);

    const { likedId, comments } = lmitteObj;

    const onLike = async (e) => {
        e.preventDefault();
        setLike(prev => !prev);
        if(!like){
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.concat(userUid)
            });
        }else{
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.filter(id => id !== userUid)
            })
        }
    }
    const onComment = () => {
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
    return (
        <div>
            <button onClick={onLike}>{like?<MdFavorite />:<MdFavoriteBorder />}</button>
            <span>{comments.length}</span><button onClick={onComment}><MdChatBubbleOutline /></button>
            {comment&&<>
                <form onSubmit={onSubmitComment}>
                    <input type="text" placeholder="Leave your comment" onChange={onChangeComment} />
                    <button>comment</button>
                </form>
                {comments.length>0&&<ul className="comment">
                    {comments.map(comment => <li key={comId}>{comment.text}</li>)}
                </ul>}
            </>}
        </div>
    );
}

export default SocialBlock;