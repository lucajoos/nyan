import { useCallback, useEffect, useState } from 'react';

import ImageList from './ImageList';
import Header from './Header';

const { ipcRenderer } = require('electron');

const App = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            setImages(files);
        });
    }, []);

    const onDrop = useCallback(event => {
        event.preventDefault();

        [...event.dataTransfer.files].forEach(file => {
            if(file ? file?.path?.length > 0 : false) {
                ipcRenderer.invoke('drop-file', file.path)
                    .then(path => {
                        setImages(previous => [path, ...previous]);
                    });
            }
        });

        return false;
    }, []);

    const onDragOver = useCallback(event => {
        event.preventDefault();
        return false;
    }, []);

    return (
        <div
            className={'overflow-x-hidden p-16 w-full h-full'}

            onDragOver={event => onDragOver(event)}
            onDrop={event => onDrop(event)}
        >
            <Header>Select image</Header>
            <ImageList images={images} />
        </div>
    );
};

export default App;
