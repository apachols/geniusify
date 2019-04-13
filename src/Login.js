import React from 'react';

export const Login = () => {
  return <div className="Bottom-links">
    <div>
      <a className="App-link" href="/logout/spotify">Spotify&nbsp;Logout</a>
    </div>
    <div className="Bottom-links-spacer">
      {"-"}
    </div>
    <div>
      <a className="App-link" href="/logout/genius">Genius&nbsp;Logout</a>
    </div>
  </div>;
}