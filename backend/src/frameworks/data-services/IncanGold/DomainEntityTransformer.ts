import { IncanGoldData } from "./data/IncanGoldData";
import { PlayerData } from "./data/PlayerData";
import { CardData,CardLocation } from "./data/CardData";
import { IncanGold,Player,Gem,Artifact,Card,TreasureCard,ArtifactCard,HazardCard,CardInfo } from "../../../domain/IncanGold"
const { artifactCards, hazardCards } = CardInfo;

export class Domain_OrmEntity_Transformer {

    toDomain(data:IncanGoldData):IncanGold{
        const { tunnel, deck, trashDeck } = this.setupCards(data);
        const game = new IncanGold(data.id, data.players.map(player=>player.id),tunnel,deck,trashDeck);
        game.round = data.round;
        game.turn = data.turn;
        data.players.forEach((playerData,index)=>this.toPlayer(playerData, game.players[index]));
        return game;
    }

    updateIncanGoldData(game:IncanGold,data:IncanGoldData):void{
        data.round = game.round;
        data.turn = game.turn;
        this.updatePlayers(game, data);
        this.updateTunnel(game, data);
        this.updateDeck(game, data);
        this.updateTrashDeck(game, data);
    }

    // data -> player
    private toPlayer(data:PlayerData, player:Player):void{
        player.choice = data.choice;
        player.inTent = data.inTent;
        player.putGemsInBag(Array(data.gemsInBag).fill(new Gem()));
        player.tent.points = data.totalPoints;
        player.tent.numOfGems = data.gemsInTent;
        player.tent.artifacts = data.artifacts.map( artifactName =>{
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

    // player -> playerDate
    private updatePlayerData(player:Player, data:PlayerData):void{
        data.choice = player.choice;
        data.inTent = player.inTent;
        data.gemsInBag = player.bag.numOfGems,
        data.totalPoints = player.points;
        data.gemsInTent = player.tent.numOfGems;
        data.artifacts = player.tent.artifactsNames
    }

    // card -> cardData
    private updateCardData(card:Card, data:CardData):void{
        if(data.cardID.match(/^T.*/)){
            data.remainingGems = (<TreasureCard>card).numOfGems;
        }else if(data.cardID.match(/^A.*/)){
            data.remainingArtifact = (<ArtifactCard>card).isArtifactPresent;
        }
    }

    private updatePlayers(game: IncanGold, data: IncanGoldData) {
        game.players.forEach((player, index) => this.updatePlayerData(player, data.players[index]));
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

