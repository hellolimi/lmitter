import { authSerive } from 'myBase';
import React from 'react';

export default () => {
    const onLogOutClick = () => authSerive.signOut();
    return <>
        <button onClick={onLogOutClick}>Log Out</button>
    </>
}