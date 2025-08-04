
const xss = require('xss');

module.exports = (req, res, next) => {

 
for (const key in req.body) {
  if (typeof req.body[key] === 'string') {
    req.body[key] = xss(req.body[key]);
  }
}
  next();
};
