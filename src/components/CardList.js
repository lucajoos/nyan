import Card from './Card';
import { Plus } from 'react-feather';
import { useSnapshot } from 'valtio';
import GlobalStore from '../store/GlobalStore';
import { useEffect, useRef } from 'react';

const { ipcRenderer } = require('electron');

const CardList = () => {
    const snap = useSnapshot(GlobalStore);
    const containerRef = useRef(null);

    useEffect(() => {
        ipcRenderer.send('get-files');

        ipcRenderer.once('get-files-reply', (event, files) => {
            GlobalStore.cards = files;
        });

        ipcRenderer.on('new', (event, file) => {
            GlobalStore.cards.unshift(file);
        });
    }, []);

    const items = snap.cards?.map(({path, created=false}, index) => {
        if(path) {
            return <Card key={ path.toString() } index={index} />
        }
    });

    return (
        <div className={ 'my-22 grid gap-4 grid-cols-list items-center overflow-hidden' }>
            <Card>
                <div className={'flex items-center'}>
                    <Plus />
                    <span className={'ml-2'}>Create new card</span>
                </div>
            </Card>

            { items }
        </div>
    );
};

export default CardList;