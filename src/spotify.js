import { makeRequest } from './makeRequest'
import { oAuthUrl } from './auth'
import { oAuthInfoSpotify } from './config'

export const spotifyAuthUrl = oAuthUrl(oAuthInfoSpotify);

export const songNameFromSpotifyResponse = (rawResponse) => {
  try {
    const parsed = JSON.parse(rawResponse);
    if (parsed && parsed.item) {
      return parsed.item.name;
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