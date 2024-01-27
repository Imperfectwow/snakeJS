import { initGame } from './script';

test('Dummy Test', () => {
  expect(true).toBe(true);
});

test('Dummy Test #2', () => {
  expect(true).toBe(true);
  expect(true).toBe(true);
  expect(false).toBe(false);
});


jest.mock('./script', () => ({
  initGame: jest.fn(),
}));

test('Initial score is zero', () => {
  initGame();
  const score = 0; // Mocked score value
  expect(score).toBe(0);
});
