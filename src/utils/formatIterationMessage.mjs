export const formatIterationMessage = (index, maxResults, maxTweets) => {
  const tweetsFetched = index * maxResults;
  const tweetsLeft = maxTweets - tweetsFetched;

  const indexPart = `Index: ${String(index).padStart(2, '0')}`;
  const fetchedPart = `Tweets fetched: ${String(tweetsFetched).padStart(
    4,
    '0',
  )}/${maxTweets}`;
  const leftPart = `Tweets left: ${String(tweetsLeft).padStart(4, '0')}`;

  return `${indexPart} | ${fetchedPart} | ${leftPart}`;
};
