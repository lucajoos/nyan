import { useCallback, useEffect, useRef, useState } from 'react';

import ImageList from './ImageList';
import Header from './Header';
import { Archive, File, Upload, Check, X } from 'react-feather';
import Text from './Text';

const { ipcRenderer } = require('electron');

const App = () => {
    const capture = useRef(true);

    const [ images, setImages ] = useState([]);
    const [ isDragging, setIsDragging ] = useState(false);
    const [ selected, setSelected ] = useState(0);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            setImages(files);
        });
    }, []);

    const handleOnDrop = useCallback(event => {
        event.preventDefault();

        const paths = [ ...event.dataTransfer.files ].map(file => {
            if(file ? file?.path?.length > 0 : false) {
                return file.path
            }
        });

        ipcRenderer.invoke('drop', paths)
            .then(current => {
                setImages(previous => [ ...current, ...previous ]);

                if(selected > -1) {
                    setSelected(0);
                }
            });

        if(isDragging) {
            setIsDragging(false);
        }

        return false;
    }, [isDragging, selected]);

    const handleOnDragOver = useCallback(event => {
        event.preventDefault();

        if(!isDragging) {
            setIsDragging(true);
        }

        return false;
    }, [isDragging]);

    const handleOnDragExit = useCallback(() => {
        if(isDragging) {
            setIsDragging(false);
        }
    }, [isDragging]);

    const handleOnRemove = useCallback(path => {
        setImages(current => {
            let r = current.filter(value => value !== path);

            if(r.length === 0) {
                setSelected(-1)
            } else {
                setSelected(0);
            }

            return r;
        });
    }, []);

    const handleOnInputChange = useCallback(event => {
        if(event?.target?.files?.length > 0) {
            const paths = [ ...event.target.files ].map(file => {
                if(file ? file?.path?.length > 0 : false) {
                    return file.path
                }
            });

            ipcRenderer.invoke('drop', paths)
                .then(current => {
                    setImages(previous => [ ...current, ...previous ]);

                    if(selected > -1) {
                        setSelected(0);
                    }
                });

            return false;
        }
    }, [selected]);

    const handleOnClickQuit = useCallback(() => {
        ipcRenderer.send('close');
    }, []);

    const handleOnKeyDown = useCallback(event => {
        if(capture.current) {
            console.log(event)
            if(event.key === 'Enter' && images.length > 0) {
                if(images[selected]) {
                    ipcRenderer.send('copy', images[selected]);
                }
            } else if(event.key === 'Escape' || event.key === 'Backspace') {
                setSelected(-1);
            } else if(event.key === 'Tab') {
                if((selected < (images.length - 1)) && !event.shiftKey) {
                    setSelected(current => {
                        return current + 1;
                    });
                } else if(selected > 0 && event.shiftKey) {
                    setSelected(current => {
                        return current - 1;
                    });
                }
            }
        }

        capture.current = false;

        setTimeout(() => {
            capture.current = true;
        }, 100);
    }, [selected, images]);

    return (
        <div
            className={ 'overflow-x-hidden p-16 w-full h-full relative' }

            onDragOver={ event => handleOnDragOver(event) }
            onDragLeave={event => handleOnDragExit(event) }

            onDrop={ event => handleOnDrop(event) }
            onKeyDown={ event => handleOnKeyDown(event) }

            tabIndex={0}
        >
            <div className={ 'absolute top-0 left-0 right-0 h-16 webkit-drag' }/>

            <div className={'transition-all text-background-accent absolute top-16 right-16 hover:text-text-default cursor-pointer'} onClick={() => handleOnClickQuit()}>
                <X size={36}/>
            </div>

            <div
                className={ `z-30 transition-all text-center absolute top-10 right-0 left-0 bottom-0 flex pointer-events-none justify-center items-center text-background-accent text-${isDragging ? 'primary-default' : 'background-accent'} opacity-${isDragging ? '100' : '0'}`}>
                <div>
                    <Check size={ 180 }/>
                </div>
            </div>

            <div className={`fixed rounded-lg transition-all top-0 bottom-0 right-0 left-0 bg-background-default z-20 pointer-events-none opacity-${isDragging ? '80' : '0'}`}/>

            {
                (images.length === 0 && !isDragging) && <div
                    className={ 'transition-all text-center absolute top-10 right-0 left-0 bottom-0 flex pointer-events-none justify-center items-center text-background-accent text-background-accent'}>
                    <div>
                        <File size={ 180 }/>
                        <Text>Drag'n'Drop some files</Text>
                    </div>
                </div>
            }

            <Header>
                <Archive size={ 30 }/>
                <span className={ 'ml-3' }>Archive</span>
            </Header>

            <ImageList images={ images } onRemove={ path => handleOnRemove(path) } selected={selected} />

            <label
                className={ 'text-background-default cursor-pointer fixed right-16 bottom-16 p-4 transition-all rounded-full bg-primary-default hover:bg-primary-accent' }>
                <Upload size={ 24 }/>
                <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnInputChange(event) } value={''}
                       multiple />
            </label>
        </div>
    );
};

export default App;
