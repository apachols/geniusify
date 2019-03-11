export default (url, method, headers) => {
  var request = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    request.onreadystatechange = () => {
      // Only run if the request is complete
      if (request.readyState !== 4) {
        return;
      }
      // Resolve if OK, else reject
      if (request.status >= 200 && request.status < 300) {
        resolve(request);
      } else {
        reject({
          status: request.status,
          statusText: request.statusText
        });
      }
    };

    request.open(method || 'GET', url, true);

    // Add request headers
    Object.entries(headers).forEach(([key, value]) => {
      request.setRequestHeader(key, value);
    });

    request.send();
  });
};
