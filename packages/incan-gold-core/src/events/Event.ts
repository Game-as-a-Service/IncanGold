import { EventName } from "../constant/EventName";

export default class Event {
    public name:EventName;

    constructor(name:EventName){
        this.name = name;
    }
}

