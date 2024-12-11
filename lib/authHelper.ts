import jwt from 'jsonwebtoken';

let publicKeys: any = [];

async function refreshPublicKeys() {
  console.log('refresh publish keys is called');
  const res = await fetch(
    'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
  );

  const response = await res.json();
  // console.log(response);
  publicKeys = response;
  // refresh _publicKeys after ⁠ max-age ⁠ seconds
  const cacheControl = res.headers.get('cache-control');
  const matches = cacheControl?.match(/max-age=(\d+)/);
  const maxAge = matches ? parseInt(matches[1] ?? '', 10) : -1;
  if (maxAge) setTimeout(refreshPublicKeys, maxAge * 1000);
}

async function decodeToken(token = '') {
  try {
    const header64 = token.split('.')[0] ?? '';
    const header = JSON.parse(
      Buffer.from(header64, 'base64').toString('ascii')
    );
    if (!header.kid) return null;
    if (!publicKeys[header.kid]) await refreshPublicKeys();
    const decodedToken = jwt.verify(token, publicKeys[header.kid], {
      algorithms: ['RS256']
    });
    return decodedToken as jwt.JwtPayload;
  } catch (e) {
    // TOKEN EXPIRED ERROR
    // console.log(e)
  }
  return null;
}

export const fetchUserFromToken = async (authToken: string) => {
  if (!authToken) return null;
  const user = await decodeToken(authToken);

  if (user && user?.aud !== (process.env.PROJECT_ID || 'zingprod-83388'))
    return null;
  return user;
};
