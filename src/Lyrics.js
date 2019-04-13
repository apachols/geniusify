import React, { Fragment, useState, useEffect } from 'react';

import { lyricsLinkFromGeniusResponse, getLyricsForSong } from './genius.api'

import { Genius } from './Genius';

export const Lyrics = (props) => (
  <Genius>
    {geniusAccessToken => <LyricsInner geniusAccessToken={geniusAccessToken} {...props} />}
  </Genius>
)

export const LyricsInner = (props) => {
  const { geniusAccessToken, currentlyPlaying } = props;
  const { blerk, setBlerk } = useState(false);
  const [ enabled, setEnabled ] = useState(false);
  
  useEffect(() => {
    if (enabled) {
      if (!geniusAccessToken) {
        throw new Error('Missing Genius Access Token');
      }
      getLyricsForSong(geniusAccessToken, currentlyPlaying).then(({ response }) => {
        const lyricsLink = lyricsLinkFromGeniusResponse(response);
        if (blerk) {
          blerk.location.href = lyricsLink; 
        } else {
          const returnValue = window.open(lyricsLink);
          setBlerk(returnValue);
        }
        setEnabled(false);
      }).catch((err) => {
        if (err.status === 401) {
          window.location.href = '/logout/genius';
        }
      });  
    }
  }, [geniusAccessToken, blerk, setBlerk, currentlyPlaying, enabled]);
  
  return (
    <Fragment>
      {!enabled ? (
        <div>
          <button onClick={() => setEnabled(true)} type='button'>
            What are the lyrics?
          </button>
        </div>
      ) : (
        <button onClick={() => setEnabled(false)} type='button'>
          Disable
        </button>
      )}
    </Fragment>
  )
}