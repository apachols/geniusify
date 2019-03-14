import React, { Component } from 'react';

import './App.css';
import spotifyLogo from './spotify.png';
import geniusLogo from './genius.png';

import { getAuthInfoFromHash } from './auth'

import { spotifyAuthUrl } from './spotify'
import { geniusAuthUrl } from './genius'

import { CurrentlyPlaying }  from './CurrentlyPlaying'
import { Lyrics }  from './Lyrics'

class App extends Component {
  state = {
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

    const urlParts = window.location.href.split('#');
    const hash = urlParts[1] ? urlParts[1] : null;
    if (hash) {
      const { access_token } = getAuthInfoFromHash(hash);
      switch (window.location.pathname) {
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

  render() {
    const { spotify, genius } = this.state;

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
            <CurrentlyPlaying access_token={spotify.access_token}>
              {currentlyPlaying => (
                <Lyrics access_token={genius.access_token} currentlyPlaying={currentlyPlaying}/>
              )}
            </CurrentlyPlaying>
        </header>
      </div>
    );
  }
}

export default App;
