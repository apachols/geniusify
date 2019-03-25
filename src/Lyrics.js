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
  const [lyricsLink, setLyricsLink] = useState('https://genius.com/Rick-astley-never-gonna-give-you-up-lyrics');
  const [dirty, setDirty] = useState(false);
  
  useEffect(() => {
    if (dirty) {
      if (!geniusAccessToken) {
        throw new Error('Missing Genius Access Token');
      }
      getLyricsForSong(geniusAccessToken, currentlyPlaying).then(({ response }) => {
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
    <a href={lyricsLink} target="_blank">{currentlyPlaying}</a>
    </Fragment>
  )
}