import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit2, X, Check } from 'react-feather';

const { ipcRenderer } = require('electron');
const fs = require('fs');
const { basename } = require('path');

const Card = ({ children, path, selected, onRemove, isFile, unselect, select, created, index }) => {
    const [ isHovered, setIsHover ] = useState(false);
    const [ content, setContent ] = useState(null);
    const [ image, setImage ] = useState(null);
    const [ isEditing, setIsEditing ] = useState(created || false);
    const inputRef = useRef(null);

    useEffect(() => {
        if(isFile) {
            fs.readFile(path, (error, data) => {
                const bn = basename(path).split('.');
                const ex = bn[bn.length - 1];

                if(/(png|jpg|jpeg|svg|gif)/.test(ex)) {
                    setImage(`data:image/${ ex };base64,${ data.toString('base64') }`);
                } else if(/(txt)/.test(ex)) {
                    setContent(data.toString());

                    inputRef.current?.addEventListener('input', () => {
                        inputRef.current.setAttribute('style', 'height: auto;');
                        inputRef.current.setAttribute('style', `height: ${inputRef.current?.scrollHeight}px;`)
                    });

                    if(created) {
                        inputRef.current?.focus();
                        unselect();
                    }
                }
            });
        }
    }, [ path, isFile ]);

    const handleOnClick = useCallback(() => {
        if(!isEditing) {
            if(isFile) {
                ipcRenderer.send('copy', path);
            } else {
                ipcRenderer.send('new', '');
            }
        }
    }, [ path, isEditing ]);

    const handleOnClickRemove = useCallback(() => {
        if(isFile) {
            ipcRenderer.send('remove', path);
            onRemove(path);
        }
    }, [ path, isFile ]);

    const handleOnClickSubmit = useCallback(() => {
        if(isFile) {
            if(content?.length > 0) {
                ipcRenderer.send('edit', {
                    path: path,
                    content: content
                });

                setIsEditing(false);

                setTimeout(() => {
                    select(index || 0);
                }, 150);
            } else {
                handleOnClickRemove();
            }
        }
    }, [ path, isFile, content, index ]);

    const handleOnClickEdit = useCallback(() => {
        if(isFile) {
            setIsEditing(true);
            unselect();

            setTimeout(() => {
                inputRef.current?.focus();
            });
        }
    }, [])

    const handleHover = useCallback(value => {
        if(isHovered !== value) {
            setIsHover(value || false);
        }
    }, [ isHovered ]);

    const handleInputChange = useCallback(event => {
        const current = event.target.value;

        setContent(current);
    }, []);

    return (
        <div onMouseOver={ () => handleHover(true) } onMouseLeave={ () => handleHover(false) }
             className={ 'pointer-events-none transition-all relative h-full w-full' }>
            <div className={ 'inline-block relative' }>
                {
                    isFile && (
                        <div className={ 'absolute -right-4 top-0 flex' }>
                            {
                                isEditing && (
                                    <div
                                        onClick={ () => handleOnClickSubmit() }
                                        className={ `pointer-events-auto cursor-pointer p-2 transition-all rounded-full bg-background-accent hover:bg-background-hover opacity-100 pointer-events-auto` }>
                                        <Check color={ 'var(--color-text-default)' }/>
                                    </div>
                                )
                            }

                            {
                                !image && !isEditing && (
                                    <div
                                        onClick={ () => handleOnClickEdit() }
                                        className={ `pointer-events-auto cursor-pointer p-2 transition-all rounded-full bg-background-accent hover:bg-background-hover opacity-${ isHovered ? '100' : '0' } pointer-events-${ isHovered ? 'auto' : 'none' }` }>
                                        <Edit2 color={ 'var(--color-text-default)' }/>
                                    </div>
                                )
                            }

                            {
                                !isEditing && (
                                    <div
                                        onClick={ () => handleOnClickRemove() }
                                        className={ `ml-2 pointer-events-auto cursor-pointer p-2 transition-all rounded-full bg-background-accent hover:bg-background-hover opacity-${ isHovered ? '100' : '0' } pointer-events-${ isHovered ? 'auto' : 'none' }` }>
                                        <X color={ 'var(--color-text-default)' }/>
                                    </div>
                                )
                            }
                        </div>
                    )
                }

                <div onClick={ () => handleOnClick() }
                     className={ `pointer-events-auto ${!isEditing ? 'cursor-pointer' : ''} transition-all w-card rounded-lg mt-5 transition-colors border-2 ${ ((isHovered || selected) && !isEditing) ? 'border-primary-default' : 'border-transparent' } ${ !image ? 'p-8 bg-background-hover text-text-default' : '' } ` }>
                    {
                        image && (
                            <img
                                className={ 'rounded-lg' }
                                src={ image }
                                alt={ '' }
                            />
                        )
                    }

                    {
                        isFile && <textarea
                            className={ `p-0 m-0 box-border resize-none bg-background-hover border-none overflow-hidden pointer-events-${isEditing ? 'auto' : 'none'}` }
                            onInput={ event => handleInputChange(event) }
                            ref={inputRef}
                            value={content || ''}
                            disabled={!isEditing}
                        />
                    }

                    {
                        !isFile && (
                            <p className={ 'overflow-ellipsis overflow-hidden' }>{ children }</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
};

Card.defaultProps = {
    path: '',
    isFile: true,
    unselect: () => {},
    select: () => {}
};

export default Card;