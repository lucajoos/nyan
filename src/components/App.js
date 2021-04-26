import { useCallback, useEffect, useState } from 'react';

import ImageList from './ImageList';
import Header from './Header';
import { Archive } from 'react-feather';

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

        const paths = [...event.dataTransfer.files].map(file => {
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

    return (
        <div
            className={ 'overflow-x-hidden p-16 w-full h-full' }

            onDragOver={ event => onDragOver(event) }
            onDrop={ event => onDrop(event) }
        >
            <div className={ 'absolute top-0 left-0 right-0 h-16 webkit-drag' }/>

            <Header>
                <Archive size={ 30 }/>
                <span className={ 'ml-3' }>Archive</span>
            </Header>

            <ImageList images={ images } onRemove={ path => handleOnRemove(path) }/>
        </div>
    );
};

export default App;
