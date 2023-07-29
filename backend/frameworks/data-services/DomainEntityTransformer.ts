import IncanGold from "../../../packages/incan-gold-core/src/domain/entities/IncanGold";
import Player from "../../../packages/incan-gold-core/src/domain/entities/Player";
import { IncanGoldData } from "./orm/IncanGoldData";
import { PlayerData } from "./orm/PlayerData";
import Gem from "../../../packages/incan-gold-core/src/domain/entities/Gem";
import Artifact from "../../../packages/incan-gold-core/src/domain/entities/Artifact";
import { artifactCards, hazardCards } from "../../../packages/incan-gold-core/src/domain/constant/CardInfo";
import Card from "../../../packages/incan-gold-core/src/domain/entities/Card/Card";
import TreasureCard from "../../../packages/incan-gold-core/src/domain/entities/Card/TreasureCard";
import ArtifactCard from "../../../packages/incan-gold-core/src/domain/entities/Card/ArtifactCard";
import HazardCard from "../../../packages/incan-gold-core/src/domain/entities/Card/HazardCard";
import { CardData } from "./orm/CardData";
import { CardLocation } from "./orm/CardData";


export class Domain_OrmEntity_Transformer {

    updatePlayer(data:PlayerData, player:Player):void{
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

    updatePlayerData(player:Player, data:PlayerData):void{
        data.choice = player.choice;
        data.inTent = player.inTent;
        data.gemsInBag = player.bag.numOfGems,
        data.totalPoints = player.points;
        data.gemsInTent = player.tent.numOfGems;
        data.artifacts = player.tent.artifactsNames
    }

    toCard(data:CardData):Card{
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

    updateCardData(card:Card, data:CardData):void{
        if(data.cardID.match(/^T.*/)){
            data.remainingGems = (<TreasureCard>card).numOfGems;
        }else if(data.cardID.match(/^A.*/)){
            data.remainingArtifact = (<ArtifactCard>card).isArtifactPresent;
        }
    }

    toDomain(data:IncanGoldData):IncanGold{
        const deck:Card[] = [];
        const tunnel:Card[] = [];
        const trashDeck : Map<number, Card[]> = new Map();
        [1,2,3,4,5].forEach(round=>{
            trashDeck.set( round, []);
        })

        data.cards.forEach(cardData=>{
            const card = this.toCard(cardData);
            if(cardData.location === CardLocation.Deck){
                deck.push(card);
            }else if(cardData.location === CardLocation.Tunnel){
                tunnel.push(card);
            }else if(cardData.location === CardLocation.TrashDeck){
                trashDeck.set( cardData.whenInTrashDeck , (trashDeck.get(cardData.whenInTrashDeck)||[]).concat(card));
            }
        });

        const game = new IncanGold(data.id, data.players.map(player=>player.id),tunnel,deck,trashDeck);
        game.round = data.round;
        game.turn = data.turn;
        data.players.forEach((playerData,index)=>this.updatePlayer(playerData, game.players[index]));
        return game;
    }

    updateIncanGoldData(game:IncanGold,data:IncanGoldData):void{
        data.round = game.round;
        data.turn = game.turn;

        game.players.forEach((player,index)=>this.updatePlayerData(player, data.players[index]));

        game.tunnel.cards.forEach(card=>{
            const cardData = this.findCard(card.cardID,data);
            this.updateCardData(card, cardData);
            cardData.location = CardLocation.Tunnel;
        });

        game.deck.cards.forEach(card=>{
            const cardData = this.findCard(card.cardID,data);
            this.updateCardData(card, cardData);
            cardData.location = CardLocation.Deck;
        });

        [1,2,3,4,5].forEach(round =>{
            const cards = game.trashDeck.cards.get(round);
            if(cards.length){
                cards.forEach((card)=>{
                    const cardData = this.findCard(card.cardID,data);
                    this.updateCardData(card, cardData);
                    cardData.location = CardLocation.TrashDeck;
                    cardData.whenInTrashDeck = round;
                });
            }
        });
    }

    private findCard(cardID:string ,incanGoldData:IncanGoldData):CardData{
        const card = incanGoldData.cards.find((cardData) => cardData.cardID === cardID);
        return card;
    }

}

