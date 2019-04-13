import { makeRequest } from './makeRequest'
import { oAuthUrl } from './auth'
import { oAuthInfoSpotify } from './config'

export const spotifyAuthUrl = oAuthUrl(oAuthInfoSpotify);

const pickSpotifyResponseFields = (data) => {
  const fields = {};
  if (!data || !data.item) {
    throw new Error('Spotify malformed response');
  }
  fields.songName = data.item.name;
  if (data.item.artists && data.item.artists[0]) {
    fields.artistName = data.item.artists[0].name;
  } else {
    fields.artistName = '';
  }
  fields.songNameWithArtist = `${fields.songName} - ${fields.artistName}`;
  fields.songDuration = data.item.duration_ms;
  fields.songTime = data.progress_ms;
  fields.isPlaying = data.is_playing;
  return fields;
}

export const parseSpotifyResponse = (rawResponse) => {
  try {
    const data = JSON.parse(rawResponse);
    return pickSpotifyResponseFields(data);  
  } catch (err) {
    console.log(err);
  }
  return {};
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