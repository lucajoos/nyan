import { proxy } from 'valtio'

let GlobalStore = proxy({
    selection: -1,
    editing: 0,
    cards: []
});

export default GlobalStore;