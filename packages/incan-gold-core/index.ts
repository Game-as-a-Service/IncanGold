export { default as DistributeGemsAndArtifactsToExplorersEvent } from "./src/events/DistributeGemsAndArtifactsToExplorersEvent"
export { default as Event } from "./src/events/Event"
export { default as GameOverEvent} from "./src/events/GameOverEvent"
export { ExplorerMadeChoiceEvent, AllExplorersMadeChoiceEvent } from "./src/events/MadeChoiceEvent"
export { NewTurnArtifactCardTriggeredEvent, NewTurnHazardCardTriggeredEvent, NewTurnTreasureCardTriggeredEvent } from "./src/events/NewTurnCardTriggeredEvent"
export { default as RoundEndEvent } from "./src/events/RoundEndEvent"

export { default as Card } from "./src/entities/Card/Card"
export { default as ArtifactCard } from "./src/entities/Card/ArtifactCard"
export { default as HazardCard } from "./src/entities/Card/HazardCard"
export { default as TreasureCard } from "./src/entities/Card/TreasureCard"

export { default as Artifact } from "./src/entities/Artifact"
export { default as Bag } from "./src/entities/Bag"
export { default as Deck } from "./src/entities/Deck"
export { default as Gem } from "./src/entities/Gem"
export { default as IncanGold } from "./src/entities/IncanGold"
export { default as Explorer } from "./src/entities/Explorer"
export { default as Tent } from "./src/entities/Tent"
export { default as Tunnel } from "./src/entities/Tunnel"

export * as CardInfo from "./src/constant/CardInfo"
export { Choice } from "./src/constant/Choice"
export { EventName } from "./src/constant/EventName"

// export interface Events {
//   Event: typeof Event;
//   DistributeGemsAndArtifactsToExplorersEvent: typeof DistributeGemsAndArtifactsToExplorersEvent;
//   GameOverEvent: typeof GameOverEvent;
//   ExplorerMadeChoiceEvent: typeof ExplorerMadeChoiceEvent;
//   AllExplorersMadeChoiceEvent: typeof AllExplorersMadeChoiceEvent;
//   NewTurnArtifactCardTriggeredEvent: typeof NewTurnArtifactCardTriggeredEvent;
//   NewTurnHazardCardTriggeredEvent: typeof NewTurnHazardCardTriggeredEvent;
//   NewTurnTreasureCardTriggeredEvent: typeof NewTurnTreasureCardTriggeredEvent;
//   RoundEndEvent: typeof RoundEndEvent;
// }

// export const events: Events = {
//   Event,
//   DistributeGemsAndArtifactsToExplorersEvent, GameOverEvent,
//   ExplorerMadeChoiceEvent, AllExplorersMadeChoiceEvent,
//   NewTurnArtifactCardTriggeredEvent, NewTurnHazardCardTriggeredEvent, NewTurnTreasureCardTriggeredEvent,
//   RoundEndEvent
// }

// export interface Cards {
//   Card: typeof Card;
//   ArtifactCard: typeof ArtifactCard;
//   HazardCard: typeof HazardCard;
//   TreasureCard: typeof TreasureCard;
// }

// export const cards: Cards = {
//   Card, ArtifactCard, HazardCard, TreasureCard
// }

// export interface Entities {
//   cards: typeof cards
//   Bag: typeof Bag
//   Deck: typeof Deck
//   IncanGold: typeof IncanGold
//   Gem: typeof Gem
//   Artifact: typeof Artifact
//   Explorer: typeof Explorer
//   Tent: typeof Tent
//   Tunnel: typeof Tunnel
// }

// export const entities: Entities = {
//   cards, Bag, Deck, IncanGold, Gem, Artifact, Explorer, Tent, Tunnel
// }

// export interface Constant {
//   CardInfo: typeof CardInfo
//   Choice: typeof Choice
//   EventName: typeof EventName
// }

// export const constant:Constant = {
//   CardInfo, Choice, EventName
// }