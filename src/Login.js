import React from 'react';

import spotifyLogo from './spotify.png';
import geniusLogo from './genius.png';

import { spotifyAuthUrl } from './spotify.api';
import { geniusAuthUrl } from './genius.api';

import { Spotify } from './Spotify';
import { Genius } from './Genius';

export const Login = () => {
  const spotifyLogin = <div>
    <a className="App-link" href={spotifyAuthUrl}>Log In To Spotify</a>
  </div>;

  const spotifyLogout = <div>
    <a className="App-link" href="/logout/spotify">Log Out of Spotify</a>
  </div>;

  const geniusLogin = <div>
    <a className="App-link" href={geniusAuthUrl}>Log In To Genius</a>
  </div>;

  const geniusLogout = <div>
    <a className="App-link" href="/logout/genius">Log Out of Genius</a>
  </div>;

  return <div>
    <img src={spotifyLogo} className="App-logo" alt="spotify" />
    <img src={geniusLogo} className="App-logo" alt="genius" />
    <Spotify>
      {spotifyAccessToken => !spotifyAccessToken ? spotifyLogin : spotifyLogout}
    </Spotify>
    <Genius>
     {geniusAccessToken => !geniusAccessToken ? geniusLogin : geniusLogout}
    </Genius>
  </div>;
}