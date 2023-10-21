
export default class Artifact {
    public readonly id: string;
    public readonly name: string;
    public readonly points: number;

    constructor(id: string, name: string, points: number) {
        this.id = id;
        this.name = name;
        this.points = points;
    }
}