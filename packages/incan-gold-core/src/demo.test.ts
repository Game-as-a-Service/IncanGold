type sumType = (a: number, b: number) => number;
const sum: sumType = (a, b) => a + b;

test('adds 1 + 2 to equal 3', () => {
  // Arrange
  let x: number = 1, y: number = 2;
  let expected: number = 3;

  // Act
  let actual: number = sum(x, y);

  // Assert
  expect(actual).toBe(expected);
});
