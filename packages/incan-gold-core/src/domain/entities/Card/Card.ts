import IncanGold from "../IncanGold";
import Event from "../../events/Event"

export default abstract class Card {
  private _cardID:string;
  
  constructor(id:string){
    this._cardID = id;
  }

  set cardID(id:string){
    this._cardID = id;
  }

  get cardID(){
    return this._cardID;
  }

  public abstract trigger(game:IncanGold): Event;
}
