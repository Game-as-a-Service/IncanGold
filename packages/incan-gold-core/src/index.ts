import Cards from './entities/Card/index'
import entities from './entities/index'

export const {
  ArtifactCard,
  HazardCard,
  TreasureCard,
  Card
} = Cards

export const {
  Bag,
  Deck,
  Game,
  Gem,
  Player,
  Temple,
  Tent,
  Tunnel
} = entities

export default {
  ...Cards,
  ...entities
}
