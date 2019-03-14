import React, { Fragment, useState, useEffect } from 'react';

import { songNameFromSpotifyResponse, getCurrentlyPlaying } from './spotify'

export const CurrentlyPlaying = (props) => {
  const { access_token } = props;
  const [currentlyPlaying, setCurrentlyPlaying] = useState('Never Gonna Give You Up');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty) {
      getCurrentlyPlaying(access_token).then(({ response }) => {
        const songName = songNameFromSpotifyResponse(response);
        setCurrentlyPlaying(songName);
        setDirty(false);
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