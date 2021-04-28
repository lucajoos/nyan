import Card from './Card';
import { useCallback } from 'react';
import { Plus } from 'react-feather';

const CardList = ({ cards, onRemove, selected }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, [ cards, onRemove ]);

    const items = cards?.map((path, index) => {
        if(path) {
            return <Card path={ path } key={ path.toString() } onRemove={ path => handleOnRemove(path) } selected={selected === index} />
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>
        <Card isFile={false}>
            <div className={'flex items-center'}>
                <Plus />
                <span className={'ml-3'}>Create new card</span>
            </div>
        </Card>

        { items }
    </div>;
};

CardList.defaultProps = {
    images: [],
    onRemove: () => {},
    selected: -1
}

export default CardList;