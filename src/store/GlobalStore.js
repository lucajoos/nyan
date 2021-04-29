import { proxy } from 'valtio'

let GlobalStore = proxy({
    selection: -1,
    editing: false,
});

export default GlobalStore;