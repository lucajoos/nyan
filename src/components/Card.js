import { useCallback, useEffect, useRef, useState } from 'react';
import { Edit2, X, Check } from 'react-feather';
import ReactMarkdown from 'react-markdown'

const { ipcRenderer } = require('electron');
const fs = require('fs');
const { basename } = require('path');

const gemoji = require('remark-gemoji');

const Card = ({ children, path, selected, onRemove, isFile, select, created, index }) => {
    const [ isHovered, setIsHover ] = useState(false);
    const [ content, setContent ] = useState(null);
    const [ image, setImage ] = useState(null);
    const [ isEditing, setIsEditing ] = useState(created || false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if(isFile) {
            fs.readFile(path, (error, data) => {
                const bn = basename(path).split('.');
                const ex = bn[bn.length - 1];

                if(/(png|jpg|jpeg|svg|gif)/.test(ex)) {
                    setImage(`data:image/${ ex };base64,${ data.toString('base64') }`);
                } else if(/(txt)/.test(ex)) {
                    setContent(data.toString());

                    if(created) {
                        inputRef.current?.focus();
                        select(-1);
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        if(inputRef.current && containerRef.current) {
            const resize = () => {
                inputRef.current.setAttribute('style', 'height: auto;');
                inputRef.current.setAttribute('style', `height: ${inputRef.current?.scrollHeight}px;`);
            };

            inputRef.current?.removeEventListener('input', resize);
            inputRef.current?.addEventListener('input', resize);

            resize();
        }
    }, [ isEditing ])

    const handleOnClick = useCallback(() => {
        if(!isEditing) {
            if(isFile) {
                ipcRenderer.send('copy', path);
            } else {
                ipcRenderer.send('new');
            }
        }
    }, [ isEditing ]);

    const handleOnClickRemove = useCallback(() => {
        if(isFile) {
            ipcRenderer.send('remove', path);
            onRemove(path);
        }
    }, []);

    const handleOnClickSubmit = useCallback(() => {
        if(isFile) {
            if(content?.trim()?.length > 0) {
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
    }, [ content ]);

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
                        isFile && <div className={'relative transition-all'} ref={containerRef}>
                            <div className={`markdown ${isEditing ? 'absolute opacity-0' : 'opacity-100'}`}>
                                <ReactMarkdown
                                    disallowedElements={['img']}
                                    remarkPlugins={[gemoji]}
                                >
                                    {content || ''}
                                </ReactMarkdown>
                            </div>
                            <textarea
                                className={ `p-0 m-0 overflow-hidden box-border resize-none bg-background-hover border-none overflow-hidden pointer-events-${isEditing ? 'auto opacity-100' : 'none opacity-0 absolute'}` }
                                onInput={ event => handleInputChange(event) }
                                ref={inputRef}
                                value={content || ''}
                                disabled={!isEditing}
                            />
                        </div>
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