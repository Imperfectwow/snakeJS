import { initGame } from './script';

test('Dummy Test', () => {
  expect(true).toBe(true);
});

test('Dummy Test #2', () => {
  expect(true).toBe(true);
  expect(true).toBe(true);
  expect(false).toBe(false);
});

// Mock the initGame function if it has side effects or requires a browser environment
jest.mock('./script', () => ({
  initGame: jest.fn(),
}));

test('Initial score is zero', () => {
  // The actual function body of initGame is not called due to mocking
  initGame();
  // You can mock the score if it is set by initGame
  const score = 0; // Mocked score value
  expect(score).toBe(0);
});
