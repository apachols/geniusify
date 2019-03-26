export const oAuthUrl = (oAuthInfo) => {
  const {baseUrl, clientId, redirectUri, scope, extra} = oAuthInfo;
  return `${baseUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&${extra}`;
}

export const getAuthInfoFromHash = (href) => {
  const urlParts = href.split('#');
  const hash = urlParts[1] ? urlParts[1] : null;
  if (!hash) {
      return {};
  }
  const pairs = hash.split('&');
  const result = {};
  pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return JSON.parse(JSON.stringify(result));
}
