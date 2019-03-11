import React, { Component } from 'react';
import spotify from './spotify.png';
import genius from './genius.png';
import './App.css';
import makeRequest from './makeRequest'

import { oAuthInfoSpotify, oAuthInfoGenius } from './config.js'

const oAuthUrl = (oAuthInfo) => {
  const {baseUrl, clientId, redirectUri, scope, extra} = oAuthInfo;
  return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&${extra}`;
}

const spotifyAuthUrl = oAuthUrl(oAuthInfoSpotify);
const geniusAuthUrl = oAuthUrl(oAuthInfoGenius);

const getAuthInfoFromHash = (hash) => {
  if (!hash) {
      return {};
  }
  const pairs = hash.split('&');
  const result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return JSON.parse(JSON.stringify(result));
}

const localSpotifyToken = window.localStorage.getItem('spotify');
if (localSpotifyToken) {
  window.spotify = JSON.parse(localSpotifyToken);
}

const localGeniusToken = window.localStorage.getItem('genius');
if (localGeniusToken) {
  window.genius = JSON.parse(localGeniusToken);
}

const urlParts = window.location.href.split('#');
const hash = urlParts[1] ? urlParts[1] : null;
if (hash) {
  const { access_token } = getAuthInfoFromHash(hash);
  switch (window.location.pathname) {
    case '/spotify':
      window.spotify = { access_token };
      window.localStorage.setItem('spotify', JSON.stringify(window.spotify));
      break;
    case '/genius':
      window.genius = { access_token };
      window.localStorage.setItem('genius', JSON.stringify(window.genius));
      break;
    default:
      throw new Error('Hash without oauth path');
  }
  window.history.pushState({}, 'Geniusify', '/');
} else {
  console.log('Auth not ready, no hash');
}

const songNameFromSpotifyResponse = (rawResponse) => {
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

const lyricsLinkFromGeniusResponse = (rawResponse) => {
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

const getCurrentlyPlaying = () => {
  const spotifyApiUrl = 'https://api.spotify.com/v1/me/player/currently-playing?market=US';
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${window.spotify.access_token}`
  };
  return makeRequest(spotifyApiUrl, 'GET', headers)
}

const getLyricsForSong = (searchQuery) => {
  const geniusApiUrl = `https://api.genius.com/search?q=${searchQuery}&access_token=${window.genius.access_token}`;
  const headers = {
      'Accept': 'application/json',
  };
  return makeRequest(geniusApiUrl, 'GET', headers);
}

class App extends Component {
  state = {
    currentlyPlaying: 'Never Gonna Give You Up',
    lyricsLink: 'https://genius.com/Rick-astley-never-gonna-give-you-up-lyrics'
  };

  setCurrentlyPlaying = () => {
    getCurrentlyPlaying().then(({ response }) => {
      const currentlyPlaying = songNameFromSpotifyResponse(response);
      this.setState(state => ({ ...state, currentlyPlaying }));
    });
  };

  setLyricsLink = () => {
    const { currentlyPlaying } = this.state;
    getLyricsForSong(currentlyPlaying).then(({ response }) => {
      const lyricsLink = lyricsLinkFromGeniusResponse(response);
      this.setState(state => ({ ...state, lyricsLink }));
    });
  };

  render() {
    const {currentlyPlaying, lyricsLink} = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <img src={spotify} className="App-logo" alt="spotify" />
            <img src={genius} className="App-logo" alt="genius" />
            {!(window.spotify && window.spotify.access_token) && (
              <div>
                <a className="App-link" href={spotifyAuthUrl}>Log In To Spotify</a>
              </div>
            )}
            {!(window.genius && window.genius.access_token) && (
              <div>
                <a className="App-link" href={geniusAuthUrl}>Log In To Genius</a>
              </div>
            )}
          </div>
          <h1>Geniusify</h1>
            <br></br>
            <div>
                <button onClick={this.setCurrentlyPlaying} type='button'>
                  What song is playing?
                </button>
            </div>
            <h4>{currentlyPlaying}</h4>
            <div>
                <button onClick={this.setLyricsLink} type='button'>
                  What are the lyrics?
                </button>
            </div>
            <h4>{lyricsLink}</h4>
        </header>
      </div>
    );
  }
}

export default App;
