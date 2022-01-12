import qs from 'query-string';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'node:fs/promises';
import JSONstringify from 'json-stable-stringify';

import {
  tweetFields,
  mediaFields,
  expansions,
  placeFields,
  pollFields,
  userFields,
} from './utils/parameters.mjs';
import { loadMeta, writeMeta } from './utils/meta.mjs';
import { formatIterationMessage } from './utils/formatIterationMessage.mjs';

dotenv.config();

const { BEARER_TOKEN, USER_ID } = process.env;
const MAX_RETIRES = 10;
const MAX_TWEETS_THAT_CAN_BE_FETCHED = 3200;
const MAX_RESULTS = 100;

const baseUrl = `https://api.twitter.com/2/users/${USER_ID}/tweets`;
const queryStringOptions = { arrayFormat: 'comma' };

let { index, nextToken } = await loadMeta();
let retriesMade = 0;

do {
  retriesMade++;
  console.log(
    formatIterationMessage(index, MAX_RESULTS, MAX_TWEETS_THAT_CAN_BE_FETCHED),
  );

  const queryStringFields = {
    max_results: MAX_RESULTS,
    'tweet.fields': tweetFields,
    'media.fields': mediaFields,
    expansions: expansions,
    'place.fields': placeFields,
    'poll.fields': pollFields,
    'user.fields': userFields,
    pagination_token: nextToken,
  };
  const queryString = qs.stringify(queryStringFields, queryStringOptions);
  const url = `${baseUrl}?${queryString}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });

  const result = await response.json();
  const newNextToken = result.meta.next_token;

  if (newNextToken === undefined) {
    continue;
  }

  try {
    await fs.writeFile(`./data/raw/${index}.json`, JSONstringify(result));

    nextToken = result.meta.next_token;
    index++;
    await writeMeta(index, nextToken);
    retriesMade = 0;
  } catch (error) {
    console.log(result);
  }
} while (
  index * MAX_RESULTS < MAX_TWEETS_THAT_CAN_BE_FETCHED ||
  retriesMade > MAX_RETIRES
);

console.log('All tweets were fetched!');
