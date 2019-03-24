import React from 'react';

import spotifyLogo from './spotify.png';
import geniusLogo from './genius.png';

import { spotifyAuthUrl } from './spotify.api';
import { geniusAuthUrl } from './genius.api';

import { Spotify } from './Spotify';
import { Genius } from './Genius';

export const Login = () => {
  return <div>
    <img src={spotifyLogo} className="App-logo" alt="spotify" />
    <img src={geniusLogo} className="App-logo" alt="genius" />
    <Spotify>
      {spotifyAccessToken => !spotifyAccessToken && (
        <div>
          <a className="App-link" href={spotifyAuthUrl}>Log In To Spotify</a>
        </div>
      )}
    </Spotify>
    <Genius>
      {geniusAccessToken => !geniusAccessToken && (
        <div>
          <a className="App-link" href={geniusAuthUrl}>Log In To Genius</a>
        </div>
      )}
    </Genius>
  </div>;
}