import { authSerive } from 'myBase';
import React from 'react';

const Profile = () => {
    const onLogOutClick = () => authSerive.signOut();
    return <>
        <button onClick={onLogOutClick}>Log Out</button>
    </>
}

export default Profile;