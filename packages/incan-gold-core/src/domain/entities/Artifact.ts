
export default class Artifact{
    public readonly name:string;
    public readonly points:number;

    constructor(name:string, points:number){
        this.name = name;
        this.points = points;
    }
}