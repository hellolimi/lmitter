import { dbService, storageService } from 'myBase';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';

const OtherProfile = () => {
    let { userName, userId } = useParams();
    const [yourPhoto, setYourPhoto] = useState();
    const [yourLmittes, setYourLmittes] = useState([]);

    const getPhoto = useCallback(async () => {
            const photoRef = await storageService.ref(`profile/${userId}`).listAll();
            let fileUrl;
            if(photoRef){
                fileUrl = await photoRef.items[0].getDownloadURL();
            }else{
                const logoRef = await storageService.ref(`logo/`).listAll();
                fileUrl = await logoRef.items[0].getDownloadURL();
            }
            setYourPhoto(fileUrl); 
    }, [userId]);

    useEffect(() => {
        getPhoto();
    }, [getPhoto]);

    const getYourLmittes =  useCallback(async () => {
        const lmittes = await dbService.collection('lmittes').where('creatorId', '==', userId).orderBy('createdAt', 'desc').get();
        const yourLmitte =  lmittes.docs.map(doc => ({...doc.data(), id: doc.id}));
        setYourLmittes(yourLmitte);
    }, [userId]); 

   useEffect(() => {
    getYourLmittes();
    return () => {
        setYourLmittes([]);
    }
   }, [getYourLmittes]);

    return <>
        <div className="myProfile">
            <img src={yourPhoto} alt="" width="100" />
            <h3>{userName}</h3>
        </div>
        <ul>
            {yourLmittes.map(lmitte => {
                return(
                    <li key={lmitte.id} >
                        <h4>{lmitte.text}</h4>
                        {lmitte.fileUrl.length>0&&<img src={lmitte.fileUrl} alt="" width="200" />}
                    </li>
                ); 
            })}
        </ul>
    </>
}

export default React.memo(OtherProfile);