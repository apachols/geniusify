import React, { Component } from 'react';

import './App.css';

import { SpotifyProvider } from './Spotify';
import { GeniusProvider } from './Genius';
import { Login } from './Login';

import { CurrentlyPlaying }  from './CurrentlyPlaying';
import { Lyrics }  from './Lyrics';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SpotifyProvider>
            <GeniusProvider>
              <h1>Geniusify</h1>

              <Login/>

              <CurrentlyPlaying>
                {currentlyPlaying => <Lyrics currentlyPlaying={currentlyPlaying}/>}
              </CurrentlyPlaying>

            </GeniusProvider>
          </SpotifyProvider>
          <br/>
          <br/>
        </header>
      </div>
    );
  }
}

export default App;
