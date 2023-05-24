import Cards from './entities/Card/index';
import * as entities from './entities/index';
export const { Card, ArtifactCard } = Cards;
console.log('Cards');
console.log(Cards);
export default {
    ...Cards,
    ...entities
};
