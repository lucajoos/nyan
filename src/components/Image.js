import { useCallback, useState } from 'react';
import { X } from 'react-feather';

const { ipcRenderer } = require('electron');

const Image = ({ path, selected, onRemove }) => {
    const [isHovered, setIsHover] = useState(false);

    const handleOnClickImage = useCallback(() => {
        ipcRenderer.send('copy', path);
    }, [path]);

    const handleOnClickRemove = useCallback(() => {
        ipcRenderer.send('remove', path);
        onRemove(path);
    }, [path]);

    const handleHover = useCallback(value => {
        if(isHovered !== value) {
            setIsHover(value || false);
        }
    }, [isHovered]);

    return (
        <div onMouseOver={() => handleHover(true)} onMouseLeave={() => handleHover(false)} className={'pointer-events-none transition-all relative h-full w-full'}>
            <div className={'inline-block relative'}>
                <div onClick={() => handleOnClickRemove()} className={`pointer-events-auto absolute cursor-pointer -right-4 top-0 p-2 transition-all rounded-full bg-background-accent hover:bg-background-hover opacity-${isHovered ? '100' : '0'} pointer-events-${isHovered ? 'auto' : 'none'}`}>
                    <X color={'var(--color-text-default)'} />
                </div>

                <img className={`pointer-events-auto cursor-pointer rounded-lg mt-5 border-2 transition-colors ${(isHovered || selected) ? 'border-primary-default' : 'border-transparent'}`} width={'250px'} src={path} alt={''} onClick={() => handleOnClickImage()}/>
            </div>
        </div>
    )
};

export default Image;