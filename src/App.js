import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const oAuthInfoSpotify = {
  baseUrl: 'https://accounts.spotify.com/authorize',
  clientId: '6746d825f4ff401495e2fe7858a31294',
  redirectUri: 'http:%2F%2Flocalhost:3000',
  scope: 'user-read-playback-state',
  extra: 'response_type=token&state=123'
};

const oAuthInfoGenius = {
  baseUrl: 'https://api.genius.com/oauth/authorize',
  clientId: 'ckMjotp2COVxXXl1rVNTnW5iTrxHvTkt-aJTI99aVXmHNWrnak9fVNURKfrix-Nt',
  redirectUri: 'http:%2F%2Flocalhost:3000',
  scope: 'me',
  extra: 'response_type=token&state=123',
};

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

const urlParts = window.location.href.split('#');
const hash = urlParts[1] ? urlParts[1] : null;
if (hash) {
  const { access_token } = getAuthInfoFromHash(hash);
  window.access_token = access_token;
  window.history.pushState({}, 'Geniusify', '/');
} else {
  console.log('Auth not ready, no hash');
}

const xhrGetRequest = function(url, headers, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
  });

  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
          callback(xhr.response);
      }
  }
  xhr.send(null);
  return xhr;
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
      'Authorization': `Bearer ${window.access_token}`
  };
  xhrGetRequest(spotifyApiUrl, headers, (response) => {
      console.log(response);
      window.currentlyPlaying = songNameFromSpotifyResponse(response);
  });
}

const getLyricsForSong = (searchQuery) => () => {
  const geniusApiUrl = `https://api.genius.com/search?q=${searchQuery}&access_token=${window.access_token}`;
  const headers = {
      'Accept': 'application/json',
  };
  xhrGetRequest(geniusApiUrl, headers, (response) => {
      console.log(response);
      window.lyricsLink = lyricsLinkFromGeniusResponse(response);
  });
}

window.currentlyPlaying = 'Never Gonna Give You Up';
window.lyricsLink = '/';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Geniusify</h1>
            <div>
                <a href={spotifyAuthUrl}>Log In To Spotify</a>
            </div>
            <div>
              <a href={geniusAuthUrl}>Log In To Genius</a>
            </div>
            <div>
                <button onClick={getCurrentlyPlaying} type='button'>
                  What song is playing?
                </button>
            </div>
            <h4>{window.currentlyPlaying}</h4>
            <div>
                <button onClick={getLyricsForSong(window.currentlyPlaying)} type='button'>
                  What are the lyrics?
                </button>
            </div>
            <h4>{window.lyricsLink}</h4>
        </header>
      </div>
    );
  }
}

export default App;
