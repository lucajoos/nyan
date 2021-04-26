import Image from './Image';
import { useCallback } from 'react';

const ImageList = ({ images, onRemove }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, [ images, onRemove ]);

    console.log(images)

    const items = images?.map(path => {
        if(path) {
            return <Image path={ path } key={ path.toString() } onRemove={ path => handleOnRemove(path) }/>
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>{ items }</div>;
};

ImageList.defaultProps = {
    images: []
}

export default ImageList;