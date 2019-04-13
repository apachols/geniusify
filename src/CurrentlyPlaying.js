import React, { Fragment, useState, useEffect } from 'react';

import { parseSpotifyResponse, getCurrentlyPlaying } from './spotify.api'

import { Spotify } from './Spotify';

export const CurrentlyPlaying = (props) => (
  <Spotify>
    {spotifyAccessToken => <CurrentlyPlayingInner spotifyAccessToken={spotifyAccessToken} {...props} />}
  </Spotify>
)

export const CurrentlyPlayingInner = (props) => {
  const { spotifyAccessToken } = props;
  const [ currentlyPlaying, setCurrentlyPlaying ] = useState('');
  const [ dirty, setDirty ] = useState(true);

  useEffect(() => {
    if (spotifyAccessToken && dirty) {
      getCurrentlyPlaying(spotifyAccessToken).then(({ response }) => {
        const { songNameWithArtist, isPlaying, songDuration, songTime } = parseSpotifyResponse(response);
        setCurrentlyPlaying(songNameWithArtist);
        if (isPlaying) {
          setTimeout(() => {
            setDirty(true);
          }, songDuration - songTime);  
        }
        setDirty(false);
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
      <h4>{currentlyPlaying}</h4>
      {props.children(currentlyPlaying)}
    </Fragment>
  )
}