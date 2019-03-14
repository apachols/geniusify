import React, { Component } from 'react';

import './App.css';
import spotifyLogo from './spotify.png';
import geniusLogo from './genius.png';

import { getAuthInfoFromHash } from './auth'

import { spotifyAuthUrl, songNameFromSpotifyResponse, getCurrentlyPlaying } from './spotify'
import { geniusAuthUrl, lyricsLinkFromGeniusResponse, getLyricsForSong } from './genius'

class App extends Component {
  state = {
    currentlyPlaying: 'Never Gonna Give You Up',
    lyricsLink: 'https://genius.com/Rick-astley-never-gonna-give-you-up-lyrics',
    spotify: {
      access_token: null
    },
    genius: {
      access_token: null
    }
  };

  componentDidMount() {
    const localSpotifyToken = window.localStorage.getItem('spotify');
    if (localSpotifyToken) {
      const spotify = JSON.parse(localSpotifyToken);
      this.setState({ spotify }); 
    }

    const localGeniusToken = window.localStorage.getItem('genius');
    if (localGeniusToken) {
      const genius = JSON.parse(localGeniusToken);
      this.setState({ genius }); 
    }

    // "router.js" AKA component did mount App
    const urlParts = window.location.href.split('#');
    const hash = urlParts[1] ? urlParts[1] : null;
    if (hash) {
      const { access_token } = getAuthInfoFromHash(hash);
      switch (window.location.pathname) {
        // token.js
        case '/spotify':
          this.setState({ spotify: { access_token } });
          window.localStorage.setItem('spotify', JSON.stringify({ access_token }));
          break;
        case '/genius':
          this.setState({ genius: { access_token } });
          window.localStorage.setItem('genius', JSON.stringify({ access_token }));
          break;
        default:
          throw new Error('Hash without oauth path');
      }
      window.history.pushState({}, 'Geniusify', '/');
    }
  }

  setCurrentlyPlaying = () => {
    const { access_token } = this.state.spotify; 
    getCurrentlyPlaying(access_token).then(({ response }) => {
      const currentlyPlaying = songNameFromSpotifyResponse(response);
      this.setState({ currentlyPlaying });
    });
  };

  setLyricsLink = () => {
    const { currentlyPlaying } = this.state;
    const { access_token } = this.state.genius;
    getLyricsForSong(access_token, currentlyPlaying).then(({ response }) => {
      const lyricsLink = lyricsLinkFromGeniusResponse(response);
      this.setState({ lyricsLink });
    });
  };

  render() {
    const {currentlyPlaying, lyricsLink, spotify, genius} = this.state;

    console.log('spotify', spotify);
    console.log('genius', genius);

    return (
      <div className="App">
        <header className="App-header">
          <div>
            <img src={spotifyLogo} className="App-logo" alt="spotify" />
            <img src={geniusLogo} className="App-logo" alt="genius" />
            {!spotify.access_token && (
              <div>
                <a className="App-link" href={spotifyAuthUrl}>Log In To Spotify</a>
              </div>
            )}
            {!genius.access_token && (
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
