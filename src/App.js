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
          <h1>Geniusify</h1>
        </header>
        <div className="App-body">
          <SpotifyProvider>
            <GeniusProvider>
              <div>
                <CurrentlyPlaying>
                  {currentlyPlaying => <Lyrics currentlyPlaying={currentlyPlaying}/>}
                </CurrentlyPlaying>
              </div>
            </GeniusProvider>
          </SpotifyProvider>
          <br/>
          <div className="Footer">
            <Login/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
