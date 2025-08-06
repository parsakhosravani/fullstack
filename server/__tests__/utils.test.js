const { add, multiply } = require('../src/utils');

describe('Utils', () => {
  describe('add', () => {
    test('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    test('should handle zero', () => {
      expect(add(0, 5)).toBe(5);
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    test('should multiply by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });

    test('should handle negative numbers', () => {
      expect(multiply(-2, 3)).toBe(-6);
      expect(multiply(-2, -3)).toBe(6);
    });
  });
});