import { buildFruitSelector, FRUITS } from './fruit.js';

describe('fruit definitions', () => {
  test('have the expected point values', () => {
    const pointsByFruit = Object.fromEntries(FRUITS.map((fruit) => [fruit.name, fruit.points]));

    expect(pointsByFruit).toEqual({
      banana: 10,
      apple: 20,
      cherry: 30,
      pineapple: 40,
      coconut: 50,
    });
  });
});

describe('fruit selector', () => {
  const makeDeterministicRandom = (sequence) => {
    let index = 0;
    return () => {
      const value = sequence[index % sequence.length];
      index += 1;
      return value;
    };
  };

  test('avoids repeating the same fruit back-to-back', () => {
    const repeatBiasRandom = makeDeterministicRandom([0.99]);
    const { pickNext } = buildFruitSelector(FRUITS, repeatBiasRandom);

    const selections = Array.from({ length: 25 }, () => pickNext().name);

    for (let i = 1; i < selections.length; i += 1) {
      expect(selections[i]).not.toBe(selections[i - 1]);
    }
  });

  test('clamps out-of-range random values into a safe interval', () => {
    const erraticRandom = makeDeterministicRandom([-5, 7, 0.5]);
    const { pickNext } = buildFruitSelector(FRUITS, erraticRandom);

    const chosen = [pickNext().name, pickNext().name, pickNext().name];

    chosen.forEach((name) => {
      expect(FRUITS.some((fruit) => fruit.name === name)).toBe(true);
    });
  });
});
