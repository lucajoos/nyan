import { useCallback, useEffect, useRef, useState } from 'react';

import CardList from './CardList';
import Header from './Header';
import { Archive, File, Upload, Check, X, Settings } from 'react-feather';
import Text from './Text';

const { ipcRenderer } = require('electron');

const App = () => {
    const capture = useRef(true);

    const [ cards, setCards ] = useState([]);
    const [ isDragging, setIsDragging ] = useState(false);
    const [ selected, setSelected ] = useState(0);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            setCards(files);
        });

        ipcRenderer.on('new', (event, file) => {
            setCards(previous => [ file, ...previous ]);
        });
    }, []);

    const handleOnDrop = useCallback(event => {
        event.preventDefault();

        const paths = [ ...event.dataTransfer.files ].map(file => {
            if(file ? file?.path?.length > 0 : false) {
                return file.path
            }
        });

        ipcRenderer.send('drop', paths);

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
        setCards(current => {
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

            ipcRenderer.send('drop', paths);

            return false;
        }
    }, [selected]);

    const handleOnClickQuit = useCallback(() => {
        ipcRenderer.send('close');
    }, []);

    const handleOnKeyDown = useCallback(event => {
        if(capture.current) {
            if(event.key === 'Enter' && cards.length > 0) {
                if(cards[selected]) {
                    ipcRenderer.send('copy', cards[selected]);
                }
            }

            if(event.key === 'Escape' || event.key === 'Backspace') {
                setSelected(-1);
            }

            if(event.key === 'Tab') {
                if((selected < (cards.length - 1)) && !event.shiftKey) {
                    setSelected(current => {
                        return current + 1;
                    });
                } else if(selected > 0 && event.shiftKey) {
                    setSelected(current => {
                        return current - 1;
                    });
                }
            }

            if(event.key === 'v' && event.ctrlKey) {
                ipcRenderer.send('paste');
            }
        }

        capture.current = false;

        setTimeout(() => {
            capture.current = true;
        }, 100);
    }, [selected, cards]);

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
                (cards.length === 0 && !isDragging) && <div
                    className={ 'transition-all text-center absolute top-24 right-0 left-0 bottom-8 pointer-events-none flex justify-center items-center text-background-accent text-background-accent'}>
                    <label className={'cursor-pointer pointer-events-auto p-36'}>
                        <File size={ 180 }/>
                        <Text>Paste something or drop a file</Text>
                        <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnInputChange(event) } value={''}
                               multiple />
                    </label>
                </div>
            }

            <Header>
                <Archive size={ 30 }/>
                <span className={ 'ml-3' }>Archive</span>
            </Header>

            <CardList cards={ cards } onRemove={ path => handleOnRemove(path) } selected={selected} />

            <div className={'right-16 bottom-16 fixed flex'}>
                <label>
                    <div
                        className={ 'text-background-default cursor-pointer p-4 transition-all rounded-full bg-primary-default hover:bg-primary-accent' }>
                        <Upload size={ 24 }/>

                        <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnInputChange(event) } value={''}
                               multiple />
                    </div>
                </label>
            </div>
        </div>
    );
};

export default App;
