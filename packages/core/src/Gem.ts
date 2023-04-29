
export default class Gem {
  private points: Number = 1;

  constructor(points: Number) {
    this.points = points
  }

  getPoints() {
    return this.points
  }
}
