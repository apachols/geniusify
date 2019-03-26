import React, { Component } from 'react';

import { getAuthInfoFromHash } from './auth'

export const GeniusContext = React.createContext('genius');
export class GeniusProvider extends Component {
  state = { access_token: null };

  setAccessToken(access_token) {
    this.setState({ access_token });
  }

  componentDidMount() {
    const localGeniusToken = window.localStorage.getItem('genius');
    if (localGeniusToken) {
      const { access_token } = JSON.parse(localGeniusToken);
      this.setState({ access_token }); 
    }

    if (window.location.pathname === '/genius') {
      const { access_token } = getAuthInfoFromHash(window.location.href);
      this.setState({ access_token });
      window.localStorage.setItem('genius', JSON.stringify({ access_token }));
      window.history.pushState({}, 'Geniusify', '/');
    }
    if (window.location.pathname === '/logout/genius') {
      this.setState({ access_token: null });
      window.localStorage.removeItem('genius');
      window.history.pushState({}, 'Geniusify', '/');
    }
  }

  render() {
    const { access_token } = this.state;
    return (
      <GeniusContext.Provider value={{
        geniusAccessToken: access_token
      }}>
        {this.props.children}
      </GeniusContext.Provider>
    )
  }
}

export const Genius = (props) => (
    <GeniusContext.Consumer>
        {({geniusAccessToken}) => props.children(geniusAccessToken)}
    </GeniusContext.Consumer>
)