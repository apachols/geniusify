import React, { Component } from 'react';

import { getAuthInfoFromHash } from './auth'

export const SpotifyContext = React.createContext('spotify');
export class SpotifyProvider extends Component {
  state = { access_token: null };

  setAccessToken(access_token) {
    this.setState({ access_token });
  }

  componentDidMount() {
    const localSpotifyToken = window.localStorage.getItem('spotify');
    if (localSpotifyToken) {
      const { access_token } = JSON.parse(localSpotifyToken);
      this.setState({ access_token }); 
    }

    if (window.location.pathname === '/spotify') {
      const { access_token } = getAuthInfoFromHash(window.location.href);
      this.setState({ access_token });
      window.localStorage.setItem('spotify', JSON.stringify({ access_token }));
      window.history.pushState({}, 'Geniusify', '/');
    }
    if (window.location.pathname === '/logout/spotify') {
      this.setState({ access_token: null });
      window.localStorage.removeItem('spotify');
      window.history.pushState({}, 'Geniusify', '/');
    }
  }

  render() {
    const { access_token } = this.state;
    return (
      <SpotifyContext.Provider value={{
        spotifyAccessToken: access_token
      }}>
        {this.props.children}
      </SpotifyContext.Provider>
    )
  }
}

export const Spotify = (props) => (
  <SpotifyContext.Consumer>
    {({spotifyAccessToken}) => {
      console.log('hi', spotifyAccessToken);
      return props.children(spotifyAccessToken)
    }}
  </SpotifyContext.Consumer>
)