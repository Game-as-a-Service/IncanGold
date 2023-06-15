import Event from "./Event";

export default class PlayerMadeChoiceEvent extends Event{
    public playerWhoMadeChoice:number; // 已做出選擇的是幾號玩家
}