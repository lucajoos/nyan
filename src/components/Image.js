import { useCallback } from 'react';

const { ipcRenderer } = require('electron');

const Image = ({ path }) => {
    const handleOnClick = useCallback(() => {
        ipcRenderer.send('copy', path);
    }, []);

    return (
        <div className={'cursor-pointer rounded-md'}>
            <span>X</span>
            <img width={'250px'} src={path} alt={''} onClick={() => handleOnClick()}/>
        </div>
    )
};

export default Image;