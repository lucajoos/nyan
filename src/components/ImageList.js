import Image from './Image';
import { useCallback } from 'react';

const ImageList = ({ images, onRemove, selected }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, [ images, onRemove ]);

    const items = images?.map((path, index) => {
        if(path) {
            return <Image path={ path } key={ path.toString() } onRemove={ path => handleOnRemove(path) } selected={selected === index} />
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>{ items }</div>;
};

ImageList.defaultProps = {
    images: [],
    onRemove: () => {},
    selected: -1
}

export default ImageList;