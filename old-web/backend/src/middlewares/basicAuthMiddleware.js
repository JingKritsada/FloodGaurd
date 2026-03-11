const auth = require('basic-auth');
const path = require('path');

const basicAuth = (req, res, next) => {
  // Some proxies (or load balancers) strip the `Authorization` header and
  // forward it in `x-forwarded-authorization`. If that's the case, copy it
  // back to `authorization` so `basic-auth` can parse it.
  if (!req.headers.authorization && req.headers['x-forwarded-authorization']) {
    req.headers.authorization = req.headers['x-forwarded-authorization'];
  }

  const user = auth(req);
  const username = process.env.BASICAUTHUSER;
  const password = process.env.BASICAUTHPASS;

  if (user && user.name === username && user.pass === password) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="example"');
  res.status(401).sendFile(path.join(__dirname, '../public/html/unAuth.html'));
};

module.exports = basicAuth;