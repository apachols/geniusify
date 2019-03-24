import React, { Fragment, useState, useEffect } from 'react';

import { lyricsLinkFromGeniusResponse, getLyricsForSong } from './genius.api'

export const Lyrics = (props) => {
  const { access_token, currentlyPlaying } = props;
  const [lyricsLink, setLyricsLink] = useState('https://genius.com/Rick-astley-never-gonna-give-you-up-lyrics');
  const [dirty, setDirty] = useState(false);
  
  useEffect(() => {
    if (dirty) {
      getLyricsForSong(access_token, currentlyPlaying).then(({ response }) => {
        const lyricsLink = lyricsLinkFromGeniusResponse(response);
        setLyricsLink(lyricsLink);
        setDirty(false);
      });
    }
  }, [dirty]);
  
  return (
    <Fragment>
    <div>
      <button onClick={() => setDirty(true)} type='button'>
        What are the lyrics?
      </button>
    </div>
    <h4>{lyricsLink}</h4>
    </Fragment>
  )
}