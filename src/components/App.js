import { useCallback } from 'react';

const App = () => {
    const onDrop = useCallback(event => {
        event.preventDefault();

        [...event.dataTransfer.files].forEach(file => {
            if(file ? file?.path?.length > 0 : false) {
                console.log(file.path)
            }
        })
        return false;
    }, []);

    const onDragOver = useCallback(event => {
        event.preventDefault();
        return false;
    }, [])

    console.log('HELLO')

    return (
        <div
            className={'w-screen h-screen'}

            onDragOver={event => onDragOver(event)}
            onDrop={event => onDrop(event)}
        >
            <h1>Hello</h1>
        </div>
    );
};

export default App;
