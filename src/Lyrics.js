import React, { Fragment, useState, useEffect } from 'react';

import geniusLogo from './genius.png';

import { geniusAuthUrl } from './genius.api';

import { lyricsLinkFromGeniusResponse, getLyricsForSong } from './genius.api'

import { Genius } from './Genius';

export const Lyrics = (props) => (
  <Genius>
    {geniusAccessToken => <LyricsInner geniusAccessToken={geniusAccessToken} {...props} />}
  </Genius>
)

export const LyricsInner = (props) => {
  const { geniusAccessToken, currentlyPlaying } = props;
  const [ childWindow, setChildWindow ] = useState(false);
  const [ enabled, setEnabled ] = useState(false);
  
  useEffect(() => {
    if (enabled) {
      if (!geniusAccessToken) {
        throw new Error('Missing Genius Access Token');
      }
      getLyricsForSong(geniusAccessToken, currentlyPlaying).then(({ response }) => {
        const lyricsLink = lyricsLinkFromGeniusResponse(response);
        if (childWindow) {
          childWindow.location.href = lyricsLink; 
        } else {
          const returnValue = window.open(lyricsLink);
          setChildWindow(returnValue);
        }
      }).catch((err) => {
        if (err.status === 401) {
          window.location.href = '/logout/genius';
        }
      });  
    }
  }, [geniusAccessToken, childWindow, currentlyPlaying, enabled]);
  
  return (
    <Fragment> 
      <div className="App-section" onClick={() => setEnabled(true)}>
        <div className="Section-logo-container">
          <img src={geniusLogo} className="Section-logo" alt="genius"/>
        </div>
        <div className="Section-content-container">
          {!geniusAccessToken ? (
            <div className='Section-login-link'>
              <a className="App-link" href={geniusAuthUrl}>Log In To Genius</a>
            </div>
          ) : (
            <div className='Section-content'>
              {childWindow ? (
                <h4>Tracking Genius Lyrics</h4>
              ) : (
                <a href="/#" className="App-link">Open Lyrics Popup</a>
              )}
            </div>
          )}
        </div>
      </div>
    </Fragment>
  )
}