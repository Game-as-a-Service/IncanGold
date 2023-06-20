class Tent {
    id;
    points;
    player = null;
    bags = [];
    constructor(id) {
        this.id = id;
        this.points = 0;
    }
    updatePoints() {
        if (this.player?.bag) {
            this.points += this.player.bag.points;
            var bag = this.player?.leaveBag();
            if (bag)
                this.bags.push(bag);
        }
    }
}
export default Tent;
