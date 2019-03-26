import React, { Fragment, useState, useEffect } from 'react';

import { songNameFromSpotifyResponse, getCurrentlyPlaying } from './spotify.api'

import { Spotify } from './Spotify';

export const CurrentlyPlaying = (props) => (
  <Spotify>
    {spotifyAccessToken => <CurrentlyPlayingInner spotifyAccessToken={spotifyAccessToken} {...props} />}
  </Spotify>
)

export const CurrentlyPlayingInner = (props) => {
  const { spotifyAccessToken } = props;
  const [currentlyPlaying, setCurrentlyPlaying] = useState('Never Gonna Give You Up');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty) {
      if (!spotifyAccessToken) {
        throw new Error('Missing Spotify Access Token');
      }
      getCurrentlyPlaying(spotifyAccessToken).then(({ response }) => {
        const songName = songNameFromSpotifyResponse(response);
        setCurrentlyPlaying(songName);
        setDirty(false);
      })
      .catch((err) => {
        if (err.status === 401) {
          window.location.href = '/logout/spotify';
        }
      });  
    }
  }, [dirty]);

  return (
    <Fragment>
      <div>
          <button onClick={() => setDirty(true)} type='button'>
            What song is playing?
          </button>
      </div>
      <h4>{currentlyPlaying}</h4>
      {props.children(currentlyPlaying)}
    </Fragment>
  )
}