export const oAuthInfoSpotify = {
    baseUrl: 'https://accounts.spotify.com/authorize',
    clientId: `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`,
    redirectUri: `${process.env.REACT_APP_SPOTIFY_REDIRECT_URI}`,
    scope: 'user-read-playback-state',
    extra: 'response_type=token&state=123'
};
  
export const oAuthInfoGenius = {
    baseUrl: 'https://api.genius.com/oauth/authorize',
    clientId: `${process.env.REACT_APP_GENIUS_CLIENT_ID}`,
    redirectUri: `${process.env.REACT_APP_GENIUS_REDIRECT_URI}`,
    scope: 'me',
    extra: 'response_type=token&state=123',
};
