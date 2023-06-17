import Event from "./Event";

export default class AllPlayerMadeChoiceEvent extends Event{
    // ? 號玩家的選擇是 
    public AllPlayersChoices:Map<number,string>;
}