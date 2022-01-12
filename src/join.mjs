import fs from 'node:fs/promises';
import stringify from 'json-stable-stringify';

const FILES_COUNT = 32;

const filesContentsPromises = Array.from({ length: FILES_COUNT }).map(
  async (_, fileIndex) => {
    const rawData = await fs.readFile(`./data/raw/${fileIndex}.json`, {
      encoding: 'utf8',
    });

    const data = JSON.parse(rawData);

    return data;
  },
);

const filesContents = await Promise.all(filesContentsPromises);

const combined = filesContents.reduce((acc, { data }) => [...acc, ...data], []);

await fs.writeFile(
  './data/combined/combined-excerpt.json',
  stringify(combined.slice(0, 5), { space: 2 }),
);

await fs.writeFile('./data/combined/combined.json', stringify(combined));
