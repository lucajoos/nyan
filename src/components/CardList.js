import Card from './Card';
import { useCallback } from 'react';

const CardList = ({ cards, onRemove, selected }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, [ cards, onRemove ]);

    const items = cards?.map((path, index) => {
        if(path) {
            return <Card path={ path } key={ path.toString() } onRemove={ path => handleOnRemove(path) } selected={selected === index} />
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>{ items }</div>;
};

CardList.defaultProps = {
    images: [],
    onRemove: () => {},
    selected: -1
}

export default CardList;