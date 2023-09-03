import { expect, it } from 'vitest';
import IncanGold from '../src/entities/IncanGold';
import TreasureCard from '../src/entities/Card/TreasureCard'
import ArtifactCard from '../src/entities/Card/ArtifactCard'
import HazardCard from '../src/entities/Card/HazardCard';
import { Choice } from '../src/constant/Choice';
import { EventName } from '../src/constant/EventName';
import Explorer from '../src/entities/Explorer';
import { Event } from "../src/events/Event"

interface ExplorerAndChoice {
    explorer: Explorer,
    choice: Choice
}

it("玩家隨機決定,跑完整場遊戲", () => {
    const explorers = ['a', 'b', 'c'].map(id => new Explorer(id));
    const game = new IncanGold('1', 0, 0, explorers);
    const iterator = playGame(game, explorersAndChoices(game));
    while (!game.gameOver) {
        let event = iterator.next().value;
        console.log(event);
        if (event?.name === EventName.TurnEnd) display(game);
    }
})

function* playGame(game: IncanGold, explorersAndChoices: Iterator<ExplorerAndChoice>) {
    yield* game.start(); // user_cmd

    while (!game.gameOver) {
        const { explorer, choice } = explorersAndChoices.next().value;
        if (explorer.inTent === false)
            yield* game.makeChoice(explorer.id, choice); // user_cmd
    }
}

function explorersAndChoices(game: IncanGold): Iterator<ExplorerAndChoice> {
    var explorerIndex = 0;
    var choice_index = 0;
    const choices: Choice[] = [Choice.KeepGoing, Choice.Quit];
    return {
        next: function () {
            if (explorerIndex >= game.explorersInTunnel.length) explorerIndex = 0;
            choice_index = 1; // Math.round(Math.random());
            return {
                value: { explorer: game.explorersInTunnel[explorerIndex++], choice: choices[choice_index] },
                done: false
            };
        }
    };
}

function display(game: IncanGold) {
    let output = '---------------------\n' + "Tunnel's cards: ";

    let cards = game.tunnel.cards.map(card => {
        if (card instanceof TreasureCard) return "[T: " + card.numOfGems + '/' + card.points + "] ";
        if (card instanceof HazardCard) return "[H: " + card.name + "] ";
        if (card instanceof ArtifactCard) return "[A: " + card.name + "] ";
    }) + "\n";
    output = output.concat(cards);

    game.explorers.forEach(explorer => {
        output = output.concat(JSON.stringify(explorer) + "\n");
    })

    output = output.concat('---------------------\n');

    console.log(output);
}