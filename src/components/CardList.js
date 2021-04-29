import Card from './Card';
import { useCallback } from 'react';
import { Plus } from 'react-feather';

const CardList = ({ cards, onRemove }) => {
    const handleOnRemove = useCallback(path => {
        onRemove(path);
    }, []);

    const items = cards?.map(({path, created=false}, index) => {
        if(path) {
            return <Card path={ path } key={ path.toString() } created={created} onRemove={ path => handleOnRemove(path) } index={index} />
        }
    });

    return <div className={ 'my-22 grid gap-4 grid-cols-list items-center' }>
        <Card isFile={false}>
            <div className={'flex items-center'}>
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