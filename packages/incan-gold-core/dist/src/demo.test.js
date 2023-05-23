"use strict";
const sum = (a, b) => a + b;
test('adds 1 + 2 to equal 3', () => {
    // Arrange
    let x = 1, y = 2;
    let expected = 3;
    // Act
    let actual = sum(x, y);
    // Assert
    expect(actual).toBe(expected);
});
