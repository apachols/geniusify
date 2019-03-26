import { makeRequest } from './makeRequest'
import { oAuthUrl } from './auth'
import { oAuthInfoSpotify } from './config'

export const spotifyAuthUrl = oAuthUrl(oAuthInfoSpotify);

export const songNameFromSpotifyResponse = (rawResponse) => {
  try {
    const data = JSON.parse(rawResponse);
    const parts = [];
    if (data) {
      if (data.item) {
        parts.unshift(data.item.name);
        if (data.item.artists && data.item.artists[0]) {
          parts.unshift(data.item.artists[0].name);
          return parts.join(' - ');
        }
        return parts.pop();
      }
    }
  } catch (err) {
    console.log(err);
  }
  return 'Spotify response parse error';
}

export const getCurrentlyPlaying = (access_token) => {
  const spotifyApiUrl = 'https://api.spotify.com/v1/me/player/currently-playing?market=US';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  };
  return makeRequest(spotifyApiUrl, 'GET', headers)
}