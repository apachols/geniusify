import React, { Component } from 'react';

import './App.css';
import spotifyLogo from './spotify.png';
import geniusLogo from './genius.png';

import { getAuthInfoFromHash } from './auth'

import { spotifyAuthUrl } from './spotify'
import { geniusAuthUrl } from './genius'

import { CurrentlyPlaying }  from './CurrentlyPlaying'
import { Lyrics }  from './Lyrics'

const SpotifyContext = React.createContext('spotify');
class SpotifyProvider extends React.Component {
  state = { access_token: null };

  setAccessToken(access_token) {
    this.setState({ access_token });
  }

  componentDidMount() {
    const localSpotifyToken = window.localStorage.getItem('spotify');
    if (localSpotifyToken) {
      const { access_token } = JSON.parse(localSpotifyToken);
      this.setState({ access_token }); 
    }

    const urlParts = window.location.href.split('#');
    const hash = urlParts[1] ? urlParts[1] : null;
    if (hash && window.location.pathname === '/spotify') {
      const { access_token } = getAuthInfoFromHash(hash);
      this.setState({ access_token });
      window.localStorage.setItem('spotify', JSON.stringify({ access_token }));
      window.history.pushState({}, 'Geniusify', '/');
    }
  }

  render() {
    const { access_token } = this.state;
    return (
      <SpotifyContext.Provider value={{
        spotifyAccessToken: access_token
      }}>
        {this.props.children}
      </SpotifyContext.Provider>
    )
  }
}

class App extends Component {
  state = {
    genius: {
      access_token: null
    }
  };

  componentDidMount() {
    const localGeniusToken = window.localStorage.getItem('genius');
    if (localGeniusToken) {
      const genius = JSON.parse(localGeniusToken);
      this.setState({ genius }); 
    }

    const urlParts = window.location.href.split('#');
    const hash = urlParts[1] ? urlParts[1] : null;
    if (hash && window.location.pathname === '/genius') {
      const { access_token } = getAuthInfoFromHash(hash);
      this.setState({ genius: { access_token } });
      window.localStorage.setItem('genius', JSON.stringify({ access_token }));
      window.history.pushState({}, 'Geniusify', '/');
    }
  }

  render() {
    const { genius } = this.state;
    console.log('genius', genius);

    return (
      <div className="App">
        <header className="App-header">
          <SpotifyProvider>
              <SpotifyContext.Consumer>
              {({spotifyAccessToken}) => <div>
                <h1>Geniusify</h1>
                <div>
                  <img src={spotifyLogo} className="App-logo" alt="spotify" />
                  <img src={geniusLogo} className="App-logo" alt="genius" />
                  {!spotifyAccessToken && (
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
                <br></br>
                <CurrentlyPlaying access_token={spotifyAccessToken}>
                  {currentlyPlaying => (
                    <Lyrics access_token={genius.access_token} currentlyPlaying={currentlyPlaying}/>
                  )}
                </CurrentlyPlaying>
              </div>
            }
            </SpotifyContext.Consumer>
          </SpotifyProvider>
        </header>
      </div>
    );
  }
}

export default App;
