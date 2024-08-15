const jwt = require('jsonwebtoken');

export function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

export function authenticateToken(token) {
    //const authHeader = req.headers['authorization']
    //const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return null;//res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET , (err, user) => {
      console.log(err)

      if (err) return false;

      //req.user = username
      //next()
      return true
      })
}

