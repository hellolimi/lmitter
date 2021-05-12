import React, { useCallback, useEffect, useState } from 'react';
import { dbService } from 'myBase';
import { Link } from 'react-router-dom';
import { MdFavoriteBorder, MdFavorite, MdChatBubbleOutline } from "react-icons/md";
import { useUserContext } from 'Context';
import { v4 as uuidv4 } from 'uuid';

function SocialBlock({lmitteObj}) {
    const user = useUserContext();
    const {uid, displayName} = user;

    const [like, setLike] = useState(false);
    const [comment, setComment] = useState(false);
    const [input, setInput] = useState('');
    const [comId, setComId] = useState(uuidv4());

    const { likedId, comments } = lmitteObj;
    
    const getLikeInfo = useCallback( async () => {
        const ref = await dbService.doc(`lmittes/${lmitteObj.id}`).get();
        const lmitteData = ref.data();
        lmitteData.likedId.map(id => id === uid?setLike(true):setLike(false));
    }, [lmitteObj, uid]);
    useEffect(() => {
        getLikeInfo();
        return () => {
            setLike(false);
        }
    }, [getLikeInfo]);

    const onLike = async (e) => {
        e.preventDefault();
        setLike(prev => !prev);
        if(!like){
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.concat(uid)
            });
        }else{
            await dbService.doc(`lmittes/${lmitteObj.id}`).update({
                likedId : likedId.filter(id => id !== uid)
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
            creatorId : uid,
            creator : displayName,
            id : comId
        }
        await dbService.doc(`lmittes/${lmitteObj.id}`).update({
            comments : comments.concat(aComment)
        })
        setComId(prev => uuidv4());
        setInput('');
    }
    return (
        <div className="socialBlock">
            <div className="socialLine">
                <span>{likedId.length}</span><button onClick={onLike}>{like?<MdFavorite />:<MdFavoriteBorder />}</button>
                <span>{comments.length}</span><button onClick={onComment}><MdChatBubbleOutline /></button>
            </div>
            {comment&&<>
                <form onSubmit={onSubmitComment}>
                    <input type="text" placeholder="Leave your comment" value={input} onChange={onChangeComment} />
                    <button>comment</button>
                </form>
                {comments.length>0&&<ul className="comment">
                    {comments.map(comment => <li key={comment.id}>
                        <Link to={uid === comment.creatorId?'/profile':`/profile/${comment.creatorId}`}>{comment.creator}</Link>
                        {comment.text}
                    </li>)}
                </ul>}
            </>}
        </div>
    );
}

export default React.memo(SocialBlock);