import { useCallback, useEffect, useState } from 'react';
import { X } from 'react-feather';

const { ipcRenderer } = require('electron');
const fs = require('fs');
const {basename} = require('path');

const Card = ({ children, path, selected, onRemove, isFile }) => {
    const [isHovered, setIsHover] = useState(false);
    const [content, setContent] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if(isFile) {
            fs.readFile(path, (error, data) => {
                const bn = basename(path).split('.');
                const ex = bn[bn.length - 1];

                if(/(png|jpg|jpeg|svg|gif)/.test(ex)) {
                    setImage(`data:image/${ex};base64,${data.toString('base64')}`);
                } else if(/(txt)/.test(ex)) {
                    setContent(data.toString());
                }
            });
        }
    }, [path, isFile]);

    const handleOnClick = useCallback(() => {
        if(isFile) {
            ipcRenderer.send('copy', path);
        } else {
            ipcRenderer.send('new');
        }
    }, [path]);

    const handleOnClickRemove = useCallback(() => {
        if(isFile) {
            ipcRenderer.send('remove', path);
            onRemove(path);
        }
    }, [path]);

    const handleHover = useCallback(value => {
        if(isHovered !== value) {
            setIsHover(value || false);
        }
    }, [isHovered]);

    return (
        <div onMouseOver={() => handleHover(true)} onMouseLeave={() => handleHover(false)} className={'pointer-events-none transition-all relative h-full w-full'}>
            <div className={'inline-block relative'}>
                {
                    isFile && (
                        <div
                            onClick={() => handleOnClickRemove()}
                            className={`pointer-events-auto absolute cursor-pointer -right-4 top-0 p-2 transition-all rounded-full bg-background-accent hover:bg-background-hover opacity-${isHovered ? '100' : '0'} pointer-events-${isHovered ? 'auto' : 'none'}`}>
                            <X color={'var(--color-text-default)'} />
                        </div>
                    )
                }

                <div onClick={() => handleOnClick()}  className={`pointer-events-auto cursor-pointer w-card rounded-lg mt-5 border-2 transition-colors ${(isHovered || selected) ? 'border-primary-default' : 'border-transparent'} ${(content || !isFile) ? 'p-8 bg-background-hover text-text-default' : ''}`}>
                    {
                        image && (
                            <img
                                className={'rounded-lg'}
                                src={image}
                                alt={''}
                            />
                        )
                    }

                    {
                        (content || !isFile) && (
                            <p className={'overflow-ellipsis overflow-hidden'}>{content || children}</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
};

Card.defaultProps = {
    path: '',
    isFile: true
};

export default Card;