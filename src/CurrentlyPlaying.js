import React, { Fragment, useState, useEffect } from 'react';

import spotifyLogo from './spotify.png';

import { spotifyAuthUrl } from './spotify.api';

import { parseSpotifyResponse, getCurrentlyPlaying } from './spotify.api'

import { Spotify } from './Spotify';

export const CurrentlyPlaying = (props) => (
  <Spotify>
    {spotifyAccessToken => <CurrentlyPlayingInner spotifyAccessToken={spotifyAccessToken} {...props} />}
  </Spotify>
)

export const CurrentlyPlayingInner = (props) => {
  const { spotifyAccessToken } = props;
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState({});
  const [ dirty, setDirty ] = useState(true);

  const { songNameWithArtist, songName, artistName } = currentlyPlaying;
  
  useEffect(() => {
    if (spotifyAccessToken && dirty) {
      getCurrentlyPlaying(spotifyAccessToken).then(({ response }) => {
        const currentlyPlaying = parseSpotifyResponse(response);
        setCurrentlyPlaying(currentlyPlaying);
        setDirty(false);
        // When this song is done get the next song
        const { isPlaying, songDuration, songTime } = currentlyPlaying;
        if (isPlaying) {
          setTimeout(() => setDirty(true), songDuration - songTime);  
        }
      })
      .catch((err) => {
        if (err.status === 401) {
          window.location.href = '/logout/spotify';
        }
      });  
    }
  }, [spotifyAccessToken, dirty]);

  return (
    <Fragment>
      <div className="App-section" onClick={() => setDirty(true)}>
        <div className="Section-logo-container">
          <img src={spotifyLogo} className="Section-logo" alt="spotify"/>
        </div>
        <div className="Section-content-container">
          {!spotifyAccessToken ? (
            <div className='Section-login-link'>
              <a className="App-link" href={spotifyAuthUrl}>Log In To Spotify</a>
            </div>
          ) : (
            <div className="Section-content">
              <h3>{artistName}</h3>
              <h4>{songName}</h4>
            </div>
          )}
        </div>
      </div>
      {props.children(songNameWithArtist)}
    </Fragment>
  )
}