import { useCallback, useEffect, useState } from 'react';
import { X } from 'react-feather';

const { ipcRenderer } = require('electron');
const fs = require('fs');
const {basename} = require('path');

const Card = ({ path, selected, onRemove }) => {
    const [isHovered, setIsHover] = useState(false);
    const [content, setContent] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fs.readFile(path, (error, data) => {
            const bn = basename(path).split('.');
            const ex = bn[bn.length - 1];

            if(/(png|jpg|jpeg|svg|gif)/.test(ex)) {
                setImage(`data:image/${ex};base64,${data.toString('base64')}`);
            } else if(/(txt)/.test(ex)) {
                setContent(data);
            }
        });
    }, [path]);

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
                <div
                    onClick={() => handleOnClickRemove()}
                    className={`pointer-events-auto absolute cursor-pointer -right-4 top-0 p-2 transition-all rounded-full bg-background-accent
                                hover:bg-background-hover opacity-${isHovered ? '100' : '0'} pointer-events-${isHovered ? 'auto' : 'none'}`}>
                    <X color={'var(--color-text-default)'} />
                </div>

                {
                    image && (
                        <img
                            className={`pointer-events-auto cursor-pointer rounded-lg mt-5 border-2 transition-colors ${(isHovered || selected) ? 'border-primary-default' : 'border-transparent'}`}
                            width={'250px'}
                            src={image}
                            alt={''}
                            onClick={() => handleOnClickImage()} />
                    )
                }

                {
                    content && (
                        <div>
                            <p>{content}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
};

Card.defaultProps = {
    path: ''
};

export default Card;