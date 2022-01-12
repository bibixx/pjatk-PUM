import fs from 'node:fs/promises';

export const writeMeta = async (index, nextToken) => {
  const data = { index, nextToken };

  await fs.writeFile('./data/raw/meta.json', JSON.stringify(data, null, 2));
};

export const loadMeta = async () => {
  try {
    const rawData = await fs.readFile('./data/raw/meta.json', {
      encoding: 'utf8',
    });

    const data = JSON.parse(rawData);

    return data;
  } catch (error) {
    return { index: 0, nextToken: undefined };
  }
};
