import Gem from "./Gem"
import Artifact from "./Artifact"
import Bag from "./Bag"

export default class Tent{
    private _points : number = 0;
    private _numOfGems : number = 0;
    private _artifacts : Artifact[] = [];

    public update(bag:Bag){
        this.points += bag.points;
        this.numOfGems += bag.numOfGems;
        this._artifacts = this._artifacts.concat(bag.artifacts);
    }

    set points(points:number){
        this._points = points;
    }

    get points():number{
        return this._points;
    }

    set numOfGems(numOfGems:number){
        this._numOfGems = numOfGems;
    }

    get numOfGems():number{
        return this._numOfGems;
    }

    set artifacts(artifacts:Artifact[]){
        this._artifacts = artifacts;
    }

    get artifacts():Artifact[]{
        return this._artifacts;
    }
}