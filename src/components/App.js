import { useCallback, useEffect, useState } from 'react';

import ImageList from './ImageList';
import Header from './Header';
import { Archive, Frown, Upload } from 'react-feather';

const { ipcRenderer } = require('electron');

const App = () => {
    const [ images, setImages ] = useState([]);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            setImages(files);
        });
    }, []);

    const onDrop = useCallback(event => {
        event.preventDefault();

        const paths = [ ...event.dataTransfer.files ].map(file => {
            if(file ? file?.path?.length > 0 : false) {
                return file.path
            }
        });

        ipcRenderer.invoke('drop', paths)
            .then(current => {
                setImages(previous => [ ...current, ...previous ]);
            });

        return false;
    }, []);

    const onDragOver = useCallback(event => {
        event.preventDefault();
        return false;
    }, []);

    const handleOnRemove = useCallback(path => {
        setImages(current => {
            return current.filter(value => value !== path);
        });
    }, [ images ]);

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
                });

            return false;
        }
    }, []);

    return (
        <div
            className={ 'overflow-x-hidden p-16 w-full h-full relative' }

            onDragOver={ event => onDragOver(event) }
            onDrop={ event => onDrop(event) }
        >
            <div className={ 'absolute top-0 left-0 right-0 h-16 webkit-drag' }/>

            <Header>
                <Archive size={ 30 }/>
                <span className={ 'ml-3' }>Archive</span>
            </Header>

            <ImageList images={ images } onRemove={ path => handleOnRemove(path) }/>

            {
                images.length === 0 && <Frown/>
            }

            <label
                className={ 'text-background-default cursor-pointer fixed right-16 bottom-16 p-4 transition-all rounded-full bg-primary-default hover:bg-primary-accent' }>
                <Upload size={ 24 }/>
                <input className={ 'hidden' } type={ 'file' } onChange={ event => handleOnInputChange(event) }
                       multiple/>
            </label>
        </div>
    );
};

export default App;
