import IncanGold from '../src/domain/entities/IncanGold';
import TreasureCard from '../src/domain/entities/Card/TreasureCard'
import ArtifactCard from '../src/domain/entities/Card/ArtifactCard'
import HazardCard from '../src/domain/entities/Card/HazardCard';
import Player, { Choice } from '../src/domain/entities/Player';
import Event, { EventName } from "../src/domain/events/Event"

interface PlayerAndChoice{
    player:Player,
    choice:Choice
}

describe('',()=>{
    let game:IncanGold;

    beforeEach(()=>{
        game = new IncanGold();
    })

    it("玩家隨機決定,跑完整場遊戲",async ()=>{
        game.setPlayerCount(5);
        const iterator = playGame(game,playersAndChoices(game));
        while(!game.gameover){
            let event = iterator.next().value;
            console.log(event);
            if(event?.name === EventName.TurnEnd) display(game);
        }
    })
})

function* playGame(game:IncanGold, playersAndChoices:Iterator<PlayerAndChoice>) {
    yield* game.start(); // user_cmd
    
    while (!game.gameover) {
        const { player, choice } = playersAndChoices.next().value;
        if(player.inTent === false)
            yield* game.makeChoice(player, choice); // user_cmd
    }
}

function playersAndChoices(game:IncanGold):Iterator<PlayerAndChoice> {
    var playerIndex = 0;
    var choice_index = 0;
    const choices:Choice[] = [Choice.KeepGoing, Choice.Quit];
    return {
      next: function() {
        if(playerIndex >= game.playersInTunnel.length ) playerIndex=0 ;
        choice_index = Math.round(Math.random());
        return {
            value: {player: game.playersInTunnel[playerIndex++], choice:choices[choice_index]},
            done:false
        };
      }
    };
}

function display(game:IncanGold){
    let output = '---------------------\n' + "Tunnel's cards: ";

    let cards = game.tunnel.cards.map(card=>{
        if(card instanceof TreasureCard) return "[T: " + card.numOfGems + '/' +card.points + "] ";
        if(card instanceof HazardCard) return "[H: " + card.name + "] ";
        if(card instanceof ArtifactCard) return "[A: " + card.name + "] ";
    }) + "\n";
    output = output.concat(cards);

    game.players.forEach(player=>{
        output = output.concat(JSON.stringify(player)+"\n");
    })

    output = output.concat('---------------------\n');

    console.log(output);
}