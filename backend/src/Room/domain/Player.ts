import { STATE } from './constant/State';

export class Player {
    public id: string;
    public state: STATE;

    constructor(id: string, state?:STATE) {
        this.id = id;
        if (state) 
            this.state = state;
        else 
            this.state = STATE.NOTSEATED;
    }
}