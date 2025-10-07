export const FRUITS = [
  { name: 'banana', points: 10, src: 'images/banana.svg' },
  { name: 'apple', points: 20, src: 'images/apple.svg' },
  { name: 'cherry', points: 30, src: 'images/cherry.svg' },
  { name: 'pineapple', points: 40, src: 'images/pineapple.svg' },
  { name: 'coconut', points: 50, src: 'images/coconut.svg' },
];

function clampRandomValue(value) {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  if (value >= 1) {
    return 1 - Number.EPSILON;
  }
  return value;
}

function attachImageAsset(fruit) {
  if (typeof Image === 'undefined') {
    return fruit;
  }

  const image = new Image();
  image.src = fruit.src;
  return { ...fruit, image };
}

export function buildFruitSelector(definitions = FRUITS, randomFn = Math.random) {
  if (!Array.isArray(definitions) || definitions.length === 0) {
    throw new Error('Fruit definitions must be a non-empty array.');
  }

  const fruitsWithAssets = definitions.map((fruit) => attachImageAsset({ ...fruit }));
  let lastFruitName = null;

  function pickNext() {
    const pool =
      fruitsWithAssets.length > 1 && lastFruitName
        ? fruitsWithAssets.filter((fruit) => fruit.name !== lastFruitName)
        : fruitsWithAssets;

    const boundedRandom = clampRandomValue(randomFn());
    const index = Math.floor(boundedRandom * pool.length);
    const selected = pool[index];
    lastFruitName = selected.name;
    return selected;
  }

  return {
    definitions: fruitsWithAssets,
    pickNext,
  };
}
