import { makeRequest } from './makeRequest'
import { oAuthUrl } from './auth'
import { oAuthInfoGenius } from './config'

export const geniusAuthUrl = oAuthUrl(oAuthInfoGenius);

export const lyricsLinkFromGeniusResponse = (rawResponse) => {
  try {
    const parsed = JSON.parse(rawResponse);
    if (parsed && parsed.response && parsed.response.hits) {
      const first = parsed.response.hits[0];
      if (first && first.result) {
        return first.result.url;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return 'Genius response parse error';
}
  
export const getLyricsForSong = (access_token, searchQuery) => {
  const geniusApiUrl = `https://api.genius.com/search?q=${searchQuery}&access_token=${access_token}`;
  const headers = {
    'Accept': 'application/json',
  };
  return makeRequest(geniusApiUrl, 'GET', headers);
}