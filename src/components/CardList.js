import Card from './Card';
import { Plus } from 'react-feather';
import { useSnapshot } from 'valtio';
import GlobalStore from '../store/GlobalStore';
import { useEffect } from 'react';

const { ipcRenderer } = require('electron');

const CardList = () => {
    const snap = useSnapshot(GlobalStore);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            GlobalStore.cards = files;

            if(files.length > 0) {
                GlobalStore.selection = 0;
            }
        });

        ipcRenderer.on('new', (event, file) => {
            GlobalStore.cards.unshift(file);
        });
    }, []);


    const items = snap.cards?.filter(file => !!file.path).map(({ path, created = false }, index) => {
        return <Card key={ path.toString() } index={ index }/>
    });

    return (
        <div
            className={ 'my-22 grid gap-4 grid-cols-list items-center overflow-hidden' }>
            <Card>
                <div className={ 'flex items-center select-none' }>
                    <Plus/>
                    <span className={ 'ml-2' }>Create new card</span>
                </div>
            </Card>

            { items }
        </div>
    );
};

export default CardList;