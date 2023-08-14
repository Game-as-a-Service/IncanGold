import { IncanGoldData } from "./data/IncanGoldData";
import { ExplorerData } from "./data/ExplorerData";
import { CardData,CardLocation } from "./data/CardData";
import { IncanGold,Explorer,Gem,Artifact,Card,TreasureCard,ArtifactCard,HazardCard,CardInfo } from "../domain/IncanGold"
const { artifactCards, hazardCards } = CardInfo;

export class Domain_OrmEntity_Transformer {

    toDomain(data:IncanGoldData):IncanGold{
        const { tunnel, deck, trashDeck } = this.setupCards(data);
        const game = new IncanGold(data.id, data.explorers.map(explorer=>explorer.id),tunnel,deck,trashDeck);
        game.round = data.round;
        game.turn = data.turn;
        data.explorers.forEach((explorerData,index)=>this.toExplorer(explorerData, game.explorers[index]));
        return game;
    }

    updateIncanGoldData(game:IncanGold,data:IncanGoldData):void{
        data.round = game.round;
        data.turn = game.turn;
        this.updateExplorers(game, data);
        this.updateTunnel(game, data);
        this.updateDeck(game, data);
        this.updateTrashDeck(game, data);
    }

    // data -> explorer
    private toExplorer(data:ExplorerData, explorer:Explorer):void{
        explorer.choice = data.choice;
        explorer.inTent = data.inTent;
        explorer.putGemsInBag(Array(data.gemsInBag).fill(new Gem()));
        explorer.tent.points = data.totalPoints;
        explorer.tent.numOfGems = data.gemsInTent;
        explorer.tent.artifacts = data.artifacts.map( artifactName =>{
            const {name,points} = artifactCards.find(card => card.name === artifactName );
            return new Artifact(name,points);
        })
    }

    // data -> card
    private toCard(data:CardData):Card{
        let card:Card;
        if(data.cardID.match(/^T.*/)){
            card = new TreasureCard(data.cardID,data.gems);
            (<TreasureCard>card).gems = (Array(data.remainingGems).fill(new Gem()));
        }else if(data.cardID.match(/^A.*/)){
            const artifactCard = artifactCards.find(card => card.ID === data.cardID);
            card = new ArtifactCard(artifactCard.ID,artifactCard.name,artifactCard.points);
            (<ArtifactCard>card).isArtifactPresent = data.remainingArtifact;
        }else if(data.cardID.match(/^H.*/)){
            const {ID,name} = hazardCards.find(card => card.ID === data.cardID);
            card = new HazardCard(ID, name);
        }
        return card;
    }

    // Put the cards in the correct locations in Domain
    private setupCards(data: IncanGoldData) {
        const deck: Card[] = [];
        const tunnel: Card[] = [];
        const trashDeck: Map<number, Card[]> = new Map();
        [1, 2, 3, 4, 5].forEach(round => {
            trashDeck.set(round, []);
        });

        data.cards.forEach(cardData => {
            const card = this.toCard(cardData);
            if (cardData.location === CardLocation.Deck) {
                deck.push(card);
            } else if (cardData.location === CardLocation.Tunnel) {
                tunnel.push(card);
            } else if (cardData.location === CardLocation.TrashDeck) {
                trashDeck.set(cardData.whenInTrashDeck, (trashDeck.get(cardData.whenInTrashDeck) || []).concat(card));
            }
        });
        return { tunnel, deck, trashDeck };
    }

    // explorer -> explorerDate
    private updateExplorerData(explorer:Explorer, data:ExplorerData):void{
        data.choice = explorer.choice;
        data.inTent = explorer.inTent;
        data.gemsInBag = explorer.bag.numOfGems,
        data.totalPoints = explorer.points;
        data.gemsInTent = explorer.tent.numOfGems;
        data.artifacts = explorer.tent.artifactsNames
    }

    // card -> cardData
    private updateCardData(card:Card, data:CardData):void{
        if(data.cardID.match(/^T.*/)){
            data.remainingGems = (<TreasureCard>card).numOfGems;
        }else if(data.cardID.match(/^A.*/)){
            data.remainingArtifact = (<ArtifactCard>card).isArtifactPresent;
        }
    }

    private updateExplorers(game: IncanGold, data: IncanGoldData) {
        game.explorers.forEach((explorer, index) => this.updateExplorerData(explorer, data.explorers[index]));
    }

    private updateTrashDeck(game: IncanGold, data: IncanGoldData) {
        [1, 2, 3, 4, 5].forEach(round => {
            const cards = game.trashDeck.cards.get(round);
            if (cards.length) {
                cards.forEach((card) => {
                    const cardData = this.findCard(card.cardID, data);
                    this.updateCardData(card, cardData);
                    cardData.location = CardLocation.TrashDeck;
                    cardData.whenInTrashDeck = round;
                });
            }
        });
    }

    private updateDeck(game: IncanGold, data: IncanGoldData) {
        game.deck.cards.forEach(card => {
            const cardData = this.findCard(card.cardID, data);
            this.updateCardData(card, cardData);
            cardData.location = CardLocation.Deck;
        });
    }

    private updateTunnel(game: IncanGold, data: IncanGoldData) {
        game.tunnel.cards.forEach(card => {
            const cardData = this.findCard(card.cardID, data);
            this.updateCardData(card, cardData);
            cardData.location = CardLocation.Tunnel;
        });
    }

    private findCard(cardID:string ,incanGoldData:IncanGoldData):CardData{
        const card = incanGoldData.cards.find((cardData) => cardData.cardID === cardID);
        return card;
    }

}

