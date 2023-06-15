import Card from "./Card/Card"
import ArtifactCard, {artifactList} from './Card/ArtifactCard'


export default class Temple{
    public artifactCards :Card[] = [];

    constructor(){
        Object.entries(artifactList).forEach(pair=>{
            this.artifactCards.push(new ArtifactCard(pair[0],pair[1]))
        })
    }

    public drawCard(): Card|undefined {
        return this.artifactCards.pop();
    }

}