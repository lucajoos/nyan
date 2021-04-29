import Card from './Card';
import { useCallback } from 'react';
import { Plus } from 'react-feather';

const CardList = ({ cards, onRemove, selected, unselect, select }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, [ cards, onRemove ]);

    const items = cards?.map(({path, created=false}, index) => {
        if(path) {
            return <Card path={ path } key={ path.toString() } created={created} onRemove={ path => handleOnRemove(path) } selected={selected === index} unselect={unselect} select={select} index={index} />
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>
        <Card isFile={false}>
            <div className={'flex items-center text-background-default'}>
                <Plus />
                <span className={'ml-2'}>Create new card</span>
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